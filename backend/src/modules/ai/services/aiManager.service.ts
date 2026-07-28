import { ConversationSession } from '../models/ConversationSession';
import { ChatMessage, IAIStructuredResponse } from '../models/ChatMessage';
import { GeminiProvider } from '../providers/GeminiProvider';
import { aiContextService } from './aiContext.service';
import { AppError } from '../../../utils/AppError';
import { Types } from 'mongoose';

export class AIManagerService {
  private provider: GeminiProvider;

  constructor() {
    this.provider = new GeminiProvider();
  }

  /**
   * Initializes a new chat session
   */
  async createSession(userId: string, title?: string) {
    const session = await ConversationSession.create({
      userId,
      title: title || 'Career Consultation'
    });
    return session;
  }

  /**
   * Retrieves all sessions for a user
   */
  async getSessions(userId: string) {
    return await ConversationSession.find({ userId, status: 'ACTIVE' }).sort({ lastMessageAt: -1 });
  }

  /**
   * Retrieves history for a specific session
   */
  async getSessionHistory(userId: string, sessionId: string) {
    const session = await ConversationSession.findOne({ _id: sessionId, userId });
    if (!session) throw new AppError('Session not found', 404);

    return await ChatMessage.find({ sessionId }).sort({ createdAt: 1 });
  }

  /**
   * Main orchestration method: handles context gathering, provider calling, and DB persisting.
   */
  async processUserMessage(userId: string, sessionId: string, message: string): Promise<IAIStructuredResponse> {
    
    // 1. Validate Session
    const session = await ConversationSession.findOne({ _id: sessionId, userId, status: 'ACTIVE' });
    if (!session) throw new AppError('Active session not found', 404);

    // 2. Build massive system instruction
    const systemInstruction = await aiContextService.buildSystemInstruction(userId);

    // 3. Fetch past conversation history (Limit to last 10 messages to save tokens)
    const dbHistory = await ChatMessage.find({ sessionId }).sort({ createdAt: -1 }).limit(10);
    const historyPayload = dbHistory.reverse().map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user' as const,
      // If it was a model message, we serialize the structured data back into a string for context
      content: msg.role === 'model' && msg.structuredData 
        ? msg.structuredData.answer 
        : msg.content
    })) as import('../providers/IAIProvider').ChatMessagePayload[];

    // 4. Save user message to DB immediately
    await ChatMessage.create({
      sessionId: session._id,
      role: 'user',
      content: message
    });

    // 5. Call LLM Provider
    const response = await this.provider.generateResponse(systemInstruction, historyPayload, message);

    // 6. Save AI Response to DB
    const modelMessage = await ChatMessage.create({
      sessionId: session._id,
      role: 'model',
      content: response.structuredData.answer, // Fallback string representation
      structuredData: response.structuredData,
      tokenCount: response.tokenUsage.completionTokens
    });

    // 7. Update Session Tokens and Timestamp
    session.lastMessageAt = new Date();
    session.tokenUsage.promptTokens += response.tokenUsage.promptTokens;
    session.tokenUsage.completionTokens += response.tokenUsage.completionTokens;
    session.tokenUsage.totalTokens += response.tokenUsage.totalTokens;
    
    // Auto-generate title if this is the first exchange
    if (historyPayload.length === 0 && session.title === 'Career Consultation') {
      session.title = message.substring(0, 30) + '...';
    }

    await session.save();

    // 8. Return structured data to client
    return response.structuredData;
  }
}

export const aiManagerService = new AIManagerService();

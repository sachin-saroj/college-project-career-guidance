import { IAIStructuredResponse } from '../models/ChatMessage';

export interface ChatMessagePayload {
  role: 'user' | 'model' | 'system';
  content: string;
}

export interface AIResponse {
  structuredData: IAIStructuredResponse;
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface IAIProvider {
  /**
   * Generates a structured response based on the conversation history.
   * @param systemInstruction The core persona, context, and guardrails.
   * @param history The historical messages in the thread.
   * @param prompt The user's newest prompt.
   */
  generateResponse(
    systemInstruction: string,
    history: ChatMessagePayload[],
    prompt: string
  ): Promise<AIResponse>;
}

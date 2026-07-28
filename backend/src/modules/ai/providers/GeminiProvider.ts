import { GoogleGenAI, Type, Schema } from '@google/genai';
import { IAIProvider, ChatMessagePayload, AIResponse } from './IAIProvider';
import { IAIStructuredResponse } from '../models/ChatMessage';
import { AppError } from '../../../utils/AppError';
import { ENV } from '../../../config/env';

export class GeminiProvider implements IAIProvider {
  private ai: GoogleGenAI;
  // We use gemini-2.5-flash as it's the recommended default for general text tasks
  private modelName = 'gemini-2.5-flash';

  constructor() {
    const apiKey = ENV.GEMINI_API_KEY;
    // We instantiate the client. If the key is missing it will fail later if called, 
    // but we don't block server startup.
    this.ai = new GoogleGenAI({ apiKey: apiKey || 'MISSING_KEY' });
  }

  async generateResponse(
    systemInstruction: string,
    history: ChatMessagePayload[],
    prompt: string
  ): Promise<AIResponse> {
    
    if (!ENV.GEMINI_API_KEY) {
      throw new AppError('Gemini API key is missing. Please configure GEMINI_API_KEY.', 500);
    }

    // 1. Define the exact JSON schema we require back
    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        answer: { 
          type: Type.STRING,
          description: "Your natural language conversational response."
        },
        referencedCareers: { 
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of careers mentioned in your answer."
        },
        recommendedNextSteps: { 
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Actionable next steps for the student."
        },
        confidenceLevel: { 
          type: Type.STRING,
          description: "Your confidence in this advice: High, Medium, or Low."
        },
        followUpQuestions: { 
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Questions you want to ask the user to keep the conversation going."
        }
      },
      required: ["answer", "referencedCareers", "recommendedNextSteps", "confidenceLevel", "followUpQuestions"]
    };

    // 2. Format history for Gemini SDK format
    const contents = history.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user', // Gemini expects 'user' or 'model'
      parts: [{ text: msg.content }]
    }));
    
    // Add current prompt
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    try {
      // 3. Call Gemini API using generateContent with structured output
      const response = await this.ai.models.generateContent({
        model: this.modelName,
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          temperature: 0.7, // Slight creativity but mostly deterministic
        }
      });

      const responseText = response.text;
      if (!responseText) {
         throw new Error("Empty response received from Gemini.");
      }

      // 4. Parse response
      const structuredData: IAIStructuredResponse = JSON.parse(responseText);

      // 5. Extract Token Usage
      // The GenAI SDK returns usageMetadata with promptTokenCount, candidatesTokenCount, totalTokenCount
      const usage = response.usageMetadata;

      return {
        structuredData,
        tokenUsage: {
          promptTokens: usage?.promptTokenCount || 0,
          completionTokens: usage?.candidatesTokenCount || 0,
          totalTokens: usage?.totalTokenCount || 0
        }
      };

    } catch (error: any) {
      console.error('Gemini Provider Error:', error);
      throw new AppError(`AI Provider Error: ${error.message}`, 502);
    }
  }

  async generateText(systemInstruction: string, prompt: string): Promise<string> {
    if (!ENV.GEMINI_API_KEY) {
      throw new AppError('Gemini API key is missing. Please configure GEMINI_API_KEY.', 500);
    }
    try {
      const response = await this.ai.models.generateContent({
        model: this.modelName,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { systemInstruction: systemInstruction, temperature: 0.7 }
      });
      return response.text || '';
    } catch (error: any) {
      console.error('Gemini Text Generation Error:', error);
      throw new AppError(`AI Generation Error: ${error.message}`, 502);
    }
  }
}

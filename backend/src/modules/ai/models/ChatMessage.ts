import mongoose, { Document, Schema } from 'mongoose';

export type ChatRole = 'user' | 'model' | 'system';

export interface IAIStructuredResponse {
  answer: string;
  referencedCareers: string[];
  recommendedNextSteps: string[];
  confidenceLevel: string;
  followUpQuestions: string[];
}

export interface IChatMessage extends Document {
  sessionId: mongoose.Types.ObjectId;
  role: ChatRole;
  content: string; // Raw text (mostly for user messages or system prompts)
  structuredData?: IAIStructuredResponse; // For model responses
  tokenCount?: number;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'ConversationSession', required: true, index: true },
    role: { type: String, enum: ['user', 'model', 'system'], required: true },
    content: { type: String, required: true },
    structuredData: {
      answer: { type: String },
      referencedCareers: [{ type: String }],
      recommendedNextSteps: [{ type: String }],
      confidenceLevel: { type: String },
      followUpQuestions: [{ type: String }]
    },
    tokenCount: { type: Number }
  },
  { timestamps: true }
);

// Index for fetching history in chronological order quickly
chatMessageSchema.index({ sessionId: 1, createdAt: 1 });

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);

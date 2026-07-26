import mongoose, { Document, Schema } from 'mongoose';

export interface IConversationSession extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  status: 'ACTIVE' | 'ARCHIVED';
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  lastMessageAt: Date;
}

const conversationSessionSchema = new Schema<IConversationSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: 'New Conversation' },
    status: { type: String, enum: ['ACTIVE', 'ARCHIVED'], default: 'ACTIVE', index: true },
    tokenUsage: {
      promptTokens: { type: Number, default: 0 },
      completionTokens: { type: Number, default: 0 },
      totalTokens: { type: Number, default: 0 }
    },
    lastMessageAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const ConversationSession = mongoose.model<IConversationSession>('ConversationSession', conversationSessionSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IAssessmentSession extends Document {
  userId: mongoose.Types.ObjectId;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  answers: {
    questionId: mongoose.Types.ObjectId;
    selectedOptionIndex: number;
    timeSpentSeconds: number;
  }[];
  lastSavedAt: Date;
}

const sessionSchema = new Schema<IAssessmentSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['IN_PROGRESS', 'COMPLETED', 'ABANDONED'], default: 'IN_PROGRESS', index: true },
    answers: [
      {
        questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
        selectedOptionIndex: { type: Number, required: true },
        timeSpentSeconds: { type: Number, default: 0 }
      }
    ],
    lastSavedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const AssessmentSession = mongoose.model<IAssessmentSession>('AssessmentSession', sessionSchema);

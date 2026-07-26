import mongoose, { Document, Schema } from 'mongoose';

export interface ITraitScores {
  realistic: number;
  investigative: number;
  artistic: number;
  social: number;
  enterprising: number;
  conventional: number;
  analytical: number;
  technical: number;
  leadership: number;
  communication: number;
  creativity: number;
}

export interface IAssessmentResult extends Document {
  userId: mongoose.Types.ObjectId;
  sessionId: mongoose.Types.ObjectId;
  scores: ITraitScores; // Normalized 0-100 scores
  completionTimeSeconds: number;
}

const resultSchema = new Schema<IAssessmentResult>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    sessionId: { type: Schema.Types.ObjectId, ref: 'AssessmentSession', required: true },
    scores: {
      realistic: { type: Number, default: 0 },
      investigative: { type: Number, default: 0 },
      artistic: { type: Number, default: 0 },
      social: { type: Number, default: 0 },
      enterprising: { type: Number, default: 0 },
      conventional: { type: Number, default: 0 },
      analytical: { type: Number, default: 0 },
      technical: { type: Number, default: 0 },
      leadership: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      creativity: { type: Number, default: 0 },
    },
    completionTimeSeconds: { type: Number, required: true }
  },
  { timestamps: true }
);

export const AssessmentResult = mongoose.model<IAssessmentResult>('AssessmentResult', resultSchema);

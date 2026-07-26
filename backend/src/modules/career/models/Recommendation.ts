import mongoose, { Document, Schema } from 'mongoose';

export interface IRecommendationMatch {
  careerId: mongoose.Types.ObjectId;
  compatibilityScore: number; // 0-100%
  strengths: string[];
  weaknesses: string[];
  improvementAreas: string[];
  reasoning: string; // Plain text explainable AI string
}

export interface IRecommendation extends Document {
  userId: mongoose.Types.ObjectId;
  assessmentResultId: mongoose.Types.ObjectId;
  matches: IRecommendationMatch[];
}

const recommendationSchema = new Schema<IRecommendation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    assessmentResultId: { type: Schema.Types.ObjectId, ref: 'AssessmentResult', required: true },
    matches: [
      {
        careerId: { type: Schema.Types.ObjectId, ref: 'Career', required: true },
        compatibilityScore: { type: Number, required: true },
        strengths: [{ type: String }],
        weaknesses: [{ type: String }],
        improvementAreas: [{ type: String }],
        reasoning: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
);

export const Recommendation = mongoose.model<IRecommendation>('Recommendation', recommendationSchema);

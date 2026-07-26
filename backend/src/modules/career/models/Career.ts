import mongoose, { Document, Schema } from 'mongoose';
import { ITraitScores } from '../../assessment/models/AssessmentResult';

export interface ICareer extends Document {
  name: string;
  description: string;
  requiredSkills: string[];
  requiredSubjects: string[];
  educationPath: string;
  salaryRange: { min: number; max: number; currency: string };
  demandLevel: 'Low' | 'Medium' | 'High';
  futureOutlook: string;
  aiAutomationRisk: 'Low' | 'Medium' | 'High';
  recommendedCertifications: string[];
  growthOpportunities: string[];
  relatedCareers: mongoose.Types.ObjectId[];
  
  // The baseline trait scores required for a 100% match
  traitRequirements: Partial<ITraitScores>;
}

const careerSchema = new Schema<ICareer>(
  {
    name: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    requiredSkills: [{ type: String, index: true }],
    requiredSubjects: [{ type: String }],
    educationPath: { type: String, required: true },
    salaryRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, default: 'INR' }
    },
    demandLevel: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    futureOutlook: { type: String, required: true },
    aiAutomationRisk: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    recommendedCertifications: [{ type: String }],
    growthOpportunities: [{ type: String }],
    relatedCareers: [{ type: Schema.Types.ObjectId, ref: 'Career' }],
    traitRequirements: {
      type: Map,
      of: Number,
      required: true
    }
  },
  { timestamps: true }
);

export const Career = mongoose.model<ICareer>('Career', careerSchema);

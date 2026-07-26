import mongoose, { Document, Schema } from 'mongoose';

export interface IScholarship extends Document {
  name: string;
  provider: string;
  amount: { min: number; max: number; currency: string };
  eligibilityCriteria: {
    maxFamilyIncome: number;
    requiredStreams: string[];
    minPercentage: number;
    targetDemographics: string[]; // e.g., 'Women', 'SC/ST', 'General'
  };
  educationLevel: string[];
  category: string;
  deadline: Date;
  applyUrl: string;
  requiredDocuments: string[];
  status: 'Open' | 'Closed' | 'Upcoming';
  regions: string[];
  tags: string[];
}

const scholarshipSchema = new Schema<IScholarship>(
  {
    name: { type: String, required: true, trim: true },
    provider: { type: String, required: true },
    amount: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, default: 'INR' }
    },
    eligibilityCriteria: {
      maxFamilyIncome: { type: Number, default: 999999999 },
      requiredStreams: [{ type: String }],
      minPercentage: { type: Number, default: 0 },
      targetDemographics: [{ type: String }]
    },
    educationLevel: [{ type: String }],
    category: { type: String, required: true, index: true },
    deadline: { type: Date, required: true },
    applyUrl: { type: String, required: true },
    requiredDocuments: [{ type: String }],
    status: { type: String, enum: ['Open', 'Closed', 'Upcoming'], default: 'Open', index: true },
    regions: [{ type: String }],
    tags: [{ type: String }]
  },
  { timestamps: true }
);

// Setup Text Index for Global Search
scholarshipSchema.index({ name: 'text', provider: 'text', category: 'text', tags: 'text' });

export const Scholarship = mongoose.model<IScholarship>('Scholarship', scholarshipSchema);

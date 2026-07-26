import mongoose, { Document, Schema } from 'mongoose';

export interface IInternship extends Document {
  company: string;
  role: string;
  durationMonths: number;
  stipend: { min: number; max: number; currency: string };
  location: string;
  remoteStatus: 'Remote' | 'Hybrid' | 'On-site';
  eligibility: string[];
  deadline: Date;
  applyUrl: string;
  requiredSkills: string[];
  mappedCareers: mongoose.Types.ObjectId[];
  status: 'Open' | 'Closed';
}

const internshipSchema = new Schema<IInternship>(
  {
    company: { type: String, required: true, index: true },
    role: { type: String, required: true },
    durationMonths: { type: Number, required: true },
    stipend: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: 'INR' }
    },
    location: { type: String, required: true },
    remoteStatus: { type: String, enum: ['Remote', 'Hybrid', 'On-site'], required: true },
    eligibility: [{ type: String }],
    deadline: { type: Date, required: true },
    applyUrl: { type: String, required: true },
    requiredSkills: [{ type: String, index: true }],
    mappedCareers: [{ type: Schema.Types.ObjectId, ref: 'Career', index: true }],
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' }
  },
  { timestamps: true }
);

// Setup Text Index for Global Search
internshipSchema.index({ company: 'text', role: 'text', requiredSkills: 'text' });

export const Internship = mongoose.model<IInternship>('Internship', internshipSchema);

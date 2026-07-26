import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string; // e.g., "Software Engineer Draft 1"
  targetCareerId?: mongoose.Types.ObjectId;
  
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };

  careerObjective: string;
  
  education: {
    degree: string;
    institution: string;
    startYear: number;
    endYear?: number;
    percentage?: number;
  }[];

  experience: {
    role: string;
    company: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description: string[];
  }[];

  projects: {
    title: string;
    techStack: string[];
    description: string;
    url?: string;
  }[];

  skills: string[];
  achievements: string[];
  certifications: string[];
  
  templateId: string; // 'modern', 'minimal', etc.
}

const resumeSchema = new Schema<IResume>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    targetCareerId: { type: Schema.Types.ObjectId, ref: 'Career' },
    
    personalInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      location: { type: String, required: true },
      linkedin: { type: String },
      github: { type: String },
      website: { type: String }
    },

    careerObjective: { type: String },
    
    education: [
      {
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        startYear: { type: Number, required: true },
        endYear: { type: Number },
        percentage: { type: Number }
      }
    ],

    experience: [
      {
        role: { type: String, required: true },
        company: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        current: { type: Boolean, default: false },
        description: [{ type: String }]
      }
    ],

    projects: [
      {
        title: { type: String, required: true },
        techStack: [{ type: String }],
        description: { type: String, required: true },
        url: { type: String }
      }
    ],

    skills: [{ type: String }],
    achievements: [{ type: String }],
    certifications: [{ type: String }],
    
    templateId: { type: String, default: 'modern' }
  },
  { timestamps: true }
);

resumeSchema.index({ userId: 1, createdAt: -1 });

export const Resume = mongoose.model<IResume>('Resume', resumeSchema);

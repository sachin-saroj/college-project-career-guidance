import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  provider: string; // e.g., Coursera, Udemy
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationHours: number;
  language: string;
  skillsCovered: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  certification: boolean;
  rating: number; // 0-5
  price: number; // 0 means Free
  thumbnailUrl: string;
  url: string;
  mappedCareers: mongoose.Types.ObjectId[];
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    provider: { type: String, required: true, index: true },
    instructor: { type: String },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    durationHours: { type: Number, required: true },
    language: { type: String, default: 'English' },
    skillsCovered: [{ type: String, index: true }],
    prerequisites: [{ type: String }],
    learningOutcomes: [{ type: String }],
    certification: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    price: { type: Number, required: true, default: 0 },
    thumbnailUrl: { type: String },
    url: { type: String, required: true },
    mappedCareers: [{ type: Schema.Types.ObjectId, ref: 'Career', index: true }]
  },
  { timestamps: true }
);

// Setup Text Index for Global Search
courseSchema.index({ title: 'text', description: 'text', provider: 'text', skillsCovered: 'text' });

export const Course = mongoose.model<ICourse>('Course', courseSchema);

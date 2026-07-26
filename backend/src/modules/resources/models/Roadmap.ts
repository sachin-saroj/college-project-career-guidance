import mongoose, { Document, Schema } from 'mongoose';

export interface IRoadmapStage {
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[];
  courseIds: mongoose.Types.ObjectId[];
  projects: string[];
  certifications: string[];
}

export interface IRoadmap extends Document {
  title: string;
  careerId: mongoose.Types.ObjectId;
  description: string;
  stages: IRoadmapStage[];
}

const roadmapSchema = new Schema<IRoadmap>(
  {
    title: { type: String, required: true, trim: true },
    careerId: { type: Schema.Types.ObjectId, ref: 'Career', required: true, unique: true },
    description: { type: String, required: true },
    stages: [
      {
        level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
        skills: [{ type: String }],
        courseIds: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
        projects: [{ type: String }],
        certifications: [{ type: String }]
      }
    ]
  },
  { timestamps: true }
);

export const Roadmap = mongoose.model<IRoadmap>('Roadmap', roadmapSchema);

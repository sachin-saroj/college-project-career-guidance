import mongoose, { Document, Schema } from 'mongoose';

export interface IPortfolio extends Document {
  userId: mongoose.Types.ObjectId;
  tagline: string;
  about: string;
  featuredProjects: {
    title: string;
    techStack: string[];
    description: string;
    url?: string;
  }[];
  theme: string;
}

const portfolioSchema = new Schema<IPortfolio>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    tagline: { type: String, required: true },
    about: { type: String, required: true },
    featuredProjects: [
      {
        title: { type: String, required: true },
        techStack: [{ type: String }],
        description: { type: String, required: true },
        url: { type: String }
      }
    ],
    theme: { type: String, default: 'dark' }
  },
  { timestamps: true }
);

export const Portfolio = mongoose.model<IPortfolio>('Portfolio', portfolioSchema);

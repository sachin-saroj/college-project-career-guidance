import mongoose, { Document, Schema } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  content: string; // Markdown formatted
  author: string;
  readingTimeMinutes: number;
  categories: string[];
  tags: string[];
  seoMeta: {
    title: string;
    description: string;
  };
  mappedCareers: mongoose.Types.ObjectId[];
  status: 'Draft' | 'Published';
}

const articleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    readingTimeMinutes: { type: Number, required: true },
    categories: [{ type: String, index: true }],
    tags: [{ type: String }],
    seoMeta: {
      title: { type: String },
      description: { type: String }
    },
    mappedCareers: [{ type: Schema.Types.ObjectId, ref: 'Career', index: true }],
    status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' }
  },
  { timestamps: true }
);

// Setup Text Index for Global Search
articleSchema.index({ title: 'text', content: 'text', tags: 'text' });

export const Article = mongoose.model<IArticle>('Article', articleSchema);

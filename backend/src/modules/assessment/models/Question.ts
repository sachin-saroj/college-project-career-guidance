import mongoose, { Document, Schema } from 'mongoose';

export type QuestionCategory = 'Interest' | 'Aptitude' | 'Personality' | 'Skills' | 'Learning Style' | 'Work Environment' | 'Values' | 'Motivation';
export type QuestionType = 'MULTIPLE_CHOICE' | 'LIKERT';

export interface IQuestionOption {
  text: string;
  // Maps this option to specific traits with a base point value (e.g., { 'analytical': 5, 'technical': 10 })
  traitScores: Record<string, number>;
}

export interface IQuestion extends Document {
  text: string;
  category: QuestionCategory;
  type: QuestionType;
  difficulty: number; // 1-5 scale for aptitude
  weight: number; // Multiplier for scoring
  tags: string[];
  options: IQuestionOption[];
  explanation?: string; // Reasoning for why this question matters
  isActive: boolean;
}

const questionSchema = new Schema<IQuestion>(
  {
    text: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Interest', 'Aptitude', 'Personality', 'Skills', 'Learning Style', 'Work Environment', 'Values', 'Motivation'],
      index: true
    },
    type: { type: String, required: true, enum: ['MULTIPLE_CHOICE', 'LIKERT'] },
    difficulty: { type: Number, default: 1, min: 1, max: 5 },
    weight: { type: Number, default: 1 },
    tags: [{ type: String, index: true }],
    options: [
      {
        text: { type: String, required: true },
        traitScores: { type: Map, of: Number, required: true }
      }
    ],
    explanation: { type: String },
    isActive: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

export const Question = mongoose.model<IQuestion>('Question', questionSchema);

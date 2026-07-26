import mongoose, { Document, Schema } from 'mongoose';

export interface IBookmark extends Document {
  userId: mongoose.Types.ObjectId;
  resourceId: mongoose.Types.ObjectId;
  resourceType: string;
}

const bookmarkSchema = new Schema<IBookmark>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resourceId: { type: Schema.Types.ObjectId, required: true, index: true },
    resourceType: { 
      type: String, 
      enum: ['COURSE', 'SCHOLARSHIP', 'INTERNSHIP', 'ARTICLE', 'ROADMAP'], 
      required: true 
    }
  },
  { timestamps: true }
);

// Prevent duplicate bookmarks
bookmarkSchema.index({ userId: 1, resourceId: 1, resourceType: 1 }, { unique: true });

export const Bookmark = mongoose.model<IBookmark>('Bookmark', bookmarkSchema);

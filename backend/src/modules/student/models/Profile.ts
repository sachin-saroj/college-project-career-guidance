import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  personal: {
    firstName: string;
    lastName: string;
    fullName: string;
    avatarUrl?: string;
    gender?: string;
    dob?: Date;
    phone?: string;
  };
  academic: {
    school?: string;
    educationLevel?: string;
    board?: string;
    currentClass?: string;
    stream?: string;
    percentage?: number;
    graduationYear?: number;
  };
  career: {
    dreamCareer?: string;
    interestedDomains: string[];
    skills: string[];
    languages: string[];
    preferredWorkType?: string;
    preferredCities: string[];
  };
  socioeconomic: {
    incomeRange?: string;
    familyIncome?: number;
    scholarshipEligible: boolean;
    category?: string;
    disability?: string;
  };
  preferences: {
    notifications: boolean;
    privacy: string;
    language: string;
    theme: string;
  };
  calculateCompletion(): { score: number; missing: string[] };
}

const profileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    personal: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      avatarUrl: { type: String },
      gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
      dob: { type: Date },
      phone: { type: String, trim: true },
    },
    academic: {
      school: { type: String, trim: true },
      educationLevel: { type: String, trim: true },
      board: { type: String, trim: true },
      currentClass: { type: String, trim: true },
      stream: { type: String, trim: true },
      percentage: { type: Number, min: 0, max: 100 },
      graduationYear: { type: Number },
    },
    career: {
      dreamCareer: { type: String, trim: true },
      interestedDomains: [{ type: String, trim: true }],
      skills: [{ type: String, trim: true }],
      languages: [{ type: String, trim: true }],
      preferredWorkType: { type: String, enum: ['Remote', 'On-site', 'Hybrid'] },
      preferredCities: [{ type: String, trim: true }],
    },
    socioeconomic: {
      incomeRange: { type: String, trim: true },
      familyIncome: { type: Number },
      scholarshipEligible: { type: Boolean, default: false },
      category: { type: String, trim: true },
      disability: { type: String, trim: true },
    },
    preferences: {
      notifications: { type: Boolean, default: true },
      privacy: { type: String, enum: ['Public', 'Private', 'Connections Only'], default: 'Public' },
      language: { type: String, default: 'English' },
      theme: { type: String, enum: ['Light', 'Dark', 'System'], default: 'System' },
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for full name
profileSchema.virtual('personal.fullName').get(function (this: IProfile) {
  return `${this.personal.firstName} ${this.personal.lastName}`;
});

// Calculate Completion Engine
profileSchema.methods.calculateCompletion = function (this: IProfile): { score: number; missing: string[] } {
  let score = 0;
  const missing: string[] = [];

  // Personal (20%)
  if (this.personal.phone) score += 5; else missing.push('personal.phone');
  if (this.personal.dob) score += 5; else missing.push('personal.dob');
  if (this.personal.gender) score += 5; else missing.push('personal.gender');
  if (this.personal.avatarUrl) score += 5; else missing.push('personal.avatarUrl');

  // Academic (40%)
  if (this.academic.school) score += 10; else missing.push('academic.school');
  if (this.academic.board) score += 5; else missing.push('academic.board');
  if (this.academic.currentClass || this.academic.stream) score += 10; else missing.push('academic.currentClass');
  if (this.academic.percentage) score += 15; else missing.push('academic.percentage');

  // Career (30%)
  if (this.career.interestedDomains && this.career.interestedDomains.length > 0) score += 15; else missing.push('career.interestedDomains');
  if (this.career.dreamCareer) score += 10; else missing.push('career.dreamCareer');
  if (this.career.skills && this.career.skills.length > 0) score += 5; else missing.push('career.skills');

  // Socioeconomic (10%)
  if (this.socioeconomic.incomeRange) score += 10; else missing.push('socioeconomic.incomeRange');

  return { score, missing };
};

// Indexes for fast lookup on future AI recommendation engine
profileSchema.index({ 'career.interestedDomains': 1 });
profileSchema.index({ 'academic.percentage': -1 });

// Ensure virtuals are included in JSON responses
profileSchema.set('toJSON', { virtuals: true });
profileSchema.set('toObject', { virtuals: true });

export const Profile = mongoose.model<IProfile>('Profile', profileSchema);

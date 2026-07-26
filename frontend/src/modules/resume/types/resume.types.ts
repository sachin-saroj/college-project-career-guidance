export interface ResumePersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface ResumeEducation {
  _id?: string;
  degree: string;
  institution: string;
  startYear: number;
  endYear?: number;
  percentage?: number;
}

export interface ResumeExperience {
  _id?: string;
  role: string;
  company: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string[];
}

export interface ResumeProject {
  _id?: string;
  title: string;
  techStack: string[];
  description: string;
  url?: string;
}

export interface Resume {
  _id: string;
  userId: string;
  title: string;
  targetCareerId?: string;
  
  personalInfo: ResumePersonalInfo;
  careerObjective: string;
  
  education: ResumeEducation[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  
  skills: string[];
  achievements: string[];
  certifications: string[];
  
  templateId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ATSScoreData {
  score: number;
  keywordMatch: number;
  readability: number;
  missingKeywords: string[];
  suggestions: string[];
}

// Portfolio mock types
export interface Portfolio {
  _id: string;
  tagline: string;
  about: string;
  featuredProjects: ResumeProject[];
  theme: string;
}

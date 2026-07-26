export interface AcademicInfo {
  highestQualification: string;
  institution: string;
  boardOrUniversity?: string;
  graduationYear?: number;
  percentageOrCgpa?: string;
  subjects?: string[];
}

export interface CareerInterests {
  primaryFields: string[];
  preferredRoles: string[];
  openToRelocation: boolean;
  expectedSalaryRange?: string;
}

export interface SocioeconomicDetails {
  annualFamilyIncome?: string;
  firstGenerationLearner: boolean;
  disabilityStatus?: string;
}

export interface Profile {
  _id: string;
  user: string;
  avatarUrl?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  academicInfo?: AcademicInfo;
  careerInterests?: CareerInterests;
  socioeconomicDetails?: SocioeconomicDetails;
  isProfileComplete: boolean;
  completionPercentage: number;
}

export interface ProfileResponse {
  status: string;
  data: {
    profile: Profile;
  };
}

export interface DashboardStats {
  assessmentsTaken: number;
  savedResources: number;
  resumesGenerated: number;
  aiMentorSessions: number;
}

export interface DashboardResponse {
  status: string;
  data: {
    stats: DashboardStats;
    recentActivity: any[]; // Can type this strictly later based on event structure
  };
}

export interface ProfileCompletionResponse {
  status: string;
  data: {
    isComplete: boolean;
    percentage: number;
    missingFields: string[];
  };
}

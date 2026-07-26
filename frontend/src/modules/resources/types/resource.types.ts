export type ResourceType = 'course' | 'scholarship' | 'internship' | 'article' | 'roadmap';

export interface BaseResource {
  _id: string;
  title: string;
  description: string;
  provider: string;
  url: string;
  mappedCareers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Course extends BaseResource {
  platform: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  cost: 'Free' | 'Paid';
  tags: string[];
}

export interface Scholarship extends BaseResource {
  amount: number;
  deadline: string;
  eligibilityCriteria: {
    minGrade?: string;
    maxFamilyIncome?: number;
    targetDemographic?: string[];
  };
  status: 'Open' | 'Closed' | 'Upcoming';
}

export interface Internship extends BaseResource {
  company: string;
  location: string;
  stipend: string;
  duration: string;
  type: 'Remote' | 'On-site' | 'Hybrid';
  status: 'Open' | 'Closed';
}

export interface Article extends BaseResource {
  author: string;
  readTimeMinutes: number;
  tags: string[];
  status: 'Published' | 'Draft';
}

export interface Roadmap extends BaseResource {
  careerId: string;
  steps: {
    title: string;
    description: string;
    estimatedTime: string;
    resources: string[]; // ObjectIds to other resources
  }[];
}

// Grouped payload for "Recommended"
export interface RecommendedResourcesPayload {
  topCareers: string[];
  resources: {
    courses: Course[];
    internships: Internship[];
    roadmaps: Roadmap[];
    articles: Article[];
    scholarships: Scholarship[];
  };
}

export interface SearchResourcesParams {
  type: ResourceType;
  q?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  results: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

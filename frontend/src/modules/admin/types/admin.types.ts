export interface AdminUser {
  _id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isEmailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface AdminResource {
  _id: string;
  title: string;
  type: 'COURSE' | 'SCHOLARSHIP' | 'INTERNSHIP' | 'ARTICLE' | 'ROADMAP';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
  views: number;
}

export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  assessmentsCompleted: number;
  aiConversations: number;
  resourcesViewed: number;
  resumeExports: number;
  systemHealth: 'HEALTHY' | 'DEGRADED' | 'DOWN';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

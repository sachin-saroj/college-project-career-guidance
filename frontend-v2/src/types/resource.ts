export type ResourceType = "course" | "scholarship" | "internship" | "roadmap" | "article";

export interface Resource {
  id: number;
  title: string;
  description: string;
  type: ResourceType;
  provider: string;
  category: string;
  skills?: string[];
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  duration?: string;
  isFree?: boolean;
  amount?: string;
  deadline?: string;
  location?: string;
  url: string;
  image?: string;
  featured?: boolean;
  createdAt: string;
}

export interface ResourceResponse {
  resources: Resource[];
  bookmarkIds: number[];
}

export interface SingleResourceResponse {
  resource: Resource;
}

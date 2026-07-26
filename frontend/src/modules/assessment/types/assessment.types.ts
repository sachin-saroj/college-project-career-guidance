export type QuestionType = 'mcq' | 'likert';

export interface Question {
  _id: string;
  text: string;
  trait: string;
  type: QuestionType;
  options?: {
    text: string;
    value: number;
  }[];
}

export interface AssessmentSession {
  _id: string;
  studentId: string;
  status: 'in_progress' | 'completed';
  currentQuestionIndex: number;
  answers: {
    questionId: string;
    value: number;
    timeTaken?: number;
  }[];
  startedAt: string;
  updatedAt: string;
}

export interface TraitScore {
  trait: string;
  score: number;
  description?: string;
}

export interface CareerMatch {
  careerId: string;
  title: string;
  matchPercentage: number;
  reasoning: string;
}

export interface Recommendation {
  _id: string;
  studentId: string;
  traits: TraitScore[];
  recommendedCareers: CareerMatch[];
  strengths: string[];
  improvementAreas: string[];
  generatedAt: string;
}

export interface StartAssessmentResponse {
  success: boolean;
  data: {
    session: AssessmentSession;
    questions: Question[];
  };
}

export interface SubmitAssessmentResponse {
  success: boolean;
  data: {
    recommendation: Recommendation;
  };
}

export interface GetRecommendationsResponse {
  success: boolean;
  data: {
    recommendation: Recommendation;
  };
}

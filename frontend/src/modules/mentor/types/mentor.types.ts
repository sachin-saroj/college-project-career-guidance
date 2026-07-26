export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  _id?: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  isError?: boolean;
}

export interface AiSession {
  _id: string;
  studentId: string;
  title: string;
  messages: Message[];
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface SessionSummary {
  _id: string;
  title: string;
  lastMessageAt: string;
}

export interface CreateSessionResponse {
  success: boolean;
  data: {
    session: AiSession;
  };
}

export interface ChatPayload {
  sessionId: string;
  message: string;
}

export interface ChatResponse {
  success: boolean;
  data: {
    message: Message;
  };
}

export interface GetHistoryResponse {
  success: boolean;
  data: {
    sessions: SessionSummary[];
  };
}

export interface GetSessionResponse {
  success: boolean;
  data: {
    session: AiSession;
  };
}

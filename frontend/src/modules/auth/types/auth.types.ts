export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'admin';
}

export interface AuthResponse {
  status: string;
  token: string;
  data: {
    user: User;
  };
}

export interface GenericResponse {
  status: string;
  message?: string;
}

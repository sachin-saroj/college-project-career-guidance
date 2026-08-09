import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";
import type { ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  assessmentCompleted?: boolean;
  education?: string;
  skills?: string;
  interests?: string;
  careerGoal?: string;
  familyIncome?: string;
  lastRecommendations?: any[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (err: any) {
        console.error("Auth verification failed", err);
        setError("Session expired or server error");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await api.get("/auth/me");
      setUser(response.data);
    } catch (err) {
      console.error("Auth verification failed during refresh", err);
    }
  };

  const login = async (data: any) => {
    const response = await api.post("/auth/login", data);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    setUser(response.data.user);
  };

  const register = async (data: any) => {
    const response = await api.post("/auth/register", data);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    setUser(response.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

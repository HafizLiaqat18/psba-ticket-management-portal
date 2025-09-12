"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import nookies, { parseCookies, destroyCookie } from "nookies";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import showError from "@/components/send-error";

type User = {
  _id: string;
  username: string;
  name: string;
  email: string;
  photo?: string;
  assignedTo: {
    _id: string;
    name: string;
    currentReport?: string;
  };
  assignedToType: "Market" | "Department";
  role: "admin" | "user" | "superadmin";
};

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (formData: FormData) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User>({} as User);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    router.replace("/login");
    destroyCookie(null, "token");
    setUser({} as User);
    setIsAuthenticated(false);
  }, [router]);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const { token } = parseCookies();
      if (token) {
        try {
          const { data } = await api.get(`/users/verify`);
          setUser(data.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.log("first error");
          showError(error);
          logout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [logout]);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post(
        "/users/login",
        { email, password },
        {
          // Add flag to skip interceptor handling
          _skipAuthCheck: true,
        }
      );
      nookies.set(null, "token", data.data.token, {
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
      setIsAuthenticated(true);
      setUser(data.data.user);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (formData: FormData) => {
    const { data } = await api.post("/user/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    nookies.set(null, "token", data.data.token, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    setUser(data.data.user);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        isLoading,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

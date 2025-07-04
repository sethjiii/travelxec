"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useSession, signOut as googleSignOut } from "next-auth/react";

type User = {
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
  token?: string;
  _id?: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [jwtUser, setJwtUser] = useState<User | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Load JWT user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setJwtUser(parsedUser);
    }
  }, []);

  // Unified user getter
  const user: User | null = session?.user
    ? {
        name: session.user.name || "",
        email: session.user.email || "",
        role: (session.user as any).role || "user",
        avatarUrl: session.user.image || "",
        _id: session.user.id || "",
      }
    : jwtUser;

  const isAuthenticated = !!user;

  // Custom email/password login (JWT)
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        const userData: User = {
          ...data.user,
          token: data.user.token,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        setJwtUser(userData);
        router.push(userData.role === "admin" ? "/admin" : "/profile");
      } else {
        alert(data?.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("JWT login failed", error);
      alert("Login error");
    }
  };

  // Unified logout
  const logout = () => {
    localStorage.clear();
    setJwtUser(null);
    googleSignOut({ callbackUrl: "/auth/login" });
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

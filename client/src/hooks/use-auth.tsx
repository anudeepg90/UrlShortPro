import { useState, useEffect, createContext, ReactNode, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { config } from "@/lib/config";

interface User {
  id: number;
  username: string;
  email: string;
  isPremium: boolean;
  membershipStartDate: Date;
  membershipEndDate: Date | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  createdAt: Date;
}

interface AuthResponse {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (credentials: { username: string; password: string }) => void;
  register: (credentials: { username: string; email: string; password: string }) => void;
  logout: () => void;
  isLoginLoading: boolean;
  isRegisterLoading: boolean;
  isLogoutLoading: boolean;
  loginError: Error | null;
  registerError: Error | null;
  logoutError: Error | null;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data
  const { data: authData, error, refetch } = useQuery<AuthResponse>({
    queryKey: ["auth"],
    queryFn: async () => {
      console.log("🔍 [AUTH] Fetching user data...");
      console.log("🔗 [AUTH] API URL:", `${config.apiBaseUrl}/api/user`);
      
      try {
        const response = await fetch(`${config.apiBaseUrl}/api/user`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("📡 [AUTH] Response status:", response.status);
        console.log("📡 [AUTH] Response headers:", Object.fromEntries(response.headers.entries()));

        if (response.status === 401) {
          console.log("❌ [AUTH] User not authenticated");
          return { user: null, isAuthenticated: false };
        }

        if (!response.ok) {
          console.error("❌ [AUTH] HTTP error:", response.status, response.statusText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();
        console.log("✅ [AUTH] User data received:", userData);
        
        return {
          user: userData,
          isAuthenticated: true,
        };
      } catch (error) {
        console.error("❌ [AUTH] Fetch error:", error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      console.log("🔐 [AUTH] Attempting login...");
      console.log("🔗 [AUTH] Login URL:", `${config.apiBaseUrl}/api/login`);
      
      const response = await fetch(`${config.apiBaseUrl}/api/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("📡 [AUTH] Login response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ [AUTH] Login failed:", errorData);
        throw new Error(errorData.message || "Login failed");
      }

      const userData = await response.json();
      console.log("✅ [AUTH] Login successful:", userData);
      return userData;
    },
    onSuccess: () => {
      console.log("🔄 [AUTH] Refetching user data after login");
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async ({ username, email, password }: { username: string; email: string; password: string }) => {
      console.log("📝 [AUTH] Attempting registration...");
      console.log("🔗 [AUTH] Register URL:", `${config.apiBaseUrl}/api/register`);
      
      const response = await fetch(`${config.apiBaseUrl}/api/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      console.log("📡 [AUTH] Register response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ [AUTH] Registration failed:", errorData);
        throw new Error(errorData.message || "Registration failed");
      }

      const userData = await response.json();
      console.log("✅ [AUTH] Registration successful:", userData);
      return userData;
    },
    onSuccess: () => {
      console.log("🔄 [AUTH] Refetching user data after registration");
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      console.log("🚪 [AUTH] Attempting logout...");
      console.log("🔗 [AUTH] Logout URL:", `${config.apiBaseUrl}/api/logout`);
      
      const response = await fetch(`${config.apiBaseUrl}/api/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📡 [AUTH] Logout response status:", response.status);

      if (!response.ok) {
        console.error("❌ [AUTH] Logout failed:", response.status, response.statusText);
        throw new Error("Logout failed");
      }

      console.log("✅ [AUTH] Logout successful");
    },
    onSuccess: () => {
      console.log("🔄 [AUTH] Clearing user data after logout");
      queryClient.setQueryData(["auth"], { user: null, isAuthenticated: false });
    },
  });

  useEffect(() => {
    if (authData !== undefined) {
      setIsLoading(false);
      console.log("🏁 [AUTH] Auth state loaded:", {
        isAuthenticated: authData?.isAuthenticated,
        user: authData?.user ? "User logged in" : "No user",
        environment: config.environment,
      });
    }
  }, [authData]);

  const contextValue: AuthContextType = {
    user: authData?.user || null,
    isAuthenticated: authData?.isAuthenticated || false,
    isLoading: isLoading || error !== null,
    error,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending ?? false,
    isRegisterLoading: registerMutation.isPending ?? false,
    isLogoutLoading: logoutMutation.isPending ?? false,
    loginError: loginMutation.error || null,
    registerError: registerMutation.error || null,
    logoutError: logoutMutation.error || null,
    refetch,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

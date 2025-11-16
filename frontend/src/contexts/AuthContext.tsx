import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "../services/authService";
import type {
  AuthContextType,
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../types/auth";

// Auth reducer
type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_ERROR" }
  | { type: "LOGOUT" }
  | { type: "SET_USER"; payload: User }
  | { type: "SET_LOADING"; payload: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGIN_ERROR":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Query to get user profile on app start (if refresh token exists)
  const { data: user, error } = useQuery({
    queryKey: ["profile"],
    queryFn: () => authService.getProfile(),
    enabled: authService.isAuthenticated(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onMutate: () => {
      dispatch({ type: "LOGIN_START" });
    },
    onSuccess: (data) => {
      dispatch({ type: "LOGIN_SUCCESS", payload: data.user });
    },
    onError: () => {
      dispatch({ type: "LOGIN_ERROR" });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (credentials: Omit<RegisterCredentials, "confirmPassword">) =>
      authService.register(credentials),
    onSuccess: (response) => {
      dispatch({ type: "SET_USER", payload: response.user });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      dispatch({ type: "LOGOUT" });
    },
  });

  // Effect to handle profile query results
  useEffect(() => {
    if (user) {
      dispatch({ type: "SET_USER", payload: user });
    } else if (error) {
      dispatch({ type: "LOGOUT" });
    } else if (!authService.isAuthenticated()) {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [user, error]);

  const login = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials);
  };

  const register = async (
    credentials: Omit<RegisterCredentials, "confirmPassword">
  ) => {
    try {
      await registerMutation.mutateAsync(credentials);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  const refreshToken = async (): Promise<string> => {
    return authService.refreshToken();
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

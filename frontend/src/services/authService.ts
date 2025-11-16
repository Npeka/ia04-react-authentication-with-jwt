import apiClient from "./api";
import { tokenStorage } from "../utils/tokenStorage";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  User,
} from "../types/auth";

export const authService = {
  async register(
    credentials: Omit<RegisterCredentials, "confirmPassword">
  ): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/register",
      credentials
    );
    const { access_token, refresh_token } = response.data;

    // Store tokens
    tokenStorage.setAccessToken(access_token);
    tokenStorage.setRefreshToken(refresh_token);

    return response.data;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    const { access_token, refresh_token } = response.data;

    // Store tokens
    tokenStorage.setAccessToken(access_token);
    tokenStorage.setRefreshToken(refresh_token);

    return response.data;
  },

  async logout(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken();

    try {
      if (refreshToken) {
        await apiClient.post("/auth/logout", { refresh_token: refreshToken });
      }
    } catch (error) {
      // Even if logout request fails, we should clear local tokens
      console.error("Logout request failed:", error);
    } finally {
      // Always clear local tokens
      tokenStorage.clearTokens();
    }
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>("/auth/profile");
    return response.data;
  },

  async refreshToken(): Promise<string> {
    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiClient.post("/auth/refresh", {
      refresh_token: refreshToken,
    });

    const { access_token } = response.data;
    tokenStorage.setAccessToken(access_token);

    return access_token;
  },

  // Check if user is potentially authenticated (has refresh token)
  isAuthenticated(): boolean {
    return tokenStorage.hasRefreshToken();
  },
};

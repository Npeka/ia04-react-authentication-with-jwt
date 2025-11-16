const REFRESH_TOKEN_KEY = "refresh_token";

// Access token stored in memory for security
let accessToken: string | null = null;

export const tokenStorage = {
  // Access token methods (memory storage)
  getAccessToken: (): string | null => {
    return accessToken;
  },

  setAccessToken: (token: string): void => {
    accessToken = token;
  },

  removeAccessToken: (): void => {
    accessToken = null;
  },

  // Refresh token methods (localStorage)
  getRefreshToken: (): string | null => {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setRefreshToken: (token: string): void => {
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch {
      // Handle localStorage not available
    }
  },

  removeRefreshToken: (): void => {
    try {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch {
      // Handle localStorage not available
    }
  },

  // Clear all tokens
  clearTokens: (): void => {
    accessToken = null;
    try {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch {
      // Handle localStorage not available
    }
  },

  // Check if user has valid refresh token
  hasRefreshToken: (): boolean => {
    return !!tokenStorage.getRefreshToken();
  },
};

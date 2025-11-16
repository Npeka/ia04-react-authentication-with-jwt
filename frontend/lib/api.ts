import axios from "axios";

// Create axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== "undefined") {
        const refreshToken = localStorage.getItem("refresh_token");

        if (refreshToken) {
          try {
            // Call refresh endpoint
            const response = await axios.post(
              `${
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
              }/auth/refresh`,
              { refresh_token: refreshToken },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const { access_token } = response.data;

            // Update stored token
            localStorage.setItem("access_token", access_token);

            // Update the authorization header and retry the original request
            originalRequest.headers.Authorization = `Bearer ${access_token}`;

            return api(originalRequest);
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");

            // Only redirect if we're in the browser
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }

            return Promise.reject(refreshError);
          }
        } else {
          // No refresh token, redirect to login
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

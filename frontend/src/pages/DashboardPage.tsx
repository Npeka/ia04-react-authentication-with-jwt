import { useAuth } from "../contexts/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useState } from "react";
import apiClient from "../services/api";
import { tokenStorage } from "../utils/tokenStorage";

export const DashboardPage = () => {
  const { user, logout, isLoading, refreshToken } = useAuth();
  const [apiTest, setApiTest] = useState<{
    status: "idle" | "loading" | "success" | "error";
    data?: any;
    error?: string;
  }>({ status: "idle" });

  const handleLogout = () => {
    logout();
  };

  const handleTestAPI = async () => {
    setApiTest({ status: "loading" });
    try {
      const response = await apiClient.get("/auth/profile");
      setApiTest({
        status: "success",
        data: response.data,
      });
    } catch (error: any) {
      setApiTest({
        status: "error",
        error:
          error.response?.data?.message || error.message || "API call failed",
      });
    }
  };

  const handleRefreshToken = async () => {
    setApiTest({ status: "loading" });
    try {
      const newToken = await refreshToken();
      setApiTest({
        status: "success",
        data: {
          message: "Token refreshed successfully",
          token: newToken.substring(0, 20) + "...",
        },
      });
    } catch (error: any) {
      setApiTest({
        status: "error",
        error: error.message || "Token refresh failed",
      });
    }
  };

  const handleViewToken = () => {
    const accessToken = tokenStorage.getAccessToken();
    const refreshTokenValue = tokenStorage.getRefreshToken();

    if (!accessToken && !refreshTokenValue) {
      setApiTest({
        status: "error",
        error: "No tokens found in storage",
      });
      return;
    }

    setApiTest({
      status: "success",
      data: {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshTokenValue,
        accessTokenPreview: accessToken
          ? accessToken.substring(0, 30) + "..."
          : "None",
        refreshTokenPreview: refreshTokenValue
          ? refreshTokenValue.substring(0, 30) + "..."
          : "None",
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center shadow-md">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-white">Dashboard</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-300">
                Welcome,{" "}
                <span className="font-medium text-white">{user?.name}</span>
              </div>
              <button onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-white mb-4">
              User Information
            </h3>
            <div className="space-y-3">
              <div>
                <div className="form-label">Name</div>
                <p className="text-white">{user?.name}</p>
              </div>
              <div>
                <div className="form-label">Email</div>
                <p className="text-white">{user?.email}</p>
              </div>
              <div>
                <div className="form-label">User ID</div>
                <p className="text-gray-400 font-mono text-sm">{user?.id}</p>
              </div>
            </div>
          </div>

          {/* Auth Status Card */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-white mb-4">
              Authentication Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-green-400">Authenticated</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-500 rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-primary-400">JWT Token Active</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-blue-400">Session Valid</span>
              </div>
            </div>
          </div>

          {/* Features Card */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-white mb-4">
              Features Implemented
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                <span>JWT Access & Refresh Tokens</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                <span>Automatic Token Refresh</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                <span>Protected Routes</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                <span>React Hook Form</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                <span>React Query</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                <span>Axios Interceptors</span>
              </li>
            </ul>
          </div>
        </div>

        {/* API Testing Section */}
        <div className="mt-8">
          <div className="card p-6">
            <h3 className="text-lg font-medium text-white mb-4">API Testing</h3>
            <p className="text-gray-400 mb-4">
              This dashboard is a protected route that fetches user data from
              the backend API. The authentication token is automatically
              attached to all requests via Axios interceptors.
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={handleTestAPI}
                disabled={apiTest.status === "loading"}
                className="btn-primary disabled:opacity-50"
              >
                {apiTest.status === "loading"
                  ? "Testing..."
                  : "Test Protected API"}
              </button>
              <button
                onClick={handleRefreshToken}
                disabled={apiTest.status === "loading"}
                className="btn-secondary disabled:opacity-50"
              >
                {apiTest.status === "loading"
                  ? "Refreshing..."
                  : "Refresh Token"}
              </button>
              <button onClick={handleViewToken} className="btn-ghost">
                View Token Info
              </button>
            </div>

            {/* API Test Results */}
            {apiTest.status !== "idle" && (
              <div
                className={`p-4 rounded-lg border ${
                  apiTest.status === "success"
                    ? "bg-green-900/20 border-green-500/30"
                    : apiTest.status === "error"
                    ? "bg-red-900/20 border-red-500/30"
                    : "bg-blue-900/20 border-blue-500/30"
                }`}
              >
                <h4 className="font-medium text-white mb-2">
                  API Test Result:
                </h4>
                {apiTest.status === "loading" && (
                  <div className="flex items-center text-blue-400">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Loading...</span>
                  </div>
                )}
                {apiTest.status === "success" && (
                  <div className="text-green-400">
                    <p className="mb-2">✅ Success!</p>
                    <pre className="bg-dark-800 p-3 rounded text-sm overflow-auto">
                      {JSON.stringify(apiTest.data, null, 2)}
                    </pre>
                  </div>
                )}
                {apiTest.status === "error" && (
                  <div className="text-red-400">
                    <p className="mb-2">❌ Error:</p>
                    <p className="bg-dark-800 p-3 rounded text-sm">
                      {apiTest.error}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

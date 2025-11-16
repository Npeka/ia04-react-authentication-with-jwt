import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";

export const DashboardPage: React.FC = () => {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
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

            <div className="flex flex-wrap gap-4">
              <button className="btn-primary">Test Protected API</button>
              <button className="btn-secondary">Refresh Token</button>
              <button className="btn-ghost">View Network Tab</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

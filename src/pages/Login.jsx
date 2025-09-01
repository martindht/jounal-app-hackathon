// src/pages/Login.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { user, isAuthenticated, login, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded shadow text-center">
          <p className="text-gray-700">Checking session…</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded shadow text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome, {user.displayName || user.email}!
          </h1>
          <button
            onClick={logout}
            className="w-full bg-gray-100 text-gray-900 py-2 rounded hover:bg-gray-200 transition"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Login</h1>

        <button
          onClick={login}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Continue with Google
        </button>

        <p className="text-xs text-gray-500 mt-3">
          We only use your Google account to authenticate you.
        </p>
      </div>
    </div>
  );
};

export default Login;

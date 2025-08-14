import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

import './style.css';

import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import Entries from './pages/Entries';
import Login from './pages/Login';

import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 24 }}>Loading authentication…</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <Link to="/">Dashboard</Link>
        <Link to="/journal">Journal</Link>
        <Link to="/entries">Entries</Link>
      </div>
      {isAuthenticated && (
        <button onClick={logout} className="text-sm text-red-600 hover:underline">
          Log out
        </button>
      )}
    </nav>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <main className="px-6 py-8 max-w-4xl mx-auto">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/journal"
              element={
                <ProtectedRoute>
                  <Journal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/entries"
              element={
                <ProtectedRoute>
                  <Entries />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

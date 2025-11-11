// Main App Component with Routing
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore.js';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import LoginForm from './components/auth/LoginForm.jsx';
import RegisterForm from './components/auth/RegisterForm.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Users from './pages/Users.jsx';
import MilkCollections from './pages/MilkCollections.jsx';
import Payments from './pages/Payments.jsx';
import Expenses from './pages/Expenses.jsx';
import Reports from './pages/Reports.jsx';
import Notifications from './pages/Notifications.jsx';
import Inventory from './pages/Inventory.jsx';
import Settings from './pages/Settings.jsx';
import Layout from './components/Layout.jsx';

// Initialize auth state from localStorage on app load
const App = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterForm />
            } 
          />

          {/* Protected routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Admin-only routes */}
            <Route 
              path="users" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <Users />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="milk-collections" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <MilkCollections />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="payments" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <Payments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="expenses" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <Expenses />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="reports" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <Reports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="inventory" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <Inventory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="notifications" 
              element={
                <Notifications />
              } 
            />
            <Route 
              path="settings" 
              element={
                <Settings />
              } 
            />

            {/* Farmer-specific routes */}
            <Route 
              path="my-collections" 
              element={
                <ProtectedRoute requiredRole="FARMER">
                  <MilkCollections />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="my-payments" 
              element={
                <ProtectedRoute requiredRole="FARMER">
                  <Payments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="my-reports" 
              element={
                <ProtectedRoute requiredRole="FARMER">
                  <Reports />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

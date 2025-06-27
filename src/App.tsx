/**
 * App Component
 * 
 * The root component of the application that sets up routing and global providers.
 * It includes the QueryClient for data fetching and various UI providers.
 */
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import DepartmentLayout from "./components/DepartmentLayout";
import AuthLayout from "./components/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import DepartmentsPage from "./pages/DepartmentsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ReportingPage from "./pages/ReportingPage";
import ResponsesPage from "./pages/ResponsesPage";
import NotificationsPage from "./pages/NotificationsPage";
import DepartmentPage from "./pages/DepartmentPage";
import DepartmentQuestionsPage from "./pages/DepartmentQuestionsPage";
import FeedbackFormPage from "./pages/FeedbackFormPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserManagementPage from "./pages/UserManagementPage";
import TestPage from "./pages/TestPage";
import OtpPage from "./pages/OtpPage";
import CategoryPage from "./pages/CategoryPage";
import VisitorsPage from "./pages/VisitorsPage";
import StaffDashboard from "./pages/StaffDashboard";
import DepartmentDashboard from "./pages/DepartmentDashboard";
import ResponseManagementPage from "./pages/ResponseManagementPage";

// Create a new QueryClient instance
const queryClient = new QueryClient();

/**
 * App Component
 * 
 * Sets up the main structure of the application including:
 * - QueryClientProvider for data fetching
 * - TooltipProvider for tooltips
 * - Toasters for notifications
 * - BrowserRouter for routing
 * - AuthProvider for authentication
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Force root to login for all users */}
            <Route path="/" element={<Navigate to="/auth/login" replace />} />

            {/* Auth Routes */}
            <Route path="auth" element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="otp" element={<OtpPage />} />
            </Route>

            {/* Admin Dashboard Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['ADMIN']}>
                    <Layout />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="departments" element={<DepartmentsPage />} />
              <Route path="departments/:departmentId" element={<DepartmentPage />} />
              <Route path="departmentQuestions/:departmentId" element={<DepartmentQuestionsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="reporting" element={<ReportingPage />} />
              <Route path="responses" element={<ResponsesPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="users" element={<UserManagementPage />} />
              <Route path="test" element={<TestPage />} />
              <Route path="categories" element={<CategoryPage />} />
              <Route path="visitors" element={<VisitorsPage />} />
            </Route>

            {/* Staff & Manager Department Dashboard Routes */}
            <Route
              path="/department-dashboard"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['STAFF', 'MANAGER']}>
                    <DepartmentLayout />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<DepartmentDashboard />} />
              <Route path="responses" element={<ResponseManagementPage />} />
              {/* Placeholder for reports page */}
              <Route path="reports" element={<div>Department Reports Page</div>} />
            </Route>

            {/* Fallback for old staffDashboard path */}
            <Route path="staffDashboard" element={<Navigate to="/department-dashboard" replace />} />

            {/* Not Found Route */}
            <Route path="*" element={<NotFound />} />
            
            {/* Redirect legacy paths */}
            <Route path="login" element={<Navigate to="/auth/login" replace />} />
            <Route path="register" element={<Navigate to="/auth/register" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

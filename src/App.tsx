
/**
 * App Component
 * 
 * The root component of the application that sets up routing and global providers.
 * It includes the QueryClient for data fetching and various UI providers.
 */
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import AuthLayout from "./components/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import DepartmentsPage from "./pages/DepartmentsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ReportingPage from "./pages/ReportingPage";
import ResponsesPage from "./pages/ResponsesPage";
import NotificationsPage from "./pages/NotificationsPage";
import DepartmentPage from "./pages/DepartmentPage";
import FeedbackFormPage from "./pages/FeedbackFormPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

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
            {/* Auth Routes */}
            <Route path="auth" element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* Protected Main App Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="departments" element={<DepartmentsPage />} />
              <Route path="departments/:departmentId" element={<DepartmentPage />} />
              <Route path="departments/:departmentId/feedback-form" element={<FeedbackFormPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="reporting" element={<ReportingPage />} />
              <Route path="responses" element={<ResponsesPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Redirect login/register paths to auth routes */}
            <Route path="login" element={<Navigate to="/auth/login" replace />} />
            <Route path="register" element={<Navigate to="/auth/register" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

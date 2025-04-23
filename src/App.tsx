
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ReportingPage from "./pages/ReportingPage";
import ResponsesPage from "./pages/ResponsesPage";
import NotificationsPage from "./pages/NotificationsPage";
import DepartmentPage from "./pages/DepartmentPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="category" element={<CategoryPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="reporting" element={<ReportingPage />} />
            <Route path="responses" element={<ResponsesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="departments/:departmentId" element={<DepartmentPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

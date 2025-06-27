import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  Building2,
  LogOut,
  User,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SentimentPieChart from '@/components/SentimentPieChart';
import FeedbackTypeBarChart from '@/components/FeedbackTypeBarChart';

interface FeedbackData {
  id: number;
  question: string;
  answer: string;
  category: string;
  createdAt: string;
  status: string;
}

interface DepartmentStats {
  totalFeedbacks: number;
  pendingResponses: number;
  completedResponses: number;
  averageRating: number;
  recentFeedbacks: number;
}

const DepartmentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DepartmentStats>({
    totalFeedbacks: 0,
    pendingResponses: 0,
    completedResponses: 0,
    averageRating: 0,
    recentFeedbacks: 0
  });
  const [recentFeedbacks, setRecentFeedbacks] = useState<FeedbackData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary">Pending</Badge>;
      case 'RESPONDED':
        return <Badge variant="default">Responded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'SERVICE_QUALITY':
        return 'Service Quality';
      case 'WAITING_TIME':
        return 'Waiting Time';
      case 'STAFF_BEHAVIOR':
        return 'Staff Behavior';
      case 'FACILITY_CLEANLINESS':
        return 'Facility Cleanliness';
      default:
        return category;
    }
  };

  // Dummy data for charts and clusters (replace with real data as needed)
  const sentimentData = { positive: 13, negative: 13, neutral: 0 };
  const feedbackTypeData = { compliments: 13, suggestions: 0, complaints: 13 };
  const patientClusters = [
    { id: 'Patient-152', category: 'Neutral', lastFeedback: '6/19/2025' },
    { id: 'Patient-103', category: 'Negative', lastFeedback: '6/18/2025' },
    { id: 'Patient-64', category: 'Neutral', lastFeedback: '6/18/2025' },
    { id: 'Patient-61', category: 'Negative', lastFeedback: '6/18/2025' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading department dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          {user?.departmentName} Dashboard
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={16} />
          <span>{new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">All time patients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedbacks</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">26</div>
            <p className="text-xs text-muted-foreground">All time feedbacks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Feedbacks/Patient</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.7</div>
            <p className="text-xs text-muted-foreground">Average per patient</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">Responses sent</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clusters">User Feedback Clusters</TabsTrigger>
          <TabsTrigger value="feedbacks">Feedbacks</TabsTrigger>
          <TabsTrigger value="form">Feedback Form</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SentimentPieChart data={sentimentData} title="Patient Sentiment Distribution" />
            <FeedbackTypeBarChart data={feedbackTypeData} title="Feedback Type Analysis" />
          </div>
        </TabsContent>

        {/* User Feedback Clusters Tab */}
        <TabsContent value="clusters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Feedback Analysis</CardTitle>
              <CardDescription>Clustered feedback by patient</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Feedback</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {patientClusters.map((cluster) => (
                      <tr key={cluster.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{cluster.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cluster.category === 'Negative' ? 'bg-red-100 text-red-700' : cluster.category === 'Neutral' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{cluster.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{cluster.lastFeedback}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button size="sm" variant="outline">View Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedbacks Tab (placeholder) */}
        <TabsContent value="feedbacks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feedbacks</CardTitle>
              <CardDescription>All feedbacks for this department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-400 py-8">No feedbacks available.</div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Form Tab (placeholder) */}
        <TabsContent value="form" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Form</CardTitle>
              <CardDescription>Submit new feedback for this department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-400 py-8">Feedback form coming soon.</div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab (placeholder) */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Advanced analytics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-400 py-8">Analytics coming soon.</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DepartmentDashboard; 
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  ArrowUp, 
  ArrowDown,
  Edit
} from 'lucide-react';
import DashboardCard from '@/components/DashboardCard';
import StatNumber from '@/components/StatNumber';
import FeedbackTypeChart from '@/components/FeedbackTypeChart';
import { departments, feedbacks, chartData } from '@/lib/mockData';

const DepartmentPage: React.FC = () => {
  const { departmentId } = useParams<{ departmentId: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<string>('overview');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const department = departments.find(d => d.id === departmentId);
  
  if (!department) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <h1 className="text-2xl font-bold mb-4">Department Not Found</h1>
        <p className="mb-4">The department you are looking for does not exist.</p>
        <Button asChild>
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const departmentFeedbacks = feedbacks.filter(f => f.departmentId === departmentId);

  // Apply filters
  const filteredFeedbacks = departmentFeedbacks.filter(feedback => {
    if (filterStatus !== 'all' && feedback.status !== filterStatus) return false;
    if (filterType !== 'all' && feedback.type !== filterType) return false;
    return true;
  });

  const handleEditFeedbackForm = () => {
    navigate(`/departments/${departmentId}/feedback-form`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{department.name} Department</h1>
        <Button>Add New Feedback</Button>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="feedbacks">Feedbacks</TabsTrigger>
          <TabsTrigger value="feedbackForm">Feedback Form</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <DashboardCard title="Total Feedback">
              <StatNumber 
                value={department.totalFeedback.toLocaleString()} 
                valueClassName="text-med-blue" 
                label="Total feedback received"
              />
            </DashboardCard>
            
            <DashboardCard title="Feedback Distribution">
              <div className="flex justify-between space-x-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-feedback-complaint rounded-full mb-1"></div>
                  <span className="text-xl font-bold">{department.feedbackByType.complaints}</span>
                  <span className="text-xs text-gray-500">Complaints</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-feedback-suggestion rounded-full mb-1"></div>
                  <span className="text-xl font-bold">{department.feedbackByType.suggestions}</span>
                  <span className="text-xs text-gray-500">Suggestions</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-feedback-compliment rounded-full mb-1"></div>
                  <span className="text-xl font-bold">{department.feedbackByType.compliments}</span>
                  <span className="text-xs text-gray-500">Compliments</span>
                </div>
              </div>
            </DashboardCard>
            
            <DashboardCard title="Response Rate">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-green-600">92%</span>
                <span className="text-sm text-gray-500">Average response time: 6 hours</span>
              </div>
            </DashboardCard>
          </div>
          
          <DashboardCard title="Feedback Trends" className="h-[350px]">
            <FeedbackTypeChart data={chartData} />
          </DashboardCard>
        </TabsContent>
        
        <TabsContent value="feedbacks">
          <Card>
            <CardHeader className="pb-0">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input type="search" placeholder="Search feedbacks..." className="pl-8" />
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="complaint">Complaints</SelectItem>
                      <SelectItem value="suggestion">Suggestions</SelectItem>
                      <SelectItem value="compliment">Compliments</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          Type
                          <ArrowUp className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          Status
                          <ArrowDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          Date
                          <ArrowDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFeedbacks.slice(0, 10).map((feedback) => (
                      <TableRow key={feedback.id}>
                        <TableCell className="font-medium">{feedback.id.split('-')[1]}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              feedback.type === 'complaint' ? 'bg-feedback-complaint text-white' : 
                              feedback.type === 'suggestion' ? 'bg-feedback-suggestion text-white' : 
                              'bg-feedback-compliment text-white'
                            }
                          >
                            {feedback.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{feedback.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{feedback.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={
                              feedback.priority === 'urgent' ? 'border-red-500 text-red-500' : 
                              feedback.priority === 'high' ? 'border-orange-500 text-orange-500' : 
                              feedback.priority === 'medium' ? 'border-yellow-500 text-yellow-500' : 
                              'border-green-500 text-green-500'
                            }
                          >
                            {feedback.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(feedback.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{" "}
                  <span className="font-medium">{filteredFeedbacks.length}</span> results
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedbackForm">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Feedback Form Questions</CardTitle>
              <Button onClick={handleEditFeedbackForm} className="flex items-center gap-2">
                <Edit size={16} />
                Edit Questions
              </Button>
            </CardHeader>
            <CardContent>
              {department.questions && department.questions.length > 0 ? (
                <div className="space-y-6">
                  <p className="text-muted-foreground mb-4">
                    These questions will be displayed to patients when they submit feedback for this department.
                  </p>
                  
                  <div className="border rounded-md p-4 space-y-4">
                    {department.questions.map((question, index) => (
                      <div key={question.id} className="pb-4 border-b last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{index + 1}. {question.text}</p>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline">{question.type}</Badge>
                              {question.required && <Badge>Required</Badge>}
                            </div>
                          </div>
                        </div>
                        
                        {question.options && question.options.length > 0 && (
                          <div className="mt-2 pl-4">
                            <p className="text-sm text-gray-500 mb-1">Options:</p>
                            <ul className="list-disc pl-5 text-sm">
                              {question.options.map((option, i) => (
                                <li key={i}>{option}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No custom questions have been created for this department yet.
                  </p>
                  <Button onClick={handleEditFeedbackForm}>Create Questions</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed analytics for the {department.name} department will be shown here.
                This includes feedback trends, response times, and performance metrics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Department Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configure settings specific to the {department.name} department.
                This includes notification preferences, response templates, and team management.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DepartmentPage;

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Clock, CheckCircle, AlertCircle, MessageSquare, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface Feedback {
  id: string;
  category: string;
  message: string;
  priority: string;
  status: string;
  patientId: number;
  createdAt: string;
  modifiedAt: string;
  reply: string;
  departmentId: number;
}

interface Department {
  id: number;
  name: string;
}

const ResponsesPage: React.FC = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [response, setResponse] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [forwarding, setForwarding] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [showDepartmentSelect, setShowDepartmentSelect] = useState(false);
  const [isEditingResponse, setIsEditingResponse] = useState(false);

  const BASE_URL = "http://localhost:8089/api";

  useEffect(() => {
    loadData();
  }, []);

  // Check if we have a specific feedback ID or patientId from navigation state
  useEffect(() => {
    if (feedbacks.length > 0) {
      let feedbackToSelect = null;
      
      console.log('Location state:', location.state);
      console.log('Available feedbacks:', feedbacks.map(f => ({ id: f.id, patientId: f.patientId, category: f.category })));
      
      // First check for selectedFeedbackId (for backward compatibility)
      if (location.state?.selectedFeedbackId) {
        feedbackToSelect = feedbacks.find(f => f.id === location.state.selectedFeedbackId);
        console.log('Found feedback by ID:', feedbackToSelect);
      }
      // Then check for patientId (new notification flow)
      else if (location.state?.patientId) {
        console.log('Looking for patientId:', location.state.patientId);
        
        // Try different comparison methods to handle type mismatches
        const patientFeedbacks = feedbacks.filter(f => {
          // Convert both to strings for comparison
          const feedbackPatientId = f.patientId.toString();
          const notificationPatientId = location.state.patientId.toString();
          
          console.log(`Comparing feedback patientId: ${feedbackPatientId} with notification patientId: ${notificationPatientId}`);
          
          return feedbackPatientId === notificationPatientId;
        });
        
        console.log('Found patient feedbacks:', patientFeedbacks);
        
        if (patientFeedbacks.length > 0) {
          // Sort by creation date and get the most recent
          feedbackToSelect = patientFeedbacks.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];
          console.log('Selected most recent feedback:', feedbackToSelect);
        }
      }
      
      if (feedbackToSelect) {
        setSelectedFeedback(feedbackToSelect);
        console.log('Set selected feedback:', feedbackToSelect);
      } else {
        console.log('No feedback found to select');
      }
    }
  }, [location.state, feedbacks]);

  // When a feedback is selected, set response to its reply (if any)
  useEffect(() => {
    if (selectedFeedback) {
      setResponse(selectedFeedback.reply || '');
    }
  }, [selectedFeedback]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [responsesRes, departmentsRes] = await Promise.all([
        axios.get(`${BASE_URL}/responses/all`),
        axios.get(`${BASE_URL}/departments/all`)
      ]);
      
      setFeedbacks(responsesRes.data);
      setDepartments(departmentsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load feedback data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NEW':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'IN-PROGRESS':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'RESOLVED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'CLOSED':
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'complaint':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'suggestion':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'compliment':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDepartmentName = (departmentId: number) => {
    const dept = departments.find(d => d.id === departmentId);
    return dept ? dept.name : 'Unknown Department';
  };

  // Helper to check if date is today or yesterday
  const getDisplayDate = (dateString: string, status?: string) => {
    if (status && status.toUpperCase() === 'NEW') return 'Not Responded';
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();
    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
    return date.toLocaleDateString();
  };

  // Priority color (styled like category/status)
  const getPriorityColor = (priority: string) => {
    if (!priority) return 'bg-gray-100 text-gray-800 border-gray-200';
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'bg-red-300 text-red-800 border-red-800';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Helper to truncate message to a single line with ellipsis
  const getTruncatedMessage = (message: string, maxLength = 40) => {
    if (message.length <= maxLength) return message;
    // Try to cut at the last space before maxLength
    const truncated = message.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 0) {
      return truncated.slice(0, lastSpace) + ' ...';
    }
    return truncated + ' ...';
  };

  const getTruncatedReply = (reply: string, maxLength = 60) => {
    if (reply.length <= maxLength) return reply;
    // Try to cut at the last space before maxLength
    const truncated = reply.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 0) {
      return truncated.slice(0, lastSpace) + ' ...';
    }
    return truncated + ' ...';
  };

  // Add priority filter and sort by most recent (createdAt desc)
  const filteredFeedbacks = feedbacks
    .filter(feedback => {
      const statusMatch = statusFilter === 'all' || feedback.status === statusFilter;
      const typeMatch = typeFilter === 'all' || feedback.category.toUpperCase() === typeFilter;
      // If filtering by priority, ignore feedbacks with null/empty priority
      if (priorityFilter !== 'all') {
        if (!feedback.priority) return false;
        return statusMatch && typeMatch && feedback.priority.toUpperCase() === priorityFilter;
      }
      return statusMatch && typeMatch;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleForwardToDepartment = async () => {
    if (!selectedFeedback || !selectedDepartment) {
      toast({
        title: 'Error',
        description: 'Please select a department to forward to.',
        variant: 'destructive',
      });
      return;
    }
    setForwarding(true);
    try {
      if (selectedFeedback.category.toUpperCase() === 'COMPLIMENT') {
        await axios.put(
          `${BASE_URL}/responses/closed-by-department?id=${selectedFeedback.id}&departmentId=${selectedDepartment.id}`
          
        );
        toast({
          title: 'Feedback Closed',
          description: `Compliment feedback closed by department: ${selectedDepartment.name}.`,
        });
      } else {
        await axios.put(
          `${BASE_URL}/responses/forward-to-department?id=${selectedFeedback.id}&departmentId=${selectedDepartment.id}`
        );
        toast({
          title: 'Feedback Forwarded',
          description: `Feedback forwarded to ${selectedDepartment.name} and marked as resolved by department.`,
        });
      }
      setSelectedFeedback(null);
      setSelectedDepartment(null);
      setResponse('');
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to forward feedback.',
        variant: 'destructive',
      });
    } finally {
      setForwarding(false);
    }
  };

  const handleResolveFeedback = async () => {
    if (!selectedFeedback || !response.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a response.',
        variant: 'destructive',
      });
      return;
    }
    setForwarding(true);
    try {
      if (selectedFeedback.category.toUpperCase() === 'COMPLIMENT') {
        await axios.put(
          `${BASE_URL}/responses/closed-by-admin?id=${selectedFeedback.id}&reply=${response}`
          
        );
        toast({
          title: 'Feedback Closed',
          description: 'Compliment feedback closed by admin.',
        });
      } else {
        await axios.put(
          `${BASE_URL}/responses/resolved-by-admin?id=${selectedFeedback.id}&reply=${response}`
          
        );
        toast({
          title: 'Feedback Resolved',
          description: 'Feedback resolved by admin.',
        });
      }
      setSelectedFeedback(null);
      setResponse('');
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resolve feedback.',
        variant: 'destructive',
      });
    } finally {
      setForwarding(false);
    }
  };

  const handleCloseResponse = async () => {
    if (!selectedFeedback || !response.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a response.',
        variant: 'destructive',
      });
      return;
    }
    setForwarding(true);
    try {
      await axios.put(
        `${BASE_URL}/responses/close-response?id=${selectedFeedback.id}&reply=${response}`
        
      );
      toast({
        title: 'Response Closed',
        description: 'Response has been closed successfully.',
      });
      setSelectedFeedback(null);
      setResponse('');
      setIsEditingResponse(false);
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to close response.',
        variant: 'destructive',
      });
    } finally {
      setForwarding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-500">Please wait while loading responses!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Feedback Responses</h1>
      </div>

      <div className="flex gap-4 mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="COMPLAINT">Complaints</SelectItem>
            <SelectItem value="SUGGESTION">Suggestions</SelectItem>
            <SelectItem value="COMPLIMENT">Compliments</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="URGENT">Urgent</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Feedback List ({filteredFeedbacks.length})</h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredFeedbacks.map((feedback) => (
              <Card 
                key={feedback.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${selectedFeedback?.id === feedback.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedFeedback(feedback)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(feedback.category)}>
                        {feedback.category.toUpperCase()}
                      </Badge>
                      {/* Only show priority badge if priority is present */}
                      {feedback.priority && (
                        <Badge className={getPriorityColor(feedback.priority)}>
                          {feedback.priority.charAt(0).toUpperCase() + feedback.priority.slice(1)}
                        </Badge>
                      )}
                      <Badge className={getStatusColor(feedback.status)}>
                        {getStatusIcon(feedback.status)}
                        {feedback.status.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      {getDisplayDate(feedback.createdAt)}
                    </span>
                  </div>
                  
                  <h3 className="font-medium mb-1">{getTruncatedMessage(feedback.message)}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{getTruncatedReply(feedback.reply || 'No response yet')}</p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Modified: {getDisplayDate(feedback.modifiedAt)}</span>
                    <span>Patient: {feedback.patientId}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Response Details</h2>
          {selectedFeedback ? (
            <Card>
              <CardHeader>
                <div className="flex justify-end items-start">
                  <div className="flex gap-2">
                    {/* Only show priority badge if present */}
                    {selectedFeedback.priority && (
                      <Badge className={getPriorityColor(selectedFeedback.priority)}>
                        {selectedFeedback.priority.charAt(0).toUpperCase() + selectedFeedback.priority.slice(1)}
                      </Badge>
                    )}
                    <Badge className={getStatusColor(selectedFeedback.status)}>
                      {getStatusIcon(selectedFeedback.status)}
                      {selectedFeedback.status.toUpperCase()}
                    </Badge>
                    <Badge className={getTypeColor(selectedFeedback.category)}>
                      {selectedFeedback.category.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Comment</h4>
                  <p className="text-sm text-gray-700">{selectedFeedback.message}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Patient ID:</span>
                    <p>{selectedFeedback.patientId}</p>
                  </div>
                  <div>
                    <span className="font-medium">Department:</span>
                    <p>{getDepartmentName(selectedFeedback.departmentId)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Created:</span>
                    <p>{getDisplayDate(selectedFeedback.createdAt)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Responded:</span>
                    <p>{getDisplayDate(selectedFeedback.modifiedAt, selectedFeedback.status)}</p>
                  </div>
                </div>
                {/* Forward to Department logic for NEW feedbacks */}
                {selectedFeedback.status.toUpperCase() === 'NEW' && (
                  <div className="space-y-2">
                    {!selectedDepartment ? (
                      <>
                        <Select value={''} onValueChange={val => {
                          const dept = departments.find(d => d.id === Number(val));
                          setSelectedDepartment(dept || null);
                        }}>
                          <SelectTrigger className="w-full flex items-center gap-2">
                            <SelectValue placeholder="Foward To Department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map(dept => (
                              <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          onClick={handleForwardToDepartment}
                          className="w-full flex items-center gap-2"
                          disabled={forwarding}
                        >
                          <ArrowRight className="h-4 w-4" />
                          {`Forward To ${selectedDepartment.name}`}
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedDepartment(null);
                            setResponse('');
                          }}
                          className="w-full"
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* IN_PROGRESS status - hide response input and show waiting message */}
                {selectedFeedback.status.toUpperCase() === 'IN_PROGRESS' && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      This feedback is forwarded and waiting to be responded by {getDepartmentName(selectedFeedback.departmentId)} department.
                    </p>
                  </div>
                )}
                
                {/* CLOSED status - read-only response with department message */}
                {selectedFeedback.status.toUpperCase() === 'CLOSED' && (
                  <div className="space-y-8">
                    <div>
                  <h4 className="font-medium mb-2">Response</h4>
                  <p className="text-sm text-gray-700">{response}</p>
                </div>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-800">
                        {getDepartmentName(selectedFeedback.departmentId) === 'Unknown Department' 
                          ? 'This feedback is resolved by Health Administrator'
                          : `This feedback is resolved by ${getDepartmentName(selectedFeedback.departmentId)} department.`
                        }
                      </p>
                      <p className="text-sm text-blue-800 mt-1">
                        And closed by Health Administrator
                      </p>
                    </div>
                  </div>
                )}
                
                {/* RESOLVED status - read-only with edit capability */}
                {selectedFeedback.status.toUpperCase() === 'RESOLVED' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Response</label>
                        <Button
                          onClick={() => setIsEditingResponse(!isEditingResponse)}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Button>
                      </div>
                      <Textarea
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        readOnly={!isEditingResponse}
                        className={!isEditingResponse ? "bg-gray-50" : ""}
                        rows={4}
                      />
                    </div>
                    <Button onClick={handleCloseResponse} className="w-full flex items-center gap-2" disabled={forwarding}>
                      <Send className="h-4 w-4" />
                      Close Response
                    </Button>
                  </div>
                )}
                
                {/* Default response input for other statuses */}
                {!(selectedFeedback.status.toUpperCase() === 'NEW' && selectedDepartment) && 
                 selectedFeedback.status.toUpperCase() !== 'IN_PROGRESS' &&
                 selectedFeedback.status.toUpperCase() !== 'CLOSED' &&
                 selectedFeedback.status.toUpperCase() !== 'RESOLVED' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Response</label>
                    <Textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder={selectedFeedback.reply ? '' : 'Respond here...'}
                      rows={4}
                    />
                  </div>
                )}
                
                {/* Button logic */}
                <div className="space-y-2">
                  {/* Only show resolve button if not forwarding to department and not in special statuses */}
                  {!(selectedFeedback.status.toUpperCase() === 'NEW' && selectedDepartment) && 
                   selectedFeedback.status.toUpperCase() !== 'IN_PROGRESS' &&
                   selectedFeedback.status.toUpperCase() !== 'CLOSED' &&
                   selectedFeedback.status.toUpperCase() !== 'RESOLVED' && (
                    <Button onClick={handleResolveFeedback} className="w-full flex items-center gap-2" disabled={forwarding}>
                      <Send className="h-4 w-4" />
                      Resolve Feedback
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a feedback to view details and respond</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponsesPage;

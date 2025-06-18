
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Clock, CheckCircle, AlertCircle, MessageSquare, Send } from 'lucide-react';
import { feedbacks, departments } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

const ResponsesPage: React.FC = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [response, setResponse] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Check if we have a specific feedback ID from navigation state
  useEffect(() => {
    if (location.state?.selectedFeedbackId) {
      const feedback = feedbacks.find(f => f.id === location.state.selectedFeedbackId);
      if (feedback) {
        setSelectedFeedback(feedback);
      }
    }
  }, [location.state]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
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

  const getDepartmentName = (departmentId: string) => {
    const dept = departments.find(d => d.id === departmentId);
    return dept ? dept.name : 'Unknown Department';
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const statusMatch = statusFilter === 'all' || feedback.status === statusFilter;
    const typeMatch = typeFilter === 'all' || feedback.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const handleForwardToDepartment = (feedback) => {
    toast({
      title: "Feedback Forwarded",
      description: `Feedback has been forwarded to ${getDepartmentName(feedback.departmentId)} department. Status changed to In Progress.`,
    });
    
    // Update the selected feedback to reflect the status change
    if (selectedFeedback?.id === feedback.id) {
      setSelectedFeedback({ ...selectedFeedback, status: 'in-progress' });
    }
    
    console.log(`Forwarding feedback ${feedback.id} to department ${feedback.departmentId}`);
  };

  const handleSendResponse = () => {
    if (!selectedFeedback || !response.trim()) {
      toast({
        title: "Error",
        description: "Please select feedback and enter a response.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Response Sent",
      description: "Your response has been sent successfully.",
    });

    setResponse('');
    setSelectedFeedback(null);
  };

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
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="complaint">Complaints</SelectItem>
            <SelectItem value="suggestion">Suggestions</SelectItem>
            <SelectItem value="compliment">Compliments</SelectItem>
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
                      <Badge className={getTypeColor(feedback.type)}>
                        {feedback.type.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(feedback.status)}>
                        {getStatusIcon(feedback.status)}
                        {feedback.status.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="font-medium mb-1">{feedback.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{feedback.description}</p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Department: {getDepartmentName(feedback.departmentId)}</span>
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
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{selectedFeedback.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getTypeColor(selectedFeedback.type)}>
                      {selectedFeedback.type.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(selectedFeedback.status)}>
                      {getStatusIcon(selectedFeedback.status)}
                      {selectedFeedback.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Feedback Details</h4>
                  <p className="text-sm text-gray-700">{selectedFeedback.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Department:</span>
                    <p>{getDepartmentName(selectedFeedback.departmentId)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Patient ID:</span>
                    <p>{selectedFeedback.patientId}</p>
                  </div>
                  <div>
                    <span className="font-medium">Priority:</span>
                    <p className="capitalize">{selectedFeedback.priority}</p>
                  </div>
                  <div>
                    <span className="font-medium">Created:</span>
                    <p>{new Date(selectedFeedback.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Response</label>
                  <Textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Type your response here..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  {selectedFeedback.status === 'new' && (
                    <Button 
                      onClick={() => handleForwardToDepartment(selectedFeedback)}
                      className="w-full flex items-center gap-2"
                      variant="outline"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Forward to Department
                    </Button>
                  )}

                  <Button onClick={handleSendResponse} className="w-full flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Send Response
                  </Button>
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

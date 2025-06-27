import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Send,
  Building2,
  User
} from 'lucide-react';

interface ForwardedFeedback {
  id: number;
  question: string;
  answer: string;
  category: string;
  patientName: string;
  forwardedBy: string;
  forwardedAt: string;
  status: 'PENDING' | 'RESPONDED';
  departmentResponse?: string;
  respondedAt?: string;
}

const ResponseManagementPage = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState<ForwardedFeedback[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<ForwardedFeedback | null>(null);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.departmentId) return;
    setIsLoading(true);
    console.log('Fetching responses for departmentId:', user.departmentId);
    fetch(`http://localhost:8089/api/responses/department?departmentId=${user.departmentId}`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched data:', data);
        // Map backend data to ForwardedFeedback[] without overwriting status
        const mapped = data.map((item: any) => ({
          id: item.id,
          question: item.message || '',
          answer: item.reply || '',
          category: item.category || '',
          patientName: item.patientName || 'N/A',
          forwardedBy: item.forwardedBy || 'admin',
          forwardedAt: item.createdAt || new Date().toISOString(),
          status: item.status, // do not overwrite, use as is
          departmentResponse: item.reply || '',
          respondedAt: item.modifiedAt || null,
        }));
        setFeedbacks(mapped);
        console.log('Mapped feedbacks:', mapped);
      })
      .catch((err) => { console.error('Fetch error:', err); setFeedbacks([]); })
      .finally(() => setIsLoading(false));
  }, [user?.departmentId]);

  const handleResponse = async () => {
    if (!selectedFeedback || !response.trim()) return;
    setIsLoading(true);
    try {
      await fetch(`http://localhost:8089/api/responses/resolved-by-department?id=${selectedFeedback.id}&reply=${encodeURIComponent(response)}`, {
        method: 'PUT',
      });
      // Refetch feedbacks after reply
      if (user?.departmentId) {
        const res = await fetch(`http://localhost:8089/api/responses/department?departmentId=${user.departmentId}`);
        const data = await res.json();
        setFeedbacks(data);
      }
      setSelectedFeedback(null);
      setResponse('');
    } catch (e) {
      // Optionally show error
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>;
      case 'RESPONDED':
        return <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Responded
        </Badge>;
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

  // Filtering with case-insensitive status
  const pendingFeedbacks = feedbacks.filter(f => f.status && f.status.toUpperCase() === 'IN_PROGRESS');
  const respondedFeedbacks = feedbacks.filter(f => f.status && f.status.toUpperCase() === 'RESOLVED');
  console.log('Pending:', pendingFeedbacks);
  console.log('Responded:', respondedFeedbacks);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading responses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Response Management
                </h1>
                <p className="text-sm text-gray-500">
                  {user?.departmentName || 'Department'} - Respond to forwarded feedbacks
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">{user?.username}</span>
              <Badge variant="outline">{user?.role}</Badge>
              {user?.departmentName && (
                <Badge variant="secondary">{user.departmentName}</Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feedbacks List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Responses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Pending Responses ({pendingFeedbacks.length})
                </CardTitle>
                <CardDescription>
                  Feedbacks that require your attention and response
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingFeedbacks.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">No pending feedbacks.</div>
                  ) : (
                    pendingFeedbacks.map((feedback) => (
                      <div 
                        key={feedback.id} 
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedFeedback?.id === feedback.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedFeedback(feedback)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{feedback.question}</h4>
                            <p className="text-sm text-gray-600 mt-1">{feedback.answer}</p>
                          </div>
                          {getStatusBadge(feedback.status)}
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>Patient: {feedback.patientName}</span>
                          <span>{new Date(feedback.forwardedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-2">
                          <Badge variant="outline">{getCategoryLabel(feedback.category)}</Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Responded Feedbacks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Responded Feedbacks ({respondedFeedbacks.length})
                </CardTitle>
                <CardDescription>
                  Feedbacks you have already responded to
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {respondedFeedbacks.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">No responded feedbacks.</div>
                  ) : (
                    respondedFeedbacks.map((feedback) => (
                      <div key={feedback.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{feedback.question}</h4>
                            <p className="text-sm text-gray-600 mt-1">{feedback.answer}</p>
                          </div>
                          {getStatusBadge(feedback.status)}
                        </div>
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                          <p className="text-sm font-medium text-green-800 mb-1">Your Response:</p>
                          <p className="text-sm text-green-700">{feedback.departmentResponse}</p>
                          <p className="text-xs text-green-600 mt-2">
                            Responded on {new Date(feedback.respondedAt!).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Response Panel */}
          <div className="space-y-6">
            {selectedFeedback ? (
              <Card>
                <CardHeader>
                  <CardTitle>Respond to Feedback</CardTitle>
                  <CardDescription>
                    Provide a response to the selected feedback
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Question</Label>
                    <p className="text-sm text-gray-600 mt-1">{selectedFeedback.question}</p>
                  </div>
                  <div>
                    <Label>Patient Response</Label>
                    <p className="text-sm text-gray-600 mt-1">{selectedFeedback.answer}</p>
                  </div>
                  <div>
                    <Label htmlFor="response">Your Response</Label>
                    <Textarea
                      id="response"
                      placeholder="Enter your response to this feedback..."
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleResponse}
                      disabled={!response.trim()}
                      className="flex-1"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Response
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedFeedback(null);
                        setResponse('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Response Panel</CardTitle>
                  <CardDescription>
                    Select a feedback to respond
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                    <p>Select a feedback from the list to respond</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Department Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Department Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <Label className="text-sm font-medium">Department</Label>
                  <p className="text-sm text-gray-600">{user?.departmentName || 'Not assigned'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Your Role</Label>
                  <p className="text-sm text-gray-600">{user?.role}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Feedbacks</Label>
                  <p className="text-sm text-gray-600">{feedbacks.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResponseManagementPage; 

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, Save } from 'lucide-react';
import { feedbacks } from '@/lib/mockData';

const ResponsesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  
  const pendingFeedbacks = feedbacks.filter(
    f => f.status === "new" || f.status === "in-progress"
  );
  
  const resolvedFeedbacks = feedbacks.filter(
    f => f.status === "resolved" || f.status === "closed"
  );
  
  const currentFeedbacks = activeTab === "pending" ? pendingFeedbacks : resolvedFeedbacks;
  
  const selected = selectedFeedback 
    ? feedbacks.find(f => f.id === selectedFeedback) 
    : null;
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Responses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Feedbacks</CardTitle>
              <div className="text-sm text-gray-500">{currentFeedbacks.length} total</div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>
              
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Search feedbacks..." className="pl-8" />
              </div>
              
              <div className="space-y-2 max-h-[500px] overflow-auto">
                {currentFeedbacks.slice(0, 10).map((feedback) => (
                  <div
                    key={feedback.id}
                    className={`p-3 border rounded-md cursor-pointer ${
                      selectedFeedback === feedback.id
                        ? "border-med-blue bg-med-blue/10"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedFeedback(feedback.id)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-sm">{feedback.title}</h3>
                      <Badge 
                        className={
                          feedback.type === 'complaint' ? 'bg-feedback-complaint text-white' : 
                          feedback.type === 'suggestion' ? 'bg-feedback-suggestion text-white' : 
                          'bg-feedback-compliment text-white'
                        }
                      >
                        {feedback.type}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="outline">{feedback.status}</Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          {selected ? (
            <>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{selected.title}</CardTitle>
                  <Badge 
                    className={
                      selected.type === 'complaint' ? 'bg-feedback-complaint text-white' : 
                      selected.type === 'suggestion' ? 'bg-feedback-suggestion text-white' : 
                      'bg-feedback-compliment text-white'
                    }
                  >
                    {selected.type}
                  </Badge>
                </div>
                <div className="flex gap-2 text-sm text-gray-500">
                  <span>Patient ID: {selected.patientId}</span>
                  <span>•</span>
                  <span>Created: {new Date(selected.createdAt).toLocaleDateString()}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-md border">
                  <h3 className="font-medium mb-2">Feedback Details</h3>
                  <p className="text-gray-700">{selected.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Status</h3>
                    <div className="flex gap-2">
                      {["new", "in-progress", "resolved", "closed"].map((status) => (
                        <Badge 
                          key={status} 
                          variant={selected.status === status ? "default" : "outline"}
                          className={selected.status === status ? "bg-med-blue" : ""}
                        >
                          {status}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Priority</h3>
                    <div className="flex gap-2">
                      {["low", "medium", "high", "urgent"].map((priority) => (
                        <Badge 
                          key={priority} 
                          variant="outline"
                          className={
                            selected.priority === priority
                              ? selected.priority === 'urgent'
                                ? 'border-red-500 text-red-500 bg-red-50'
                                : selected.priority === 'high'
                                ? 'border-orange-500 text-orange-500 bg-orange-50'
                                : selected.priority === 'medium'
                                ? 'border-yellow-500 text-yellow-500 bg-yellow-50'
                                : 'border-green-500 text-green-500 bg-green-50'
                              : ''
                          }
                        >
                          {priority}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Response</h3>
                  <Textarea
                    placeholder="Type your response here..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Mark as Resolved</Button>
                  <Button className="flex gap-2">
                    <Save size={16} />
                    <span>Save Response</span>
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex items-center justify-center h-[400px] text-gray-500">
              Select a feedback to view and respond
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ResponsesPage;

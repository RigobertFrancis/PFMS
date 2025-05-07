
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Eye, 
  ArrowUp, 
  ArrowDown,
  Star,
  StarHalf,
  Download
} from 'lucide-react';
import { visitors, visitorFeedbacks } from '@/lib/mockData';

const VisitorsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState<string>('feedbacks');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Filter visitors based on search query
  const filteredVisitors = searchQuery 
    ? visitors.filter(v => 
        v.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        v.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : visitors;
  
  // Filter visitor feedbacks based on search query
  const filteredFeedbacks = searchQuery
    ? visitorFeedbacks.filter(f => {
        const visitor = visitors.find(v => v.id === f.visitorId);
        return visitor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               visitor?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               f.comments.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : visitorFeedbacks;
  
  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="text-yellow-500 fill-yellow-500" size={16} />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="text-yellow-500 fill-yellow-500" size={16} />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-gray-300" size={16} />);
    }
    
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Visitors Feedback</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Export Data
          </Button>
          <Button>Add Visitor Feedback</Button>
        </div>
      </div>
      
      <div className="relative w-full max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <Input
          className="pl-10"
          placeholder="Search visitors or feedback..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="feedbacks">Visitor Feedbacks</TabsTrigger>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="form">Feedback Form</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feedbacks">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Feedback Submissions</CardTitle>
              <CardDescription>
                Review feedback submitted by hospital visitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Visitor</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead className="hidden md:table-cell">Experience</TableHead>
                      <TableHead className="hidden md:table-cell">Cleanliness</TableHead>
                      <TableHead className="hidden md:table-cell">Staff</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFeedbacks.slice(0, 10).map((feedback) => {
                      const visitor = visitors.find(v => v.id === feedback.visitorId);
                      return (
                        <TableRow key={feedback.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{visitor?.name || 'Anonymous'}</div>
                              <div className="text-sm text-gray-500">{visitor?.relationship}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {feedback.purpose.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {renderStarRating(feedback.experience)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {renderStarRating(feedback.cleanliness)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {renderStarRating(feedback.staff)}
                          </TableCell>
                          <TableCell>
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <Eye size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">10</span> of{" "}
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
        
        <TabsContent value="visitors">
          <Card>
            <CardHeader>
              <CardTitle>Visitors Directory</CardTitle>
              <CardDescription>
                View and manage visitor information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden md:table-cell">Phone</TableHead>
                      <TableHead>Relationship</TableHead>
                      <TableHead>Date Added</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVisitors.slice(0, 10).map((visitor) => (
                      <TableRow key={visitor.id}>
                        <TableCell className="font-medium">{visitor.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{visitor.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{visitor.phone}</TableCell>
                        <TableCell>{visitor.relationship}</TableCell>
                        <TableCell>
                          {new Date(visitor.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">10</span> of{" "}
                  <span className="font-medium">{filteredVisitors.length}</span> results
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
        
        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Feedback Form</CardTitle>
              <CardDescription>
                Customize the questions that visitors will be asked
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Current Questions</h3>
                  <div className="space-y-4">
                    <div className="border-b pb-3">
                      <p className="mb-1">1. What was the purpose of your visit?</p>
                      <div className="text-sm text-gray-500">Type: Select</div>
                      <div className="text-sm text-gray-500">Options: Visiting a patient, Accompanying a patient, Other</div>
                    </div>
                    
                    <div className="border-b pb-3">
                      <p className="mb-1">2. How would you rate your overall experience?</p>
                      <div className="text-sm text-gray-500">Type: Rating (1-5)</div>
                    </div>
                    
                    <div className="border-b pb-3">
                      <p className="mb-1">3. How would you rate the cleanliness of our facilities?</p>
                      <div className="text-sm text-gray-500">Type: Rating (1-5)</div>
                    </div>
                    
                    <div className="border-b pb-3">
                      <p className="mb-1">4. How would you rate your interaction with our staff?</p>
                      <div className="text-sm text-gray-500">Type: Rating (1-5)</div>
                    </div>
                    
                    <div>
                      <p className="mb-1">5. Do you have any additional comments or suggestions?</p>
                      <div className="text-sm text-gray-500">Type: Text</div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-3">Add New Question</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Question Text</label>
                      <Input placeholder="Enter question text" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Question Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select question type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text Input</SelectItem>
                          <SelectItem value="rating">Rating (1-5)</SelectItem>
                          <SelectItem value="select">Dropdown Select</SelectItem>
                          <SelectItem value="radio">Radio Buttons</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="required"
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor="required" className="text-sm font-medium">
                        This question is required
                      </label>
                    </div>
                    
                    <Button>Add Question</Button>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button className="ml-auto">Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VisitorsPage;

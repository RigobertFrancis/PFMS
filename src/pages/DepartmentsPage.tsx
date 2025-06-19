import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Trash2, LayoutDashboard, MessageSquare, FileText, ChartBar, Settings, Plus } from 'lucide-react';
// import { Department, Question } from '@/lib/types';
import { toast } from 'sonner';
import axios from "axios";
import { error } from 'console';

interface Department {
  id: number;
  name: string;
  description: string;
  totalFeedback: number;
  feedbackByType: {
    complaints: number;
    suggestions: number;
    compliments: number;
  };
  priority: string;
}

const DepartmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [departmentsList, setDepartmentsList] = useState<Department[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const {id} = useParams()
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
    priority: 'MEDIUM',
    questions: []
  });
  const [newQuestion, setNewQuestion] = useState({
    questionText: '',
    questionType: 'TEXT' as 'TEXT' | 'RATING' | 'DROPDOWN' | 'RADIO',
    required: false,
  });

  const DEPARTMENT_URL = "http://localhost:8089/api/departments";
  const FEEDBACK_URL = "http://localhost:8089/api/feedbacks";

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const result = await axios.get(`${DEPARTMENT_URL}/all`);
      console.log('API Response:', result.data);

      // Handle different response structures
      const departmentsData = Array.isArray(result.data) 
        ? result.data 
        : result.data.departments || [];

      if (!Array.isArray(departmentsData)) {
        console.error('Invalid API response structure:', result.data);
        setError('Invalid response format from server');
        return;
      }

      const departments = await Promise.all(
        departmentsData.map(async (dept: Department) => {
          try {
            const [complaints, suggestions, compliments] = await Promise.all([
              axios.get(`${FEEDBACK_URL}/department/complaint_feedback?departmentId=${dept.id}`),
              axios.get(`${FEEDBACK_URL}/department/suggestion_feedback?departmentId=${dept.id}`),
              axios.get(`${FEEDBACK_URL}/department/compliment_feedback?departmentId=${dept.id}`)
            ]);

            // Ensure we're getting numbers from the responses
            const complaintsCount = typeof complaints.data === 'object' ? complaints.data.length : Number(complaints.data);
            const suggestionsCount = typeof suggestions.data === 'object' ? suggestions.data.length : Number(suggestions.data);
            const complimentsCount = typeof compliments.data === 'object' ? compliments.data.length : Number(compliments.data);

            // Calculate total feedback
            const totalFeedback = complaintsCount + suggestionsCount + complimentsCount;

            return {
              ...dept,
              totalFeedback,
              feedbackByType: {
                complaints: complaintsCount,
                suggestions: suggestionsCount,
                compliments: complimentsCount
              }
            };
          } catch (err) {
            console.error(`Error loading feedback for department ${dept.id}:`, err);
            return {
              ...dept,
              totalFeedback: 0,
              feedbackByType: {
                complaints: 0,
                suggestions: 0,
                compliments: 0
              }
            };
          } finally {
            setLoading(false);
          } 
        })
      );
      console.log('Processed departments data:', departments);
      setDepartmentsList(departments);
    } catch (err) {
      console.error('Error loading departments:', err);
      setError('Failed to load departments');
    }
  };

  const deleteDepartment = async (id: number) => {
    try {
      await axios.delete(`${DEPARTMENT_URL}/remove/${id}`);
      await loadDepartments();
      toast.success("Department deleted successfully");
    } catch (err) {
      console.error('Error deleting department:', err);
      toast.error("Failed to delete department");
    }
  };

  const handleAddDepartment = async () => {
    if (!newDepartment.name) return;
    
    try {
      // First, create the department without questions
      const departmentData = {
        name: newDepartment.name,
        description: newDepartment.description,
        priority: newDepartment.priority
      };

      console.log('Sending department data:', JSON.stringify(departmentData, null, 2));

      // Create the department first
      const response = await axios.post(`${DEPARTMENT_URL}/add`, departmentData);
      const createdDepartment = response.data;
      console.log('Department created:', createdDepartment);

      // If there are questions, add them to the department
      if (newDepartment.questions.length > 0) {
        const questionsData = newDepartment.questions.map((q, index) => ({
          questionText: q.questionText,
          questionType: q.questionType.toUpperCase(),
          required: q.required,
          options: q.questionType === 'RADIO' ? q.options : undefined,
          order: index + 1
        }));

        console.log('Adding questions:', JSON.stringify(questionsData, null, 2));
        
        try {
          // Add questions using the correct endpoint
          const questionsResponse = await axios.post(
            `http://localhost:8089/api/questions/${createdDepartment.id}/questions`,
            questionsData,
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          console.log('Questions added successfully:', questionsResponse.data);
        } catch (questionsError) {
          console.error('Error adding questions:', questionsError);
          if (questionsError.response) {
            console.error('Questions error response:', {
              status: questionsError.response.status,
              data: questionsError.response.data,
              headers: questionsError.response.headers
            });
          }
          throw questionsError; // Re-throw to be caught by outer catch
        }
      }
      
      await loadDepartments();
      setIsAddDialogOpen(false);
      setNewDepartment({ name: '', description: '', priority: 'MEDIUM', questions: [] });
      setActiveTab('basic');
      toast.success("Department added successfully");
    } catch (err) {
      console.error('Error adding department:', err);
      if (err.response) {
        console.error('Error response data:', JSON.stringify(err.response.data, null, 2));
        console.error('Error response status:', err.response.status);
        console.error('Request data that caused the error:', JSON.stringify(err.config?.data, null, 2));
        console.error('Request URL:', err.config?.url);
        console.error('Request method:', err.config?.method);
        console.error('Request headers:', err.config?.headers);
      }
      toast.error(err.response?.data?.message || "Failed to add department");
    }
  };

  const handleEditDepartment = async () => {
    if (!currentDepartment) return;
    
    try {
      // Log the current department state
      console.log('Current department before update:', currentDepartment);

      // Prepare the department data with all fields including priority in uppercase
      const departmentData = {
        id: currentDepartment.id,
        name: currentDepartment.name,
        description: currentDepartment.description || '',
        priority: currentDepartment.priority?.toUpperCase() || 'MEDIUM'
      };

      console.log('Sending update request to:', `${DEPARTMENT_URL}/edit/${currentDepartment.id}`);
      console.log('Update payload:', JSON.stringify(departmentData, null, 2));

      // First try updating with PUT
      try {
        const response = await axios.put(`${DEPARTMENT_URL}/edit/${currentDepartment.id}`, departmentData);
        console.log('PUT Update response:', response.data);
      } catch (putError) {
        console.log('PUT request failed, trying PATCH...');
        // If PUT fails, try PATCH
        const response = await axios.patch(`${DEPARTMENT_URL}/edit/${currentDepartment.id}`, departmentData);
        console.log('PATCH Update response:', response.data);
      }

      // Reload departments to verify the update
      await loadDepartments();
      
      // Verify the update in the departments list
      const updatedDepartment = departmentsList.find(d => d.id === currentDepartment.id);
      console.log('Department after update:', updatedDepartment);

      setIsEditDialogOpen(false);
      setCurrentDepartment(null);
      toast.success("Department updated successfully");
    } catch (err) {
      console.error('Error updating department:', err);
      if (err.response) {
        console.error('Error response data:', JSON.stringify(err.response.data, null, 2));
        console.error('Error response status:', err.response.status);
        console.error('Error response headers:', JSON.stringify(err.response.headers, null, 2));
        console.error('Request data that caused the error:', JSON.stringify(err.config?.data, null, 2));
        console.error('Request URL:', err.config?.url);
        console.error('Request method:', err.config?.method);
      }
      toast.error(err.response?.data?.message || "Failed to update department");
    }
  };

  const handleDeleteDepartment = async () => {
    if (!currentDepartment) return;
    
    try {
      await deleteDepartment(currentDepartment.id);
      setIsDeleteDialogOpen(false);
      setCurrentDepartment(null);
    } catch (err) {
      console.error('Error deleting department:', err);
      toast.error("Failed to delete department");
    }
  };

  const openEditDialog = (department) => {
    setCurrentDepartment({
      ...department,
      priority: department.priority?.toUpperCase() || 'MEDIUM'
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (department) => {
    setCurrentDepartment(department);
    setIsDeleteDialogOpen(true);
  };
  
  const addQuestionToDepartment = () => {
    if (!newQuestion.questionText) return;
    
    const newQuestionWithId = {
      id: `q-${Date.now()}`,
      questionText: newQuestion.questionText,
      questionType: newQuestion.questionType,
      required: newQuestion.required,
      options: newQuestion.questionType === 'RADIO' ? ['Option 1', 'Option 2'] : undefined
    };
    
    setNewDepartment({
      ...newDepartment,
      questions: [...newDepartment.questions, newQuestionWithId]
    });
    
    setNewQuestion({
      questionText: '',
      questionType: 'TEXT',
      required: false
    });
    
    toast.success("Question added to the form");
  };

  const updateQuestionOptions = (questionIndex: number, options: string[]) => {
    const updatedQuestions = [...newDepartment.questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options
    };
    setNewDepartment({
      ...newDepartment,
      questions: updatedQuestions
    });
  };

  const addOptionToQuestion = (questionIndex: number) => {
    const question = newDepartment.questions[questionIndex];
    if (!question.options) return;

    const updatedOptions = [...question.options, `Option ${question.options.length + 1}`];
    updateQuestionOptions(questionIndex, updatedOptions);
  };

  const removeOptionFromQuestion = (questionIndex: number, optionIndex: number) => {
    const question = newDepartment.questions[questionIndex];
    if (!question.options) return;

    const updatedOptions = question.options.filter((_, index) => index !== optionIndex);
    updateQuestionOptions(questionIndex, updatedOptions);
  };

  const updateOptionText = (questionIndex: number, optionIndex: number, newText: string) => {
    const question = newDepartment.questions[questionIndex];
    if (!question.options) return;

    const updatedOptions = [...question.options];
    updatedOptions[optionIndex] = newText;
    updateQuestionOptions(questionIndex, updatedOptions);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...newDepartment.questions];
    updatedQuestions.splice(index, 1);
    setNewDepartment({
      ...newDepartment,
      questions: updatedQuestions
    });
    toast.success("Question removed from form");
  };

  const questionTypeOptions = [
    { value: 'TEXT', label: 'Text Input' },
    { value: 'RATING', label: 'Rating (1-5)' },
    { value: 'DROPDOWN', label: 'Dropdown Select' },
    { value: 'RADIO', label: 'Radio Buttons' }
  ];
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-500">Please wait while loading departments!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Departments</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>Add New Department</Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {departmentsList.map((department) => (
          <Card key={department.id} className="h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{department.name}</CardTitle>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => openEditDialog(department)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => openDeleteDialog(department)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                {department.description || `Manage feedback for the ${department.name} department`}
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Feedback:</span>
                  <span className="font-medium">{department.totalFeedback}</span>
                </div>
                
                <div className="flex gap-2">
                  <Badge className="bg-feedback-complaint text-white">
                    {department.feedbackByType.complaints}
                  </Badge>
                  <Badge className="bg-feedback-suggestion text-white">
                    {department.feedbackByType.suggestions}
                  </Badge>
                  <Badge className="bg-feedback-compliment text-white">
                    {department.feedbackByType.compliments}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={`/departments/${department.id}`}>View Department</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add Department Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
            <DialogDescription>
              Create a new department to manage patient feedback.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <LayoutDashboard size={16} />
                <span>Basic Info</span>
              </TabsTrigger>
              <TabsTrigger value="feedbackForm" className="flex items-center gap-2">
                <FileText size={16} />
                <span>Feedback Form</span>
              </TabsTrigger>
              <TabsTrigger value="feedbacks" className="flex items-center gap-2" disabled>
                <MessageSquare size={16} />
                <span>Feedbacks</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2" disabled>
                <ChartBar size={16} />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2" disabled>
                <Settings size={16} />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Department Name*</label>
                <Input
                  id="name"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                  placeholder="Enter department name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  value={newDepartment.description}
                  onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                  placeholder="Enter department description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                <select
                  id="priority"
                  value={newDepartment.priority}
                  onChange={(e) => setNewDepartment({...newDepartment, priority: e.target.value})}
                  className="w-full border rounded-md p-2"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <p className="text-sm text-gray-500">
                * Required fields
              </p>
            </TabsContent>
            
            <TabsContent value="feedbackForm" className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium text-sm">Add Question</h3>
                  <div className="space-y-2">
                    <label htmlFor="question-text" className="text-sm font-medium">Question Text</label>
                    <Input
                      id="question-text"
                      value={newQuestion.questionText}
                      onChange={(e) => setNewQuestion({...newQuestion, questionText: e.target.value})}
                      placeholder="Enter question text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="question-type" className="text-sm font-medium">Question Type</label>
                    <select
                      id="question-type"
                      value={newQuestion.questionType}
                      onChange={(e) => setNewQuestion({
                        ...newQuestion, 
                        questionType: e.target.value as 'TEXT' | 'RATING' | 'DROPDOWN' | 'RADIO'
                      })}
                      className="w-full border rounded-md p-2"
                    >
                      {questionTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="required"
                      checked={newQuestion.required}
                      onChange={(e) => 
                        setNewQuestion({...newQuestion, required: e.target.checked})
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="required" className="text-sm font-medium">
                      This question is required
                    </label>
                  </div>
                  <Button 
                    onClick={addQuestionToDepartment}
                    disabled={!newQuestion.questionText}
                    className="w-full flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Question
                  </Button>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-3">Form Questions</h3>
                  <div className="overflow-y-auto" style={{ maxHeight: '250px' }}>
                    {newDepartment.questions.length > 0 ? (
                      <div className="space-y-3">
                        {newDepartment.questions.map((question, index) => (
                          <div key={question.id} className="border rounded-md p-3 space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium">
                                {index + 1}. {question.questionText}
                                {question.required && <span className="text-red-500 ml-1">*</span>}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-red-500"
                                onClick={() => removeQuestion(index)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline">{question.questionType}</Badge>
                              {question.required && (
                                <Badge variant="outline" className="border-red-500 text-red-500">Required</Badge>
                              )}
                            </div>
                            {question.questionType === 'RADIO' && question.options && (
                              <div className="mt-2 space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium">Options:</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => addOptionToQuestion(index)}
                                    className="h-6 text-xs"
                                  >
                                    <Plus size={12} className="mr-1" />
                                    Add Option
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  {question.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex gap-2">
                                      <Input
                                        value={option}
                                        onChange={(e) => updateOptionText(index, optionIndex, e.target.value)}
                                        className="h-8 text-sm"
                                      />
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-500"
                                        onClick={() => removeOptionFromQuestion(index, optionIndex)}
                                      >
                                        <Trash2 size={14} />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border rounded-md p-4 text-center text-gray-500">
                        <p>No questions added yet</p>
                        <p className="text-sm">Add questions using the form on the left</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="feedbacks">
              <div className="py-6 text-center text-gray-500">
                <p>Feedbacks will be available after creating the department</p>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="py-6 text-center text-gray-500">
                <p>Analytics will be available after creating the department</p>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="py-6 text-center text-gray-500">
                <p>Settings will be available after creating the department</p>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="flex items-center justify-between">
            <div>
              {activeTab === "basic" ? (
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("feedbackForm")}
                  className="flex items-center gap-2"
                >
                  Next: Feedback Form
                  <FileText size={16} />
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("basic")}
                  className="flex items-center gap-2"
                >
                  <LayoutDashboard size={16} />
                  Back to Basic Info
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                onClick={handleAddDepartment}
                disabled={!newDepartment.name}
              >
                Add Department
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update the department details.
            </DialogDescription>
          </DialogHeader>
          {currentDepartment && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">Department Name</label>
                <Input
                  id="edit-name"
                  value={currentDepartment.name}
                  onChange={(e) => setCurrentDepartment({
                    ...currentDepartment, 
                    name: e.target.value
                  })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-description" className="text-sm font-medium">Description</label>
                <Textarea
                  id="edit-description"
                  value={currentDepartment.description || ''}
                  onChange={(e) => setCurrentDepartment({
                    ...currentDepartment, 
                    description: e.target.value
                  })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-priority" className="text-sm font-medium">Priority</label>
                <select
                  id="edit-priority"
                  value={currentDepartment.priority || 'MEDIUM'}
                  onChange={(e) => setCurrentDepartment({
                    ...currentDepartment,
                    priority: e.target.value
                  })}
                  className="w-full border rounded-md p-2"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditDepartment}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Department Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the "{currentDepartment?.name}" department and all associated feedback data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDepartment} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DepartmentsPage;

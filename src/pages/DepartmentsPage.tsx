
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { departments } from '@/lib/mockData';
import { Department, Question } from '@/lib/types';
import { toast } from 'sonner';

const DepartmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [departmentsList, setDepartmentsList] = useState(departments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
    questions: [] as Question[],
  });
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: 'text' as 'text' | 'rating' | 'select' | 'radio',
    required: false,
  });

  const handleAddDepartment = () => {
    if (!newDepartment.name) return;
    
    const newDept: Department = {
      id: `dept-${Date.now()}`,
      name: newDepartment.name,
      description: newDepartment.description,
      totalFeedback: 0,
      feedbackByType: {
        complaints: 0,
        suggestions: 0,
        compliments: 0,
      },
      questions: [...newDepartment.questions]
    };
    
    setDepartmentsList([...departmentsList, newDept]);
    setIsAddDialogOpen(false);
    setNewDepartment({ name: '', description: '', questions: [] });
    setActiveTab('basic');
    toast.success("Department added successfully");
  };

  const handleEditDepartment = () => {
    if (!currentDepartment) return;
    
    const updatedDepartments = departmentsList.map(dept => 
      dept.id === currentDepartment.id ? currentDepartment : dept
    );
    
    setDepartmentsList(updatedDepartments);
    setIsEditDialogOpen(false);
    setCurrentDepartment(null);
    toast.success("Department updated successfully");
  };

  const handleDeleteDepartment = () => {
    if (!currentDepartment) return;
    
    const updatedDepartments = departmentsList.filter(
      dept => dept.id !== currentDepartment.id
    );
    
    setDepartmentsList(updatedDepartments);
    setIsDeleteDialogOpen(false);
    setCurrentDepartment(null);
    toast.success("Department deleted successfully");
  };

  const openEditDialog = (department: Department) => {
    setCurrentDepartment({...department});
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (department: Department) => {
    setCurrentDepartment(department);
    setIsDeleteDialogOpen(true);
  };
  
  const addQuestionToDepartment = () => {
    if (!newQuestion.text) return;
    
    const newQuestionWithId: Question = {
      id: `q-${Date.now()}`,
      ...newQuestion,
      options: newQuestion.type === 'select' || newQuestion.type === 'radio' ? [] : undefined
    };
    
    setNewDepartment({
      ...newDepartment,
      questions: [...newDepartment.questions, newQuestionWithId]
    });
    
    setNewQuestion({
      text: '',
      type: 'text',
      required: false
    });
    
    toast.success("Question added to the form");
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
              <p className="text-sm text-gray-500">
                * Required fields
              </p>
            </TabsContent>
            
            <TabsContent value="feedbackForm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="border p-4 rounded-md space-y-4">
                    <h3 className="font-medium text-sm">Add Question</h3>
                    <div className="space-y-2">
                      <label htmlFor="question-text" className="text-sm font-medium">Question Text</label>
                      <Input
                        id="question-text"
                        value={newQuestion.text}
                        onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                        placeholder="Enter question text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="question-type" className="text-sm font-medium">Question Type</label>
                      <select
                        id="question-type"
                        value={newQuestion.type}
                        onChange={(e) => setNewQuestion({
                          ...newQuestion, 
                          type: e.target.value as 'text' | 'rating' | 'select' | 'radio'
                        })}
                        className="w-full border rounded-md p-2"
                      >
                        <option value="text">Text Input</option>
                        <option value="rating">Rating (1-5)</option>
                        <option value="select">Dropdown Select</option>
                        <option value="radio">Radio Buttons</option>
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
                      disabled={!newQuestion.text}
                      className="w-full flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Question
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Form Questions</h3>
                  {newDepartment.questions.length > 0 ? (
                    <div className="space-y-3">
                      {newDepartment.questions.map((question, index) => (
                        <div key={question.id} className="border rounded-md p-3 space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {index + 1}. {question.text}
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
                            <Badge variant="outline">{question.type}</Badge>
                            {question.required && (
                              <Badge variant="outline" className="border-red-500 text-red-500">Required</Badge>
                            )}
                          </div>
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

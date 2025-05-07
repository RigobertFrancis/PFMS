
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Trash2,
  Plus,
  ArrowLeft,
  Edit,
} from 'lucide-react';
import { useForm } from "react-hook-form";
import { departments } from '@/lib/mockData';
import { Question } from '@/lib/types';
import { toast } from 'sonner';

interface QuestionFormValues {
  text: string;
  type: 'text' | 'rating' | 'select' | 'radio';
  required: boolean;
  options?: string[];
}

const FeedbackFormPage: React.FC = () => {
  const { departmentId } = useParams<{ departmentId: string }>();
  const navigate = useNavigate();
  
  const department = departments.find(d => d.id === departmentId);
  
  const [questions, setQuestions] = useState<Question[]>(
    department?.questions || []
  );
  
  const [currentQuestion, setCurrentQuestion] = useState<QuestionFormValues>({
    text: '',
    type: 'text',
    required: false,
    options: [],
  });
  
  const form = useForm({
    defaultValues: {
      questionText: '',
      questionType: 'text',
      required: false,
    }
  });
  
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newOption, setNewOption] = useState<string>('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [deleteQuestionIndex, setDeleteQuestionIndex] = useState<number | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

  if (!department) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <h1 className="text-2xl font-bold mb-4">Department Not Found</h1>
        <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
      </div>
    );
  }

  const handleSaveQuestion = () => {
    if (!currentQuestion.text) return;
    
    if (editIndex !== null) {
      // Update existing question
      const updatedQuestions = [...questions];
      updatedQuestions[editIndex] = {
        ...currentQuestion,
        id: questions[editIndex].id,
      };
      setQuestions(updatedQuestions);
      toast.success("Question updated successfully");
    } else {
      // Add new question
      setQuestions([
        ...questions,
        {
          id: `q-${Date.now()}`,
          ...currentQuestion,
        },
      ]);
      toast.success("Question added successfully");
    }
    
    // Reset form
    setCurrentQuestion({
      text: '',
      type: 'text',
      required: false,
      options: [],
    });
    setEditIndex(null);
    setUnsavedChanges(true);
  };

  const handleEditQuestion = (index: number) => {
    setCurrentQuestion(questions[index]);
    setEditIndex(index);
  };

  const confirmDeleteQuestion = (index: number) => {
    setDeleteQuestionIndex(index);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteQuestion = () => {
    if (deleteQuestionIndex === null) return;
    
    const updatedQuestions = [...questions];
    updatedQuestions.splice(deleteQuestionIndex, 1);
    setQuestions(updatedQuestions);
    setIsDeleteDialogOpen(false);
    setDeleteQuestionIndex(null);
    setUnsavedChanges(true);
    toast.success("Question deleted successfully");
  };

  const handleAddOption = () => {
    if (!newOption) return;
    setCurrentQuestion({
      ...currentQuestion,
      options: [...(currentQuestion.options || []), newOption],
    });
    setNewOption('');
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = [...(currentQuestion.options || [])];
    updatedOptions.splice(index, 1);
    setCurrentQuestion({
      ...currentQuestion,
      options: updatedOptions,
    });
  };

  const handleSaveForm = () => {
    // Here, you would typically save the questions to your backend
    console.log("Saving questions for department:", departmentId, questions);
    toast.success("Form saved successfully!");
    setUnsavedChanges(false);
    
    // Navigate back to the department page
    navigate(`/departments/${departmentId}`);
  };

  const cancelEdit = () => {
    setCurrentQuestion({
      text: '',
      type: 'text',
      required: false,
      options: [],
    });
    setEditIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => {
          if (unsavedChanges) {
            if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
              navigate(`/departments/${departmentId}`);
            }
          } else {
            navigate(`/departments/${departmentId}`);
          }
        }}>
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-2xl font-bold">Edit Feedback Form - {department.name}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{editIndex !== null ? 'Edit Question' : 'Add Question'}</CardTitle>
              <CardDescription>
                Create custom questions for patient feedback in this department.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="questionText" className="text-sm font-medium">Question Text</label>
                  <Input
                    id="questionText"
                    value={currentQuestion.text}
                    onChange={(e) => setCurrentQuestion({...currentQuestion, text: e.target.value})}
                    placeholder="Enter question text"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="questionType" className="text-sm font-medium">Question Type</label>
                  <Select
                    value={currentQuestion.type}
                    onValueChange={(value: any) => 
                      setCurrentQuestion({...currentQuestion, type: value})
                    }
                  >
                    <SelectTrigger id="questionType">
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
                    checked={currentQuestion.required}
                    onChange={(e) => 
                      setCurrentQuestion({...currentQuestion, required: e.target.checked})
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="required" className="text-sm font-medium">
                    This question is required
                  </label>
                </div>
                
                {(currentQuestion.type === 'select' || currentQuestion.type === 'radio') && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Options</label>
                    <div className="space-y-2">
                      {currentQuestion.options && currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input 
                            value={option} 
                            onChange={(e) => {
                              const updatedOptions = [...(currentQuestion.options || [])];
                              updatedOptions[index] = e.target.value;
                              setCurrentQuestion({...currentQuestion, options: updatedOptions});
                            }}
                            className="flex-grow"
                          />
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleRemoveOption(index)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                      
                      <div className="flex items-center gap-2">
                        <Input 
                          value={newOption} 
                          onChange={(e) => setNewOption(e.target.value)}
                          placeholder="Add new option"
                          className="flex-grow"
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={handleAddOption}
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={handleSaveQuestion} 
                  className="w-full"
                  disabled={!currentQuestion.text}
                >
                  {editIndex !== null ? 'Update Question' : 'Add Question'}
                </Button>
                
                {editIndex !== null && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={cancelEdit}
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Form Questions</CardTitle>
                <CardDescription>
                  Questions that will be shown to patients when they submit feedback.
                </CardDescription>
              </div>
              <Button 
                onClick={handleSaveForm}
                disabled={questions.length === 0}
              >
                Save Form
              </Button>
            </CardHeader>
            <CardContent>
              {questions.length > 0 ? (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <ContextMenu key={question.id}>
                      <ContextMenuTrigger>
                        <div 
                          className="p-4 border rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <h3 className="font-medium">
                                {index + 1}. {question.text}
                                {question.required && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {question.type}
                                </span>
                                {question.required && (
                                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                    Required
                                  </span>
                                )}
                              </div>
                              
                              {question.options && question.options.length > 0 && (
                                <div className="pl-4 mt-2">
                                  <p className="text-sm text-gray-600">Options:</p>
                                  <ul className="list-disc pl-4 text-sm text-gray-600">
                                    {question.options.map((option, i) => (
                                      <li key={i}>{option}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleEditQuestion(index)}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => confirmDeleteQuestion(index)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem onClick={() => handleEditQuestion(index)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </ContextMenuItem>
                        <ContextMenuItem 
                          onClick={() => confirmDeleteQuestion(index)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="mb-4">No questions added yet.</p>
                  <p className="text-sm">Create your first question using the form on the left.</p>
                </div>
              )}
            </CardContent>
            {questions.length > 0 && (
              <CardFooter className="flex justify-end pt-0">
                <Button 
                  onClick={handleSaveForm}
                  disabled={questions.length === 0}
                >
                  Save Form
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>

      {/* Delete Question Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this question from the form.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteQuestion}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FeedbackFormPage;

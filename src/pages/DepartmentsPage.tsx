import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Building2, Eye, Edit, Trash2, X } from 'lucide-react';
import { departments } from '@/lib/mockData';
import { Department, Question } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const DepartmentsPage: React.FC = () => {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [viewingDepartment, setViewingDepartment] = useState<Department | null>(null);
  const [departmentsList, setDepartmentsList] = useState(departments);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical'
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: 'text' as 'text' | 'rating' | 'select' | 'radio',
    required: false,
    options: ['']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDepartment: Department = {
      id: formData.name.toLowerCase().replace(/\s+/g, '-'),
      name: formData.name,
      description: formData.description,
      priority: formData.priority,
      totalFeedback: 0,
      feedbackByType: {
        complaints: 0,
        suggestions: 0,
        compliments: 0,
      },
      questions: questions
    };

    setDepartmentsList([...departmentsList, newDepartment]);

    toast({
      title: "Department Added",
      description: `${formData.name} has been successfully added with ${questions.length} questions.`,
    });

    setFormData({ name: '', description: '', priority: 'medium' });
    setQuestions([]);
    setShowAddForm(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDepartment) return;

    toast({
      title: "Department Updated",
      description: `${editingDepartment.name} has been successfully updated.`,
    });

    setEditingDepartment(null);
  };

  const handleView = (department: Department) => {
    setViewingDepartment(department);
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
  };

  const handleDelete = (department: Department) => {
    setDepartmentsList(departmentsList.filter(d => d.id !== department.id));
    toast({
      title: "Department Deleted",
      description: `${department.name} has been successfully deleted.`,
      variant: "destructive",
    });
  };

  const addQuestion = () => {
    if (!newQuestion.text) return;

    const question: Question = {
      id: `q-${Date.now()}`,
      text: newQuestion.text,
      type: newQuestion.type,
      required: newQuestion.required,
      options: newQuestion.type === 'select' || newQuestion.type === 'radio' ? newQuestion.options.filter(opt => opt.trim()) : undefined
    };

    setQuestions([...questions, question]);
    setNewQuestion({
      text: '',
      type: 'text',
      required: false,
      options: ['']
    });
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const addOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, '']
    });
  };

  const updateOption = (index: number, value: string) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions
    });
  };

  const removeOption = (index: number) => {
    if (newQuestion.options.length > 1) {
      const updatedOptions = newQuestion.options.filter((_, i) => i !== index);
      setNewQuestion({
        ...newQuestion,
        options: updatedOptions
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Departments</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Department
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Department</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Department Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter department name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="critical">Critical Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter department description"
                  rows={3}
                />
              </div>

              {/* Questions Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Custom Questions</h3>
                  <Badge variant="secondary">{questions.length} questions added</Badge>
                </div>

                {/* Display added questions */}
                {questions.length > 0 && (
                  <div className="space-y-2">
                    {questions.map((question) => (
                      <div key={question.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <span className="font-medium">{question.text}</span>
                          <span className="ml-2 text-sm text-gray-500">
                            ({question.type}) {question.required && '(Required)'}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeQuestion(question.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new question form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Add Question</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Question Text</Label>
                        <Input
                          value={newQuestion.text}
                          onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                          placeholder="Enter question text"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Question Type</Label>
                        <Select value={newQuestion.type} onValueChange={(value: 'text' | 'rating' | 'select' | 'radio') => setNewQuestion({ ...newQuestion, type: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text Input</SelectItem>
                            <SelectItem value="rating">Rating (1-5)</SelectItem>
                            <SelectItem value="select">Dropdown</SelectItem>
                            <SelectItem value="radio">Radio Buttons</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {(newQuestion.type === 'select' || newQuestion.type === 'radio') && (
                      <div className="space-y-2">
                        <Label>Options</Label>
                        {newQuestion.options.map((option, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={option}
                              onChange={(e) => updateOption(index, e.target.value)}
                              placeholder={`Option ${index + 1}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeOption(index)}
                              disabled={newQuestion.options.length === 1}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addOption}>
                          Add Option
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="required"
                        checked={newQuestion.required}
                        onChange={(e) => setNewQuestion({ ...newQuestion, required: e.target.checked })}
                      />
                      <Label htmlFor="required">Required field</Label>
                    </div>

                    <Button type="button" onClick={addQuestion} disabled={!newQuestion.text}>
                      Add Question
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Add Department</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departmentsList.map((department) => (
          <Card key={department.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{department.name}</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(department)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{department.name} Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Description</h4>
                          <p className="text-sm text-gray-600">{department.description || 'No description available'}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Priority</h4>
                          <Badge variant="secondary" className="capitalize">{department.priority}</Badge>
                        </div>
                        <div>
                          <h4 className="font-medium">Feedback Statistics</h4>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="text-center p-3 bg-gray-50 rounded">
                              <div className="font-bold text-lg">{department.totalFeedback}</div>
                              <div className="text-sm text-gray-500">Total</div>
                            </div>
                            <div className="text-center p-3 bg-red-50 rounded">
                              <div className="font-bold text-lg text-red-600">{department.feedbackByType.complaints}</div>
                              <div className="text-sm text-gray-500">Complaints</div>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded">
                              <div className="font-bold text-lg text-blue-600">{department.feedbackByType.suggestions}</div>
                              <div className="text-sm text-gray-500">Suggestions</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded">
                              <div className="font-bold text-lg text-green-600">{department.feedbackByType.compliments}</div>
                              <div className="text-sm text-gray-500">Compliments</div>
                            </div>
                          </div>
                        </div>
                        {department.questions && department.questions.length > 0 && (
                          <div>
                            <h4 className="font-medium">Custom Questions ({department.questions.length})</h4>
                            <div className="space-y-2 mt-2">
                              {department.questions.map((question) => (
                                <div key={question.id} className="p-2 bg-gray-50 rounded">
                                  <span className="font-medium">{question.text}</span>
                                  <span className="ml-2 text-sm text-gray-500">
                                    ({question.type}) {question.required && '(Required)'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={!!editingDepartment} onOpenChange={(open) => !open && setEditingDepartment(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(department)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit {department.name}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Department Name</Label>
                          <Input defaultValue={department.name} />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea defaultValue={department.description} />
                        </div>
                        <div className="space-y-2">
                          <Label>Priority</Label>
                          <Select defaultValue={department.priority}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low Priority</SelectItem>
                              <SelectItem value="medium">Medium Priority</SelectItem>
                              <SelectItem value="high">High Priority</SelectItem>
                              <SelectItem value="critical">Critical Priority</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button type="button" variant="outline" onClick={() => setEditingDepartment(null)}>
                            Cancel
                          </Button>
                          <Button type="submit">Save Changes</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Department</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{department.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(department)} className="bg-red-600 hover:bg-red-700">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              {department.description && (
                <p className="text-sm text-gray-600 mt-1">{department.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Feedback</span>
                  <span className="font-bold text-lg">{department.totalFeedback.toLocaleString()}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-red-600">{department.feedbackByType.complaints}</div>
                    <div className="text-xs text-gray-500">Complaints</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">{department.feedbackByType.suggestions}</div>
                    <div className="text-xs text-gray-500">Suggestions</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-600">{department.feedbackByType.compliments}</div>
                    <div className="text-xs text-gray-500">Compliments</div>
                  </div>
                </div>

                {department.questions && department.questions.length > 0 && (
                  <div className="pt-2 border-t">
                    <span className="text-xs text-gray-500">{department.questions.length} custom questions</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DepartmentsPage;

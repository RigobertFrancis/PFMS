import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/use-toast';

interface Question {
  id?: string;
  questionText: string;
  questionType: string;
  required: boolean;
  options?: string[];
  departmentId?: string;
}

const DepartmentQuestionsPage: React.FC = () => {
  const { departmentId } = useParams<{ departmentId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [departmentName, setDepartmentName] = useState<string>('');

  const QUESTIONS_URL = "http://localhost:8089/api/questions";
  const DEPARTMENT_URL = "http://localhost:8089/api/departments";

  useEffect(() => {
    loadDepartmentAndQuestions();
  }, [departmentId]);

  const loadDepartmentAndQuestions = async () => {
    try {
      setLoading(true);
      // Load department details
      const deptResponse = await axios.get(`${DEPARTMENT_URL}/department/${departmentId}`);
      setDepartmentName(deptResponse.data.name);

      // Load questions
      const questionsResponse = await axios.get(`${QUESTIONS_URL}/department?departmentId=${departmentId}`);
      setQuestions(questionsResponse.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      questionText: '',
      questionType: 'TEXT',
      required: false,
      options: [],
      departmentId: departmentId
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    if (!updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options = [];
    }
    updatedQuestions[questionIndex].options?.push('');
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options?.filter((_, i) => i !== optionIndex);
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options![optionIndex] = value;
      setQuestions(updatedQuestions);
    }
  };

  const saveQuestions = async () => {
    try {
      setLoading(true);
      
      // Validate questions before saving
      const invalidQuestions = questions.filter(q => !q.questionText.trim());
      if (invalidQuestions.length > 0) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill in all question texts before saving.",
        });
        return;
      }

      // Prepare questions for saving
      const questionsToSave = questions.map((q, index) => {
        const question = {
          questionText: q.questionText.trim(),
          questionType: q.questionType.toUpperCase(),
          required: q.required,
          departmentId: parseInt(departmentId || '0'),
          order: index + 1
        };

        // Only add options for RADIO questions
        if (q.questionType === 'RADIO' && q.options && q.options.length > 0) {
          return {
            ...question,
            options: q.options.filter(opt => opt.trim() !== '')
          };
        }

        return question;
      });

      console.log('Saving questions with payload:', JSON.stringify(questionsToSave, null, 2));

      // Save questions
      const response = await axios.post(
        `http://localhost:8089/api/questions/${departmentId}/questions`, 
        questionsToSave,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 200 || response.status === 201) {
        toast({
          title: "Success",
          description: "Questions have been saved successfully.",
        });
        navigate(`/departments/${departmentId}`);
      }
    } catch (err: any) {
      console.error('Error saving questions:', err);
      console.error('Request payload:', JSON.stringify(questions, null, 2));
      console.error('Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        headers: err.response?.headers
      });
      
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save questions';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-500">Please wait while we load the questions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(`/departments/${departmentId}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{departmentName} Questions</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Feedback Form Questions</CardTitle>
            
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {questions.map((question, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label>Question Text</Label>
                        <Input
                          value={question.questionText}
                          onChange={(e) => updateQuestion(index, 'questionText', e.target.value)}
                          placeholder="Enter your question"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Question Type</Label>
                        <Select
                          value={question.questionType}
                          onValueChange={(value) => updateQuestion(index, 'questionType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select question type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TEXT">Text</SelectItem>
                            <SelectItem value="RADIO">Radio</SelectItem>
                            <SelectItem value="RATING">Rating</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {question.questionType === 'RADIO' && (
                        <div className="space-y-2">
                          <Label>Options</Label>
                          <div className="space-y-2">
                            {question.options?.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex gap-2">
                                <Input
                                  value={option}
                                  onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                  placeholder={`Option ${optionIndex + 1}`}
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeOption(index, optionIndex)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              onClick={() => addOption(index)}
                              className="w-full"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Option
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={question.required}
                          onCheckedChange={(checked) => updateQuestion(index, 'required', checked)}
                        />
                        <Label>Required</Label>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(index)}
                      className="ml-4 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {questions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No questions have been created yet. Click "Add Question" to get started.
                </p>
              </div>
            )}

<Button onClick={addQuestion}>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
            <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => navigate(`/departments/${departmentId}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Department
          </Button> 
              <Button onClick={saveQuestions} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save Questions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentQuestionsPage; 
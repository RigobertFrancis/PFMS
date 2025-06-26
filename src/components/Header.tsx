/**
 * Header Component
 * 
 * The top navigation bar that includes the app logo, search box,
 * language switcher, help button, and user profile.
 */
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, HelpCircle, User, LogOut, Building2, MessageSquare, Bell, Users, FileText, X, BookOpen, Navigation, Settings, BarChart3, FileText as FileTextIcon, Bell as BellIcon, MessageSquare as MessageSquareIcon, Building2 as Building2Icon, Users as UsersIcon, Home, TrendingUp, FileBarChart } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './ui/use-toast';
import axios from 'axios';

interface SearchResult {
  id: string | number;
  type: 'department' | 'feedback' | 'notification' | 'patient' | 'question';
  title: string;
  subtitle?: string;
  description?: string;
  icon: React.ReactNode;
  route: string;
  routeState?: any;
}

const Header: React.FC = () => {
  // Get translation function from language context
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout, isAuthenticated } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const BASE_URL = "http://localhost:8089/api";

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search function
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const results: SearchResult[] = [];

      // Search departments
      try {
        const departmentsRes = await axios.get(`${BASE_URL}/departments/all`);
        const departments = departmentsRes.data.filter((dept: any) =>
          dept.name.toLowerCase().includes(query.toLowerCase()) ||
          dept.description?.toLowerCase().includes(query.toLowerCase())
        );
        
        departments.forEach((dept: any) => {
          results.push({
            id: dept.id,
            type: 'department',
            title: dept.name,
            subtitle: 'Department',
            description: dept.description,
            icon: <Building2 className="h-4 w-4" />,
            route: `/departments/${dept.id}`
          });
        });
      } catch (error) {
        console.error('Error searching departments:', error);
      }

      // Search feedbacks/responses
      try {
        const feedbacksRes = await axios.get(`${BASE_URL}/responses/all`);
        const feedbacks = feedbacksRes.data.filter((feedback: any) =>
          feedback.message.toLowerCase().includes(query.toLowerCase()) ||
          feedback.category.toLowerCase().includes(query.toLowerCase()) ||
          feedback.priority?.toLowerCase().includes(query.toLowerCase()) ||
          feedback.status.toLowerCase().includes(query.toLowerCase()) ||
          feedback.patientId.toString().includes(query)
        );
        
        feedbacks.forEach((feedback: any) => {
          results.push({
            id: feedback.id,
            type: 'feedback',
            title: feedback.message.substring(0, 50) + (feedback.message.length > 50 ? '...' : ''),
            subtitle: `${feedback.category} - ${feedback.status}`,
            description: `Patient ID: ${feedback.patientId}`,
            icon: <MessageSquare className="h-4 w-4" />,
            route: '/responses',
            routeState: { selectedFeedbackId: feedback.id }
          });
        });
      } catch (error) {
        console.error('Error searching feedbacks:', error);
      }

      // Search notifications
      try {
        const notificationsRes = await axios.get(`${BASE_URL}/notifications`);
        const notifications = notificationsRes.data.filter((notification: any) =>
          notification.message.toLowerCase().includes(query.toLowerCase()) ||
          notification.category.toLowerCase().includes(query.toLowerCase()) ||
          notification.patientId.toString().includes(query)
        );
        
        notifications.forEach((notification: any) => {
          results.push({
            id: notification.id,
            type: 'notification',
            title: notification.message.substring(0, 50) + (notification.message.length > 50 ? '...' : ''),
            subtitle: notification.category,
            description: `Patient ID: ${notification.patientId}`,
            icon: <Bell className="h-4 w-4" />,
            route: '/responses',
            routeState: { patientId: notification.patientId }
          });
        });
      } catch (error) {
        console.error('Error searching notifications:', error);
      }

      // Search questions (if available)
      try {
        const questionsRes = await axios.get(`${BASE_URL}/questions/all`);
        const questions = questionsRes.data.filter((question: any) =>
          question.questionText.toLowerCase().includes(query.toLowerCase()) ||
          question.questionType.toLowerCase().includes(query.toLowerCase())
        );
        
        questions.forEach((question: any) => {
          results.push({
            id: question.id,
            type: 'question',
            title: question.questionText.substring(0, 50) + (question.questionText.length > 50 ? '...' : ''),
            subtitle: `Question - ${question.questionType}`,
            description: `Department: ${question.departmentId}`,
            icon: <FileText className="h-4 w-4" />,
            route: `/departments/${question.departmentId}`
          });
        });
      } catch (error) {
        console.error('Error searching questions:', error);
      }

      // Sort results by type priority: departments, feedbacks, notifications, questions
      const typePriority = { department: 1, feedback: 2, notification: 3, question: 4 };
      results.sort((a, b) => {
        const priorityDiff = typePriority[a.type] - typePriority[b.type];
        if (priorityDiff !== 0) return priorityDiff;
        return a.title.localeCompare(b.title);
      });

      setSearchResults(results.slice(0, 10)); // Limit to 10 results
      setShowResults(true);
    } catch (error) {
      console.error('Error performing search:', error);
      toast({
        title: "Search Error",
        description: "Failed to perform search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      const timeoutId = setTimeout(() => performSearch(value), 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    setShowResults(false);
    setSearchQuery('');
    navigate(result.route, { state: result.routeState });
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    
    // Show success message
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    
    // Redirect to login page
    navigate('/auth/login');
  };
  
  return (
    <header className="bg-med-blue p-4 flex items-center justify-between border-b border-med-blue-dark">
      {/* App logo and title */}
      <div className="flex items-center text-white">
        {/* <div className="mr-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#2D3748" />
            <path d="M8 12H16M12 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div> */}
        <div>
          <h1 className="font-bold text-xl tracking-wide text-black/70">
            PATIENT FEEDBACK MANAGEMENT SYSTEM
          </h1>
        </div>
      </div>
      
      {/* Header right section: search, language switcher, help, profile */}
      <div className="flex items-center gap-4">
        {/* Search bar */}
        <div className="relative" ref={searchRef}>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            ref={inputRef}
            className="w-64 pl-8 bg-white"
            placeholder={t('searchPlaceholder')}
            type="search"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => searchQuery.trim() && setShowResults(true)}
          />
          
          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-[500px] overflow-y-auto w-[600px]">
              {isSearching ? (
                <div className="p-6 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
                  <p className="text-sm">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="py-3">
                  {searchResults.map((result, index) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      className="px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1 text-gray-500">
                          {result.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-gray-900 text-base leading-tight">
                              {result.title}
                            </span>
                            <Badge variant="outline" className="text-xs px-2 py-1">
                              {result.type}
                            </Badge>
                          </div>
                          {result.subtitle && (
                            <p className="text-sm text-gray-600 mb-2 font-medium">
                              {result.subtitle}
                            </p>
                          )}
                          {result.description && (
                            <p className="text-sm text-gray-500 leading-relaxed">
                              {result.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery.trim() ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="mb-3">
                    <Search className="h-8 w-8 mx-auto text-gray-300" />
                  </div>
                  <p className="text-sm font-medium">No results found for</p>
                  <p className="text-base font-semibold text-gray-700">"{searchQuery}"</p>
                  <p className="text-xs text-gray-400 mt-2">Try searching with different keywords</p>
                </div>
              ) : null}
            </div>
          )}
        </div>
        
        {/* Language switcher */}
        <LanguageSwitcher />
        
        {/* Help button */}
        <Button 
          variant="link" 
          className="text-white flex items-center gap-1"
          onClick={() => setShowHelp(true)}
        >
          <span>{t('needHelp')}</span>
          <HelpCircle size={18} />
        </Button>
        
        {/* User profile or login/register */}
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="border-2 border-white cursor-pointer">
                <AvatarFallback className="bg-gray-800 text-white">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>{user.username}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('logOut')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white" asChild>
              <Link to="/auth/login">{t('login')}</Link>
            </Button>
            <Button size="sm" className="bg-white text-med-blue hover:bg-gray-100" asChild>
              <Link to="/auth/register">{t('register')}</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Help Modal */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <BookOpen className="h-6 w-6 text-blue-600" />
              Patient Feedback Management System - Help Guide
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="navigation" className="flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                Navigation
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Features
              </TabsTrigger>
              <TabsTrigger value="interfaces" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Interfaces
              </TabsTrigger>
              <TabsTrigger value="tips" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Tips & Tricks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-blue-600" />
                    System Overview
                  </CardTitle>
                  <CardDescription>
                    Welcome to the Patient Feedback Management System. This comprehensive platform helps healthcare administrators manage patient feedback, track responses, and improve service quality.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">🎯 Main Purpose</h4>
                      <p className="text-sm text-blue-700">
                        Collect, manage, and respond to patient feedback across all hospital departments to improve healthcare services.
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">👥 Target Users</h4>
                      <p className="text-sm text-green-700">
                        Healthcare administrators, department managers, and staff responsible for patient care and service improvement.
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">🔑 Key Benefits</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Centralized feedback management across all departments</li>
                      <li>• Real-time notifications for urgent feedback</li>
                      <li>• Comprehensive analytics and reporting</li>
                      <li>• Multi-language support (English & Swahili)</li>
                      <li>• Automated workflow for feedback processing</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="navigation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-blue-600" />
                    Navigation Guide
                  </CardTitle>
                  <CardDescription>
                    Learn how to navigate through different sections of the system efficiently.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">📱 Main Navigation</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Home className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">Dashboard</p>
                            <p className="text-sm text-gray-600">Overview of all system metrics and recent activities</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Building2Icon className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">Departments</p>
                            <p className="text-sm text-gray-600">Manage hospital departments and their feedback forms</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <MessageSquareIcon className="h-5 w-5 text-orange-600" />
                          <div>
                            <p className="font-medium">Responses</p>
                            <p className="text-sm text-gray-600">View and respond to patient feedback</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <BarChart3 className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-medium">Analytics</p>
                            <p className="text-sm text-gray-600">Detailed reports and data analysis</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <BellIcon className="h-5 w-5 text-red-600" />
                          <div>
                            <p className="font-medium">Notifications</p>
                            <p className="text-sm text-gray-600">System alerts and updates</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">🔍 Search Functionality</h4>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800 mb-3">
                          Use the search bar in the header to quickly find:
                        </p>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Departments by name</li>
                          <li>• Feedback by content or patient ID</li>
                          <li>• Notifications by message</li>
                          <li>• Questions by text</li>
                        </ul>
                      </div>
                      
                      <h4 className="font-semibold text-gray-800">🌐 Language Switching</h4>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">
                          Click the language switcher (SW/EN) to toggle between English and Swahili for better accessibility.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-600" />
                    System Features
                  </CardTitle>
                  <CardDescription>
                    Explore the powerful features available in the Patient Feedback Management System.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">📊 Dashboard Features</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="font-medium text-blue-800">Real-time Metrics</p>
                          <p className="text-sm text-blue-700">View total feedback, department statistics, and urgent items</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="font-medium text-green-800">Trend Analysis</p>
                          <p className="text-sm text-green-700">Track feedback trends over time with interactive charts</p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <p className="font-medium text-orange-800">Quick Actions</p>
                          <p className="text-sm text-orange-700">Access frequently used functions directly from dashboard</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">🏥 Department Management</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <p className="font-medium text-purple-800">Custom Forms</p>
                          <p className="text-sm text-purple-700">Create department-specific feedback forms</p>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-lg">
                          <p className="font-medium text-indigo-800">Question Types</p>
                          <p className="text-sm text-indigo-700">Support for text, rating, dropdown, and radio questions</p>
                        </div>
                        <div className="p-3 bg-pink-50 rounded-lg">
                          <p className="font-medium text-pink-800">Performance Tracking</p>
                          <p className="text-sm text-pink-700">Monitor department response rates and satisfaction</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">💬 Feedback Management</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-red-50 rounded-lg">
                          <p className="font-medium text-red-800">Priority System</p>
                          <p className="text-sm text-red-700">Urgent feedback gets immediate attention</p>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <p className="font-medium text-yellow-800">Status Tracking</p>
                          <p className="text-sm text-yellow-700">NEW → IN-PROGRESS → RESOLVED → CLOSED</p>
                        </div>
                        <div className="p-3 bg-teal-50 rounded-lg">
                          <p className="font-medium text-teal-800">Department Forwarding</p>
                          <p className="text-sm text-teal-700">Forward feedback to relevant departments</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">📈 Analytics & Reporting</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-cyan-50 rounded-lg">
                          <p className="font-medium text-cyan-800">Interactive Charts</p>
                          <p className="text-sm text-cyan-700">Visualize feedback trends and patterns</p>
                        </div>
                        <div className="p-3 bg-lime-50 rounded-lg">
                          <p className="font-medium text-lime-800">Custom Reports</p>
                          <p className="text-sm text-lime-700">Generate detailed reports by date, department, or type</p>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-lg">
                          <p className="font-medium text-amber-800">Export Options</p>
                          <p className="text-sm text-amber-700">Download reports in various formats</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interfaces" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Interface Guide
                  </CardTitle>
                  <CardDescription>
                    Understand the different interfaces and how to interact with them effectively.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">🎨 Visual Elements</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                          <div>
                            <p className="font-medium">Complaints</p>
                            <p className="text-sm text-gray-600">Red color indicates complaints</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                          <div>
                            <p className="font-medium">Suggestions</p>
                            <p className="text-sm text-gray-600">Blue color indicates suggestions</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                          <div>
                            <p className="font-medium">Compliments</p>
                            <p className="text-sm text-gray-600">Green color indicates compliments</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">🏷️ Status Badges</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200">NEW</Badge>
                          <span className="text-sm text-gray-600">Requires immediate attention</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">IN-PROGRESS</Badge>
                          <span className="text-sm text-gray-600">Being processed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800 border-green-200">RESOLVED</Badge>
                          <span className="text-sm text-gray-600">Issue addressed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-gray-100 text-gray-800 border-gray-200">CLOSED</Badge>
                          <span className="text-sm text-gray-600">Case completed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3">🔧 Interactive Elements</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                      <div>
                        <p className="font-medium mb-2">Buttons & Actions:</p>
                        <ul className="space-y-1">
                          <li>• Primary buttons: Blue background</li>
                          <li>• Secondary buttons: White with border</li>
                          <li>• Danger actions: Red background</li>
                          <li>• Hover effects show interactivity</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium mb-2">Forms & Inputs:</p>
                        <ul className="space-y-1">
                          <li>• Text inputs: White background</li>
                          <li>• Dropdowns: Click to expand</li>
                          <li>• Checkboxes: Click to toggle</li>
                          <li>• Required fields: Marked with asterisk</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Tips & Best Practices
                  </CardTitle>
                  <CardDescription>
                    Learn how to use the system efficiently and follow best practices for optimal results.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">⚡ Quick Tips</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <p className="font-medium text-yellow-800 mb-1">Use Search Efficiently</p>
                          <p className="text-sm text-yellow-700">Type keywords to quickly find departments, feedback, or notifications</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="font-medium text-green-800 mb-1">Check Notifications</p>
                          <p className="text-sm text-green-700">Regularly check the notifications tab for urgent items</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="font-medium text-blue-800 mb-1">Use Filters</p>
                          <p className="text-sm text-blue-700">Filter feedback by status, type, or priority for better organization</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">📋 Best Practices</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <p className="font-medium text-purple-800 mb-1">Respond Promptly</p>
                          <p className="text-sm text-purple-700">Address NEW feedback within 24 hours</p>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-lg">
                          <p className="font-medium text-indigo-800 mb-1">Use Clear Language</p>
                          <p className="text-sm text-indigo-700">Write professional and clear responses</p>
                        </div>
                        <div className="p-3 bg-pink-50 rounded-lg">
                          <p className="font-medium text-pink-800 mb-1">Forward Appropriately</p>
                          <p className="text-sm text-pink-700">Forward feedback to the correct department</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">🚨 Important Reminders</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                      <ul className="space-y-2">
                        <li>• Always check URGENT priority feedback first</li>
                        <li>• Update feedback status when taking action</li>
                        <li>• Use the dashboard to monitor overall performance</li>
                        <li>• Export reports regularly for record keeping</li>
                      </ul>
                      <ul className="space-y-2">
                        <li>• Keep responses professional and empathetic</li>
                        <li>• Use analytics to identify improvement areas</li>
                        <li>• Train staff on proper feedback handling</li>
                        <li>• Backup important data regularly</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">📞 Need More Help?</h4>
                    <p className="text-sm text-blue-700">
                      If you need additional assistance or have specific questions about the system, please contact your system administrator or refer to the user manual for detailed instructions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { X, CheckCircle, Circle, Trash2, Check, Eye, Loader2, Bell, MessageSquare } from 'lucide-react';
import axios from 'axios';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8089/api';

// Notification interface based on backend attributes
interface Notification {
  id: number;
  category: string;
  message: string;
  read: boolean;
  patientId: string;
  createdAt: string;
}

// Extended notification interface for UI
interface NotificationWithUI extends Notification {
  title: string;
}

const NotificationsPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');
  const [notifications, setNotifications] = useState<NotificationWithUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Smart date formatting function
  const formatNotificationDate = (dateString: string): string => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMs = now.getTime() - notificationDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // Just now (less than 1 minute)
    if (diffInMinutes < 1) {
      return 'Just now';
    }
    
    // Minutes ago (less than 1 hour)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    }
    
    // Hours ago (less than 2 hours)
    if (diffInHours < 2) {
      return `${diffInHours} hour ago`;
    }
    
    // Today (same day but more than 2 hours ago)
    if (diffInDays === 0) {
      return 'Today';
    }
    
    // Yesterday
    if (diffInDays === 1) {
      return 'Yesterday';
    }
    
    // Older dates - show actual date
    return notificationDate.toLocaleDateString();
  };

  // Get category icon based on category
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'complaint':
        return <MessageSquare className="w-4 h-4" />;
      case 'suggestion':
        return <MessageSquare className="w-4 h-4" />;
      case 'compliment':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  // Get category color based on category
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'complaint':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'suggestion':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'compliment':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Fetch all notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/notifications`);
      
      // Transform the data to include title and format for UI
      const transformedNotifications: NotificationWithUI[] = response.data.map((notification: Notification) => ({
        ...notification,
        title: `New ${notification.category} feedback received`
      }));
      
      // Sort by date (newest first)
      const sortedNotifications = transformedNotifications.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setNotifications(sortedNotifications);
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Load notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);
  const unreadCount = unreadNotifications.length;

  const handleNotificationClick = (notification: NotificationWithUI) => {
    console.log('Notification clicked:', notification);
    
    // Mark as read when clicked
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }

    // Navigate to responses page with patientId
    const navigationState = { 
      patientId: notification.patientId,
      category: notification.category 
    };
    
    console.log('Navigating with state:', navigationState);
    
    navigate('/responses', { 
      state: navigationState
    });

    toast({
      title: "Opening Feedback",
      description: "Notification is opened.",
    });
  };

  const handleMarkAllRead = async () => {
    try {
      // Mark all unread notifications as read
      const unreadIds = unreadNotifications.map(n => n.id);
      await Promise.all(
        unreadIds.map(id => axios.put(`${API_BASE_URL}/notifications/${id}/read`))
      );
      
      // Refresh notifications
      await fetchNotifications();
      
      toast({
        title: "All Notifications Marked as Read",
        description: "All notifications have been marked as read.",
      });
    } catch (err: any) {
      console.error('Error marking all as read:', err);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive"
      });
    }
  };

  const handleClearAll = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/notifications/all`);
      setNotifications([]);
      toast({
        title: "All Notifications Cleared",
        description: "All notifications have been cleared.",
      });
    } catch (err: any) {
      console.error('Error clearing all notifications:', err);
      toast({
        title: "Error",
        description: "Failed to clear all notifications",
        variant: "destructive"
      });
    }
  };

  const handleClearUnread = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/notifications/read?read=false`);
      await fetchNotifications();
      toast({
        title: "Unread Notifications Cleared",
        description: "All unread notifications have been cleared.",
      });
    } catch (err: any) {
      console.error('Error clearing unread notifications:', err);
      toast({
        title: "Error",
        description: "Failed to clear unread notifications",
        variant: "destructive"
      });
    }
  };

  const handleClearRead = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/notifications/read?read=true`);
      await fetchNotifications();
      toast({
        title: "Read Notifications Cleared",
        description: "All read notifications have been cleared.",
      });
    } catch (err: any) {
      console.error('Error clearing read notifications:', err);
      toast({
        title: "Error",
        description: "Failed to clear read notifications",
        variant: "destructive"
      });
    }
  };

  const handleRemoveNotification = async (notificationId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the notification click
    
    try {
      await axios.delete(`${API_BASE_URL}/notifications/${notificationId}`);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      toast({
        title: "Notification Removed",
        description: "The notification has been removed.",
      });
    } catch (err: any) {
      console.error('Error removing notification:', err);
      toast({
        title: "Error",
        description: "Failed to remove notification",
        variant: "destructive"
      });
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await axios.put(`${API_BASE_URL}/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      toast({
        title: "Notification Marked as Read",
        description: "The notification has been marked as read.",
      });
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive"
      });
    }
  };

  const renderNotification = (notification: NotificationWithUI) => (
    <div 
      key={notification.id} 
      className={`relative p-4 rounded-lg border transition-all duration-200 cursor-pointer group ${
        notification.read 
          ? 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm' 
          : 'bg-blue-50 border-blue-200 hover:border-blue-300 hover:shadow-md'
      }`}
      onClick={() => handleNotificationClick(notification)}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute top-4 left-4 w-2 h-2 bg-blue-500 rounded-full"></div>
      )}
      
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          notification.read ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'
        }`}>
          {notification.read ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className={`font-medium text-sm ${
                notification.read ? 'text-gray-700' : 'text-gray-900'
              }`}>
                New{' '}
                <Badge 
                  variant="outline" 
                  className={`text-xs font-medium ${getCategoryColor(notification.category)}`}
                >
                  <span className="ml-1">{notification.category}</span>
                </Badge>
                {' '}feedback received
              </h3>
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0">
              {formatNotificationDate(notification.createdAt)}
            </span>
          </div>
          <p className={`text-sm mt-1 ${
            notification.read ? 'text-gray-600' : 'text-gray-700'
          }`}>
            {notification.message}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
        {!notification.read && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-blue-100"
            onClick={(e) => handleMarkAsRead(notification.id)}
            title="Mark as read"
          >
            <CheckCircle className="w-3 h-3" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
          onClick={(e) => handleRemoveNotification(notification.id, e)}
          title="Delete notification"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );

  const renderTabContent = (notifications: NotificationWithUI[], emptyMessage: string) => (
    <div className="space-y-3">
      {notifications.length > 0 ? (
        notifications.map(renderNotification)
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{emptyMessage}</p>
        </div>
      )}
    </div>
  );

  const renderTabActions = () => {
    switch (activeTab) {
      case 'all':
        return (
          <Button variant="outline" onClick={handleClearAll} className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
        );
      case 'unread':
        return (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleMarkAllRead} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Mark All Read
            </Button>
            <Button variant="outline" onClick={handleClearUnread} className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Clear Unread
            </Button>
          </div>
        );
      case 'read':
        return (
          <Button variant="outline" onClick={handleClearRead} className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Clear Read
          </Button>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading notifications...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-2">Error: {error}</div>
          <Button onClick={fetchNotifications} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('notifications')}</h1>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg justify-between flex items-center gap-2">
           <div className='items-center gap-4'>
            {t('recentNotifications')} 
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {unreadCount} {t('unread')}
            </Badge>
           </div>
            <div>
            {renderTabActions()}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="flex items-center gap-2">
                All <Badge variant="secondary" className="ml-1">{notifications.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex items-center gap-2">
                Unread <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-700">{unreadCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="read" className="flex items-center gap-2">
                Read <Badge variant="secondary" className="ml-1">{readNotifications.length}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              {renderTabContent(notifications, "No notifications found")}
            </TabsContent>
            
            <TabsContent value="unread" className="mt-4">
              {renderTabContent(unreadNotifications, "No unread notifications")}
            </TabsContent>
            
            <TabsContent value="read" className="mt-4">
              {renderTabContent(readNotifications, "No read notifications")}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;

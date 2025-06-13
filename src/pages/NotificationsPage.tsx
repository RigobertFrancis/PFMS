
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { notifications, feedbacks } from '@/lib/mockData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const NotificationsPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleNotificationClick = (notification: any) => {
    // Find the feedback associated with this notification
    const associatedFeedback = feedbacks.find(f => 
      notification.title.includes('feedback') || 
      notification.message.includes('feedback') ||
      notification.message.includes('complaint') ||
      notification.message.includes('suggestion') ||
      notification.message.includes('compliment')
    );

    if (associatedFeedback) {
      // Navigate to responses with the specific feedback ID as state
      navigate('/responses', { state: { selectedFeedbackId: associatedFeedback.id } });
    } else {
      // Fallback to general responses page
      navigate('/responses');
    }

    toast({
      title: "Opening Feedback",
      description: "Taking you to the response page with the selected feedback.",
    });
  };

  const handleMarkAllRead = () => {
    toast({
      title: "All Notifications Marked as Read",
      description: "All notifications have been marked as read.",
    });
  };

  const handleClearAll = () => {
    toast({
      title: "All Notifications Cleared",
      description: "All notifications have been cleared.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('notifications')}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleMarkAllRead}>{t('markAllRead')}</Button>
          <Button variant="outline" onClick={handleClearAll}>{t('clearAll')}</Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            {t('recentNotifications')} <Badge variant="outline">{unreadCount} {t('unread')}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-3 border-l-4 ${notification.read ? 'border-gray-300 bg-gray-50' : 'border-med-blue bg-blue-50'} rounded-sm cursor-pointer hover:bg-blue-100 transition-colors`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{notification.title}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;

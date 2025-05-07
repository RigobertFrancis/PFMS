
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { notifications } from '@/lib/mockData';

const NotificationsPage: React.FC = () => {
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex gap-2">
          <Button variant="outline">Mark All Read</Button>
          <Button variant="outline">Clear All</Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            Recent Notifications <Badge variant="outline">{unreadCount} Unread</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-3 border-l-4 ${notification.read ? 'border-gray-300 bg-gray-50' : 'border-med-blue bg-blue-50'} rounded-sm`}
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

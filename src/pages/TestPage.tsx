import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TestPage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Page - Authentication Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Authentication Status:</h3>
            <p className="text-sm text-gray-600">
              {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
            </p>
          </div>
          
          {user && (
            <div>
              <h3 className="font-semibold">User Information:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}</p>
              </div>
            </div>
          )}
          
          <div>
            <h3 className="font-semibold">Actions:</h3>
            <div className="space-x-2">
              <Button onClick={() => window.location.href = '/'}>
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestPage; 
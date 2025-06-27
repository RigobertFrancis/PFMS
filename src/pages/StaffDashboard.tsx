import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Patient Feedback Management System
                </h1>
                <p className="text-sm text-gray-500">
                  {user?.role === 'STAFF' ? 'Staff Portal' : 'Manager Portal'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{user?.username}</span>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {user?.role}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm p-8 border">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome, {user?.username}!
            </h2>
            <p className="text-gray-600 mb-4">
              You are logged in as a <strong>{user?.role}</strong> user.
            </p>
            <p className="text-sm text-gray-500">
              This portal is currently under development. Please contact your administrator for access to the main application.
            </p>
          </div>

          {/* Role-specific Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {user?.role === 'STAFF' ? 'Staff Information' : 'Manager Information'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Username:</strong> {user?.username}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {user?.email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Role:</strong> {user?.role}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong> 
                  <span className={`ml-1 px-2 py-1 text-xs font-medium rounded-full ${
                    user?.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Account Created:</strong> {new Date(user?.createdAt || '').toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Last Login:</strong> {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                </p>
              </div>
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              🚧 Coming Soon
            </h3>
            <p className="text-blue-700">
              The full {user?.role === 'STAFF' ? 'staff' : 'manager'} dashboard is currently being developed. 
              You will soon have access to all the features you need.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard; 
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  allowedRoles, 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        // If user's role is not allowed, redirect them
        if (user.role === 'ADMIN') {
          navigate('/');
        } else if (user.role === 'STAFF' || user.role === 'MANAGER') {
          navigate('/department-dashboard');
        } else {
          // Fallback redirect if role has no specific dashboard
          navigate('/auth/login'); 
        }
      }
    }
  }, [user, isAuthenticated, isLoading, allowedRoles, navigate]);

  // While loading authentication state, show a spinner
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If role is allowed, render the children
  if (user && allowedRoles && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  // Otherwise, show a loading spinner while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default RoleBasedRoute; 
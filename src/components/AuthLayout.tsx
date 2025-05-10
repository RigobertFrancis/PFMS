
/**
 * Auth Layout Component
 * 
 * Layout specifically for authentication pages like login and register.
 * Provides a consistent design for all authentication-related pages.
 */
import React from 'react';
import { Outlet } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';

const AuthLayout: React.FC = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Outlet />
      </div>
    </LanguageProvider>
  );
};

export default AuthLayout;

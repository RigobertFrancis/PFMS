
/**
 * Layout Component
 * 
 * The main layout component that structures the application.
 * It includes the sidebar, header, and main content area.
 * Also wraps everything in the LanguageProvider to enable translations.
 */
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { LanguageProvider } from '@/contexts/LanguageContext';

const Layout: React.FC = () => {
  return (
    <LanguageProvider>
      <div className="flex h-screen w-full">
        <Sidebar />
        <div className="flex flex-col flex-grow overflow-hidden">
          <Header />
          <main className="flex-grow overflow-auto p-4 bg-gray-100">
            <Outlet />
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
};

export default Layout;

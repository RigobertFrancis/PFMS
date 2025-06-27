import React from 'react';
import { Outlet } from 'react-router-dom';
import DepartmentSidebar from './DepartmentSidebar';
import Header from './Header';
import { LanguageProvider } from '@/contexts/LanguageContext';

const DepartmentLayout: React.FC = () => {
  return (
    <LanguageProvider>
      <div className="flex h-screen w-full bg-gray-100">
        <DepartmentSidebar />
        <div className="flex flex-col flex-grow overflow-hidden">
          <Header />
          <main className="flex-grow overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
};

export default DepartmentLayout; 
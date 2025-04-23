
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex flex-col flex-grow overflow-hidden">
        <Header />
        <main className="flex-grow overflow-auto p-4 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

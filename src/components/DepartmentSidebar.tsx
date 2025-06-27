`import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Building2,
  ChevronLeft
} from 'lucide-react';
import { Button } from './ui/button';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center px-4 py-3 gap-3 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? "bg-med-blue text-white shadow"
            : "text-black hover:bg-med-blue/20 hover:text-black"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

const DepartmentSidebar: React.FC = () => {
  const { user } = useAuth();

  return (
    <aside className="w-60 bg-gray-200 flex flex-col border-r border-gray-300 p-4">
      <div className="flex items-center gap-3 p-2 mb-4">
         <Building2 className="h-9 w-9 text-med-blue" />
         <div className="flex flex-col">
            <span className="text-base font-bold text-gray-800">
               {user?.departmentName || 'Department'}
            </span>
            <span className="text-xs text-gray-500">
               {user?.role} Portal
            </span>
         </div>
      </div>

      <nav className="flex flex-col space-y-1">
        <NavItem
          to="/department-dashboard"
          icon={<LayoutDashboard size={18} className="text-med-blue" />}
          label="Dashboard"
        />
        <NavItem
          to="/department-dashboard/responses"
          icon={<MessageSquare size={18} className="text-med-blue" />}
          label="Responses"
        />
        <NavItem
          to="/department-dashboard/reports"
          icon={<FileText size={18} className="text-med-blue" />}
          label="Reports"
        />
      </nav>
      
      <div className="mt-auto">
        {/* Future items like settings or user profile link can go here */}
      </div>
    </aside>
  );
};

export default DepartmentSidebar; `
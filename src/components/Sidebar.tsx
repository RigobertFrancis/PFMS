
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BarChart2, 
  FileText, 
  MessageCircle, 
  Bell,
  ChevronLeft,
  Users
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
      className={({ isActive }) =>
        `flex items-center px-4 py-3 gap-3 text-sm ${
          isActive ? "bg-med-blue text-white" : "hover:bg-gray-200"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

const Sidebar: React.FC = () => {
  return (
    <aside className="w-44 bg-gray-200 flex flex-col border-r border-gray-300 sidebar-navigation">
      <div className="p-2 border-b border-gray-300 flex justify-end">
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <ChevronLeft size={16} />
        </Button>
      </div>
      <nav className="flex flex-col flex-grow">
        <NavItem to="/" icon={<Home size={18} />} label="Home" />
        <NavItem to="/departments" icon={<BarChart2 size={18} />} label="Departments" />
        <NavItem to="/visitors" icon={<Users size={18} />} label="Visitors" />
        <NavItem to="/analytics" icon={<BarChart2 size={18} />} label="Analytics" />
        <NavItem to="/reporting" icon={<FileText size={18} />} label="Reporting" />
        <NavItem to="/responses" icon={<MessageCircle size={18} />} label="Responses" />
        <NavItem to="/notifications" icon={<Bell size={18} />} label="Notifications" />
      </nav>
      <div className="p-4 mt-auto border-t border-gray-300">
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
            <path d="M19.5 12a7.5 7.5 0 1 0 -15 0a7.5 7.5 0 0 0 15 0z"></path>
            <path d="M12 7v1"></path>
            <path d="M12 16v1"></path>
            <path d="M7 12h1"></path>
            <path d="M16 12h1"></path>
          </svg>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;

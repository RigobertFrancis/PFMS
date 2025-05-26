
/**
 * Sidebar Component
 * 
 * The main navigation sidebar that contains links to different sections of the application.
 * It's displayed on the left side of the layout and can be collapsed.
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BarChart2, 
  FileText, 
  MessageCircle, 
  Bell,
  ChevronLeft
} from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Props for the NavItem component
 */
interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

/**
 * NavItem Component
 * 
 * Individual navigation item that highlights when active
 */
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

/**
 * Sidebar Component
 */
const Sidebar: React.FC = () => {
  // Get translation function from language context
  const { t } = useLanguage();
  
  return (
    <aside className="w-44 bg-gray-200 flex flex-col border-r border-gray-300 sidebar-navigation">
      {/* Collapse button */}
      <div className="p-2 border-b border-gray-300 flex justify-end">
        <Button variant="ghost" size="icon" className="h-6 w-6" title="Collapse sidebar">
          <ChevronLeft size={16} />
        </Button>
      </div>
      
      {/* Navigation links */}
      <nav className="flex flex-col flex-grow">
        <NavItem to="/" icon={<Home size={18} />} label={t('home')} />
        <NavItem to="/departments" icon={<BarChart2 size={18} />} label={t('departments')} />
        <NavItem to="/analytics" icon={<BarChart2 size={18} />} label={t('analytics')} />
        <NavItem to="/reporting" icon={<FileText size={18} />} label={t('reporting')} />
        <NavItem to="/responses" icon={<MessageCircle size={18} />} label={t('responses')} />
        <NavItem to="/notifications" icon={<Bell size={18} />} label={t('notifications')} />
      </nav>
      
      {/* Settings icon at the bottom */}
      <div className="p-4 mt-auto border-t border-gray-300">
        <Button variant="ghost" size="icon" className="h-6 w-6" title="Settings">
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

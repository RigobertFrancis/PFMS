/**
 * Header Component
 * 
 * The top navigation bar that includes the app logo, search box,
 * language switcher, help button, and user profile.
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, HelpCircle, User, LogOut } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './ui/use-toast';

const Header: React.FC = () => {
  // Get translation function from language context
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout, isAuthenticated } = useAuth();
  
  // Handle logout
  const handleLogout = () => {
    logout();
    
    // Show success message
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    
    // Redirect to login page
    navigate('/auth/login');
  };
  
  return (
    <header className="bg-med-blue p-4 flex items-center justify-between border-b border-med-blue-dark">
      {/* App logo and title */}
      <div className="flex items-center text-white">
        {/* <div className="mr-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#2D3748" />
            <path d="M8 12H16M12 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div> */}
        <div>
          <h1 className="font-bold text-xl tracking-wide text-black/70">
            PATIENT FEEDBACK MANAGEMENT SYSTEM
          </h1>
        </div>
      </div>
      
      {/* Header right section: search, language switcher, help, profile */}
      <div className="flex items-center gap-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            className="w-64 pl-8 bg-white"
            placeholder={t('searchPlaceholder')}
            type="search"
          />
        </div>
        
        {/* Language switcher */}
        <LanguageSwitcher />
        
        {/* Help button */}
        <Button variant="link" className="text-white flex items-center gap-1">
          <span>{t('needHelp')}</span>
          <HelpCircle size={18} />
        </Button>
        
        {/* User profile or login/register */}
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="border-2 border-white cursor-pointer">
                <AvatarFallback className="bg-gray-800 text-white">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>{user.name}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('logOut')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white" asChild>
              <Link to="/auth/login">{t('login')}</Link>
            </Button>
            <Button size="sm" className="bg-white text-med-blue hover:bg-gray-100" asChild>
              <Link to="/auth/register">{t('register')}</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;


import React from 'react';
import { Search, HelpCircle, User } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';

const Header: React.FC = () => {
  return (
    <header className="bg-med-blue p-4 flex items-center justify-between border-b border-med-blue-dark">
      <div className="flex items-center text-white">
        <div className="mr-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#2D3748" />
            <path d="M8 12H16M12 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h1 className="font-bold text-lg uppercase">PATIENT FEEDBACK</h1>
          <p className="text-xs uppercase">MANAGEMENT SYSTEM</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            className="w-64 pl-8 bg-white"
            placeholder="Search anything?"
            type="search"
          />
        </div>
        
        <Button variant="link" className="text-white flex items-center gap-1">
          <span>Need Help?</span>
          <HelpCircle size={18} />
        </Button>
        
        <Avatar className="border-2 border-white">
          <AvatarFallback className="bg-gray-800 text-white">AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;

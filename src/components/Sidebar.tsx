/**
 * Sidebar Component
 * 
 * The main navigation sidebar that contains links to different sections of the application.
 * It's displayed on the left side of the layout and can be collapsed.
 */
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BarChart2, 
  FileText, 
  MessageCircle, 
  Bell,
  ChevronLeft,
  Building2,
  Settings,
  Moon,
  Sun,
  Monitor,
  Palette,
  User,
  Shield,
  Globe,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';

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
  
  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  
  return (
    <>
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
          <NavItem to="/departments" icon={<Building2 size={18} />} label={t('departments')} />
          <NavItem to="/analytics" icon={<BarChart2 size={18} />} label={t('analytics')} />
          <NavItem to="/reporting" icon={<FileText size={18} />} label={t('reporting')} />
          <NavItem to="/responses" icon={<MessageCircle size={18} />} label={t('responses')} />
          <NavItem to="/notifications" icon={<Bell size={18} />} label={t('notifications')} />
        </nav>
        
        {/* Settings icon at the bottom */}
        <div className="p-4 mt-auto border-t border-gray-300">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            title="Settings"
            onClick={() => setShowSettings(true)}
          >
            <Settings size={18} />
          </Button>
        </div>
      </aside>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Settings className="h-6 w-6 text-blue-600" />
              System Settings
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="accessibility" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Accessibility
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                System
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-blue-600" />
                    Theme Settings
                  </CardTitle>
                  <CardDescription>
                    Customize the appearance of the application to match your preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="theme" className="text-sm font-medium">Theme</Label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger className="w-full mt-2">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">
                            <div className="flex items-center gap-2">
                              <Sun className="h-4 w-4" />
                              Light
                            </div>
                          </SelectItem>
                          <SelectItem value="dark">
                            <div className="flex items-center gap-2">
                              <Moon className="h-4 w-4" />
                              Dark
                            </div>
                          </SelectItem>
                          <SelectItem value="auto">
                            <div className="flex items-center gap-2">
                              <Monitor className="h-4 w-4" />
                              Auto (System)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Compact Mode</Label>
                        <p className="text-sm text-gray-500">Reduce spacing for more content</p>
                      </div>
                      <Switch
                        checked={compactMode}
                        onCheckedChange={setCompactMode}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">High Contrast</Label>
                        <p className="text-sm text-gray-500">Increase contrast for better visibility</p>
                      </div>
                      <Switch
                        checked={highContrast}
                        onCheckedChange={setHighContrast}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-600" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Configure how and when you receive notifications from the system.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Enable Notifications</Label>
                        <p className="text-sm text-gray-500">Receive system notifications</p>
                      </div>
                      <Switch
                        checked={notifications}
                        onCheckedChange={setNotifications}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Sound Alerts</Label>
                        <p className="text-sm text-gray-500">Play sound for new notifications</p>
                      </div>
                      <Switch
                        checked={sound}
                        onCheckedChange={setSound}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Notification Types</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium">New Feedback</p>
                            <p className="text-xs text-gray-500">When new feedback is submitted</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium">Urgent Feedback</p>
                            <p className="text-xs text-gray-500">High priority feedback alerts</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium">System Updates</p>
                            <p className="text-xs text-gray-500">Important system announcements</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="accessibility" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Accessibility Options
                  </CardTitle>
                  <CardDescription>
                    Configure accessibility features to improve your experience.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Screen Reader Support</Label>
                        <p className="text-sm text-gray-500">Enable enhanced screen reader compatibility</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Keyboard Navigation</Label>
                        <p className="text-sm text-gray-500">Enhanced keyboard shortcuts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Focus Indicators</Label>
                        <p className="text-sm text-gray-500">Highlight focused elements</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Text Size</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select text size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="extra-large">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    System Preferences
                  </CardTitle>
                  <CardDescription>
                    Configure system-wide settings and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Auto Refresh</Label>
                        <p className="text-sm text-gray-500">Automatically refresh data every 30 seconds</p>
                      </div>
                      <Switch
                        checked={autoRefresh}
                        onCheckedChange={setAutoRefresh}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="sw">Swahili</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Time Zone</Label>
                      <Select defaultValue="utc+3">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select time zone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc+3">East Africa Time (UTC+3)</SelectItem>
                          <SelectItem value="utc+0">UTC</SelectItem>
                          <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Data Export Format</Label>
                      <Select defaultValue="pdf">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">System Information</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p>Version: 1.0.0</p>
                        <p>Last Updated: {new Date().toLocaleDateString()}</p>
                        <p>Browser: {navigator.userAgent.split(' ').pop()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Sidebar;

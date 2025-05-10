
/**
 * LanguageSwitcher Component
 * 
 * This component provides a button to toggle between English and Kiswahili.
 * It uses the LanguageContext to access and update the current language.
 */
import React from 'react';
import { Button } from './ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Languages } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  // Get language state and setter from context
  const { language, setLanguage, t } = useLanguage();

  /**
   * Toggle between English and Kiswahili
   */
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sw' : 'en');
  };

  return (
    <Button 
      variant="link" 
      className="text-white flex items-center gap-1" 
      onClick={toggleLanguage}
      title={language === 'en' ? 'Switch to Kiswahili' : 'Switch to English'}
    >
      <Languages size={18} />
      <span className="ml-1">{t('switchLanguage')}</span>
    </Button>
  );
};

export default LanguageSwitcher;

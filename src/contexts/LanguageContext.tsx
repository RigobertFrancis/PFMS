
/**
 * LanguageContext.tsx
 * 
 * This file creates a React Context to manage language settings across the application.
 * It provides functions to switch between English and Kiswahili and translate text.
 */
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { en } from '../translations/en';
import { sw } from '../translations/sw';

// Define the supported languages
type Language = 'en' | 'sw';

// Type for the translation object structure
type TranslationsType = typeof en;

// Context interface definition
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationsType) => string;
}

// All available translations
const translations = {
  en,
  sw,
};

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * LanguageProvider component that wraps the application and provides language functionality
 */
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Default language is English
  const [language, setLanguage] = useState<Language>('en');

  /**
   * Translation function that returns text in the current language
   * Falls back to the key if translation is not found
   */
  const t = (key: keyof TranslationsType) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Custom hook to use the language context within components
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

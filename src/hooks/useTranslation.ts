import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translateText, translateBatch } from '@/lib/translate';

export function useTranslation() {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Translate a single text
  const t = useCallback(async (text: string): Promise<string> => {
    if (!text || language === 'en') return text;
    
    // Check if already translated
    if (translations[text]) {
      return translations[text];
    }
    
    try {
      setLoading(true);
      setError(null);
      const translated = await translateText(text, language);
      
      // Cache the translation
      setTranslations(prev => ({
        ...prev,
        [text]: translated
      }));
      
      return translated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
      return text; // Fallback to original text
    } finally {
      setLoading(false);
    }
  }, [language, translations]);

  // Translate multiple texts at once
  const tBatch = useCallback(async (texts: string[]): Promise<string[]> => {
    if (language === 'en') return texts;
    
    try {
      setLoading(true);
      setError(null);
      const translated = await translateBatch(texts, language);
      
      // Cache all translations
      const newTranslations: Record<string, string> = {};
      texts.forEach((text, index) => {
        newTranslations[text] = translated[index];
      });
      
      setTranslations(prev => ({
        ...prev,
        ...newTranslations
      }));
      
      return translated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
      return texts; // Fallback to original texts
    } finally {
      setLoading(false);
    }
  }, [language]);

  // Clear translations when language changes
  useEffect(() => {
    setTranslations({});
    setError(null);
  }, [language]);

  return {
    t,
    tBatch,
    loading,
    error,
    clearCache: () => setTranslations({})
  };
}

// Synchronous version for immediate UI updates
export function useTranslationSync() {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<Record<string, string>>({});

  const t = useCallback((text: string): string => {
    if (!text || language === 'en') return text;
    return translations[text] || text;
  }, [language, translations]);

  // Pre-load translations for known terms
  useEffect(() => {
    const knownTerms = [
      'Emergency', 'Outpatient Clinic', 'Inpatient Ward', 'Radiology',
      'Laboratory', 'Pharmacy', 'Billing', 'Mortuary', 'Maternity',
      'NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED',
      'HIGH', 'MEDIUM', 'LOW', 'URGENT',
      'COMPLAINT', 'SUGGESTION', 'COMPLIMENT',
      'Add Department', 'Edit Department', 'Delete Department',
      'Save', 'Cancel', 'Delete', 'Edit', 'Loading...'
    ];

    const loadTranslations = async () => {
      try {
        const translated = await translateBatch(knownTerms, language);
        const newTranslations: Record<string, string> = {};
        knownTerms.forEach((term, index) => {
          newTranslations[term] = translated[index];
        });
        setTranslations(newTranslations);
      } catch (error) {
        console.warn('Failed to pre-load translations:', error);
      }
    };

    if (language === 'sw') {
      loadTranslations();
    } else {
      setTranslations({});
    }
  }, [language]);

  return { t };
} 
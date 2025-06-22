import { sw } from '@/translations/sw';
import { en } from '@/translations/en';

// Comprehensive dictionary for known terms
const dictionary: Record<string, Record<string, string>> = {
  // Department names
  departments: {
    'Emergency': 'Dharura',
    'Outpatient Clinic': 'Kliniki ya Nje',
    'Inpatient Ward': 'Wodi ya Wagonjwa',
    'Radiology': 'Radiologia',
    'Laboratory': 'Maabara',
    'Pharmacy': 'Duka la Dawa',
    'Billing': 'Bili',
    'Mortuary': 'Jeneza',
    'Maternity': 'Uzazi',
    'Immunization': 'Chanjo',
  },
  // Status values
  status: {
    'NEW': 'MPYA',
    'IN_PROGRESS': 'INAENDELEA',
    'RESOLVED': 'IMESULUHISHWA',
    'CLOSED': 'IMEFUNGWA',
  },
  // Priority values
  priority: {
    'HIGH': 'JUU',
    'MEDIUM': 'WASTANI',
    'LOW': 'CHINI',
    'URGENT': 'MUHIMU',
  },
  // Feedback types
  feedbackTypes: {
    'COMPLAINT': 'MALAMIKO',
    'SUGGESTION': 'MAPENDEKEZO',
    'COMPLIMENT': 'PONGEZI',
  },
  // Question types
  questionTypes: {
    'TEXT': 'MAANDISHI',
    'RATING': 'TATHMINI',
    'DROPDOWN': 'ORODHA',
    'RADIO': 'CHAGUO',
  },
  // Common UI terms
  ui: {
    'Add Department': 'Ongeza Idara',
    'Edit Department': 'Hariri Idara',
    'Delete Department': 'Futa Idara',
    'Department Name': 'Jina la Idara',
    'Description': 'Maelezo',
    'Priority': 'Kipaumbele',
    'Questions': 'Maswali',
    'Add Question': 'Ongeza Swali',
    'Question Text': 'Maandishi ya Swali',
    'Question Type': 'Aina ya Swali',
    'Required': 'Lazima',
    'Save': 'Hifadhi',
    'Cancel': 'Ghairi',
    'Delete': 'Futa',
    'Edit': 'Hariri',
    'View Details': 'Tazama Maelezo',
    'Total Feedback': 'Jumla ya Maoni',
    'Complaints': 'Malalamiko',
    'Suggestions': 'Mapendekezo',
    'Compliments': 'Pongezi',
    'Loading...': 'Inapakia...',
    'Error': 'Hitilafu',
    'Success': 'Mafanikio',
    'Failed to load': 'Imeshindwa kupakia',
    'Department created successfully': 'Idara imeundwa kwa mafanikio',
    'Department updated successfully': 'Idara imesasishwa kwa mafanikio',
    'Department deleted successfully': 'Idara imefutwa kwa mafanikio',
    'Failed to create department': 'Imeshindwa kuunda idara',
    'Failed to update department': 'Imeshindwa kusasisha idara',
    'Failed to delete department': 'Imeshindwa kufuta idara',
    'Departments': 'Maidara',
    'Add New Department': 'Ongeza Idara Mpya',
    'View Department': 'Tazama Idara',
    'Create a new department to manage patient feedback.': 'Unda idara mpya kusimamia maoni ya wagonjwa.',
    'Basic Info': 'Maelezo ya Msingi',
    'Feedback Form': 'Fomu ya Maoni',
    'Feedbacks': 'Maoni',
    'Analytics': 'Uchambuzi',
    'Settings': 'Mipangilio',
    'Enter department name': 'Weka jina la idara',
    'Enter department description': 'Weka maelezo ya idara',
    'Required fields': 'Sehemu zinazohitajika',
    'Text Input': 'Ingizo la Maandishi',
    'Rating (1-5)': 'Tathmini (1-5)',
    'Dropdown Select': 'Chaguo la Orodha',
    'Radio Buttons': 'Vitufe vya Redio',
    'This question is required': 'Swali hili linahitajika',
    'Form Questions': 'Maswali ya Fomu',
    'No questions added yet': 'Hakuna maswali yaliyoongezwa bado',
    'Add questions using the form on the left': 'Ongeza maswali kutumia fomu upande wa kushoto',
    'Feedbacks will be available after creating the department': 'Maoni yatapatikana baada ya kuunda idara',
    'Analytics will be available after creating the department': 'Uchambuzi utapatikana baada ya kuunda idara',
    'Settings will be available after creating the department': 'Mipangilio itapatikana baada ya kuunda idara',
    'Next: Feedback Form': 'Ifuatayo: Fomu ya Maoni',
    'Back to Basic Info': 'Rudi kwenye Maelezo ya Msingi',
    'Update the department details.': 'Sasisha maelezo ya idara.',
    'Are you sure?': 'Una uhakika?',
    'This action will permanently delete the': 'Kitendo hiki kitafuta kabisa',
    'department and all associated feedback data. This action cannot be undone.': 'idara na data zote za maoni zinazohusiana. Kitendo hiki hakiwezi kufutwa.',
    'Save Changes': 'Hifadhi Mabadiliko',
    'Please wait while loading departments!': 'Subiri kidogo wakati wa kupakia maidara!',
    'Manage feedback for the': 'Simamia maoni ya',
    'department': 'idara',
    'Options': 'Chaguo',
    'Add Option': 'Ongeza Chaguo',
    'Question added to form': 'Swali limeongezwa kwenye fomu',
    'Question removed from form': 'Swali limeondolewa kutoka kwenye fomu',
    'Department created but failed to add questions': 'Idara imeundwa lakini imeshindwa kuongeza maswali',
  }
};

// Cache for API translations to avoid repeated calls
const translationCache = new Map<string, string>();

export async function translateText(text: string, lang: 'en' | 'sw'): Promise<string> {
  if (!text || lang === 'en') return text;
  
  // Check cache first
  const cacheKey = `${text}_${lang}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }
  
  // Check dictionary first
  for (const group of Object.values(dictionary)) {
    if (group[text]) {
      const translation = group[text];
      translationCache.set(cacheKey, translation);
      return translation;
    }
  }
  
  // Fallback: Use a translation API for dynamic content
  try {
    // Using LibreTranslate (free, no API key required)
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: 'sw',
        format: 'text'
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      const translation = data.translatedText || text;
      translationCache.set(cacheKey, translation);
      return translation;
    }
  } catch (error) {
    console.warn('Translation API failed, using original text:', error);
  }
  
  // If all else fails, return original text
  return text;
}

// Batch translate multiple texts
export async function translateBatch(texts: string[], lang: 'en' | 'sw'): Promise<string[]> {
  if (lang === 'en') return texts;
  
  const results = await Promise.all(
    texts.map(text => translateText(text, lang))
  );
  
  return results;
}

// Clear translation cache
export function clearTranslationCache(): void {
  translationCache.clear();
} 
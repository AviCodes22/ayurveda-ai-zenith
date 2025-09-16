import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.schedule': 'Schedule Therapy',
    'nav.progress': 'Progress',
    'nav.feedback': 'Feedback',
    'nav.notifications': 'Notifications',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    
    // Dashboard
    'dashboard.welcome': 'Welcome to AyurTech Pro',
    'dashboard.patient': 'Patient Dashboard',
    'dashboard.doctor': 'Doctor Dashboard',
    'dashboard.admin': 'Admin Dashboard',
    
    // Scheduling
    'schedule.title': 'Schedule Your Therapy',
    'schedule.selectTherapy': 'Select Therapy',
    'schedule.selectDate': 'Select Date',
    'schedule.selectTime': 'Select Time',
    'schedule.aiOptimize': 'AI Optimize Schedule',
    'schedule.bookAppointment': 'Book Appointment',
    
    // Progress
    'progress.title': 'Your Wellness Progress',
    'progress.heartRate': 'Heart Rate',
    'progress.bloodPressure': 'Blood Pressure',
    'progress.wellnessScore': 'Wellness Score',
    'progress.energyLevel': 'Energy Level',
    
    // Feedback
    'feedback.title': 'Therapy Feedback',
    'feedback.rating': 'Rating',
    'feedback.comments': 'Comments',
    'feedback.painBefore': 'Pain Level Before',
    'feedback.painAfter': 'Pain Level After',
    'feedback.energyLevel': 'Energy Level',
    'feedback.sleepQuality': 'Sleep Quality',
    'feedback.submit': 'Submit Feedback',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
    
    // Language Selection
    'language.title': 'Choose Your Language',
    'language.subtitle': 'Select your preferred language for the best experience',
    'language.english': 'English',
    'language.hindi': 'हिंदी',
    'language.continue': 'Continue',
  },
  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.schedule': 'चिकित्सा अनुसूची',
    'nav.progress': 'प्रगति',
    'nav.feedback': 'प्रतिक्रिया',
    'nav.notifications': 'सूचनाएं',
    'nav.settings': 'सेटिंग्स',
    'nav.logout': 'लॉग आउट',
    
    // Dashboard
    'dashboard.welcome': 'आयुर्टेक प्रो में आपका स्वागत है',
    'dashboard.patient': 'रोगी डैशबोर्ड',
    'dashboard.doctor': 'चिकित्सक डैशबोर्ड',
    'dashboard.admin': 'प्रशासक डैशबोर्ड',
    
    // Scheduling
    'schedule.title': 'अपनी चिकित्सा की अनुसूची बनाएं',
    'schedule.selectTherapy': 'चिकित्सा चुनें',
    'schedule.selectDate': 'दिनांक चुनें',
    'schedule.selectTime': 'समय चुनें',
    'schedule.aiOptimize': 'एआई अनुकूलित अनुसूची',
    'schedule.bookAppointment': 'अपॉइंटमेंट बुक करें',
    
    // Progress
    'progress.title': 'आपकी कल्याण प्रगति',
    'progress.heartRate': 'हृदय गति',
    'progress.bloodPressure': 'रक्तचाप',
    'progress.wellnessScore': 'कल्याण स्कोर',
    'progress.energyLevel': 'ऊर्जा स्तर',
    
    // Feedback
    'feedback.title': 'चिकित्सा प्रतिक्रिया',
    'feedback.rating': 'रेटिंग',
    'feedback.comments': 'टिप्पणियां',
    'feedback.painBefore': 'पूर्व दर्द स्तर',
    'feedback.painAfter': 'बाद दर्द स्तर',
    'feedback.energyLevel': 'ऊर्जा स्तर',
    'feedback.sleepQuality': 'नींद की गुणवत्ता',
    'feedback.submit': 'प्रतिक्रिया जमा करें',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.view': 'देखें',
    'common.back': 'वापस',
    'common.next': 'अगला',
    'common.previous': 'पिछला',
    'common.close': 'बंद करें',
    
    // Language Selection
    'language.title': 'अपनी भाषा चुनें',
    'language.subtitle': 'सर्वोत्तम अनुभव के लिए अपनी पसंदीदा भाषा चुनें',
    'language.english': 'English',
    'language.hindi': 'हिंदी',
    'language.continue': 'जारी रखें',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'hi';
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
      setLanguageState(savedLanguage);
    }
    
    // Check if user has seen language selection
    const hasSeenLanguageSelection = localStorage.getItem('hasSeenLanguageSelection');
    if (!hasSeenLanguageSelection) {
      // Will be handled by LanguageSelection modal
    }
  }, []);

  const setLanguage = (lang: 'en' | 'hi') => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
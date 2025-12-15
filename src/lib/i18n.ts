import { useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    [K in Language]: string;
  };
}

export const translations: Translations = {
  // Navigation
  'nav.home': {
    en: 'Home',
    hi: 'होम'
  },
  'nav.about': {
    en: 'About',
    hi: 'हमारे बारे में'
  },
  'nav.find_internship': {
    en: 'Find Internship',
    hi: 'इंटर्नशिप खोजें'
  },
  'nav.networking_hub': {
    en: 'Networking Hub',
    hi: 'नेटवर्किंग हब'
  },
  'nav.referrals': {
    en: 'Referrals',
    hi: 'रेफरल'
  },
  'nav.dashboard': {
    en: 'Dashboard',
    hi: 'डैशबोर्ड'
  },
  'nav.login': {
    en: 'Login',
    hi: 'लॉगिन'
  },
  'nav.logout': {
    en: 'Sign Out',
    hi: 'लॉग आउट'
  },
  
  // Dashboard
  'dashboard.welcome': {
    en: 'Welcome back',
    hi: 'वापस स्वागत है'
  },
  'dashboard.analytics': {
    en: 'Analytics Dashboard',
    hi: 'एनालिटिक्स डैशबोर्ड'
  },
  'dashboard.applications': {
    en: 'Applications',
    hi: 'आवेदन'
  },
  'dashboard.interviews': {
    en: 'Interviews',
    hi: 'इंटरव्यू'
  },
  'dashboard.response_rate': {
    en: 'Response Rate',
    hi: 'प्रतिक्रिया दर'
  },
  'dashboard.profile_views': {
    en: 'Profile Views',
    hi: 'प्रोफाइल दृश्य'
  },
  
  // Profile
  'profile.title': {
    en: 'My Profile',
    hi: 'मेरी प्रोफाइल'
  },
  'profile.edit': {
    en: 'Edit Profile',
    hi: 'प्रोफाइल संपादित करें'
  },
  'profile.save': {
    en: 'Save Changes',
    hi: 'परिवर्तन सहेजें'
  },
  'profile.personal_info': {
    en: 'Personal Information',
    hi: 'व्यक्तिगत जानकारी'
  },
  'profile.full_name': {
    en: 'Full Name',
    hi: 'पूरा नाम'
  },
  'profile.email': {
    en: 'Email',
    hi: 'ईमेल'
  },
  'profile.phone': {
    en: 'Phone',
    hi: 'फोन'
  },
  'profile.location': {
    en: 'Location',
    hi: 'स्थान'
  },
  
  // Analytics
  'analytics.success_prediction': {
    en: 'Success Prediction',
    hi: 'सफलता की भविष्यवाणी'
  },
  'analytics.application_trend': {
    en: 'Application Trend',
    hi: 'आवेदन प्रवृत्ति'
  },
  'analytics.monthly_progress': {
    en: 'Monthly Progress',
    hi: 'मासिक प्रगति'
  },
  'analytics.prediction_text': {
    en: 'If you apply 10 more times this week, 20% chance of interview',
    hi: 'यदि आप इस सप्ताह 10 और बार आवेदन करते हैं, तो इंटरव्यू की 20% संभावना है'
  },
  
  // Search
  'search.placeholder': {
    en: 'Search internships, companies, or skills...',
    hi: 'इंटर्नशिप, कंपनियां या कौशल खोजें...'
  },
  
  // Homepage
  'home.hero.title': {
    en: '',
    hi: ''
  },
  'home.hero.subtitle': {
    en: '',
    hi: ''
  },
  'home.hero.get_started': {
    en: 'Get Started Free',
    hi: 'मुफ्त शुरुआत करें'
  },
  'home.hero.sign_in': {
    en: 'Sign In',
    hi: 'साइन इन'
  },
  'home.hero.dashboard': {
    en: 'Go to Dashboard',
    hi: 'डैशबोर्ड पर जाएं'
  },
  'home.hero.build_portfolio': {
    en: 'Build Portfolio',
    hi: 'पोर्टफोलियो बनाएं'
  },
  'home.hero.sign_out': {
    en: 'Sign Out',
    hi: 'साइन आउट'
  },
  'home.features.title': {
    en: 'Smart Internship Platform',
    hi: 'स्मार्ट इंटर्नशिप प्लेटफॉर्म'
  },
  'home.features.subtitle': {
    en: 'Experience the future of internship searching with our AI-powered platform featuring automation, intelligent matching, and comprehensive career support.',
    hi: 'हमारे AI-संचालित प्लेटफॉर्म के साथ इंटर्नशिप खोज का भविष्य अनुभव करें जिसमें स्वचालन, बुद्धिमान मिलान और व्यापक करियर सहायता शामिल है।'
  },
  'home.features.ai_powered': {
    en: 'AI-Powered Features',
    hi: 'AI-संचालित सुविधाएं'
  }
};

// Language detection and management
export const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.substring(0, 2).toLowerCase();
  return browserLang === 'hi' ? 'hi' : 'en';
};

export const getStoredLanguage = (): Language => {
  const stored = localStorage.getItem('language') as Language;
  return stored || detectBrowserLanguage();
};

export const setStoredLanguage = (lang: Language) => {
  localStorage.setItem('language', lang);
};

// Translation hook
export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>(getStoredLanguage);

  const switchLanguage = (lang: Language) => {
    setLanguage(lang);
    setStoredLanguage(lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  useEffect(() => {
    // Auto-detect language on first load if not set
    if (!localStorage.getItem('language')) {
      const detectedLang = detectBrowserLanguage();
      setLanguage(detectedLang);
      setStoredLanguage(detectedLang);
    }
  }, []);

  return { language, switchLanguage, t };
};
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, TranslationKey } from './translations';

export type Language = 'fa' | 'en';
export type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  dir: Direction;
  isChangingLanguage: boolean;
  targetLanguage: Language | null;
  progress: number;
  changeLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'tgex_preferred_language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'en' || saved === 'fa') return saved;
    } catch {
      // ignore
    }
    return 'fa';
  });

  const [isChangingLanguage, setIsChangingLanguage] = useState<boolean>(false);
  const [targetLanguage, setTargetLanguage] = useState<Language | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const dir: Direction = language === 'fa' ? 'rtl' : 'ltr';

  // Apply DOM attributes on mount and language change
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    if (language === 'en') {
      document.body.classList.add('lang-en');
      document.body.classList.remove('lang-fa');
    } else {
      document.body.classList.add('lang-fa');
      document.body.classList.remove('lang-en');
    }
  }, [language, dir]);

  const changeLanguage = (newLang: Language) => {
    if (newLang === language) return;
    setLanguageState(newLang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    changeLanguage(language === 'fa' ? 'en' : 'fa');
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[language] as Record<string, string> | undefined;
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English dictionary if not found in current
    const enDict = translations['en'] as Record<string, string> | undefined;
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        dir,
        isChangingLanguage,
        targetLanguage,
        progress,
        changeLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, Language } from '../context/LanguageContext';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'navbar' | 'compact' | 'admin' | 'mobile';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  variant = 'navbar',
  className = ''
}) => {
  const { language, changeLanguage, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang: Language) => {
    setIsOpen(false);
    changeLanguage(lang);
  };

  if (variant === 'compact') {
    return (
      <div 
        id="navbar-mobile-lang-toggle"
        className={`inline-flex items-center p-0.5 rounded-xl bg-slate-900/90 border border-white/15 text-[11px] font-bold font-mono shadow-inner ${className}`}
      >
        <button
          id="btn-lang-ir"
          type="button"
          onClick={() => handleSelect('fa')}
          className={`px-2.5 py-1 rounded-lg transition-all flex items-center justify-center min-w-[28px] ${
            language === 'fa'
              ? 'bg-blue-600 text-white shadow-sm font-black'
              : 'text-slate-400 hover:text-white'
          }`}
          title="فارسی (IR)"
        >
          IR
        </button>
        <button
          id="btn-lang-en"
          type="button"
          onClick={() => handleSelect('en')}
          className={`px-2.5 py-1 rounded-lg transition-all flex items-center justify-center min-w-[28px] ${
            language === 'en'
              ? 'bg-blue-600 text-white shadow-sm font-black'
              : 'text-slate-400 hover:text-white'
          }`}
          title="English (EN)"
        >
          EN
        </button>
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className={`p-3 rounded-2xl bg-slate-950 border border-white/10 space-y-2 ${className}`}>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-blue-400" />
            <span>{language === 'fa' ? 'انتخاب زبان' : 'Select Language'}</span>
          </span>
          <span className="font-mono text-[10px] uppercase text-slate-400">
            {language} ({dir.toUpperCase()})
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleSelect('fa')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              language === 'fa'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>🇮🇷</span>
            <span>فارسی (FA)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelect('en')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              language === 'en'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>🇬🇧</span>
            <span>English (EN)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-blue-500/40 text-xs font-medium text-slate-200 transition shadow-sm"
        title={language === 'fa' ? 'تغییر زبان به انگلیسی یا فارسی' : 'Switch between English and Persian'}
      >
        <Globe className="w-4 h-4 text-blue-400 flex-shrink-0" />
        <span className="font-bold flex items-center gap-1">
          <span>{language === 'fa' ? '🇮🇷 فارسی' : '🇬🇧 English'}</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className={`absolute top-full mt-2 w-44 rounded-2xl bg-slate-950/95 border border-white/15 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 backdrop-blur-xl ${
            dir === 'rtl' ? 'left-0' : 'right-0'
          }`}
        >
          <div className="px-2 py-1.5 text-[10px] text-slate-400 font-bold border-b border-white/5 mb-1">
            {language === 'fa' ? 'زبان / Language' : 'Language / زبان'}
          </div>

          <button
            type="button"
            onClick={() => handleSelect('fa')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
              language === 'fa'
                ? 'bg-blue-600/20 text-blue-300 font-bold border border-blue-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>🇮🇷</span>
              <span>فارسی (Persian)</span>
            </div>
            {language === 'fa' && <Check className="w-3.5 h-3.5 text-blue-400" />}
          </button>

          <button
            type="button"
            onClick={() => handleSelect('en')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
              language === 'en'
                ? 'bg-blue-600/20 text-blue-300 font-bold border border-blue-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>🇬🇧</span>
              <span>English</span>
            </div>
            {language === 'en' && <Check className="w-3.5 h-3.5 text-blue-400" />}
          </button>
        </div>
      )}
    </div>
  );
};

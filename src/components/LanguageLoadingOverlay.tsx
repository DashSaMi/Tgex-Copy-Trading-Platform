import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2, Sparkles, Layers } from 'lucide-react';

export const LanguageLoadingOverlay: React.FC = () => {
  const { isChangingLanguage, targetLanguage, progress, language } = useLanguage();

  if (!isChangingLanguage) return null;

  const isSwitchingToEn = targetLanguage === 'en';
  const remainingSeconds = Math.max(1, Math.ceil((100 - progress) / 33.3));

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-[#05070a]/95 backdrop-blur-2xl flex items-center justify-center p-4 select-none animate-in fade-in duration-300"
      dir="ltr"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-slate-900/90 border border-blue-500/30 rounded-3xl p-8 shadow-2xl shadow-blue-500/10 text-center space-y-6">
        
        {/* Animated Icon Ring */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/40 animate-[spin_6s_linear_infinite]" />
          <div className="absolute inset-1.5 rounded-full border-2 border-cyan-400/30 animate-[spin_4s_linear_infinite_reverse]" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white">
            <Globe className="w-8 h-8 animate-bounce" />
          </div>
        </div>

        {/* Title & Language Badges */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className={`px-3 py-1 rounded-xl text-xs font-bold font-mono transition ${
              !isSwitchingToEn ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40' : 'bg-slate-800 text-slate-400'
            }`}>
              🇮🇷 فارسی (RTL)
            </div>
            
            <div className="text-blue-400">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            </div>

            <div className={`px-3 py-1 rounded-xl text-xs font-bold font-mono transition ${
              isSwitchingToEn ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40' : 'bg-slate-800 text-slate-400'
            }`}>
              🇬🇧 English (LTR)
            </div>
          </div>

          <h3 className="text-xl font-black text-white tracking-tight">
            {isSwitchingToEn ? 'Switching to English...' : 'در حال تغییر زبان به فارسی...'}
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            {isSwitchingToEn 
              ? 'Configuring left-to-right (LTR) layout and updating global terms...'
              : 'اعمال جهت راست‌به‌چپ (RTL)، بازنشانی فونت‌ها و به‌روزرسانی متن‌ها...'}
          </p>
        </div>

        {/* Precision Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSwitchingToEn ? 'Synchronizing UI' : 'همگام‌سازی ساختار'}</span>
            </span>
            <span className="font-bold text-white">{progress}%</span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-950 border border-white/10 p-0.5 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 transition-all duration-75 shadow-sm shadow-cyan-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="text-[11px] font-mono text-slate-400 pt-1 flex items-center justify-center gap-2">
            <span>{isSwitchingToEn ? 'Applying in' : 'تکمیل فرایند تا'}</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 font-bold border border-blue-500/20">
              {remainingSeconds} {isSwitchingToEn ? 'sec' : 'ثانیه'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

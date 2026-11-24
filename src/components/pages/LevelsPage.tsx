import React, { useState } from 'react';
import { PageId, LevelItem } from '../../types';
import { TWENTY_LEVELS } from '../../data/mockData';
import { Layers, ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Filter } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LevelsPageProps {
  onNavigate: (page: PageId) => void;
}

export const LevelsPage: React.FC<LevelsPageProps> = ({ onNavigate }) => {
  const { language, dir } = useLanguage();
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  const getTranslatedLevels = () => {
    if (language === 'fa') return TWENTY_LEVELS;
    
    // Map existing levels to English strings if necessary
    return TWENTY_LEVELS.map(lvl => {
      let tierGroupEn: any = lvl.tierGroup;
      if (lvl.tierGroup.includes('پایه‌ای')) tierGroupEn = 'Foundation';
      if (lvl.tierGroup.includes('توسعه')) tierGroupEn = 'Expansion';
      if (lvl.tierGroup.includes('رهبری')) tierGroupEn = 'Leadership';
      if (lvl.tierGroup.includes('مدیریتی')) tierGroupEn = 'Executive';
      if (lvl.tierGroup.includes('حاکمیتی')) tierGroupEn = 'Governance';

      let titleEn = `Level ${lvl.letter}`;
      let depthEn = `${lvl.networkDepth.replace('عمق ', 'Depth ').replace(' لایه', ' Layers').replace('مستقیم', 'Direct').replace('ساختاری', 'Structural')}`;
      let commissionEn = lvl.commissionPlaceholder.replace('سهم پاداش سطح', 'Level Reward Share').replace('از حجم استخر مجاز', 'of Authorized Pool').replace('از استخر بین‌المللی', 'of International Pool').replace('از سود ناخالص پلتفرم', 'of Gross Platform Profit');

      return {
        ...lvl,
        tierGroup: tierGroupEn as any,
        title: titleEn,
        networkDepth: depthEn,
        commissionPlaceholder: commissionEn,
        // Since description requires heavy translation, we use a generic placeholder for English for now
        description: `Unlock access to ${tierGroupEn} tier benefits and earn up to ${commissionEn}. Requires ${lvl.qualifyingUsers} active direct referrals.`
      };
    });
  };

  const filteredLevels = getTranslatedLevels().filter((lvl) => {
    if (selectedGroup === 'all') return true;
    return lvl.tierGroup.includes(selectedGroup);
  });

  return (
    <div className="space-y-12 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-slate-200" dir={dir}>
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold font-mono">
          20 TIERS (LEVEL A TO LEVEL T)
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {language === 'fa' ? 'جدول جامع ۲۰ سطح پلتفرم تیجکس (TGEX)' : 'Comprehensive 20-Level Matrix (TGEX)'}
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          {language === 'fa' 
            ? 'مشخصات فنی، عمق شبکه تحت پوشش، سهم استخر پاداش و شرایط ارتقا در ماتریس ساختاری.'
            : 'Technical specifications, network depth coverage, reward pool share, and upgrade conditions in the structural matrix.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 max-w-3xl mx-auto text-xs">
        <button
          onClick={() => setSelectedGroup('all')}
          className={`px-3.5 py-2 rounded-xl transition ${
            selectedGroup === 'all'
              ? 'bg-blue-600 text-white font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {language === 'fa' ? 'تمام ۲۰ سطح' : 'All 20 Levels'}
        </button>
        <button
          onClick={() => setSelectedGroup(language === 'fa' ? 'پایه‌ای' : 'Foundation')}
          className={`px-3.5 py-2 rounded-xl transition ${
            selectedGroup.includes('پایه‌ای') || selectedGroup === 'Foundation'
              ? 'bg-blue-600 text-white font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {language === 'fa' ? 'سطوح پایه‌ای (A - D)' : 'Foundation (A - D)'}
        </button>
        <button
          onClick={() => setSelectedGroup(language === 'fa' ? 'توسعه' : 'Expansion')}
          className={`px-3.5 py-2 rounded-xl transition ${
            selectedGroup.includes('توسعه') || selectedGroup === 'Expansion'
              ? 'bg-blue-600 text-white font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {language === 'fa' ? 'سطوح توسعه (E - H)' : 'Expansion (E - H)'}
        </button>
        <button
          onClick={() => setSelectedGroup(language === 'fa' ? 'رهبری' : 'Leadership')}
          className={`px-3.5 py-2 rounded-xl transition ${
            selectedGroup.includes('رهبری') || selectedGroup === 'Leadership'
              ? 'bg-blue-600 text-white font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {language === 'fa' ? 'سطوح رهبری (I - L)' : 'Leadership (I - L)'}
        </button>
        <button
          onClick={() => setSelectedGroup(language === 'fa' ? 'مدیریتی' : 'Executive')}
          className={`px-3.5 py-2 rounded-xl transition ${
            selectedGroup.includes('مدیریتی') || selectedGroup === 'Executive'
              ? 'bg-blue-600 text-white font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {language === 'fa' ? 'سطوح مدیریتی (M - P)' : 'Executive (M - P)'}
        </button>
        <button
          onClick={() => setSelectedGroup(language === 'fa' ? 'حاکمیتی' : 'Governance')}
          className={`px-3.5 py-2 rounded-xl transition ${
            selectedGroup.includes('حاکمیتی') || selectedGroup === 'Governance'
              ? 'bg-blue-600 text-white font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {language === 'fa' ? 'سطوح حاکمیتی (Q - T)' : 'Governance (Q - T)'}
        </button>
      </div>

      {/* Matrix Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredLevels.map((lvl) => (
          <div
            key={lvl.letter}
            className={`p-5 rounded-3xl bg-slate-900/50 border border-white/10 hover:border-blue-500/40 transition space-y-4 flex flex-col justify-between ${language === 'fa' ? 'text-right' : 'text-left'}`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 font-mono font-bold flex items-center justify-center text-sm shrink-0">
                  {lvl.letter}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-white/5 whitespace-nowrap">
                  {lvl.tierGroup.split(' ')[0]}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white">{lvl.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{lvl.description}</p>
            </div>

            <div className="pt-3 border-t border-white/5 space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'fa' ? 'عمق پوشش:' : 'Depth:'}</span>
                <span className="text-slate-200 font-mono">{lvl.networkDepth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{language === 'fa' ? 'حداقل معرف مستقیم:' : 'Min Directs:'}</span>
                <span className="text-blue-400 font-mono font-bold">{lvl.qualifyingUsers} {language === 'fa' ? 'کاربر' : 'Users'}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5 text-[10px] text-emerald-400 text-center font-mono leading-relaxed">
                {lvl.commissionPlaceholder}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center pt-6">
        <button
          onClick={() => onNavigate('register')}
          className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/25 transition inline-flex items-center gap-2"
        >
          <span>{language === 'fa' ? 'شروع و فعال‌سازی جایگاه در سطح A' : 'Start & Activate Level A Position'}</span>
          {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

    </div>
  );
};

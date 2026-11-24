import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId } from '../../types';
import { RANKS_DATA } from '../../data/mockData';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Trophy,
  Crown,
  Scale,
  Users,
  TrendingUp
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface RanksPageProps {
  onNavigate: (page: PageId) => void;
}

export const RanksPage: React.FC<RanksPageProps> = ({ onNavigate }) => {
  const { language, dir } = useLanguage();
  const isFa = language === 'fa';
  const [selectedRankIdx, setSelectedRankIdx] = useState(4); // Default spotlight on Guide or active milestone

  const getTranslatedRanks = () => {
    if (isFa) return RANKS_DATA;

    return RANKS_DATA.map((rank) => {
      let nameEn = rank.name;
      let levelRequiredEn = rank.levelRequired;
      let descEn = rank.description;
      let volEn = rank.networkVolumePlaceholder;
      let privilegesEn = rank.privileges;

      if (rank.id === 'rank_starter') {
        nameEn = 'Starter';
        levelRequiredEn = 'Registration + Min $50 Active';
        descEn = 'Platform registration plus at least $50 active capital in personal account.';
        volEn = '$50 Active Capital';
        privilegesEn = [
          'Complete registration & dashboard access',
          'Min $50 active capital',
          'Network placement activation'
        ];
      } else if (rank.id === 'rank_stager') {
        nameEn = 'Stager';
        levelRequiredEn = 'Active + 2 Active Directs';
        descEn = 'Active status with at least 2 Active direct referrals.';
        volEn = '2 Active Directs';
        privilegesEn = [
          'Active account status',
          'Min 2 active direct referrals',
          'Unlocking initial network reward levels'
        ];
      } else if (rank.id === 'rank_trainer') {
        nameEn = 'Trainer';
        levelRequiredEn = 'Active + 2 Stager Legs';
        descEn = 'Active status + at least 2 members with Stager rank (based on line competition logic).';
        volEn = '2 Stager Members';
        privilegesEn = [
          'Active account status',
          'Min 2 members with Stager rank',
          'Adhering to competitive line logic'
        ];
      } else if (rank.id === 'rank_advisor' || rank.id === 'rank_consultant') {
        nameEn = 'Advisor';
        levelRequiredEn = 'Active + 2 Trainer Legs';
        descEn = 'Active account + min 2 members with Trainer rank.';
        volEn = '2 Trainer Members';
        privilegesEn = [
          'Active account status',
          'Min 2 members with Trainer rank',
          'Expanded multi-level eligibility'
        ];
      } else if (rank.id === 'rank_guide') {
        nameEn = 'Guide';
        levelRequiredEn = '2 Advisors + $100K Team AUM';
        descEn = 'Active account + min 2 members with Advisor rank + min $100,000 Team AUM.';
        volEn = '$100,000 Team AUM';
        privilegesEn = [
          'Active account status',
          'Min 2 members with Advisor rank',
          'Min $100,000 Team AUM',
          'Full 20-level network structure coverage'
        ];
      } else if (rank.id === 'rank_manager') {
        nameEn = 'Manager';
        levelRequiredEn = '2 Guides + $500K Team AUM';
        descEn = 'Active account + min 2 members with Guide rank + min $500,000 Team AUM.';
        volEn = '$500,000 Team AUM';
        privilegesEn = [
          'Active account status',
          'Min 2 members with Guide rank',
          'Min $500,000 Team AUM',
          'Eligible for 3% Leadership Pool'
        ];
      } else if (rank.id === 'rank_senior_manager') {
        nameEn = 'Senior Manager';
        levelRequiredEn = '2 Managers + $2M AUM · 60% Cap';
        descEn = 'Active + min 2 Managers + min $2,000,000 AUM + max 60% volume from one line.';
        volEn = '$2,000,000 AUM';
        privilegesEn = [
          'Active account status',
          'Min 2 members with Manager rank',
          'Min $2,000,000 Team AUM',
          'Max 60% volume cap from single line',
          'Higher tier in 3% Leadership Pool'
        ];
      } else if (rank.id === 'rank_leader') {
        nameEn = 'Leader';
        levelRequiredEn = 'Approval + $10M AUM · 50% Cap';
        descEn = 'Active + management approval + min $10,000,000 AUM + max 50% volume from one line.';
        volEn = '$10,000,000 AUM';
        privilegesEn = [
          'Active status & management approval',
          'Min $10,000,000 Team AUM',
          'Max 50% volume cap from single line',
          'Executive 3% Leadership Pool share'
        ];
      } else if (rank.id === 'rank_senior_leader') {
        nameEn = 'Senior Leader';
        levelRequiredEn = 'Approval + $50M AUM · 40% Cap';
        descEn = 'Active + management approval + min $50,000,000 AUM + max 40% volume from one line.';
        volEn = '$50,000,000 AUM';
        privilegesEn = [
          'Active status & management approval',
          'Min $50,000,000 Team AUM',
          'Max 40% volume cap from single line',
          'Top tier 3% Leadership Pool allocation'
        ];
      }

      return {
        ...rank,
        name: nameEn,
        levelRequired: levelRequiredEn,
        description: descEn,
        networkVolumePlaceholder: volEn,
        privileges: privilegesEn
      };
    });
  };

  const translatedRanks = getTranslatedRanks();
  const focusedRank = translatedRanks[selectedRankIdx] || translatedRanks[0];

  return (
    <div className="space-y-12 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-slate-200" dir={dir}>

      {/* SECTION 1: EDITORIAL MASTHEAD HERO */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-3xl bg-gradient-to-br from-slate-900/90 via-[#070B14] to-slate-950 border border-white/10 p-8 sm:p-12 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
            <Crown className="w-4 h-4" />
            <span>{isFa ? 'رتبه‌بندی ۹ مرحله‌ای شایستگی و استخر رهبری ۳٪' : '9 MERIT RANKS · 3% LEADERSHIP POOL'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight text-balance">
            {isFa ? 'رتبه‌ها و پاداش‌های سازمانی تیجکس' : 'Organizational Ranks & Leadership Rewards'}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {isFa
              ? 'مسیر پیشرفت ۹ مرحله‌ای از استارتر تا راهبر ارشد بر اساس سرمایه فعال، تعداد معرف‌های دارای رتبه در خطوط رقابتی، حجم دارایی تحت مدیریت (AUM) و قوانین تعادل خطوط (۶۰٪، ۵۰٪ و ۴۰٪).'
              : 'A transparent 9-rank career ladder from Starter to Senior Leader governed by active capital, qualified frontline legs, Team AUM milestones, and single-line balancing caps (60%, 50%, 40%).'}
          </p>
        </div>
      </motion.section>

      {/* SECTION 2: INTERACTIVE CAREER PATH STEPPER & SPOTLIGHT */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl bg-slate-900/65 border border-white/10 p-6 sm:p-8 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <h2 className="text-lg sm:text-xl font-black text-white">
            {isFa ? 'مسیر تعاملی ارتقای رتبه‌ها' : 'Interactive Rank Progression Explorer'}
          </h2>
          <span className="text-xs font-mono text-slate-400">
            {isFa ? 'برای مشاهده پیش‌نیازها روی هر رتبه کلیک کنید' : 'Select any rank milestone to inspect criteria'}
          </span>
        </div>

        {/* Horizontal Stepper Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
          {translatedRanks.map((rank, index) => {
            const active = index === selectedRankIdx;
            return (
              <button
                key={rank.id}
                type="button"
                onClick={() => setSelectedRankIdx(index)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  active
                    ? 'bg-amber-500/15 border-amber-400/60 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950/70 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                }`}
              >
                <div className={`text-[10px] font-mono tabular-nums ${active ? 'text-amber-300' : 'text-slate-500'}`}>
                  0{index + 1}
                </div>
                <div className="text-xs font-bold mt-1 truncate">{rank.name}</div>
              </button>
            );
          })}
        </div>

        {/* Animated Rank Detail Spotlight */}
        <AnimatePresence mode="wait">
          <motion.div
            key={focusedRank.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="rounded-2xl bg-slate-950/85 border border-white/10 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
          >
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
                <h3 className="text-xl sm:text-2xl font-black text-white">{focusedRank.name}</h3>
                <span className="text-xs font-mono text-amber-300">
                  {isFa ? `رتبه ${selectedRankIdx + 1} از ۹` : `Rank ${selectedRankIdx + 1} of 9`}
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{focusedRank.description}</p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400 font-mono tabular-nums">
                <span className="inline-flex items-center gap-1.5 text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{focusedRank.networkVolumePlaceholder}</span>
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="inline-flex items-center gap-1.5 text-blue-400">
                  <Users className="w-3.5 h-3.5" />
                  <span>{focusedRank.directSponsorsRequired} {isFa ? 'شاخص مستقیم' : 'Direct Legs'}</span>
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="inline-flex items-center gap-1.5 text-amber-300">
                  <Scale className="w-3.5 h-3.5" />
                  <span>{focusedRank.levelRequired}</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-2 border-t lg:border-t-0 lg:border-s border-white/10 pt-4 lg:pt-0 lg:ps-6">
              <div className="text-xs font-bold text-slate-400 mb-2">
                {isFa ? 'امتیازات و شروط کلیدی:' : 'Key Qualifications & Rewards:'}
              </div>
              {focusedRank.privileges.map((priv, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{priv}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.section>

      {/* SECTION 3: ALL 9 RANKS ARCHITECTURAL GRID */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-xl font-black text-white">
            {isFa ? 'فهرست کامل ۹ رتبه و شرایط احراز' : 'Complete Directory of All 9 Ranks'}
          </h2>
          <span className="text-xs font-mono text-slate-400">STARTER → SENIOR LEADER</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {translatedRanks.map((rank, index) => (
            <motion.div
              key={rank.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(index * 0.05, 0.25), duration: 0.4 }}
              onClick={() => setSelectedRankIdx(index)}
              className={`cursor-pointer p-6 sm:p-7 rounded-3xl bg-slate-900/60 border transition-all duration-300 hover:-translate-y-1 space-y-5 flex flex-col justify-between ${
                selectedRankIdx === index
                  ? 'border-amber-400/60 shadow-xl shadow-amber-950/20'
                  : 'border-white/10 hover:border-amber-500/35'
              } ${isFa ? 'text-right' : 'text-left'}`}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono text-slate-500 tabular-nums">0{index + 1}</span>
                    <h3 className="text-lg font-black text-white">{rank.name}</h3>
                  </div>
                  <Trophy className={`w-5 h-5 ${selectedRankIdx === index ? 'text-amber-400' : 'text-slate-500'}`} />
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{rank.description}</p>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2 text-[11px] tabular-nums">
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">{isFa ? 'الزام ارتقا:' : 'Qualification:'}</span>
                    <span className="text-slate-200 font-bold font-mono text-end">{rank.levelRequired}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">{isFa ? 'شاخص مستقیم / خط:' : 'Direct / Line Req:'}</span>
                    <span className="text-blue-400 font-bold font-mono">
                      {rank.directSponsorsRequired} {isFa ? 'مسیر' : 'Legs'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">{isFa ? 'حجم هدف (AUM):' : 'Target Volume:'}</span>
                    <span className="text-emerald-400 font-bold font-mono">{rank.networkVolumePlaceholder}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 space-y-2 text-xs">
                <span className="text-slate-400 text-[10px] font-bold block">
                  {isFa ? 'مزایا و امتیازات رتبه:' : 'Benefits & Privileges:'}
                </span>
                <ul className="space-y-1.5">
                  {rank.privileges.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 4: CONVERSION BANNER */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#0A0F1D] to-slate-900 border border-white/10 p-7 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-1.5 text-center sm:text-start">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono text-amber-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>{isFa ? 'شروع از رتبه استارتر' : 'START AT STARTER RANK'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            {isFa ? 'مسیر حرفه‌ای خود را در ساختار تیجکس آغاز کنید' : 'Launch Your Leadership Progression on TGEX'}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('signup')}
          className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/25 inline-flex items-center gap-2 transition cursor-pointer shrink-0"
        >
          <span>{isFa ? 'ثبت‌نام و دریافت جایگاه' : 'Sign Up & Claim Position'}</span>
          {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </motion.section>

    </div>
  );
};

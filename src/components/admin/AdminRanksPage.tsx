import React, { useState } from 'react';
import { PageId } from '../../types';
import { 
  Award, 
  Search, 
  ShieldCheck, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Edit3, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  Settings2,
  ChevronLeft,
  Scale,
  Percent,
  Coins,
  FileText,
  PieChart,
  HelpCircle,
  Briefcase,
  Crown,
  Compass,
  Zap,
  Check
} from 'lucide-react';

export interface RankConfig {
  id: string;
  rankNumber: number;
  key: string;
  name: string;
  persianName: string;
  badge: string;
  badgeBg: string;
  description: string;
  // Conditions (Article 11)
  minActiveCapitalUsdt: number;
  directReferralsRequired: number;
  minRequiredLowerRankMembers: number;
  lowerRankType: string;
  minTeamAumUsdt: number;
  maxSingleLegVolumePercent: number; // e.g. 60%, 50%, 40% or 100% (no limit)
  requiresExecutiveApproval: boolean;
  // Unlocked Matrix Depth (Article 12)
  unlockedMatrixLevels: string;
  unlockedLevelsCount: number;
  // Leadership Pool Points (Article 14)
  leadershipPoolPoints: number; // 0, 0, 0, 0, 0, 10, 20, 30, 40
  // Holders Stats
  totalHolders: number;
  activeHolders: number;
}

export const INITIAL_9_RANKS: RankConfig[] = [
  {
    id: 'rnk-1',
    rankNumber: 1,
    key: 'STARTER',
    name: 'Starter',
    persianName: 'استارتر (Starter)',
    badge: '🔰',
    badgeBg: 'bg-slate-700/50 text-slate-300 border-slate-600',
    description: 'ثبت‌نام در پلتفرم + حداقل ۵۰ دلار سرمایه فعال.',
    minActiveCapitalUsdt: 50,
    directReferralsRequired: 0,
    minRequiredLowerRankMembers: 0,
    lowerRankType: '—',
    minTeamAumUsdt: 0,
    maxSingleLegVolumePercent: 100,
    requiresExecutiveApproval: false,
    unlockedMatrixLevels: 'تا سطح ۳ ماتریس (سطوح ۱ تا ۳)',
    unlockedLevelsCount: 3,
    leadershipPoolPoints: 0,
    totalHolders: 1420,
    activeHolders: 1280
  },
  {
    id: 'rnk-2',
    rankNumber: 2,
    key: 'STAGER',
    name: 'Stager',
    persianName: 'استیجر (Stager)',
    badge: '🥉',
    badgeBg: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
    description: 'وضعیت Active به همراه حداقل ۲ معرفی مستقیم Active.',
    minActiveCapitalUsdt: 50,
    directReferralsRequired: 2,
    minRequiredLowerRankMembers: 0,
    lowerRankType: '—',
    minTeamAumUsdt: 0,
    maxSingleLegVolumePercent: 100,
    requiresExecutiveApproval: false,
    unlockedMatrixLevels: 'تا سطح ۵ ماتریس (سطوح ۱ تا ۵)',
    unlockedLevelsCount: 5,
    leadershipPoolPoints: 0,
    totalHolders: 640,
    activeHolders: 590
  },
  {
    id: 'rnk-3',
    rankNumber: 3,
    key: 'TRAINER',
    name: 'Trainer',
    persianName: 'ترینر (Trainer)',
    badge: '🥈',
    badgeBg: 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30',
    description: 'حساب Active + حداقل ۲ عضو با رنک استیجر، از میان خطوطی که زودتر شرایط را برآورده کنند.',
    minActiveCapitalUsdt: 50,
    directReferralsRequired: 2,
    minRequiredLowerRankMembers: 2,
    lowerRankType: 'استیجر (Stager)',
    minTeamAumUsdt: 0,
    maxSingleLegVolumePercent: 100,
    requiresExecutiveApproval: false,
    unlockedMatrixLevels: 'تا سطح ۱۰ ماتریس (سطوح ۱ تا ۱۰)',
    unlockedLevelsCount: 10,
    leadershipPoolPoints: 0,
    totalHolders: 280,
    activeHolders: 265
  },
  {
    id: 'rnk-4',
    rankNumber: 4,
    key: 'ADVISOR',
    name: 'Advisor',
    persianName: 'مشاور (Advisor)',
    badge: '🥇',
    badgeBg: 'bg-teal-600/20 text-teal-400 border-teal-500/30',
    description: 'حساب Active + حداقل ۲ عضو با رنک ترینر، طبق منطق رقابتی خطوط.',
    minActiveCapitalUsdt: 50,
    directReferralsRequired: 2,
    minRequiredLowerRankMembers: 2,
    lowerRankType: 'ترینر (Trainer)',
    minTeamAumUsdt: 0,
    maxSingleLegVolumePercent: 100,
    requiresExecutiveApproval: false,
    unlockedMatrixLevels: 'تا سطح ۱۵ ماتریس (سطوح ۱ تا ۱۵)',
    unlockedLevelsCount: 15,
    leadershipPoolPoints: 0,
    totalHolders: 110,
    activeHolders: 104
  },
  {
    id: 'rnk-5',
    rankNumber: 5,
    key: 'GUIDE',
    name: 'Guide',
    persianName: 'راهنما (Guide)',
    badge: '🧭',
    badgeBg: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30',
    description: 'حساب Active + حداقل ۲ عضو با رنک مشاور + حداقل ۱۰۰,۰۰۰ دلار AUM تیم.',
    minActiveCapitalUsdt: 50,
    directReferralsRequired: 2,
    minRequiredLowerRankMembers: 2,
    lowerRankType: 'مشاور (Advisor)',
    minTeamAumUsdt: 100000,
    maxSingleLegVolumePercent: 100,
    requiresExecutiveApproval: false,
    unlockedMatrixLevels: 'تا سطح ۲۰ — کامل (هر ۲۰ سطح ماتریس)',
    unlockedLevelsCount: 20,
    leadershipPoolPoints: 0,
    totalHolders: 42,
    activeHolders: 41
  },
  {
    id: 'rnk-6',
    rankNumber: 6,
    key: 'MANAGER',
    name: 'Manager',
    persianName: 'مدیر (Manager)',
    badge: '💼',
    badgeBg: 'bg-purple-600/20 text-purple-400 border-purple-500/30',
    description: 'حساب Active + حداقل ۲ عضو با رنک راهنما + حداقل ۵۰۰,۰۰۰ دلار AUM تیم.',
    minActiveCapitalUsdt: 50,
    directReferralsRequired: 2,
    minRequiredLowerRankMembers: 2,
    lowerRankType: 'راهنما (Guide)',
    minTeamAumUsdt: 500000,
    maxSingleLegVolumePercent: 100,
    requiresExecutiveApproval: false,
    unlockedMatrixLevels: 'تا سطح ۲۰ — کامل + استخر رهبری (۱۰ امتیاز)',
    unlockedLevelsCount: 20,
    leadershipPoolPoints: 10,
    totalHolders: 18,
    activeHolders: 18
  },
  {
    id: 'rnk-7',
    rankNumber: 7,
    key: 'SENIOR_MANAGER',
    name: 'Senior Manager',
    persianName: 'مدیر ارشد (Senior Manager)',
    badge: '💎',
    badgeBg: 'bg-amber-600/20 text-amber-400 border-amber-500/30',
    description: 'حساب Active + حداقل ۲ عضو با رنک مدیر + حداقل ۲,۰۰۰,۰۰۰ دلار AUM + حداکثر ۶۰٪ حجم کل از یک خط.',
    minActiveCapitalUsdt: 50,
    directReferralsRequired: 2,
    minRequiredLowerRankMembers: 2,
    lowerRankType: 'مدیر (Manager)',
    minTeamAumUsdt: 2000000,
    maxSingleLegVolumePercent: 60,
    requiresExecutiveApproval: false,
    unlockedMatrixLevels: 'تا سطح ۲۰ — کامل + استخر رهبری (۲۰ امتیاز)',
    unlockedLevelsCount: 20,
    leadershipPoolPoints: 20,
    totalHolders: 8,
    activeHolders: 8
  },
  {
    id: 'rnk-8',
    rankNumber: 8,
    key: 'LEADER',
    name: 'Leader',
    persianName: 'راهبر (Leader)',
    badge: '👑',
    badgeBg: 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30',
    description: 'حساب Active + تأیید مدیریت + حداقل ۱۰,۰۰۰,۰۰۰ دلار AUM + حداکثر ۵۰٪ حجم کل از یک خط.',
    minActiveCapitalUsdt: 50,
    directReferralsRequired: 2,
    minRequiredLowerRankMembers: 2,
    lowerRankType: 'مدیر ارشد (Senior Manager)',
    minTeamAumUsdt: 10000000,
    maxSingleLegVolumePercent: 50,
    requiresExecutiveApproval: true,
    unlockedMatrixLevels: 'تا سطح ۲۰ — کامل + استخر رهبری (۳۰ امتیاز)',
    unlockedLevelsCount: 20,
    leadershipPoolPoints: 30,
    totalHolders: 4,
    activeHolders: 4
  },
  {
    id: 'rnk-9',
    rankNumber: 9,
    key: 'SENIOR_LEADER',
    name: 'Senior Leader',
    persianName: 'راهبر ارشد (Senior Leader)',
    badge: '🏛️',
    badgeBg: 'bg-rose-600/20 text-rose-400 border-rose-500/30',
    description: 'حساب Active + تأیید مدیریت + حداقل ۵۰,۰۰۰,۰۰۰ دلار AUM + حداکثر ۴۰٪ حجم کل از یک خط.',
    minActiveCapitalUsdt: 50,
    directReferralsRequired: 2,
    minRequiredLowerRankMembers: 2,
    lowerRankType: 'راهبر (Leader)',
    minTeamAumUsdt: 50000000,
    maxSingleLegVolumePercent: 40,
    requiresExecutiveApproval: true,
    unlockedMatrixLevels: 'تا سطح ۲۰ — کامل + استخر رهبری (۴۰ امتیاز)',
    unlockedLevelsCount: 20,
    leadershipPoolPoints: 40,
    totalHolders: 2,
    activeHolders: 2
  }
];

export const HYBRID_20_LEVELS_RATES = [
  { level: 1, letter: 'A', rate: 3.00 },
  { level: 2, letter: 'B', rate: 2.00 },
  { level: 3, letter: 'C', rate: 1.60 },
  { level: 4, letter: 'D', rate: 1.20 },
  { level: 5, letter: 'E', rate: 0.90 },
  { level: 6, letter: 'F', rate: 0.80 },
  { level: 7, letter: 'G', rate: 0.70 },
  { level: 8, letter: 'H', rate: 0.60 },
  { level: 9, letter: 'I', rate: 0.50 },
  { level: 10, letter: 'J', rate: 0.45 },
  { level: 11, letter: 'K', rate: 0.40 },
  { level: 12, letter: 'L', rate: 0.35 },
  { level: 13, letter: 'M', rate: 0.30 },
  { level: 14, letter: 'N', rate: 0.25 },
  { level: 15, letter: 'O', rate: 0.25 },
  { level: 16, letter: 'P', rate: 0.20 },
  { level: 17, letter: 'Q', rate: 0.20 },
  { level: 18, letter: 'R', rate: 0.15 },
  { level: 19, letter: 'S', rate: 0.10 },
  { level: 20, letter: 'T', rate: 0.05 }
];

export const AdminRanksPage: React.FC<{ onNavigate?: (page: PageId) => void }> = () => {
  const [ranks, setRanks] = useState<RankConfig[]>(INITIAL_9_RANKS);
  const [selectedRank, setSelectedRank] = useState<RankConfig | null>(INITIAL_9_RANKS[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'ranks' | 'rules' | 'pool' | 'matrix'>('ranks');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Simulated Pool Calculator State
  const [simulatedMonthlyRealizedProfit, setSimulatedMonthlyRealizedProfit] = useState<number>(500000);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleSaveRank = () => {
    if (!selectedRank) return;
    setRanks(ranks.map(r => r.id === selectedRank.id ? selectedRank : r));
    setIsEditing(false);
    showToast(`شرایط و امتیازات رتبه ${selectedRank.persianName} با موفقیت ذخیره شد.`);
  };

  const totalHoldersCount = ranks.reduce((acc, r) => acc + r.totalHolders, 0);
  const totalActiveHoldersCount = ranks.reduce((acc, r) => acc + r.activeHolders, 0);

  // Leadership Pool (Article 14) Calculation
  const poolFundUsdt = simulatedMonthlyRealizedProfit * 0.03; // 3% of Realized Profit
  const qualifyingPoolRanks = ranks.filter(r => r.leadershipPoolPoints > 0);
  const totalPoolPoints = qualifyingPoolRanks.reduce((acc, r) => acc + (r.leadershipPoolPoints * r.activeHolders), 0);

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono mb-1.5 border border-amber-500/20">
              <Award className="w-3.5 h-3.5" />
              <span>ماده ۱۰، ۱۱، ۱۲ و ۱۴ آیین‌نامه پاداش و ارتقای رتبه</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              مدیریت رتبه‌ها و شرایط احراز پاداش‌های رهبری
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              توجه: رتبه سازمانی (Rank) کاملاً مستقل از لول‌های ماتریس (Level A-T) است و بر مبنای عملکرد، AUM واقعی، منطق رقابتی خطوط و تأیید مدیریت محاسبه می‌شود.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="px-4 py-2.5 rounded-2xl bg-slate-950 border border-white/10 text-slate-300 font-mono">
              کل دارندگان رتبه: <span className="text-amber-400 font-bold">{totalHoldersCount.toLocaleString()} نفر</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-slate-950 border border-white/10 text-slate-300 font-mono">
              فعال (Active): <span className="text-emerald-400 font-bold">{totalActiveHoldersCount.toLocaleString()} نفر</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          <button
            onClick={() => setActiveTab('ranks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'ranks'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-950/70 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>رنک‌های ۹ گانه و سطوح احراز (ماده ۱۰ و ۱۱)</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'matrix'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-950/70 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>سطوح بازشده پورسانت بر اساس رنک (ماده ۱۲ و ۸)</span>
          </button>

          <button
            onClick={() => setActiveTab('pool')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'pool'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-950/70 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>استخر رهبری ۳٪ و مدل امتیازی (ماده ۱۴)</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'rules'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-950/70 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>قوانین پرداخت پورسانت و Realized Profit (ماده ۱۵)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: RANKS MANAGEMENT & INSPECTOR */}
      {activeTab === 'ranks' && (
        <div className="space-y-6">
          
          {/* 9 Ranks Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
            {ranks.map((rank) => {
              const isSelected = selectedRank?.id === rank.id;
              return (
                <div 
                  key={rank.id}
                  onClick={() => {
                    setSelectedRank(rank);
                    setIsEditing(false);
                  }}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                    isSelected 
                      ? 'bg-slate-900 border-amber-500/60 shadow-xl shadow-amber-950/40 ring-1 ring-amber-500/50' 
                      : 'bg-slate-950 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{rank.badge}</span>
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                        رتبه {rank.rankNumber}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-white text-sm">{rank.persianName}</h3>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{rank.name}</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 space-y-1.5 text-[11px] font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>AUM تیم:</span>
                        <span className="text-emerald-400 font-bold">
                          {rank.minTeamAumUsdt > 0 ? `$${rank.minTeamAumUsdt.toLocaleString()}` : (rank.minActiveCapitalUsdt > 0 ? `$${rank.minActiveCapitalUsdt} سرمایه` : 'پایه‌ای')}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>پوشش ماتریس:</span>
                        <span className="text-cyan-400 font-bold">تا سطح {rank.unlockedLevelsCount}</span>
                      </div>
                      {rank.leadershipPoolPoints > 0 && (
                        <div className="flex justify-between text-slate-400">
                          <span>امتیاز استخر:</span>
                          <span className="text-amber-400 font-bold">{rank.leadershipPoolPoints} امتیاز</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2.5 mt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                    <span>اعضای فعال:</span>
                    <span className="font-bold font-mono text-white">{rank.activeHolders} نفر</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Rank Inspector & Editor */}
          {selectedRank ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-white/15 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center gap-3.5">
                  <span className="text-4xl p-3 rounded-2xl bg-slate-950 border border-white/10">{selectedRank.badge}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">{selectedRank.persianName}</h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                        {selectedRank.name} (رتبه {selectedRank.rankNumber})
                      </span>
                      {selectedRank.requiresExecutiveApproval && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                          نیازمند تأیید مدیریت
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{selectedRank.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <button
                      onClick={handleSaveRank}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
                    >
                      <Save className="w-4 h-4" />
                      <span>ذخیره تغییرات رتبه</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>ویرایش شرایط احراز</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Requirement Metrics Config Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Direct Referrals */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <label className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>حداقل معرفی مستقیم Active:</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={selectedRank.directReferralsRequired}
                      onChange={(e) => setSelectedRank({ ...selectedRank, directReferralsRequired: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/20 rounded-xl text-white font-mono text-sm"
                    />
                  ) : (
                    <div className="text-lg font-bold font-mono text-white">
                      {selectedRank.directReferralsRequired > 0 ? `${selectedRank.directReferralsRequired} کاربر فعال` : 'بدون حداقل (پایه‌ای)'}
                    </div>
                  )}
                  <p className="text-[10px] text-slate-500">حساب‌های مستقیم در وضعیت فعال تجاری</p>
                </div>

                {/* 2. Team AUM */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <label className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>حداقل AUM تیم (دلار):</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={selectedRank.minTeamAumUsdt}
                      onChange={(e) => setSelectedRank({ ...selectedRank, minTeamAumUsdt: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/20 rounded-xl text-white font-mono text-sm"
                    />
                  ) : (
                    <div className="text-lg font-bold font-mono text-emerald-400">
                      {selectedRank.minTeamAumUsdt > 0 ? `$${selectedRank.minTeamAumUsdt.toLocaleString()}` : (selectedRank.minActiveCapitalUsdt > 0 ? `$${selectedRank.minActiveCapitalUsdt} سرمایه شخصی` : '$0')}
                    </div>
                  )}
                  <p className="text-[10px] text-slate-500">حجم کل دارایی تحت مدیریت شبکه</p>
                </div>

                {/* 3. Team Rank Prerequisites */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <label className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-cyan-400" />
                    <span>اعضای دارای رتبه پیش‌نیاز:</span>
                  </label>
                  {isEditing ? (
                    <div className="space-y-1.5">
                      <input
                        type="number"
                        value={selectedRank.minRequiredLowerRankMembers}
                        onChange={(e) => setSelectedRank({ ...selectedRank, minRequiredLowerRankMembers: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-white/20 rounded-xl text-white font-mono text-xs"
                      />
                      <input
                        type="text"
                        value={selectedRank.lowerRankType}
                        onChange={(e) => setSelectedRank({ ...selectedRank, lowerRankType: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-white/20 rounded-xl text-white text-xs"
                      />
                    </div>
                  ) : (
                    <div className="text-sm font-bold text-cyan-400">
                      {selectedRank.minRequiredLowerRankMembers > 0 
                        ? `حداقل ${selectedRank.minRequiredLowerRankMembers} عضو ${selectedRank.lowerRankType}` 
                        : 'بدون پیش‌نیاز رتبه تیمی'}
                    </div>
                  )}
                  <p className="text-[10px] text-slate-500">بر مبنای منطق رقابتی خطوط مستقل</p>
                </div>

                {/* 4. Single Leg Rule Balance */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <label className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-amber-400" />
                    <span>قانون سقف حجم از یک خط:</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={selectedRank.maxSingleLegVolumePercent}
                      onChange={(e) => setSelectedRank({ ...selectedRank, maxSingleLegVolumePercent: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/20 rounded-xl text-white font-mono text-sm"
                    />
                  ) : (
                    <div className="text-lg font-bold font-mono text-amber-400">
                      {selectedRank.maxSingleLegVolumePercent < 100 
                        ? `حداکثر ٪${selectedRank.maxSingleLegVolumePercent} از ۱ خط` 
                        : 'بدون محدودیت سقف خط (۱۰۰٪)'}
                    </div>
                  )}
                  <p className="text-[10px] text-slate-500">جلوگیری از ساختار تک‌شاخه و تمرکز ریسک</p>
                </div>

              </div>

              {/* Matrix Levels & Leadership Pool Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold">سطوح پورسانت بازشده در ماتریس هیبرید (ماده ۱۲):</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
                      {selectedRank.unlockedLevelsCount} لایه فعال
                    </span>
                  </div>
                  <p className="text-xs text-white font-medium">{selectedRank.unlockedMatrixLevels}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    کاربران با ارتقا به این رتبه، پورسانت سود محقق‌شده را از تراکنش‌های سطوح ۱ تا {selectedRank.unlockedLevelsCount} ماتریس ساختار خود دریافت می‌نمایند.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold">سهم استخر پاداش رهبری ۳٪ (ماده ۱۴):</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                      selectedRank.leadershipPoolPoints > 0 
                        ? 'bg-amber-500/20 text-amber-300' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {selectedRank.leadershipPoolPoints > 0 ? `${selectedRank.leadershipPoolPoints} امتیاز تخصیصی` : 'فاقد سهم استخر'}
                    </span>
                  </div>
                  <p className="text-xs text-white font-medium">
                    {selectedRank.leadershipPoolPoints > 0 
                      ? `واجد شرایط دریافت سهم ماهانه بر مبنای مدل امتیازی (${selectedRank.leadershipPoolPoints} امتیاز)` 
                      : 'این رتبه سهمی از استخر رهبری ۳٪ دریافت نمی‌کند (شروع از رتبه مدیر).'}
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    فرمول سهم هر عضو: (امتیاز عضو ÷ مجموع امتیاز تمام اعضای واجد شرایط) × مبلغ کل استخر ۳٪.
                  </p>
                </div>
              </div>

              {/* Automatic Audit Note */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/20 flex items-center gap-3 text-xs text-slate-400">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>
                  موتور ارتقای رتبه به صورت Real-time وضعیت تراکنش‌ها و شرایط احراز احجام را ارزیابی کرده و در انتهای هر دوره ساعت 00:00 UTC، رنک‌های واجد شرایط به طور قطعی ثبت و لاگ‌های مربوطه تولید می‌گردند.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-3xl bg-slate-900/40 border border-white/5 text-slate-400 text-xs">
              برای مشاهده و تنظیم شرایط هر رتبه سازمانی، یکی از کارت‌های بالا را انتخاب فرمایید.
            </div>
          )}

        </div>
      )}

      {/* TAB 2: UNLOCKED MATRIX LEVELS (Articles 12 & 8) */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
              <Layers className="w-4 h-4" />
              <span>ماده ۱۲ ـ سطوح پورسانت بازشده بر اساس رنک سازمانی</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              اعضای شبکه متناسب با رتبه سازمانی احراز شده، به عمق پورسانت‌دهی ماتریس هیبرید دسترسی پیدا می‌کنند. جدول زیر نگاشت دقیق رنک به سطوح مجاز پورسانت و درصدهای اختصاصی هر لایه (مجموع ۱۴٪ طبق ماده ۸) را نمایش می‌دهد:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="pb-3 pr-2 font-mono">رتبه سازمانی</th>
                    <th className="pb-3 font-mono">نام انگلیسی</th>
                    <th className="pb-3">سطوح بازشده در ماتریس</th>
                    <th className="pb-3">عمق لایه‌ها</th>
                    <th className="pb-3">مجموع درصد پورسانت بازشده</th>
                    <th className="pb-3">وضعیت استخر رهبری</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {ranks.map((r) => {
                    const cumulativePercent = HYBRID_20_LEVELS_RATES.slice(0, r.unlockedLevelsCount).reduce((acc, curr) => acc + curr.rate, 0);
                    return (
                      <tr key={r.id} className="hover:bg-white/5 transition">
                        <td className="py-3.5 pr-2 font-bold flex items-center gap-2">
                          <span className="text-base">{r.badge}</span>
                          <span>{r.persianName}</span>
                        </td>
                        <td className="py-3.5 font-mono text-slate-400">{r.name}</td>
                        <td className="py-3.5 text-cyan-400 font-medium">{r.unlockedMatrixLevels}</td>
                        <td className="py-3.5 font-mono font-bold text-white">{r.unlockedLevelsCount} سطح</td>
                        <td className="py-3.5 font-mono font-bold text-emerald-400">{cumulativePercent.toFixed(2)}%</td>
                        <td className="py-3.5">
                          {r.leadershipPoolPoints > 0 ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[11px]">
                              واجد شرایط ({r.leadershipPoolPoints} امتیاز)
                            </span>
                          ) : (
                            <span className="text-slate-500 font-mono text-[11px]">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 20 Level Commission Distribution Table (Article 8) */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                <Percent className="w-4 h-4" />
                <span>ماده ۸ ـ پورسانت شبکه ۲۰ سطحی (مجموع دقیق ۱۴.۰۰٪ از کل سود واقعی دوره)</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                TOTAL: 14.00%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2.5 font-mono text-xs">
              {HYBRID_20_LEVELS_RATES.map((lvl) => (
                <div key={lvl.level} className="p-3 rounded-2xl bg-slate-950 border border-white/10 text-center space-y-1">
                  <div className="text-slate-400 text-[11px]">سطح {lvl.level}</div>
                  <div className="text-[10px] text-slate-500">Level {lvl.letter}</div>
                  <div className="text-emerald-400 font-bold text-sm">{lvl.rate.toFixed(2)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LEADERSHIP POOL (Article 14) */}
      {activeTab === 'pool' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono mb-2 border border-amber-500/20">
                <PieChart className="w-3.5 h-3.5" />
                <span>LEADERSHIP POOL ALLOCATION ENGINE</span>
              </div>
              <h2 className="text-lg font-bold text-white">ماده ۱۴ ـ استخر رهبری و تخصیص امتیازی (۳٪ از کل سود واقعی)</h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-4xl">
                ۳٪ از کل سود واقعی (Realized Profit) دوره به استخر رهبری اختصاص می‌یابد. رنک‌های مدیر (۱۰)، مدیر ارشد (۲۰)، راهبر (۳۰) و راهبر ارشد (۴۰) مشمول دریافت سهم امتیازی هستند. سهم هر عضو = (امتیاز عضو ÷ مجموع امتیاز تمام اعضای واجد شرایط) × مبلغ کل استخر.
              </p>
            </div>

            {/* Simulated Calculator Tool */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>شبیه‌ساز تخصیص سود استخر رهبری دوره جاری</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">سود واقعی محقق‌شده کل پلتفرم (دلار):</label>
                  <input
                    type="number"
                    value={simulatedMonthlyRealizedProfit}
                    onChange={(e) => setSimulatedMonthlyRealizedProfit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/20 rounded-xl text-white font-mono text-sm"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-1 text-xs">
                  <div className="text-slate-400">حجم استخر رهبری (۳٪):</div>
                  <div className="text-xl font-bold font-mono text-amber-400">${poolFundUsdt.toLocaleString()}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-1 text-xs">
                  <div className="text-slate-400">مجموع امتیازات واجدین شرایط:</div>
                  <div className="text-xl font-bold font-mono text-cyan-400">{totalPoolPoints} امتیاز</div>
                </div>
              </div>

              {/* Distribution Table by Qualifying Rank */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="pb-2.5">رتبه واجد شرایط</th>
                      <th className="pb-2.5">امتیاز هر عضو</th>
                      <th className="pb-2.5">تعداد اعضای فعال</th>
                      <th className="pb-2.5">مجموع امتیاز رتبه</th>
                      <th className="pb-2.5">سهم هر فرد از استخر ۳٪</th>
                      <th className="pb-2.5">مجموع پرداختی به این رتبه</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200 font-mono">
                    {qualifyingPoolRanks.map((r) => {
                      const totalRankPoints = r.leadershipPoolPoints * r.activeHolders;
                      const singleShareUsdt = totalPoolPoints > 0 ? (r.leadershipPoolPoints / totalPoolPoints) * poolFundUsdt : 0;
                      const totalRankShareUsdt = singleShareUsdt * r.activeHolders;

                      return (
                        <tr key={r.id}>
                          <td className="py-3 font-bold font-sans flex items-center gap-2">
                            <span>{r.badge}</span>
                            <span>{r.persianName}</span>
                          </td>
                          <td className="py-3 text-amber-400 font-bold">{r.leadershipPoolPoints} pts</td>
                          <td className="py-3 text-white">{r.activeHolders} نفر</td>
                          <td className="py-3 text-cyan-400 font-bold">{totalRankPoints} pts</td>
                          <td className="py-3 text-emerald-400 font-bold">${singleShareUsdt.toFixed(2)}</td>
                          <td className="py-3 text-white font-bold">${totalRankShareUsdt.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] text-slate-400 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>بند تکمیلی ماده ۱۴:</strong> در صورت نبود عضو واجد شرایط در یک یا چند رنک، سهم بلااستفاده آن رنک میان سایر اعضای واجد شرایط مطابق مدل امتیازی بازتوزیع می‌شود و هیچ مبلغی مسدود یا حذف نخواهد شد.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMMISSION RULES & GOVERNANCE (Article 15) */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-mono mb-2 border border-emerald-500/20">
                <Scale className="w-3.5 h-3.5" />
                <span>COMMISSION & REALIZED PROFIT POLICIES</span>
              </div>
              <h2 className="text-lg font-bold text-white">ماده ۱۵ ـ قوانین پرداخت پورسانت و کنترل ریسک</h2>
              <p className="text-xs text-slate-300 mt-1">
                اصول بنیادین شفافیت مالی، پایداری اقتصادی سیستم و انطباق با قوانین پلتفرم مرجع:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Rule 1 */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>۱. مبنای صرفاً Realized Profit</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  مبنای پرداخت کلیه پاداش‌ها صرفاً <strong>سود واقعی محقق‌شده (Realized Profit)</strong> است و سود شناور یا محقق‌نشده (Unrealized / Floating Profit) تحت هیچ شرایطی مبنای محاسبه پورسانت قرار نمی‌گیرد.
                </p>
              </div>

              {/* Rule 2 */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>۲. مشروط بودن به سود واقعی مثبت همان دوره</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  پورسانت مستقیم (۳٪)، شبکه هیبرید (۱۴٪)، رنک و استخر رهبری (۳٪) فقط و فقط در صورت وجود سود واقعی و مثبت همان دوره پرداخت می‌شود.
                </p>
              </div>

              {/* Rule 3 */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 text-sm font-bold">
                  <AlertCircle className="w-4 h-4" />
                  <span>۳. دوره با سود صفر یا منفی</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  در صورت صفر یا منفی بودن سود واقعی دوره، هیچ‌گونه پورسانتی در هیچ سطحی پرداخت نخواهد شد و تعهدی برای پلتفرم ایجاد نمی‌گردد.
                </p>
              </div>

              {/* Rule 4 */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                  <AlertCircle className="w-4 h-4" />
                  <span>۴. عدم شمول اعضای Inactive</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  اعضای Inactive واجد شرایط دریافت پورسانت نیستند و جهت فعال‌سازی مجدد حق پورسانت باید شرایط فعالیت را احراز نمایند.
                </p>
              </div>

              {/* Rule 5 */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 text-sm font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>۵. سقف قطعی ۲۰٪ کل سود واقعی</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  مجموع پرداخت‌های بازاریابی در هیچ شرایطی نمی‌تواند از سقف ٪۲۰ کل سود واقعی دوره تجاوز کند (۱۴٪ شبکه + ۳٪ معرف مستقیم + ۳٪ استخر رهبری).
                </p>
              </div>

              {/* Rule 6 */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 text-sm font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>۶. عدم موضوعیت Claw-back</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  با توجه به تحقق شرط پرداخت بر مبنای سود واقعی و بسته‌شده، برگشت پورسانت (Claw-back) موضوعیت ندارد مگر آنکه طرفین کتباً خلاف آن را توافق کنند.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

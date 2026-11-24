import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, PageId } from '../../types';
import { databaseService } from '../../services/db/databaseService';
import { adminAuthService } from '../../services/adminAuthService';
import { authService } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import {
  Layers,
  TrendingUp,
  DollarSign,
  Users,
  Unlock,
  Info,
  ChevronDown,
  ChevronUp,
  GitBranch,
  Award,
  Sparkles,
  Lock
} from 'lucide-react';

interface TwentyLevelsPageProps {
  user: User;
  onNavigate: (page: PageId) => void;
  isAuthenticatedViewer?: boolean;
}

const OFFICIAL_RATES = [
  { level: 1, letter: 'A', rate: '3.00%' },
  { level: 2, letter: 'B', rate: '2.00%' },
  { level: 3, letter: 'C', rate: '1.60%' },
  { level: 4, letter: 'D', rate: '1.20%' },
  { level: 5, letter: 'E', rate: '0.90%' },
  { level: 6, letter: 'F', rate: '0.80%' },
  { level: 7, letter: 'G', rate: '0.70%' },
  { level: 8, letter: 'H', rate: '0.60%' },
  { level: 9, letter: 'I', rate: '0.50%' },
  { level: 10, letter: 'J', rate: '0.45%' },
  { level: 11, letter: 'K', rate: '0.40%' },
  { level: 12, letter: 'L', rate: '0.35%' },
  { level: 13, letter: 'M', rate: '0.30%' },
  { level: 14, letter: 'N', rate: '0.25%' },
  { level: 15, letter: 'O', rate: '0.25%' },
  { level: 16, letter: 'P', rate: '0.20%' },
  { level: 17, letter: 'Q', rate: '0.20%' },
  { level: 18, letter: 'R', rate: '0.15%' },
  { level: 19, letter: 'S', rate: '0.10%' },
  { level: 20, letter: 'T', rate: '0.05%' }
];

export const TwentyLevelsPage: React.FC<TwentyLevelsPageProps> = ({
  user,
  onNavigate,
  isAuthenticatedViewer = false
}) => {
  const { language, dir } = useLanguage();
  const isRtl = language === 'fa';
  const isFa = language === 'fa';
  const allUsers = useMemo(() => databaseService.getUsers(), []);

  const [selectedUserId, setSelectedUserId] = useState<string>(user?.id || user?.email || 'DX-482917');
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set(['A', 'B', 'C']));
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (user?.id || user?.email) {
      setSelectedUserId(user.id || user.email);
    }
  }, [user?.id, user?.email]);

  const relativeData = useMemo(() => {
    return databaseService.getRelative20LevelsForUser(selectedUserId);
  }, [selectedUserId]);

  const toggleLevelExpand = (letter: string) => {
    setExpandedLevels((prev) => {
      const next = new Set(prev);
      if (next.has(letter)) {
        next.delete(letter);
      } else {
        next.add(letter);
      }
      return next;
    });
  };

  const focusLevel = (letter: string) => {
    setTierFilter('all');
    setStatusFilter('all');
    setExpandedLevels(new Set([letter]));
    const el = document.getElementById(`level-card-${letter}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const filteredLevels = relativeData.levels.filter((lvl) => {
    const matchesTier = tierFilter === 'all' || lvl.tierGroup.toLowerCase().includes(tierFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lvl.status === statusFilter;
    return matchesTier && matchesStatus;
  });

  const totalCommissionsEarned = relativeData.levels.reduce((acc, curr) => acc + curr.commissionEarnedUsdt, 0);
  const totalNetworkProfitGenerated = relativeData.levels.reduce((acc, curr) => acc + curr.networkProfitUsdt, 0);
  const unlockedLevelsCount = relativeData.levels.filter((lvl) => lvl.status === 'unlocked').length;
  const targetUserObj = allUsers.find((u) => u.id === selectedUserId || u.email === selectedUserId) || user;
  const sessionUser = authService.getCurrentSession()?.user || null;
  const loggedInUser = sessionUser || (isAuthenticatedViewer ? user : null);
  const isAdmin = adminAuthService.isAuthenticated() || loggedInUser?.role === 'admin';

  const cleanIdToken = (val?: string) =>
    (val || '').toLowerCase().replace(/^usr_/, '').replace(/^dx-/, '').trim();

  const isSameIdentity = (candidate: { id?: string; username?: string; email?: string; name?: string; fullName?: string }) => {
    if (!loggedInUser) return false;
    if (candidate.id && loggedInUser.id) {
      if (candidate.id === loggedInUser.id) return true;
      const a = cleanIdToken(candidate.id);
      const b = cleanIdToken(loggedInUser.id);
      if (a && b && a === b) return true;
    }
    if (candidate.email && loggedInUser.email && candidate.email.toLowerCase() === loggedInUser.email.toLowerCase()) {
      return true;
    }
    if (candidate.username && loggedInUser.username && candidate.username.toLowerCase() === loggedInUser.username.toLowerCase()) {
      return true;
    }
    const candidateName = (candidate.name || candidate.fullName || '').trim();
    if (candidateName && loggedInUser.fullName && candidateName === loggedInUser.fullName.trim()) {
      return true;
    }
    return false;
  };

  const canSeeOwnerName = isAdmin || isSameIdentity(targetUserObj);

  const tierFilters = [
    { id: 'all', label: isFa ? 'همه ۲۰ سطح' : 'All 20 Tiers' },
    { id: 'Foundation', label: isFa ? 'پایه‌ای (۱ تا ۴)' : 'Foundation (1–4)' },
    { id: 'Expansion', label: isFa ? 'توسعه (۵ تا ۸)' : 'Expansion (5–8)' },
    { id: 'Leadership', label: isFa ? 'رهبری (۹ تا ۱۲)' : 'Leadership (9–12)' },
    { id: 'Executive', label: isFa ? 'مدیریتی (۱۳ تا ۱۶)' : 'Executive (13–16)' },
    { id: 'Apex', label: isFa ? 'اوج (۱۷ تا ۲۰)' : 'Apex (17–20)' }
  ];

  return (
    <div className="space-y-10 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-slate-200" dir={dir}>

      {/* SECTION 1: EDITORIAL MASTHEAD & MARKETING ALLOCATION SUMMARY */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl bg-gradient-to-br from-slate-900/90 via-[#070B14] to-slate-950 border border-white/10 p-7 sm:p-10 shadow-2xl space-y-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-cyan-400 font-bold">
                {isFa ? 'ساختار خورشیدی ۲۰ سطحی' : '20-TIER SUN SYSTEM'}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className={!canSeeOwnerName ? 'inline-flex items-center gap-1.5' : undefined}>
                <span>{isFa ? 'محاسبه اختصاصی شاخه‌های' : 'Personal Branch Scope:'}</span>{' '}
                <span
                  className={
                    canSeeOwnerName
                      ? 'text-slate-200 font-semibold'
                      : 'blur-[5px] select-none pointer-events-none opacity-80 inline-block'
                  }
                  aria-label={!canSeeOwnerName ? (isFa ? 'نام مخفی شده' : 'Hidden name') : undefined}
                >
                  {targetUserObj.fullName || targetUserObj.email}
                </span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white flex items-center gap-3 tracking-tight">
              <Layers className="w-7 h-7 text-cyan-400 shrink-0" />
              <span>{isFa ? 'طرح درآمدی و سطوح ۲۰ گانه شبکه' : '20-Level Network Plan & Your Tiers'}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              {isFa
                ? 'ساختار پورسانت ۱۴٪ در ۲۰ سطح به‌همراه ۳٪ معرفی مستقیم و ۳٪ استخر رهبری (مجموع ۲۰٪ تخصیص بازاریابی). حداکثر ۲۰ معرفی مستقیم در جایگاه اول و سرریز خودکار (Spillover) بر مبنای Sponsor واقعی.'
                : '14% distributed across 20 network layers plus 3% Direct Sponsor and 3% Leadership Pool (20% total marketing allocation), with a 20-direct frontline cap and Sponsor-anchored Spillover.'}
            </p>
          </div>

          {/* Scope Owner / Admin Selector */}
          {isAdmin ? (
            <div className="flex items-center gap-2 bg-slate-950 border border-amber-500/30 p-3 rounded-2xl shrink-0">
              <Users className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs text-amber-300 font-bold">
                {isFa ? 'بازبینی شاخه:' : 'Inspect Branch:'}
              </span>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
              >
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName} ({u.rank}) - {u.id}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-slate-950/90 border border-white/10 px-4 py-3 rounded-2xl shrink-0">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                <GitBranch className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {isFa ? 'مالک ساختار شبکه' : 'NETWORK OWNER'}
                </div>
                <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                  <span
                    className={
                      canSeeOwnerName
                        ? ''
                        : 'blur-[5px] select-none pointer-events-none opacity-80'
                    }
                    aria-label={!canSeeOwnerName ? (isFa ? 'نام مخفی شده' : 'Hidden name') : undefined}
                  >
                    {targetUserObj.fullName}
                  </span>
                  <span className="text-slate-400">({targetUserObj.id})</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profit & Marketing Allocation Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400">{isFa ? 'پورسانت معرفی مستقیم' : 'Direct Sponsor Bonus'}</div>
              <div className="text-xs text-slate-300 mt-0.5">{isFa ? 'پاداش مستقیم معرف واقعی' : 'Anchored to true Sponsor'}</div>
            </div>
            <div className="text-2xl font-black text-blue-400 font-mono tabular-nums">3.00%</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/25 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400">{isFa ? 'پورسانت شبکه — ۲۰ سطح' : 'Network Commission — 20 Levels'}</div>
              <div className="text-xs text-slate-300 mt-0.5">{isFa ? 'سطح ۱ (۳٪) تا سطح ۲۰ (۰.۰۵٪)' : 'Level 1 (3.00%) to 20 (0.05%)'}</div>
            </div>
            <div className="text-2xl font-black text-cyan-400 font-mono tabular-nums">14.00%</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400">{isFa ? 'استخر رهبری' : 'Leadership Pool'}</div>
              <div className="text-xs text-slate-300 mt-0.5">{isFa ? 'تخصیص به رتبه‌های مدیر به بالا' : 'Manager rank & above'}</div>
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono tabular-nums">3.00%</div>
          </div>
        </div>
      </motion.section>

      {/* SECTION 2: 4 KPI METRICS FOR THIS USER'S DOWNLINE */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            label: isFa ? 'کل اعضای زیرمجموعه شما' : 'Your Downline Members',
            value: relativeData.totalDownlineCount.toLocaleString(isRtl ? 'fa-IR' : 'en-US'),
            sub: isFa
              ? `${relativeData.activeDownlineCount.toLocaleString('fa-IR')} عضو فعال در ۲۰ لایه`
              : `${relativeData.activeDownlineCount} active across 20 tiers`,
            icon: Users,
            color: 'text-blue-400 bg-blue-500/15',
            valueColor: 'text-white'
          },
          {
            label: isFa ? 'مجموع پورسانت دریافتی شما' : 'Your 20-Tier Commissions',
            value: `${totalCommissionsEarned.toFixed(2)} USDT`,
            sub: isFa ? 'محاسبه‌شده از شاخه‌های اختصاصی شما' : 'Earned from your downline volume',
            icon: DollarSign,
            color: 'text-emerald-400 bg-emerald-500/15',
            valueColor: 'text-emerald-400',
            ltr: true
          },
          {
            label: isFa ? 'سود کل معاملات تیم شما' : 'Your Team Profit Base',
            value: `${totalNetworkProfitGenerated.toFixed(2)} USDT`,
            sub: isFa ? 'مجموع سود ثبت‌شده در شبکه شما' : 'Gross profit across your 20 levels',
            icon: TrendingUp,
            color: 'text-cyan-400 bg-cyan-500/15',
            valueColor: 'text-cyan-300',
            ltr: true
          },
          {
            label: isFa ? 'لایه‌های فعال شاخه شما' : 'Active Tiers in Branch',
            value: `${unlockedLevelsCount} / 20`,
            sub: isFa ? 'سطوح دارای عضو و پورسانت' : 'Layers with active placement',
            icon: Unlock,
            color: 'text-amber-400 bg-amber-500/15',
            valueColor: 'text-white'
          }
        ].map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.06, duration: 0.4 }}
            className="p-5 rounded-3xl bg-slate-900/65 border border-white/10 hover:border-white/20 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400">{kpi.label}</span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="w-4 h-4" />
              </div>
            </div>
            <div className={`text-2xl sm:text-3xl font-black font-mono tabular-nums ${kpi.valueColor}`} dir={kpi.ltr ? 'ltr' : undefined}>
              {kpi.value}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">{kpi.sub}</p>
          </motion.div>
        ))}
      </section>

      {/* SECTION 3: INTERACTIVE 20-LEVEL PAYOUT CURVE + SEGMENTED FILTERS */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 sm:p-8 space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>{isFa ? 'نمودار توزیع ۱۴٪ پورسانت در ۲۰ سطح' : '14% Payout Distribution Curve Across 20 Levels'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isFa
                ? 'روی هر سطح کلیک کنید تا به جزئیات همان لایه در جدول پایین هدایت شوید.'
                : 'Click any bar below to inspect members and earnings for that tier.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter(statusFilter === 'unlocked' ? 'all' : 'unlocked')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                statusFilter === 'unlocked'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-950 text-slate-300 border border-white/10 hover:border-white/25'
              }`}
            >
              {isFa ? 'فقط لایه‌های فعال' : 'Active Tiers Only'}
            </button>
          </div>
        </div>

        {/* Interactive 20-bar curve */}
        <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-[repeat(20,minmax(0,1fr))] gap-1.5 items-end pt-4 pb-1" dir="ltr">
          {OFFICIAL_RATES.map((item) => {
            const numericPct = parseFloat(item.rate);
            const heightPct = Math.max(18, Math.round((numericPct / 3.0) * 100));
            const isSelected = expandedLevels.has(item.letter);
            return (
              <button
                key={item.letter}
                type="button"
                onClick={() => focusLevel(item.letter)}
                className="group flex flex-col items-center gap-1.5 cursor-pointer"
                title={`Level ${item.level} (${item.letter}): ${item.rate}`}
              >
                <span className="text-[9px] font-mono text-slate-400 group-hover:text-cyan-300 tabular-nums transition-colors">
                  {item.rate}
                </span>
                <div className="w-full h-24 rounded-lg bg-slate-950/90 border border-white/5 flex items-end p-0.5 overflow-hidden">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-md transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-t from-blue-500 to-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.45)]'
                        : 'bg-blue-600/45 group-hover:bg-cyan-500/75'
                    }`}
                  />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-300 group-hover:text-white">
                  {item.level}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tier Group Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/10">
          {tierFilters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setTierFilter(f.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                tierFilter === f.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.section>

      {/* CORE RULE EXPLANATION STRIP */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/25 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 shrink-0 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xs sm:text-sm font-bold text-white">
            {isFa
              ? 'قانون ظرفیت ۲۰ معرفی مستقیم و منطق Spillover'
              : '20-Direct Cap & Sponsor-Anchored Spillover Logic'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isFa
              ? 'هر عضو می‌تواند حداکثر ۲۰ معرفی مستقیم در لایه اول داشته باشد. از معرفی مستقیم نفر بیست‌ویکم به بعد، ساختار Spillover فعال شده و جایگاه عضو به شاخه‌های زیرین سرریز می‌شود؛ با این حال، پورسانت همواره بر اساس Sponsor واقعی محاسبه می‌گردد نه محل فیزیکی قرارگیری عضو در شبکه.'
              : 'Each member holds up to 20 direct frontline slots. Starting from the 21st direct referral, automated Spillover assigns node placement below while commissions remain permanently credited to the actual Sponsor.'}
          </p>
        </div>
      </div>

      {/* SECTION 4: ANIMATED 20-LEVEL EXPANDABLE ACCORDIONS */}
      <section className="space-y-3.5">
        {filteredLevels.map((lvl) => {
          const isExpanded = expandedLevels.has(lvl.letter);
          return (
            <div
              id={`level-card-${lvl.letter}`}
              key={lvl.letter}
              className={`rounded-3xl border transition-colors duration-200 overflow-hidden ${
                lvl.users > 0
                  ? 'bg-slate-900/75 border-white/10 hover:border-cyan-500/35'
                  : 'bg-slate-950/70 border-white/5 opacity-80'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleLevelExpand(lvl.letter)}
                className="w-full p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer text-start"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black font-mono text-lg shrink-0 ${
                      lvl.users > 0
                        ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {lvl.letter}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-bold text-white text-base">
                        {isFa ? `سطح ${lvl.letter} (لایه ${lvl.levelNumber})` : `Tier ${lvl.letter} (Layer ${lvl.levelNumber})`}
                      </span>
                      <span className="text-xs font-mono text-cyan-400 font-bold tabular-nums">
                        {isFa ? `نرخ: ${lvl.commissionRatePercent}%` : `Rate: ${lvl.commissionRatePercent}%`}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-2.5 flex-wrap tabular-nums">
                      <span>
                        {isFa ? 'اعضای شبکه:' : 'Members:'}{' '}
                        <strong className="text-slate-200">{(lvl.users ?? 0).toLocaleString(isRtl ? 'fa-IR' : 'en-US')}</strong>
                      </span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span>
                        {isFa ? 'کاربران فعال:' : 'Active:'}{' '}
                        <strong className="text-emerald-400">{(lvl.activeUsers ?? 0).toLocaleString(isRtl ? 'fa-IR' : 'en-US')}</strong>
                      </span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span>
                        {isFa ? 'سود لایه:' : 'Layer Profit:'}{' '}
                        <strong className="text-white font-mono">{(lvl.networkProfitUsdt ?? 0).toFixed(2)} USDT</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className={dir === 'rtl' ? 'text-left' : 'text-right'}>
                    <div className="text-[11px] text-slate-400">{isFa ? 'پورسانت دریافتی شما' : 'Your Commission'}</div>
                    <div className="text-lg font-black text-emerald-400 font-mono tabular-nums" dir="ltr">
                      {lvl.commissionEarnedUsdt.toFixed(2)} USDT
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-800 text-slate-300 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 border-t border-white/10 bg-slate-950/60 space-y-4">
                      <div className="text-xs text-slate-400 flex items-center justify-between flex-wrap gap-2">
                        <span>
                          {isFa
                            ? `اعضای اختصاصی زیرشاخه شما در لایه ${lvl.levelNumber} (${lvl.letter}):`
                            : `Members under your downline hierarchy in Layer ${lvl.levelNumber} (${lvl.letter}):`}
                        </span>
                        <div className="flex items-center gap-3">
                          {!isAdmin && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                              <Lock className="w-3 h-3 text-cyan-400" />
                              <span>
                                {isFa
                                  ? 'حفظ حریم خصوصی: نام سایر کاربران محو شده است'
                                  : 'Privacy: other members’ names are blurred'}
                              </span>
                            </span>
                          )}
                          <span className="text-[11px] font-mono text-cyan-400 tabular-nums">
                            {isFa ? `درصد پورسانت: ${lvl.commissionRatePercent}%` : `Payout Rate: ${lvl.commissionRatePercent}%`}
                          </span>
                        </div>
                      </div>

                      {lvl.members.length === 0 ? (
                        <div className="p-6 rounded-2xl bg-slate-900/50 text-center text-xs text-slate-400 border border-white/5">
                          {isFa
                            ? 'در حال حاضر عضوی در این لایه از زیرشاخه‌های شما ثبت نشده است.'
                            : 'No downline members currently registered in this tier under your network.'}
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-slate-300">
                            <thead>
                              <tr className="border-b border-white/10 text-slate-400">
                                <th className={`p-2.5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{isFa ? 'عضو شبکه' : 'Member'}</th>
                                <th className="p-2.5 text-center">{isFa ? 'شناسه' : 'User ID'}</th>
                                <th className="p-2.5 text-center">{isFa ? 'رتبه' : 'Rank'}</th>
                                <th className="p-2.5 text-center">{isFa ? 'سود زیرمجموعه' : 'Member Profit'}</th>
                                <th className="p-2.5 text-center">{isFa ? 'پورسانت شما' : 'Your Commission'}</th>
                                <th className={`p-2.5 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{isFa ? 'وضعیت' : 'Status'}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 tabular-nums">
                              {lvl.members.map((m) => {
                                const isSelfMember = isSameIdentity(m);
                                const canSeeMemberName = isAdmin || isSelfMember;
                                return (
                                  <tr key={m.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-2.5 font-bold text-white">
                                      <span
                                        className={
                                          canSeeMemberName
                                            ? 'inline-flex items-center gap-1.5'
                                            : 'inline-block blur-[5px] select-none pointer-events-none opacity-80'
                                        }
                                        aria-label={!canSeeMemberName ? (isFa ? 'نام عضو مخفی شده' : 'Hidden member name') : undefined}
                                      >
                                        {m.name}
                                        {isSelfMember && !isAdmin && (
                                          <span className="text-[10px] font-mono text-cyan-400 font-normal">
                                            ({isFa ? 'شما' : 'You'})
                                          </span>
                                        )}
                                      </span>
                                    </td>
                                    <td className="p-2.5 text-center font-mono text-slate-400">{m.id}</td>
                                    <td className="p-2.5 text-center font-medium text-blue-300">{m.rank}</td>
                                    <td className="p-2.5 text-center font-mono text-slate-200">{(m.volumeUsdt || 0).toFixed(2)} USDT</td>
                                    <td className="p-2.5 text-center font-mono text-emerald-400 font-bold">
                                      {m.commissionEarnedUsdt.toFixed(2)} USDT
                                    </td>
                                    <td className={`p-2.5 ${dir === 'rtl' ? 'text-left' : 'text-right'} font-bold`}>
                                      <span className={m.status === 'active' ? 'text-emerald-400' : 'text-slate-500'}>
                                        {m.status === 'active' ? (isFa ? 'فعال' : 'Active') : (isFa ? 'غیرفعال' : 'Inactive')}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </section>

      {/* Bottom Ranks Cross-Link */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-900/60 border border-white/10 p-5">
        <div className="flex items-center gap-3">
          <Award className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-xs sm:text-sm text-slate-300">
            {isFa
              ? 'آماده ارتقا به رتبه‌های لیدری و دریافت سهم از استخر ۳٪ هستید؟'
              : 'Ready to advance your Leadership Rank and unlock the 3% Leadership Pool?'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('ranks')}
          className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition cursor-pointer"
        >
          {isFa ? 'مشاهده رتبه‌ها و پاداش‌ها' : 'Explore Ranks & Pool'}
        </button>
      </div>

    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  DashboardTab,
  PageId,
  KycStatus
} from '../../types';
import {
  DASHBOARD_20_LEVELS,
  MOCK_ACTIVITIES,
  MOCK_EARNINGS_SERIES
} from '../../data/mockData';
import { authService } from '../../services/authService';
import { kycService } from '../../services/kycService';
import { adminService } from '../../services/adminService';
import { databaseService } from '../../services/db/databaseService';
import { rankService } from '../../services/rankService';
import { DashboardSidebar } from './DashboardSidebar';
import { UserNetworkPage } from '../network/UserNetworkPage';
import { TwentyLevelsPage } from '../levels/TwentyLevelsPage';
import { UserEarningsPage } from '../earnings/UserEarningsPage';
import { UserRankPage } from '../rank/UserRankPage';
import { UserWithdrawalsSection } from './UserWithdrawalsSection';
import { UserSupportTicketsSection } from './UserSupportTicketsSection';
import { AdCanvasPage } from './AdCanvasPage';
import { useLanguage } from '../../context/LanguageContext';
import {
  Users,
  Layers,
  TrendingUp,
  DollarSign,
  Copy,
  Check,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Menu,
  Lock,
  Bell,
  Wallet,
  CheckCircle2,
  UserPlus
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface UserDashboardProps {
  user: User;
  onNavigatePage: (page: PageId) => void;
  onLogout: () => void;
  onUserUpdate: (updatedUser: User) => void;
  initialTab?: DashboardTab;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  onNavigatePage,
  onLogout,
  onUserUpdate,
  initialTab
}) => {
  const { language, dir, t } = useLanguage();
  const isFa = language === 'fa';
  const [dbTick, setDbTick] = useState(0);

  useEffect(() => {
    const handleDbUpdate = () => {
      setDbTick((prev) => prev + 1);
    };
    window.addEventListener('tgex_database_updated', handleDbUpdate);
    window.addEventListener('tgex_db_updated', handleDbUpdate);
    return () => {
      window.removeEventListener('tgex_database_updated', handleDbUpdate);
      window.removeEventListener('tgex_db_updated', handleDbUpdate);
    };
  }, []);

  const relationalData = useMemo(() => {
    return databaseService.getUserRelationalData(user.id || user.email);
  }, [user.id, user.email, dbTick]);

  const totalNet = relationalData ? relationalData.totalNetworkCount : (user.totalNetworkCount ?? 0);
  const activeNet = relationalData ? relationalData.activeNetworkCount : (user.activeNetworkCount ?? 0);
  const inactiveNet = relationalData ? relationalData.inactiveNetworkCount : Math.max(0, totalNet - activeNet);
  const directNet = relationalData ? relationalData.directReferralsCount : (user.directReferralsCount ?? 0);
  const indirectNet = Math.max(0, totalNet - directNet);
  const totalEarn = relationalData ? relationalData.totalEarningsUsdt : (user.totalEarningsUsdt ?? 0);
  const currentMonthEarn = relationalData ? relationalData.currentMonthEarningsUsdt : (user.currentMonthEarningsUsdt ?? 0);
  const netProfit = relationalData ? relationalData.networkProfitUsdt : (user.networkProfitUsdt ?? 0);
  const netVolume = relationalData ? relationalData.networkVolumeUsdt : (user.networkVolumeUsdt ?? 0);
  const activityRate = totalNet > 0 ? ((activeNet / totalNet) * 100).toFixed(1) : '0';

  const userReferralCode =
    user.referralCode ||
    relationalData?.user?.referralCode ||
    (user.id ? user.id.replace('usr_', '').replace('DX-', '') : '482917635');
  const userPlacementId = user.placementParentId || relationalData?.user?.placementParentId || 'TX-NODE-1001';

  const currentRankObj = rankService.getUserCurrentRank(user);
  const activeRankDisplayName =
    currentRankObj.name + (isFa ? ` (${currentRankObj.farsiName.split(' ')[0]})` : '');

  const activeUser = {
    ...user,
    fullName:
      user.fullName ||
      relationalData?.user?.fullName ||
      user.email?.split('@')[0] ||
      t('dash.overview.welcome'),
    username: user.username || relationalData?.user?.username || user.email?.split('@')[0] || 'user',
    rankName: activeRankDisplayName || relationalData?.user?.rank || user.rankName || t('dash.overview.rank_default'),
    rankTier: currentRankObj.id,
    networkLevel: relationalData?.user?.level || user.networkLevel || t('dash.overview.level_default'),
    referralCode: userReferralCode,
    placementParentId: userPlacementId,
    totalNetworkCount: totalNet,
    activeNetworkCount: activeNet,
    inactiveNetworkCount: inactiveNet,
    directReferralsCount: directNet,
    totalEarningsUsdt: totalEarn,
    currentMonthEarningsUsdt: currentMonthEarn,
    networkProfitUsdt: netProfit,
    networkVolumeUsdt: netVolume
  };

  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab || 'overview');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Listen for real-time user updates triggered by admin actions
  useEffect(() => {
    const handleUserUpdateEvent = (e: any) => {
      const detail = e.detail;
      if (detail && (detail.id === user.id || detail.email?.toLowerCase() === user.email?.toLowerCase())) {
        setTimeout(() => {
          onUserUpdate({
            ...user,
            ...detail,
            kycStatus: detail.kycStatus,
            isVerified: detail.kycStatus === 'approved',
            kycRejectionReason: detail.kycRejectionReason
          });
        }, 0);
      }
    };

    window.addEventListener('tgex_user_updated', handleUserUpdateEvent);
    window.addEventListener('tgex_kyc_status_changed', handleUserUpdateEvent);

    return () => {
      window.removeEventListener('tgex_user_updated', handleUserUpdateEvent);
      window.removeEventListener('tgex_kyc_status_changed', handleUserUpdateEvent);
    };
  }, [user, onUserUpdate]);

  // Keep KYC sync callable if needed silently
  useEffect(() => {
    const syncSilent = async () => {
      try {
        const adminUsers = adminService.getUsersList();
        const matched = adminUsers.find(
          (u) =>
            u.id === user.id ||
            u.id === 'DX-' + user.id.replace('usr_', '') ||
            u.email.toLowerCase() === user.email.toLowerCase()
        );
        const app = await kycService.getUserApplication(user.id);
        const session = authService.getCurrentSession();
        const latestKyc: KycStatus =
          matched?.kycStatus || app?.status || session?.user?.kycStatus || user.kycStatus;
        if (latestKyc && latestKyc !== user.kycStatus) {
          onUserUpdate({
            ...user,
            kycStatus: latestKyc,
            isVerified: latestKyc === 'approved'
          });
        }
      } catch {
        // Ignore silent sync issues
      }
    };
    syncSilent();
  }, [user.id]);

  const referralCode = activeUser.referralCode;
  const referralLink = `https://tgex.com/register?ref=${referralCode}`;
  const placementCode = activeUser.placementParentId;

  const directReferralsList = useMemo(() => {
    if (!relationalData || !relationalData.directReferrals) return [];
    return relationalData.directReferrals.map((ref) => ({
      id: ref.id,
      name: ref.fullName,
      email: ref.email,
      joinDate: ref.registrationDate,
      kycStatus: ref.kycStatus,
      level: ref.level || (isFa ? 'سطح ۱ (Level A)' : 'Level A'),
      volumeUsdt: ref.networkVolumeUsdt || 0,
      commissionEarnedUsdt: Math.round((ref.profitUsdt || 0) * 0.12 * 100) / 100
    }));
  }, [relationalData, isFa]);

  const userActivities = useMemo(() => {
    if (directReferralsList.length > 0) {
      return directReferralsList.slice(0, 4).map((d, idx) => ({
        id: `act_${d.id}_${idx}`,
        title: isFa ? `عضو مستقیم جدید: ${d.name}` : `Direct Referral: ${d.name}`,
        description: isFa ? `${d.email}` : `${d.email}`,
        timeAgo: d.joinDate,
        amount: d.commissionEarnedUsdt > 0 ? `+$${d.commissionEarnedUsdt}` : undefined
      }));
    }
    return [
      {
        id: 'act_user_welcome',
        title: t('dash.overview.activity.welcome_title'),
        description: t('dash.overview.activity.welcome_desc')
          .replace('{level}', activeUser.networkLevel || '')
          .replace('{sponsor}', user.sponsorId || 'TGEX-482917')
          .replace('{placement}', placementCode),
        timeAgo: t('dash.overview.activity.just_now'),
        amount: undefined
      },
      {
        id: 'act_user_referral',
        title: t('dash.overview.activity.referral_title'),
        description: t('dash.overview.activity.referral_desc').replace('{code}', referralCode),
        timeAgo: t('dash.overview.activity.today'),
        amount: undefined
      }
    ];
  }, [directReferralsList, activeUser.networkLevel, user.sponsorId, placementCode, referralCode, isFa]);

  const dynamic20Levels = useMemo(() => {
    if (totalNet > 0) {
      return DASHBOARD_20_LEVELS;
    }
    return DASHBOARD_20_LEVELS.map((lvl) => ({
      ...lvl,
      users: 0,
      activeUsers: 0,
      commission: 0,
      status: lvl.levelNumber === 1 || activeUser.networkLevel?.includes(lvl.letter) ? 'active' : 'locked'
    }));
  }, [totalNet, activeUser.networkLevel]);

  const dynamicChartSeries = useMemo(() => {
    if (totalEarn > 0) {
      return MOCK_EARNINGS_SERIES;
    }
    return [
      { month: t('dash.overview.chart.m1'), matrix: 0, direct: 0 },
      { month: t('dash.overview.chart.m2'), matrix: 0, direct: 0 },
      { month: t('dash.overview.chart.m3'), matrix: 0, direct: 0 },
      { month: t('dash.overview.chart.m4'), matrix: 0, direct: 0 },
      { month: t('dash.overview.chart.m5'), matrix: 0, direct: 0 },
      { month: t('dash.overview.chart.m6'), matrix: 0, direct: 0 }
    ];
  }, [totalEarn]);

  const fallbackCopy = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    } catch (e) {
      console.warn('Clipboard fallback error:', e);
    }
  };

  const copyToClipboard = (text: string, type: 'link' | 'code') => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text).catch(() => {
          fallbackCopy(text);
        });
      } else {
        fallbackCopy(text);
      }
    } catch {
      fallbackCopy(text);
    }
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const activeTabTitle: Record<DashboardTab, string> = {
    overview: t('dash.nav.overview'),
    network: t('dash.nav.network'),
    referrals: t('dash.nav.referrals'),
    levels: t('dash.nav.levels'),
    earnings: t('dash.nav.earnings'),
    withdrawals: t('dash.nav.withdrawals'),
    rank: t('dash.nav.rank'),
    'copy-trading': isFa ? 'کپی تریدینگ' : 'Copy Trading',
    security: isFa ? 'پروفایل و امنیت' : 'Profile & Security',
    notifications: t('dash.nav.notifications'),
    'support-tickets': t('dash.nav.support_tickets', 'تیکت‌های پشتیبانی'),
    ads: t('dash.nav.ads', 'تبلیغات و بورد شخصی'),
    profile: isFa ? 'پروفایل' : 'Profile',
    kyc: isFa ? 'احراز هویت' : 'Verification'
  };

  const directCapacityPct = Math.min(100, Math.round((directNet / 20) * 100));

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#05070A] text-slate-100 flex flex-col md:flex-row w-full min-w-0">
      {/* Docked Sidebar */}
      <DashboardSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        user={activeUser}
        onLogout={onLogout}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onNavigatePage={onNavigatePage}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Workspace Canvas */}
      <div className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-5 sm:py-7">
        <div className="max-w-[1320px] mx-auto space-y-6">
          {/* Mobile Bar */}
          <div className="md:hidden flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-[#0B0F17] border border-white/[0.08]">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg bg-white/[0.05] text-slate-200 hover:bg-white/[0.09] transition cursor-pointer shrink-0"
                aria-label="Open Dashboard Menu"
              >
                <Menu className="w-4 h-4" />
              </button>
              <span className="font-semibold text-sm text-white truncate">
                {activeTabTitle[activeTab]}
              </span>
            </div>

            <span className="text-xs text-blue-400 font-mono shrink-0">
              {activeUser.networkLevel}
            </span>
          </div>

          {/* Clean Top Workspace Header (Zero-Pill, Unboxed Metadata + 2 Actions) */}
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-base font-black text-white font-mono shrink-0">
                {activeUser.fullName ? activeUser.fullName[0] : 'T'}
              </div>

              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{t('dash.nav.title')}</span>
                  <span aria-hidden="true">/</span>
                  <span className="text-slate-200 font-medium">{activeTabTitle[activeTab]}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
                    {activeUser.fullName}
                  </h1>
                  <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-400">
                    <span className="text-amber-300/90 font-medium">{activeUser.rankName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-blue-400">{activeUser.networkLevel}</span>
                    {user.sponsorName && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>
                          {isFa ? `حامی: ${user.sponsorName}` : `Sponsor: ${user.sponsorName}`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* At most 2 concise single-line actions */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
              <button
                type="button"
                onClick={() => copyToClipboard(referralLink, 'link')}
                className="px-3.5 py-2 rounded-lg bg-[#0B0F17] hover:bg-slate-800/80 border border-white/10 text-xs font-medium text-slate-200 flex items-center gap-2 transition whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copiedLink ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-blue-400" />
                )}
                <span>
                  {copiedLink
                    ? t('dash.overview.invite.copied')
                    : isFa
                      ? 'کپی لینک دعوت'
                      : 'Copy Invite Link'}
                </span>
              </button>

              {activeTab !== 'withdrawals' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('withdrawals')}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-2 transition whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>{t('dash.nav.withdrawals')}</span>
                </button>
              )}
            </div>
          </header>

          {/* Animated Tab Views */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="w-full min-w-0"
            >
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* 4 High-Signal Primary KPIs */}
                  <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {/* KPI 1: Total Earnings */}
                    <div className="p-5 rounded-2xl bg-[#0B0F17] border border-white/[0.08] flex flex-col justify-between gap-3">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{t('dash.overview.stats.total_earnings')}</span>
                        <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                      </div>
                      <div className="text-2xl sm:text-[26px] font-bold text-white font-mono tabular-nums" dir="ltr">
                        ${activeUser.totalEarningsUsdt.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center justify-between border-t border-white/[0.06] pt-2.5">
                        <span>{t('dash.overview.stats.current_month')}</span>
                        <span className="font-mono tabular-nums text-emerald-400 font-semibold" dir="ltr">
                          +${activeUser.currentMonthEarningsUsdt.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* KPI 2: Network Profit & Volume */}
                    <div className="p-5 rounded-2xl bg-[#0B0F17] border border-white/[0.08] flex flex-col justify-between gap-3">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{t('dash.overview.stats.network_profit')}</span>
                        <TrendingUp className="w-4 h-4 text-blue-400 shrink-0" />
                      </div>
                      <div className="text-2xl sm:text-[26px] font-bold text-white font-mono tabular-nums" dir="ltr">
                        ${activeUser.networkProfitUsdt.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center justify-between border-t border-white/[0.06] pt-2.5">
                        <span>{isFa ? 'حجم گردش شبکه' : 'Network Volume'}</span>
                        <span className="font-mono tabular-nums text-slate-200 font-medium" dir="ltr">
                          ${activeUser.networkVolumeUsdt.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* KPI 3: Network Members */}
                    <div className="p-5 rounded-2xl bg-[#0B0F17] border border-white/[0.08] flex flex-col justify-between gap-3">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{t('dash.overview.stats.total_network')}</span>
                        <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                      </div>
                      <div className="flex items-baseline gap-2.5">
                        <span className="text-2xl sm:text-[26px] font-bold text-white font-mono tabular-nums">
                          {activeUser.totalNetworkCount.toLocaleString(isFa ? 'fa-IR' : 'en-US')}
                        </span>
                        <span className="text-xs text-emerald-400 font-mono tabular-nums">
                          {activityRate}% {isFa ? 'فعال' : 'active'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center justify-between border-t border-white/[0.06] pt-2.5 font-mono tabular-nums">
                        <span>
                          {isFa
                            ? `مستقیم: ${directNet.toLocaleString('fa-IR')}`
                            : `Direct: ${directNet}`}
                        </span>
                        <span>
                          {isFa
                            ? `غیرمستقیم: ${indirectNet.toLocaleString('fa-IR')}`
                            : `Indirect: ${indirectNet}`}
                        </span>
                      </div>
                    </div>

                    {/* KPI 4: Rank & Level Capacity */}
                    <div className="p-5 rounded-2xl bg-[#0B0F17] border border-white/[0.08] flex flex-col justify-between gap-3">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{t('dash.overview.stats.rank_level')}</span>
                        <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-white truncate">
                        {activeUser.networkLevel}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center justify-between border-t border-white/[0.06] pt-2.5">
                        <span className="truncate text-amber-300/90 font-medium">{activeUser.rankName}</span>
                        <span className="font-mono tabular-nums text-slate-300 shrink-0">
                          {directNet}/20 {isFa ? 'جایگاه' : 'slots'}
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* 12-Column Main Bento Workspace: Chart (8) + Invite & Activity (4) */}
                  <section className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
                    {/* Earnings Chart (8 cols) */}
                    <div className="xl:col-span-8 p-5 sm:p-6 rounded-2xl bg-[#0B0F17] border border-white/[0.08] flex flex-col justify-between space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h2 className="text-base font-bold text-white">{t('dash.overview.chart.title')}</h2>
                          <p className="text-xs text-slate-400 mt-0.5">{t('dash.overview.chart.desc')}</p>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-0.5 bg-blue-500 inline-block" />
                            {t('dash.overview.chart.matrix')}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" />
                            {t('dash.overview.chart.direct')}
                          </span>
                          <span className="font-mono tabular-nums text-emerald-400 font-semibold">
                            {t('dash.overview.chart.growth')}
                          </span>
                        </div>
                      </div>

                      <div className="h-72 w-full" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={dynamicChartSeries} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorMatrix" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.32} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="colorDirect" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.28} />
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                            <XAxis
                              dataKey="month"
                              stroke="#64748b"
                              tick={{ fontSize: 11, fill: '#94a3b8' }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis
                              stroke="#64748b"
                              tick={{ fontSize: 11, fill: '#94a3b8' }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#0f172a',
                                borderColor: 'rgba(255,255,255,0.12)',
                                borderRadius: '10px',
                                fontSize: '12px',
                                color: '#f8fafc'
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="matrix"
                              name={t('dash.overview.chart.matrix')}
                              stroke="#3b82f6"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#colorMatrix)"
                            />
                            <Area
                              type="monotone"
                              dataKey="direct"
                              name={t('dash.overview.chart.direct')}
                              stroke="#06b6d4"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#colorDirect)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Unified Invite & Activity Side Column (4 cols) */}
                    <div className="xl:col-span-4 rounded-2xl bg-[#0B0F17] border border-white/[0.08] divide-y divide-white/[0.07] flex flex-col justify-between">
                      {/* Invite & Capacity Section */}
                      <div className="p-5 sm:p-6 space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <h2 className="text-sm font-bold text-white">{t('dash.overview.invite.title')}</h2>
                          <span className="text-xs font-mono tabular-nums text-blue-400">
                            {directNet}/20
                          </span>
                        </div>

                        {/* Frontline capacity indicator */}
                        <div className="space-y-1.5">
                          <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300"
                              style={{ width: `${directCapacityPct}%` }}
                            />
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {isFa
                              ? 'ظرفیت معرفی مستقیم لایه اول (پس از ۲۰ نفر، سرریز خودکار فعال می‌شود).'
                              : 'Layer 1 direct slots (auto-spillover activates after 20 direct invites).'}
                          </p>
                        </div>

                        {/* Referral Code & Link inputs */}
                        <div className="space-y-2.5 pt-1">
                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1">
                              {t('dash.overview.invite.code_label')}
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                readOnly
                                value={referralCode}
                                dir="ltr"
                                className="w-full bg-slate-950/90 border border-white/10 rounded-lg px-3 py-1.5 text-sm font-bold text-white font-mono tracking-wider focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => copyToClipboard(referralCode, 'code')}
                                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-white/10 transition shrink-0 cursor-pointer"
                              >
                                {copiedCode ? t('dash.overview.invite.copied') : t('dash.overview.invite.copy_code_btn')}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1">
                              {t('dash.overview.invite.link_label')}
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                readOnly
                                value={referralLink}
                                dir="ltr"
                                className="w-full bg-slate-950/90 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-blue-400 font-mono focus:outline-none truncate"
                              />
                              <button
                                type="button"
                                onClick={() => copyToClipboard(referralLink, 'link')}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white transition shrink-0 cursor-pointer"
                              >
                                {copiedLink ? t('dash.overview.invite.copied') : t('dash.overview.invite.copy_btn')}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Activity List (Flat with hairline dividers) */}
                      <div className="p-5 sm:p-6 space-y-3 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-white">{t('dash.overview.activity.title')}</h3>
                          <button
                            type="button"
                            onClick={() => setActiveTab('notifications')}
                            className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
                          >
                            {isFa ? 'همه' : 'All'}
                          </button>
                        </div>

                        <div className="divide-y divide-white/[0.06]">
                          {userActivities.slice(0, 3).map((act) => (
                            <div key={act.id} className="py-2.5 first:pt-0 last:pb-0 space-y-0.5 text-xs">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-slate-100 truncate">{act.title}</span>
                                {act.amount && (
                                  <span className="font-mono tabular-nums text-emerald-400 font-semibold shrink-0" dir="ltr">
                                    {act.amount}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
                                <span className="truncate">{act.description}</span>
                                <span className="shrink-0 text-slate-500 font-mono">{act.timeAgo}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Compact 20-Level Matrix Summary Strip */}
                  <section className="p-5 sm:p-6 rounded-2xl bg-[#0B0F17] border border-white/[0.08] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h2 className="text-base font-bold text-white">{t('dash.overview.matrix.title')}</h2>
                        <p className="text-xs text-slate-400 mt-0.5">{t('dash.overview.matrix.desc')}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('levels')}
                        className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <span>{t('dash.overview.matrix.view_details')}</span>
                        {dir === 'rtl' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
                      {dynamic20Levels.slice(0, 10).map((lvl) => (
                        <button
                          key={lvl.letter}
                          type="button"
                          onClick={() => setActiveTab('levels')}
                          className={`p-3 rounded-xl border text-start transition cursor-pointer ${
                            lvl.status === 'active'
                              ? 'bg-slate-950/70 border-white/[0.08] hover:border-blue-500/40'
                              : 'bg-slate-950/30 border-white/[0.04] opacity-55 hover:opacity-80'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono font-bold text-sm text-blue-400">{lvl.letter}</span>
                            <span className="text-[11px] font-mono text-slate-500">L{lvl.levelNumber}</span>
                          </div>
                          <div className="text-xs font-mono tabular-nums font-semibold text-white" dir="ltr">
                            ${lvl.commission.toLocaleString()}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono tabular-nums mt-0.5">
                            {lvl.activeUsers}/{lvl.users} {isFa ? 'فعال' : 'act'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {/* TAB 2: MY NETWORK */}
              {activeTab === 'network' && (
                <UserNetworkPage user={user} onNavigate={onNavigatePage} />
              )}

              {/* TAB 3: MY REFERRALS */}
              {activeTab === 'referrals' && (
                <div className="p-5 sm:p-6 rounded-2xl bg-[#0B0F17] border border-white/[0.08] space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                    <div>
                      <h2 className="text-lg font-bold text-white">{t('dash.referrals.title')}</h2>
                      <p className="text-xs text-slate-400 mt-0.5">{t('dash.referrals.desc')}</p>
                    </div>
                    <span className="text-xs font-mono tabular-nums text-blue-400 font-semibold">
                      {t('dash.referrals.count_badge').replace('{count}', directReferralsList.length.toString())}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className={`w-full text-xs ${isFa ? 'text-right' : 'text-left'}`}>
                      <thead className="text-slate-400 border-b border-white/[0.08]">
                        <tr>
                          <th className="py-3 px-3 font-medium">{t('dash.referrals.table.user')}</th>
                          <th className="py-3 px-3 font-medium">{t('dash.referrals.table.join_date')}</th>
                          <th className="py-3 px-3 font-medium">{isFa ? 'وضعیت حساب' : 'Status'}</th>
                          <th className="py-3 px-3 font-medium">{t('dash.referrals.table.level')}</th>
                          <th className="py-3 px-3 font-medium">{t('dash.referrals.table.volume')}</th>
                          <th className="py-3 px-3 font-medium">{t('dash.referrals.table.commission')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.06]">
                        {directReferralsList.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-14 text-center text-slate-400">
                              <div className="flex flex-col items-center justify-center space-y-3 max-w-sm mx-auto">
                                <UserPlus className="w-8 h-8 text-slate-600" />
                                <div className="text-sm font-semibold text-slate-200">
                                  {isFa ? 'هنوز کاربری با کد دعوت شما ثبت‌نام نکرده است' : 'No direct referrals registered yet'}
                                </div>
                                <p className="text-xs text-slate-500">
                                  {isFa
                                    ? 'لینک دعوت خود را به اشتراک بگذارید تا کاربران مستقیم شما در این جدول نمایش داده شوند.'
                                    : 'Share your invite link so direct members appear here and in your matrix.'}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(referralLink, 'link')}
                                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition cursor-pointer"
                                >
                                  {copiedLink ? t('dash.overview.invite.copied') : isFa ? 'کپی لینک دعوت' : 'Copy Invite Link'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          directReferralsList.map((ref) => (
                            <tr key={ref.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-3 px-3">
                                <div className="font-semibold text-white">{ref.name}</div>
                                <div className="text-[11px] text-slate-400 font-mono">{ref.email}</div>
                              </td>
                              <td className="py-3 px-3 font-mono tabular-nums text-slate-400">{ref.joinDate}</td>
                              <td className="py-3 px-3">
                                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  {isFa ? 'فعال' : 'Active'}
                                </span>
                              </td>
                              <td className="py-3 px-3 font-mono text-blue-400">{ref.level}</td>
                              <td className="py-3 px-3 font-mono tabular-nums text-white" dir="ltr">
                                ${ref.volumeUsdt.toLocaleString()}
                              </td>
                              <td className="py-3 px-3 font-mono tabular-nums text-emerald-400 font-semibold" dir="ltr">
                                +${ref.commissionEarnedUsdt}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: 20 LEVELS */}
              {activeTab === 'levels' && (
                <TwentyLevelsPage user={user} onNavigate={onNavigatePage} isAuthenticatedViewer={true} />
              )}

              {/* TAB 5: EARNINGS */}
              {activeTab === 'earnings' && (
                <UserEarningsPage user={user} onNavigate={onNavigatePage} />
              )}

              {/* TAB 6: WITHDRAWALS */}
              {activeTab === 'withdrawals' && <UserWithdrawalsSection user={user} />}

              {/* TAB 7: RANK */}
              {activeTab === 'rank' && (
                <UserRankPage user={activeUser} onNavigate={onNavigatePage} onUserUpdate={onUserUpdate} />
              )}

              {/* TAB 8: PROFILE & 2FA SECURITY */}
              {activeTab === 'security' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Profile Details */}
                  <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-[#0B0F17] border border-white/[0.08] space-y-4">
                    <h2 className="text-base font-bold text-white pb-3 border-b border-white/[0.06]">
                      {t('dash.profile.title')}
                    </h2>

                    <div className="divide-y divide-white/[0.06] text-xs">
                      <div className="py-3 flex items-center justify-between gap-3">
                        <span className="text-slate-400">{t('dash.profile.full_name')}</span>
                        <span className="text-white font-semibold">{user.fullName || t('dash.profile.not_set')}</span>
                      </div>
                      <div className="py-3 flex items-center justify-between gap-3">
                        <span className="text-slate-400">{t('dash.profile.username')}</span>
                        <span className="text-blue-400 font-mono font-semibold">{user.username || 'user'}</span>
                      </div>
                      <div className="py-3 flex items-center justify-between gap-3">
                        <span className="text-slate-400">{t('dash.profile.email')}</span>
                        <span className="text-white font-mono truncate">{user.email}</span>
                      </div>
                      <div className="py-3 flex items-center justify-between gap-3">
                        <span className="text-slate-400">{t('dash.profile.sponsor')}</span>
                        <span className="text-white font-mono">{user.sponsorId}</span>
                      </div>
                      <div className="py-3 flex items-center justify-between gap-3">
                        <span className="text-slate-400">{t('dash.security.last_login')}</span>
                        <span className="font-mono text-slate-300" dir="ltr">
                          {user.lastLoginAt ? user.lastLoginAt.slice(0, 19).replace('T', ' ') : '2026-08-21 00:30 UTC'}
                        </span>
                      </div>
                      <div className="pt-3 flex items-center justify-between gap-3">
                        <span className="text-slate-400">{t('dash.security.encryption')}</span>
                        <span className="font-mono text-blue-400">TLS 1.3 · AES-256-GCM</span>
                      </div>
                    </div>
                  </div>

                  {/* 2FA Security Controls */}
                  <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-[#0B0F17] border border-white/[0.08] space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                            user.twoFactorEnabled
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                              : 'bg-slate-800 text-slate-400 border border-white/10'
                          }`}
                        >
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-sm font-bold text-white">
                            <span>{t('dash.security.totp_title')}</span>
                            <span aria-hidden="true">·</span>
                            <span
                              className={`text-xs font-medium ${
                                user.twoFactorEnabled ? 'text-emerald-400' : 'text-slate-400'
                              }`}
                            >
                              {user.twoFactorEnabled
                                ? t('dash.security.status_enabled')
                                : t('dash.security.status_disabled')}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{t('dash.security.totp_desc')}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onUserUpdate({ ...user, twoFactorEnabled: !user.twoFactorEnabled })}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-2 shrink-0 cursor-pointer ${
                          user.twoFactorEnabled
                            ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/25'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>
                          {user.twoFactorEnabled ? t('dash.security.disable_2fa') : t('dash.security.enable_2fa')}
                        </span>
                      </button>
                    </div>

                    {user.twoFactorEnabled ? (
                      <div className="space-y-3 text-xs">
                        <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                          <Check className="w-4 h-4" />
                          <span>{t('dash.security.layer2_active')}</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed">{t('dash.security.recovery_key_desc')}</p>
                        <div className="font-mono text-xs text-slate-200 bg-slate-950 px-3.5 py-2 rounded-lg border border-white/10 w-fit" dir="ltr">
                          {t('dash.security.recovery_key_label')} TGEX-8921-74GA
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2.5 text-xs">
                        <div className="text-amber-300 font-semibold">{t('dash.security.guide_title')}</div>
                        <ol className="list-decimal list-inside space-y-1.5 text-slate-400 leading-relaxed">
                          <li>{t('dash.security.guide_step1')}</li>
                          <li>{t('dash.security.guide_step2')}</li>
                          <li>{t('dash.security.guide_step3')}</li>
                        </ol>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 9: NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <div className="p-5 sm:p-6 rounded-2xl bg-[#0B0F17] border border-white/[0.08] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-400" />
                      <span>{t('dash.notifications.title')}</span>
                    </h2>
                    <span className="text-xs text-slate-400 font-mono tabular-nums">
                      {MOCK_ACTIVITIES.length} {isFa ? 'مورد' : 'items'}
                    </span>
                  </div>

                  <div className="divide-y divide-white/[0.06]">
                    {MOCK_ACTIVITIES.map((act) => (
                      <div key={act.id} className="py-3.5 first:pt-0 last:pb-0 space-y-1 text-xs">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold text-white">{act.title}</span>
                          <span className="text-[11px] text-slate-500 font-mono shrink-0">{act.timeAgo}</span>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed">{act.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 10: SUPPORT TICKETS */}
              {activeTab === 'support-tickets' && <UserSupportTicketsSection user={activeUser} />}

              {/* TAB 11: AD CANVAS */}
              {activeTab === 'ads' && <AdCanvasPage userId={user.id} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

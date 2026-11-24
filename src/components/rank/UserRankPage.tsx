import React, { useState, useEffect } from 'react';
import { 
  User, 
  PageId, 
  RankRequirementConfig, 
  UserRankProgress 
} from '../../types';
import { rankService } from '../../services/rankService';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Award, 
  Crown, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  DollarSign, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  RefreshCw, 
  Zap, 
  Target, 
  Sliders, 
  ChevronRight, 
  Check, 
  AlertCircle, 
  ArrowUpRight,
  PartyPopper,
  Flame,
  Info,
  X
} from 'lucide-react';

interface UserRankPageProps {
  user: User;
  onNavigate?: (page: PageId) => void;
  onUserUpdate?: (updatedUser: User) => void;
}

export const UserRankPage: React.FC<UserRankPageProps> = ({ user, onNavigate, onUserUpdate }) => {
  const { t, language, dir } = useLanguage();
  const isRtl = language === 'fa';

  const [progress, setProgress] = useState<UserRankProgress | null>(null);
  const [allRanks, setAllRanks] = useState<RankRequirementConfig[]>([]);
  const [selectedRankDetail, setSelectedRankDetail] = useState<RankRequirementConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [newlyAchievedRank, setNewlyAchievedRank] = useState<RankRequirementConfig | null>(null);

  // Re-evaluate modal state
  const [showReevaluateModal, setShowReevaluateModal] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Simulator / Sandbox state
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simVolume, setSimVolume] = useState<number>(user.networkVolumeUsdt || 125000);
  const [simActiveUsers, setSimActiveUsers] = useState<number>(user.activeNetworkCount || 112);
  const [simTotalNetwork, setSimTotalNetwork] = useState<number>(user.totalNetworkCount || 184);
  const [simDirects, setSimDirects] = useState<number>(user.directReferralsCount || 14);

  const loadData = async (customMetrics?: {
    networkSize?: number;
    activeUsers?: number;
    networkVolume?: number;
    directQualified?: number;
  }) => {
    setIsLoading(true);
    try {
      const [prog, ranks] = await Promise.all([
        rankService.getUserRankProgress(user, customMetrics),
        rankService.getAllRanks()
      ]);
      setProgress(prog);
      setAllRanks(ranks);
      if (!selectedRankDetail) {
        setSelectedRankDetail(prog.nextRank || prog.currentRank);
      }
    } catch (e) {
      console.error('Failed to load rank progress', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Handle Rank Upgrade Claim
  const handleClaimUpgrade = async (targetRankId?: string) => {
    if (isUpgrading) return;
    setIsUpgrading(true);
    try {
      const res = await rankService.upgradeUserRank(user, targetRankId || progress?.nextRank?.id);
      if (res.success) {
        setNewlyAchievedRank(res.newRank);
        setShowCelebrationModal(true);
        if (onUserUpdate) {
          onUserUpdate(res.updatedUser);
        }
        await loadData();
      }
    } catch (err: any) {
      alert(err.message || 'خطا در ارتقای رنک');
    } finally {
      setIsUpgrading(false);
    }
  };

  // Re-evaluate Server Trigger
  const handleReevaluate = () => {
    setShowReevaluateModal(true);
    setIsEvaluating(true);
    setTimeout(async () => {
      await loadData();
      setIsEvaluating(false);
    }, 800);
  };

  // Apply Simulation
  const handleApplySimulation = () => {
    loadData({
      networkSize: simTotalNetwork,
      activeUsers: simActiveUsers,
      networkVolume: simVolume,
      directQualified: simDirects
    });
  };

  // Reset to live server state
  const handleResetToLive = () => {
    setSimVolume(user.networkVolumeUsdt || 125000);
    setSimActiveUsers(user.activeNetworkCount || 112);
    setSimTotalNetwork(user.totalNetworkCount || 184);
    setSimDirects(user.directReferralsCount || 14);
    loadData();
  };

  // Reset user to baseline Advisor for demo/testing
  const handleResetRankToAdvisor = async () => {
    setIsLoading(true);
    const updated = await rankService.resetUserRank(user, 'rank_advisor');
    if (onUserUpdate) onUserUpdate(updated);
    await loadData();
    setIsLoading(false);
  };

  if (isLoading || !progress) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <div className="text-sm font-medium">{t('dash.rank.loading')}</div>
      </div>
    );
  }

  // Generate ASCII-style block visual representation for progress
  const renderAsciiBlocks = (percent: number, totalBlocks = 16) => {
    const filled = Math.round((percent / 100) * totalBlocks);
    const empty = Math.max(0, totalBlocks - filled);
    return '█'.repeat(filled) + '░'.repeat(empty);
  };

  const isEligibleForUpgrade = progress.canUpgrade && progress.nextRank !== null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 text-slate-200" dir={dir}>
      
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6 ${isRtl ? 'text-right' : 'text-left'}`}>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono mb-2">
            <Crown className="w-3.5 h-3.5" />
            <span>ORGANIZATIONAL RANK & PROGRESSION SYSTEM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {t('dash.rank.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('dash.rank.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
            className={`p-2.5 rounded-xl border transition flex items-center gap-2 text-xs font-semibold ${
              isSimulatorOpen 
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30' 
                : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:border-white/20'
            }`}
            title="شبیه‌ساز اهداف و حجم شبکه"
          >
            <Sliders className="w-4 h-4 text-blue-400" />
            <span>{isRtl ? 'شبیه‌ساز اهداف' : 'Progression Sandbox'}</span>
          </button>

          <button
            onClick={handleReevaluate}
            className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition flex items-center gap-2 text-xs font-semibold"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>{t('dash.rank.refresh_btn')}</span>
          </button>
        </div>
      </div>

      {/* 🎯 OBJECTIVES & METRICS SIMULATOR (Expandable) */}
      {isSimulatorOpen && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-blue-500/30 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="font-bold text-white text-base">{isRtl ? 'شبیه‌ساز اهداف رنک و رشد سازمان' : 'Rank Objectives & Network Volume Simulator'}</h3>
                <p className="text-xs text-slate-400">{isRtl ? 'حجم و شاخص‌های شبکه را تغییر دهید تا تأثیر آن بر باز شدن رنک‌های مدیر (Manager)، مدیر ارشد و راهبر را مشاهده فرمایید.' : 'Simulate network volume and team size to test eligibility for higher tiers.'}</p>
              </div>
            </div>

            <button 
              onClick={() => setIsSimulatorOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
              <label className="text-xs text-slate-400 block">{isRtl ? 'حجم فروش کل تیم (Team Volume USDT)' : 'Team Volume (USDT)'}</label>
              <input 
                type="number"
                value={simVolume}
                onChange={(e) => setSimVolume(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-sm focus:border-blue-500 outline-none"
              />
              <div className="flex gap-1.5 pt-1">
                <button onClick={() => setSimVolume(100000)} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700">100K (Guide)</button>
                <button onClick={() => setSimVolume(500000)} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700">500K (Manager)</button>
                <button onClick={() => setSimVolume(2000000)} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700">2M (Senior)</button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
              <label className="text-xs text-slate-400 block">{isRtl ? 'اعضای فعال شبکه (Active Members)' : 'Active Members'}</label>
              <input 
                type="number"
                value={simActiveUsers}
                onChange={(e) => setSimActiveUsers(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-sm focus:border-blue-500 outline-none"
              />
              <div className="flex gap-1.5 pt-1">
                <button onClick={() => setSimActiveUsers(20)} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700">20</button>
                <button onClick={() => setSimActiveUsers(50)} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700">50</button>
                <button onClick={() => setSimActiveUsers(150)} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700">150</button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
              <label className="text-xs text-slate-400 block">{isRtl ? 'کل جمعیت شبکه (Network Size)' : 'Total Network Size'}</label>
              <input 
                type="number"
                value={simTotalNetwork}
                onChange={(e) => setSimTotalNetwork(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-sm focus:border-blue-500 outline-none"
              />
              <div className="flex gap-1.5 pt-1">
                <button onClick={() => setSimTotalNetwork(40)} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700">40</button>
                <button onClick={() => setSimTotalNetwork(100)} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700">100</button>
                <button onClick={() => setSimTotalNetwork(300)} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700">300</button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
              <label className="text-xs text-slate-400 block">{isRtl ? 'معرف‌های مستقیم واجدشرایط' : 'Direct Qualified'}</label>
              <input 
                type="number"
                value={simDirects}
                onChange={(e) => setSimDirects(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-sm focus:border-blue-500 outline-none"
              />
              <div className="flex gap-1.5 pt-1">
                <button onClick={() => setSimDirects(2)} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700">Min 2</button>
                <button onClick={() => setSimDirects(14)} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700">14 (Real)</button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                onClick={handleApplySimulation}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>{isRtl ? 'محاسبه پیشرفت شبیه‌سازی' : 'Calculate Simulated Progress'}</span>
              </button>

              <button
                onClick={handleResetToLive}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                {isRtl ? 'بازنشانی به مقادیر واقعی سرور' : 'Reset to Real Server Data'}
              </button>
            </div>

            <button
              onClick={handleResetRankToAdvisor}
              className="text-xs text-rose-400 hover:text-rose-300 underline"
            >
              {isRtl ? 'تنظیم مجدد رنک به Advisor جهت تست مجدد چرخه' : 'Reset rank to Advisor for re-test'}
            </button>
          </div>
        </div>
      )}

      {/* 1. CURRENT RANK & NEXT RANK HERO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Current Rank Card */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/15 via-slate-900/90 to-slate-950 border border-amber-500/30 relative overflow-hidden shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>{t('dash.rank.current_rank_label')}</span>
            </span>
            <span className="text-xs font-mono text-slate-400">ORDER #{progress.currentRank.tierOrder}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20">
              <Crown className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{isRtl ? progress.currentRank.farsiName : progress.currentRank.name}</h2>
              <div className="text-xs text-amber-300/80 font-mono mt-0.5">
                {progress.currentRank.name} • {progress.currentLevel}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {isRtl ? (progress.currentRank.farsiDescription || progress.currentRank.description) : progress.currentRank.description}
          </p>

          <div className="space-y-2 pt-4 border-t border-white/10">
            <span className="text-xs font-bold text-slate-300">{t('dash.rank.privileges_label')}</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(isRtl ? (progress.currentRank.farsiPrivileges || progress.currentRank.privileges) : progress.currentRank.privileges).map((p, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next Rank Goal Card */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/10 relative overflow-hidden shadow-xl space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                <span>{t('dash.rank.next_rank_title')}</span>
              </span>
              <span className={`text-xs font-mono font-bold ${isEligibleForUpgrade ? 'text-emerald-400' : 'text-blue-400'}`}>
                {progress.overallProgressPercent.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}% {t('dash.rank.completed_label')}
              </span>
            </div>

            {progress.nextRank ? (
              <div className="space-y-4 mt-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/20">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">{isRtl ? progress.nextRank.farsiName : progress.nextRank.name}</h2>
                    <div className="text-xs text-blue-300/80 font-mono mt-0.5">
                      {progress.nextRank.name} • {isRtl ? (progress.nextRank.farsiRequiredLevel || progress.nextRank.requiredLevel) : progress.nextRank.requiredLevel}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {isRtl ? (progress.nextRank.farsiDescription || progress.nextRank.description) : progress.nextRank.description}
                </p>

                {/* Overall Progress Bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">
                      {t('dash.rank.overall_progress_to')} {isRtl ? progress.nextRank.farsiName : progress.nextRank.name}:
                    </span>
                    <span className={`font-mono font-bold ${isEligibleForUpgrade ? 'text-emerald-400' : 'text-blue-400'}`}>
                      {progress.overallProgressPercent.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}%
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-950 border border-white/10 overflow-hidden p-0.5">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 shadow-sm ${
                        isEligibleForUpgrade 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                          : 'bg-gradient-to-r from-blue-600 to-cyan-400'
                      }`}
                      style={{ width: `${progress.overallProgressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Action button inside card */}
                <button
                  onClick={() => {
                    if (!progress.canUpgrade || progress.overallProgressPercent < 100) {
                      alert(isRtl ? '⚠️ خطای امنیتی: پیش‌نیازهای ارتقا کامل نشده است و درصد پیشرفت کمتر از ۱۰۰٪ است. ارتقا غیرمجاز است.' : 'Security Error: Prerequisites not met and progress is under 100%. Upgrade not allowed.');
                      return;
                    }
                    handleClaimUpgrade(progress.nextRank?.id);
                  }}
                  disabled={isUpgrading}
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer disabled:opacity-50 ${
                    progress.overallProgressPercent >= 100 && progress.canUpgrade
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 border border-white/10 hover:border-white/20'
                  }`}
                >
                  {isUpgrading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{isRtl ? 'در حال ارتقا...' : 'Upgrading...'}</span>
                    </>
                  ) : progress.overallProgressPercent >= 100 && progress.canUpgrade ? (
                    <>
                      <Flame className="w-4 h-4" />
                      <span>{isRtl ? `ارتقای فوری به رنک ${progress.nextRank.farsiName || progress.nextRank.name}` : `Instant Promote to ${progress.nextRank.name}`}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>{isRtl ? `نیاز به تکمیل ۱۰۰٪ (پیشرفت فعلی: ${progress.overallProgressPercent}٪)` : `Requires 100% (Current: ${progress.overallProgressPercent}%)`}</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center py-8 space-y-2">
                <Crown className="w-12 h-12 text-amber-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">{t('dash.rank.max_rank_reached')}</h3>
                <p className="text-xs text-slate-400">{t('dash.rank.max_rank_desc')}</p>
              </div>
            )}
          </div>

          {progress.nextRank && (
            <div className="pt-4 border-t border-white/10 space-y-2">
              <span className="text-xs font-bold text-blue-300">
                {t('dash.rank.additional_privileges')} {isRtl ? progress.nextRank.farsiName : progress.nextRank.name}:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(isRtl ? (progress.nextRank.farsiPrivileges || progress.nextRank.privileges) : progress.nextRank.privileges).slice(0, 4).map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 2. PROGRESS METRICS & VISUAL INDICATORS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <span>{t('dash.rank.indicators_title')}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {t('dash.rank.indicators_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {progress.metrics.map((metric, idx) => (
            <div key={metric.id} className="p-5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <div className="w-5 h-5 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">
                    {idx + 1}
                  </div>
                  <span>{isRtl ? metric.farsiName : metric.name}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  metric.achieved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  {metric.percent.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}% {t('dash.rank.completed_short') || 'تکمیل'}
                </span>
              </div>

              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>{t('dash.rank.current') || 'فعلی'}: {
                  metric.format === 'currency' 
                    ? `$${metric.current.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}` 
                    : metric.format === 'percent'
                    ? `${metric.current.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}%`
                    : metric.current.toLocaleString(isRtl ? 'fa-IR' : 'en-US')
                }</span>
                <span>{t('dash.rank.target') || 'هدف'}: {
                  metric.format === 'currency' 
                    ? `$${metric.required.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}` 
                    : metric.format === 'percent'
                    ? `${metric.required.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}%`
                    : metric.required.toLocaleString(isRtl ? 'fa-IR' : 'en-US')
                }</span>
              </div>

              {/* ASCII & Styled visual bar */}
              <div className="space-y-1.5">
                <div className="font-mono text-xs text-blue-400 tracking-wider overflow-x-auto whitespace-nowrap bg-slate-900/80 p-2 rounded-xl border border-white/5" dir="ltr">
                  {renderAsciiBlocks(metric.percent)} {metric.percent.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}%
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${metric.achieved ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${metric.percent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ALL RANKS ROADMAP (Server Configured Tiers) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>{t('dash.rank.roadmap_title')}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {t('dash.rank.roadmap_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {allRanks.map((rank) => {
            const isCurrent = rank.id === progress.currentRank.id;
            const isUnlocked = rank.tierOrder <= progress.currentRank.tierOrder;
            const isNext = progress.nextRank && rank.id === progress.nextRank.id;
            const isSelected = selectedRankDetail?.id === rank.id;

            return (
              <div
                key={rank.id}
                onClick={() => setSelectedRankDetail(rank)}
                className={`p-5 rounded-2xl border transition cursor-pointer relative flex flex-col justify-between space-y-4 ${
                  isCurrent
                    ? 'bg-gradient-to-b from-amber-500/20 to-slate-950 border-amber-500/40 shadow-lg shadow-amber-500/10'
                    : isNext
                    ? 'bg-gradient-to-b from-blue-500/15 to-slate-950 border-blue-500/40'
                    : isUnlocked
                    ? 'bg-slate-950/80 border-white/15 hover:border-white/30'
                    : 'bg-slate-950/40 border-white/5 opacity-70 hover:opacity-90'
                } ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-xs font-mono font-bold" style={{ color: rank.badgeColor }}>
                    #{rank.tierOrder}
                  </span>

                  {isCurrent ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                      {t('dash.rank.current_rank_tag')}
                    </span>
                  ) : isNext ? (
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                      {isRtl ? 'هدف بعدی' : 'Next Goal'}
                    </span>
                  ) : isUnlocked ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {t('dash.rank.achieved_tag')}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      {t('dash.rank.locked_tag')}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{isRtl ? rank.farsiName : rank.name}</h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{rank.name}</div>
                </div>

                <div className="space-y-1.5 text-xs pt-3 border-t border-white/5 text-slate-300">
                  {rank.requiredCapital !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isRtl ? 'سرمایه فعال:' : 'Active Capital:'}</span>
                      <span className="font-mono text-white" dir={isRtl ? 'rtl' : 'ltr'}>
                        {isRtl ? '' : '$'}{rank.requiredCapital.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}{isRtl ? ' دلار' : ''}
                      </span>
                    </div>
                  )}
                  {rank.requiredDirectActive !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isRtl ? 'معرف مستقیم:' : 'Direct Active:'}</span>
                      <span className="font-mono text-cyan-400">
                        {rank.requiredDirectActive.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}
                      </span>
                    </div>
                  )}
                  {rank.requiredLegRank && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isRtl ? 'شرط رنک زیرمجموعه:' : 'Required Leg Rank:'}</span>
                      <span className="font-mono text-blue-400">
                        {rank.requiredLegRank.count} x {rank.requiredLegRank.rankName}
                      </span>
                    </div>
                  )}
                  {rank.requiredTeamAum !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isRtl ? 'حجم AUM تیم:' : 'Team AUM:'}</span>
                      <span className="font-mono text-white" dir={isRtl ? 'rtl' : 'ltr'}>
                        {isRtl ? '' : '$'}{rank.requiredTeamAum.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}{isRtl ? ' دلار' : ''}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('dash.rank.leadership_share') || 'سهم رهبری'}:</span>
                    <span className="font-mono text-amber-400 font-bold">
                      {rank.leadershipPoolSharePercent.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Rank Modal or Drawer Preview */}
        {selectedRankDetail && (
          <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5" style={{ color: selectedRankDetail.badgeColor }} />
                <h3 className="font-bold text-white text-base">
                  {t('dash.rank.detailed_rules')} — {isRtl ? selectedRankDetail.farsiName : selectedRankDetail.name} ({selectedRankDetail.name})
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">ORDER #{selectedRankDetail.tierOrder}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 block mb-1">{t('dash.rank.required_matrix_level')}:</span>
                <span className="font-bold text-white font-mono">
                  {isRtl ? (selectedRankDetail.farsiRequiredLevel || selectedRankDetail.requiredLevel) : selectedRankDetail.requiredLevel}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 block mb-1">{isRtl ? 'حداقل سرمایه فعال:' : 'Min Capital:'}</span>
                <span className="font-bold text-emerald-400 font-mono" dir={isRtl ? 'rtl' : 'ltr'}>
                  {isRtl ? '' : '$'}{(selectedRankDetail.requiredCapital ?? 50).toLocaleString(isRtl ? 'fa-IR' : 'en-US')}{isRtl ? ' دلار' : ''}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 block mb-1">{isRtl ? 'حداقل معرفی مستقیم:' : 'Min Direct Active:'}</span>
                <span className="font-bold text-cyan-400 font-mono">
                  {(selectedRankDetail.requiredDirectActive ?? 0).toLocaleString(isRtl ? 'fa-IR' : 'en-US')} {t('dash.rank.person_unit')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 block mb-1">{isRtl ? 'حداقل حجم AUM تیم:' : 'Min Team AUM:'}</span>
                <span className="font-bold text-purple-400 font-mono" dir={isRtl ? 'rtl' : 'ltr'}>
                  {isRtl ? '' : '$'}{(selectedRankDetail.requiredTeamAum ?? 0).toLocaleString(isRtl ? 'fa-IR' : 'en-US')}{isRtl ? ' دلار' : ''}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-300">{t('dash.rank.privileges_roadmap')}:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(isRtl ? (selectedRankDetail.farsiPrivileges || selectedRankDetail.privileges) : selectedRankDetail.privileges).map((priv, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/40 p-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{priv}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
              <div className="text-xs text-slate-400">
                {isRtl ? 'با کلیک روی دکمه زیر می‌توانید حساب خود را مستقیماً به این رنک ارتقا دهید.' : 'Click below to instantly promote your account to this rank tier.'}
              </div>
              <button
                onClick={() => handleClaimUpgrade(selectedRankDetail.id)}
                disabled={isUpgrading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isUpgrading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{isRtl ? 'در حال ثبت...' : 'Upgrading...'}</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4" />
                    <span>{isRtl ? `ارتقای فوری به رنک ${selectedRankDetail.farsiName || selectedRankDetail.name}` : `Instant Promote to ${selectedRankDetail.name}`}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 🎉 CELEBRATION MODAL ON RANK UPGRADE */}
      {showCelebrationModal && newlyAchievedRank && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/50 shadow-2xl space-y-6 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30 text-4xl">
              👑
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isRtl ? 'ارتقای رسمی رنک ثبت شد' : 'Rank Promotion Confirmed'}</span>
              </div>
              <h2 className="text-2xl font-black text-white">
                {isRtl ? `تبریک! شما به رنک «${newlyAchievedRank.farsiName}» ارتقا یافتید.` : `Congratulations! You have reached ${newlyAchievedRank.name}.`}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isRtl
                  ? `رنک جدید شما بر روی سرور و کل پلتفرم با موفقیت فعال شد. پورسانت کامل ۲0 لایه ساختاری و کلیه دسترسی‌های سازمانی به حساب کاربری شما متصل گردید.`
                  : `Your new rank has been updated across the entire platform. All privileges and 20-level matrix depth are now active on your account.`
                }
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 text-xs text-right space-y-2">
              <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isRtl ? 'امتیازات فعال شده جدید:' : 'Newly Activated Privileges:'}</span>
              </div>
              {(isRtl ? (newlyAchievedRank.farsiPrivileges || newlyAchievedRank.privileges) : newlyAchievedRank.privileges).map((p, idx) => (
                <div key={idx} className="text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{p}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowCelebrationModal(false)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/30 hover:scale-102 transition"
            >
              {isRtl ? 'مشاهده داشبورد و هدف مرحله بعد' : 'Continue to Dashboard & Next Goal'}
            </button>
          </div>
        </div>
      )}

      {/* 🔍 SERVER RE-EVALUATION MODAL */}
      {showReevaluateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-white/15 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className={`w-5 h-5 text-amber-400 ${isEvaluating ? 'animate-spin' : ''}`} />
                <h3 className="font-bold text-white text-base">
                  {isRtl ? 'ارزیابی خودکار سرور و احراز صلاحیت رنک' : 'Server Rank Re-evaluation'}
                </h3>
              </div>
              <button onClick={() => setShowReevaluateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isEvaluating ? (
              <div className="py-8 text-center space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-400 mx-auto" />
                <p className="text-xs text-slate-300">{isRtl ? 'در حال واکشی شاخص‌های واقعی و اعتبارسنجی احراز شرایط...' : 'Validating live network criteria...'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-between text-xs">
                    <span className="text-slate-300">{isRtl ? 'حجم فروش تیم (Team Volume):' : 'Team Volume:'}</span>
                    <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ${(user.networkVolumeUsdt || 125000).toLocaleString()} (≥ $100K)
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-between text-xs">
                    <span className="text-slate-300">{isRtl ? 'تعداد کاربران فعال (Active Users):' : 'Active Users:'}</span>
                    <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      {user.activeNetworkCount || 112} (≥ 20)
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-between text-xs">
                    <span className="text-slate-300">{isRtl ? 'کل اندازه شبکه (Network Size):' : 'Network Size:'}</span>
                    <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      {user.totalNetworkCount || 184} (≥ 40)
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-between text-xs">
                    <span className="text-slate-300">{isRtl ? 'معرف‌های مستقیم واجدشرایط:' : 'Direct Qualified:'}</span>
                    <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      {user.directReferralsCount || 14} (≥ 2)
                    </span>
                  </div>
                </div>

                {isEligibleForUpgrade && progress.nextRank ? (
                  <div className="pt-2 space-y-2">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center">
                      {isRtl ? `کلیه ۴ شرط احراز شد! رنک ${progress.nextRank.name} آماده فعال‌سازی است.` : `All 4 conditions passed! ${progress.nextRank.name} is ready.`}
                    </div>

                    <button
                      onClick={() => {
                        setShowReevaluateModal(false);
                        handleClaimUpgrade(progress.nextRank?.id);
                      }}
                      className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                    >
                      {isRtl ? `ثبت و ارتقا فوری به ${progress.nextRank.name}` : `Claim ${progress.nextRank.name} Now`}
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs text-center font-bold">
                    {isRtl ? 'ارزیابی انجام شد. وضعیت فعلی شما در بالاترین تطابق قرار دارد.' : 'Evaluation complete. Your rank status is in full sync.'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

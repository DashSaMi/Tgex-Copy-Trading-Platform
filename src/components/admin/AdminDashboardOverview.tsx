import React, { useState, useEffect } from 'react';
import { 
  AdminKPISummary, 
  TopUserAdminItem, 
  TopNetworkAdminItem, 
  AdminActivityItem, 
  AdminTab 
} from '../../types';
import { adminService } from '../../services/adminService';
import { databaseService } from '../../services/db/databaseService';
import { 
  Users, 
  UserCheck, 
  ShieldCheck, 
  Clock, 
  Network, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Award, 
  Layers, 
  Activity, 
  ArrowUpRight, 
  RefreshCw, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  BarChart3,
  PieChart as PieIcon,
  Database,
  Download,
  Copy,
  Check,
  X
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';

interface AdminDashboardOverviewProps {
  onSwitchTab: (tab: AdminTab) => void;
  onSelectUser?: (userId: string) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  onSwitchTab,
  onSelectUser
}) => {
  const [kpis, setKpis] = useState<AdminKPISummary | null>(null);
  const [chartsData, setChartsData] = useState<any>(null);
  const [topUsers, setTopUsers] = useState<TopUserAdminItem[]>([]);
  const [topNetworks, setTopNetworks] = useState<TopNetworkAdminItem[]>([]);
  const [activities, setActivities] = useState<AdminActivityItem[]>([]);
  const [activeChartTab, setActiveChartTab] = useState<'growth' | 'profit' | 'ranks' | 'levels'>('growth');
  const [isLoading, setIsLoading] = useState(true);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const sqlScript = databaseService.generateMySqlExportScript();

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([sqlScript], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tgex_database_cpanel_export_${new Date().toISOString().slice(0, 10)}.sql`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadDashboardData();
    const handleDbUpdate = () => {
      loadDashboardData();
    };
    window.addEventListener('tgex_database_updated', handleDbUpdate);
    window.addEventListener('tgex_db_updated', handleDbUpdate);
    return () => {
      window.removeEventListener('tgex_database_updated', handleDbUpdate);
      window.removeEventListener('tgex_db_updated', handleDbUpdate);
    };
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [kpiRes, chartsRes, usersRes, netRes, actRes] = await Promise.all([
        adminService.getDashboardKPIs(),
        adminService.getDashboardCharts(),
        adminService.getTopUsers(),
        adminService.getTopNetworks(),
        adminService.getRecentActivities()
      ]);
      setKpis(kpiRes);
      setChartsData(chartsRes);
      setTopUsers(usersRes);
      setTopNetworks(netRes);
      setActivities(actRes);
    } catch (e) {
      console.error('Failed to load admin overview data', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !kpis || !chartsData) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <div className="text-sm font-medium">
          در حال واکشی متریک‌های کلان سرور و تولید ماتریس گزارش‌ها...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 text-slate-200">
      
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>نظارت هوشمند و مدیریت متمرکز پلتفرم</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            داشبورد مدیریت کلان سیستم (Tgex Admin Control)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            نظارت بلادرنگ بر رشد کاربران، جریان مالی، ساختار ماتریسی ۲۰ سطحی و احراز هویت‌های هویتی.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowSqlModal(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold transition flex items-center gap-2"
            title="تولید اسکریپت SQL برای ساخت دیتابیس در cPanel / phpMyAdmin"
          >
            <Database className="w-4 h-4 text-amber-400" />
            <span>خروجی MySQL (سی‌پنل)</span>
          </button>
          <button
            onClick={loadDashboardData}
            className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition flex items-center gap-2 text-xs"
            title="به‌روزرسانی داده‌ها"
          >
            <RefreshCw className="w-4 h-4" />
            <span>بروزرسانی</span>
          </button>
          <button
            onClick={() => onSwitchTab('users')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>مدیریت کاربران</span>
          </button>
        </div>
      </div>

      {/* 1. TOP 8 KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Users */}
        <div 
          onClick={() => onSwitchTab('users')}
          className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-blue-500/40 transition cursor-pointer space-y-3 shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              مجموع کل کاربران (Total Users)
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono" dir="ltr">
            {(kpis.totalUsers ?? 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{kpis.userGrowthPercent ?? 0}% رشد این ماه</span>
          </div>
        </div>

        {/* KPI 2: Active Users */}
        <div 
          onClick={() => onSwitchTab('users')}
          className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-emerald-500/40 transition cursor-pointer space-y-3 shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              کاربران فعال معامله‌گر (Active Users)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono" dir="ltr">
            {(kpis.activeUsers ?? 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            {kpis.totalUsers ? Math.round(((kpis.activeUsers ?? 0) / kpis.totalUsers) * 100) : 100}% نرخ فعالیت کلی پلتفرم
          </div>
        </div>

        {/* KPI 3: Active Verified Accounts */}
        <div 
          onClick={() => onSwitchTab('users')}
          className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-emerald-500/40 transition cursor-pointer space-y-3 shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              حساب‌های فعال و تایید شده
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono" dir="ltr">
            {(kpis.approvedKyc ?? 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
            <span>فعال با دسترسی کامل به معاملات</span>
          </div>
        </div>

        {/* KPI 4: Pending Withdrawals */}
        <div 
          onClick={() => onSwitchTab('withdrawals')}
          className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-amber-500/40 transition cursor-pointer space-y-3 shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              درخواست‌های تسویه و برداشت
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono" dir="ltr">
            {(kpis.pendingWithdrawals ?? 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            تسویه‌های پاداش و کمیسیون شبکه
          </div>
        </div>

        {/* KPI 5: Total Network */}
        <div 
          onClick={() => onSwitchTab('network')}
          className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-purple-500/40 transition cursor-pointer space-y-3 shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              گره‌های شبکه ماتریس (Total Network)
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition">
              <Network className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-300 font-mono" dir="ltr">
            {(kpis.totalNetworkCount ?? 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{kpis.networkGrowthPercent ?? 0}% نرخ گسترش شبکه</span>
          </div>
        </div>

        {/* KPI 6: Total Network Profit */}
        <div 
          onClick={() => onSwitchTab('commissions')}
          className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-emerald-500/40 transition cursor-pointer space-y-3 shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              سود خالص شبکه (Total Profit)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono" dir="ltr">
            ${(kpis.totalNetworkProfitUsdt ?? 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            حجم سود حاصل از کپی تریدینگ و اسپرد
          </div>
        </div>

        {/* KPI 7: Total Commission Paid */}
        <div 
          onClick={() => onSwitchTab('commissions')}
          className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-blue-500/40 transition cursor-pointer space-y-3 shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              کل پورسانت پرداختی (Total Commission)
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono" dir="ltr">
            ${(kpis.totalCommissionPaidUsdt ?? 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            توزیع شده بین ۲۰ لایه و معرفین
          </div>
        </div>

        {/* KPI 8: Current Month */}
        <div 
          onClick={() => onSwitchTab('commissions')}
          className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-amber-500/40 transition cursor-pointer space-y-3 shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              ماه جاری (Current Month)
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono" dir="ltr">
            ${(kpis.currentMonthUsdt ?? 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-400 font-medium">
            دوره تسویه فعال و جاری
          </div>
        </div>

      </div>

      {/* 2. CHARTS SECTION (User Growth, Network Growth, Profit, Commission, KYC, Rank Distribution, 20-Level) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <span>
                تحلیل آماری و نمودارهای کلان (System Analytics & Distributions)
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              بررسی آماری رشد، سودآوری، وضعیت احراز هویت و توزیع رتبه‌ها
            </p>
          </div>

          <div className="flex flex-wrap rounded-2xl bg-slate-950 p-1 border border-white/10 text-xs">
            <button
              onClick={() => setActiveChartTab('growth')}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeChartTab === 'growth' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              رشد کاربران و شبکه
            </button>
            <button
              onClick={() => setActiveChartTab('profit')}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeChartTab === 'profit' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              سود و کارمزد
            </button>
            <button
              onClick={() => setActiveChartTab('ranks')}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeChartTab === 'ranks' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              توزیع رتبه‌ها
            </button>
            <button
              onClick={() => setActiveChartTab('levels')}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeChartTab === 'levels' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              توزیع ۲۰ سطح
            </button>
          </div>
        </div>

        {/* Chart 1: User & Network Growth */}
        {activeChartTab === 'growth' && (
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartsData.userAndNetworkGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsersAdmin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNetworkAdmin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#ffffff20', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [Number(val).toLocaleString(), '']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area 
                  type="monotone" 
                  dataKey="network" 
                  name="حجم شبکه ماتریس (Network Growth)" 
                  stroke="#a855f7" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorNetworkAdmin)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  name="تعداد کل کاربران (User Growth)" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorUsersAdmin)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Chart 2: Profit & Commission */}
        {activeChartTab === 'profit' && (
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartsData.userAndNetworkGrowth} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProfitAdmin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#ffffff20', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()} USDT`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  name="سود کل شبکه (Profit)" 
                  stroke="#10b981" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorProfitAdmin)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="commission" 
                  name="کل پورسانت توزیع شده (Commission)" 
                  stroke="#f59e0b" 
                  strokeWidth={2} 
                  fill="transparent" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Chart 4: Rank Distribution */}
        {activeChartTab === 'ranks' && (
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartsData.rankDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="rank" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#ffffff20', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`${Number(val).toLocaleString()} کاربر`, 'جمعیت']}
                />
                <Bar dataKey="users" name="تعداد کاربران این رتبه" radius={[6, 6, 0, 0]}>
                  {chartsData.rankDistribution.map((entry: any, index: number) => (
                    <Cell key={`bar-rank-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Chart 5: 20 Levels Distribution */}
        {activeChartTab === 'levels' && (
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartsData.level20Distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="level" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#ffffff20', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any, name: any) => [
                    name === 'users' ? `${Number(val).toLocaleString()} کاربر` : `$${Number(val).toLocaleString()} USDT`,
                    name === 'users' ? 'تعداد کاربران' : 'پورسانت کل'
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="users" name="کاربران سطح" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="commissionUsdt" name="پورسانت لایه (USDT)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>

      {/* 3. TOP USERS & TOP NETWORKS TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Users Table */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>برترین کاربران پلتفرم (Top Users Leaderboard)</span>
            </h3>
            <button 
              onClick={() => onSwitchTab('users')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              مشاهده همه
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-white/10">
                <tr>
                  <th className="py-3 px-3">نام و مشخصات</th>
                  <th className="py-3 px-3">رتبه سازمانی</th>
                  <th className="py-3 px-3">شبکه</th>
                  <th className="py-3 px-3">سود تولیدی</th>
                  <th className="py-3 px-3">پورسانت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {topUsers.map((u) => (
                  <tr 
                    key={u.id} 
                    onClick={() => onSelectUser && onSelectUser(u.id)}
                    className="hover:bg-slate-800/30 transition cursor-pointer"
                  >
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">@{u.username}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-bold">
                        {u.rank}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-cyan-400 font-bold">{u.network}</td>
                    <td className="py-3 px-3 font-mono text-emerald-400" dir="ltr">${u.profit.toLocaleString()}</td>
                    <td className="py-3 px-3 font-mono font-bold text-white" dir="ltr">${u.commission.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Networks Table */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Network className="w-4 h-4 text-purple-400" />
              <span>بزرگترین شبکه‌های تیمی (Top Networks)</span>
            </h3>
            <button 
              onClick={() => onSwitchTab('network')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              تحلیل ماتریس
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-white/10">
                <tr>
                  <th className="py-3 px-3">سرشاخه / لیدر</th>
                  <th className="py-3 px-3">حجم شبکه</th>
                  <th className="py-3 px-3">اعضای فعال</th>
                  <th className="py-3 px-3">سود تیمی</th>
                  <th className="py-3 px-3">پورسانت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {topNetworks.map((net) => (
                  <tr 
                    key={net.id}
                    onClick={() => onSelectUser && onSelectUser(net.id)}
                    className="hover:bg-slate-800/30 transition cursor-pointer"
                  >
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{net.userName}</div>
                      <div className="text-[10px] text-purple-400 font-mono">
                        حامی: {net.sponsorName}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-purple-300 font-bold">{net.networkSize} کاربر</td>
                    <td className="py-3 px-3 font-mono text-cyan-400">{net.activeUsers} فعال</td>
                    <td className="py-3 px-3 font-mono text-emerald-400" dir="ltr">${net.generatedProfit.toLocaleString()}</td>
                    <td className="py-3 px-3 font-mono font-bold text-white" dir="ltr">${net.commission.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* 4. RECENT ACTIVITY FEED (New User, KYC submitted, KYC approved, Rank changed, Commission generated, Admin action) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <span>رویدادها و فعالیت‌های اخیر سیستم (Live Activity Stream)</span>
          </h2>
          <button
            onClick={() => onSwitchTab('audit-logs')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            مشاهده کامل گزارشات امنیتی (Audit Logs)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((act) => (
            <div key={act.id} className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span 
                  className="px-2.5 py-0.5 rounded-md font-bold text-[10px] border border-white/10"
                  style={{ color: act.badgeColor, backgroundColor: `${act.badgeColor}15` }}
                >
                  {act.title}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{act.timestamp}</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">{act.description}</p>
              {act.user && (
                <div className="text-[11px] text-slate-400 pt-1 border-t border-white/5 flex items-center justify-between">
                  <span>کاربر: {act.user}</span>
                  {act.userId && <span className="font-mono text-[10px] text-blue-400">{act.userId}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MYSQL CPANEL EXPORT MODAL */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/15 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    اسکریپت دیتابیس MySQL جهت بارگذاری در cPanel / phpMyAdmin
                  </h3>
                  <p className="text-xs text-slate-400">
                    ساختار جداول رابطه‌ای، شاخص‌ها و مقادیر ذخیره‌شده ۹ کاربر فعال و تاریخچه تراکنش‌ها
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowSqlModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Instructions */}
            <div className="p-4 bg-amber-950/20 border-b border-amber-500/20 text-xs text-amber-300/90 leading-relaxed flex items-start gap-2">
              <div className="p-1 rounded bg-amber-500/20 text-amber-400 font-bold shrink-0">
                راهنما:
              </div>
              <div>
                برای هاستینگ در سی‌پنل (cPanel)، وارد بخش MySQL Database Wizard شده و نام دیتابیس و یوزر را بسازید. سپس وارد phpMyAdmin شده، دیتابیس را انتخاب و در تب SQL یا Import این اسکریپت را اجرا نمایید.
              </div>
            </div>

            {/* SQL Code Preview */}
            <div className="p-4 flex-1 overflow-auto bg-slate-950 font-mono text-[11px] text-slate-300 leading-relaxed" dir="ltr">
              <pre className="whitespace-pre-wrap">{sqlScript}</pre>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-white/10 bg-slate-950/60 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                تعداد کل رکوردهای آماده انتقال: ۹ کاربر واقعی
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopySql}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-2 border border-white/10"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">کپی شد!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>کپی اسکریپت SQL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadSql}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-amber-600/20"
                >
                  <Download className="w-4 h-4" />
                  <span>دانلود فایل database.sql</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  User, 
  PageId, 
  EarningsSummary, 
  EarningsSourceBreakdownItem, 
  LevelEarningsItem, 
  EarningsTransaction, 
  MonthlyEarningsTrendItem,
  EarningsSourceType 
} from '../../types';
import { earningsService } from '../../services/earningsService';
import { useLanguage } from '../../context/LanguageContext';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Users, 
  Award, 
  Download, 
  Filter, 
  Search, 
  ArrowUpRight, 
  ShieldCheck,
  Zap,
  BarChart3,
  PieChart as PieIcon,
  RefreshCw
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

interface UserEarningsPageProps {
  user: User;
  onNavigate?: (page: PageId) => void;
}

export const UserEarningsPage: React.FC<UserEarningsPageProps> = ({ user, onNavigate }) => {
  const { t, language, dir } = useLanguage();
  const isRtl = language === 'fa';
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [sources, setSources] = useState<EarningsSourceBreakdownItem[]>([]);
  const [levelDistribution, setLevelDistribution] = useState<LevelEarningsItem[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyEarningsTrendItem[]>([]);
  const [transactions, setTransactions] = useState<EarningsTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeChartTab, setActiveChartTab] = useState<'monthly' | 'sources' | 'levels'>('monthly');

  useEffect(() => {
    loadData();

    const handleDbUpdate = () => {
      loadData();
    };

    window.addEventListener('tgex_database_updated', handleDbUpdate);
    window.addEventListener('tgex_db_updated', handleDbUpdate);
    window.addEventListener('tgex_withdrawals_updated', handleDbUpdate);

    return () => {
      window.removeEventListener('tgex_database_updated', handleDbUpdate);
      window.removeEventListener('tgex_db_updated', handleDbUpdate);
      window.removeEventListener('tgex_withdrawals_updated', handleDbUpdate);
    };
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [sum, src, dist, trend, txs] = await Promise.all([
        earningsService.getEarningsSummary(user),
        earningsService.getEarningsSourcesBreakdown(user),
        earningsService.get20LevelDistribution(user),
        earningsService.getMonthlyTrend(user),
        earningsService.getTransactions(user)
      ]);
      setSummary(sum);
      setSources(src);
      setLevelDistribution(dist);
      setMonthlyTrend(trend);
      setTransactions(txs);
    } catch (e) {
      console.error('Failed to load earnings data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = 
      tx.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.profitSource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.txHash && tx.txHash.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSource = selectedSource === 'all' || tx.source === selectedSource;
    const matchesStatus = selectedStatus === 'all' || tx.status === selectedStatus;

    return matchesSearch && matchesSource && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Source', 'User', 'Level', 'Profit Source', 'Commission Rate', 'Amount (USDT)', 'Status'];
    const rows = filteredTransactions.map(t => [
      t.id,
      t.date,
      t.sourceLabel,
      `${t.user.name} (@${t.user.username})`,
      t.level,
      `"${t.profitSource}"`,
      t.commissionRate,
      t.amount,
      t.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tgex_earnings_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading || !summary) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <div className="text-sm font-medium">{t('dash.earnings.loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 text-slate-200" dir={dir}>
      
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SERVER-VALIDATED FINANCIAL ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {t('dash.earnings.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('dash.earnings.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition flex items-center gap-2 text-xs"
            title={t('dash.earnings.refresh_btn')}
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">{t('dash.earnings.refresh_btn')}</span>
          </button>
          <button
            onClick={exportCSV}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{t('dash.earnings.export_btn')}</span>
          </button>
        </div>
      </div>

      {/* 1. SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Earnings */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-600/20 via-slate-900/80 to-slate-950 border border-blue-500/30 space-y-3 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-300 font-medium">{t('dash.earnings.total_label')}</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono" dir="ltr">
            {summary.totalEarningsUsdt.toFixed(2)} USDT
          </div>
          <div className="text-[11px] text-blue-400 flex items-center gap-1 font-mono">
            <span>{t('dash.earnings.klix_sync')}</span>
          </div>
        </div>

        {/* Current Month */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">{t('dash.earnings.current_month')}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono" dir="ltr">
            {summary.currentMonthUsdt.toFixed(2)} USDT
          </div>
          <div className="text-[11px] text-slate-400">
            {t('dash.earnings.ready_to_withdraw')}
          </div>
        </div>

        {/* Previous Month */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">{t('dash.earnings.previous_month')}</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-200 font-mono" dir="ltr">
            {summary.previousMonthUsdt.toFixed(2)} USDT
          </div>
          <div className="text-[11px] text-slate-400">
            {t('dash.earnings.settled')}
          </div>
        </div>

        {/* Pending */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">{t('dash.earnings.pending_label')}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono" dir="ltr">
            {summary.pendingUsdt.toFixed(2)} USDT
          </div>
          <div className="text-[11px] text-amber-300/80">
            {t('dash.earnings.pending_desc')}
          </div>
        </div>

        {/* Paid */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">{t('dash.earnings.paid_label')}</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono" dir="ltr">
            {summary.paidUsdt.toFixed(2)} USDT
          </div>
          <div className="text-[11px] text-slate-400">
            {t('dash.earnings.paid_desc')}
          </div>
        </div>
      </div>

      {/* 2. CHARTS SECTION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <span>{t('dash.earnings.chart_title')}</span>
            </h2>
            <p className="text-xs text-slate-400">{t('dash.earnings.chart_desc')}</p>
          </div>

          <div className="flex rounded-2xl bg-slate-950 p-1 border border-white/10 text-xs">
            <button
              onClick={() => setActiveChartTab('monthly')}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeChartTab === 'monthly' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('dash.earnings.tab_monthly')}
            </button>
            <button
              onClick={() => setActiveChartTab('sources')}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeChartTab === 'sources' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('dash.earnings.tab_sources')}
            </button>
            <button
              onClick={() => setActiveChartTab('levels')}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeChartTab === 'levels' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('dash.earnings.tab_levels')}
            </button>
          </div>
        </div>

        {/* Chart 1: Monthly Trend */}
        {activeChartTab === 'monthly' && (
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#ffffff20', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()} USDT`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="total" name={t('dash.earnings.chart_total')} stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="network" name={t('dash.earnings.chart_network')} stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorNetwork)" />
                <Area type="monotone" dataKey="direct" name={t('dash.earnings.chart_direct')} stroke="#10b981" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Chart 2: Sources Breakdown */}
        {activeChartTab === 'sources' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sources}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="amountUsdt"
                    nameKey="label"
                  >
                    {sources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#05070a" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#ffffff20', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                    formatter={(val: any) => [`$${Number(val).toLocaleString()} USDT`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {sources.map((item) => (
                <div key={item.id} className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <div>
                      <div className="font-bold text-white">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{t('dash.earnings.source_tx_count').replace('{count}', item.count.toLocaleString(isRtl ? 'fa-IR' : 'en-US'))}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-white" dir="ltr">${item.amountUsdt.toLocaleString()} USDT</div>
                    <div className="text-[10px] text-blue-400 font-mono font-bold">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chart 3: 20 Levels Distribution */}
        {activeChartTab === 'levels' && (
          <div className="space-y-4 pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={levelDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="levelLetter" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#ffffff20', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                    formatter={(val: any, name: any) => [`$${Number(val).toLocaleString()} USDT`, t('dash.earnings.earned_label')]}
                    labelFormatter={(label) => t('dash.earnings.matrix_level_label').replace('{label}', label)}
                  />
                  <Bar dataKey="amountUsdt" name={t('common.commission')} fill="#3b82f6" radius={[6, 6, 0, 0]}>
                    {levelDistribution.map((entry, index) => (
                      <Cell 
                        key={`bar-${index}`} 
                        fill={entry.amountUsdt > 0 ? '#3b82f6' : '#1e293b'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              {t('dash.earnings.matrix_level_desc')}
            </p>
          </div>
        )}

      </div>

      {/* 3. EARNINGS SOURCES CARDS (Direct, Network, Levels A-T, Copy-Trading, Leadership) */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-400" />
          <span>{t('dash.earnings.sources_title')}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Direct Referrals Card */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-white text-sm">{t('dash.earnings.direct_referrals_title')}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold">
                {t('dash.earnings.direct_referrals_rate')}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t('dash.earnings.direct_referrals_desc')}
            </p>
            <div className="flex justify-between items-end pt-2 border-t border-white/5">
              <span className="text-xs text-slate-400">{t('dash.earnings.earned_label')}</span>
              <span className="font-mono text-base font-bold text-white" dir="ltr">$2,950 USDT</span>
            </div>
          </div>

          {/* Network Structure Card */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">{t('dash.earnings.matrix_20_title')}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold">
                {t('dash.earnings.levels_range')}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t('dash.earnings.matrix_20_desc')}
            </p>
            <div className="flex justify-between items-end pt-2 border-t border-white/5">
              <span className="text-xs text-slate-400">{t('dash.earnings.earned_label')}</span>
              <span className="font-mono text-base font-bold text-cyan-400" dir="ltr">$3,480 USDT</span>
            </div>
          </div>

          {/* Copy-Trading Performance Fee Card */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">{t('dash.earnings.copy_trading_title')}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                Performance Fee
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t('dash.earnings.copy_trading_desc')}
            </p>
            <div className="flex justify-between items-end pt-2 border-t border-white/5">
              <span className="text-xs text-slate-400">{t('dash.earnings.earned_label')}</span>
              <span className="font-mono text-base font-bold text-emerald-400" dir="ltr">$1,240 USDT</span>
            </div>
          </div>

          {/* Leadership Rank Pool Card */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-sm">{t('dash.earnings.rank_pool_title')}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                Gold Leader Share
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t('dash.earnings.rank_pool_desc')}
            </p>
            <div className="flex justify-between items-end pt-2 border-t border-white/5">
              <span className="text-xs text-slate-400">{t('dash.earnings.earned_label')}</span>
              <span className="font-mono text-base font-bold text-amber-400" dir="ltr">$580 USDT</span>
            </div>
          </div>

          {/* Fast Start Bonus Card */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-white text-sm">{t('dash.earnings.fast_start_title')}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold">
                Challenge
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t('dash.earnings.fast_start_desc')}
            </p>
            <div className="flex justify-between items-end pt-2 border-t border-white/5">
              <span className="text-xs text-slate-400">{t('dash.earnings.earned_label')}</span>
              <span className="font-mono text-base font-bold text-purple-400" dir="ltr">$200 USDT</span>
            </div>
          </div>

          {/* 20 Levels Quick Access */}
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-dashed border-white/20 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="font-bold text-white text-sm">{t('dash.earnings.view_matrix_btn')}</h3>
              <p className="text-xs text-slate-400 mt-1">
                {t('dash.lock.levels_desc')}
              </p>
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate('dashboard-levels')}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <span>{t('dash.earnings.view_matrix_btn')}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 4. TRANSACTION TABLE */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>{t('dash.earnings.ledger_title')}</span>
            </h2>
            <p className="text-xs text-slate-400">{t('dash.earnings.ledger_desc')}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-60">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t('dash.earnings.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-9 py-2 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Filter by Source */}
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-3 py-2 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">{t('dash.earnings.filter_all_sources')}</option>
              <option value="direct_referral">{t('dash.earnings.direct_referrals_title')}</option>
              <option value="network">{t('dash.earnings.chart_network')}</option>
              <option value="copy_trading_performance">{t('dash.earnings.copy_trading_title')}</option>
              <option value="leadership_pool">{t('dash.earnings.rank_pool_title')}</option>
              <option value="fast_start_bonus">{t('dash.earnings.fast_start_title')}</option>
            </select>

            {/* Filter by Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">{t('dash.earnings.filter_all_status')}</option>
              <option value="paid">{t('dash.earnings.paid_label')}</option>
              <option value="pending">{t('dash.earnings.pending_label')}</option>
              <option value="processing">{t('common.pending')}</option>
            </select>
          </div>
        </div>

        {/* The Table */}
        <div className="rounded-2xl border border-white/10 overflow-x-auto">
          <table className={`w-full text-xs ${isRtl ? 'text-right' : 'text-left'}`}>
            <thead className="bg-slate-950 text-slate-400 border-b border-white/10 font-medium">
              <tr>
                <th className="py-3.5 px-4">{t('dash.earnings.table_date')}</th>
                <th className="py-3.5 px-4">{t('dash.earnings.table_source')}</th>
                <th className="py-3.5 px-4">{t('dash.earnings.table_user')}</th>
                <th className="py-3.5 px-4">{t('dash.earnings.table_level')}</th>
                <th className="py-3.5 px-4">{t('dash.earnings.table_profit_source')}</th>
                <th className="py-3.5 px-4">{t('dash.earnings.table_rate')}</th>
                <th className="py-3.5 px-4">{t('dash.earnings.table_amount')}</th>
                <th className="py-3.5 px-4">{t('dash.earnings.table_status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    {t('dash.earnings.table_no_data')}
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/20 transition">
                    <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap" dir="ltr">
                      {tx.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 text-[11px] font-medium">
                        {tx.sourceLabel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{tx.user.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">@{tx.user.username}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-blue-400 font-bold whitespace-nowrap">
                      {tx.level}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate" title={tx.profitSource}>
                      {tx.profitSource}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {tx.commissionRate}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-black text-emerald-400 whitespace-nowrap" dir="ltr">
                      +${tx.amount.toFixed(2)} USDT
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        tx.status === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : tx.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {tx.status === 'paid' ? t('dash.earnings.paid_label') : tx.status === 'pending' ? t('dash.earnings.pending_label') : t('common.pending')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Server Validation Note */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>{t('dash.earnings.server_validation')}</span>
          </div>
          <span className="font-mono text-[10px] text-slate-500" dir="ltr">
            ENGINE_SYNC: {summary.lastCalculatedAt.slice(0, 19).replace('T', ' ')} UTC
          </span>
        </div>

      </div>

    </div>
  );
};

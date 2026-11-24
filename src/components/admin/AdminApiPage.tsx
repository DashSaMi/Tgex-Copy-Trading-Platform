import React, { useState } from 'react';
import { PageId } from '../../types';
import { 
  Terminal, 
  ShieldCheck, 
  Key, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Lock, 
  Server, 
  Activity,
  Layers,
  Database
} from 'lucide-react';

export const AdminApiPage: React.FC<{ onNavigate?: (page: PageId) => void }> = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('2026-08-19 14:38 UTC');
  const [syncedUsersCount, setSyncedUsersCount] = useState(1284);
  const [syncedAccountsCount, setSyncedAccountsCount] = useState(842);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC');
      setSyncedUsersCount(prev => prev + 12);
      setSyncedAccountsCount(prev => prev + 5);
      showToast('همگام‌سازی داده‌های تریدینگ و حساب‌های کپی با موفقیت انجام شد.');
    }, 1500);
  };

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-mono mb-1.5 border border-blue-500/20">
            <Terminal className="w-3.5 h-3.5" />
            <span>EXCHANGE API GATEWAY & WEBHOOK MONITOR</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            مدیریت اتصال API و همگام‌سازی با صرافی خارجی
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            نظارت بر نشست‌های رمزنگاری‌شده صرافی، اوراکل‌های ترید، دریافت سودهای معاملاتی و امنیت کلیدها.
          </p>
        </div>

        <button
          onClick={handleTriggerSync}
          disabled={isSyncing}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'در حال همگام‌سازی...' : 'همگام‌سازی آنی (Trigger Sync)'}</span>
        </button>
      </div>

      {/* Status Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>وضعیت اتصال صرافی:</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div className="text-xl font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>متصل و فعال (ONLINE)</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Latency: 28ms • TLS 1.3</div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 space-y-2">
          <div className="text-xs text-slate-400">آخرین همگام‌سازی:</div>
          <div className="text-base font-bold font-mono text-white">{lastSyncTime}</div>
          <div className="text-[11px] text-emerald-400">پروتکل WebSocket / REST V3</div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 space-y-2">
          <div className="text-xs text-slate-400">کاربران همگام‌شده:</div>
          <div className="text-2xl font-black font-mono text-cyan-400">{syncedUsersCount}' Users'</div>
          <div className="text-[11px] text-slate-500">حساب‌های معاملاتی متناظر</div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 space-y-2">
          <div className="text-xs text-slate-400">حساب‌های فعال کپی ترید:</div>
          <div className="text-2xl font-black font-mono text-amber-400">{syncedAccountsCount} حساب</div>
          <div className="text-[11px] text-slate-500">متصل به مستر تریدرهای معتبر</div>
        </div>
      </div>

      {/* Security Architecture & Masked Key Manager */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-400" />
              <span>کلیدهای دسترسی سازمانی (Server-Side Secrets Policy)</span>
            </h2>
            <p className="text-xs text-slate-400">
              مطابق الزامات امنیتی، کلیدهای محرمانه و رمزهای خصوصی (Private Keys) هرگز به مرورگر ارسال نمی‌شوند و به صورت ماسک‌شده نگهداری می‌گردند.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-mono font-bold">
            ZERO EXPOSURE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-sans font-bold text-white">Public API Key (ماسک‌شده):</span>
              <span className="text-emerald-400 text-[10px]">VERIFIED</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl text-slate-300 flex items-center justify-between">
              <span>tgex_live_••••••••••••••••82AF</span>
              <span className="text-[10px] text-slate-500 font-sans">Read-Only / Trade Sync</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-sans font-bold text-white">Private API Secret:</span>
              <span className="text-rose-400 text-[10px]">ENCRYPTED IN ENV</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl text-slate-500 flex items-center justify-between">
              <span>••••••••••••••••••••••••••••••••</span>
              <span className="text-[10px] text-rose-400 font-sans font-bold">HIDDEN (SERVER ONLY)</span>
            </div>
          </div>
        </div>

        {/* Webhook Log Streams */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>جریان وب‌هوک‌های دریافتی از موتور معاملات (Live Webhook Streams)</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">200 OK • 0 ERRORS</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 font-mono text-[11px] space-y-2 text-slate-300">
            <div className="flex items-center justify-between text-slate-400 border-b border-white/5 pb-1">
              <span>[2026-08-19 14:38:12] POST /api/webhooks/trade-closed</span>
              <span className="text-emerald-400">200 SUCCESS (Profit: +$420.50)</span>
            </div>
            <div className="flex items-center justify-between text-slate-400 border-b border-white/5 pb-1">
              <span>[2026-08-19 14:35:04] POST /api/webhooks/account-synced</span>
              <span className="text-emerald-400">200 SUCCESS (User: USR-8419)</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>[2026-08-19 14:30:55] POST /api/webhooks/settlement-round</span>
              <span className="text-emerald-400">200 SUCCESS (Matrix Levels A-T)</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

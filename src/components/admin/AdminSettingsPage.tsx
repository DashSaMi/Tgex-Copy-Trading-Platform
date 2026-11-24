import React, { useState } from 'react';
import { PageId } from '../../types';
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Lock, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Server, 
  Globe, 
  Clock, 
  Terminal, 
  Database,
  Layers,
  Key
} from 'lucide-react';

export const AdminSettingsPage: React.FC<{ onNavigate?: (page: PageId) => void }> = () => {
  const [platformName, setPlatformName] = useState('TGEX');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [sessionTimeoutHours, setSessionTimeoutHours] = useState(8);
  const [requireAdmin2FA, setRequireAdmin2FA] = useState(true);
  const [oracleSyncIntervalSec, setOracleSyncIntervalSec] = useState(15);
  const [maxMatrixDepth, setMaxMatrixDepth] = useState(20);
  const [kycAutoApproval, setKycAutoApproval] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('تنظیمات امنیتی و زیرساختی سیستم با موفقیت در سرور ذخیره شدند.');
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/10 text-slate-300 text-xs font-mono mb-1.5 border border-slate-500/20">
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>CORE SYSTEM CONFIGURATION & SECURITY POLICIES</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            تنظیمات کلان سامانه و خط‌مشی‌های امنیتی
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            پیکربندی پارامترهای زیرساخت، امنیت نشست‌ها، دوره‌های همگام‌سازی و پارامترهای شبکه.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>ذخیره کلیه تنظیمات (Save Configuration)</span>
        </button>
      </div>

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Section 1: Security & Sessions */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm border-b border-white/10 pb-3">
            <Lock className="w-4 h-4" />
            <span>امنیت، نشست‌ها و احراز هویت سرپرستان</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-white/5">
              <div>
                <div className="font-bold text-white">احراز هویت دو مرحله‌ای الزامی (2FA):</div>
                <div className="text-[11px] text-slate-400">اجبار استفاده از Google Authenticator برای تمامی مدیران</div>
              </div>
              <input
                type="checkbox"
                checked={requireAdmin2FA}
                onChange={(e) => setRequireAdmin2FA(e.target.checked)}
                className="w-5 h-5 rounded bg-slate-900 border-white/20 text-rose-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">مدت انقضای نشست مدیریت (Session Timeout):</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={sessionTimeoutHours}
                  onChange={(e) => setSessionTimeoutHours(Number(e.target.value))}
                  className="w-28 p-2.5 bg-slate-950 border border-white/10 rounded-xl text-white font-mono text-xs"
                />
                <span className="text-slate-400">ساعت پس از عدم فعالیت</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-white/5 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>رمزنگاری کوکی‌ها: HTTP-Only Secure Cookies فعال است</span>
              </div>
              <div>توکن‌های احراز هویت مدیریت به صورت ایزوله از دسترسی جاوااسکریپت ناامن محافظت می‌شوند.</div>
            </div>
          </div>
        </div>

        {/* Section 2: Platform & Maintenance */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm border-b border-white/10 pb-3">
            <Globe className="w-4 h-4" />
            <span>تنظیمات عمومی پلتفرم و حالت نگهداری</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">نام تجاری پلتفرم:</label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-white font-mono text-xs"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-white/5">
              <div>
                <div className="font-bold text-white">حالت نگهداری سرور (Maintenance Mode):</div>
                <div className="text-[11px] text-slate-400">مسدودسازی موقت دسترسی کاربران جهت به‌روزرسانی زیرساخت</div>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-5 h-5 rounded bg-slate-900 border-white/20 text-amber-600"
              />
            </div>
          </div>
        </div>

        {/* Section 3: 20-Level Matrix & Commission Engine */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm border-b border-white/10 pb-3">
            <Layers className="w-4 h-4" />
            <span>پارامترهای ماتریس ۲۰ سطحی و اسپیل‌اور</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">حداکثر عمق قابل محاسبه (Levels):</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  disabled
                  value={maxMatrixDepth}
                  className="w-28 p-2.5 bg-slate-950 border border-white/10 rounded-xl text-slate-400 font-mono text-xs"
                />
                <span className="text-slate-400">سطوح ثابت ماتریس (A تا T = ۲۰ سطح)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-white/5 text-[11px] text-slate-400">
              محاسبات کمیسیون به صورت آنی پس از بسته شدن هر معامله توسط اوراکل قیمت در سرور انجام می‌شود.
            </div>
          </div>
        </div>

        {/* Section 4: Exchange API & Oracle Integration */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm border-b border-white/10 pb-3">
            <Terminal className="w-4 h-4" />
            <span>نرخ همگام‌سازی اوراکل صرافی (Exchange Oracle Sync)</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">فاصله زمانی همگام‌سازی پوزیشن‌ها (ثانیه):</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={oracleSyncIntervalSec}
                  onChange={(e) => setOracleSyncIntervalSec(Number(e.target.value))}
                  className="w-28 p-2.5 bg-slate-950 border border-white/10 rounded-xl text-white font-mono text-xs"
                />
                <span className="text-slate-400">ثانیه (Real-time polling)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-white/5 text-[11px] text-slate-400">
              پروتکل امنیتی: تمام اتصالات به صرافی دارای امضای دیجیتال HMAC-SHA256 هستند.
            </div>
          </div>
        </div>

      </form>

    </div>
  );
};

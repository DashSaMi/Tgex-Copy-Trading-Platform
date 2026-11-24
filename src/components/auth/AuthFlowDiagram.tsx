import React, { useState } from 'react';
import { PageId, AuthStateType } from '../../types';
import { 
  ShieldCheck, 
  Lock, 
  Server, 
  Layers, 
  KeyRound, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Cpu, 
  Database,
  Globe,
  FileCode2,
  Terminal,
  Play
} from 'lucide-react';

interface AuthFlowDiagramProps {
  onNavigate: (page: PageId) => void;
}

export const AuthFlowDiagram: React.FC<AuthFlowDiagramProps> = ({ onNavigate }) => {
  const [selectedTab, setSelectedTab] = useState<'lifecycle' | 'architecture' | 'states' | 'security'>('lifecycle');
  const [activeSimState, setActiveSimState] = useState<AuthStateType>('success');

  const authStatesList: { type: AuthStateType; title: string; desc: string; badge: string; color: string }[] = [
    {
      type: 'loading',
      title: 'در حال بارگذاری (Loading)',
      desc: 'ارسال درخواست به سرور، مسدودسازی کلیک‌های مکرر و نمایش لودر اسپینر.',
      badge: 'REQUEST_IN_FLIGHT',
      color: 'border-blue-500/40 text-blue-400 bg-blue-500/10'
    },
    {
      type: 'success',
      title: 'موفقیت‌آمیز (Success)',
      desc: 'اعتبارسنجی تایید شد، نشست امن ایجاد گردید و هدایت خودکار انجام می‌شود.',
      badge: 'HTTP 200 OK',
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
    },
    {
      type: 'invalid_credentials',
      title: 'اطلاعات نامعتبر (Invalid Credentials)',
      desc: 'ایمیل یا کلمه عبور نادرست بوده و بازخورد امنیتی بدون افشای وجود یا عدم وجود کاربر ارایه می‌شود.',
      badge: 'HTTP 401 UNAUTHORIZED',
      color: 'border-rose-500/40 text-rose-400 bg-rose-500/10'
    },
    {
      type: 'email_not_verified',
      title: 'ایمیل تأیید نشده (Email Not Verified)',
      desc: 'حساب ایجاد شده اما دسترسی به ورود مسدود است تا کاربر به /verify-email هدایت شود.',
      badge: 'REQUIRES_OTP_VERIFICATION',
      color: 'border-amber-500/40 text-amber-400 bg-amber-500/10'
    },
    {
      type: 'account_disabled',
      title: 'حساب مسدود (Account Disabled)',
      desc: 'مسدودسازی موقت یا دائم توسط ادمین و هدایت کاربر به میز پشتیبانی و انطباق.',
      badge: 'HTTP 403 FORBIDDEN',
      color: 'border-rose-500/40 text-rose-400 bg-rose-500/10'
    },
    {
      type: 'kyc_required',
      title: 'نیاز به احراز هویت (KYC Required)',
      desc: 'برای برداشت پورسانت و شرکت در سطوح پیشرفته، الزام به تکمیل مدارک هویتی اعلام می‌شود.',
      badge: 'KYC_PENDING',
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10'
    },
    {
      type: 'session_expired',
      title: 'انقضای نشست (Session Expired)',
      desc: 'توکن JWT منقضی شده، پاکسازی حافظه نشست و درخواست ورود مجدد کاربر.',
      badge: 'JWT_EXPIRED',
      color: 'border-purple-500/40 text-purple-400 bg-purple-500/10'
    },
    {
      type: 'server_error',
      title: 'خطای سرور (Server Error)',
      desc: 'مدیریت خطاهای غیرمنتظره شبکه با مکانیزم تلاش مجدد (Retry).',
      badge: 'HTTP 500 ERROR',
      color: 'border-slate-500/40 text-slate-400 bg-slate-500/10'
    }
  ];

  return (
    <div className="space-y-16 py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-slate-200">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-bold font-mono tracking-widest uppercase">
          <ShieldCheck className="w-3.5 h-3.5" />
          معماری کامل احراز هویت تیجکس
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          سند معماری سیستم امنیت
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
          جداسازی کامل لایه‌های احراز هویت فرانت‌اند، سرور میانی تیجکس و رابط کاربری اتصال به صرافی خارجی با استانداردهای امنیتی بدون افشای کلیدها.
        </p>
      </div>

      {/* Interactive Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg max-w-fit mx-auto">
        {[
          { id: 'lifecycle', label: '۱. چرخه ثبت‌نام' },
          { id: 'architecture', label: '۲. معماری واسط' },
          { id: 'states', label: '۳. وضعیت‌ها' },
          { id: 'security', label: '۴. امنیت' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`px-5 py-2 rounded-md text-xs font-semibold transition-colors ${
              selectedTab === tab.id
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Registration Lifecycle */}
      {selectedTab === 'lifecycle' && (
        <div className="space-y-12 animate-in fade-in duration-300">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-bold text-white">
              مسیر گام‌به‌گام احراز هویت
            </h2>
            <p className="text-xs font-mono text-slate-500">
              Registration → OTP → Account Created → Login → KYC
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-slate-800 border border-slate-800 rounded-2xl overflow-hidden">
            {[
              { num: '۰۱', title: 'ثبت‌نام اولیه', desc: 'ورود ایمیل، کلمه عبور و کد معرف دائمی.', route: '/register' },
              { num: '۰۲', title: 'تأیید ایمیل', desc: 'ارسال کد یکبار مصرف جهت اعتبارسنجی.', route: '/verify-email' },
              { num: '۰۳', title: 'ایجاد حساب', desc: 'ثبت در پایگاه داده و تخصیص جایگاه.', route: 'Verified' },
              { num: '۰۴', title: 'ورود امن', desc: 'صدور توکن JWT و ذخیره کوکی.', route: '/login' },
              { num: '۰۵', title: 'احراز KYC', desc: 'ارسال مدارک برای بازگشایی برداشت‌ها.', route: '/kyc' }
            ].map((step, idx) => (
              <div key={idx} className="bg-slate-950 p-6 space-y-4 flex flex-col">
                <span className="text-slate-600 font-mono font-bold text-sm">
                  {step.num}
                </span>
                <h3 className="text-sm font-bold text-white">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed flex-1">
                  {step.desc}
                </p>
                <div className="text-[10px] font-mono text-slate-500 pt-3 border-t border-slate-800/50 mt-auto">
                  {step.route}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('register')}
              className="px-6 py-2.5 rounded-lg bg-white text-slate-950 text-xs font-bold hover:bg-slate-200 transition"
            >
              تست ثبت‌نام
            </button>
            <button
              onClick={() => onNavigate('login')}
              className="px-6 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-bold border border-slate-700 hover:bg-slate-800 transition"
            >
              تست ورود
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Future Exchange API Abstraction */}
      {selectedTab === 'architecture' && (
        <div className="space-y-10 animate-in fade-in duration-300">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-bold text-white">
              معماری اتصال سه‌لایه‌ای امن
            </h2>
            <p className="text-xs font-mono text-slate-500">
              Frontend → TGEX Backend → External Exchange
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs max-w-5xl mx-auto">
            {/* Tier 1 */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-5">
              <div className="flex items-center gap-2.5 text-white font-bold text-sm border-b border-slate-800 pb-4">
                <Globe className="w-4 h-4 text-slate-400" />
                <span>۱. لایه کلاینت</span>
              </div>
              <ul className="space-y-3 text-slate-400 text-xs font-sans">
                <li>• کامپوننت‌های رابط کاربری</li>
                <li>• استفاده از <code className="text-slate-300 bg-slate-900 px-1 rounded">IAuthService</code></li>
                <li>• عدم دسترسی مستقیم به صرافی</li>
                <li>• ایزوله کامل از کلیدهای خصوصی</li>
              </ul>
            </div>

            {/* Tier 2 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-700 space-y-5 relative overflow-hidden">
              <div className="flex items-center gap-2.5 text-white font-bold text-sm border-b border-slate-800 pb-4 relative z-10">
                <Server className="w-4 h-4 text-slate-400" />
                <span>۲. سرور واسط (TGEX)</span>
              </div>
              <ul className="space-y-3 text-slate-300 text-xs font-sans relative z-10">
                <li>• هشینگ پسوردها با الگوریتم bcrypt</li>
                <li>• مدیریت کوکی‌های امن HTTP-Only</li>
                <li>• محافظت حملات (Rate Limiting)</li>
                <li>• محاسبات بازاریابی سطوح</li>
              </ul>
            </div>

            {/* Tier 3 */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-5">
              <div className="flex items-center gap-2.5 text-white font-bold text-sm border-b border-slate-800 pb-4">
                <Cpu className="w-4 h-4 text-slate-400" />
                <span>۳. موتور صرافی خارجی</span>
              </div>
              <ul className="space-y-3 text-slate-400 text-xs font-sans">
                <li>• اجرای معاملات کپی ترید</li>
                <li>• مدیریت کلیدهای Read/Trade</li>
                <li>• مسدودسازی برداشت (No Withdrawal)</li>
                <li>• استریم لحظه‌ای سود و زیان</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Auth States Sandbox */}
      {selectedTab === 'states' && (
        <div className="space-y-10 animate-in fade-in duration-300">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-bold text-white">
              وضعیت‌های احراز هویت
            </h2>
            <p className="text-xs text-slate-500">
              بررسی رفتارهای بصری پروتکل در شرایط مختلف
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-800 border border-slate-800 rounded-2xl overflow-hidden">
            {authStatesList.map((item) => (
              <div
                key={item.type}
                onClick={() => setActiveSimState(item.type)}
                className={`p-5 cursor-pointer transition-colors space-y-3 ${
                  activeSimState === item.type 
                    ? 'bg-slate-800' 
                    : 'bg-slate-950 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono font-bold ${item.color.replace('border-', 'text-').replace('bg-', 'bg-transparent text-').split(' ')[1] || 'text-slate-400'}`}>
                    {item.badge}
                  </span>
                </div>
                <h3 className={`text-xs font-bold ${activeSimState === item.type ? 'text-white' : 'text-slate-300'}`}>{item.title}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Security Protocols */}
      {selectedTab === 'security' && (
        <div className="space-y-10 animate-in fade-in duration-300">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-bold text-white">
              اصول امنیتی پیاده‌سازی شده
            </h2>
            <p className="text-xs text-slate-500">
              مطابق با برترین الزامات فین‌تک بین‌المللی
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold text-white">کوکی‌های ایمن</h3>
              <p className="text-slate-400 leading-relaxed">
                جلوگیری از حملات XSS با ذخیره‌سازی توکن‌های نشست در کوکی‌های امن با فلگ‌های <code className="text-slate-300 font-mono text-[10px] bg-slate-900 px-1 rounded">HttpOnly, Secure</code>.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300">
                <KeyRound className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold text-white">هشینگ کلمه عبور</h3>
              <p className="text-slate-400 leading-relaxed">
                عدم ذخیره کلمات عبور به صورت متن ساده و استفاده از الگوریتم‌های هش با فاکتور سختی بالا و Salting.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold text-white">محدودیت نرخ (Rate Limiting)</h3>
              <p className="text-slate-400 leading-relaxed">
                محدودسازی تعداد تلاش‌های ورود و ارسال کد به حداکثر ۵ تلاش در هر ۱۰ دقیقه جهت مهار حملات بروت‌فورس.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

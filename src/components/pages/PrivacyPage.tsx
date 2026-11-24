import React from 'react';
import { PageId } from '../../types';
import { ShieldCheck, Lock, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface PrivacyPageProps {
  onNavigate: (page: PageId) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  const { language, dir } = useLanguage();

  return (
    <div className="space-y-8 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-slate-300 text-xs sm:text-sm leading-relaxed" dir={dir}>
      
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
          DATA PROTECTION & PRIVACY
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          {language === 'fa' ? 'سیاست حفظ حریم خصوصی تیجکس (Tgex)' : 'Tgex Privacy Policy'}
        </h1>
        <p className="text-xs text-slate-400">
          {language === 'fa' ? 'تعهد به رمزنگاری و حفاظت حداکثری از داده‌های کاربران' : 'Commitment to encryption and maximum protection of user data'}
        </p>
      </div>

      <div className={`p-8 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6 ${language === 'fa' ? 'text-right' : 'text-left'}`}>
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">{language === 'fa' ? '۱. داده‌های جمع‌آوری شده' : '1. Collected Data'}</h2>
          <p className="text-slate-400">
            {language === 'fa'
              ? 'ما تنها اطلاعات ضروری از جمله آدرس ایمیل، کد معرف، گزارش نشست‌های ورود و هش رمزنگاری‌شده کلمات عبور را ذخیره می‌کنیم. تیجکس هرگز رمزهای عبور را به صورت متن خام ذخیره نکرده و اطلاعات هویتی به هیچ نهاد تبلیغاتی ثالث فروخته نمی‌شود.'
              : 'We only store essential information including email address, referral code, login session logs, and encrypted password hashes. Tgex never stores passwords in plain text, and identity information is never sold to any third-party advertising entities.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">{language === 'fa' ? '۲. امنیت نشست‌ها و کوکی‌ها' : '2. Session and Cookie Security'}</h2>
          <p className="text-slate-400">
            {language === 'fa'
              ? 'نشست‌های کاربری با استفاده از کوکی‌های دارای صفت HttpOnly و رمزنگاری TLS 1.3 محافظت می‌شوند تا در برابر تهدیدات نفوذ سایبری و حملات XSS ایزوله باشند.'
              : 'User sessions are protected using cookies with the HttpOnly attribute and TLS 1.3 encryption to remain isolated against cyber intrusion threats and XSS attacks.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">{language === 'fa' ? '۳. کلیدهای API اتصال صرافی' : '3. Exchange Connection API Keys'}</h2>
          <p className="text-slate-400">
            {language === 'fa'
              ? 'کلیدهای اتصال API صرافی در خزانه‌های سخت‌افزاری امن ذخیره شده و صرفاً حق فراخوانی وضعیت سفارشات و ارسال دستورات کپی ترید را بدون حق برداشت دارایی دارا هستند.'
              : 'Exchange connection API keys are stored in secure hardware vaults and only possess the right to fetch order status and send copy trade commands, completely without asset withdrawal rights.'}
          </p>
        </section>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-white/10 transition inline-flex items-center gap-2"
        >
          <span>{language === 'fa' ? 'بازگشت به صفحه اصلی' : 'Back to Home'}</span>
          {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

    </div>
  );
};

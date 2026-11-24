import React from 'react';
import { PageId } from '../../types';
import { ShieldCheck, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface TermsPageProps {
  onNavigate: (page: PageId) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  const { language, dir } = useLanguage();
  return (
    <div className="space-y-8 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-slate-300 text-xs sm:text-sm leading-relaxed" dir={dir}>
      
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
          LEGAL & TERMS OF SERVICE
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          {language === 'fa' ? 'شرایط و قوانین استفاده از تیجکس (TGEX)' : 'Terms & Conditions of Service'}
        </h1>
        <p className="text-xs text-slate-400">{language === 'fa' ? 'آخرین بازنگری: فوریه ۲۰۲۵' : 'Last Updated: February 2025'}</p>
      </div>

      <div className={`p-8 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6 ${language === 'fa' ? 'text-right' : 'text-left'}`}>
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">{language === 'fa' ? '۱. ماهیت خدمات پلتفرم' : '1. Nature of Platform Services'}</h2>
          <p className="text-slate-400">
            {language === 'fa'
              ? 'پلتفرم تیجکس صرفاً یک ارایه‌دهنده فناوری و زیرساخت نرم‌افزاری بازاریابی شبکه است. تیجکس صرافی، کارگزار یا مشاور مالی دارای مجوز مدیریت دارایی شخص ثالث نمی‌باشد. تمامی تصمیمات سرمایه‌گذاری با مسئولیت شخصی کاربران اتخاذ می‌گردد.'
              : 'Tgex is exclusively a technology provider and network marketing software infrastructure. Tgex is not an exchange, broker, or licensed third-party asset manager financial advisor. All investment decisions are made entirely at the user’s own risk.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">{language === 'fa' ? '۲. عدم تصدی و مسئولیت دارایی‌ها (Non-Custodial)' : '2. Non-Custodial Nature of Assets'}</h2>
          <p className="text-slate-400">
            {language === 'fa'
              ? 'دارایی‌های نقدی و ارزی کاربران در حساب‌های شخصی ایشان نزد کارگزاران یا صرافی‌های طرف ثالث نگهداری شده و تیجکس فاقد هرگونه دسترسی به کلیدهای خصوصی یا امکان برداشت وجه می‌باشد.'
              : 'User fiat and digital assets are maintained in their personal accounts with third-party brokers or exchanges. Tgex has no access to private keys or withdrawal capabilities.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">{language === 'fa' ? '۳. ساختار پاداش بازاریابی ۲۰ سطحی' : '3. 20-Level Network Marketing Reward Structure'}</h2>
          <p className="text-slate-400">
            {language === 'fa'
              ? 'پاداش‌های بازاریابی شبکه به طور مستقیم بر اساس محاسبات سرورساید ناشی از حجم واقعی کارمزدهای معاملاتی کپی تریدینگ محاسبه و توزیع می‌گردد. هرگونه سوءاستفاده یا ایجاد حساب‌های ساختگی منجر به مسدودسازی حساب خواهد شد.'
              : 'Network marketing rewards are directly calculated and distributed based on server-side processing derived from the actual volume of copy trading transaction fees. Any abuse or creation of fake accounts will result in account suspension.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">{language === 'fa' ? '۴. الزامات احراز هویت (KYC) و مبارزه با پول‌شویی (AML)' : '4. KYC and AML Requirements'}</h2>
          <p className="text-slate-400">
            {language === 'fa'
              ? 'تمامی کاربران جهت برداشت پاداش‌های بازاریابی ملزم به تکمیل فرآیند احراز هویت معتبر و رعایت استانداردهای انطباق قانونی می‌باشند.'
              : 'All users are required to complete a valid identity verification process and comply with legal compliance standards (AML) in order to withdraw marketing rewards.'}
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

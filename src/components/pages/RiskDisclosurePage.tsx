import React from 'react';
import { PageId } from '../../types';
import { AlertTriangle, ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface RiskDisclosurePageProps {
  onNavigate: (page: PageId) => void;
}

export const RiskDisclosurePage: React.FC<RiskDisclosurePageProps> = ({ onNavigate }) => {
  const { language, dir } = useLanguage();
  return (
    <div className="space-y-8 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-slate-300 text-xs sm:text-sm leading-relaxed" dir={dir}>
      
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono">
          OFFICIAL RISK DISCLOSURE
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          {language === 'fa' ? 'بیانیه جامع افشای ریسک‌های مالی' : 'Comprehensive Financial Risk Disclosure'}
        </h1>
        <p className="text-xs text-amber-300/80">
          {language === 'fa' ? 'لطفاً پیش از واریز یا کپی هرگونه استراتژی با دقت مطالعه فرمایید' : 'Please read carefully before depositing or copying any strategy'}
        </p>
      </div>

      <div className={`p-8 rounded-3xl bg-slate-900/60 border border-amber-500/20 space-y-6 ${language === 'fa' ? 'text-right' : 'text-left'}`}>
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>{language === 'fa' ? '۱. ریسک نوسانات بازار و معاملات با اهرم (Leverage)' : '1. Market Volatility & Leverage Risk'}</span>
          </h2>
          <p className="text-slate-400">
            {language === 'fa' 
              ? 'معاملات در بازارهای فیوچرز، فارکس و کریپتو دارای درجه بالایی از ریسک هستند. استفاده از اهرم می‌تواند علاوه بر چندبرابر کردن سود، موجب از دست رفتن سریع کل اصل سرمایه گردد.'
              : 'Trading in futures, forex, and crypto markets carries a high degree of risk. The use of leverage can multiply profits but can also lead to the rapid loss of your entire initial capital.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>{language === 'fa' ? '۲. عدم تضمین سود در کپی تریدینگ' : '2. No Profit Guarantee in Copy Trading'}</span>
          </h2>
          <p className="text-slate-400">
            {language === 'fa'
              ? 'عملکرد درخشان گذشته یک تریدر، تضمین‌کننده تکرار نتایج در آینده نیست. شرایط بازار، اسلیپیج (Slippage)، تاخیرهای شبکه اینترنت و نقدینگی صرافی می‌توانند منجر به تفاوت در سود و زیان سفارش کپی‌شده شوند.'
              : 'The stellar past performance of a trader does not guarantee future results. Market conditions, slippage, network delays, and exchange liquidity can lead to differences in the profit and loss of copied orders.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>{language === 'fa' ? '۳. مسئولیت مدیریت سرمایه شخصی' : '3. Personal Capital Management Responsibility'}</span>
          </h2>
          <p className="text-slate-400">
            {language === 'fa'
              ? 'کاربر باید تنها با سرمایه‌ای اقدام به معامله و کپی کند که توانایی تحمل زیان احتمالی آن را دارد. هیچ مشاوره‌ای در تیجکس (Tgex) به عنوان توصیه سرمایه‌گذاری قطعی تلقی نمی‌گردد.'
              : 'Users should only trade and copy with capital they can afford to lose. No advice provided by Tgex should be construed as definitive investment recommendations.'}
          </p>
        </section>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-white/10 transition inline-flex items-center gap-2"
        >
          <span>{language === 'fa' ? 'تایید و بازگشت به صفحه اصلی' : 'Acknowledge and Back to Home'}</span>
          {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

    </div>
  );
};

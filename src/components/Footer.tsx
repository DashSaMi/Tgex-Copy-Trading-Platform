import React from 'react';
import { PageId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Mail, Globe, Lock, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, language, dir } = useLanguage();

  return (
    <footer className="bg-slate-950/95 border-t border-white/10 text-slate-400 text-xs py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs font-mono shadow-md shadow-blue-500/20">
                TG
              </div>
              <span className="font-black text-lg text-white font-mono tracking-wider">TGEX</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {t('footer.desc', 'پلتفرم پیشرفته پیونددهنده معاملات کپی تریدینگ صرافی‌ها با سیستم بازاریابی و پاداش هیبرید ۲۰ لایه‌ای.')}
            </p>
            <div className="text-[10px] text-slate-500 font-mono">
              © 2026 TGEX PROTOCOL. {language === 'fa' ? 'تمامی حقوق محفوظ است.' : 'ALL RIGHTS RESERVED.'}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs">
              {language === 'fa' ? 'بخش‌های وبسایت' : 'Website Sections'}
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition">
                  {t('nav.home', 'صفحه اصلی')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('levels')} className="hover:text-white transition">
                  {t('nav.levels', 'جدول سطوح A تا T')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ranks')} className="hover:text-white transition">
                  {t('nav.ranks', 'رتبه‌ها و افتخارات')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Authentication & Dashboard */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs">
              {language === 'fa' ? 'ناحیه کاربری و مدیریت' : 'User Area & Management'}
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition text-blue-400">
                  {t('nav.dashboard', 'داشبورد کاربری')} (User Dashboard)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('login')} className="hover:text-white transition">
                  {t('nav.login', 'ورود به سیستم')} (Sign In)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('auth-architecture')} className="hover:text-white transition">
                  {language === 'fa' ? 'معماری امنیتی و احراز هویت' : 'Security Architecture'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs">
              {language === 'fa' ? 'قوانین و انطباق (Compliance)' : 'Legal & Compliance'}
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition">
                  {language === 'fa' ? 'شرایط و مقررات استفاده' : 'Terms & Conditions'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition">
                  {language === 'fa' ? 'حفظ حریم خصوصی و امنیت داده‌ها' : 'Privacy Policy'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('risk')} className="hover:text-amber-400 transition">
                  {language === 'fa' ? 'بیانیه جامع افشای ریسک‌های مالی' : 'Risk Disclosure Statement'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-white transition">
                  {t('nav.faq', 'مرکز سوالات متداول')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support-tickets')} className="hover:text-cyan-300 transition flex items-center gap-1">
                  <span>{language === 'fa' ? 'پشتیبانی و تیکت‌ها' : 'Support & Tickets'}</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 border-t border-white/10 text-[10px] text-slate-500 leading-relaxed text-center max-w-4xl mx-auto">
          <strong>{language === 'fa' ? 'سلب مسئولیت ریسک:' : 'Risk Disclaimer:'}</strong>{' '}
          {t('footer.risk_warning', 'معاملات در بازارهای مالی کریپتو و فیوچرز دارای درجه بالایی از ریسک است. تیجکس صرفاً یک ارائه‌دهنده زیرساخت نرم‌افزاری کپی تریدینگ و الگوریتم‌های شبکه‌ای است.')}
        </div>

      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId } from '../../types';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowLeft,
  ArrowRight,
  Layers,
  Award,
  MessageCircle,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCmsContent } from '../../services/cmsService';

interface FaqPageProps {
  onNavigate: (page: PageId) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const { language, dir } = useLanguage();
  const isFa = language === 'fa';
  const cms = useCmsContent();
  const [openIds, setOpenIds] = useState<string[]>(['faq_1', 'faq_2']);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');

  const defaultFaFaqs = [
    {
      id: 'faq_1',
      category: 'marketing',
      question: 'مدل تقسیم سود و بازاریابی تیجکس (Tgex) چگونه کار می‌کند؟',
      answer:
        'سود معاملات به صورت ۵۰٪ سرمایه‌گذار، ۳۰٪ تریدر و ۲۰٪ سیستم بازاریابی تقسیم می‌شود. سهم ۲۰٪ بازاریابی شامل ۳٪ پورسانت معرفی مستقیم، ۱۴٪ پورسانت شبکه در ۲۰ سطح (از ۳.۰۰٪ در سطح ۱ تا ۰.۰۵٪ در سطح ۲۰) و ۳٪ استخر رهبری است.'
    },
    {
      id: 'faq_2',
      category: 'security',
      question: 'آیا سرمایه من نزد تیجکس نگهداری می‌شود؟',
      answer:
        'خیر. تیجکس یک وب‌سایت بازاریابی و ساختار شبکه برای صرافی است و هیچ دسترسی به دارایی یا برداشت وجه کاربران ندارد. سرمایه شما مستقیماً در حساب صرافی شخصی خودتان باقی می‌ماند.'
    },
    {
      id: 'faq_3',
      category: 'verification',
      question: 'تفاوت احراز هویت (KYC) با ثبت‌نام و ورود چیست؟',
      answer:
        'ثبت‌نام و ورود با کد تأیید ایمیل (OTP) برای دسترسی به داشبورد انجام می‌شود، در حالی که احراز هویت (KYC) فرآیند انطباقی برای تایید مدارک جهت فعال‌سازی برداشت پاداش‌های بازاریابی است.'
    },
    {
      id: 'faq_4',
      category: 'marketing',
      question: 'منطق سقف ۲۰ معرفی مستقیم و Spillover چیست؟',
      answer:
        'هر عضو می‌تواند حداکثر ۲۰ معرفی مستقیم در جایگاه اول خود داشته باشد. از معرفی مستقیم نفر بیست‌ویکم به بعد، ساختار Spillover فعال شده و جایگاه عضو به شاخه‌های زیرین منتقل می‌شود؛ اما پورسانت همواره بر اساس Sponsor واقعی محاسبه می‌گردد نه محل فیزیکی قرارگیری در ساختار.'
    },
    {
      id: 'faq_5',
      category: 'levels',
      question: 'رتبه‌ها از استارتر تا راهبر ارشد چگونه محاسبه می‌شوند؟',
      answer:
        'رتبه‌بندی شامل ۹ سطح از استارتر (ثبت‌نام + حداقل ۵۰ دلار سرمایه فعال) تا استیجر، ترینر، مشاور، راهنما، مدیر، مدیر ارشد، راهبر و راهبر ارشد است که بر اساس رتبه‌های خطوط زیرین، حجم AUM تیم و قانون تعادل خطوط (حداکثر ۶۰٪، ۵۰٪ و ۴۰٪ از یک خط) ارزیابی می‌شود.'
    },
    {
      id: 'faq_6',
      category: 'earnings',
      question: 'در داشبورد کاربری چه اطلاعاتی نمایش داده می‌شود؟',
      answer:
        'در داشبورد شخصی، فقط درآمد اختصاصی شما، جایگاه دقیق خودتان در ساختار، ارتباطات شبکه شما و درخت زیرشاخه خودتان با آمار واقعی و شفاف نمایش داده می‌شود.'
    }
  ];

  const defaultEnFaqs = [
    {
      id: 'faq_1',
      category: 'marketing',
      question: 'How does the Tgex profit-sharing and marketing model work?',
      answer:
        'Generated profit is split 50% Investor, 30% Trader, and 20% Marketing System. The 20% marketing allocation is divided into 3% Direct Sponsor bonus, 14% across the 20-level network (3.00% at Level 1 down to 0.05% at Level 20), and 3% Leadership Pool.'
    },
    {
      id: 'faq_2',
      category: 'security',
      question: 'Are my funds held by Tgex?',
      answer:
        'No. Tgex operates strictly as the exchange marketing and network analytics platform with zero custody and zero withdrawal access. Your capital remains in your own exchange account.'
    },
    {
      id: 'faq_3',
      category: 'verification',
      question: 'What is the difference between KYC and Registration/Login?',
      answer:
        'Registration and login verify your account entry via Email OTP, while KYC is the compliance identity check required before withdrawing earned marketing rewards.'
    },
    {
      id: 'faq_4',
      category: 'marketing',
      question: 'How do the 20-direct cap and Spillover work?',
      answer:
        'Each member can place up to 20 direct referrals in their frontline. From the 21st direct referral onward, automated Spillover assigns placement below, while all commissions continue to be calculated strictly on the real Sponsor.'
    },
    {
      id: 'faq_5',
      category: 'levels',
      question: 'How are ranks from Starter to Senior Leader evaluated?',
      answer:
        'The 9-rank ladder advances from Starter (registration + $50 active capital) through Stager, Trainer, Advisor, Guide, Manager, Senior Manager, Leader, and Senior Leader using qualified leg ranks, Team AUM milestones, and single-line balancing caps (60%, 50%, 40%).'
    },
    {
      id: 'faq_6',
      category: 'earnings',
      question: 'What data is shown inside my user dashboard?',
      answer:
        'Your dashboard scopes strictly to your own account: your earned commissions, your specific tier position, your direct network connections, and your personal downline tree.'
    }
  ];

  const faqs = isFa
    ? cms?.faq?.items && cms.faq.items.length > 0
      ? cms.faq.items
      : defaultFaFaqs
    : defaultEnFaqs;

  const categories = [
    { id: 'all', label: isFa ? 'همه پرسش‌ها' : 'All Topics' },
    { id: 'marketing', label: isFa ? 'تقسیم سود و اسپیلاور' : 'Profit & Spillover' },
    { id: 'levels', label: isFa ? 'رتبه‌ها و ۲۰ سطح' : 'Ranks & 20 Levels' },
    { id: 'security', label: isFa ? 'امنیت و مالکیت' : 'Security' },
    { id: 'verification', label: isFa ? 'احراز هویت (KYC)' : 'KYC & Access' },
    { id: 'earnings', label: isFa ? 'داشبورد و تسویه' : 'Dashboard & Payouts' }
  ];

  const toggle = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const filteredFaqs = faqs.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || item.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-10 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-slate-200" dir={dir}>

      {/* SECTION 1: KNOWLEDGE DESK HERO & LIVE SEARCH */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-3xl bg-gradient-to-br from-slate-900/90 via-[#070B14] to-slate-950 border border-white/10 p-8 sm:p-12 text-center space-y-6 shadow-2xl"
      >
        <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-cyan-400">
          <HelpCircle className="w-4 h-4" />
          <span>KNOWLEDGE BASE &amp; OFFICIAL FAQ</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight text-balance">
          {isFa ? (cms?.faq?.title || 'مرکز پاسخ به پرسش‌های متداول') : 'Frequently Asked Questions'}
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {isFa
            ? (cms?.faq?.subtitle || 'پاسخ‌های شفاف و رسمی درباره ساختار بازاریابی ۲۰ سطحی، قانون Sponsor و Spillover، رتبه‌ها و امنیت دارایی در تیجکس.')
            : 'Clear, official answers covering the 20-level marketing matrix, Sponsor vs. Spillover logic, ranks, and non-custodial security.'}
        </p>

        <div className="max-w-2xl mx-auto relative pt-2">
          <input
            type="text"
            placeholder={isFa ? 'جستجو در متن سوالات و پاسخ‌ها...' : 'Search questions and answers...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full bg-slate-950 border border-white/15 rounded-2xl py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-lg transition ${
              isFa ? 'pl-11 pr-4' : 'pl-11 pr-4'
            }`}
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 mt-1" />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                category === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </motion.section>

      {/* SECTION 2: 2-COLUMN SPLIT — SIDEBAR QUICK LINKS + ANIMATED ACCORDION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Quick Navigation Desk */}
        <motion.aside
          initial={{ opacity: 0, x: isFa ? 18 : -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-4 space-y-4 lg:sticky lg:top-24"
        >
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>{isFa ? 'دسترسی سریع مستندات' : 'PLATFORM DOCUMENTATION'}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isFa
                ? 'برای مشاهده جداول کامل درصدها و شروط رتبه‌بندی می‌توانید مستقیماً صفحات مرجع را باز کنید.'
                : 'Jump directly to detailed specification pages for commission percentages and rank criteria.'}
            </p>
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('levels')}
                className="w-full p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-white/10 flex items-center justify-between text-xs font-bold text-white transition cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>{isFa ? '۲۰ سطح شبکه (۱۴٪)' : '20 Network Levels (14%)'}</span>
                </span>
                {dir === 'rtl' ? <ArrowLeft className="w-3.5 h-3.5 text-slate-400" /> : <ArrowRight className="w-3.5 h-3.5 text-slate-400" />}
              </button>

              <button
                type="button"
                onClick={() => onNavigate('ranks')}
                className="w-full p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-white/10 flex items-center justify-between text-xs font-bold text-white transition cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>{isFa ? '۹ رتبه و استخر رهبری' : '9 Ranks & Leadership Pool'}</span>
                </span>
                {dir === 'rtl' ? <ArrowLeft className="w-3.5 h-3.5 text-slate-400" /> : <ArrowRight className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            </div>
          </div>
        </motion.aside>

        {/* Accordion List */}
        <div className="lg:col-span-8 space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-10 rounded-3xl bg-slate-900/50 border border-white/10 text-center space-y-2">
              <Search className="w-7 h-7 text-slate-500 mx-auto" />
              <div className="text-sm font-bold text-white">
                {isFa ? 'پرسشی با این مشخصات یافت نشد' : 'No matching questions found'}
              </div>
              <p className="text-xs text-slate-400">
                {isFa ? 'عبارت جستجو یا دسته‌بندی انتخابی را تغییر دهید.' : 'Try adjusting your search query or selected topic.'}
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(idx * 0.05, 0.25) }}
                  className={`rounded-2xl border transition-colors ${
                    isOpen
                      ? 'bg-slate-900/90 border-cyan-500/35'
                      : 'bg-slate-900/55 border-white/10 hover:border-white/20'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(faq.id)}
                    className="w-full p-5 flex items-center justify-between gap-4 cursor-pointer text-start"
                  >
                    <h3 className="text-sm sm:text-base font-bold text-white leading-snug">{faq.question}</h3>
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-3 border-t border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      </section>

      {/* SECTION 3: DIRECT SUPPORT DESK BANNER */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-7 sm:p-9 rounded-3xl bg-gradient-to-r from-slate-900 via-[#081020] to-slate-900 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-1.5 text-center sm:text-start">
          <h3 className="text-lg font-black text-white">
            {isFa ? 'پاسخ سوال خود را پیدا نکردید؟' : "Couldn't find the answer you need?"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            {isFa
              ? 'تیم پشتیبانی فنی و بازاریابی تیجکس آماده پاسخگویی ۲۴ ساعته به سوالات شماست.'
              : 'Our technical and network support desk is available 24/7 to assist you.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('support-tickets')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/25 flex items-center gap-2 transition cursor-pointer shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{isFa ? 'ثبت تیکت پشتیبانی' : 'Submit Support Ticket'}</span>
        </button>
      </motion.section>

    </div>
  );
};

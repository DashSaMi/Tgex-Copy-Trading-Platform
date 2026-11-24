import React from 'react';
import { motion } from 'motion/react';
import { PageId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCmsContent } from '../../services/cmsService';
import aboutHqImg from '../../assets/images/about_fintech_hq_1795337867064.jpg';
import ctaBgImg from '../../assets/images/cta_dark_fintech_bg_1795337865399.jpg';
import {
  Globe,
  Target,
  Eye,
  ShieldCheck,
  Network,
  Zap,
  ArrowRight,
  ArrowLeft,
  Lock,
  Layers,
  ArrowUpRight,
  Headphones,
  MessageCircle,
  Scale,
  FileText,
  ShieldAlert,
  Crown,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  HelpCircle
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { language, dir } = useLanguage();
  const isFa = language === 'fa';
  const cms = useCmsContent();

  const slideIn = (direction: 'left' | 'right') => ({
    hidden: { opacity: 0, x: direction === 'left' ? -36 : 36 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }
    }
  });

  const pillars = [
    {
      icon: Lock,
      title: isFa ? (cms?.about?.pillar1Title || 'معماری بدون تصدی (Non-Custodial)') : 'Zero-Custody Architecture',
      desc: isFa
        ? (cms?.about?.pillar1Desc || 'دارایی‌ها همواره در حساب شخصی کاربر در صرافی باقی می‌ماند. تیجکس هیچ‌گونه دسترسی برداشت ندارد و صرفاً زیرساخت محاسبه پاداش بازاریابی را فراهم می‌کند.')
        : 'Capital remains strictly in your personal exchange account. TGEX provides zero-withdrawal marketing telemetry and transparent reward accounting.',
      badgeBg: 'bg-blue-500/10 border-blue-500/30',
      iconColor: 'text-blue-400',
      dotBg: 'bg-blue-500',
      hoverBorder: 'hover:border-blue-500/45'
    },
    {
      icon: Network,
      title: isFa ? (cms?.about?.pillar2Title || 'سیستم خورشیدی و اسپیل‌اور ۲۰ سطح') : '20-Level Sun System & Spillover',
      desc: isFa
        ? (cms?.about?.pillar2Desc || 'محدودیت ۲۰ معرفی مستقیم در جایگاه اول و فعال‌سازی خودکار Spillover از نفر ۲۱ به بعد، همراه با محاسبه پورسانت بر مبنای Sponsor واقعی.')
        : 'Max 20 direct frontlines with automated Spillover placement from member 21 onward, while commissions stay anchored strictly to the real Sponsor.',
      badgeBg: 'bg-cyan-500/10 border-cyan-500/30',
      iconColor: 'text-cyan-400',
      dotBg: 'bg-cyan-500',
      hoverBorder: 'hover:border-cyan-500/45'
    },
    {
      icon: Zap,
      title: isFa ? (cms?.about?.pillar3Title || 'توزیع قطعی و شفاف ۲۰٪ بازاریابی') : 'Deterministic 20% Marketing Split',
      desc: isFa
        ? (cms?.about?.pillar3Desc || 'تفکیک دقیق سود: ۵۰٪ سرمایه‌گذار، ۳۰٪ تریدر و ۲۰٪ سیستم بازاریابی (۳٪ مستقیم، ۱۴٪ شبکه ۲۰ سطحی و ۳٪ استخر رهبری).')
        : 'Exact profit split: 50% Investor, 30% Trader, and 20% Marketing Pool (3% Direct, 14% across 20 Network Levels, and 3% Leadership Pool).',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/30',
      iconColor: 'text-emerald-400',
      dotBg: 'bg-emerald-500',
      hoverBorder: 'hover:border-emerald-500/45'
    }
  ];

  const complianceItems = [
    {
      icon: Scale,
      label: isFa ? 'قوانین و مقررات' : 'Terms & Conditions',
      desc: isFa ? 'چارچوب حقوقی عضویت و شفافیت ساختار' : 'Legal membership framework & rule clarity',
      page: 'terms' as PageId,
      iconWrap: 'bg-blue-500/10 border-blue-500/25 text-blue-400',
      hoverText: 'group-hover:text-blue-400'
    },
    {
      icon: ShieldCheck,
      label: isFa ? 'حریم خصوصی' : 'Privacy Policy',
      desc: isFa ? 'حفاظت رمزنگاری‌شده از هویت و داده‌های شبکه' : 'Encrypted identity and network data protection',
      page: 'privacy' as PageId,
      iconWrap: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
      hoverText: 'group-hover:text-emerald-400'
    },
    {
      icon: ShieldAlert,
      label: isFa ? 'افشای ریسک' : 'Risk Disclosure',
      desc: isFa ? 'بیانیه رسمی ریسک‌های بازارهای مالی جهانی' : 'Official disclosure of market volatility risks',
      page: 'risk' as PageId,
      iconWrap: 'bg-amber-500/10 border-amber-500/25 text-amber-400',
      hoverText: 'group-hover:text-amber-400'
    },
    {
      icon: FileText,
      label: isFa ? 'استاندارد AML / KYC' : 'AML / KYC Standards',
      desc: isFa ? 'انطباق کامل با مقررات احراز هویت و ضد پولشویی' : 'Full identity verification & AML compliance',
      page: 'terms' as PageId,
      iconWrap: 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400',
      hoverText: 'group-hover:text-cyan-400'
    }
  ];

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 overflow-x-hidden" dir={dir}>

      {/* ═══════════════════════════════════════════════════════
          SECTION 1: ARCHITECTURAL HERO WITH HQ VISUAL BACKDROP
          ═══════════════════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-10 pb-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-950 min-h-[460px] sm:min-h-[520px] flex items-center shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#070B14] to-slate-950" />
          <img
            src={aboutHqImg}
            alt={isFa ? 'دفتر مرکزی و زیرساخت معماری تیجکس' : 'TGEX Institutional Fintech Headquarters'}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-slate-950/70 to-slate-950/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05070a]/85 via-transparent to-[#05070a]/60" />

          <div className="relative z-10 w-full p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap items-center gap-2 text-xs font-mono text-cyan-300"
              >
                <span className="font-bold">TGEX</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{isFa ? (cms?.about?.tagline || 'درباره اکوسیستم تیجکس') : 'ABOUT TGEX ECOSYSTEM'}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-400">{isFa ? 'زیرساخت بازاریابی صرافی' : 'EXCHANGE MARKETING INFRASTRUCTURE'}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.5 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] text-balance"
              >
                {isFa ? (
                  cms?.about?.title ? (
                    <span>{cms.about.title}</span>
                  ) : (
                    <>
                      معماری نوین{' '}
                      <span className="bg-clip-text text-transparent bg-gradient-to-l from-blue-400 via-cyan-300 to-emerald-400">
                        بازاریابی شبکه‌ای
                      </span>{' '}
                      و توسعه اکوسیستم
                    </>
                  )
                ) : (
                  <>
                    Modern{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
                      Network Marketing
                    </span>{' '}
                    Architecture
                  </>
                )}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26, duration: 0.5 }}
                className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed"
              >
                {isFa
                  ? (cms?.about?.subtitle || 'تیجکس به‌عنوان بازوی بازاریابی و توسعه ساختار ۲۰ سطحی صرافی طراحی شده است تا تقسیم سود شفاف، ارتقای رتبه‌های شایستگی و همکاری تیمی پایدار را با استانداردهای بین‌المللی ارائه دهد.')
                  : 'TGEX is engineered as the dedicated 20-level exchange marketing ecosystem delivering transparent profit-sharing accounting, merit-based leadership ranks, and institutional governance.'}
              </motion.p>
            </div>

            {/* Key Architectural Ratio Summary */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34, duration: 0.5 }}
              className="lg:col-span-4 rounded-2xl bg-slate-950/85 border border-white/15 backdrop-blur-md p-5 space-y-3"
            >
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                {isFa ? 'الگوی رسمی توزیع سود' : 'OFFICIAL PROFIT ALLOCATION'}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5">
                  <div className="text-lg font-black text-emerald-400 font-mono tabular-nums">50%</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">{isFa ? 'سرمایه‌گذار' : 'Investor'}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5">
                  <div className="text-lg font-black text-blue-400 font-mono tabular-nums">30%</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">{isFa ? 'تریدر' : 'Trader'}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5">
                  <div className="text-lg font-black text-cyan-400 font-mono tabular-nums">20%</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">{isFa ? 'بازاریابی' : 'Marketing'}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2: MISSION & VISION — CONTRAST SLIDE PANELS
          ═══════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <motion.div
            variants={slideIn(isFa ? 'right' : 'left')}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="group relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900/85 to-[#070B14] border border-white/10 hover:border-blue-500/40 transition-colors duration-300 overflow-hidden"
          >
            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-xs font-mono text-slate-500">01 · MISSION</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {isFa ? (cms?.about?.missionTitle || 'ماموریت ما') : 'Our Mission'}
              </h2>
              <p className="text-slate-300/85 leading-relaxed text-sm sm:text-base">
                {isFa
                  ? (cms?.about?.missionText || 'ایجاد یک بستر شفاف، قابل راستی‌آزمایی و عادلانه برای توسعه جامعه کاربران صرافی؛ جایی که سهم هر معرف و لیدر شبکه دقیقاً مطابق ساختار ۲۰ سطحی و قانون Sponsor واقعی محاسبه می‌شود.')
                  : 'To build a transparent, verifiable framework for community growth where every sponsor contribution and leadership milestone is rewarded deterministically across 20 network layers.'}
              </p>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono tabular-nums">
                <span>{isFa ? (cms?.about?.missionStat || '۲۰ سطح ساختار شبکه') : '20 Network Layers'}</span>
                <span className="text-blue-400">{isFa ? 'توزیع ۱۴٪ + ۳٪ + ۳٪' : '14% + 3% + 3% Split'}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={slideIn(isFa ? 'left' : 'right')}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="group relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900/85 to-[#070B14] border border-white/10 hover:border-cyan-500/40 transition-colors duration-300 overflow-hidden"
          >
            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Eye className="w-6 h-6 text-cyan-400" />
                </div>
                <span className="text-xs font-mono text-slate-500">02 · VISION</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {isFa ? (cms?.about?.visionTitle || 'چشم‌انداز جهانی') : 'Global Vision'}
              </h2>
              <p className="text-slate-300/85 leading-relaxed text-sm sm:text-base">
                {isFa
                  ? (cms?.about?.visionText || 'تبدیل شدن به استاندارد مرجع شبکه‌های بازاریابی فین‌تک با ۹ رتبه حرفه‌ای (از استارتر تا راهبر ارشد)، تعادل خطوط رقابتی و حفظ کامل مالکیت سرمایه در صرافی.')
                  : 'To set the benchmark for compliant fintech marketing networks featuring 9 merit ranks from Starter to Senior Leader, balanced leg competition, and full non-custodial security.'}
              </p>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono tabular-nums">
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>{isFa ? (cms?.about?.visionStat || '۹ رتبه شایستگی لیدری') : '9 Leadership Ranks'}</span>
                </span>
                <span className="text-cyan-400">{isFa ? 'حفظ حاکمیت سرمایه' : 'Non-Custodial Core'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3: 3 ARCHITECTURAL PILLARS — TIMELINE TRACK
          ═══════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center mb-14 space-y-3"
        >
          <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            {isFa ? 'بنیان‌های فنی سامانه' : 'CORE ENGINEERING PILLARS'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white text-balance">
            {isFa ? '۳ ستون اصلی معماری تیجکس' : 'The 3 Architectural Pillars'}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">
            {isFa
              ? 'ساختاری که شفافیت، توزیع عادلانه پاداش و امنیت دارایی را در تمامی لایه‌ها تضمین می‌کند.'
              : 'Infrastructure built to guarantee clarity, fair commission routing, and user asset sovereignty.'}
          </p>
        </motion.div>

        <div className="relative">
          {/* Animated Timeline Connecting Track */}
          <div className="hidden md:block absolute top-8 left-12 right-12 h-0.5 bg-slate-800 z-0 overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
              className={`h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 ${isFa ? 'origin-right' : 'origin-left'}`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
            {pillars.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.15, duration: 0.5 }}
                className="group relative"
              >
                <div className="hidden md:flex items-center justify-center mb-6">
                  <div className="w-4 h-4 rounded-full bg-[#05070a] border-2 border-slate-700 flex items-center justify-center group-hover:scale-125 transition-transform">
                    <div className={`w-2 h-2 rounded-full ${pillar.dotBg}`} />
                  </div>
                </div>

                <div
                  className={`p-7 rounded-3xl bg-slate-900/65 border border-white/10 ${pillar.hoverBorder} transition-all duration-300 hover:-translate-y-1.5 shadow-xl h-full flex flex-col`}
                >
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 ${pillar.badgeBg}`}>
                    <pillar.icon className={`w-6 h-6 ${pillar.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-black text-white mb-2.5">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{pillar.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4: INTERACTIVE ECOSYSTEM BENTO EXPLORER
          ═══════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 border-b border-white/10 pb-6"
        >
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-blue-400 font-bold">ECOSYSTEM DIRECTORY</div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              {isFa ? 'اکوسیستم در یک نگاه' : 'Ecosystem at a Glance'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">
            {isFa
              ? 'دسترسی سریع به بخش‌های ساختار ۲۰ سطحی، رتبه‌های سازمانی و مرکز راهنما.'
              : 'Direct navigation to the 20-level matrix, leadership ranks, and knowledge desk.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[minmax(170px,auto)]">
          {/* Card 1: 20 Levels Plan */}
          <motion.button
            type="button"
            onClick={() => onNavigate('levels')}
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className="md:col-span-4 md:row-span-2 group relative p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-blue-950/50 via-slate-900/90 to-slate-950 border border-white/10 hover:border-blue-500/40 overflow-hidden cursor-pointer text-start flex flex-col justify-between"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/35 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6 text-blue-400" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-2 pt-8">
              <div className="text-[11px] font-mono text-blue-400">14% NETWORK · 20 LAYERS</div>
              <h3 className="text-2xl font-black text-white">
                {isFa ? 'طرح درآمدی ۲۰ سطحی و منطق Spillover' : '20-Level Plan & Spillover Matrix'}
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-lg leading-relaxed">
                {isFa
                  ? 'بررسی درصد پورسانت دقیق از سطح ۱ (۳.۰۰٪) تا سطح ۲۰ (۰.۰۵٪) به‌همراه قانون سقف ۲۰ معرفی مستقیم.'
                  : 'Inspect exact payout curves from Level 1 (3.00%) down to Level 20 (0.05%) with the 20-direct cap rule.'}
              </p>
            </div>
          </motion.button>

          {/* Card 2: Ranks */}
          <motion.button
            type="button"
            onClick={() => onNavigate('ranks')}
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className="md:col-span-2 group relative p-6 rounded-3xl bg-gradient-to-br from-amber-950/35 via-slate-900/90 to-slate-950 border border-white/10 hover:border-amber-500/40 overflow-hidden cursor-pointer text-start flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <Crown className="w-7 h-7 text-amber-400" />
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
            </div>
            <div className="pt-6">
              <h3 className="text-lg font-black text-white">{isFa ? '۹ رتبه لیدری' : '9 Leader Ranks'}</h3>
              <p className="text-slate-400 text-xs mt-1">
                {isFa ? 'از استارتر تا راهبر ارشد با سهم استخر ۳٪' : 'Starter to Senior Leader · 3% Pool'}
              </p>
            </div>
          </motion.button>

          {/* Card 3: FAQ */}
          <motion.button
            type="button"
            onClick={() => onNavigate('faq')}
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className="md:col-span-2 group relative p-6 rounded-3xl bg-gradient-to-br from-cyan-950/35 via-slate-900/90 to-slate-950 border border-white/10 hover:border-cyan-500/40 overflow-hidden cursor-pointer text-start flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <HelpCircle className="w-7 h-7 text-cyan-400" />
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
            </div>
            <div className="pt-6">
              <h3 className="text-lg font-black text-white">{isFa ? 'پرسش‌های متداول' : 'FAQ Knowledge Desk'}</h3>
              <p className="text-slate-400 text-xs mt-1">
                {isFa ? 'پاسخ رسمی درباره Sponsor و تسویه' : 'Official rules on Sponsor & payouts'}
              </p>
            </div>
          </motion.button>

          {/* Card 4: Dashboard / Network */}
          <motion.button
            type="button"
            onClick={() => onNavigate('dashboard')}
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className="md:col-span-6 group relative p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-emerald-950/35 via-slate-900/90 to-slate-950 border border-white/10 hover:border-emerald-500/40 overflow-hidden cursor-pointer text-start flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  {isFa ? 'داشبورد شخصی، درخت شبکه و گزارش پورسانت شما' : 'Personal Dashboard, Network Tree & Your Earnings'}
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  {isFa
                    ? 'مشاهده مستقیم ارتباطات شبکه، جایگاه لایه‌ها و درآمد اختصاصی حساب کاربری شما'
                    : 'Inspect your personal network connections, tier position, and direct commission ledger'}
                </p>
              </div>
            </div>
            <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-white shrink-0 transition-colors" />
          </motion.button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5: COMPLIANCE & GOVERNANCE STRIP
          ═══════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 space-y-3"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            {isFa ? 'شفافیت حقوقی و استانداردها' : 'Compliance & Transparency'}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">
            {isFa ? 'تعهد کامل به قوانین بین‌المللی، احراز هویت و حفاظت از داده‌های کاربران.' : 'Full commitment to international standards, KYC verification, and user data protection.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {complianceItems.map((item, i) => (
            <motion.button
              key={i}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              onClick={() => onNavigate(item.page)}
              className="group p-6 rounded-2xl bg-slate-900/65 border border-white/10 hover:border-white/25 cursor-pointer transition-all hover:-translate-y-1 text-start"
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${item.iconWrap}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-white font-bold text-sm">{item.label}</span>
                {isFa ? (
                  <ChevronLeft className={`w-4 h-4 text-slate-600 ${item.hoverText} transition-colors`} />
                ) : (
                  <ChevronRight className={`w-4 h-4 text-slate-600 ${item.hoverText} transition-colors`} />
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{item.desc}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 6: ARCHITECTURAL SUPPORT DESK BANNER
          ═══════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="relative rounded-3xl overflow-hidden border border-white/15 bg-slate-950 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#070B14] to-slate-950" />
          <img
            src={ctaBgImg}
            alt={isFa ? 'پشتیبانی تخصصی تیجکس' : 'TGEX Support Infrastructure'}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/65" />

          <div className="relative z-10 p-8 sm:p-12 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-start space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
                <Headphones className="w-4 h-4 text-cyan-400" />
                <span>{isFa ? 'پشتیبانی ۲۴/۷ · پاسخگویی مستقیم' : '24/7 GLOBAL DESK · DIRECT RESPONSE'}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight text-balance">
                {isFa ? 'تیم پشتیبانی و توسعه شبکه همیشه در کنار شماست' : 'Our Support & Network Desk Is Always Ready'}
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                {isFa
                  ? 'در هر ساعت از شبانه‌روز می‌توانید از طریق تیکت مستقیم با کارشناسان فنی و بازاریابی تیجکس در ارتباط باشید.'
                  : 'Connect directly with TGEX technical and marketing specialists at any time through our support desk.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>{isFa ? 'تماس و ثبت تیکت' : 'Contact Support'}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('faq')}
                className="px-7 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-100 font-bold text-sm border border-white/15 hover:border-cyan-400/40 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>{isFa ? 'مرکز سوالات متداول' : 'Browse FAQ'}</span>
                {dir === 'rtl' ? <ArrowLeft className="w-4 h-4 shrink-0" /> : <ArrowRight className="w-4 h-4 shrink-0" />}
              </button>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
};
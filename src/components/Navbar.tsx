import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PageId, User } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { 
  Menu, 
  X, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  UserCheck, 
  LogOut, 
  ChevronDown, 
  ArrowLeft,
  ArrowRight,
  LayoutDashboard,
  User as UserIcon,
  Award,
  HelpCircle,
  PhoneCall,
  Globe,
  Bell,
  Sparkles,
  Trophy,
  Crown,
  CheckCircle2,
  Zap,
  Search
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  onLogout
}) => {
  const { t, language, dir } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [drawerSearchQuery, setDrawerSearchQuery] = useState('');
  const [infoDropdownOpen, setInfoDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setInfoDropdownOpen(false);
    setNotificationOpen(false);
    setDrawerSearchQuery('');
  };

  // Dynamic rank upgrade alerts based on user status
  const currentRank = currentUser?.rankName || 'عضو عادی';
  const directCount = currentUser?.directReferralsCount ?? 0;
  const nextRankTarget = directCount < 3 ? 'Silver' : directCount < 8 ? 'Gold' : directCount < 15 ? 'Platinum' : 'Diamond';
  const hasUpgradeReady = directCount >= 1;

  const notifications = [
    {
      id: 'notif_1',
      title: language === 'fa' ? 'پیشرفت رتبه سازمانی' : 'Rank Advancement Milestone',
      desc: language === 'fa' 
        ? `رتبه فعلی شما: ${currentRank}. جهت ارتقا به رتبه بعدی (${nextRankTarget})، پیش‌نیازهای معرفی مستقیم را بررسی فرمایید.`
        : `Current Rank: ${currentRank}. View requirements to unlock ${nextRankTarget} executive rank perks.`,
      icon: Trophy,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      time: language === 'fa' ? 'امروز' : 'Today',
      action: 'ranks' as PageId
    },
    {
      id: 'notif_2',
      title: language === 'fa' ? 'پاداش لایه‌ای سیستم هیبرید' : '20-Tier Hybrid System Active',
      desc: language === 'fa'
        ? 'پاداش‌های ساختاری ۲۰ سطحی به صورت لحظه‌ای و خودکار با فعالیت زیرمجموعه‌ها در حساب شما ثبت می‌گردند.'
        : '20-tier structural commissions are dynamically distributed across active downline tiers.',
      icon: Sparkles,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
      time: language === 'fa' ? 'فعال' : 'Active',
      action: 'levels' as PageId
    }
  ];

  return (
    <>
      {/* Fixed Header */}
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#05070A]/95 backdrop-blur-xl border-b border-white/15 shadow-2xl shadow-black/60 py-0' 
          : 'bg-[#05070A]/90 backdrop-blur-md border-b border-white/10 py-0.5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white font-black text-base font-mono shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              TG
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl text-white tracking-wider font-mono">TGEX</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
                  v2.4
                </span>
              </div>
              <div className="text-[10px] text-slate-400 -mt-1 font-semibold">
                {t('nav.tagline', 'پلتفرم بازاریابی و کپی تریدینگ')}
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold relative">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                currentPage === 'home'
                  ? 'text-white bg-white/10 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t('nav.home', 'صفحه اصلی')}
            </button>
            
            <button
              onClick={() => handleNavClick('about')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                currentPage === 'about'
                  ? 'text-white bg-white/10 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t('nav.about', 'درباره ما')}
            </button>

            <button
              onClick={() => handleNavClick('blog')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                currentPage === 'blog' || currentPage === 'blog-detail'
                  ? 'text-white bg-white/10 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t('nav.blog', 'وبلاگ')}
            </button>

            {/* Info Dropdown */}
            <div className="relative group" onMouseEnter={() => setInfoDropdownOpen(true)} onMouseLeave={() => setInfoDropdownOpen(false)}>
              <button
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap text-slate-400 hover:text-white hover:bg-white/5`}
              >
                <span>{t('nav.platform_info', 'اطلاعات پلتفرم')}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {infoDropdownOpen && (
                <div className={`absolute top-full pt-2 z-50 ${dir === 'rtl' ? 'right-0' : 'left-0'}`}>
                  <div className="w-48 rounded-xl bg-[#05070A] border border-white/10 shadow-xl overflow-hidden flex flex-col">
                    <button
                      onClick={() => handleNavClick('levels')}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                    >
                      <span>{t('nav.levels', '۲۰ سطح پلتفرم')}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono">A-T</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('ranks')}
                      className={`w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                    >
                      {t('nav.ranks', 'رتبه‌ها و افتخارات')}
                    </button>
                    <button
                      onClick={() => handleNavClick('faq')}
                      className={`w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                    >
                      {t('nav.faq', 'سوالات متداول')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* User / Auth Actions & Language Switcher */}
          <div className="hidden lg:flex items-center gap-2.5">
            
            {/* Rank Upgrade Notification Box */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className={`relative p-2.5 rounded-xl transition border ${
                  notificationOpen
                    ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                    : 'bg-slate-900/80 border-white/10 hover:border-white/20 text-slate-300 hover:text-white'
                }`}
                title={t('nav.notifications', 'اعلان‌های رتبه و پاداش')}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              </button>

              <AnimatePresence>
                {notificationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute top-full mt-2 w-84 sm:w-96 rounded-2xl bg-[#090D16] border border-white/15 shadow-2xl p-4 z-50 ${
                      dir === 'rtl' ? 'left-0 sm:right-auto' : 'right-0 sm:left-auto'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-white">
                          {t('nav.notifications', 'اعلان‌های رتبه و پاداش')}
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                        2 {language === 'fa' ? 'پیام جدید' : 'New'}
                      </span>
                    </div>

                    <div className="py-2 space-y-2.5 max-h-72 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNavClick(notif.action)}
                          className={`p-3 rounded-xl border ${notif.bg} cursor-pointer hover:brightness-110 transition space-y-1.5`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${notif.color} flex items-center gap-1.5`}>
                              <notif.icon className="w-3.5 h-3.5" />
                              <span>{notif.title}</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{notif.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            {notif.desc}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <button
                        onClick={() => handleNavClick('ranks')}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                      >
                        <span>{t('nav.view_rank_progress', 'مشاهده پیشرفت رتبه')}</span>
                        {dir === 'rtl' ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                      </button>
                      <button
                        onClick={() => setNotificationOpen(false)}
                        className="text-[11px] text-slate-400 hover:text-white"
                      >
                        {language === 'fa' ? 'بستن' : 'Close'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Language Switcher Button in Navbar */}
            <LanguageSwitcher variant="navbar" />

            {currentUser ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="flex items-center gap-2.5 p-1.5 px-3 rounded-2xl bg-slate-900 border border-white/10 hover:border-blue-500/40 transition text-xs"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-600/30 text-blue-300 border border-blue-400/30 flex items-center justify-center font-bold font-mono">
                  {currentUser.fullName ? currentUser.fullName[0] : 'U'}
                </div>
                <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
                  <div className="font-bold text-white leading-tight">
                    {currentUser.fullName || currentUser.email}
                  </div>
                  <div className="text-[10px] text-blue-400 font-mono">
                    {currentUser.networkLevel || 'Level A'}
                  </div>
                </div>
              </button>
            ) : (
              <div className="flex items-center rounded-2xl bg-slate-950/80 border border-white/15 p-1 shadow-inner">
                <button
                  onClick={() => handleNavClick('login')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    currentPage === 'login'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>{t('nav.login', 'ورود')}</span>
                </button>
                <div className="w-[1px] h-3.5 bg-white/15 mx-1" />
                <button
                  onClick={() => handleNavClick('signup')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    currentPage === 'signup'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{t('nav.register', 'ثبت‌نام')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Header Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher variant="compact" />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Navigation (Rendered via createPortal at document.body level for absolute z-index priority and free of header backdrop-filter containing block) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <div 
              id="mobile-nav-drawer-portal" 
              className="fixed inset-0 z-[999999] lg:hidden"
            >
              {/* Fullscreen Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setDrawerSearchQuery('');
                }}
                className="fixed inset-0 bg-[#05070A]/85 backdrop-blur-md z-[999998]"
              />

              {/* Slide-in Drawer Container */}
              <motion.div
                initial={{ x: dir === 'rtl' ? '100%' : '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: dir === 'rtl' ? '100%' : '-100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className={`fixed top-0 bottom-0 ${
                  dir === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'
                } w-84 max-w-[88vw] h-full h-[100dvh] bg-[#0B0F19] border-white/10 p-5 sm:p-6 flex flex-col justify-between shadow-2xl shadow-black/90 overflow-y-auto z-[999999]`}
              >
                <div className="space-y-4">
                  
                  {/* Top Bar with Brand and Close Button */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs font-mono shadow-md shadow-blue-500/30">
                        TG
                      </div>
                      <div>
                        <span className="font-bold text-white text-sm block leading-tight">TGEX Network</span>
                        <span className="text-[10px] text-slate-400 font-mono">20-Tier Ecosystem</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setDrawerSearchQuery('');
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-white/10 transition"
                      aria-label="Close menu"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Search Input so user can search directly from mobile slider */}
                  <div className="relative">
                    <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'right-3' : 'left-3'}`} />
                    <input
                      type="text"
                      value={drawerSearchQuery}
                      onChange={(e) => setDrawerSearchQuery(e.target.value)}
                      placeholder={language === 'fa' ? 'جستجوی صفحات و بخش‌ها...' : 'Search pages & features...'}
                      className={`w-full ${dir === 'rtl' ? 'pr-9 pl-8' : 'pl-9 pr-8'} py-2.5 rounded-xl bg-slate-900/90 border border-white/15 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 transition`}
                    />
                    {drawerSearchQuery && (
                      <button
                        onClick={() => setDrawerSearchQuery('')}
                        className={`absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'left-2.5' : 'right-2.5'} p-1 text-slate-400 hover:text-white rounded-md`}
                        aria-label="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Mobile Dashboard Section (Single unified gateway with User Level) */}
                  {currentUser && !drawerSearchQuery.trim() && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950/30 to-slate-950 border border-blue-500/30 shadow-lg shadow-blue-500/5 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-white text-sm truncate max-w-[170px]">{currentUser.fullName || currentUser.email}</div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold border border-blue-500/30">
                          {currentUser.networkLevel || 'Level C3'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>{t('nav.dashboard', 'ورود به داشبورد')}</span>
                      </button>
                    </div>
                  )}

                  {/* Filterable Navigation List (Dashboard only listed in search results to avoid duplicate) */}
                  <nav className="space-y-1 text-xs">
                    {(() => {
                      const searchableNavLinks = [
                        ...(currentUser && drawerSearchQuery.trim() ? [{
                          id: 'dashboard' as PageId,
                          label: t('nav.dashboard', 'داشبورد کاربری'),
                          sub: language === 'fa' ? 'حساب کاربری، شبکه زیرمجموعه‌ها، مالی و تیکت‌ها' : 'User account, downline network, finances & tickets',
                          icon: LayoutDashboard,
                          badge: currentUser.networkLevel || 'Level C3'
                        }] : []),
                        {
                          id: 'home' as PageId,
                          label: t('nav.home', 'صفحه اصلی'),
                          sub: language === 'fa' ? 'پلن ۲۰ لول، محاسبه‌گر سود و کپی‌تریدینگ' : '20-tier plan, profit calculator & copy-trading',
                          icon: TrendingUp
                        },
                        {
                          id: 'about' as PageId,
                          label: t('nav.about', 'درباره ما'),
                          sub: language === 'fa' ? 'معماری امن، تیم توسعه و زیرساخت نان‌کاستودیال' : 'Non-custodial architecture, security & team',
                          icon: ShieldCheck
                        },
                        {
                          id: 'blog' as PageId,
                          label: t('nav.blog', 'وبلاگ و مقالات'),
                          sub: language === 'fa' ? 'راهنماهای آموزشی، استراتژی‌ها و مستندات سیستم' : 'Educational guides, strategies & system docs',
                          icon: Sparkles
                        },
                        {
                          id: 'levels' as PageId,
                          label: t('nav.levels', '۲۰ سطح پلتفرم'),
                          sub: language === 'fa' ? 'جدول درصد سود کمیسیون هر لایه شبکه از ۱ تا ۲۰' : 'Matrix commission rates for all 20 network levels',
                          icon: Layers,
                          badge: 'A-T'
                        },
                        {
                          id: 'ranks' as PageId,
                          label: t('nav.ranks', 'رتبه‌ها و افتخارات'),
                          sub: language === 'fa' ? 'سطوح سازمانی از سیلور تا اینفینیتی و پاداش‌ها' : 'Organizational ranks from Silver to Infinity & perks',
                          icon: Trophy
                        },
                        {
                          id: 'faq' as PageId,
                          label: t('nav.faq', 'سوالات متداول'),
                          sub: language === 'fa' ? 'پاسخ به سوالات واریز، برداشت، رفرال و بروکر' : 'Common questions on deposits, withdrawals & MT5 broker',
                          icon: HelpCircle
                        }
                      ];

                      const filtered = drawerSearchQuery.trim()
                        ? searchableNavLinks.filter(item => 
                            item.label.toLowerCase().includes(drawerSearchQuery.toLowerCase()) ||
                            item.sub.toLowerCase().includes(drawerSearchQuery.toLowerCase()) ||
                            item.id.toLowerCase().includes(drawerSearchQuery.toLowerCase())
                          )
                        : searchableNavLinks;

                      if (filtered.length === 0) {
                        return (
                          <div className="text-center py-6 px-3 bg-slate-900/50 rounded-xl border border-white/5 space-y-2">
                            <p className="text-slate-400 text-xs">
                              {language === 'fa' ? 'موردی مطابق با جستجوی شما یافت نشد.' : 'No results matching your query.'}
                            </p>
                            <button
                              onClick={() => setDrawerSearchQuery('')}
                              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                            >
                              {language === 'fa' ? 'پاک کردن جستجو' : 'Clear search'}
                            </button>
                          </div>
                        );
                      }

                      return filtered.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = currentPage === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition ${
                              isActive
                                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 overflow-hidden text-start">
                              <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                              <div className="truncate">
                                <span className="font-semibold block">{item.label}</span>
                                {drawerSearchQuery && (
                                  <span className="text-[10px] text-slate-400 block truncate">{item.sub}</span>
                                )}
                              </div>
                            </div>
                            {item.badge && (
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono shrink-0 ${
                                isActive ? 'bg-white/20 text-white' : 'bg-blue-500/20 text-blue-300'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      });
                    })()}
                  </nav>

                </div>

                {/* Mobile Auth Buttons */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  {currentUser ? (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setDrawerSearchQuery('');
                        onLogout();
                      }}
                      className="w-full py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-400 font-bold text-xs border border-rose-500/20 flex items-center justify-center gap-2 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('nav.logout', 'خروج از حساب')}</span>
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleNavClick('signup')}
                        className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/15 text-white font-bold text-xs transition"
                      >
                        {t('nav.register', 'ثبت‌نام در پلتفرم (Signup)')}
                      </button>
                      <button
                        onClick={() => handleNavClick('login')}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition"
                      >
                        {t('nav.login', 'ورود به حساب کاربری (Login)')}
                      </button>
                    </div>
                  )}
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Spacer for fixed header */}
      <div className="h-18" />
    </>
  );
};


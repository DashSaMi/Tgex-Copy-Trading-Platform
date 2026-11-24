import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { PageId, BlogPost } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { blogService } from '../../services/blogService';
import { useCmsContent } from '../../services/cmsService';
import { HOW_IT_WORKS_STEPS } from '../../data/mockData';
import ctaBgImg from '../../assets/images/cta_dark_fintech_bg_1795337865399.jpg';
import { 
  ShieldCheck, 
  Layers, 
  TrendingUp, 
  ArrowLeft, 
  ArrowRight,
  Zap, 
  CheckCircle2, 
  Lock, 
  Users, 
  Share2, 
  BarChart3, 
  Cpu, 
  Sparkles,
  Award,
  ChevronRight,
  ChevronDown,
  Activity,
  Play,
  Network,
  Wallet,
  LineChart,
  Calculator,
  Trophy,
  Crown,
  Medal,
  Star,
  UserCheck,
  Copy,
  BookOpen,
  ArrowUpRight,
  Globe,
  Fingerprint,
  Server,
  KeyRound,
  HelpCircle,
  Rocket,
  DollarSign,
  Percent,
  Eye,
  MessageCircle,
  Zap as Lightning,
  Shield,
  TrendingDown,
  Calendar,
  Clock,
  Target,
  Flame,
  Info,
  Gem,
  Check,
  GitBranch
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

const LEVEL_COMMISSIONS = [
  { level: 1, percent: 3.00 }, { level: 2, percent: 2.00 }, { level: 3, percent: 1.60 },
  { level: 4, percent: 1.20 }, { level: 5, percent: 0.90 }, { level: 6, percent: 0.80 },
  { level: 7, percent: 0.70 }, { level: 8, percent: 0.60 }, { level: 9, percent: 0.50 },
  { level: 10, percent: 0.45 }, { level: 11, percent: 0.40 }, { level: 12, percent: 0.35 },
  { level: 13, percent: 0.30 }, { level: 14, percent: 0.25 }, { level: 15, percent: 0.25 },
  { level: 16, percent: 0.20 }, { level: 17, percent: 0.20 }, { level: 18, percent: 0.15 },
  { level: 19, percent: 0.10 }, { level: 20, percent: 0.05 }
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t, language, dir } = useLanguage();
  const cms = useCmsContent();
  const [directReferrals, setDirectReferrals] = useState(10);
  const [avgVolume, setAvgVolume] = useState(500);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [animatedStats, setAnimatedStats] = useState({ volume: 0, users: 0, rewards: 0, uptime: 0 });
  const [chartStrategy, setChartStrategy] = useState<'conservative' | 'balanced' | 'exponential'>('balanced');
  const [chartMonths, setChartMonths] = useState<6 | 12>(12);
  const [chartViewType, setChartViewType] = useState<'bar' | 'area'>('bar');
  const [selectedRankTab, setSelectedRankTab] = useState<number>(2);
  const [activeProfitSlice, setActiveProfitSlice] = useState<'investor' | 'trader' | 'network'>('network');
  const [selectedHeroBranch, setSelectedHeroBranch] = useState<'branchA' | 'branchB' | 'branchC'>('branchB');
  const [selectedHeroLevel, setSelectedHeroLevel] = useState<number>(1);


  const ranks = [
    {
      id: 'starter',
      name: language === 'fa' ? 'استارتر (Starter)' : 'Starter',
      tier: language === 'fa' ? 'رتبه ۱' : 'Tier 1',
      volume: '$50',
      bonus: '$0',
      royalty: '0%',
      color: 'from-slate-400 via-slate-500 to-slate-600',
      borderClass: 'border-slate-500/40 hover:border-slate-400/70',
      badgeClass: 'bg-slate-900/60 text-slate-300 border-slate-500/30',
      glowColor: 'rgba(100, 116, 139, 0.2)',
      icon: Medal,
      members: '0',
      perks: language === 'fa' 
        ? ['ثبت‌نام در سامانه', 'سرمایه فعال ۵۰ دلاری', 'فعال‌سازی ۳ لایه ماتریس']
        : ['System Registration', 'Active $50 Capital', 'Unlocks 3 Matrix Levels']
    },
    {
      id: 'stager',
      name: language === 'fa' ? 'استیجر (Stager)' : 'Stager',
      tier: language === 'fa' ? 'رتبه ۲' : 'Tier 2',
      volume: 'Active',
      bonus: '0',
      royalty: '0%',
      color: 'from-blue-400 via-blue-500 to-blue-600',
      borderClass: 'border-blue-500/40 hover:border-blue-400/70',
      badgeClass: 'bg-blue-900/60 text-blue-300 border-blue-500/30',
      glowColor: 'rgba(59, 130, 246, 0.2)',
      icon: Medal,
      members: '0',
      perks: language === 'fa' 
        ? ['دو کاربر فعال مستقیم', 'ارتقا به ۵ لایه', 'گسترش شبکه']
        : ['2 Direct Active Users', 'Unlocks 5 Matrix Levels', 'Network Expansion']
    },
    {
      id: 'trainer',
      name: language === 'fa' ? 'ترینر (Trainer)' : 'Trainer',
      tier: language === 'fa' ? 'رتبه ۳' : 'Tier 3',
      volume: 'Active',
      bonus: '$0',
      royalty: '0%',
      color: 'from-cyan-400 via-cyan-500 to-cyan-600',
      borderClass: 'border-cyan-500/40 hover:border-cyan-400/70',
      badgeClass: 'bg-cyan-900/60 text-cyan-300 border-cyan-500/30',
      glowColor: 'rgba(6, 182, 212, 0.2)',
      icon: Target,
      members: '0',
      perks: language === 'fa' 
        ? ['۲ کاربر استیجر در خطوط مختلف', 'ارتقا به ۱۰ لایه پورسانت', 'پاداش تیمی']
        : ['2 Stager Legs', '10 Matrix Levels', 'Team Bonus Access']
    },
    {
      id: 'advisor',
      name: language === 'fa' ? 'مشاور (Advisor)' : 'Advisor',
      tier: language === 'fa' ? 'رتبه ۴' : 'Tier 4',
      volume: 'Active',
      bonus: '$0',
      royalty: '0%',
      color: 'from-teal-400 via-teal-500 to-teal-600',
      borderClass: 'border-teal-500/40 hover:border-teal-400/70',
      badgeClass: 'bg-teal-900/60 text-teal-300 border-teal-500/30',
      glowColor: 'rgba(20, 184, 166, 0.2)',
      icon: Target,
      members: '0',
      perks: language === 'fa' 
        ? ['۲ کاربر ترینر در خطوط مختلف', '۱۵ لایه پورسانت', 'منطق رقابتی خطوط']
        : ['2 Trainer Legs', '15 Matrix Levels', 'Leg Competition Logic']
    },
    {
      id: 'guide',
      name: language === 'fa' ? 'راهنما (Guide)' : 'Guide',
      tier: language === 'fa' ? 'رتبه ۵' : 'Tier 5',
      volume: '$100K',
      bonus: 'Active',
      royalty: '0%',
      color: 'from-emerald-400 via-emerald-500 to-emerald-600',
      borderClass: 'border-emerald-500/40 hover:border-emerald-400/70',
      badgeClass: 'bg-emerald-900/60 text-emerald-300 border-emerald-500/30',
      glowColor: 'rgba(16, 185, 129, 0.2)',
      icon: Star,
      members: '0',
      perks: language === 'fa' 
        ? ['$100K حجم شبکه', 'پورسانت ۲۰ لایه کامل', '۲ عضو مشاور']
        : ['$100K AUM', 'Full 20 Levels Unlocked', '2 Advisor Legs']
    },
    {
      id: 'manager',
      name: language === 'fa' ? 'مدیر (Manager)' : 'Manager',
      tier: language === 'fa' ? 'رتبه ۶' : 'Tier 6',
      volume: '$500K',
      bonus: 'Pool',
      royalty: '0.5%',
      color: 'from-amber-400 via-amber-500 to-amber-600',
      borderClass: 'border-amber-500/40 hover:border-amber-400/70',
      badgeClass: 'bg-amber-900/60 text-amber-300 border-amber-500/30',
      glowColor: 'rgba(245, 158, 11, 0.2)',
      icon: Trophy,
      members: '0',
      perks: language === 'fa' 
        ? ['ورود به استخر جهانی', '0.5% سهم رهبری', '$500K حجم شبکه']
        : ['Global Pool Access', '0.5% Leadership Share', '$500K Team AUM']
    },
    {
      id: 'senior_manager',
      name: language === 'fa' ? 'مدیر ارشد (Senior Manager)' : 'Senior Manager',
      tier: language === 'fa' ? 'رتبه ۷' : 'Tier 7',
      volume: '$2M',
      bonus: 'Pool',
      royalty: '1%',
      color: 'from-red-400 via-red-500 to-red-600',
      borderClass: 'border-red-500/40 hover:border-red-400/70',
      badgeClass: 'bg-red-900/60 text-red-300 border-red-500/30',
      glowColor: 'rgba(239, 68, 68, 0.2)',
      icon: Trophy,
      members: '0',
      perks: language === 'fa' 
        ? ['1% سهم رهبری جهانی', 'محدودیت ۶۰٪ هر خط', '۲ عضو مدیر']
        : ['1% Global Share', '60% Max Leg Volume', '2 Manager Legs']
    },
    {
      id: 'leader',
      name: language === 'fa' ? 'راهبر (Leader)' : 'Leader',
      tier: language === 'fa' ? 'رتبه ۸' : 'Tier 8',
      volume: '$10M',
      bonus: 'Pool',
      royalty: '2.5%',
      color: 'from-purple-400 via-purple-500 to-purple-600',
      borderClass: 'border-purple-500/40 hover:border-purple-400/70',
      badgeClass: 'bg-purple-900/60 text-purple-300 border-purple-500/30',
      glowColor: 'rgba(168, 85, 247, 0.2)',
      icon: Crown,
      members: '0',
      perks: language === 'fa' 
        ? ['تاییدیه مدیریت', 'محدودیت ۵۰٪ خطوط', '2.5% استخر جهانی']
        : ['Management Approval', '50% Max Leg Volume', '2.5% Global Pool']
    },
    {
      id: 'senior_leader',
      name: language === 'fa' ? 'راهبر ارشد (Senior Leader)' : 'Senior Leader',
      tier: language === 'fa' ? 'رتبه ۹' : 'Tier 9',
      volume: '$50M',
      bonus: 'Pool',
      royalty: '5%',
      color: 'from-pink-400 via-pink-500 to-pink-600',
      borderClass: 'border-pink-500/40 hover:border-pink-400/70',
      badgeClass: 'bg-pink-900/60 text-pink-300 border-pink-500/30',
      glowColor: 'rgba(236, 72, 153, 0.2)',
      icon: Crown,
      members: '0',
      isApex: true,
      perks: language === 'fa' 
        ? ['بالاترین رتبه سیستم', '5% حق‌امتیاز دائمی', 'محدودیت ۴۰٪ خطوط']
        : ['System Apex Rank', '5% Permanent Royalty', '40% Max Leg Volume']
    }
  ];

  const [cardsPerPage, setCardsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setCardsPerPage(4);
      else if (window.innerWidth >= 768) setCardsPerPage(3);
      else if (window.innerWidth >= 640) setCardsPerPage(2);
      else setCardsPerPage(1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(ranks.length / cardsPerPage);

  useEffect(() => {
    const rankTimer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 6000);
    return () => clearInterval(rankTimer);
  }, [totalPages]);

  const visibleRanks = ranks.slice(
    currentPage * cardsPerPage,
    (currentPage + 1) * cardsPerPage
  );

  const calculateEarnings = () => {
    let total = 0;
    LEVEL_COMMISSIONS.forEach((lvl, idx) => {
      const peoplePerLevel = Math.pow(directReferrals, idx + 1);
      const cappedPeople = Math.min(peoplePerLevel, 50000);
      total += (cappedPeople * avgVolume * lvl.percent) / 100;
    });
    return total;
  };

  useEffect(() => {
    const targets = { volume: 128, users: 47500, rewards: 3.2, uptime: 99.9 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setAnimatedStats({
        volume: +(targets.volume * progress).toFixed(1),
        users: Math.floor(targets.users * progress),
        rewards: +(targets.rewards * progress).toFixed(1),
        uptime: +(targets.uptime * progress).toFixed(1)
      });
      if (currentStep >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const earningsDataSets = {
    conservative: [
      { month: language === 'fa' ? 'ماه ۱' : 'M1', copyTrade: 150, matrixCommissions: 280, leadershipPool: 0, total: 430, cumulative: 430, users: 12 },
      { month: language === 'fa' ? 'ماه ۲' : 'M2', copyTrade: 220, matrixCommissions: 590, leadershipPool: 0, total: 810, cumulative: 1240, users: 28 },
      { month: language === 'fa' ? 'ماه ۳' : 'M3', copyTrade: 310, matrixCommissions: 1150, leadershipPool: 500, total: 1960, cumulative: 3200, users: 65 },
      { month: language === 'fa' ? 'ماه ۴' : 'M4', copyTrade: 430, matrixCommissions: 1980, leadershipPool: 500, total: 2910, cumulative: 6110, users: 140 },
      { month: language === 'fa' ? 'ماه ۵' : 'M5', copyTrade: 580, matrixCommissions: 3200, leadershipPool: 500, total: 4280, cumulative: 10390, users: 290 },
      { month: language === 'fa' ? 'ماه ۶' : 'M6', copyTrade: 790, matrixCommissions: 4950, leadershipPool: 2500, total: 8240, cumulative: 18630, users: 580 },
      { month: language === 'fa' ? 'ماه ۷' : 'M7', copyTrade: 1050, matrixCommissions: 7300, leadershipPool: 2500, total: 10850, cumulative: 29480, users: 1100 },
      { month: language === 'fa' ? 'ماه ۸' : 'M8', copyTrade: 1380, matrixCommissions: 10400, leadershipPool: 2500, total: 14280, cumulative: 43760, users: 1950 },
      { month: language === 'fa' ? 'ماه ۹' : 'M9', copyTrade: 1820, matrixCommissions: 14600, leadershipPool: 2500, total: 18920, cumulative: 62680, users: 3400 },
      { month: language === 'fa' ? 'ماه ۱۰' : 'M10', copyTrade: 2350, matrixCommissions: 20100, leadershipPool: 10000, total: 32450, cumulative: 95130, users: 5800 },
      { month: language === 'fa' ? 'ماه ۱۱' : 'M11', copyTrade: 3000, matrixCommissions: 27500, leadershipPool: 10000, total: 40500, cumulative: 135630, users: 9500 },
      { month: language === 'fa' ? 'ماه ۱۲' : 'M12', copyTrade: 3850, matrixCommissions: 37200, leadershipPool: 10000, total: 51050, cumulative: 186680, users: 15000 }
    ],
    balanced: [
      { month: language === 'fa' ? 'ماه ۱' : 'M1', copyTrade: 320, matrixCommissions: 680, leadershipPool: 0, total: 1000, cumulative: 1000, users: 25 },
      { month: language === 'fa' ? 'ماه ۲' : 'M2', copyTrade: 510, matrixCommissions: 1650, leadershipPool: 500, total: 2660, cumulative: 3660, users: 70 },
      { month: language === 'fa' ? 'ماه ۳' : 'M3', copyTrade: 820, matrixCommissions: 3400, leadershipPool: 500, total: 4720, cumulative: 8380, users: 180 },
      { month: language === 'fa' ? 'ماه ۴' : 'M4', copyTrade: 1250, matrixCommissions: 6800, leadershipPool: 2500, total: 10550, cumulative: 18930, users: 420 },
      { month: language === 'fa' ? 'ماه ۵' : 'M5', copyTrade: 1840, matrixCommissions: 12400, leadershipPool: 2500, total: 16740, cumulative: 35670, users: 950 },
      { month: language === 'fa' ? 'ماه ۶' : 'M6', copyTrade: 2650, matrixCommissions: 21500, leadershipPool: 10000, total: 34150, cumulative: 69820, users: 2100 },
      { month: language === 'fa' ? 'ماه ۷' : 'M7', copyTrade: 3700, matrixCommissions: 34800, leadershipPool: 10000, total: 48500, cumulative: 118320, users: 4400 },
      { month: language === 'fa' ? 'ماه ۸' : 'M8', copyTrade: 5100, matrixCommissions: 53200, leadershipPool: 10000, total: 68300, cumulative: 186620, users: 8900 },
      { month: language === 'fa' ? 'ماه ۹' : 'M9', copyTrade: 6900, matrixCommissions: 79000, leadershipPool: 50000, total: 135900, cumulative: 322520, users: 17500 },
      { month: language === 'fa' ? 'ماه ۱۰' : 'M10', copyTrade: 9200, matrixCommissions: 114000, leadershipPool: 50000, total: 173200, cumulative: 495720, users: 32000 },
      { month: language === 'fa' ? 'ماه ۱۱' : 'M11', copyTrade: 12100, matrixCommissions: 162000, leadershipPool: 50000, total: 224100, cumulative: 719820, users: 58000 },
      { month: language === 'fa' ? 'ماه ۱۲' : 'M12', copyTrade: 15800, matrixCommissions: 228000, leadershipPool: 50000, total: 293800, cumulative: 1013620, users: 95000 }
    ],
    exponential: [
      { month: language === 'fa' ? 'ماه ۱' : 'M1', copyTrade: 650, matrixCommissions: 1850, leadershipPool: 500, total: 3000, cumulative: 3000, users: 60 },
      { month: language === 'fa' ? 'ماه ۲' : 'M2', copyTrade: 1200, matrixCommissions: 5200, leadershipPool: 2500, total: 8900, cumulative: 11900, users: 210 },
      { month: language === 'fa' ? 'ماه ۳' : 'M3', copyTrade: 2100, matrixCommissions: 14100, leadershipPool: 2500, total: 18700, cumulative: 30600, users: 680 },
      { month: language === 'fa' ? 'ماه ۴' : 'M4', copyTrade: 3600, matrixCommissions: 32500, leadershipPool: 10000, total: 46100, cumulative: 76700, users: 1900 },
      { month: language === 'fa' ? 'ماه ۵' : 'M5', copyTrade: 5800, matrixCommissions: 68000, leadershipPool: 10000, total: 83800, cumulative: 160500, users: 4800 },
      { month: language === 'fa' ? 'ماه ۶' : 'M6', copyTrade: 9100, matrixCommissions: 135000, leadershipPool: 50000, total: 194100, cumulative: 354600, users: 11500 },
      { month: language === 'fa' ? 'ماه ۷' : 'M7', copyTrade: 13800, matrixCommissions: 242000, leadershipPool: 50000, total: 305800, cumulative: 660400, users: 26000 },
      { month: language === 'fa' ? 'ماه ۸' : 'M8', copyTrade: 20500, matrixCommissions: 410000, leadershipPool: 50000, total: 480500, cumulative: 1140900, users: 55000 },
      { month: language === 'fa' ? 'ماه ۹' : 'M9', copyTrade: 29800, matrixCommissions: 670000, leadershipPool: 500000, total: 1199800, cumulative: 2340700, users: 110000 },
      { month: language === 'fa' ? 'ماه ۱۰' : 'M10', copyTrade: 42500, matrixCommissions: 1040000, leadershipPool: 500000, total: 1582500, cumulative: 3923200, users: 210000 },
      { month: language === 'fa' ? 'ماه ۱۱' : 'M11', copyTrade: 59000, matrixCommissions: 1560000, leadershipPool: 500000, total: 2119000, cumulative: 6042200, users: 380000 },
      { month: language === 'fa' ? 'ماه ۱۲' : 'M12', copyTrade: 81000, matrixCommissions: 2300000, leadershipPool: 500000, total: 2881000, cumulative: 8923200, users: 650000 }
    ]
  };



  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const allPublished = blogService.getPublishedPosts();
    const mainPosts = allPublished.filter(p => p.showOnMain);
    if (mainPosts.length > 0) {
      setBlogPosts(mainPosts.slice(0, 3));
    } else {
      setBlogPosts(allPublished.slice(0, 3));
    }
  }, []);

  const faqs = (cms.home && cms.home.faqs && cms.home.faqs.length > 0 && language === 'fa')
    ? cms.home.faqs
    : [
    {
      q: language === 'fa' ? 'آیا پلتفرم به پول من دسترسی دارد؟' : 'Does the platform have access to my funds?',
      a: language === 'fa' ? 'خیر. تیجکس یک پلتفرم Non-Custodial است. کلیدهای API فقط با مجوز خواندن و ترید کار می‌کنند و هیچ‌گاه امکان برداشت وجه از حساب شما را ندارند.' : 'No. TGEX is Non-Custodial. API keys only have Read & Trade permissions, never withdrawal access.'
    },
    {
      q: language === 'fa' ? 'حداقل سرمایه برای شروع چقدر است؟' : 'What is the minimum capital to start?',
      a: language === 'fa' ? 'حداقل سرمایه پیشنهادی ۱۰۰ دلار است، اما برای تجربه بهتر ۵۰۰ دلار توصیه می‌شود.' : 'Minimum recommended capital is $100, but $500 is suggested for optimal experience.'
    },
    {
      q: language === 'fa' ? 'پاداش‌ها چه زمانی پرداخت می‌شوند؟' : 'When are rewards paid?',
      a: language === 'fa' ? 'کمیسیون‌ها به صورت لحظه‌ای محاسبه شده و برداشت‌ها ظرف ۲۴ ساعت به کیف پول USDT شما واریز می‌گردد.' : 'Commissions are calculated in real-time and withdrawals are processed within 24 hours to your USDT wallet.'
    },
    {
      q: language === 'fa' ? 'آیا نیاز به تجربه ترید دارم؟' : 'Do I need trading experience?',
      a: language === 'fa' ? 'خیر! سیستم کپی تریدینگ ما به صورت خودکار معاملات مستر تریدرها را برای شما اجرا می‌کند.' : 'No! Our copy trading system automatically executes master traders\' positions for you.'
    },
    {
      q: language === 'fa' ? 'چگونه می‌توانم زیرمجموعه دعوت کنم؟' : 'How can I invite referrals?',
      a: language === 'fa' ? 'پس از ثبت‌نام، لینک رفرال اختصاصی خود را در بخش داشبورد دریافت کرده و در شبکه‌های اجتماعی به اشتراک بگذارید.' : 'After registration, get your unique referral link from the dashboard and share it on social media.'
    }
  ];

  return (
    <div className="space-y-32 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-slate-200 overflow-x-hidden" dir={dir}>
      
      {/* ═══════════════════════════════════════════════════════
          HERO SECTION — Architectural Content + Interactive Branching Matrix
          ═══════════════════════════════════════════════════════ */}
      <section className="pt-6 pb-10 sm:pt-10 sm:pb-16 relative overflow-visible">
        <div className="absolute -top-12 right-0 w-[520px] h-[520px] bg-blue-600/12 blur-[140px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/4 w-[420px] h-[420px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Right Container (in RTL) / Left Container (in LTR): Dynamic Architectural Value & Interactive Split */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-6 relative rounded-3xl bg-gradient-to-br from-slate-900/95 via-[#070B14] to-slate-950/95 border border-white/10 p-6 sm:p-8 lg:p-9 flex flex-col justify-between overflow-hidden shadow-2xl"
          >
            {/* Subtle Architectural Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.14] pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.45) 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }}
            />
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/15 blur-[90px] rounded-full pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Unboxed Editorial Eyebrow */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-cyan-300/90 font-medium">
                <span className="font-mono text-blue-400 font-bold">TGEX</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>
                  {language === 'fa'
                    ? (cms?.home?.heroBadge || 'کپی تریدینگ نان‌کاستودیال')
                    : 'Non-Custodial Copy Trading'}
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-400">
                  {language === 'fa' ? 'سیستم بازاریابی ۲۰ سطحی' : '20-Layer Hybrid Network'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[2.85rem] font-black text-white tracking-tight leading-[1.18] text-balance">
                {language === 'fa' ? (
                  cms?.home?.heroTitle ? (
                    <span>{cms.home.heroTitle}</span>
                  ) : (
                    <>
                      آینده <span className="bg-clip-text text-transparent bg-gradient-to-l from-blue-400 via-cyan-300 to-indigo-400">درآمد خودکار</span>
                      <br />
                      با کپی تریدینگ هوشمند
                    </>
                  )
                ) : (
                  <>
                    The Future of <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">Automated Income</span>
                    <br />
                    with Smart Copy Trading
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base text-slate-300/85 leading-relaxed max-w-xl">
                {language === 'fa'
                  ? (cms?.home?.heroSubtitle || 'به بهترین تریدرهای جهان متصل شوید، از سود روزانه معاملات بهره‌مند شوید و با شبکه ۲۰ لایه‌ای، درآمد پسیو خود را چند برابر کنید.')
                  : "Connect to the world's best traders, earn daily trading profits, and multiply your passive income with our 20-layer referral network."}
              </p>

              {/* Interactive Profit Allocation Switcher */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    {language === 'fa' ? 'مدل شفاف تقسیم سود معاملات' : 'Transparent Profit-Sharing Model'}
                  </span>
                  <span className="font-mono tabular-nums text-[11px] text-cyan-400">50% / 30% / 20%</span>
                </div>

                {/* Segmented Interactive Bar */}
                <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-slate-900 border border-white/10 p-0.5 gap-0.5">
                  <button
                    type="button"
                    onClick={() => setActiveProfitSlice('investor')}
                    onMouseEnter={() => setActiveProfitSlice('investor')}
                    aria-label="Investor Share 50%"
                    className={`h-full rounded-full transition-all duration-200 cursor-pointer ${
                      activeProfitSlice === 'investor'
                        ? 'w-[50%] bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]'
                        : 'w-[50%] bg-emerald-500/45 hover:bg-emerald-400/70'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setActiveProfitSlice('trader')}
                    onMouseEnter={() => setActiveProfitSlice('trader')}
                    aria-label="Trader Share 30%"
                    className={`h-full rounded-full transition-all duration-200 cursor-pointer ${
                      activeProfitSlice === 'trader'
                        ? 'w-[30%] bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.6)]'
                        : 'w-[30%] bg-indigo-500/45 hover:bg-indigo-400/70'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setActiveProfitSlice('network')}
                    onMouseEnter={() => setActiveProfitSlice('network')}
                    aria-label="Marketing System Share 20%"
                    className={`h-full rounded-full transition-all duration-200 cursor-pointer ${
                      activeProfitSlice === 'network'
                        ? 'w-[20%] bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.65)]'
                        : 'w-[20%] bg-cyan-500/45 hover:bg-cyan-400/70'
                    }`}
                  />
                </div>

                {/* Interactive Slice Selector Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      id: 'investor' as const,
                      pct: '50%',
                      label: language === 'fa' ? 'سرمایه‌گذار' : 'Investor',
                      detail: language === 'fa' ? 'سود خالص حساب شخصی' : 'Direct account profit'
                    },
                    {
                      id: 'trader' as const,
                      pct: '30%',
                      label: language === 'fa' ? 'تریدر' : 'Trader',
                      detail: language === 'fa' ? 'کارمزد عملکرد مسترتریدر' : 'Master trader performance'
                    },
                    {
                      id: 'network' as const,
                      pct: '20%',
                      label: language === 'fa' ? 'بازاریابی' : 'Marketing',
                      detail: language === 'fa' ? '۳٪ مستقیم · ۱۴٪ شبکه · ۳٪ استخر' : '3% Direct · 14% 20-Lv · 3% Pool'
                    }
                  ].map((item) => {
                    const isActive = activeProfitSlice === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveProfitSlice(item.id)}
                        className={`px-3 py-2.5 rounded-xl border transition-all duration-200 text-start cursor-pointer ${
                          isActive
                            ? 'bg-slate-800/90 border-cyan-500/50 text-white'
                            : 'bg-slate-900/50 border-white/5 text-slate-400 hover:border-white/15 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-bold truncate">{item.label}</span>
                          <span className={`text-xs font-mono font-black tabular-nums ${isActive ? 'text-cyan-300' : 'text-slate-300'}`}>
                            {item.pct}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate">{item.detail}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 pt-1 w-full">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="group relative w-full min-w-0 px-4 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition-all duration-200 flex items-center justify-center gap-2 overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <Rocket className="w-4 h-4 relative z-10 shrink-0" />
                  <span className="relative z-10 truncate">
                    {language === 'fa' ? (cms?.home?.ctaPrimary || 'ثبت‌نام و شروع کسب درآمد') : 'Sign Up & Start Earning'}
                  </span>
                  {dir === 'rtl' ? <ArrowLeft className="w-4 h-4 relative z-10 shrink-0" /> : <ArrowRight className="w-4 h-4 relative z-10 shrink-0" />}
                </button>
                <button
                  onClick={() => onNavigate('levels')}
                  className="w-full min-w-0 px-4 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-100 font-bold text-xs sm:text-sm border border-white/15 hover:border-cyan-500/40 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">
                    {language === 'fa' ? (cms?.home?.ctaSecondary || 'مشاهده پلن درآمدی') : 'View Income Plan'}
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom 4-Metric Strip with Hairline Divider & Tabular Numerals */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10">
              {[
                {
                  label: language === 'fa' ? (cms?.home?.stat1Label || 'حجم ماهانه') : 'Monthly Volume',
                  value: (cms?.home?.stat1Val && language === 'fa') ? cms.home.stat1Val : `$${animatedStats.volume}M`,
                  icon: BarChart3,
                  accent: 'from-blue-500 to-cyan-400'
                },
                {
                  label: language === 'fa' ? (cms?.home?.stat2Label || 'کاربران فعال') : 'Active Users',
                  value: (cms?.home?.stat2Val && language === 'fa') ? cms.home.stat2Val : `${(animatedStats.users / 1000).toFixed(1)}K+`,
                  icon: Users,
                  accent: 'from-cyan-500 to-emerald-400'
                },
                {
                  label: language === 'fa' ? (cms?.home?.stat3Label || 'پاداش‌ها') : 'Rewards Paid',
                  value: (cms?.home?.stat3Val && language === 'fa') ? cms.home.stat3Val : `$${animatedStats.rewards}M`,
                  icon: DollarSign,
                  accent: 'from-indigo-500 to-blue-400'
                },
                {
                  label: language === 'fa' ? (cms?.home?.stat4Label || 'آپ‌تایم') : 'Uptime',
                  value: (cms?.home?.stat4Val && language === 'fa') ? cms.home.stat4Val : `${animatedStats.uptime}%`,
                  icon: Activity,
                  accent: 'from-emerald-500 to-teal-400'
                }
              ].map((stat, i) => (
                <div
                  key={i}
                  className="group p-3 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-white/5 hover:border-white/15 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <stat.icon className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <div className={`h-1 w-6 rounded-full bg-gradient-to-r ${stat.accent} opacity-70 group-hover:opacity-100 transition-opacity`} />
                  </div>
                  <div className="text-base sm:text-lg font-black text-white font-mono tabular-nums">{stat.value}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 truncate">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Left Container (in RTL) / Right Container (in LTR): Patterned Interactive Multi-Branch & Sub-Branch Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="lg:col-span-6 relative rounded-3xl bg-gradient-to-b from-slate-900/95 via-[#070B14] to-slate-950/95 border border-white/10 overflow-hidden shadow-2xl p-5 sm:p-7 flex flex-col justify-between"
          >
            {/* Geometric Matrix Pattern Backdrop */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.18] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hero-matrix-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(56,189,248,0.22)" strokeWidth="0.75" />
                  <circle cx="0" cy="0" r="1.2" fill="rgba(59,130,246,0.5)" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-matrix-grid)" />
            </svg>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/15 blur-[90px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -left-20 w-64 h-64 bg-cyan-500/12 blur-[90px] rounded-full pointer-events-none" />

            {/* Matrix Card Header */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/35 flex items-center justify-center shrink-0">
                  <GitBranch className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-white font-black text-sm sm:text-base">
                    {language === 'fa' ? 'درخت شاخه‌ها و زیرشاخه‌های ۲۰ سطح' : '20-Level Branch & Sub-Branch Matrix'}
                  </h2>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>{language === 'fa' ? 'سیستم خورشیدی (تا ۲۰ خط مستقیم)' : 'Sun System (20 Direct Legs)'}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-emerald-400">NON-CUSTODIAL</span>
                  </div>
                </div>
              </div>

              {/* Branch Selector Segmented Control */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950/90 border border-white/10">
                {[
                  { id: 'branchA' as const, label: language === 'fa' ? 'شاخه A' : 'Branch A' },
                  { id: 'branchB' as const, label: language === 'fa' ? 'شاخه B' : 'Branch B' },
                  { id: 'branchC' as const, label: language === 'fa' ? 'اسپیل‌اور' : 'Spillover' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedHeroBranch(tab.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selectedHeroBranch === tab.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive SVG Branch & Sub-Branch Tree Diagram */}
            <div className="relative z-10 my-4 select-none" dir="ltr">
              <svg viewBox="0 0 560 320" className="w-full h-auto overflow-visible" role="img" aria-label="20-level network branch and sub-branch tree">
                <defs>
                  <linearGradient id="branchActiveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                  <linearGradient id="branchMutedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(148,163,184,0.28)" />
                    <stop offset="100%" stopColor="rgba(148,163,184,0.12)" />
                  </linearGradient>
                  <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Subtle Concentric Orbital Arcs (Sun System Pattern) */}
                <ellipse cx="280" cy="40" rx="150" ry="62" fill="none" stroke="rgba(56,189,248,0.10)" strokeDasharray="4 6" />
                <ellipse cx="280" cy="40" rx="235" ry="135" fill="none" stroke="rgba(99,102,241,0.10)" strokeDasharray="4 6" />
                <ellipse cx="280" cy="40" rx="270" ry="220" fill="none" stroke="rgba(16,185,129,0.08)" strokeDasharray="3 7" />

                {/* Level 0 -> Level 1 Main Branch Curves */}
                {[
                  { id: 'branchA' as const, targetX: 105 },
                  { id: 'branchB' as const, targetX: 280 },
                  { id: 'branchC' as const, targetX: 455 }
                ].map((b) => {
                  const isActive = selectedHeroBranch === b.id;
                  const pathD = `M 280 54 C 280 86, ${b.targetX} 74, ${b.targetX} 106`;
                  return (
                    <g key={b.id}>
                      <path
                        d={pathD}
                        fill="none"
                        stroke={isActive ? 'url(#branchActiveGrad)' : 'url(#branchMutedGrad)'}
                        strokeWidth={isActive ? 2.6 : 1.4}
                        strokeLinecap="round"
                      />
                      {isActive && (
                        <path
                          d={pathD}
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2.5"
                          strokeDasharray="6 10"
                          strokeLinecap="round"
                        >
                          <animate attributeName="stroke-dashoffset" from="32" to="0" dur="1.4s" repeatCount="indefinite" />
                        </path>
                      )}
                    </g>
                  );
                })}

                {/* Level 1 -> Level 2 Sub-Branch Curves */}
                {[
                  { parent: 'branchA' as const, px: 105, children: [60, 150] },
                  { parent: 'branchB' as const, px: 280, children: [235, 325] },
                  { parent: 'branchC' as const, px: 455, children: [410, 500] }
                ].map((group) =>
                  group.children.map((cx, idx) => {
                    const isActive = selectedHeroBranch === group.parent;
                    const pathD = `M ${group.px} 146 C ${group.px} 168, ${cx} 162, ${cx} 186`;
                    return (
                      <g key={`${group.parent}-${idx}`}>
                        <path
                          d={pathD}
                          fill="none"
                          stroke={isActive ? '#38bdf8' : 'rgba(148,163,184,0.2)'}
                          strokeOpacity={isActive ? 0.8 : 0.6}
                          strokeWidth={isActive ? 2 : 1.2}
                        />
                        {isActive && (
                          <path
                            d={pathD}
                            fill="none"
                            stroke="#a5f3fc"
                            strokeWidth="2"
                            strokeDasharray="4 8"
                          >
                            <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.2s" repeatCount="indefinite" />
                          </path>
                        )}
                      </g>
                    );
                  })
                )}

                {/* Level 2 -> Level 3 & Deep Cascade Curves */}
                {[
                  { parent: 'branchA' as const, subX: [60, 150], l3X: [38, 82, 128, 172] },
                  { parent: 'branchB' as const, subX: [235, 325], l3X: [212, 258, 302, 348] },
                  { parent: 'branchC' as const, subX: [410, 500], l3X: [388, 432, 478, 522] }
                ].map((group) =>
                  group.l3X.map((lx, idx) => {
                    const parentSubX = idx < 2 ? group.subX[0] : group.subX[1];
                    const isActive = selectedHeroBranch === group.parent;
                    const pathD = `M ${parentSubX} 218 C ${parentSubX} 236, ${lx} 232, ${lx} 254`;
                    return (
                      <path
                        key={`${group.parent}-l3-${idx}`}
                        d={pathD}
                        fill="none"
                        stroke={isActive ? '#818cf8' : 'rgba(148,163,184,0.16)'}
                        strokeOpacity={isActive ? 0.85 : 0.6}
                        strokeWidth={isActive ? 1.75 : 1}
                        strokeDasharray={group.parent === 'branchC' ? '3 3' : undefined}
                      />
                    );
                  })
                )}

                {/* ROOT NODE (YOU / SPONSOR) */}
                <g
                  onClick={() => setSelectedHeroLevel(1)}
                  className="cursor-pointer"
                >
                  <rect
                    x="206"
                    y="12"
                    width="148"
                    height="42"
                    rx="12"
                    fill="#1e1b18"
                    stroke="#f59e0b"
                    strokeWidth="1.75"
                    filter="url(#nodeGlow)"
                  />
                  <text x="280" y="30" textAnchor="middle" fill="#fef3c7" fontSize="11.5" fontWeight="800">
                    {language === 'fa' ? 'شما (Sponsor اصلی)' : 'YOU (Root Sponsor)'}
                  </text>
                  <text x="280" y="45" textAnchor="middle" fill="#fbbf24" fontSize="9.5" fontFamily="monospace" fontWeight="700">
                    SUN MATRIX · MAX 20 L1
                  </text>
                </g>

                {/* LEVEL 1 MAIN BRANCHES (3.00% + 3% Direct) */}
                {[
                  {
                    id: 'branchA' as const,
                    x: 105,
                    label: language === 'fa' ? 'شاخه A' : 'Branch A',
                    tag: 'L1 · 3.00%'
                  },
                  {
                    id: 'branchB' as const,
                    x: 280,
                    label: language === 'fa' ? 'شاخه B' : 'Branch B',
                    tag: 'L1 · 3.00%'
                  },
                  {
                    id: 'branchC' as const,
                    x: 455,
                    label: language === 'fa' ? 'اسپیل‌اور' : 'Spillover C',
                    tag: 'L1 · 3.00%'
                  }
                ].map((b) => {
                  const isActive = selectedHeroBranch === b.id;
                  return (
                    <g
                      key={b.id}
                      onClick={() => {
                        setSelectedHeroBranch(b.id);
                        setSelectedHeroLevel(1);
                      }}
                      className="cursor-pointer"
                    >
                      <rect
                        x={b.x - 52}
                        y="106"
                        width="104"
                        height="40"
                        rx="10"
                        fill={isActive ? '#0f172a' : '#090d16'}
                        stroke={isActive ? '#38bdf8' : 'rgba(148,163,184,0.28)'}
                        strokeWidth={isActive ? 1.8 : 1}
                      />
                      <text x={b.x} y="123" textAnchor="middle" fill={isActive ? '#ffffff' : '#cbd5e1'} fontSize="10.5" fontWeight="700">
                        {b.label}
                      </text>
                      <text x={b.x} y="137" textAnchor="middle" fill={isActive ? '#38bdf8' : '#64748b'} fontSize="9.5" fontFamily="monospace" fontWeight="700">
                        {b.tag}
                      </text>
                    </g>
                  );
                })}

                {/* LEVEL 2 SUB-BRANCHES (2.00%) */}
                {[
                  { parent: 'branchA' as const, x: 60, label: 'A1' },
                  { parent: 'branchA' as const, x: 150, label: 'A2' },
                  { parent: 'branchB' as const, x: 235, label: 'B1' },
                  { parent: 'branchB' as const, x: 325, label: 'B2' },
                  { parent: 'branchC' as const, x: 410, label: 'C1' },
                  { parent: 'branchC' as const, x: 500, label: 'C2' }
                ].map((sub) => {
                  const isActive = selectedHeroBranch === sub.parent;
                  return (
                    <g
                      key={sub.label}
                      onClick={() => {
                        setSelectedHeroBranch(sub.parent);
                        setSelectedHeroLevel(2);
                      }}
                      className="cursor-pointer"
                    >
                      <rect
                        x={sub.x - 32}
                        y="186"
                        width="64"
                        height="32"
                        rx="8"
                        fill={isActive ? '#111827' : '#070b12'}
                        stroke={isActive ? '#60a5fa' : 'rgba(148,163,184,0.22)'}
                        strokeWidth={isActive ? 1.5 : 1}
                      />
                      <text x={sub.x} y="200" textAnchor="middle" fill={isActive ? '#e0f2fe' : '#94a3b8'} fontSize="9.5" fontWeight="700" fontFamily="monospace">
                        L2 · {sub.label}
                      </text>
                      <text x={sub.x} y="212" textAnchor="middle" fill={isActive ? '#38bdf8' : '#64748b'} fontSize="8.5" fontFamily="monospace">
                        2.00%
                      </text>
                    </g>
                  );
                })}

                {/* LEVEL 3 SUB-BRANCHES (1.60%) + L4-L20 CASCADE */}
                {[
                  { parent: 'branchA' as const, xs: [38, 82, 128, 172] },
                  { parent: 'branchB' as const, xs: [212, 258, 302, 348] },
                  { parent: 'branchC' as const, xs: [388, 432, 478, 522] }
                ].map((group) =>
                  group.xs.map((lx, idx) => {
                    const isActive = selectedHeroBranch === group.parent;
                    return (
                      <g
                        key={`${group.parent}-leaf-${idx}`}
                        onClick={() => {
                          setSelectedHeroBranch(group.parent);
                          setSelectedHeroLevel(3);
                        }}
                        className="cursor-pointer"
                      >
                        <rect
                          x={lx - 18}
                          y="254"
                          width="36"
                          height="28"
                          rx="6"
                          fill={isActive ? '#17153b' : '#080c14'}
                          stroke={isActive ? '#818cf8' : 'rgba(148,163,184,0.18)'}
                          strokeWidth={isActive ? 1.4 : 0.9}
                        />
                        <text x={lx} y="266" textAnchor="middle" fill={isActive ? '#e0e7ff' : '#64748b'} fontSize="8" fontFamily="monospace" fontWeight="700">
                          L3
                        </text>
                        <text x={lx} y="276" textAnchor="middle" fill={isActive ? '#a5b4fc' : '#475569'} fontSize="7.5" fontFamily="monospace">
                          1.6%
                        </text>
                        {/* Cascade Indicator Dots to L4-L20 */}
                        <line
                          x1={lx}
                          y1="282"
                          x2={lx}
                          y2="304"
                          stroke={isActive ? '#818cf8' : 'rgba(148,163,184,0.2)'}
                          strokeWidth="1.2"
                          strokeDasharray="2 3"
                        />
                        <circle
                          cx={lx}
                          cy="308"
                          r="2.5"
                          fill={isActive ? '#34d399' : '#334155'}
                        />
                      </g>
                    );
                  })
                )}
              </svg>
            </div>

            {/* Interactive Branch & 20-Level Inspector Strip */}
            <div className="relative z-10 space-y-3 pt-4 border-t border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">
                    {selectedHeroBranch === 'branchA'
                      ? (language === 'fa' ? 'شاخه مستقیم A · لایه ۱ تا ۲۰' : 'Direct Branch A · Levels 1–20')
                      : selectedHeroBranch === 'branchB'
                      ? (language === 'fa' ? 'شاخه مستقیم B · لایه ۱ تا ۲۰' : 'Direct Branch B · Levels 1–20')
                      : (language === 'fa' ? 'شاخه اسپیل‌اور (معرفی ۲۱ به بعد)' : 'Spillover Branch (21st+ Direct)')}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="font-mono tabular-nums text-cyan-300 font-bold">
                    {`L${selectedHeroLevel}: ${(LEVEL_COMMISSIONS.find((l) => l.level === selectedHeroLevel)?.percent ?? 3.0).toFixed(2)}%`}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {language === 'fa'
                    ? 'محاسبه پورسانت بر اساس Sponsor واقعی'
                    : 'Paid by true Sponsor lineage'}
                </span>
              </div>

              {/* Compact 6-Tier Sample Strip (L1 -> L20) */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center font-mono tabular-nums">
                {[
                  { level: 1, lv: 'L1', pct: '3.00%' },
                  { level: 2, lv: 'L2', pct: '2.00%' },
                  { level: 3, lv: 'L3', pct: '1.60%' },
                  { level: 4, lv: 'L4', pct: '1.20%' },
                  { level: 10, lv: 'L10', pct: '0.45%' },
                  { level: 20, lv: 'L20', pct: '0.05%' }
                ].map((tier) => (
                  <button
                    key={tier.lv}
                    type="button"
                    onClick={() => setSelectedHeroLevel(tier.level)}
                    className={`py-1.5 px-2 rounded-lg border text-[10px] transition-colors cursor-pointer ${
                      selectedHeroLevel === tier.level
                        ? 'bg-blue-500/20 border-blue-400/50 text-white'
                        : 'bg-slate-900/70 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/15'
                    }`}
                  >
                    <span className="block text-[9px] text-slate-400">{tier.lv}</span>
                    <span className="font-bold text-cyan-300">{tier.pct}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          HOW IT WORKS - TIMELINE STYLE (Unique Design #1)
          ═══════════════════════════════════════════════════════ */}
      <section className="relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold font-mono">
            <Play className="w-3 h-3" />
            {language === 'fa' ? 'شروع در ۳ گام ساده' : 'Start in 3 Simple Steps'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            {language === 'fa' ? 'نحوه کارکرد پلتفرم' : 'How the Platform Works'}
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            {language === 'fa' 
              ? 'در کمتر از ۵ دقیقه به سیستم کپی تریدینگ متصل شوید و شبکه درآمدی خود را بسازید' 
              : 'Connect to copy trading and build your income network in under 5 minutes'}
          </p>
        </motion.div>

        {/* Vertical Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 -translate-x-1/2 hidden md:block"></div>

          <div className="space-y-12">
            {[
              {
                num: '01',
                title: language === 'fa' ? 'ایجاد حساب کاربری' : 'Create Your Account',
                desc: language === 'fa' ? 'ثبت‌نام سریع و دریافت کد معرف اختصاصی برای شروع فعالیت در شبکه. فقط یک ایمیل و رمز عبور کافی است.' : 'Quick signup and get your unique referral code. Just email and password needed.',
                icon: UserCheck,
                iconBg: 'from-blue-500 to-cyan-500',
                position: 'left',
                stats: [
                  { label: language === 'fa' ? 'زمان ثبت‌نام' : 'Signup Time', value: '< 2min' },
                  { label: language === 'fa' ? 'تأیید فوری' : 'Instant Verify', value: '✓' }
                ]
              },
              {
                num: '02',
                title: language === 'fa' ? 'دعوت افراد به عنوان زیرمجموعه' : 'Invite Members as Referrals',
                desc: language === 'fa' ? 'لینک و کد معرف اختصاصی خود را به اشتراک بگذارید، دوستان و تریدرهای جدید را به پلتفرم دعوت کنید و شبکه درآمدی چندسطحی خود را گسترش دهید.' : 'Share your unique referral link, invite new traders to the platform, and grow your multi-tier revenue network.',
                icon: Users,
                iconBg: 'from-purple-500 to-indigo-500',
                position: 'right',
                stats: [
                  { label: language === 'fa' ? 'عمق شبکه' : 'Network Depth', value: '20 لایه' },
                  { label: language === 'fa' ? 'پاداش مستقیم' : 'Direct Bonus', value: '۱۰٪' }
                ]
              },
              {
                num: '03',
                title: language === 'fa' ? 'کسب سود لحظه‌ای' : 'Earn Real-Time Profits',
                desc: language === 'fa' ? 'سود روزانه معاملات + کمیسیون شبکه‌ای تا ۲۰ سطح را دریافت کنید. درآمدهای شما به صورت خودکار محاسبه می‌شوند.' : 'Daily trading profits + network commissions up to 20 levels, auto-calculated.',
                icon: TrendingUp,
                iconBg: 'from-purple-500 to-pink-500',
                position: 'left',
                stats: [
                  { label: language === 'fa' ? 'سطوح پاداش' : 'Reward Levels', value: '20' },
                  { label: language === 'fa' ? 'تسویه' : 'Settlement', value: '24h' }
                ]
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: step.position === 'left' ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className={`relative grid md:grid-cols-2 gap-8 items-center ${step.position === 'right' ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Content */}
                <div className={`${step.position === 'right' ? 'md:col-start-2' : ''}`}>
                  <div className="relative p-6 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/10 backdrop-blur-xl group hover:border-white/20 transition-all">
                    {/* Number badge */}
                    <div className="absolute -top-4 -left-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-white/20 flex items-center justify-center shadow-2xl">
                      <span className="text-2xl font-black text-white font-mono">{step.num}</span>
                    </div>

                    <div className="pt-4 space-y-4">
                      <h3 className="text-xl font-black text-white">{step.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                      
                      {/* Mini stats */}
                      <div className="flex gap-3 pt-2">
                        {step.stats.map((stat, i) => (
                          <div key={i} className="flex-1 p-2 rounded-xl bg-slate-800/50 border border-white/5 text-center">
                            <div className="text-[9px] text-slate-500">{stat.label}</div>
                            <div className="text-xs font-black text-white font-mono mt-0.5">{stat.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Icon side */}
                <div className={`${step.position === 'right' ? 'md:col-start-1 md:row-start-1' : ''} flex justify-center`}>
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.iconBg} blur-2xl opacity-50 rounded-full`}></div>
                    <div className={`relative w-24 h-24 rounded-3xl bg-gradient-to-br ${step.iconBg} flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform`}>
                      <step.icon className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>

                {/* Timeline dot (desktop only) */}
                <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-white to-slate-300 border-4 border-slate-950 shadow-lg z-10"></div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate('about')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg transition-all"
          >
            <BookOpen className="w-4 h-4" />
            {language === 'fa' ? 'درباره ما بیشتر بدانید' : 'More About Us'}
            {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CALCULATOR - SPLIT SCREEN STYLE (Unique Design #2)
          ═══════════════════════════════════════════════════════ */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent blur-3xl -z-10"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold font-mono">
            <Calculator className="w-3 h-3" />
            {language === 'fa' ? 'ماشین‌حساب درآمد' : 'Income Calculator'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            {language === 'fa' ? 'پتانسیل درآمد خود را محاسبه کنید' : 'Calculate Your Earning Potential'}
          </h2>
        </motion.div>

        <div className="relative rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] overflow-hidden border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl">
          <div className="grid lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x rtl:lg:divide-x-reverse divide-white/10">
            
            {/* Left: Controls */}
            <div className="lg:col-span-2 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white mb-4 sm:mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  {language === 'fa' ? 'پارامترهای ورودی' : 'Input Parameters'}
                </h3>

                <div className="space-y-4 sm:space-y-6">
                  {/* Slider 1 */}
                  <div className="space-y-2.5 sm:space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs sm:text-sm font-bold text-slate-300">
                        {language === 'fa' ? 'تعداد دعوت مستقیم' : 'Direct Referrals'}
                      </label>
                      <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-blue-500/20 border border-blue-500/40">
                        <span className="text-blue-300 font-mono font-black text-base sm:text-lg">{directReferrals}</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={directReferrals}
                      onChange={(e) => setDirectReferrals(+e.target.value)}
                      className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-purple-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-blue-500/50"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono px-1">
                      <span>1</span><span>15</span><span>30</span>
                    </div>
                  </div>

                  {/* Slider 2 */}
                  <div className="space-y-2.5 sm:space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs sm:text-sm font-bold text-slate-300">
                        {language === 'fa' ? 'میانگین سرمایه ($)' : 'Avg Capital ($)'}
                      </label>
                      <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-emerald-500/20 border border-emerald-500/40">
                        <span className="text-emerald-300 font-mono font-black text-base sm:text-lg">${avgVolume}</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="5000"
                      step="100"
                      value={avgVolume}
                      onChange={(e) => setAvgVolume(+e.target.value)}
                      className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-emerald-500 [&::-webkit-slider-thumb]:to-teal-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-emerald-500/50"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono px-1">
                      <span>$100</span><span>$2.5K</span><span>$5K</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Result box */}
              <div className="relative p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 overflow-hidden">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/30 blur-3xl rounded-full pointer-events-none"></div>
                <div className="relative space-y-2">
                  <div className="text-xs text-slate-400 font-medium">{language === 'fa' ? 'پتانسیل درآمد ماهانه:' : 'Monthly Potential:'}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 font-mono tracking-tight break-all sm:break-normal">
                      ${calculateEarnings().toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                    <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 animate-pulse flex-shrink-0" />
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed pt-1 sm:pt-2">
                    * {language === 'fa' ? 'بر اساس رشد کامل شبکه' : 'Based on full network growth'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Level Grid */}
            <div className="lg:col-span-3 p-4 sm:p-6 lg:p-8 bg-slate-950/50">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  {language === 'fa' ? 'تفکیک کمیسیون ۲۰ سطح' : '20-Level Breakdown'}
                </h3>
                <div className="text-[11px] sm:text-xs text-slate-400 font-mono">{language === 'fa' ? '۲۰ لایه' : '20 Layers'}</div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5 sm:gap-2 max-h-[320px] sm:max-h-[350px] overflow-y-auto px-0.5 custom-scrollbar">
                {LEVEL_COMMISSIONS.map((lvl, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: idx * 0.02 }}
                    className={`relative p-2 sm:p-3 rounded-lg sm:rounded-xl text-center transition-all hover:scale-105 cursor-default ${
                      lvl.percent >= 5 ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-2 border-blue-400/50 shadow-lg shadow-blue-500/30' :
                      lvl.percent >= 2 ? 'bg-gradient-to-br from-purple-500/15 to-purple-600/10 border border-purple-400/40' :
                      'bg-slate-800/60 border border-white/5'
                    }`}
                  >
                    {lvl.percent >= 5 && <Star className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400" />}
                    <div className="text-[9px] sm:text-[10px] text-slate-400 font-mono mb-0.5 sm:mb-1">L{lvl.level}</div>
                    <div className={`text-sm sm:text-base lg:text-lg font-black font-mono leading-tight ${
                      lvl.percent >= 5 ? 'text-blue-300' :
                      lvl.percent >= 2 ? 'text-purple-300' :
                      'text-slate-400'
                    }`}>{lvl.percent}%</div>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => onNavigate('levels')}
                className="mt-4 sm:mt-6 w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {language === 'fa' ? 'مشاهده جدول کامل' : 'View Full Table'}
                {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TGEX REVENUE PROJECTION & EARNINGS CHARTS (نمودار درآمد تیجکس)
          Replaces Top Traders for User Privacy & Mathematical Proof
          ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-10">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5 blur-3xl -z-10"></div>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
            <BarChart3 className="w-3.5 h-3.5" />
            {language === 'fa' ? 'مدل‌سازی مالی هوشمند تیجکس' : 'TGEX Smart Revenue Modeling'}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {language === 'fa' ? 'نمودار رشد درآمد و پتانسیل سودآوری' : 'TGEX Earnings & Revenue Growth Chart'}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {language === 'fa' 
              ? 'مشاهده سناریوهای واقعی درآمد ماهانه بر اساس ترکیب پاداش ۲۰ سطحی، سود کپی تریدینگ و استخر پاداش لیدرشیپ' 
              : 'Interactive forecast showing multi-layer commission yield, copy-trade profits, and leadership pools'}
          </p>
        </motion.div>

        {/* Main Chart Card */}
        <div className="max-w-6xl mx-auto">
          <div className="relative p-3.5 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-950/95 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden">
            
            {/* Ambient Background Glows */}
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>

            {/* Top Control Bar */}
            <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-white/10">
              
              {/* Strategy Selector */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  {language === 'fa' ? 'استراتژی و سرعت رشد شبکه:' : 'Growth Trajectory Strategy:'}
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-1.5 sm:gap-2 p-1 rounded-xl sm:rounded-2xl bg-slate-950/80 border border-white/10">
                  <button
                    onClick={() => setChartStrategy('conservative')}
                    className={`flex-1 min-w-[120px] text-center justify-center px-3 py-2 sm:px-4 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                      chartStrategy === 'conservative'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {language === 'fa' ? 'محافظه‌کارانه (۱x)' : 'Conservative (1x)'}
                  </button>
                  <button
                    onClick={() => setChartStrategy('balanced')}
                    className={`flex-1 min-w-[120px] text-center justify-center px-3 py-2 sm:px-4 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                      chartStrategy === 'balanced'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {language === 'fa' ? 'متعادل پویا (۲x)' : 'Balanced Active (2x)'}
                  </button>
                  <button
                    onClick={() => setChartStrategy('exponential')}
                    className={`flex-1 min-w-[120px] text-center justify-center px-3 py-2 sm:px-4 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                      chartStrategy === 'exponential'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {language === 'fa' ? 'رشد تصاعدی لیدرشیپ (۳x)' : 'Exponential Leader (3x)'}
                  </button>
                </div>
              </div>

              {/* View & Period Switchers */}
              <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 sm:gap-3">
                {/* 6 vs 12 Months */}
                <div className="flex items-center p-1 rounded-xl sm:rounded-2xl bg-slate-950/80 border border-white/10">
                  <button
                    onClick={() => setChartMonths(6)}
                    className={`px-3 sm:px-3.5 py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                      chartMonths === 6 
                        ? 'bg-white/15 text-white shadow' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {language === 'fa' ? '۶ ماهه' : '6 Months'}
                  </button>
                  <button
                    onClick={() => setChartMonths(12)}
                    className={`px-3 sm:px-3.5 py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                      chartMonths === 12 
                        ? 'bg-white/15 text-white shadow' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {language === 'fa' ? '۱۲ ماهه (کامل)' : '12 Months'}
                  </button>
                </div>

                {/* Bar vs Area chart */}
                <div className="flex items-center p-1 rounded-xl sm:rounded-2xl bg-slate-950/80 border border-white/10">
                  <button
                    onClick={() => setChartViewType('bar')}
                    className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all ${
                      chartViewType === 'bar' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title={language === 'fa' ? 'نمودار ستونی تفکیکی' : 'Stacked Bar View'}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setChartViewType('area')}
                    className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all ${
                      chartViewType === 'area' 
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title={language === 'fa' ? 'نمودار تجمعی تصاعدی' : 'Cumulative Growth Curve'}
                  >
                    <LineChart className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Quick Metrics Header */}
            {(() => {
              const currentData = earningsDataSets[chartStrategy].slice(0, chartMonths);
              const lastMonth = currentData[currentData.length - 1];
              const totalSum = currentData.reduce((acc, curr) => acc + curr.total, 0);
              const firstMonth = currentData[0].total;
              const multiple = (lastMonth.total / firstMonth).toFixed(1);

              return (
                <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 my-6 sm:my-8">
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 mb-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{language === 'fa' ? `درآمد ماه ${chartMonths}` : `Month ${chartMonths} Income`}</span>
                    </div>
                    <div className="text-lg sm:text-2xl lg:text-3xl font-black text-emerald-400 font-mono tracking-tight truncate">
                      ${lastMonth.total.toLocaleString()}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-slate-500 mt-1 font-mono truncate">
                      {language === 'fa' ? 'میانگین برداشت ماهانه' : 'Projected monthly cash'}
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-all">
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                      <span className="truncate">{language === 'fa' ? 'مجموع سود دوره' : 'Total Period Yield'}</span>
                    </div>
                    <div className="text-lg sm:text-2xl lg:text-3xl font-black text-purple-400 font-mono tracking-tight truncate">
                      ${totalSum.toLocaleString()}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-slate-500 mt-1 font-mono truncate">
                      {language === 'fa' ? `مجموع ${chartMonths} ماه فعالیت` : `Cumulative ${chartMonths}-month total`}
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span className="truncate">{language === 'fa' ? 'ضریب تصاعد شبکه' : 'Compounding Factor'}</span>
                    </div>
                    <div className="text-lg sm:text-2xl lg:text-3xl font-black text-blue-400 font-mono tracking-tight truncate">
                      {multiple}x
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-slate-500 mt-1 font-mono truncate">
                      {language === 'fa' ? 'رشد نسبت به ماه اول' : 'Growth from Month 1'}
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-500/30 transition-all">
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 mb-1">
                      <Users className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span className="truncate">{language === 'fa' ? 'اعضای تخمینی شبکه' : 'Simulated Downline'}</span>
                    </div>
                    <div className="text-lg sm:text-2xl lg:text-3xl font-black text-amber-400 font-mono tracking-tight truncate">
                      {lastMonth.users.toLocaleString()}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-slate-500 mt-1 font-mono truncate">
                      {language === 'fa' ? 'در ۲۰ سطح زیرمجموعه' : 'Across 20 network levels'}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Interactive Chart Container */}
            <div className="relative z-10 w-full h-72 sm:h-80 md:h-96 lg:h-[420px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                {chartViewType === 'bar' ? (
                  <BarChart
                    data={earningsDataSets[chartStrategy].slice(0, chartMonths)}
                    margin={{ top: 10, right: 10, left: -20, bottom: 15 }}
                  >
                    <defs>
                      <linearGradient id="barMatrix" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#047857" stopOpacity={0.6} />
                      </linearGradient>
                      <linearGradient id="barLeadership" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#b45309" stopOpacity={0.6} />
                      </linearGradient>
                      <linearGradient id="barCopy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      stroke="#94a3b8" 
                      fontSize={11} 
                      tickLine={false}
                      axisLine={{ stroke: '#ffffff15' }}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={11} 
                      tickLine={false}
                      axisLine={{ stroke: '#ffffff15' }}
                      tickFormatter={(val) => val >= 1000000 ? `$${(val / 1000000).toFixed(1)}M` : val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="p-4 rounded-2xl bg-slate-950/95 border border-white/20 shadow-2xl backdrop-blur-xl text-right space-y-2 min-w-[220px]">
                              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                <span className="text-xs font-black text-white">{label}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                                  {data.users.toLocaleString()} {language === 'fa' ? 'عضو' : 'Users'}
                                </span>
                              </div>
                              <div className="space-y-1 text-xs">
                                <div className="flex items-center justify-between text-emerald-400">
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                    {language === 'fa' ? 'پاداش ۲۰ لایه شبکه:' : '20-Layer Commissions:'}
                                  </span>
                                  <span className="font-mono font-bold">${data.matrixCommissions.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-amber-400">
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                    {language === 'fa' ? 'استخر پاداش لیدرشیپ:' : 'Leadership Pool:'}
                                  </span>
                                  <span className="font-mono font-bold">${data.leadershipPool.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-blue-400">
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                    {language === 'fa' ? 'سود کپی‌تریدینگ:' : 'Copy-Trade Yield:'}
                                  </span>
                                  <span className="font-mono font-bold">${data.copyTrade.toLocaleString()}</span>
                                </div>
                              </div>
                              <div className="pt-2 border-t border-white/10 flex items-center justify-between font-black text-sm text-white">
                                <span>{language === 'fa' ? 'مجموع درآمد ماه:' : 'Total Month:'}</span>
                                <span className="text-emerald-400 font-mono">${data.total.toLocaleString()}</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="copyTrade" name={language === 'fa' ? 'سود کپی‌ترید' : 'Copy-Trading'} stackId="a" fill="url(#barCopy)" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="matrixCommissions" name={language === 'fa' ? 'پاداش شبکه ۲۰ سطحی' : '20-Level Network'} stackId="a" fill="url(#barMatrix)" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="leadershipPool" name={language === 'fa' ? 'استخر پاداش لیدری' : 'Leadership Royalty'} stackId="a" fill="url(#barLeadership)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                ) : (
                  <AreaChart
                    data={earningsDataSets[chartStrategy].slice(0, chartMonths)}
                    margin={{ top: 10, right: 10, left: -20, bottom: 15 }}
                  >
                    <defs>
                      <linearGradient id="areaTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      stroke="#94a3b8" 
                      fontSize={11} 
                      tickLine={false}
                      axisLine={{ stroke: '#ffffff15' }}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={11} 
                      tickLine={false}
                      axisLine={{ stroke: '#ffffff15' }}
                      tickFormatter={(val) => val >= 1000000 ? `$${(val / 1000000).toFixed(1)}M` : val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="p-4 rounded-2xl bg-slate-950/95 border border-purple-500/30 shadow-2xl backdrop-blur-xl text-right space-y-2 min-w-[200px]">
                              <div className="text-xs font-black text-purple-300 border-b border-white/10 pb-1">{label}</div>
                              <div className="flex items-center justify-between text-xs text-slate-300">
                                <span>{language === 'fa' ? 'درآمد ماهانه:' : 'Monthly Income:'}</span>
                                <span className="text-emerald-400 font-mono font-bold">${data.total.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-slate-300">
                                <span>{language === 'fa' ? 'سود تجمعی:' : 'Cumulative Yield:'}</span>
                                <span className="text-purple-400 font-mono font-bold">${data.cumulative.toLocaleString()}</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="cumulative" 
                      stroke="#a855f7" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#areaTotal)" 
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Legend & Privacy Guarantee Footer */}
            <div className="relative z-10 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
              
              {/* Legend Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] sm:text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm shadow-emerald-500/50"></span>
                  <span className="text-slate-300">{language === 'fa' ? 'پاداش ۲۰ سطحی ماتریس' : '20-Layer Matrix Commissions'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-gradient-to-r from-amber-500 to-yellow-500 shadow-sm shadow-amber-500/50"></span>
                  <span className="text-slate-300">{language === 'fa' ? 'استخر پاداش رتبه‌های لیدری' : 'Leadership Royalty Pool'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-gradient-to-r from-blue-500 to-cyan-500 shadow-sm shadow-blue-500/50"></span>
                  <span className="text-slate-300">{language === 'fa' ? 'سود مستقیم کپی‌تریدینگ' : 'Direct Copy Yield'}</span>
                </div>
              </div>

              {/* Privacy & Non-Custodial Badge */}
              <div className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[10px] sm:text-[11px] text-blue-300 text-center">
                <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>
                  {language === 'fa' 
                    ? 'حفظ کامل حریم خصوصی اعضا: مدل‌سازی بدون افشای هویت فردی تریدرها' 
                    : 'Privacy-First Architecture: Algorithmic simulation protecting member confidentiality'}
                </span>
              </div>

            </div>

            {/* Action CTA */}
            <div className="relative z-10 mt-6 sm:mt-8 text-center">
              <button
                onClick={() => onNavigate('about')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Info className="w-4 h-4" />
                <span>{language === 'fa' ? 'درباره پلتفرم بیشتر بدانید' : 'Learn More About the Platform'}</span>
                {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          LEADERSHIP RANKS - ULTRA-PREMIUM LUXURY PODIUM (Unique Design #4)
          ═══════════════════════════════════════════════════════ */}
      <section className="relative py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-purple-500/5 to-transparent blur-3xl -z-10"></div>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold font-mono shadow-lg shadow-amber-500/10">
            <Crown className="w-3.5 h-3.5" />
            {language === 'fa' ? 'رتبه‌های لیدرشیپ و جوایز مدیریتی' : 'Elite Leadership Ranks & Bonuses'}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {language === 'fa' ? 'پاداش‌های نقدی و حق‌امتیاز دائمی' : 'Leadership Tiers & Executive Bonuses'}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {language === 'fa' 
              ? 'با ارتقای حجم شبکه خود، جوایز نقدی تا سقف ۵۰۰,۰۰۰ دلار و حق‌امتیاز دائمی از استخر جهانی دریافت کنید' 
              : 'Scale your team volume to unlock up to $500,000 in direct cash rewards plus permanent global royalty pools'}
          </p>
        </motion.div>

        {/* Auto-Rotating Ranks Grid (4 on Laptop, 3 on Tablet, 2 on Mobile, 1 on Small Mobile) */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
            <AnimatePresence mode="popLayout">
              {visibleRanks.map((rank, idx) => {
                const isApex = rank.isApex;

                return (
                  <motion.div
                    key={`${rank.id}-${currentPage}`}
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -15 }}
                    transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeInOut" }}
                    className={`relative group rounded-[2rem] transition-all duration-300 flex flex-col ${
                      isApex 
                        ? 'ring-2 ring-amber-400/50 shadow-2xl shadow-purple-500/20' 
                        : 'hover:-translate-y-1.5'
                    }`}
                  >
                  {/* Outer Glowing Border Card */}
                  <div className={`relative h-full p-6 sm:p-7 rounded-[2rem] bg-gradient-to-b from-slate-900/95 via-slate-950/90 to-slate-950 border ${rank.borderClass} backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-xl`}>
                    
                    {/* Atmospheric Ambient Glow */}
                    <div 
                      className="absolute -top-20 -right-20 w-44 h-44 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"
                      style={{ background: rank.glowColor }}
                    ></div>

                    {/* Apex Elite Badge */}
                    {isApex && (
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-4 py-1 rounded-b-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border-x border-b border-amber-300 shadow-lg shadow-amber-500/40">
                        <span className="text-[11px] font-black text-slate-950 tracking-wider">
                          👑 APEX ELITE
                        </span>
                      </div>
                    )}

                    {/* Top Content: Tier & Icon & Name */}
                    <div>
                      <div className="flex items-center justify-between mb-4 pt-2">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border ${rank.badgeClass}`}>
                          {rank.tier}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                          <Users className="w-3 h-3 text-slate-400" />
                          <span>{rank.members}</span>
                        </div>
                      </div>

                      {/* Rank Icon with Multi-layer Glow */}
                      <div className="relative my-4 flex justify-center">
                        <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${rank.color} p-0.5 shadow-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                          <div className="w-full h-full rounded-[14px] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center">
                            <rank.icon className="w-9 h-9 text-white drop-shadow-md" />
                          </div>
                        </div>
                      </div>

                      {/* Rank Title */}
                      <h3 className="text-xl font-black text-white text-center mb-1">
                        {rank.name}
                      </h3>
                      <p className="text-xs text-center text-slate-400 font-mono mb-5">
                        {language === 'fa' ? `گردش تیم: $${rank.volume}` : `Team Vol: $${rank.volume}`}
                      </p>

                      {/* Rewards Metric Box */}
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 mb-5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">{language === 'fa' ? 'پاداش نقدی:' : 'Cash Bonus:'}</span>
                          <span className="font-mono font-black text-emerald-400 text-base">{rank.bonus}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">{language === 'fa' ? 'سهم از استخر:' : 'Pool Royalty:'}</span>
                          <span className="font-mono font-bold text-amber-400">{rank.royalty}</span>
                        </div>
                      </div>

                      {/* Perks Checklist */}
                      <div className="space-y-2 mb-6">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {language === 'fa' ? 'مزایای اختصاصی:' : 'Exclusive Perks:'}
                        </div>
                        {rank.perks.map((perk, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span className="leading-tight">{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Unlock Button */}
                    <button
                      onClick={() => onNavigate('ranks')}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                        isApex
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20'
                          : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                      }`}
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      <span>{language === 'fa' ? 'جزییات شرایط احراز' : 'View Requirements'}</span>
                    </button>

                  </div>
                </motion.div>
              );
            })}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom CTA to Full Leadership Page */}
        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate('ranks')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold text-sm shadow-xl shadow-amber-600/30 transition-all hover:scale-[1.02]"
          >
            <Crown className="w-4 h-4" />
            {language === 'fa' ? 'مشاهده جدول کامل طرح پاداش لیدرشیپ' : 'View Full Leadership Career Plan'}
            {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECURITY - FEATURE TABS STYLE (Unique Design #5)
          ═══════════════════════════════════════════════════════ */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5 blur-3xl -z-10"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold font-mono">
            <Lock className="w-3 h-3" />
            {language === 'fa' ? 'امنیت و شفافیت' : 'Security & Transparency'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            {language === 'fa' ? 'دارایی شما، کنترل شما' : 'Your Assets, Your Control'}
          </h2>
          <p className="text-sm text-slate-400">
            {language === 'fa' ? 'با معماری Non-Custodial ما، هیچ‌گاه دارایی خود را از دست نخواهید داد' : 'With our Non-Custodial architecture, you never lose custody'}
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto rounded-[2.5rem] overflow-hidden border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl">
          <div className="grid md:grid-cols-3">
            {[
              {
                icon: KeyRound,
                title: language === 'fa' ? (cms?.home?.feat1Title || 'کلیدهای API محدود') : 'Restricted API Keys',
                desc: language === 'fa' ? (cms?.home?.feat1Desc || 'کلیدها فقط با مجوز خواندن و ترید فعال می‌شوند - دسترسی برداشت صفر.') : 'API keys with Read & Trade permissions only — zero withdrawal access.',
                color: 'cyan',
                gradient: 'from-cyan-500 to-blue-500',
                features: [
                  { icon: CheckCircle2, text: language === 'fa' ? 'Read-Only API' : 'Read-Only API' },
                  { icon: CheckCircle2, text: language === 'fa' ? 'Trade Execution Only' : 'Trade Execution' },
                  { icon: Shield, text: language === 'fa' ? 'Zero Withdraw Access' : 'Zero Withdraw' }
                ]
              },
              {
                icon: Wallet,
                title: language === 'fa' ? (cms?.home?.feat2Title || 'وجوه در حساب شخصی') : 'Funds in Your Account',
                desc: language === 'fa' ? (cms?.home?.feat2Desc || 'دارایی‌های شما همیشه در حساب صرافی شخصی خودتان باقی می‌ماند.') : 'Your funds always remain in your personal exchange account.',
                color: 'emerald',
                gradient: 'from-emerald-500 to-teal-500',
                features: [
                  { icon: CheckCircle2, text: language === 'fa' ? 'Non-Custodial' : 'Non-Custodial' },
                  { icon: CheckCircle2, text: language === 'fa' ? 'Your Keys, Your Crypto' : 'Your Keys' },
                  { icon: Shield, text: language === 'fa' ? 'Full Control' : 'Full Control' }
                ]
              },
              {
                icon: Server,
                title: language === 'fa' ? (cms?.home?.feat3Title || 'شفافیت لحظه‌ای') : 'Real-Time Transparency',
                desc: language === 'fa' ? (cms?.home?.feat3Desc || 'محاسبات آنی سرورساید بدون تأخیر با گزارش‌گیری کامل بلاکچین.') : 'Instant server-side calculations with full blockchain reporting.',
                color: 'purple',
                gradient: 'from-purple-500 to-pink-500',
                features: [
                  { icon: CheckCircle2, text: language === 'fa' ? 'Live Calculations' : 'Live Calc' },
                  { icon: CheckCircle2, text: language === 'fa' ? 'Blockchain Verified' : 'Blockchain' },
                  { icon: Shield, text: language === 'fa' ? 'Audit Trail' : 'Audit Trail' }
                ]
              }
            ].map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="group relative p-8 border-r last:border-r-0 border-white/10 hover:bg-slate-800/30 transition-all"
              >
                <div className={`absolute -top-12 -right-12 w-32 h-32 bg-${feat.color}-500/10 blur-3xl rounded-full group-hover:bg-${feat.color}-500/20 transition-colors`}></div>
                
                {/* Icon */}
                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform`}>
                  <feat.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-white font-black text-lg mb-3">{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">{feat.desc}</p>

                {/* Feature list */}
                <ul className="space-y-2">
                  {feat.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <f.icon className={`w-3.5 h-3.5 text-${feat.color}-400 flex-shrink-0`} />
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA bar */}
          <div className="p-6 border-t border-white/10 bg-slate-950/50 text-center">
            <button
              onClick={() => onNavigate('risk')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800/60 hover:bg-slate-700/60 text-white font-bold text-sm border border-white/10 hover:border-cyan-500/40 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              {language === 'fa' ? 'مشاهده افشای ریسک' : 'View Risk Disclosure'}
              {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          BLOG - MAGAZINE STYLE (Unique Design #6)
          ═══════════════════════════════════════════════════════ */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 via-transparent to-purple-500/5 blur-3xl -z-10"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold font-mono">
            <BookOpen className="w-3 h-3" />
            {language === 'fa' ? 'وبلاگ و آموزش' : 'Blog & Insights'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            {language === 'fa' ? 'آخرین مقالات و آموزش‌ها' : 'Latest Articles & Tutorials'}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.map((post, idx) => (
            <motion.article
              key={post.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onNavigate('blog')}
              className="group cursor-pointer"
            >
              <div className="relative rounded-3xl overflow-hidden bg-slate-900/60 border border-white/10 hover:border-pink-500/40 backdrop-blur-xl transition-all group-hover:-translate-y-2">
                
                {/* Featured image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                  <img src={post.coverImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                  {/* Category badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-slate-950/90 backdrop-blur-md border border-white/20">
                    <span className="text-xs font-bold text-white">{post.category}</span>
                  </div>

                  {/* Read time */}
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-md bg-slate-950/90 backdrop-blur-md flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] text-slate-400 font-mono">{post.readTimeMinutes} {language === 'fa' ? 'دقیقه' : 'min'}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-black text-white leading-snug group-hover:text-pink-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>

                  {/* Author & Date */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <img src={post.author?.avatar} alt={post.author?.name} className="w-6 h-6 rounded-full object-cover border border-white/20" />
                      <span className="text-[10px] text-slate-300 font-medium">{post.author?.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                      <Calendar className="w-3 h-3" />
                      <span>{post.publishedAt}</span>
                    </div>
                  </div>

                  {/* Read more link */}
                  <div className="flex items-center gap-1.5 text-xs text-pink-400 font-bold pt-2">
                    <span>{language === 'fa' ? 'مطالعه بیشتر' : 'Read More'}</span>
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate('blog')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-pink-600/30 transition-all"
          >
            {language === 'fa' ? 'مشاهده همه مقالات' : 'View All Articles'}
            {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FAQ & FINAL CTA - SPLIT LAYOUT (Unique Design #7)
          ═══════════════════════════════════════════════════════ */}
      <section className="grid lg:grid-cols-2 gap-8">
        
        {/* FAQ Column */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold font-mono">
              <HelpCircle className="w-3 h-3" />
              {language === 'fa' ? 'سوالات متداول' : 'FAQ'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {language === 'fa' ? 'پاسخ به سوالات پرتکرار' : 'Common Questions'}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl overflow-hidden hover:border-indigo-500/30 transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors group"
                >
                  <span className="text-white font-bold text-sm pr-3 group-hover:text-indigo-400 transition-colors">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-400' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-white/5 bg-slate-950/30">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('faq')}
            className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
          >
            {language === 'fa' ? 'مشاهده همه سوالات' : 'View All Questions'}
            {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

        {/* CTA Column */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="relative rounded-3xl bg-slate-950 border border-white/15 p-8 lg:p-12 overflow-hidden flex flex-col justify-center min-h-[500px] shadow-2xl"
        >
          {/* Architectural Background Image + Fallback + Atmospheric Scrim */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#070B14] to-slate-950" />
          <img
            src={ctaBgImg}
            alt={language === 'fa' ? 'معماری شبکه‌ای تیجکس' : 'TGEX Architectural Fintech Background'}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-70 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-slate-950/50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_55%)] pointer-events-none" />

          <div className="relative z-10 space-y-6 text-center">
            <div className="flex items-center justify-center gap-2 text-cyan-300 text-xs font-mono font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {language === 'fa' ? 'آماده شروع هستید؟' : 'Ready to Begin?'}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight text-balance">
              {language === 'fa' ? 'همین الان شروع کنید' : 'Start Earning Today'}
            </h2>
            
            <p className="text-slate-300 text-sm leading-relaxed max-w-md mx-auto">
              {language === 'fa' 
                ? 'به هزاران کاربر موفق بپیوندید که با تیجکس درآمد پسیو خود را چند برابر کرده‌اند.'
                : 'Join thousands who have multiplied their passive income with TGEX.'}
            </p>

            <div className="flex flex-col gap-3 pt-2 max-w-xs mx-auto w-full">
              <button
                onClick={() => onNavigate('dashboard')}
                className="group relative w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2 overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Rocket className="w-4 h-4 relative z-10 shrink-0" />
                <span className="relative z-10">{language === 'fa' ? 'ثبت‌نام رایگان' : 'Sign Up Free'}</span>
                {dir === 'rtl' ? <ArrowLeft className="w-4 h-4 relative z-10 shrink-0" /> : <ArrowRight className="w-4 h-4 relative z-10 shrink-0" />}
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="w-full py-3 px-5 rounded-xl bg-slate-900/75 hover:bg-slate-800/90 text-slate-100 font-bold text-sm border border-white/15 hover:border-cyan-400/40 backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{language === 'fa' ? 'تماس با پشتیبانی' : 'Contact Support'}</span>
              </button>
            </div>

            {/* Unboxed Editorial Trust Line */}
            <div className="flex items-center justify-center gap-2.5 pt-4 text-slate-300/85 text-[11px] font-mono flex-wrap">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SSL Secured</span>
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Global Network</span>
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                <span>24/7 Support</span>
              </span>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

// Add custom scrollbar styles to your global CSS or Tailwind config
import { LevelItem, RankItem, CopyTraderDemo, FAQItem, HowItWorksStep, DashboardLevelCard, DirectReferralUser, ActivityFeedItem } from '../types';
import { databaseService } from '../services/db/databaseService';

export const TWENTY_LEVELS: LevelItem[] = [
  {
    letter: 'A',
    levelNumber: 1,
    tierGroup: 'پایه‌ای (Foundation)',
    title: 'سطح A — ورودی و معرف مستقیم (Level 01)',
    description: 'سطح پایه ورود به ساختار هیبرید تیجکس. محاسبه پورسانت مستقیم از سود محقق‌شده ماهانه زیرمجموعه.',
    commissionPlaceholder: 'سهم پاداش سطح ۱: ۱۰.۰۰٪ از سود محقق‌شده ماهانه',
    qualifyingUsers: 1,
    networkDepth: 'عمق ۱ لایه مستقیم',
    accentColor: 'border-blue-500 text-blue-400 bg-blue-500/10'
  },
  {
    letter: 'B',
    levelNumber: 2,
    tierGroup: 'پایه‌ای (Foundation)',
    title: 'سطح B — ارتقای مقدماتی (Level 02)',
    description: 'فعال‌سازی لایه دوم پاداش شبکه هیبرید با ۲ معرف مستقیم فعال.',
    commissionPlaceholder: 'سهم پاداش سطح ۲: ۵.۰۰٪ از سود محقق‌شده ماهانه',
    qualifyingUsers: 2,
    networkDepth: 'عمق ۲ لایه ساختاری',
    accentColor: 'border-blue-500 text-blue-400 bg-blue-500/10'
  },
  {
    letter: 'C',
    levelNumber: 3,
    tierGroup: 'پایه‌ای (Foundation)',
    title: 'سطح C — فعال‌ساز شبکه (Level 03)',
    description: 'پوشش لایه سوم با تخصیص سود محقق‌شده حاصل از معاملات کپی‌تریدینگ.',
    commissionPlaceholder: 'سهم پاداش سطح ۳: ۳.۰۰٪ از سود محقق‌شده ماهانه',
    qualifyingUsers: 3,
    networkDepth: 'عمق ۳ لایه ساختاری',
    accentColor: 'border-blue-500 text-blue-400 bg-blue-500/10'
  },
  {
    letter: 'D',
    levelNumber: 4,
    tierGroup: 'پایه‌ای (Foundation)',
    title: 'سطح D — تثبیت مقدماتی (Level 04)',
    description: 'پوشش ۴ لایه عمق ساختاری با ابزارهای پیگیری هوشمند زیرمجموعه‌ها.',
    commissionPlaceholder: 'سهم پاداش سطح ۴: ۲.۰۰٪ از سود محقق‌شده ماهانه',
    qualifyingUsers: 5,
    networkDepth: 'عمق ۴ لایه ساختاری',
    accentColor: 'border-blue-500 text-blue-400 bg-blue-500/10'
  },
  {
    letter: 'E',
    levelNumber: 5,
    tierGroup: 'توسعه (Expansion)',
    title: 'سطح E — توسعه‌دهنده شبکه (Level 05)',
    description: 'آغاز سطوح توسعه ماتریس با دسترسی به عمق ۵ لایه ساختاری.',
    commissionPlaceholder: 'سهم پاداش سطح ۵: ۲.۰۰٪ از سود محقق‌شده ماهانه',
    qualifyingUsers: 8,
    networkDepth: 'عمق ۵ لایه ساختاری',
    accentColor: 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
  },
  {
    letter: 'F',
    levelNumber: 6,
    tierGroup: 'توسعه (Expansion)',
    title: 'سطح F — هماهنگ‌کننده گروه (Level 06)',
    description: 'دسترسی به داشبورد تحلیلی پیشرفته نرخ رشد و بازدهی تیم.',
    commissionPlaceholder: 'سهم پاداش سطح ۶: ۱.۵۰٪ از سود محقق‌شده ماهانه',
    qualifyingUsers: 10,
    networkDepth: 'عمق ۶ لایه ساختاری',
    accentColor: 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
  },
  {
    letter: 'G',
    levelNumber: 7,
    tierGroup: 'توسعه (Expansion)',
    title: 'سطح G — شتاب‌دهنده پورتفولیو (Level 07)',
    description: 'پوشش لایه هفتم ساختار سازمانی بر مبنای سود واقعی ماهانه.',
    commissionPlaceholder: 'سهم پاداش سطح ۷: ۱.۵۰٪ از سود محقق‌شده ماهانه',
    qualifyingUsers: 12,
    networkDepth: 'عمق ۷ لایه ساختاری',
    accentColor: 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
  },
  {
    letter: 'H',
    levelNumber: 8,
    tierGroup: 'توسعه (Expansion)',
    title: 'سطح H — کانون پایداری تیم (Level 08)',
    description: 'پوشش ۸ لایه و باز شدن گزارش‌های زنده گردش مالی شبکه.',
    commissionPlaceholder: 'سهم پاداش سطح ۸: ۱.۰۰٪ از سود محقق‌شده ماهانه',
    qualifyingUsers: 15,
    networkDepth: 'عمق ۸ لایه ساختاری',
    accentColor: 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
  },
  {
    letter: 'I',
    levelNumber: 9,
    tierGroup: 'رهبری (Leadership)',
    title: 'سطح I — آغازگر رهبری (Level 09)',
    description: 'ورود به باشگاه رهبران با پوشش لایه نهم ماتریس.',
    commissionPlaceholder: 'سهم پاداش سطح ۹: ۱.۰۰٪ از سود محقق‌شده ماهانه',
    qualifyingUsers: 18,
    networkDepth: 'عمق ۹ لایه ساختاری',
    accentColor: 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
  },
  {
    letter: 'J',
    levelNumber: 10,
    tierGroup: 'رهبری (Leadership)',
    title: 'سطح J — معمار ساختار (Level 10)',
    description: 'بهینه‌سازی خودکار تخصیص کارمزدها در ۱۰ لایه ساختاری.',
    commissionPlaceholder: 'سهم پاداش سطح ۱۰: ۱.۰۰٪ از سود محقق‌شده ماهانه',
    qualifyingUsers: 20,
    networkDepth: 'عمق ۱۰ لایه ساختاری',
    accentColor: 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
  },
  {
    letter: 'K',
    levelNumber: 11,
    tierGroup: 'رهبری (Leadership)',
    title: 'سطح K — استراتژیست کلان (Level 11)',
    description: 'پوشش لایه ۱۱ هیبرید و دسترسی به استخرهای توسعه شبکه.',
    commissionPlaceholder: 'سهم پاداش سطح ۱۱: ۰.۷۵٪ از سود محقق‌شده ماهانه',
    qualifyingUsers: 22,
    networkDepth: 'عمق ۱۱ لایه ساختاری',
    accentColor: 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
  },
  {
    letter: 'L',
    levelNumber: 12,
    tierGroup: 'رهبری (Leadership)',
    title: 'سطح L — پیشگام ارشد (Level 12)',
    description: 'پوشش ۱۲ لایه با قابلیت مدیریت رویدادهای منطقه‌ای.',
    commissionPlaceholder: 'سهم پاداش سطح ۱۲: ۰.۷۵٪ از سود محقق‌شده ماهانه',
    qualifyingUsers: 25,
    networkDepth: 'عمق ۱۲ لایه ساختاری',
    accentColor: 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
  },
  {
    letter: 'M',
    levelNumber: 13,
    tierGroup: 'مدیریتی (Executive)',
    title: 'سطح M — مدیر اجرایی (Level 13)',
    description: 'آغاز سطوح مدیریتی با سهم لایه ۱۳ از سود معاملات شبکه.',
    commissionPlaceholder: 'سهم پاداش سطح ۱۳: ۰.۵۰٪ از سود محقق‌شده ماهانه',
    qualifyingUsers: 28,
    networkDepth: 'عمق ۱۳ لایه ساختاری',
    accentColor: 'border-purple-500 text-purple-400 bg-purple-500/10'
  },
  {
    letter: 'N',
    levelNumber: 14,
    tierGroup: 'مدیریتی (Executive)',
    title: 'سطح N — مدیر ارشد توسعه (Level 14)',
    description: 'پوشش لایه ۱۴ با نظارت تحلیلی بر سودهای کپی تریدینگ.',
    commissionPlaceholder: 'سهم پاداش سطح ۱۴: ۰.۵۰٪ از سود محقق‌شده ماهانه',
    qualifyingUsers: 30,
    networkDepth: 'عمق ۱۴ لایه ساختاری',
    accentColor: 'border-purple-500 text-purple-400 bg-purple-500/10'
  },
  {
    letter: 'O',
    levelNumber: 15,
    tierGroup: 'مدیریتی (Executive)',
    title: 'سطح O — مدیر منطقه‌ای (Level 15)',
    description: 'پوشش لایه ۱۵ با پشتیبانی اختصاصی و صندوق توسعه تیم.',
    commissionPlaceholder: 'سهم پاداش سطح ۱۵: ۰.۵۰٪ از سود محقق‌شده ماهانه',
    qualifyingUsers: 35,
    networkDepth: 'عمق ۱۵ لایه ساختاری',
    accentColor: 'border-purple-500 text-purple-400 bg-purple-500/10'
  },
  {
    letter: 'P',
    levelNumber: 16,
    tierGroup: 'مدیریتی (Executive)',
    title: 'سطح P — مدیر عالی‌رتبه (Level 16)',
    description: 'پوشش ۱۶ لایه کامل با دسترسی به ابزارهای تحلیل رفتار تیم.',
    commissionPlaceholder: 'سهم پاداش سطح ۱۶: ۰.۲۵٪ از سود محقق‌شده ماهانه',
    qualifyingUsers: 40,
    networkDepth: 'عمق ۱۶ لایه ساختاری',
    accentColor: 'border-purple-500 text-purple-400 bg-purple-500/10'
  },
  {
    letter: 'Q',
    levelNumber: 17,
    tierGroup: 'حاکمیتی (Sovereign)',
    title: 'سطح Q — سفیر عالی پلتفرم (Level 17)',
    description: 'ورود به حلقه نخبگان حاکمیتی با پوشش لایه ۱۷.',
    commissionPlaceholder: 'سهم پاداش سطح ۱۷: ۰.۲۵٪ از سود محقق‌شده ماهانه',
    qualifyingUsers: 45,
    networkDepth: 'عمق ۱۷ لایه ساختاری',
    accentColor: 'border-amber-500 text-amber-400 bg-amber-500/10'
  },
  {
    letter: 'R',
    levelNumber: 18,
    tierGroup: 'حاکمیتی (Sovereign)',
    title: 'سطح R — معتمد کلان شبکه (Level 18)',
    description: 'مشارکت مستقیم در تصمیم‌گیری‌های کلان با پوشش لایه ۱۸.',
    commissionPlaceholder: 'سهم پاداش سطح ۱۸: ۰.۲۵٪ از سود محقق‌شده ماهانه',
    qualifyingUsers: 50,
    networkDepth: 'عمق ۱۸ لایه ساختاری',
    accentColor: 'border-amber-500 text-amber-400 bg-amber-500/10'
  },
  {
    letter: 'S',
    levelNumber: 19,
    tierGroup: 'حاکمیتی (Sovereign)',
    title: 'سطح S — عضو ارشد هیئت امنا (Level 19)',
    description: 'بالاترین رده نفوذ در شبکه و پوشش لایه ۱۹ ساختار.',
    commissionPlaceholder: 'سهم پاداش سطح ۱۹: ۰.۲۵٪ از سود محقق‌شده ماهانه',
    qualifyingUsers: 60,
    networkDepth: 'عمق ۱۹ لایه ساختاری',
    accentColor: 'border-amber-500 text-amber-400 bg-amber-500/10'
  },
  {
    letter: 'T',
    levelNumber: 20,
    tierGroup: 'حاکمیتی (Sovereign)',
    title: 'سطح T — نقطه اوج ماتریس (Level 20 - Titan)',
    description: 'بالاترین جایگاه ممکن در ساختار ۲۰ سطحی با پوشش کامل تمام ۲۰ لایه سازمان.',
    commissionPlaceholder: 'سهم پاداش سطح ۲۰: ۰.۲۵٪ از سود محقق‌شده ماهانه',
    qualifyingUsers: 70,
    networkDepth: 'عمق کامل ۲۰ لایه ساختار',
    accentColor: 'border-rose-500 text-rose-400 bg-rose-500/10'
  }
];

export const RANKS_DATA: RankItem[] = [
  {
    id: 'rank_starter',
    name: 'استارتر (Starter)',
    levelRequired: 'تا سطح ۳ ماتریس',
    directSponsorsRequired: 0,
    networkVolumePlaceholder: 'حداقل ۵۰ دلار سرمایه فعال',
    badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    description: 'ثبت‌نام در پلتفرم + حداقل ۵۰ دلار سرمایه فعال.',
    privileges: [
      'ثبت‌نام کامل و دسترسی به داشبورد',
      'حداقل ۵۰ دلار سرمایه فعال',
      'باز شدن پورسانت ماتریس تا سطح ۳'
    ]
  },
  {
    id: 'rank_stager',
    name: 'استیجر (Stager)',
    levelRequired: 'تا سطح ۵ ماتریس',
    directSponsorsRequired: 2,
    networkVolumePlaceholder: 'حساب Active',
    badgeColor: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
    description: 'وضعیت Active به همراه حداقل ۲ معرفی مستقیم Active.',
    privileges: [
      'حساب Active',
      'حداقل ۲ معرفی مستقیم فعال (Active)',
      'باز شدن پورسانت ماتریس تا سطح ۵'
    ]
  },
  {
    id: 'rank_trainer',
    name: 'ترینر (Trainer)',
    levelRequired: 'تا سطح ۱۰ ماتریس',
    directSponsorsRequired: 4,
    networkVolumePlaceholder: 'توسعه خطوط سازمانی',
    badgeColor: 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30',
    description: 'حساب Active + حداقل ۲ عضو با رنک استیجر، از میان خطوطی که زودتر شرایط را برآورده کنند.',
    privileges: [
      'حساب Active',
      'حداقل ۲ عضو با رنک استیجر (Stager)',
      'رعایت منطق رقابتی خطوط و باز شدن پورسانت تا سطح ۱۰'
    ]
  },
  {
    id: 'rank_advisor',
    name: 'مشاور (Advisor)',
    levelRequired: 'تا سطح ۱۵ ماتریس',
    directSponsorsRequired: 6,
    networkVolumePlaceholder: 'گسترش سازمانی',
    badgeColor: 'bg-teal-600/20 text-teal-400 border-teal-500/30',
    description: 'حساب Active + حداقل ۲ عضو با رنک ترینر، طبق منطق رقابتی خطوط.',
    privileges: [
      'حساب Active',
      'حداقل ۲ عضو با رنک ترینر (Trainer)',
      'باز شدن پورسانت ماتریس تا سطح ۱۵'
    ]
  },
  {
    id: 'rank_guide',
    name: 'راهنما (Guide)',
    levelRequired: 'تا سطح ۲۰ ماتریس (کامل)',
    directSponsorsRequired: 10,
    networkVolumePlaceholder: '۱۰۰,۰۰۰ دلار AUM تیم',
    badgeColor: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30',
    description: 'حساب Active + حداقل ۲ عضو با رنک مشاور + حداقل ۱۰۰,۰۰۰ دلار AUM تیم.',
    privileges: [
      'حساب Active',
      'حداقل ۲ عضو با رنک مشاور (Advisor)',
      'حداقل ۱۰۰,۰۰۰ دلار AUM تیم',
      'باز شدن کامل هر ۲۰ سطح پورسانت ماتریس هیبرید'
    ]
  },
  {
    id: 'rank_manager',
    name: 'مدیر (Manager)',
    levelRequired: 'سطح ۲۰ + استخر رهبری (۱۰ امتیاز)',
    directSponsorsRequired: 15,
    networkVolumePlaceholder: '۵۰۰,۰۰۰ دلار AUM تیم',
    badgeColor: 'bg-purple-600/20 text-purple-400 border-purple-500/30',
    description: 'حساب Active + حداقل ۲ عضو با رنک راهنما + حداقل ۵۰۰,۰۰۰ دلار AUM تیم.',
    privileges: [
      'حساب Active',
      'حداقل ۲ عضو با رنک راهنما (Guide)',
      'حداقل ۵۰۰,۰۰۰ دلار AUM تیم',
      'ورود به استخر رهبری ۳٪ سود پلتفرم (تخصیص ۱۰ امتیاز)'
    ]
  },
  {
    id: 'rank_senior_manager',
    name: 'مدیر ارشد (Senior Manager)',
    levelRequired: 'سطح ۲۰ + استخر رهبری (۲۰ امتیاز)',
    directSponsorsRequired: 20,
    networkVolumePlaceholder: '۲,۰۰۰,۰۰۰ دلار AUM',
    badgeColor: 'bg-amber-600/20 text-amber-400 border-amber-500/30',
    description: 'حساب Active + حداقل ۲ عضو با رنک مدیر + حداقل ۲,۰۰۰,۰۰۰ دلار AUM + حداکثر ۶۰٪ حجم کل از یک خط.',
    privileges: [
      'حساب Active',
      'حداقل ۲ عضو با رنک مدیر (Manager)',
      'حداقل ۲,۰۰۰,۰۰۰ دلار AUM تیم',
      'رعایت قانون تعادل خطوط (حداکثر ۶۰٪ از یک خط)',
      'سهم از استخر رهبری ۳٪ پلتفرم (تخصیص ۲۰ امتیاز)'
    ]
  },
  {
    id: 'rank_leader',
    name: 'راهبر (Leader)',
    levelRequired: 'سطح ۲۰ + استخر رهبری (۳۰ امتیاز)',
    directSponsorsRequired: 30,
    networkVolumePlaceholder: '۱۰,۰۰۰,۰۰۰ دلار AUM',
    badgeColor: 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30',
    description: 'حساب Active + تأیید مدیریت + حداقل ۱۰,۰۰۰,۰۰۰ دلار AUM + حداکثر ۵۰٪ حجم کل از یک خط.',
    privileges: [
      'حساب Active و اخذ تأیید مدیریت عالی',
      'حداقل ۱۰,۰۰۰,۰۰۰ دلار AUM تیم',
      'رعایت تعادل خطوط (حداکثر ۵۰٪ از یک خط)',
      'سهم ویژه از استخر رهبری ۳٪ پلتفرم (تخصیص ۳۰ امتیاز)'
    ]
  },
  {
    id: 'rank_senior_leader',
    name: 'راهبر ارشد (Senior Leader)',
    levelRequired: 'سطح ۲۰ + استخر رهبری (۴۰ امتیاز)',
    directSponsorsRequired: 50,
    networkVolumePlaceholder: '۵۰,۰۰۰,۰۰۰ دلار AUM',
    badgeColor: 'bg-rose-600/20 text-rose-400 border-rose-500/30',
    description: 'حساب Active + تأیید مدیریت + حداقل ۵۰,۰۰۰,۰۰۰ دلار AUM + حداکثر ۴۰٪ حجم کل از یک خط.',
    privileges: [
      'حساب Active و تأیید هیئت مدیره عالی',
      'حداقل ۵۰,۰۰۰,۰۰۰ دلار AUM تیم',
      'رعایت تعادل پیشرفته خطوط (حداکثر ۴۰٪ از یک خط)',
      'بالاترین سهم استخر رهبری ۳٪ پلتفرم (تخصیص ۴۰ امتیاز)'
    ]
  }
];

export const DEMO_COPY_TRADERS: CopyTraderDemo[] = [
  {
    id: 'trader_1',
    name: 'آلفا کوانت پرایم',
    handle: '@AlphaQuantPrime',
    strategy: 'الگوریتم میانگین متحرک انطباقی بر جفت‌ارزهای پرنقدینگی با مدیریت ریسک خودکار و حد ضرر پویا.',
    pairs: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'],
    winRate: '۷۸.۴٪',
    simulatedRoi30d: '+۳۲.۶٪',
    riskScore: 3,
    copiersCount: 1420,
    drawdownMax: '۶.۲٪',
    tradingStyle: 'روند محور (Trend Following)'
  },
  {
    id: 'trader_2',
    name: 'نکسوس هایپر گرید',
    handle: '@NexusGridBot',
    strategy: 'استراتژی شبکه‌ای با بازه هوشمند برای بازارهای رنج و نوسان‌گیری با فرکانس بالا در تایم‌فریم ۱۵ دقیقه.',
    pairs: ['ETH/USDT', 'BNB/USDT', 'AVAX/USDT'],
    winRate: '۸۴.۱٪',
    simulatedRoi30d: '+۲۴.۸٪',
    riskScore: 4,
    copiersCount: 980,
    drawdownMax: '۸.۵٪',
    tradingStyle: 'الگوریتم شبکه‌ای (Grid)'
  },
  {
    id: 'trader_3',
    name: 'اسکالپ مومنتوم پرو',
    handle: '@MomentumScalp',
    strategy: 'شکار شکست سطوح کلیدی قیمت و معاملات سریع زیر ۵ دقیقه بر پایه جریان سفارشات (Order Flow).',
    pairs: ['BTC/USDT', 'SOL/USDT', 'DOGE/USDT'],
    winRate: '۷۲.۰٪',
    simulatedRoi30d: '+۴۵.۳٪',
    riskScore: 6,
    copiersCount: 2150,
    drawdownMax: '۱۱.۴٪',
    tradingStyle: 'اسکالپ و مومنتوم'
  },
  {
    id: 'trader_4',
    name: 'دلتا سیف آربیتراژ',
    handle: '@DeltaSafeArb',
    strategy: 'بهره‌برداری از اختلاف قیمت اسپات و فیوچرز و نرخ بهره تامین مالی (Funding Rate Arbitrage).',
    pairs: ['BTC/USDT', 'ETH/USDT'],
    winRate: '۹۴.۸٪',
    simulatedRoi30d: '+۱۴.۲٪',
    riskScore: 1,
    copiersCount: 3100,
    drawdownMax: '۱.۸٪',
    tradingStyle: 'آربیتراژ چند دارایی'
  }
];

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    stepNumber: '۰۱',
    title: 'ایجاد حساب کاربری و تایید ایمیل',
    subtitle: 'ثبت‌نام سریع در ۲ دقیقه',
    description: 'در کمتر از ۲ دقیقه ثبت‌نام اولیه را انجام داده و کد تأیید ۶ رقمی ارسالی به ایمیل خود را تایید کنید.',
    highlights: [
      'اتصال سریع با حساب ایمیل',
      'پشتیبانی اختیاری از ورود گوگل (Google SSO)',
      'ثبت کد معرف و جایگاه در درخت ماتریس'
    ],
    iconName: 'UserCheck'
  },
  {
    stepNumber: '۰۲',
    title: 'تکمیل احراز هویت (KYC)',
    subtitle: 'احراز هویت استاندارد و امن',
    description: 'مدارک هویتی خود را بارگذاری کنید تا هویت شما مطابق با پروتکل‌های جهانی ضد پولشویی (AML) تایید شود.',
    highlights: [
      'بارگذاری ایمن کارت ملی / گذرنامه',
      'ایزوله‌سازی و عدم انتشار اطلاعات در صفحات عمومی',
      'بررسی و تایید سریع توسط واحد انطباق (Compliance)'
    ],
    iconName: 'ShieldCheck'
  },
  {
    stepNumber: '۰۳',
    title: 'عضویت در ساختار و پیوند صرافی',
    subtitle: 'اتصال بدون دسترسی برداشت',
    description: 'حساب معاملاتی صرافی خود را با API Read/Trade متصل کرده و جایگاه خود را در ماتریس ۲۰ سطحی تثبیت کنید.',
    highlights: [
      'بدون امکان برداشت وجه توسط پلتفرم (Non-Custodial)',
      'انتخاب تریدرهای حرفه‌ای بر اساس کارنامه عملکرد',
      'تخصیص سرمایه منعطف و تعیین حد ضرر اضطراری'
    ],
    iconName: 'Network'
  },
  {
    stepNumber: '۰۴',
    title: 'توسعه شبکه و دریافت پاداش‌ها',
    subtitle: 'کسب پاداش در ۲۰ لایه ماتریس',
    description: 'با دعوت دوستان و گسترش تیم خود، پاداش‌های بازاریابی ۲۰ سطحی را مستقیماً در داشبورد خود مانیتور کنید.',
    highlights: [
      'لینک و کد معرف اختصاصی',
      'بهره‌مندی از پاداش‌های ریزشی (Spillover)',
      'تسویه و گزارش‌گیری شفاف و سرورساید'
    ],
    iconName: 'TrendingUp'
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq_1',
    category: 'registration',
    question: 'تیجکس (Tgex) چیست و چگونه کار می‌کند؟',
    answer: 'تیجکس یک پلتفرم فناوری فین‌تک است که دو قابلیت کلیدی را پیوند می‌دهد: کپی تریدینگ همگام‌سازی شده با صرافی‌های بین‌المللی و ساختار بازاریابی شبکه‌ای ۲۰ سطحی با محاسبات کاملاً سرورساید و شفاف.'
  },
  {
    id: 'faq_2',
    category: 'security',
    question: 'آیا سرمایه من نزد تیجکس نگهداری می‌شود؟',
    answer: 'خیر. تیجکس فاقد دسترسی به دارایی‌های شماست. سرمایه شما در حساب صرافی شخصی خودتان باقی می‌ماند و اتصال از طریق کلیدهای API صرفاً با دسترسی مشاهده و اجرای معامله (Read & Trade) بدون حق برداشت انجام می‌شود.'
  },
  {
    id: 'faq_3',
    category: 'verification',
    question: 'تفاوت احراز هویت (KYC) با ثبت‌نام و ورود چیست؟',
    answer: 'ثبت‌نام و ورود صرفاً هویت ورود شما را تایید می‌کنند، در حالی که احراز هویت (KYC) یک فرآیند انطباقی قانونی برای تایید مدارک هویتی مطابق استانداردهای ضد پولشویی (AML) جهت فعال‌سازی برداشت پاداش‌های بازاریابی است.'
  },
  {
    id: 'faq_4',
    category: 'marketing',
    question: 'تفاوت کد حامی (Sponsor) با کد جایگاه (Placement) چیست؟',
    answer: 'حامی شخصی است که شما را مستقیماً به تیجکس دعوت کرده و پاداش معرف مستقیم به ایشان تعلق می‌گیرد. اما جایگاه موقعیت فیزیکی شما در ماتریس ۲۰ سطحی است که بر اساس ظرفیت شاخه‌ها و ریزش (Spillover) مشخص می‌شود.'
  },
  {
    id: 'faq_5',
    category: 'levels',
    question: 'چگونه می‌توانم به سطوح بالاتر (A تا T) ارتقا پیدا کنم؟',
    answer: 'ارتقای سطح به صورت خودکار و بر اساس تعداد معرف‌های مستقیم فعال شما و حجم معاملاتی تحت پوشش در شبکه محاسبه می‌گردد و نیازی به خرید اشتراک‌های اجباری ندارد.'
  },
  {
    id: 'faq_6',
    category: 'earnings',
    question: 'پاداش‌های بازاریابی چگونه تسویه می‌شوند؟',
    answer: 'پاداش‌های شبکه بر اساس کارمزدهای واقعی تولید شده از کپی تریدینگ محاسبه شده و مستقیماً به موجودی کیف پول کاربری شما در داشبورد واریز می‌گردد.'
  }
];

// ===================================================
// User Dashboard Mock Data for Level Cards & Activities
// ===================================================

export const getDynamicDashboardLevels = (userId = 'DX-482917'): DashboardLevelCard[] => {
  return databaseService.getRelative20LevelsForUser(userId).dashboardCards;
};

export const DASHBOARD_20_LEVELS: DashboardLevelCard[] = databaseService.getRelative20LevelsForUser('DX-482917').dashboardCards;

export const getDynamicDirectReferrals = (userId = 'DX-482917'): DirectReferralUser[] => {
  return databaseService.getDirectReferralsForDashboard(userId);
};

export const MOCK_DIRECT_REFERRALS: DirectReferralUser[] = databaseService.getDirectReferralsForDashboard('DX-482917');

export const MOCK_ACTIVITIES: ActivityFeedItem[] = [
  { id: 'act_1', type: 'commission', title: 'دریافت پورسانت کارمزد معامله', description: 'پاداش ۱۸.۵ تتر از کپی تریدینگ زیرمجموعه لایه ۳ ثبت شد.', timeAgo: '۱۰ دقیقه پیش', amount: '+۱۸.۵ USDT' },
  { id: 'act_2', type: 'referral', title: 'عضو جدید در شبکه شما', description: 'کاربر reza.ahmadi با کد معرف شما ثبت‌نام کرد.', timeAgo: '۲ ساعت پیش' },
  { id: 'act_3', type: 'kyc', title: 'احراز هویت با موفقیت تایید شد', description: 'مدارک شناسایی شما توسط کارشناس انطباق تایید گردید.', timeAgo: 'دیروز' },
  { id: 'act_4', type: 'rank', title: 'ارتقای رتبه به طلایی (Gold)', description: 'تبریک! شما به رتبه طلایی سازمانی تیجکس دست یافتید.', timeAgo: '۳ روز پیش' },
  { id: 'act_5', type: 'system', title: 'به‌روزرسانی موتور همگام‌سازی', description: 'تأخیر همگام‌سازی کپی تریدینگ به زیر ۴۰ میلی‌ثانیه کاهش یافت.', timeAgo: '۵ روز پیش' }
];

export const MOCK_EARNINGS_SERIES = [
  { month: 'فروردین', direct: 320, matrix: 650, pool: 120 },
  { month: 'اردیبهشت', direct: 450, matrix: 890, pool: 210 },
  { month: 'خرداد', direct: 580, matrix: 1150, pool: 340 },
  { month: 'تیر', direct: 720, matrix: 1420, pool: 480 },
  { month: 'مرداد', direct: 890, matrix: 1780, pool: 620 },
  { month: 'شهریور', direct: 1100, matrix: 2140, pool: 790 },
  { month: 'مهر', direct: 1280, matrix: 2580, pool: 950 },
  { month: 'آبان', direct: 1450, matrix: 3120, pool: 1180 },
  { month: 'آذر', direct: 1620, matrix: 3650, pool: 1420 },
  { month: 'دی', direct: 1750, matrix: 4100, pool: 1650 },
  { month: 'بهمن', direct: 1820, matrix: 4580, pool: 1850 }
];

// ==========================================
// Network Page: Sponsor, Placement & Tree Data
// ==========================================

export const MOCK_SPONSOR_INFO = {
  id: 'usr_sp_101',
  name: 'مهندس کامران رستمی',
  username: 'kamran_master',
  email: 'k.rostami@tgex.io',
  rank: 'الماس (Diamond)',
  level: 'سطح ۱۵ (Level O)',
  directReferralsCount: 42,
  joinDate: '۱۴۰۲/۰۶/۱۵',
  status: 'active' as const,
  avatarLetter: 'ک'
};

export const MOCK_PLACEMENT_INFO = {
  placementParentId: 'NODE_ALPHA_ROOT',
  parentName: 'امیررضا هدایتی',
  parentUsername: 'amir_hedayat',
  side: 'شاخه راست (Right Leg)',
  treeDepth: 4,
  matrixNodeCode: 'TX-NODE-9942',
  description: 'جایگاه ساختاری شما در شاخه راست ماتریس سراسری تثبیت شده و کلیه اعضای ورودی بر اساس الگوریتم توزیع متوازن (Spillover) در این شاخه چیدمان می‌شوند.'
};

export const MOCK_NETWORK_TREE_ROOT: import('../types').NetworkTreeNode = {
  id: 'usr_root',
  name: 'سامان کریمیان (شما)',
  username: 'saman_trader',
  rank: 'طلایی (Gold)',
  levelLetter: 'H',
  levelNumber: 8,
  status: 'active',
  networkSize: 184,
  directCount: 14,
  networkVolumeUsdt: 125000,
  networkProfitUsdt: 34200,
  sponsorName: 'مهندس کامران رستمی',
  sponsorId: 'usr_sp_101',
  placementId: 'TX-NODE-9942',
  joinedDate: '۱۴۰۳/۰۴/۱۰',
  children: [
    {
      id: 'usr_c1',
      name: 'علی کریمی',
      username: 'ali_karimi',
      rank: 'نقره‌ای (Silver)',
      levelLetter: 'A',
      levelNumber: 1,
      status: 'active',
      networkSize: 48,
      directCount: 5,
      networkVolumeUsdt: 52000,
      networkProfitUsdt: 11400,
      sponsorName: 'سامان کریمیان',
      sponsorId: 'usr_root',
      placementId: 'TX-NODE-1011',
      placementSide: 'left',
      joinedDate: '۱۴۰۳/۰۵/۰۲',
      children: [
        {
          id: 'usr_c1_1',
          name: 'نوید رادمنش',
          username: 'navid_rad',
          rank: 'برنزی (Bronze)',
          levelLetter: 'B',
          levelNumber: 2,
          status: 'active',
          networkSize: 16,
          directCount: 3,
          networkVolumeUsdt: 18500,
          networkProfitUsdt: 3900,
          sponsorName: 'علی کریمی',
          sponsorId: 'usr_c1',
          placementId: 'TX-NODE-2011',
          joinedDate: '۱۴۰۳/۰۶/۱۰',
          children: [
            {
              id: 'usr_c1_1_1',
              name: 'پرهام شایان',
              username: 'parham_sh',
              rank: 'عضو فعال',
              levelLetter: 'C',
              levelNumber: 3,
              status: 'active',
              networkSize: 4,
              directCount: 1,
              networkVolumeUsdt: 4200,
              networkProfitUsdt: 850,
              sponsorName: 'نوید رادمنش',
              sponsorId: 'usr_c1_1',
              placementId: 'TX-NODE-3011',
              joinedDate: '۱۴۰۳/۰۷/۱۴'
            },
            {
              id: 'usr_c1_1_2',
              name: 'نینا صبوری',
              username: 'nina_s',
              rank: 'عضو عادی',
              levelLetter: 'C',
              levelNumber: 3,
              status: 'inactive',
              networkSize: 2,
              directCount: 0,
              networkVolumeUsdt: 950,
              networkProfitUsdt: 140,
              sponsorName: 'نوید رادمنش',
              sponsorId: 'usr_c1_1',
              placementId: 'TX-NODE-3012',
              joinedDate: '۱۴۰۳/۰۸/۰۱'
            }
          ]
        },
        {
          id: 'usr_c1_2',
          name: 'سارا فرهمند',
          username: 'sarah_f',
          rank: 'برنزی (Bronze)',
          levelLetter: 'B',
          levelNumber: 2,
          status: 'active',
          networkSize: 24,
          directCount: 4,
          networkVolumeUsdt: 26800,
          networkProfitUsdt: 5800,
          sponsorName: 'علی کریمی',
          sponsorId: 'usr_c1',
          placementId: 'TX-NODE-2012',
          joinedDate: '۱۴۰۳/۰۶/۱۸',
          children: [
            {
              id: 'usr_c1_2_1',
              name: 'آرش توکلی',
              username: 'arash_t',
              rank: 'عضو فعال',
              levelLetter: 'C',
              levelNumber: 3,
              status: 'active',
              networkSize: 8,
              directCount: 2,
              networkVolumeUsdt: 8900,
              networkProfitUsdt: 1950,
              sponsorName: 'سارا فرهمند',
              sponsorId: 'usr_c1_2',
              placementId: 'TX-NODE-3021',
              joinedDate: '۱۴۰۳/۰۷/۲۲'
            },
            {
              id: 'usr_c1_2_2',
              name: 'بهروز کیانی',
              username: 'behrooz_k',
              rank: 'عضو فعال',
              levelLetter: 'C',
              levelNumber: 3,
              status: 'active',
              networkSize: 6,
              directCount: 2,
              networkVolumeUsdt: 6400,
              networkProfitUsdt: 1200,
              sponsorName: 'سارا فرهمند',
              sponsorId: 'usr_c1_2',
              placementId: 'TX-NODE-3022',
              joinedDate: '۱۴۰۳/۰۸/۰۵'
            }
          ]
        }
      ]
    },
    {
      id: 'usr_c2',
      name: 'رضا احمدی',
      username: 'reza_trader',
      rank: 'طلایی (Gold)',
      levelLetter: 'A',
      levelNumber: 1,
      status: 'active',
      networkSize: 84,
      directCount: 6,
      networkVolumeUsdt: 89000,
      networkProfitUsdt: 18600,
      sponsorName: 'سامان کریمیان',
      sponsorId: 'usr_root',
      placementId: 'TX-NODE-1012',
      placementSide: 'center',
      joinedDate: '۱۴۰۳/۰۵/۱۰',
      children: [
        {
          id: 'usr_c2_1',
          name: 'حسین نادری',
          username: 'hossein_n',
          rank: 'نقره‌ای (Silver)',
          levelLetter: 'B',
          levelNumber: 2,
          status: 'active',
          networkSize: 38,
          directCount: 4,
          networkVolumeUsdt: 41000,
          networkProfitUsdt: 8900,
          sponsorName: 'رضا احمدی',
          sponsorId: 'usr_c2',
          placementId: 'TX-NODE-2021',
          joinedDate: '۱۴۰۳/۰۶/۲۲',
          children: [
            {
              id: 'usr_c2_1_1',
              name: 'دانیال کاظمی',
              username: 'danial_k',
              rank: 'برنزی (Bronze)',
              levelLetter: 'C',
              levelNumber: 3,
              status: 'active',
              networkSize: 14,
              directCount: 3,
              networkVolumeUsdt: 14200,
              networkProfitUsdt: 3100,
              sponsorName: 'حسین نادری',
              sponsorId: 'usr_c2_1',
              placementId: 'TX-NODE-3031',
              joinedDate: '۱۴۰۳/۰۷/۲۸'
            },
            {
              id: 'usr_c2_1_2',
              name: 'رویا شمس',
              username: 'roya_sh',
              rank: 'عضو فعال',
              levelLetter: 'C',
              levelNumber: 3,
              status: 'active',
              networkSize: 12,
              directCount: 2,
              networkVolumeUsdt: 11800,
              networkProfitUsdt: 2400,
              sponsorName: 'حسین نادری',
              sponsorId: 'usr_c2_1',
              placementId: 'TX-NODE-3032',
              joinedDate: '۱۴۰۳/۰۸/۰۲'
            }
          ]
        },
        {
          id: 'usr_c2_2',
          name: 'مریم کاظمی',
          username: 'maryam_k',
          rank: 'برنزی (Bronze)',
          levelLetter: 'B',
          levelNumber: 2,
          status: 'active',
          networkSize: 32,
          directCount: 3,
          networkVolumeUsdt: 34500,
          networkProfitUsdt: 7400,
          sponsorName: 'رضا احمدی',
          sponsorId: 'usr_c2',
          placementId: 'TX-NODE-2022',
          joinedDate: '۱۴۰۳/۰۶/۲۸',
          children: [
            {
              id: 'usr_c2_2_1',
              name: 'کاوه یزدانی',
              username: 'kaveh_y',
              rank: 'عضو عادی',
              levelLetter: 'C',
              levelNumber: 3,
              status: 'inactive',
              networkSize: 5,
              directCount: 1,
              networkVolumeUsdt: 2800,
              networkProfitUsdt: 420,
              sponsorName: 'مریم کاظمی',
              sponsorId: 'usr_c2_2',
              placementId: 'TX-NODE-3041',
              joinedDate: '۱۴۰۳/۰۸/۱۰'
            }
          ]
        }
      ]
    },
    {
      id: 'usr_c3',
      name: 'مهدی رضایی',
      username: 'mehdi_rezaei',
      rank: 'برنزی (Bronze)',
      levelLetter: 'A',
      levelNumber: 1,
      status: 'active',
      networkSize: 36,
      directCount: 3,
      networkVolumeUsdt: 34000,
      networkProfitUsdt: 7200,
      sponsorName: 'سامان کریمیان',
      sponsorId: 'usr_root',
      placementId: 'TX-NODE-1013',
      placementSide: 'right',
      joinedDate: '۱۴۰۳/۰۵/۲۲',
      children: [
        {
          id: 'usr_c3_1',
          name: 'پویا شجاعی',
          username: 'pouya_sh',
          rank: 'برنزی (Bronze)',
          levelLetter: 'B',
          levelNumber: 2,
          status: 'active',
          networkSize: 18,
          directCount: 2,
          networkVolumeUsdt: 19400,
          networkProfitUsdt: 4100,
          sponsorName: 'مهدی رضایی',
          sponsorId: 'usr_c3',
          placementId: 'TX-NODE-2031',
          joinedDate: '۱۴۰۳/۰۷/۰۵',
          children: [
            {
              id: 'usr_c3_1_1',
              name: 'سینا امانی',
              username: 'sina_a',
              rank: 'عضو فعال',
              levelLetter: 'C',
              levelNumber: 3,
              status: 'active',
              networkSize: 6,
              directCount: 1,
              networkVolumeUsdt: 5800,
              networkProfitUsdt: 1100,
              sponsorName: 'پویا شجاعی',
              sponsorId: 'usr_c3_1',
              placementId: 'TX-NODE-3051',
              joinedDate: '۱۴۰۳/۰۸/۱۵'
            }
          ]
        },
        {
          id: 'usr_c3_2',
          name: 'فرهاد نصیری',
          username: 'farhad_trader',
          rank: 'عضو جدید',
          levelLetter: 'B',
          levelNumber: 2,
          status: 'inactive',
          networkSize: 8,
          directCount: 1,
          networkVolumeUsdt: 5200,
          networkProfitUsdt: 780,
          sponsorName: 'مهدی رضایی',
          sponsorId: 'usr_c3',
          placementId: 'TX-NODE-2032',
          joinedDate: '۱۴۰۳/۰۷/۱۸'
        }
      ]
    },
    {
      id: 'usr_c4',
      name: 'سارا تهرانی',
      username: 'sara_t',
      rank: 'نقره‌ای (Silver)',
      levelLetter: 'A',
      levelNumber: 1,
      status: 'active',
      networkSize: 12,
      directCount: 2,
      networkVolumeUsdt: 38900,
      networkProfitUsdt: 8200,
      sponsorName: 'سامان کریمیان',
      sponsorId: 'usr_root',
      placementId: 'TX-NODE-1014',
      placementSide: 'left',
      joinedDate: '۱۴۰۳/۰۶/۰۱'
    },
    {
      id: 'usr_c5',
      name: 'امیرحسین مرادی',
      username: 'amir_m',
      rank: 'عضو عادی',
      levelLetter: 'A',
      levelNumber: 1,
      status: 'inactive',
      networkSize: 4,
      directCount: 0,
      networkVolumeUsdt: 1200,
      networkProfitUsdt: 180,
      sponsorName: 'سامان کریمیان',
      sponsorId: 'usr_root',
      placementId: 'TX-NODE-1015',
      placementSide: 'right',
      joinedDate: '۱۴۰۳/۰۶/۱۵'
    }
  ]
};

export function getUserNetworkTree(user: import('../types').User): import('../types').NetworkTreeNode {
  const userId = user?.id || user?.email || 'DX-482917';
  return databaseService.buildNetworkTree(userId);
}

// ==========================================
// 20-Level Complete Marketing Structure (Floating Relative 20 Depths)
// ==========================================

export const getDynamicDetailedLevels = (userId = 'DX-482917'): import('../types').StructureLevelDetailed[] => {
  return databaseService.getRelative20LevelsForUser(userId).levels;
};

export const DETAILED_20_LEVELS_STRUCTURE: import('../types').StructureLevelDetailed[] = [
  {
    letter: 'A',
    levelNumber: 1,
    tierGroup: 'پایه‌ای (Foundation)',
    users: 32,
    activeUsers: 26,
    inactiveUsers: 6,
    networkProfitUsdt: 24800,
    commissionRatePercent: 3.00,
    commissionEarnedUsdt: 744.0,
    status: 'unlocked',
    qualificationRequirement: '۱ معرف مستقیم با احراز هویت تایید شده',
    members: [
      { id: 'm_a1', name: 'علی کریمی', username: 'ali_karimi', rank: 'نقره‌ای (Silver)', sponsorName: 'سامان کریمیان', volumeUsdt: 52000, commissionEarnedUsdt: 1560, status: 'active', joinedAt: '۱۴۰۳/۰۵/۰۲' },
      { id: 'm_a2', name: 'رضا احمدی', username: 'reza_trader', rank: 'طلایی (Gold)', sponsorName: 'سامان کریمیان', volumeUsdt: 89000, commissionEarnedUsdt: 2670, status: 'active', joinedAt: '۱۴۰۳/۰۵/۱۰' },
      { id: 'm_a3', name: 'مهدی رضایی', username: 'mehdi_rezaei', rank: 'برنزی (Bronze)', sponsorName: 'سامان کریمیان', volumeUsdt: 34000, commissionEarnedUsdt: 1020, status: 'active', joinedAt: '۱۴۰۳/۰۵/۲۲' },
      { id: 'm_a4', name: 'سارا تهرانی', username: 'sara_t', rank: 'نقره‌ای (Silver)', sponsorName: 'سامان کریمیان', volumeUsdt: 38900, commissionEarnedUsdt: 1167, status: 'active', joinedAt: '۱۴۰۳/۰۶/۰۱' },
      { id: 'm_a5', name: 'امیرحسین مرادی', username: 'amir_m', rank: 'عضو عادی', sponsorName: 'سامان کریمیان', volumeUsdt: 1200, commissionEarnedUsdt: 36, status: 'inactive', joinedAt: '۱۴۰۳/۰۶/۱۵' }
    ]
  },
  {
    letter: 'B',
    levelNumber: 2,
    tierGroup: 'پایه‌ای (Foundation)',
    users: 28,
    activeUsers: 22,
    inactiveUsers: 6,
    networkProfitUsdt: 22400,
    commissionRatePercent: 2.00,
    commissionEarnedUsdt: 448.0,
    status: 'unlocked',
    qualificationRequirement: '۲ معرف مستقیم با حداقل حجم ۵۰۰ USDT',
    members: [
      { id: 'm_b1', name: 'نوید رادمنش', username: 'navid_rad', rank: 'برنزی (Bronze)', sponsorName: 'علی کریمی', volumeUsdt: 18500, commissionEarnedUsdt: 370, status: 'active', joinedAt: '۱۴۰۳/۰۶/۱۰' },
      { id: 'm_b2', name: 'سارا فرهمند', username: 'sarah_f', rank: 'برنزی (Bronze)', sponsorName: 'علی کریمی', volumeUsdt: 26800, commissionEarnedUsdt: 536, status: 'active', joinedAt: '۱۴۰۳/۰۶/۱۸' },
      { id: 'm_b3', name: 'حسین نادری', username: 'hossein_n', rank: 'نقره‌ای (Silver)', sponsorName: 'رضا احمدی', volumeUsdt: 41000, commissionEarnedUsdt: 820, status: 'active', joinedAt: '۱۴۰۳/۰۶/۲۲' },
      { id: 'm_b4', name: 'مریم کاظمی', username: 'maryam_k', rank: 'برنزی (Bronze)', sponsorName: 'رضا احمدی', volumeUsdt: 34500, commissionEarnedUsdt: 690, status: 'active', joinedAt: '۱۴۰۳/۰۶/۲۸' }
    ]
  },
  {
    letter: 'C',
    levelNumber: 3,
    tierGroup: 'پایه‌ای (Foundation)',
    users: 42,
    activeUsers: 35,
    inactiveUsers: 7,
    networkProfitUsdt: 31000,
    commissionRatePercent: 1.60,
    commissionEarnedUsdt: 496.0,
    status: 'unlocked',
    qualificationRequirement: '۳ معرف مستقیم فعال در ساختار',
    members: [
      { id: 'm_c1', name: 'دانیال کاظمی', username: 'danial_k', rank: 'برنزی (Bronze)', sponsorName: 'حسین نادری', volumeUsdt: 14200, commissionEarnedUsdt: 227.2, status: 'active', joinedAt: '۱۴۰۳/۰۷/۲۸' },
      { id: 'm_c2', name: 'رویا شمس', username: 'roya_sh', rank: 'عضو فعال', sponsorName: 'حسین نادری', volumeUsdt: 11800, commissionEarnedUsdt: 188.8, status: 'active', joinedAt: '۱۴۰۳/۰۸/۰۲' },
      { id: 'm_c3', name: 'آرش توکلی', username: 'arash_t', rank: 'عضو فعال', sponsorName: 'سارا فرهمند', volumeUsdt: 8900, commissionEarnedUsdt: 142.4, status: 'active', joinedAt: '۱۴۰۳/۰۷/۲۲' }
    ]
  },
  {
    letter: 'D',
    levelNumber: 4,
    tierGroup: 'پایه‌ای (Foundation)',
    users: 38,
    activeUsers: 29,
    inactiveUsers: 9,
    networkProfitUsdt: 28900,
    commissionRatePercent: 1.20,
    commissionEarnedUsdt: 346.8,
    status: 'unlocked',
    qualificationRequirement: '۵ معرف مستقیم با گردش ماهانه مثبت',
    members: [
      { id: 'm_d1', name: 'پرهام شایان', username: 'parham_sh', rank: 'عضو فعال', sponsorName: 'نوید رادمنش', volumeUsdt: 4200, commissionEarnedUsdt: 50.4, status: 'active', joinedAt: '۱۴۰۳/۰۷/۱۴' },
      { id: 'm_d2', name: 'بهروز کیانی', username: 'behrooz_k', rank: 'عضو فعال', sponsorName: 'سارا فرهمند', volumeUsdt: 6400, commissionEarnedUsdt: 76.8, status: 'active', joinedAt: '۱۴۰۳/۰۸/۰۵' }
    ]
  },
  {
    letter: 'E',
    levelNumber: 5,
    tierGroup: 'توسعه (Expansion)',
    users: 24,
    activeUsers: 18,
    inactiveUsers: 6,
    networkProfitUsdt: 19500,
    commissionRatePercent: 0.90,
    commissionEarnedUsdt: 175.5,
    status: 'unlocked',
    qualificationRequirement: '۸ معرف مستقیم + ۵,۰۰۰ USDT حجم تیمی',
    members: [
      { id: 'm_e1', name: 'سینا امانی', username: 'sina_a', rank: 'عضو فعال', sponsorName: 'پویا شجاعی', volumeUsdt: 5800, commissionEarnedUsdt: 52.2, status: 'active', joinedAt: '۱۴۰۳/۰۸/۱۵' }
    ]
  },
  {
    letter: 'F',
    levelNumber: 6,
    tierGroup: 'توسعه (Expansion)',
    users: 16,
    activeUsers: 11,
    inactiveUsers: 5,
    networkProfitUsdt: 12400,
    commissionRatePercent: 0.80,
    commissionEarnedUsdt: 99.2,
    status: 'unlocked',
    qualificationRequirement: '۱۰ معرف مستقیم + ۱۰,۰۰۰ USDT حجم تیمی',
    members: [
      { id: 'm_f1', name: 'کاوه یزدانی', username: 'kaveh_y', rank: 'عضو عادی', sponsorName: 'مریم کاظمی', volumeUsdt: 2800, commissionEarnedUsdt: 22.4, status: 'inactive', joinedAt: '۱۴۰۳/۰۸/۱۰' }
    ]
  },
  {
    letter: 'G',
    levelNumber: 7,
    tierGroup: 'توسعه (Expansion)',
    users: 12,
    activeUsers: 8,
    inactiveUsers: 4,
    networkProfitUsdt: 9800,
    commissionRatePercent: 0.70,
    commissionEarnedUsdt: 68.6,
    status: 'unlocked',
    qualificationRequirement: '۱۲ معرف مستقیم + ۱۵,۰۰۰ USDT حجم تیمی',
    members: [
      { id: 'm_g1', name: 'نینا صبوری', username: 'nina_s', rank: 'عضو عادی', sponsorName: 'نوید رادمنش', volumeUsdt: 950, commissionEarnedUsdt: 6.65, status: 'inactive', joinedAt: '۱۴۰۳/۰۸/۰۱' }
    ]
  },
  {
    letter: 'H',
    levelNumber: 8,
    tierGroup: 'توسعه (Expansion)',
    users: 10,
    activeUsers: 6,
    inactiveUsers: 4,
    networkProfitUsdt: 6800,
    commissionRatePercent: 0.60,
    commissionEarnedUsdt: 40.8,
    status: 'unlocked',
    qualificationRequirement: '۱۴ معرف مستقیم + ۲۵,۰۰۰ USDT حجم تیمی',
    members: [
      { id: 'm_h1', name: 'فرهاد نصیری', username: 'farhad_trader', rank: 'عضو جدید', sponsorName: 'مهدی رضایی', volumeUsdt: 5200, commissionEarnedUsdt: 31.2, status: 'inactive', joinedAt: '۱۴۰۳/۰۷/۱۸' }
    ]
  },
  {
    letter: 'I',
    levelNumber: 9,
    tierGroup: 'رهبری (Leadership)',
    users: 8,
    activeUsers: 5,
    inactiveUsers: 3,
    networkProfitUsdt: 5400,
    commissionRatePercent: 0.50,
    commissionEarnedUsdt: 27.0,
    status: 'locked',
    qualificationRequirement: '۱۶ معرف مستقیم + دستیابی به رتبه یاقوت (Ruby)',
    members: []
  },
  {
    letter: 'J',
    levelNumber: 10,
    tierGroup: 'رهبری (Leadership)',
    users: 70,
    activeUsers: 58,
    inactiveUsers: 12,
    networkProfitUsdt: 48000,
    commissionRatePercent: 0.45,
    commissionEarnedUsdt: 216.0,
    status: 'locked',
    qualificationRequirement: '۱۸ معرف مستقیم + دستیابی به رتبه زمرد (Emerald)',
    members: []
  },
  {
    letter: 'K',
    levelNumber: 11,
    tierGroup: 'رهبری (Leadership)',
    users: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    networkProfitUsdt: 0,
    commissionRatePercent: 0.40,
    commissionEarnedUsdt: 0,
    status: 'locked',
    qualificationRequirement: '۲۰ معرف مستقیم + دستیابی به رتبه الماس (Diamond)',
    members: []
  },
  {
    letter: 'L',
    levelNumber: 12,
    tierGroup: 'رهبری (Leadership)',
    users: 69,
    activeUsers: 54,
    inactiveUsers: 15,
    networkProfitUsdt: 38400,
    commissionRatePercent: 0.35,
    commissionEarnedUsdt: 134.4,
    status: 'locked',
    qualificationRequirement: '۲۲ معرف مستقیم + ۵۰,۰۰۰ USDT حجم تیمی ماهانه',
    members: []
  },
  {
    letter: 'M',
    levelNumber: 13,
    tierGroup: 'مدیریتی (Executive)',
    users: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    networkProfitUsdt: 0,
    commissionRatePercent: 0.30,
    commissionEarnedUsdt: 0,
    status: 'locked',
    qualificationRequirement: '۲۵ معرف مستقیم + الماس آبی (Blue Diamond)',
    members: []
  },
  {
    letter: 'N',
    levelNumber: 14,
    tierGroup: 'مدیریتی (Executive)',
    users: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    networkProfitUsdt: 0,
    commissionRatePercent: 0.25,
    commissionEarnedUsdt: 0,
    status: 'locked',
    qualificationRequirement: '۲۸ معرف مستقیم + ۱۰۰,۰۰۰ USDT حجم تیمی ماهانه',
    members: []
  },
  {
    letter: 'O',
    levelNumber: 15,
    tierGroup: 'مدیریتی (Executive)',
    users: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    networkProfitUsdt: 0,
    commissionRatePercent: 0.25,
    commissionEarnedUsdt: 0,
    status: 'locked',
    qualificationRequirement: '۳۰ معرف مستقیم + الماس سیاه (Black Diamond)',
    members: []
  },
  {
    letter: 'P',
    levelNumber: 16,
    tierGroup: 'مدیریتی (Executive)',
    users: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    networkProfitUsdt: 0,
    commissionRatePercent: 0.20,
    commissionEarnedUsdt: 0,
    status: 'locked',
    qualificationRequirement: '۳۲ معرف مستقیم + ۲۰۰,۰۰۰ USDT حجم تیمی ماهانه',
    members: []
  },
  {
    letter: 'Q',
    levelNumber: 17,
    tierGroup: 'حاکمیتی (Sovereign)',
    users: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    networkProfitUsdt: 0,
    commissionRatePercent: 0.20,
    commissionEarnedUsdt: 0,
    status: 'locked',
    qualificationRequirement: '۳۵ معرف مستقیم + تاج پادشاهی (Crown Ambassador)',
    members: []
  },
  {
    letter: 'R',
    levelNumber: 18,
    tierGroup: 'حاکمیتی (Sovereign)',
    users: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    networkProfitUsdt: 0,
    commissionRatePercent: 0.15,
    commissionEarnedUsdt: 0,
    status: 'locked',
    qualificationRequirement: '۳۸ معرف مستقیم + ۵۰۰,۰۰۰ USDT حجم تیمی ماهانه',
    members: []
  },
  {
    letter: 'S',
    levelNumber: 19,
    tierGroup: 'حاکمیتی (Sovereign)',
    users: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    networkProfitUsdt: 0,
    commissionRatePercent: 0.10,
    commissionEarnedUsdt: 0,
    status: 'locked',
    qualificationRequirement: '۴۰ معرف مستقیم + استخر جهانی ۱٪',
    members: []
  },
  {
    letter: 'T',
    levelNumber: 20,
    tierGroup: 'حاکمیتی (Sovereign)',
    users: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    networkProfitUsdt: 0,
    commissionRatePercent: 0.05,
    commissionEarnedUsdt: 0,
    status: 'locked',
    qualificationRequirement: 'بالاترین قله شبکه تیجکس — حاکمیت تام (Sovereign Legend)',
    members: []
  }
];


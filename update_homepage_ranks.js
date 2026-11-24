import fs from 'fs';

let content = fs.readFileSync('src/components/pages/HomePage.tsx', 'utf8');

// Replace ranks array
const ranksStart = content.indexOf('  const ranks = [');
const ranksEnd = content.indexOf('  const [rankStartIndex, setRankStartIndex] = useState<number>(0);');

if (ranksStart !== -1 && ranksEnd !== -1) {
  const newRanksCode = `
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

  `;
  content = content.substring(0, ranksStart) + newRanksCode + content.substring(content.indexOf('const calculateEarnings = () => {'));
}

fs.writeFileSync('src/components/pages/HomePage.tsx', content, 'utf8');

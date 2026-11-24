import React, { useState } from 'react';
import { PageId } from '../../types';
import { databaseService } from '../../services/db/databaseService';
import { 
  Layers, 
  Search, 
  Filter, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight, 
  Eye,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';

interface AdminLevelSummary {
  letter: string;
  number: number;
  ratePercent: number;
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  profitUsdt: number;
  commissionUsdt: number;
  topPerformers: string[];
}

const ALL_20_LEVELS_SUMMARY: AdminLevelSummary[] = [
  { letter: 'A', number: 1, ratePercent: 3.00, totalUsers: 340, activeUsers: 280, inactiveUsers: 60, profitUsdt: 0, commissionUsdt: 0, topPerformers: ['علی محمدی', 'رضا حسینی', 'مهدی صادقی'] },
  { letter: 'B', number: 2, ratePercent: 2.00, totalUsers: 512, activeUsers: 410, inactiveUsers: 102, profitUsdt: 0, commissionUsdt: 0, topPerformers: ['فرهاد توکلی', 'محسن ابراهیمی'] },
  { letter: 'C', number: 3, ratePercent: 1.60, totalUsers: 480, activeUsers: 360, inactiveUsers: 120, profitUsdt: 0, commissionUsdt: 0, topPerformers: ['کاوه سلیمانی', 'آرش مرادی'] },
  { letter: 'D', number: 4, ratePercent: 1.20, totalUsers: 410, activeUsers: 310, inactiveUsers: 100, profitUsdt: 0, commissionUsdt: 0, topPerformers: ['نیما رستمی', 'پویا جعفری'] },
  { letter: 'E', number: 5, ratePercent: 0.90, totalUsers: 360, activeUsers: 270, inactiveUsers: 90, profitUsdt: 0, commissionUsdt: 0, topPerformers: ['سینا فلاحی', 'بهروز قاسمی'] },
  { letter: 'F', number: 6, ratePercent: 0.80, totalUsers: 310, activeUsers: 230, inactiveUsers: 80, profitUsdt: 0, commissionUsdt: 0, topPerformers: ['مهران کریمی', 'احسان نوری'] },
  { letter: 'G', number: 7, ratePercent: 0.70, totalUsers: 280, activeUsers: 200, inactiveUsers: 80, profitUsdt: 0, commissionUsdt: 0, topPerformers: ['پیمان حیدری', 'میلاد کاظمی'] },
  { letter: 'H', number: 8, ratePercent: 0.60, totalUsers: 250, activeUsers: 175, inactiveUsers: 75, profitUsdt: 0, commissionUsdt: 0, topPerformers: ['امیر حسنی', 'پدرام انصاری'] },
  { letter: 'I', number: 9, ratePercent: 0.50, totalUsers: 210, activeUsers: 145, inactiveUsers: 65, profitUsdt: 0, commissionUsdt: 0, topPerformers: ['سهیل خانی', 'کیوان تهرانی'] },
  { letter: 'J', number: 10, ratePercent: 0.45, totalUsers: 190, activeUsers: 130, inactiveUsers: 60, profitUsdt: 0, commissionUsdt: 0, topPerformers: ['حسین باقری', 'سعید افشار'] },
  { letter: 'K', number: 11, ratePercent: 0.40, totalUsers: 160, activeUsers: 110, inactiveUsers: 50, profitUsdt: 0, commissionUsdt: 0, topPerformers: ['فرزاد رحمانی'] },
  { letter: 'L', number: 12, ratePercent: 0.35, totalUsers: 140, activeUsers: 95, inactiveUsers: 45, profitUsdt: 0, commissionUsdt: 0, topPerformers: ['کامران صابری'] },
  { letter: 'M', number: 13, ratePercent: 0.30, totalUsers: 120, activeUsers: 80, inactiveUsers: 40, profitUsdt: 0, commissionUsdt: 0, topPerformers: ['داریوش زمانی'] },
  { letter: 'N', number: 14, ratePercent: 0.25, totalUsers: 95, activeUsers: 65, inactiveUsers: 30, profitUsdt: 0, commissionUsdt: 0, topPerformers: ['سهراب پناهی'] },
  { letter: 'O', number: 15, ratePercent: 0.25, totalUsers: 80, activeUsers: 55, inactiveUsers: 25, profitUsdt: 0, commissionUsdt: 0, topPerformers: ['شهروز هدایتی'] },
  { letter: 'P', number: 16, ratePercent: 0.20, totalUsers: 65, activeUsers: 42, inactiveUsers: 23, profitUsdt: 0, commissionUsdt: 0, topPerformers: ['ارسلان کیانی'] },
  { letter: 'Q', number: 17, ratePercent: 0.20, totalUsers: 50, activeUsers: 32, inactiveUsers: 18, profitUsdt: 0, commissionUsdt: 0, topPerformers: ['امید دانایی'] },
  { letter: 'R', number: 18, ratePercent: 0.15, totalUsers: 38, activeUsers: 24, inactiveUsers: 14, profitUsdt: 0, commissionUsdt: 0, topPerformers: ['بابک سروری'] },
  { letter: 'S', number: 19, ratePercent: 0.10, totalUsers: 26, activeUsers: 16, inactiveUsers: 10, profitUsdt: 0, commissionUsdt: 0, topPerformers: ['نوید شمس'] },
  { letter: 'T', number: 20, ratePercent: 0.05, totalUsers: 18, activeUsers: 11, inactiveUsers: 7, profitUsdt: 0, commissionUsdt: 0, topPerformers: ['هومن افضلی'] }
];

interface AdminLevelsPageProps {
  onNavigate?: (page: PageId) => void;
  onSelectUserForDetail?: (userId: string) => void;
}

export const AdminLevelsPage: React.FC<AdminLevelsPageProps> = ({
  onNavigate,
  onSelectUserForDetail
}) => {
  const [selectedLevel, setSelectedLevel] = useState<AdminLevelSummary>(ALL_20_LEVELS_SUMMARY[0]);
  const [levelSearch, setLevelSearch] = useState('');

  const dbUsers = databaseService.getUsers();
  const currentLevelUsers = dbUsers.filter(u => u.level.includes(`Level ${selectedLevel.letter}`) || u.level.includes(`سطح ${selectedLevel.number}`));

  const filteredSummary = ALL_20_LEVELS_SUMMARY.filter(l => 
    l.letter.toLowerCase().includes(levelSearch.toLowerCase()) ||
    l.number.toString().includes(levelSearch)
  );

  return (
    <div className="space-y-6 pb-12 text-slate-200 text-right" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>20-LEVEL HYBRID SYSTEM DEPTH (LEVELS A → T)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            مدیریت و تحلیل سیستم هیبرید ۲۰ سطحی (Admin 20 Levels Audit)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            بررسی نرخ پورسانت، حجم معاملات و توزیع سود در لایه‌های ۲۰ گانه سیستم هیبرید سازمان به تفکیک رتبه‌های سازمانی.
          </p>
        </div>

        {/* Critical Level vs Rank Notice Banner */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-purple-500/20 text-xs text-purple-300 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 flex-shrink-0 text-purple-400" />
          <span>توجه: <strong>سطح (Level A–T)</strong> نشان‌دهنده عمق جایگاه سیستم هیبرید است و با <strong>رتبه (Rank)</strong> تفاوت ساختاری دارد.</span>
        </div>
      </div>

      {/* 1. 20 LEVELS GRID */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>انتخاب و بازرسی لایه‌های سیستم هیبرید (A تا T)</span>
          </h3>
          <span className="text-xs text-slate-400">روی هر سطح کلیک کنید تا اعضا و ریزتراکنش‌های آن سطح لود شود.</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2.5">
          {ALL_20_LEVELS_SUMMARY.map((lvl) => {
            const isSelected = selectedLevel.letter === lvl.letter;
            return (
              <button
                key={lvl.letter}
                onClick={() => setSelectedLevel(lvl)}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                  isSelected
                    ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-600/30 scale-105'
                    : 'bg-slate-950/80 border-white/5 text-slate-300 hover:border-white/20 hover:bg-slate-800'
                }`}
              >
                <div className="font-mono font-black text-sm">Level {lvl.letter}</div>
                <div className="text-[10px] opacity-80 font-mono">سطح {lvl.number}</div>
                <div className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                  isSelected ? 'bg-black/30 text-purple-200' : 'bg-purple-500/10 text-purple-400'
                }`}>
                  {lvl.ratePercent}%
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SELECTED LEVEL SUMMARY KPI BAR */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl space-y-6 animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-purple-600/20">
              {selectedLevel.letter}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">
                  جزئیات عملکرد لایه {selectedLevel.letter} (Level {selectedLevel.number}) در سیستم هیبرید
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-bold">
                  نرخ پورسانت: {selectedLevel.ratePercent}%
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                لیدرهای شاخص این سطح: {selectedLevel.topPerformers.join('، ')}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
            <span className="text-slate-400 text-xs">تعداد اعضای لایه:</span>
            <div className="text-2xl font-black font-mono text-white">{selectedLevel.totalUsers} نفر</div>
            <div className="text-[10px] text-purple-300 font-mono">ظرفیت لایه در سیستم هیبرید</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
            <span className="text-slate-400 text-xs">اعضای فعال / غیرفعال:</span>
            <div className="text-2xl font-black font-mono text-emerald-400">{selectedLevel.activeUsers} فعال</div>
            <div className="text-[10px] text-slate-400 font-mono">{selectedLevel.inactiveUsers} غیرفعال</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
            <span className="text-slate-400 text-xs">سود کل معاملات تیمی:</span>
            <div className="text-2xl font-black font-mono text-blue-400" dir="ltr">۰.۰۰ USDT</div>
            <div className="text-[10px] text-blue-400 font-mono">همگام‌سازی با API کلیکس</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
            <span className="text-slate-400 text-xs">کل پورسانت پرداختی سطح:</span>
            <div className="text-2xl font-black font-mono text-emerald-400" dir="ltr">۰.۰۰ USDT</div>
            <div className="text-[10px] text-slate-400">سهم {selectedLevel.ratePercent}% از سود لایه</div>
          </div>
        </div>

        {/* Table of Members */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>کاربران فعال در لایه {selectedLevel.letter} سیستم هیبرید</span>
            </h4>
          </div>

          <div className="rounded-2xl border border-white/10 overflow-hidden bg-slate-950">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-900/90 text-slate-400 border-b border-white/10 font-mono">
                <tr>
                  <th className="p-3.5">نام و شناسه کاربر</th>
                  <th className="p-3.5">رتبه سازمانی (Rank)</th>
                  <th className="p-3.5">اسپانسر مستقیم</th>
                  <th className="p-3.5">سطح هیبرید</th>
                  <th className="p-3.5">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(currentLevelUsers.length > 0 ? currentLevelUsers : dbUsers.slice(0, 3)).map((user) => (
                  <tr key={user.id} className="hover:bg-slate-900/50 transition">
                    <td className="p-3.5">
                      <div className="font-bold text-white">{user.fullName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">@{user.username} • {user.id}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold">
                        {user.rank}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="text-white font-medium">{user.sponsorName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{user.sponsorId}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="text-cyan-300 font-medium">{user.level}</div>
                      <div className="text-[10px] text-slate-400 font-mono">نرخ لایه: {selectedLevel.ratePercent}%</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        user.accountStatus === 'active' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'
                      }`}>
                        {user.accountStatus === 'active' ? 'فعال' : 'معلق'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};

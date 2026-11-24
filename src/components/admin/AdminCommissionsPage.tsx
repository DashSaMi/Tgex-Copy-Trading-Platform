import React, { useState } from 'react';
import { PageId } from '../../types';
import { 
  DollarSign, 
  Layers, 
  TrendingUp, 
  Calendar, 
  UserCheck, 
  ShieldCheck, 
  Edit3, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  Calculator,
  RefreshCw,
  Clock
} from 'lucide-react';

interface CommissionLevelConfig {
  letter: string;
  levelNumber: number;
  ratePercent: number;
  status: 'active' | 'paused';
  effectiveDate: string;
  updatedBy: string;
  totalDistributedUsdt: number;
  pendingPayoutUsdt: number;
  tierGroup: string;
}

const INITIAL_COMMISSIONS: CommissionLevelConfig[] = [
  { letter: 'A', levelNumber: 1, ratePercent: 3.00, status: 'active', effectiveDate: '2026-01-01', updatedBy: 'super.admin@tgex.io', totalDistributedUsdt: 54200, pendingPayoutUsdt: 2400, tierGroup: 'پایه‌ای' },
  { letter: 'B', levelNumber: 2, ratePercent: 2.00, status: 'active', effectiveDate: '2026-01-01', updatedBy: 'super.admin@tgex.io', totalDistributedUsdt: 38100, pendingPayoutUsdt: 1650, tierGroup: 'پایه‌ای' },
  { letter: 'C', levelNumber: 3, ratePercent: 1.60, status: 'active', effectiveDate: '2026-01-01', updatedBy: 'super.admin@tgex.io', totalDistributedUsdt: 29400, pendingPayoutUsdt: 1200, tierGroup: 'پایه‌ای' },
  { letter: 'D', levelNumber: 4, ratePercent: 1.20, status: 'active', effectiveDate: '2026-01-01', updatedBy: 'super.admin@tgex.io', totalDistributedUsdt: 22800, pendingPayoutUsdt: 950, tierGroup: 'پایه‌ای' },
  { letter: 'E', levelNumber: 5, ratePercent: 0.90, status: 'active', effectiveDate: '2026-01-01', updatedBy: 'super.admin@tgex.io', totalDistributedUsdt: 17500, pendingPayoutUsdt: 740, tierGroup: 'توسعه' },
  { letter: 'F', levelNumber: 6, ratePercent: 0.80, status: 'active', effectiveDate: '2026-01-01', updatedBy: 'super.admin@tgex.io', totalDistributedUsdt: 14600, pendingPayoutUsdt: 610, tierGroup: 'توسعه' },
  { letter: 'G', levelNumber: 7, ratePercent: 0.70, status: 'active', effectiveDate: '2026-01-01', updatedBy: 'super.admin@tgex.io', totalDistributedUsdt: 12300, pendingPayoutUsdt: 520, tierGroup: 'توسعه' },
  { letter: 'H', levelNumber: 8, ratePercent: 0.60, status: 'active', effectiveDate: '2026-01-01', updatedBy: 'super.admin@tgex.io', totalDistributedUsdt: 10400, pendingPayoutUsdt: 440, tierGroup: 'توسعه' },
  { letter: 'I', levelNumber: 9, ratePercent: 0.50, status: 'active', effectiveDate: '2026-01-01', updatedBy: 'super.admin@tgex.io', totalDistributedUsdt: 8900, pendingPayoutUsdt: 380, tierGroup: 'رهبری' },
  { letter: 'J', levelNumber: 10, ratePercent: 0.45, status: 'active', effectiveDate: '2026-01-01', updatedBy: 'super.admin@tgex.io', totalDistributedUsdt: 7800, pendingPayoutUsdt: 320, tierGroup: 'رهبری' },
  { letter: 'K', levelNumber: 11, ratePercent: 0.40, status: 'active', effectiveDate: '2026-01-01', updatedBy: 'super.admin@tgex.io', totalDistributedUsdt: 6700, pendingPayoutUsdt: 270, tierGroup: 'رهبری' },
  { letter: 'L', levelNumber: 12, ratePercent: 0.35, status: 'active', effectiveDate: '2026-01-01', updatedBy: 'super.admin@tgex.io', totalDistributedUsdt: 5600, pendingPayoutUsdt: 230, tierGroup: 'رهبری' },
  { letter: 'M', levelNumber: 13, ratePercent: 0.30, status: 'active', effectiveDate: '2026-01-01', updatedBy: 'super.admin@tgex.io', totalDistributedUsdt: 4500, pendingPayoutUsdt: 190, tierGroup: 'مدیریتی' },
  { letter: 'N', levelNumber: 14, ratePercent: 0.25, status: 'active', effectiveDate: '2026-01-01', updatedBy: 'super.admin@tgex.io', totalDistributedUsdt: 3700, pendingPayoutUsdt: 150, tierGroup: 'مدیریتی' },
  { letter: 'O', levelNumber: 15, ratePercent: 0.25, status: 'active', effectiveDate: '2026-01-01', updatedBy: 'super.admin@tgex.io', totalDistributedUsdt: 3200, pendingPayoutUsdt: 130, tierGroup: 'مدیریتی' },
  { letter: 'P', levelNumber: 16, ratePercent: 0.20, status: 'active', effectiveDate: '2026-01-01', updatedBy: 'super.admin@tgex.io', totalDistributedUsdt: 2500, pendingPayoutUsdt: 100, tierGroup: 'مدیریتی' },
  { letter: 'Q', levelNumber: 17, ratePercent: 0.20, status: 'active', effectiveDate: '2026-01-01', updatedBy: 'super.admin@tgex.io', totalDistributedUsdt: 2100, pendingPayoutUsdt: 80, tierGroup: 'حاکمیتی' },
  { letter: 'R', levelNumber: 18, ratePercent: 0.15, status: 'active', effectiveDate: '2026-01-01', updatedBy: 'super.admin@tgex.io', totalDistributedUsdt: 1600, pendingPayoutUsdt: 60, tierGroup: 'حاکمیتی' },
  { letter: 'S', levelNumber: 19, ratePercent: 0.10, status: 'active', effectiveDate: '2026-01-01', updatedBy: 'super.admin@tgex.io', totalDistributedUsdt: 1100, pendingPayoutUsdt: 40, tierGroup: 'حاکمیتی' },
  { letter: 'T', levelNumber: 20, ratePercent: 0.05, status: 'active', effectiveDate: '2026-01-01', updatedBy: 'super.admin@tgex.io', totalDistributedUsdt: 600, pendingPayoutUsdt: 20, tierGroup: 'حاکمیتی' }
];

export const AdminCommissionsPage: React.FC<{ onNavigate?: (page: PageId) => void }> = () => {
  const [commissions, setCommissions] = useState<CommissionLevelConfig[]>(INITIAL_COMMISSIONS);
  const [editingLetter, setEditingLetter] = useState<string | null>(null);
  const [newRate, setNewRate] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isSettling, setIsSettling] = useState(false);

  const totalDistributed = commissions.reduce((acc, c) => acc + c.totalDistributedUsdt, 0);
  const totalPending = commissions.reduce((acc, c) => acc + c.pendingPayoutUsdt, 0);
  const totalPercentage = commissions.reduce((acc, c) => acc + (c.status === 'active' ? c.ratePercent : 0), 0);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleStartEdit = (item: CommissionLevelConfig) => {
    setEditingLetter(item.letter);
    setNewRate(item.ratePercent);
  };

  const handleSaveEdit = (letter: string) => {
    setCommissions(commissions.map(c => {
      if (c.letter === letter) {
        return {
          ...c,
          ratePercent: newRate,
          effectiveDate: new Date().toISOString().slice(0, 10),
          updatedBy: 'super.admin@tgex.io'
        };
      }
      return c;
    }));
    setEditingLetter(null);
    showToast(`نرخ پورسانت سطح ${letter} با موفقیت به ${newRate}% تغییر یافت.`);
  };

  const handleExecuteSettlement = () => {
    setIsSettling(true);
    setTimeout(() => {
      setCommissions(commissions.map(c => ({
        ...c,
        totalDistributedUsdt: c.totalDistributedUsdt + c.pendingPayoutUsdt,
        pendingPayoutUsdt: 0
      })));
      setIsSettling(false);
      showToast('عملیات تسویه خودکار پورسانت‌ها با موفقیت در لایه سرور انجام شد.');
    }, 1200);
  };

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-mono mb-1.5 border border-emerald-500/20">
            <DollarSign className="w-3.5 h-3.5" />
            <span>COMMISSION ENGINE & 20-LEVEL MATRIX SETTLEMENTS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            مدیریت نرخ‌های پورسانت و تسویه‌های مالی ۲۰ سطح
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            تعیین درصدهای پاداش شبکه‌ای از سطح A تا T، مانیتورینگ کارمزدهای تریدینگ و پردازش تسویه‌ها.
          </p>
        </div>

        <button
          onClick={handleExecuteSettlement}
          disabled={isSettling || totalPending === 0}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center gap-2 cursor-pointer disabled:opacity-40"
        >
          <RefreshCw className={`w-4 h-4 ${isSettling ? 'animate-spin' : ''}`} />
          <span>{isSettling ? 'در حال تسویه سرور...' : `تسویه پورسانت‌های جاری ($${totalPending.toLocaleString()})`}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 space-y-1">
          <div className="text-xs text-slate-400">مجموع پورسانت‌های توزیع‌شده:</div>
          <div className="text-2xl font-black font-mono text-emerald-400" dir="ltr">
            ${totalDistributed.toLocaleString()} USDT
          </div>
          <div className="text-[11px] text-slate-500">حاصل از گردش سود تریدرها در بروکرهای همکار</div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 space-y-1">
          <div className="text-xs text-slate-400">پورسانت‌های در انتظار تسویه:</div>
          <div className="text-2xl font-black font-mono text-amber-400" dir="ltr">
            ${totalPending.toLocaleString()} USDT
          </div>
          <div className="text-[11px] text-slate-500">آماده پرداخت به کیف‌پول‌های اعضا</div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 space-y-1">
          <div className="text-xs text-slate-400">مجموع درصدهای توزیع ماتریس (A to T):</div>
          <div className="text-2xl font-black font-mono text-cyan-400">
            {totalPercentage.toFixed(2)}%
          </div>
          <div className="text-[11px] text-slate-500">سقف مجاز ماتریس ۲۰ سطحی: ۱۴.۰۰٪</div>
        </div>
      </div>

      {/* 20% Profit Pool Allocation Architecture Banner */}
      <div className="p-5 rounded-3xl bg-slate-900/70 border border-blue-500/20 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Calculator className="w-4 h-4 text-blue-400" />
            <span>معماری توزیع ۲۰٪ سود محقق‌شده ماهانه پلتفرم مرجع (Calex / کلیکس)</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            مبنای محاسبه: فقط سود محقق‌شده ماهانه (Realized Profit Only)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-bold">۱. ساختار ۲۰ سطحی هیبرید</span>
              <span className="text-cyan-400 font-mono font-bold">14.00%</span>
            </div>
            <p className="text-[11px] text-slate-400">توزیع پله‌ای بر اساس جدول مصوب از Level 01 (3.00%) تا Level 20 (0.05%)</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-bold">۲. پورسانت معرف مستقیم (Direct Sponsor)</span>
              <span className="text-blue-400 font-mono font-bold">3.00%</span>
            </div>
            <p className="text-[11px] text-slate-400">تخصیص اختصاصی به معرف مستقیم کاربر از سود محقق‌شده</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-bold">۳. استخر لیدرشیپ و توسعه (Leadership Pool)</span>
              <span className="text-purple-400 font-mono font-bold">3.00%</span>
            </div>
            <p className="text-[11px] text-slate-400">پاداش‌های ماهانه ویژه راهبران ارشد و استخرهای ارزی پلتفرم</p>
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="font-bold text-white text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>جدول نرخ‌ها و وضعیت ۲۰ سطح (Levels A to T)</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">SERVER CONFIG: SECURE</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/70 text-slate-400 font-medium border-b border-white/5">
              <tr>
                <th className="p-3.5">سطح ماتریس</th>
                <th className="p-3.5">دسته‌بندی</th>
                <th className="p-3.5">درصد پورسانت (Rate %)</th>
                <th className="p-3.5">وضعیت</th>
                <th className="p-3.5">کل پرداخت شده</th>
                <th className="p-3.5">در انتظار</th>
                <th className="p-3.5">تاریخ اعمال</th>
                <th className="p-3.5">تغییر دهنده</th>
                <th className="p-3.5 text-center">'Actions'</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {commissions.map((item) => (
                <tr key={item.letter} className="hover:bg-white/5 transition">
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 flex items-center justify-center font-bold font-mono">
                        {item.letter}
                      </div>
                      <span className="font-sans text-slate-300 font-semibold">Level {item.levelNumber}</span>
                    </div>
                  </td>

                  <td className="p-3.5 font-sans text-slate-400">
                    {item.tierGroup}
                  </td>

                  <td className="p-3.5">
                    {editingLetter === item.letter ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.1"
                          value={newRate}
                          onChange={(e) => setNewRate(Number(e.target.value))}
                          className="w-20 px-2 py-1 bg-slate-950 border border-blue-500 rounded text-white font-mono text-xs"
                        />
                        <span className="text-slate-400">%</span>
                      </div>
                    ) : (
                      <span className="text-emerald-400 font-bold text-sm">{item.ratePercent}%</span>
                    )}
                  </td>

                  <td className="p-3.5 font-sans">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      فعال
                    </span>
                  </td>

                  <td className="p-3.5 text-slate-300" dir="ltr">
                    ${item.totalDistributedUsdt.toLocaleString()}
                  </td>

                  <td className="p-3.5 text-amber-400 font-bold" dir="ltr">
                    ${item.pendingPayoutUsdt.toLocaleString()}
                  </td>

                  <td className="p-3.5 text-slate-400 text-[11px]">
                    {item.effectiveDate}
                  </td>

                  <td className="p-3.5 text-slate-500 text-[10px]">
                    {item.updatedBy}
                  </td>

                  <td className="p-3.5 text-center font-sans">
                    {editingLetter === item.letter ? (
                      <button
                        onClick={() => handleSaveEdit(item.letter)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1 mx-auto"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>ذخیره</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        title="ویرایش نرخ"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

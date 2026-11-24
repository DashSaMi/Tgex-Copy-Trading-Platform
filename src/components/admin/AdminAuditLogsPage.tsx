import React, { useState, useEffect } from 'react';
import { AdminAuditLog } from '../../types';
import { adminService } from '../../services/adminService';
import { 
  FileText, 
  Search, 
  Filter, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  User, 
  Server, 
  RefreshCw,
  Download
} from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAuditLogs();
      setLogs(data);
    } catch (e) {
      console.error('Failed to load audit logs', e);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter(l => {
    const q = search.toLowerCase();
    const matchesSearch = !q || (
      l.adminEmail.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q) ||
      l.targetId.toLowerCase().includes(q) ||
      (l.targetName && l.targetName.toLowerCase().includes(q)) ||
      l.details.toLowerCase().includes(q)
    );
    const matchesType = filterType === 'all' || l.targetType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-12 text-slate-200 text-right" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>IMMUTABLE SECURITY AUDIT LOGS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            گزارش‌های امنیتی و لاگ اقدامات مدیران (Audit Trail)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            ثبت غیرقابل تغییر تمامی عملیات‌های مدیریتی، تاییدات KYC، ویرایش مشخصات، تعلیق‌ها و تسویه کمیسیون‌ها.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition flex items-center gap-2 text-xs"
        >
          <RefreshCw className="w-4 h-4" />
          <span>بروزرسانی لاگ‌ها</span>
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="جستجو در لاگ‌ها، ادمین یا هدف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-3 pr-9 py-2 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-purple-500 w-full sm:w-auto"
        >
          <option value="all">همه دسته‌بندی‌ها</option>
          <option value="user">کاربران (User)</option>
          <option value="kyc">احراز هویت (KYC)</option>
          <option value="commission">کمیسیون‌ها (Commission)</option>
          <option value="role">نقش‌ها و دسترسی‌ها (Roles)</option>
          <option value="system">تنظیمات سیستم (System)</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">زمان ثبت</th>
                <th className="py-3.5 px-4">مدیر مجری</th>
                <th className="py-3.5 px-4">نقش اداری</th>
                <th className="py-3.5 px-4">نوع اقدام (Action)</th>
                <th className="py-3.5 px-4">هدف / شناسه</th>
                <th className="py-3.5 px-4">شرح تفصیلی 'Actions'</th>
                <th className="py-3.5 px-4">آدرس IP</th>
                <th className="py-3.5 px-4">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap" dir="ltr">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-white whitespace-nowrap">
                    {log.adminEmail}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-white/10">
                      {log.adminRole}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-purple-400 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-bold text-white">{log.targetName || log.targetId}</div>
                    <div className="text-[10px] text-slate-400 font-mono">[{log.targetType.toUpperCase()}] {log.targetId}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate leading-relaxed" title={log.details}>
                    {log.details}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap" dir="ltr">
                    {log.ipAddress}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {log.status.toUpperCase()}
                    </span>
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

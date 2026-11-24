import React, { useState, useEffect } from 'react';
import { KycApplication, KycStatus, PageId } from '../../types';
import { kycService } from '../../services/kycService';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  FileText, 
  Camera, 
  ArrowLeft,
  UserCheck,
  History,
  Lock
} from 'lucide-react';

interface KycAdminPanelProps {
  onNavigate: (page: PageId) => void;
}

export const KycAdminPanel: React.FC<KycAdminPanelProps> = ({ onNavigate }) => {
  const [applications, setApplications] = useState<KycApplication[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<KycApplication | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const loadData = async () => {
    const list = await kycService.getAllApplications();
    setApplications(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleDecision = async (
    appId: string,
    action: 'APPROVED' | 'REJECTED' | 'DOCS_REQUESTED'
  ) => {
    if (action === 'REJECTED' && !actionReason.trim()) {
      notify('لطفاً دلیل رد احراز هویت را درج کنید.');
      return;
    }

    const note = action === 'APPROVED' 
      ? 'مدارک و اطلاعات هویتی با موفقیت تایید گردید.'
      : actionReason || 'درخواست بازنگری مدارک';

    const updated = await kycService.reviewApplication(
      appId,
      action,
      'admin@tgex.io',
      note
    );

    if (updated) {
      notify(`درخواست ${updated.userName} با موفقیت ${action === 'APPROVED' ? 'تایید' : action === 'REJECTED' ? 'رد' : 'به وضعیت نیاز به مدرک تغییر'} یافت.`);
      setSelectedApp(null);
      setActionReason('');
      await loadData();
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = app.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (app.personalInfo.idNumber && app.personalInfo.idNumber.includes(searchQuery));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-slate-200">
      
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-blue-600 text-white text-xs font-bold shadow-2xl shadow-blue-600/40 animate-in slide-in-from-bottom-5 duration-200 border border-white/20">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
            ADMIN COMPLIANCE PORTAL
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
            مدیریت و تایید احراز هویت (KYC Admin)
          </h1>
          <p className="text-xs text-slate-400">
            بررسی امنیتی درخواست‌های احراز هویت، مدارک شناسایی، صدور احکام و ثبت لاگ‌های نظارتی (Audit Logs).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-white/10 transition flex items-center gap-1.5"
          >
            <span>بازگشت به داشبورد</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="جستجوی نام، ایمیل، کدملی..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 pl-9"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl transition ${
              filterStatus === 'all' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
            }`}
          >
            همه ({applications.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-xl transition ${
              filterStatus === 'pending' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
            }`}
          >
            در انتظار بررسی ({applications.filter(a => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1.5 rounded-xl transition ${
              filterStatus === 'approved' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
            }`}
          >
            تایید شده ({applications.filter(a => a.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-3 py-1.5 rounded-xl transition ${
              filterStatus === 'rejected' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
            }`}
          >
            رد شده ({applications.filter(a => a.status === 'rejected').length})
          </button>
        </div>

      </div>

      {/* Applications Table */}
      <div className="rounded-3xl bg-slate-900/60 border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-white/10 uppercase font-mono text-[11px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">شناسه درخواست / کاربر</th>
                <th className="py-3.5 px-4 font-semibold">اطلاعات هویتی</th>
                <th className="py-3.5 px-4 font-semibold">مدارک ارسالی</th>
                <th className="py-3.5 px-4 font-semibold">تاریخ ارسال</th>
                <th className="py-3.5 px-4 font-semibold">وضعیت</th>
                <th className="py-3.5 px-4 font-semibold text-center">اقدام</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-4 px-4">
                    <div className="font-bold text-white">{app.userName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{app.userEmail}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{app.id}</div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="text-slate-300">کدملی: <span className="font-mono text-white">{app.personalInfo.idNumber || '—'}</span></div>
                    <div className="text-slate-400 text-[11px]">کشور: {app.personalInfo.country} | {app.personalInfo.phone}</div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1 text-[11px]">
                      {app.documents.idFrontName && (
                        <span className="text-blue-400 flex items-center gap-1 font-mono">
                          <FileText className="w-3 h-3" />
                          {app.documents.idFrontName}
                        </span>
                      )}
                      {app.documents.selfieName && (
                        <span className="text-amber-400 flex items-center gap-1 font-mono">
                          <Camera className="w-3 h-3" />
                          {app.documents.selfieName}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                    {new Date(app.submittedAt).toLocaleDateString('fa-IR')}
                  </td>

                  <td className="py-4 px-4">
                    {app.status === 'approved' && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3" />
                        تایید شده
                      </span>
                    )}
                    {app.status === 'pending' && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold flex items-center gap-1 w-max">
                        <Clock className="w-3 h-3" />
                        در انتظار بررسی
                      </span>
                    )}
                    {app.status === 'rejected' && (
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold flex items-center gap-1 w-max">
                        <XCircle className="w-3 h-3" />
                        رد شده
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setActionReason(app.rejectionReason || '');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 transition flex items-center gap-1 mx-auto text-xs font-bold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>بررسی و لاگ</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">بررسی درخواست احراز هویت {selectedApp.userName}</h3>
                <span className="text-xs text-blue-400 font-mono">{selectedApp.userEmail}</span>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Personal Details */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <div>کد ملی / پاسپورت: <span className="font-mono font-bold text-white">{selectedApp.personalInfo.idNumber}</span></div>
                <div>تاریخ تولد: <span className="font-mono text-white">{selectedApp.personalInfo.dateOfBirth}</span></div>
                <div>کشور: <span className="text-white">{selectedApp.personalInfo.country}</span></div>
                <div>تلفن همراه: <span className="font-mono text-white">{selectedApp.personalInfo.phone}</span></div>
              </div>
            </div>

            {/* Documents Preview Card */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-3">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>مدارک رمزنگاری شده در مخزن امن (Private Storage)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {selectedApp.documents.idFrontName && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="truncate text-slate-200 font-mono">{selectedApp.documents.idFrontName}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{selectedApp.documents.idFrontSize || '2.4 MB'}</span>
                  </div>
                )}
                {selectedApp.documents.selfieName && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Camera className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span className="truncate text-slate-200 font-mono">{selectedApp.documents.selfieName}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{selectedApp.documents.selfieSize || '3.5 MB'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Rejection / Note Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                توضیحات و دلیل رد (در صورت رد درخواست به کاربر نمایش داده می‌شود):
              </label>
              <textarea
                rows={2}
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="علت رد یا یادداشت نظارتی..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => handleDecision(selectedApp.id, 'APPROVED')}
                className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تایید مدارک (Approve)</span>
              </button>

              <button
                onClick={() => handleDecision(selectedApp.id, 'REJECTED')}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/20"
              >
                <XCircle className="w-4 h-4" />
                <span>رد مدارک (Reject)</span>
              </button>

              <button
                onClick={() => handleDecision(selectedApp.id, 'DOCS_REQUESTED')}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-white/10"
              >
                <Clock className="w-4 h-4" />
                <span>درخواست مدرک مجدد</span>
              </button>
            </div>

            {/* Audit Logs Trail */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <History className="w-4 h-4 text-blue-400" />
                <span>تاریخچه تصمیمات نظارتی (Audit Logbook)</span>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {selectedApp.auditLogs.map((log) => (
                  <div key={log.id} className="p-2.5 rounded-xl bg-slate-950/50 border border-white/5 text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span className="font-bold text-white">{log.action}</span>
                      <span className="font-mono">{new Date(log.timestamp).toLocaleTimeString('fa-IR')} - {new Date(log.timestamp).toLocaleDateString('fa-IR')}</span>
                    </div>
                    <p className="text-slate-300">{log.note}</p>
                    <div className="text-[10px] text-slate-500 font-mono">توسط: {log.adminEmail}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { WithdrawalRequest } from '../../types';
import { databaseService } from '../../services/db/databaseService';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Wallet, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertTriangle, 
  RefreshCw, 
  ArrowDownToLine, 
  ShieldCheck, 
  FileText,
  User,
  Hash,
  Send,
  X
} from 'lucide-react';

interface AdminWithdrawalsPageProps {
  adminEmail: string;
}

export const AdminWithdrawalsPage: React.FC<AdminWithdrawalsPageProps> = ({ adminEmail }) => {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Rejection modal state
  const [rejectingReq, setRejectingReq] = useState<WithdrawalRequest | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  
  // Approval modal state (optional txHash)
  const [approvingReq, setApprovingReq] = useState<WithdrawalRequest | null>(null);
  const [txHashInput, setTxHashInput] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const loadRequests = () => {
    const data = databaseService.getWithdrawalRequests();
    setRequests(data);
  };

  useEffect(() => {
    loadRequests();
    const handleUpdate = () => loadRequests();
    window.addEventListener('tgex_withdrawals_updated', handleUpdate);
    return () => window.removeEventListener('tgex_withdrawals_updated', handleUpdate);
  }, []);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCopyWallet = (wallet: string, id: string) => {
    navigator.clipboard.writeText(wallet);
    setCopiedId(id);
    showToast('آدرس ولت در حافظه کپی شد', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApproveConfirm = () => {
    if (!approvingReq) return;
    if (window.confirm(`آیا از تایید و پرداخت درخواست تسویه ولت به مبلغ ${approvingReq.amountUsdt.toLocaleString()} USDT برای کاربر «${approvingReq.userFullName}» اطمینان دارید؟`)) {
      const success = databaseService.approveWithdrawalRequest(approvingReq.id, adminEmail, txHashInput.trim() || undefined);
      if (success) {
        showToast(`درخواست تسویه کاربر ${approvingReq.userFullName} با موفقیت تایید و ثبت شد.`, 'success');
        setApprovingReq(null);
        setTxHashInput('');
        loadRequests();
      }
    }
  };

  const handleRejectConfirm = () => {
    if (!rejectingReq) return;
    if (!rejectionReasonInput.trim()) {
      showToast('لطفاً دلیل رد درخواست را وارد نمایید.', 'error');
      return;
    }
    const success = databaseService.rejectWithdrawalRequest(rejectingReq.id, rejectionReasonInput.trim(), adminEmail);
    if (success) {
      showToast(`درخواست تسویه کاربر ${rejectingReq.userFullName} رد شد و دلیل در داشبورد وی ثبت گردید.`, 'info');
      setRejectingReq(null);
      setRejectionReasonInput('');
      loadRequests();
    }
  };

  const handleResetToPending = (req: WithdrawalRequest) => {
    const success = databaseService.resetWithdrawalRequestStatus(req.id);
    if (success) {
      showToast(`وضعیت درخواست ${req.userFullName} به «در انتظار بررسی» بازگردانده شد.`, 'info');
      loadRequests();
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesFilter = statusFilter === 'all' || r.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      r.userFullName.toLowerCase().includes(q) ||
      r.username.toLowerCase().includes(q) ||
      r.userEmail.toLowerCase().includes(q) ||
      r.userId.toLowerCase().includes(q) ||
      r.walletAddress.toLowerCase().includes(q) ||
      (r.networkType && r.networkType.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  return (
    <div className="space-y-6 pb-12 text-slate-200 text-right" dir="rtl">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border text-xs font-bold transition-all animate-bounce bg-blue-950/90 border-blue-500/50 text-blue-200">
          {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          {toastMessage.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
          {toastMessage.type === 'info' && <Clock className="w-4 h-4 text-blue-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-2">
            <Wallet className="w-3.5 h-3.5" />
            <span>FINANCIAL SETTLEMENT & DIGITAL WALLET MANAGEMENT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            مدیریت درخواست‌های تسویه و لینک ولت
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            بررسی آدرس‌های کیف پول ارسالی کاربران، تایید پرداخت، ثبت دلیل رد درخواست و ثبت زمان ارسال به تاریخ شمسی.
          </p>
        </div>

        <button
          onClick={loadRequests}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-2 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>به‌روزرسانی لیست</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>کل درخواست‌های ثبت شده</span>
            <ArrowDownToLine className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{requests.length}</div>
          <div className="text-[10px] text-slate-500 font-mono">همه تراکنش‌های برداشت</div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1">
          <div className="text-xs text-amber-300 flex items-center justify-between">
            <span>در انتظار بررسی (Pending)</span>
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono">{pendingCount}</div>
          <div className="text-[10px] text-amber-400/70 font-mono">نیاز به تایید یا رد توسط ادمین</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
          <div className="text-xs text-emerald-300 flex items-center justify-between">
            <span>تایید شده (Approved)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-300 font-mono">{approvedCount}</div>
          <div className="text-[10px] text-emerald-400/70 font-mono">تسویه با موفقیت انجام شده</div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-1">
          <div className="text-xs text-rose-300 flex items-center justify-between">
            <span>رد شده (Rejected)</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-300 font-mono">{rejectedCount}</div>
          <div className="text-[10px] text-rose-400/70 font-mono">دارای دلیل عدم تایید ثبت شده</div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="جستجو با نام کاربر، نام کاربری، شناسه کاربری، آدرس ولت یا شبکه..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-9 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-white/10 shrink-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              statusFilter === 'all' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            همه ({requests.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              statusFilter === 'pending' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            در انتظار ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              statusFilter === 'approved' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            تایید شده ({approvedCount})
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              statusFilter === 'rejected' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            رد شده ({rejectedCount})
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl bg-slate-900/90 border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950 border-b border-white/10 text-slate-400 font-mono">
              <tr>
                <th className="py-3.5 px-4 font-bold">شناسه و اطلاعات کاربر</th>
                <th className="py-3.5 px-4 font-bold">آدرس و لینک ولت (Wallet Address)</th>
                <th className="py-3.5 px-4 font-bold">شبکه رمزارز</th>
                <th className="py-3.5 px-4 font-bold">زمان ارسال (تاریخ شمسی)</th>
                <th className="py-3.5 px-4 font-bold">وضعیت فعلی</th>
                <th className="py-3.5 px-4 font-bold text-center">عملیات ادمین (۳ دکمه کنترلی)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    هیچ درخواست برداشتی با مشخصات جستجو شده یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const isPending = req.status === 'pending';
                  const isApproved = req.status === 'approved';
                  const isRejected = req.status === 'rejected';

                  return (
                    <tr key={req.id} className="hover:bg-slate-800/40 transition">
                      
                      {/* User details */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-white text-xs shrink-0">
                            {req.userFullName ? req.userFullName[0] : 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs">{req.userFullName}</div>
                            <div className="text-[11px] text-slate-400 font-mono">@{req.username}</div>
                            <div className="text-[10px] text-blue-400 font-mono">{req.userId}</div>
                          </div>
                        </div>
                      </td>

                      {/* Wallet Address & Link */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 bg-slate-950 p-2 rounded-xl border border-white/10 font-mono text-[11px] text-emerald-300">
                            <span className="truncate flex-1" dir="ltr">{req.walletAddress}</span>
                            <button
                              onClick={() => handleCopyWallet(req.walletAddress, req.id)}
                              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition shrink-0"
                              title="کپی آدرس ولت"
                            >
                              {copiedId === req.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            {req.walletLink && (
                              <a
                                href={req.walletLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition shrink-0"
                                title="مشاهده در کاوشگر بلاکچین"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Network Type */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 font-mono text-[11px] border border-blue-500/20 font-bold">
                          {req.networkType || 'USDT (TRC20)'}
                        </span>
                      </td>

                      {/* Persian Timestamp */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="font-bold text-[11px]">{req.submittedAtPersian}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {isPending && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                            <span>در انتظار بررسی (Pending)</span>
                          </div>
                        )}
                        {isApproved && (
                          <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>تایید شده (Approved)</span>
                            </div>
                            {req.reviewedAtPersian && (
                              <div className="text-[10px] text-slate-400">تایید در: {req.reviewedAtPersian}</div>
                            )}
                            {req.txHash && (
                              <div className="text-[10px] text-cyan-400 font-mono truncate max-w-[140px]" title={req.txHash}>
                                هش: {req.txHash}
                              </div>
                            )}
                          </div>
                        )}
                        {isRejected && (
                          <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 font-bold text-[11px]">
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                              <span>رد شده (Rejected)</span>
                            </div>
                            {req.rejectionReason && (
                              <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/20 text-[10px] text-rose-200 max-w-xs">
                                <span className="font-bold text-rose-300 block mb-0.5">دلیل رد درخواست:</span>
                                {req.rejectionReason}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* 3 Admin Action Buttons */}
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          
                          {/* Button 1: Approve */}
                          <button
                            onClick={() => {
                              setApprovingReq(req);
                              setTxHashInput('');
                            }}
                            disabled={isApproved}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition shadow-sm ${
                              isApproved 
                                ? 'bg-slate-800 text-slate-600 border border-white/5 cursor-not-allowed' 
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                            }`}
                            title="تایید درخواست و ثبت تسویه"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>تایید (Approve)</span>
                          </button>

                          {/* Button 2: Reject */}
                          <button
                            onClick={() => {
                              setRejectingReq(req);
                              setRejectionReasonInput(req.rejectionReason || '');
                            }}
                            disabled={isRejected}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition shadow-sm ${
                              isRejected 
                                ? 'bg-slate-800 text-slate-600 border border-white/5 cursor-not-allowed' 
                                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                            }`}
                            title="رد درخواست همراه با ثبت دلیل"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>رد (Reject)</span>
                          </button>

                          {/* Button 3: Reset to Pending */}
                          <button
                            onClick={() => handleResetToPending(req)}
                            disabled={isPending}
                            className={`px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition ${
                              isPending 
                                ? 'bg-slate-800 text-slate-600 border border-white/5 cursor-not-allowed' 
                                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
                            }`}
                            title="بازگرداندن وضعیت به حالت در انتظار"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>در انتظار</span>
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Reject Request with Reason */}
      {rejectingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-rose-500/30 shadow-2xl space-y-4 text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-rose-400 font-black text-base">
                <XCircle className="w-5 h-5" />
                <span>رد درخواست تسویه کاربر</span>
              </div>
              <button 
                onClick={() => setRejectingReq(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5 space-y-1 text-xs">
              <div className="text-slate-400">کاربر مقصد: <span className="text-white font-bold">{rejectingReq.userFullName}</span> (@{rejectingReq.username})</div>
              <div className="text-slate-400">آدرس ولت: <span className="text-emerald-400 font-mono text-[11px]">{rejectingReq.walletAddress}</span></div>
              <div className="text-slate-400">زمان ثبت: <span className="text-amber-300 font-bold">{rejectingReq.submittedAtPersian}</span></div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-rose-300 block">
                دلیل عدم تایید / رد درخواست (این پیام مستقیماً در پنل کاربر نمایش داده می‌شود):
              </label>
              <textarea
                rows={4}
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="مثال: آدرس ولت ارسالی با فرمت شبکه TRC20 همخوانی ندارد. لطفاً آدرس معتبر تتر شبکه ترون را ثبت فرمایید."
                className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectingReq(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                انصراف
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>ثبت رد درخواست و ارسال دلیل</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Approve Request Confirmation */}
      {approvingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl space-y-4 text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-base">
                <CheckCircle2 className="w-5 h-5" />
                <span>تایید نهایی درخواست تسویه و ولت</span>
              </div>
              <button 
                onClick={() => setApprovingReq(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5 space-y-1.5 text-xs">
              <div>کاربر: <span className="text-white font-bold">{approvingReq.userFullName}</span> (@{approvingReq.username})</div>
              <div>آدرس ولت: <span className="text-emerald-300 font-mono text-[11px] block break-all">{approvingReq.walletAddress}</span></div>
              <div>شبکه: <span className="text-cyan-300 font-mono font-bold">{approvingReq.networkType}</span></div>
              <div>زمان درخواست: <span className="text-amber-300 font-bold">{approvingReq.submittedAtPersian}</span></div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                شناسه تراکنش بلاکچین (TxHash / اختیاری):
              </label>
              <input
                type="text"
                value={txHashInput}
                onChange={(e) => setTxHashInput(e.target.value)}
                placeholder="مثلاً: 0x7c49b990f209... یا شناسه هش تراکنش ترون"
                className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setApprovingReq(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                انصراف
              </button>
              <button
                onClick={handleApproveConfirm}
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تایید پرداخت و ثبت نهایی</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

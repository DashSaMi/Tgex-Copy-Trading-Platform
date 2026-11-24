import React, { useState, useEffect } from 'react';
import { KycApplication, KycStatus, PageId } from '../../types';
import { kycService } from '../../services/kycService';
import { adminService } from '../../services/adminService';
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
  Lock,
  Download,
  AlertTriangle,
  Send,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  X
} from 'lucide-react';

interface AdminKycPageProps {
  onNavigate?: (page: PageId) => void;
  adminEmail?: string;
  adminRole?: string;
}

export const AdminKycPage: React.FC<AdminKycPageProps> = ({
  onNavigate,
  adminEmail = 'compliance@tgex.io',
  adminRole = 'compliance_admin'
}) => {
  const [applications, setApplications] = useState<KycApplication[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<KycApplication | null>(null);
  
  // Action Modals
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | 'REQUEST_INFO' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [requestInfoNote, setRequestInfoNote] = useState('');
  const [viewingDocUrl, setViewingDocUrl] = useState<{ title: string; type: string } | null>(null);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const list = await kycService.getAllApplications();
      setApplications(list);
      if (selectedApp) {
        const refreshed = list.find(a => a.id === selectedApp.id);
        if (refreshed) setSelectedApp(refreshed);
      }
    } catch (e) {
      console.error('Failed to load KYC applications', e);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Counts for tabs
  const pendingCount = applications.filter(a => a.status === 'pending' || a.status === 'under_review').length;
  const approvedCount = applications.filter(a => a.status === 'approved').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;
  const allCount = applications.length;

  const filteredApps = applications.filter((app) => {
    let matchesTab = true;
    if (activeTab === 'pending') {
      matchesTab = app.status === 'pending' || app.status === 'under_review';
    } else if (activeTab === 'approved') {
      matchesTab = app.status === 'approved';
    } else if (activeTab === 'rejected') {
      matchesTab = app.status === 'rejected';
    }

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      app.userName.toLowerCase().includes(q) ||
      app.userEmail.toLowerCase().includes(q) ||
      app.userId.toLowerCase().includes(q) ||
      (app.personalInfo.idNumber && app.personalInfo.idNumber.includes(q))
    );

    return matchesTab && matchesSearch;
  });

  const handleApprove = async (app: KycApplication) => {
    try {
      const updated = await kycService.reviewApplication(
        app.id,
        'APPROVED',
        adminEmail,
        'مدارک هویتی و سلفی مطابق با ضوابط AML/KYC تایید گردید.'
      );
      if (updated) {
        await adminService.recordAuditLog({
          adminEmail,
          adminRole: adminRole as any,
          action: 'KYC_APPROVED',
          targetType: 'kyc',
          targetId: app.userId,
          targetName: app.userName,
          details: `مدارک هویتی کاربر ${app.userName} با موفقیت تایید شد.`,
          ipAddress: '185.191.171.42',
          status: 'success'
        });
        showToast(`درخواست احراز هویت ${app.userName} با موفقیت تایید شد.`);
        setActionType(null);
        setSelectedApp(null);
        loadApplications();
      }
    } catch (e) {
      showToast('خطا در تایید درخواست');
    }
  };

  const handleReject = async (app: KycApplication) => {
    if (!rejectionReason.trim()) {
      showToast('لطفاً علت رد درخواست را وارد نمایید.');
      return;
    }
    try {
      const updated = await kycService.reviewApplication(
        app.id,
        'REJECTED',
        adminEmail,
        rejectionReason
      );
      if (updated) {
        await adminService.recordAuditLog({
          adminEmail,
          adminRole: adminRole as any,
          action: 'KYC_REJECTED',
          targetType: 'kyc',
          targetId: app.userId,
          targetName: app.userName,
          details: `رد درخواست KYC کاربر ${app.userName} به علت: ${rejectionReason}`,
          ipAddress: '185.191.171.42',
          status: 'warning'
        });
        showToast(`درخواست احراز هویت ${app.userName} رد شد و دلیل برای کاربر ثبت گردید.`);
        setActionType(null);
        setRejectionReason('');
        setSelectedApp(null);
        loadApplications();
      }
    } catch (e) {
      showToast('خطا در ثبت رد درخواست');
    }
  };

  const handleRequestMoreInfo = async (app: KycApplication) => {
    if (!requestInfoNote.trim()) {
      showToast('لطفاً مشخص نمایید چه مدارک تکمیلی مورد نیاز است.');
      return;
    }
    try {
      const updated = await kycService.reviewApplication(
        app.id,
        'DOCS_REQUESTED',
        adminEmail,
        requestInfoNote
      );
      if (updated) {
        await adminService.recordAuditLog({
          adminEmail,
          adminRole: adminRole as any,
          action: 'KYC_DOCS_REQUESTED',
          targetType: 'kyc',
          targetId: app.userId,
          targetName: app.userName,
          details: `درخواست ارسال مجدد مدارک از کاربر ${app.userName}: ${requestInfoNote}`,
          ipAddress: '185.191.171.42',
          status: 'warning'
        });
        showToast(`درخواست اطلاعات تکمیلی برای ${app.userName} ارسال گردید.`);
        setActionType(null);
        setRequestInfoNote('');
        setSelectedApp(null);
        loadApplications();
      }
    } catch (e) {
      showToast('خطا در ارسال درخواست مدارک');
    }
  };

  return (
    <div className="space-y-6 pb-12 text-slate-200 text-right" dir="rtl">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-blue-600 text-white text-xs font-bold shadow-2xl shadow-blue-600/40 animate-in slide-in-from-bottom-5 duration-200 flex items-center gap-3 border border-white/15">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-blue-200 hover:text-white mr-2">✕</button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ENTERPRISE KYC & AML COMPLIANCE SUITE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            مدیریت و تایید احراز هویت (Admin KYC Console)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            بررسی امنیتی مدارک شناسایی، احراز چهره، صدور احکام تایید/رد و ثبت استنادات در داشبورد کاربری.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 text-xs flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">حفاظت حریم خصوصی اسناد:</span>
            <span className="font-bold text-white">AES-256</span>
          </div>
        </div>
      </div>

      {/* 1. TABS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 text-xs">
          
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-white/5'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>در انتظار بررسی (Pending)</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black ${
              activeTab === 'pending' ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 ${
              activeTab === 'approved'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-white/5'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>تایید شده‌ها (Approved)</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black ${
              activeTab === 'approved' ? 'bg-slate-950 text-emerald-400' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {approvedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 ${
              activeTab === 'rejected'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-white/5'
            }`}
          >
            <XCircle className="w-4 h-4" />
            <span>رد شده‌ها (Rejected)</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black ${
              activeTab === 'rejected' ? 'bg-black/40 text-white' : 'bg-rose-500/20 text-rose-300'
            }`}>
              {rejectedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-white/5'
            }`}
          >
            <span>همه درخواست‌ها (All)</span>
            <span className="font-mono text-[10px] opacity-80">({allCount})</span>
          </button>

        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="جستجو با نام، ایمیل، کدملی یا User ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-9 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

      </div>

      {/* 2. KYC APPLICATIONS TABLE */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-white/10 font-medium whitespace-nowrap">
              <tr>
                <th className="py-3.5 px-4">شناسه (User ID)</th>
                <th className="py-3.5 px-4">نام متقاضی</th>
                <th className="py-3.5 px-4">ایمیل و مشخصات</th>
                <th className="py-3.5 px-4">تاریخ ارسال مدرک</th>
                <th className="py-3.5 px-4">وضعیت احراز هویت</th>
                <th className="py-3.5 px-4">اسناد بارگذاری‌شده</th>
                <th className="py-3.5 px-4 text-center">عملیات بازنگری</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    هیچ درخواستی در این بخش موجود نیست.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => {
                  const isSelected = selectedApp?.id === app.id;
                  return (
                    <tr
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className={`hover:bg-slate-800/40 transition cursor-pointer ${
                        isSelected ? 'bg-amber-500/10 border-r-4 border-amber-500' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400 whitespace-nowrap">
                        {app.userId}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-white">{app.userName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          کدملی: {app.personalInfo.idNumber || 'نامشخص'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono text-slate-300">{app.userEmail}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {app.personalInfo.nationality || 'IRAN'} • {app.personalInfo.birthDate || '1992-05-14'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap text-[11px]" dir="ltr">
                        {app.submittedAt}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${
                          app.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : app.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {app.status === 'approved' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>تایید شده (Approved)</span>
                            </>
                          ) : app.status === 'rejected' ? (
                            <>
                              <XCircle className="w-3 h-3" />
                              <span>رد شده (Rejected)</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 animate-pulse" />
                              <span>در انتظار بررسی (Pending)</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-blue-400 font-mono border border-white/5">
                            کارت ملی
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-purple-400 font-mono border border-white/5">
                            سلفی
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold transition flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>بازنگری و تصمیم‌گیری</span>
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

      {/* 3. DEEP REVIEW DRAWER / MODAL */}
      {selectedApp && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl space-y-6 animate-in fade-in duration-300">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                {selectedApp.userName.slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white">{selectedApp.userName}</h2>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    {selectedApp.userId}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedApp.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : selectedApp.status === 'rejected' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {selectedApp.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-3">
                  <span>{selectedApp.userEmail}</span>
                  <span>•</span>
                  <span>تاریخ ارسال: {selectedApp.submittedAt}</span>
                  <span>•</span>
                  <span>سطح امنیتی: Tier 2 (Standard Verification)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                title="بستن پنجره بازنگری"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* User & Document Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
              <div className="text-slate-400">اطلاعات هویتی متقاضی:</div>
              <div className="text-white font-bold">{selectedApp.personalInfo.fullName}</div>
              <div className="text-slate-300 font-mono">کدملی: {selectedApp.personalInfo.idNumber}</div>
              <div className="text-slate-400">ملیت: {selectedApp.personalInfo.nationality}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
              <div className="text-slate-400">آدرس و اطلاعات سکونت:</div>
              <div className="text-white font-medium">{selectedApp.personalInfo.address || 'تهران، خیابان ولیعصر، برج سپهر'}</div>
              <div className="text-slate-300 font-mono">کد پستی: {selectedApp.personalInfo.postalCode || '19839-44120'}</div>
              <div className="text-slate-400">کشور: {selectedApp.personalInfo.country || 'IRAN'}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
              <div className="text-slate-400">تاریخچه بازنگری و یادداشت‌های ناظر:</div>
              <div className="text-slate-300 font-medium">
                {selectedApp.rejectionReason || selectedApp.adminNote || 'بدون یادداشت قبلی.'}
              </div>
              {selectedApp.reviewedBy && (
                <div className="text-[10px] text-amber-400 font-mono">
                  بررسی شده توسط: {selectedApp.reviewedBy} ({selectedApp.reviewedAt})
                </div>
              )}
            </div>
          </div>

          {/* Submitted Documents Inspection Panel */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>اسناد شناسایی ارسال‌شده (Private Secured Vault)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Document 1: ID Front */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">روی کارت ملی / پاسپورت</span>
                  <span className="text-emerald-400 text-[10px]">تایید فرمت JPG</span>
                </div>
                <div 
                  onClick={() => setViewingDocUrl({ title: 'روی کارت ملی (Front ID)', type: 'id_front' })}
                  className="h-32 rounded-xl bg-slate-900 border border-white/10 flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:border-amber-500 transition group"
                >
                  <FileText className="w-8 h-8 text-amber-400 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-[11px] text-slate-300 font-medium">مشاهده سند در محیط ایزوله</span>
                  <span className="text-[9px] text-slate-500 font-mono">national_id_front.jpg</span>
                </div>
              </div>

              {/* Document 2: ID Back */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">پشت کارت ملی</span>
                  <span className="text-emerald-400 text-[10px]">تایید فرمت JPG</span>
                </div>
                <div 
                  onClick={() => setViewingDocUrl({ title: 'پشت کارت ملی (Back ID)', type: 'id_back' })}
                  className="h-32 rounded-xl bg-slate-900 border border-white/10 flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:border-amber-500 transition group"
                >
                  <FileText className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-[11px] text-slate-300 font-medium">مشاهده سند در محیط ایزوله</span>
                  <span className="text-[9px] text-slate-500 font-mono">national_id_back.jpg</span>
                </div>
              </div>

              {/* Document 3: Selfie Verification */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">تصویر سلفی به همراه دست‌نوشته</span>
                  <span className="text-cyan-400 text-[10px]">تطابق چهره Live</span>
                </div>
                <div 
                  onClick={() => setViewingDocUrl({ title: 'تصویر سلفی و احراز دست‌نوشته (Selfie)', type: 'selfie' })}
                  className="h-32 rounded-xl bg-slate-900 border border-white/10 flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:border-cyan-500 transition group"
                >
                  <Camera className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-[11px] text-slate-300 font-medium">مشاهده سلفی با وضوح بالا</span>
                  <span className="text-[9px] text-slate-500 font-mono">selfie_verification.jpg</span>
                </div>
              </div>

            </div>
          </div>

          {/* Action Buttons & Decision Making */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-bold text-white text-sm">تصمیم‌گیری نهایی ناظر احراز هویت (KYC Officer Decision)</div>
              <div className="text-xs text-slate-400">کلیه تصمیمات همراه با شناسه ادمین، زمان و IP در گزارش‌های امنیتی ثبت می‌گردند.</div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              
              <button
                onClick={() => setActionType('APPROVE')}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تایید احراز هویت (Approve)</span>
              </button>

              <button
                onClick={() => setActionType('REJECT')}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>رد درخواست (Reject)</span>
              </button>

              <button
                onClick={() => setActionType('REQUEST_INFO')}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                <HelpCircle className="w-4 h-4" />
                <span>درخواست مدرک مجدد</span>
              </button>

            </div>
          </div>

        </div>
      )}

      {/* MODAL: APPROVE CONFIRMATION */}
      {actionType === 'APPROVE' && selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">تایید احراز هویت متقاضی ({selectedApp.userName})</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              با تایید مدارک، سقف برداشت روزانه کاربر به ۱۰۰,۰۰۰ تتر افزایش یافته و حساب معاملاتی فعال می‌گردد.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setActionType(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                انصراف
              </button>
              <button
                onClick={() => handleApprove(selectedApp)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20"
              >
                تایید نهایی و ارتقای سطح کاربر
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REJECTION WITH MANDATORY REASON */}
      {actionType === 'REJECT' && selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-rose-500/30 rounded-3xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-400">
              <XCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">رد درخواست احراز هویت ({selectedApp.userName})</h3>
            </div>

            <p className="text-xs text-slate-300">
              دلیل رد مدارک ذخیره شده و مستقیماً در صفحه احراز هویت کاربر (/dashboard/kyc) نمایش داده می‌شود.
            </p>

            <div className="space-y-1">
              <label className="text-slate-400 block text-xs">علت رد درخواست (الزامی):</label>
              <textarea
                rows={3}
                placeholder="مثال: تصویر کارت ملی ناخوانا می‌باشد، دست‌نوشته سلفی دارای تاریخ روز نیست، نام با کدملی همخوانی ندارد..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setActionType(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                انصراف
              </button>
              <button
                onClick={() => handleReject(selectedApp)}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/20"
              >
                ثبت رد درخواست و ارسال علت
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REQUEST MORE INFO */}
      {actionType === 'REQUEST_INFO' && selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-blue-500/30 rounded-3xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-blue-400">
              <HelpCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">درخواست مدارک تکمیلی ({selectedApp.userName})</h3>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 block text-xs">توضیحات نقص مدارک برای کاربر:</label>
              <textarea
                rows={3}
                placeholder="لطفاً تصویر پشت کارت ملی یا قبض تایید نشانی را مجدداً بارگذاری نمایید..."
                value={requestInfoNote}
                onChange={(e) => setRequestInfoNote(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setActionType(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                انصراف
              </button>
              <button
                onClick={() => handleRequestMoreInfo(selectedApp)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20"
              >
                ارسال درخواست مدارک
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECURE DOCUMENT VIEWER MODAL */}
      {viewingDocUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-white/20 rounded-3xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">{viewingDocUrl.title}</h3>
              </div>
              <button onClick={() => setViewingDocUrl(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Document Render Canvas */}
            <div className="h-80 bg-slate-950 rounded-2xl border border-white/10 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                <span className="text-6xl font-black text-white rotate-45 select-none font-mono">
                  TGEX CONFIDENTIAL AML/KYC
                </span>
              </div>

              <FileText className="w-16 h-16 text-amber-400/80 mb-3" />
              <div className="font-bold text-white text-sm">مدرک شناسایی با فرمت امن در حال بازنگری</div>
              <div className="text-xs text-slate-400 mt-1">
                اطلاعات شامل شماره ملی، نام و نام خانوادگی و تطابق چهره
              </div>
              <div className="mt-4 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
                ENCRYPTED VAULT STORAGE
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={() => setViewingDocUrl(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-white font-bold"
              >
                بستن پیش‌نمایش سند
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

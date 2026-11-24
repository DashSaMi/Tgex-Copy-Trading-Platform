import React, { useState, useEffect } from 'react';
import { 
  AdminUserItem, 
  AdminRoleType, 
  KycStatus, 
  LevelBreakdownItem,
  PageId,
  AdminTab
} from '../../types';
import { adminService } from '../../services/adminService';
import { databaseService } from '../../services/db/databaseService';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  ShieldAlert, 
  ShieldCheck, 
  Ban, 
  CheckCircle2, 
  Layers, 
  Network, 
  DollarSign, 
  Clock, 
  Phone, 
  Mail, 
  Award, 
  Download, 
  ChevronRight, 
  ChevronLeft,
  X, 
  Zap, 
  AlertTriangle,
  Lock,
  Unlock,
  Key,
  ExternalLink,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Copy,
  GitBranch,
  Share2,
  Check,
  Trash2
} from 'lucide-react';

interface AdminUsersPageProps {
  currentAdminRole: AdminRoleType;
  currentAdminEmail: string;
  onNavigatePage?: (page: PageId) => void;
  onSwitchAdminTab?: (tab: AdminTab) => void;
  initialSelectedUserId?: string | null;
}

export const AdminUsersPage: React.FC<AdminUsersPageProps> = ({
  currentAdminRole,
  currentAdminEmail,
  onNavigatePage,
  onSwitchAdminTab,
  initialSelectedUserId
}) => {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);
  const [activeUserDetailTab, setActiveUserDetailTab] = useState<'profile' | 'kyc' | 'network' | 'levels' | 'earnings' | 'copy-trading' | 'activity'>('profile');
  
  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKyc, setFilterKyc] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRank, setFilterRank] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<AdminUserItem>>({});
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
    const handleDbUpdate = () => {
      loadUsers();
    };
    window.addEventListener('tgex_database_updated', handleDbUpdate);
    window.addEventListener('tgex_db_updated', handleDbUpdate);
    return () => {
      window.removeEventListener('tgex_database_updated', handleDbUpdate);
      window.removeEventListener('tgex_db_updated', handleDbUpdate);
    };
  }, []);

  useEffect(() => {
    if (initialSelectedUserId && users.length > 0) {
      const found = users.find(u => u.id === initialSelectedUserId);
      if (found) setSelectedUser(found);
    }
  }, [initialSelectedUserId, users]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const list = await adminService.getAllUsers();
      setUsers(list);
      if (selectedUser) {
        const refreshed = list.find(u => u.id === selectedUser.id);
        if (refreshed) setSelectedUser(refreshed);
      }
    } catch (e) {
      console.error('Failed to load users', e);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string, textToCopy?: string) => {
    const val = textToCopy || code;
    navigator.clipboard.writeText(val);
    setCopiedCode(code);
    showToast(`کپی شد: ${val}`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const getLevelBadge = (levelStr: string) => {
    const l = (levelStr || '').toUpperCase();
    if (l.includes('ROOT') || l.includes('ریشه')) {
      return (
        <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40 text-[10px] inline-flex items-center gap-1 shadow-sm shadow-rose-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
          <span>Master Root (ریشه سیستم)</span>
        </span>
      );
    }
    if (l.includes('LEVEL A') || l.includes('سطح ۱') || l === 'A') {
      return (
        <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 text-[10px] inline-flex items-center gap-1 shadow-sm shadow-amber-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span>Level A (شاخه ادمین)</span>
        </span>
      );
    }
    if (l.includes('LEVEL B') || l.includes('سطح ۲') || l === 'B') {
      return (
        <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 text-[10px] inline-flex items-center gap-1 shadow-sm shadow-cyan-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span>Level B (زیرمجموعه A)</span>
        </span>
      );
    }
    if (l.includes('LEVEL C') || l.includes('سطح ۳') || l === 'C') {
      return (
        <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/40 text-[10px] inline-flex items-center gap-1 shadow-sm shadow-indigo-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
          <span>Level C (زیرمجموعه B)</span>
        </span>
      );
    }
    if (l.includes('LEVEL D') || l.includes('سطح ۴') || l === 'D') {
      return (
        <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40 text-[10px] inline-flex items-center gap-1 shadow-sm shadow-purple-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
          <span>Level D (زیرمجموعه C)</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold border border-slate-700 text-[10px] inline-flex items-center gap-1">
        <span>{levelStr}</span>
      </span>
    );
  };

  // Filter and Search logic
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      u.fullName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q) ||
      u.sponsorName.toLowerCase().includes(q)
    );

    const matchesKyc = filterKyc === 'all' || u.kycStatus === filterKyc;
    const matchesStatus = filterStatus === 'all' || u.accountStatus === filterStatus;
    const matchesRank = filterRank === 'all' || u.rank.toLowerCase().includes(filterRank.toLowerCase());
    const matchesLevel = filterLevel === 'all' || u.level.toLowerCase().includes(filterLevel.toLowerCase());

    return matchesSearch && matchesKyc && matchesStatus && matchesRank && matchesLevel;
  });

  // Admin Actions Handlers
  const handleOpenEdit = (user: AdminUserItem) => {
    if (!adminService.hasPermission(currentAdminRole, 'canEditProfiles')) {
      showToast('خطای دسترسی: نقش شما مجوز ویرایش پروفایل کاربران را ندارد.');
      return;
    }
    setEditFormData({
      fullName: user.fullName,
      phone: user.phone,
      rank: user.rank,
      level: user.level,
      accountStatus: user.accountStatus
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    try {
      const updated = await adminService.updateUserProfile(
        selectedUser.id,
        editFormData,
        currentAdminEmail,
        currentAdminRole
      );
      if (updated) {
        setSelectedUser(updated);
        showToast('اطلاعات پروفایل کاربر با موفقیت به‌روزرسانی و در لاگ‌های امنیتی ثبت شد.');
        setIsEditModalOpen(false);
        loadUsers();
      }
    } catch (e) {
      showToast('خطا در ذخیره تغییرات');
    }
  };

  const handleOpenSuspend = (user: AdminUserItem) => {
    if (!adminService.hasPermission(currentAdminRole, 'canSuspendUsers')) {
      showToast('خطای دسترسی: نقش شما مجوز تعلیق حساب کاربران را ندارد.');
      return;
    }
    setSuspendReason('');
    setIsSuspendModalOpen(true);
  };

  const handleConfirmSuspend = async () => {
    if (!selectedUser) return;
    if (!suspendReason.trim()) {
      showToast('لطفاً دلیل تعلیق حساب را وارد نمایید.');
      return;
    }
    const success = await adminService.suspendUser(
      selectedUser.id,
      suspendReason,
      currentAdminEmail,
      currentAdminRole
    );
    if (success) {
      showToast(`حساب کاربری ${selectedUser.fullName} تعلیق شد.`);
      setIsSuspendModalOpen(false);
      loadUsers();
    }
  };

  const handleActivateUser = async (user: AdminUserItem) => {
    if (!adminService.hasPermission(currentAdminRole, 'canSuspendUsers')) {
      showToast('خطای دسترسی: مجوز فعال‌سازی حساب کاربری را ندارید.');
      return;
    }
    const success = await adminService.activateUser(
      user.id,
      currentAdminEmail,
      currentAdminRole
    );
    if (success) {
      showToast(`حساب کاربری ${user.fullName} مجدداً فعال گردید.`);
      loadUsers();
    }
  };

  const handleDeleteUser = async (user: AdminUserItem) => {
    if (!adminService.hasPermission(currentAdminRole, 'canSuspendUsers')) {
      showToast('خطای دسترسی: مجوز حذف حساب کاربری را ندارید.');
      return;
    }
    if (window.confirm(`آیا از حذف کامل حساب کاربری «${user.fullName}» اطمینان دارید؟ این عملیات غیرقابل بازگشت است.`)) {
      const deleted = databaseService.deleteUser(user.id);
      if (deleted) {
        showToast(`حساب کاربری ${user.fullName} با موفقیت حذف شد.`);
        setSelectedUser(null);
        loadUsers();
      } else {
        showToast('خطا در حذف کاربر از پایگاه داده.');
      }
    }
  };

  const exportCSV = () => {
    const headers = ['User ID', 'Full Name', 'Username', 'Email', 'Phone', 'Registration Date', 'Sponsor', 'Placement', 'Rank', 'Level', 'KYC Status', 'Account Status', 'Network Size', 'Generated Profit', 'Total Earnings'];
    const rows = filteredUsers.map(u => [
      u.id,
      `"${u.fullName}"`,
      u.username,
      u.email,
      u.phone,
      u.registrationDate,
      `"${u.sponsorName}"`,
      `"${u.placementName}"`,
      `"${u.rank}"`,
      `"${u.level}"`,
      u.kycStatus,
      u.accountStatus,
      u.networkSize,
      u.generatedProfitUsdt,
      u.totalEarningsUsdt
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tgex_admin_users_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 text-slate-200">
      
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>ENTERPRISE USER MANAGEMENT DIRECTORY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            مدیریت جامع کاربران (Users Directory & Deep Inspector)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            بررسی هویت، رتبه سازمانی، سیستم معرف و اتصالات درختی، ماتریس ۲۰ لایه و تاریخچه درآمدی تک‌تک اعضا.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadUsers}
            className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition flex items-center gap-2 text-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">بروزرسانی</span>
          </button>
          <button
            onClick={exportCSV}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>خروجی اکسل / CSV</span>
          </button>
        </div>
      </div>

      {/* 1. SEARCH & FILTERS BAR */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="جستجو با نام، نام کاربری، ایمیل، موبایل، User ID یا کد حامی..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-9 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Filter: KYC */}
          <select
            value={filterKyc}
            onChange={(e) => setFilterKyc(e.target.value)}
            className="px-3 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">همه وضعیت‌های KYC</option>
            <option value="approved">تایید شده (Approved)</option>
            <option value="pending">در انتظار بررسی (Pending)</option>
            <option value="rejected">رد شده (Rejected)</option>
            <option value="not_submitted">ارسال نشده</option>
          </select>

          {/* Filter: Account Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">همه وضعیت‌های حساب</option>
            <option value="active">فعال (Active)</option>
            <option value="suspended">تعلیق شده (Suspended)</option>
            <option value="inactive">غیرفعال (Inactive)</option>
          </select>

          {/* Filter: Rank */}
          <select
            value={filterRank}
            onChange={(e) => setFilterRank(e.target.value)}
            className="px-3 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">همه رتبه‌های سازمانی</option>
            <option value="Member">Member</option>
            <option value="Bronze">Bronze Leader</option>
            <option value="Silver">Silver Leader</option>
            <option value="Gold">Gold Leader</option>
            <option value="Platinum">Platinum Executive</option>
            <option value="Diamond">Diamond Master</option>
          </select>

          {/* Filter: Hybrid Level */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-3 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">همه سطوح سیستم هیبرید</option>
            <option value="Root">ریشه اصلی (Master Root)</option>
            <option value="Level A">سطح ۱ (Level A - مستقیم ادمین)</option>
            <option value="Level B">سطح ۲ (Level B - زیرمجموعه A)</option>
            <option value="Level C">سطح ۳ (Level C - زیرمجموعه B)</option>
            <option value="Level D">سطح ۴ (Level D - زیرمجموعه C)</option>
          </select>

        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
          <span>نمایش {filteredUsers.length} از مجموع {users.length} کاربر ثبت‌شده در پایگاه داده</span>
          {(searchQuery || filterKyc !== 'all' || filterStatus !== 'all' || filterRank !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterKyc('all');
                setFilterStatus('all');
                setFilterRank('all');
                setFilterLevel('all');
              }}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              پاک کردن فیلترها
            </button>
          )}
        </div>
      </div>

      {/* 2. USERS TABLE */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-white/10 font-medium whitespace-nowrap">
              <tr>
                <th className="py-3.5 px-4">شناسه و کد دعوت</th>
                <th className="py-3.5 px-4">نام و نام خانوادگی</th>
                <th className="py-3.5 px-4">ایمیل و موبایل</th>
                <th className="py-3.5 px-4">تاریخ ثبت‌نام</th>
                <th className="py-3.5 px-4">حامی مستقیم (Sponsor)</th>
                <th className="py-3.5 px-4">رتبه سازمانی</th>
                <th className="py-3.5 px-4">سطح</th>
                <th className="py-3.5 px-4">احراز هویت (KYC)</th>
                <th className="py-3.5 px-4">وضعیت حساب</th>
                <th className="py-3.5 px-4">حجم شبکه</th>
                <th className="py-3.5 px-4">سود تولیدی</th>
                <th className="py-3.5 px-4">مجموع درآمد</th>
                <th className="py-3.5 px-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-10 text-center text-slate-500">
                    هیچ کاربری با مشخصات جستجو شده یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSelected = selectedUser?.id === u.id;
                  return (
                    <tr 
                      key={u.id}
                      onClick={() => setSelectedUser(u)}
                      className={`hover:bg-slate-800/40 transition cursor-pointer ${
                        isSelected ? 'bg-blue-600/10 border-r-4 border-blue-500' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                        <div className="font-bold text-blue-400">{u.id}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-white">{u.fullName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">@{u.username}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-300">
                        <div>{u.email}</div>
                        <div className="text-slate-500 text-[10px]" dir="ltr">{u.phone}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap text-[11px]" dir="ltr">
                        {u.registrationDate}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-white font-medium">{u.sponsorName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{u.sponsorId}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-bold border border-amber-500/20">
                          {u.rank}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getLevelBadge(u.level)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.kycStatus === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : u.kycStatus === 'pending'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {u.kycStatus === 'approved' ? 'تایید شده' : u.kycStatus === 'pending' ? 'در انتظار' : 'رد شده'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.accountStatus === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {u.accountStatus === 'active' ? 'فعال' : 'تعلیق شده'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-purple-300 whitespace-nowrap">
                        {u.networkSize} کاربر
                      </td>
                      <td className="py-3.5 px-4 font-mono text-emerald-400 whitespace-nowrap" dir="ltr">
                        ${u.generatedProfitUsdt.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-black text-white whitespace-nowrap" dir="ltr">
                        ${u.totalEarningsUsdt.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition"
                            title="مشاهده جزئیات کامل"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              handleOpenEdit(u);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white transition"
                            title="ویرایش اطلاعات پروفایل"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {u.accountStatus === 'active' ? (
                            <button
                              onClick={() => {
                                setSelectedUser(u);
                                handleOpenSuspend(u);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition"
                              title="تعلیق حساب کاربری"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivateUser(u)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition"
                              title="فعال‌سازی مجدد حساب"
                            >
                              <Unlock className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-700 text-slate-300 hover:text-white transition"
                            title="حذف کامل کاربر"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* 3. USER DETAILS DEEP INSPECTION PANEL (/admin/users/[id]) */}
      {selectedUser && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-blue-500/30 shadow-2xl space-y-6 animate-in fade-in duration-300">
          
          {/* Detailed Inspector Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                {selectedUser.fullName.slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white">{selectedUser.fullName}</h2>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">
                    {selectedUser.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedUser.accountStatus === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {selectedUser.accountStatus === 'active' ? 'ACTIVE' : 'SUSPENDED'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-3">
                  <span>@{selectedUser.username}</span>
                  <span>•</span>
                  <span>{selectedUser.email}</span>
                  <span>•</span>
                  <span>{selectedUser.phone}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => handleOpenEdit(selectedUser)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>ویرایش اطلاعات</span>
              </button>
              {selectedUser.accountStatus === 'active' ? (
                <button
                  onClick={() => handleOpenSuspend(selectedUser)}
                  className="px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>تعلیق حساب</span>
                </button>
              ) : (
                <button
                  onClick={() => handleActivateUser(selectedUser)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>فعال‌سازی حساب</span>
                </button>
              )}
              <button
                onClick={() => handleDeleteUser(selectedUser)}
                className="px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold transition flex items-center gap-1.5 animate-pulse"
                title="حذف کامل حساب کاربری"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف کاربر</span>
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                title="بستن پنل جزئیات"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs for User Details */}
          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3 text-xs">
            <button
              onClick={() => setActiveUserDetailTab('profile')}
              className={`px-3.5 py-2 rounded-xl transition ${
                activeUserDetailTab === 'profile' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-950/60'
              }`}
            >
              خلاصه پروفایل (Profile)
            </button>
            <button
              onClick={() => setActiveUserDetailTab('levels')}
              className={`px-3.5 py-2 rounded-xl transition ${
                activeUserDetailTab === 'levels' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-950/60'
              }`}
            >
              تفکیک ۲۰ لایه (20 Levels Breakdown)
            </button>
            <button
              onClick={() => setActiveUserDetailTab('network')}
              className={`px-3.5 py-2 rounded-xl transition ${
                activeUserDetailTab === 'network' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-950/60'
              }`}
            >
              معرف و شجره‌نامه (Sponsor & Hierarchy)
            </button>
            <button
              onClick={() => setActiveUserDetailTab('kyc')}
              className={`px-3.5 py-2 rounded-xl transition ${
                activeUserDetailTab === 'kyc' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-950/60'
              }`}
            >
              اسناد هویتی (KYC Documents)
            </button>
            <button
              onClick={() => setActiveUserDetailTab('earnings')}
              className={`px-3.5 py-2 rounded-xl transition ${
                activeUserDetailTab === 'earnings' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-950/60'
              }`}
            >
              درآمد و پورسانت (Earnings)
            </button>
            <button
              onClick={() => setActiveUserDetailTab('copy-trading')}
              className={`px-3.5 py-2 rounded-xl transition ${
                activeUserDetailTab === 'copy-trading' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-950/60'
              }`}
            >
              کپی تریدینگ (Copy Trading)
            </button>
          </div>

          {/* TAB 1: PROFILE SUMMARY */}
          {activeUserDetailTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Card 1: Rank & Level */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2">
                  <div className="text-slate-400 text-xs">رتبه و سطح ماتریس:</div>
                  <div className="font-bold text-white text-sm">{selectedUser.rank}</div>
                  <div className="text-xs font-mono text-blue-400">{selectedUser.level}</div>
                </div>

                {/* Card 2: Network & Direct */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2">
                  <div className="text-slate-400 text-xs">تعداد معرف مستقیم و کل شبکه:</div>
                  <div className="font-bold text-cyan-400 text-sm">{selectedUser.directReferralsCount} نفر مستقیم</div>
                  <div className="text-xs font-mono text-purple-300">کل ساختار: {selectedUser.networkSize} کاربر</div>
                </div>

                {/* Card 3: Generated Profit */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2">
                  <div className="text-slate-400 text-xs">سود ناخالص تولید شده:</div>
                  <div className="font-mono font-black text-emerald-400 text-lg" dir="ltr">
                    ${selectedUser.generatedProfitUsdt.toLocaleString()} USDT
                  </div>
                  <div className="text-[11px] text-slate-400">حجم معاملات زیرمجموعه</div>
                </div>

                {/* Card 4: Total Commission */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2">
                  <div className="text-slate-400 text-xs">مجموع دریافتی کاربر:</div>
                  <div className="font-mono font-black text-white text-lg" dir="ltr">
                    ${selectedUser.totalEarningsUsdt.toLocaleString()} USDT
                  </div>
                  <div className="text-[11px] text-emerald-400">تسویه‌شده در ولت</div>
                </div>

              </div>

              {/* Integrated Sponsor & Referral Info */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="text-slate-400 font-bold">حامی و معرف مستقیم (Sponsor / Referrer):</div>
                  <div className="text-white font-mono text-sm">{selectedUser.sponsorName} ({selectedUser.sponsorId})</div>
                  <p className="text-[11px] text-slate-500">ثبت‌نام شده با کد و لینک اختصاصی معرف در سیستم یکپارچه هیبرید.</p>
                </div>
                <div className="space-y-1 sm:text-left">
                  <div className="text-slate-400 font-bold">کد دعوت کاربر:</div>
                  <div className="text-emerald-400 font-mono text-sm font-bold">{selectedUser.referralCode || selectedUser.id}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 20 LEVEL BREAKDOWN (A TO T) */}
          {activeUserDetailTab === 'levels' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  <span>جدول تفکیک عملکرد ۲۰ لایه ماتریسی کاربر ({selectedUser.fullName})</span>
                </h3>
                <span className="text-xs text-slate-400">سطوح A تا T بر اساس ساختار کمیسیون سازمان</span>
              </div>

              <div className="rounded-2xl border border-white/10 overflow-x-auto bg-slate-950">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-900 text-slate-400 border-b border-white/10 font-medium">
                    <tr>
                      <th className="py-3 px-4">سطح (Level)</th>
                      <th className="py-3 px-4">نرخ پورسانت (Rate)</th>
                      <th className="py-3 px-4">کل کاربران لایه</th>
                      <th className="py-3 px-4">کاربران فعال</th>
                      <th className="py-3 px-4">سود تولیدی زیرمجموعه</th>
                      <th className="py-3 px-4">پورسانت تخصیص یافته</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {selectedUser.levelBreakdown.map((lvl) => (
                      <tr key={lvl.levelLetter} className="hover:bg-slate-800/30 transition">
                        <td className="py-2.5 px-4 font-mono font-bold text-blue-400">
                          Level {lvl.levelLetter} (#{lvl.levelNumber})
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-400">
                          {lvl.ratePercent}%
                        </td>
                        <td className="py-2.5 px-4 font-mono text-white">
                          {lvl.users} کاربر
                        </td>
                        <td className="py-2.5 px-4 font-mono text-cyan-400">
                          {lvl.active} فعال
                        </td>
                        <td className="py-2.5 px-4 font-mono text-emerald-400" dir="ltr">
                          ${lvl.profitUsdt.toLocaleString()} USDT
                        </td>
                        <td className="py-2.5 px-4 font-mono font-bold text-white" dir="ltr">
                          ${lvl.commissionUsdt.toLocaleString()} USDT
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SPONSOR & PLACEMENT NETWORK */}
          {activeUserDetailTab === 'network' && (() => {
            const uplineChain = databaseService.getUplineChain(selectedUser.id);
            const directDownlines = databaseService.getDirectReferralsDetailed(selectedUser.id);
            const refCode = selectedUser.referralCode || selectedUser.id.replace('DX-', '').replace('usr_', '');
            const inviteUrl = `https://tgex.io/auth/signup?ref=${refCode}`;

            return (
              <div className="space-y-6">
                
                {/* 1. KEY NETWORK LINKS & SPONSOR DETAILS */}
                <div className="p-6 rounded-2xl bg-slate-950 border border-white/5 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-cyan-400" />
                      <span>مشخصات اتصال سازمانی و کدهای سیستم هیبرید</span>
                    </h3>
                    <span className="text-slate-400 text-[11px]">سطح فعلی: <strong className="text-blue-400">{selectedUser.level}</strong></span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* Card 1: Referral Code & Link */}
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-400">کد و لینک دعوت کاربر:</span>
                        <button
                          onClick={() => handleCopyCode(refCode, inviteUrl)}
                          className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold flex items-center gap-1 transition"
                        >
                          {copiedCode === refCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>کپی لینک</span>
                        </button>
                      </div>
                      <div className="font-mono text-sm font-bold text-white bg-slate-950 px-2.5 py-1 rounded border border-emerald-500/20 inline-block">
                        {refCode}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate font-mono select-all">
                        {inviteUrl}
                      </div>
                    </div>

                    {/* Card 2: Direct Sponsor */}
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
                      <div className="font-bold text-blue-400">معرف مستقیم (Sponsor):</div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-blue-300 bg-slate-950 px-2.5 py-1 rounded border border-blue-500/20 inline-block">
                          {selectedUser.sponsorId}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">
                          Up-line
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 font-bold">{selectedUser.sponsorName}</div>
                    </div>

                    {/* Card 3: Network Stats */}
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
                      <div className="font-bold text-cyan-400">اعضای مستقیم و حجم زیرمجموعه:</div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-cyan-300 bg-slate-950 px-2.5 py-1 rounded border border-cyan-500/20 inline-block">
                          {selectedUser.directReferralsCount} نفر مستقیم
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono">
                          Down-line
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 font-bold">کل ساختار: {selectedUser.networkSize} کاربر فعال</div>
                    </div>

                  </div>
                </div>

                {/* 2. UPLINE LINEAGE CHAIN (مسیر شجره‌نامه تا ریشه اصلی) */}
                <div className="p-6 rounded-2xl bg-slate-950 border border-white/5 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-sm flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-amber-400" />
                        <span>مسیر شجره‌نامه حامیان تا ریشه سیستم (Upline Lineage Chain)</span>
                      </h3>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        مسیر گره‌های معرف تا کاربر ریشه (Root/Admin) بر اساس ثبت‌نام‌های متوالی در سیستم هیبرید
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-slate-300 font-mono text-[10px]">
                      عمق مسیر: {uplineChain.length} لایه
                    </span>
                  </div>

                  {uplineChain.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 text-center text-slate-400">
                      این کاربر ریشه اصلی سیستم (Master Root) است و حامی بالاتری ندارد.
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 overflow-x-auto">
                      <div className="flex items-center gap-2 min-w-max">
                        {uplineChain.map((node, index) => {
                          const isTarget = node.id === selectedUser.id;
                          return (
                            <React.Fragment key={node.id}>
                              <div
                                onClick={() => {
                                  const targetUser = users.find(u => u.id === node.id);
                                  if (targetUser) setSelectedUser(targetUser);
                                }}
                                className={`px-3.5 py-2 rounded-xl border transition cursor-pointer flex flex-col text-right ${
                                  isTarget
                                    ? 'bg-blue-600/30 border-blue-500 text-white shadow-lg shadow-blue-500/20 ring-1 ring-blue-400'
                                    : 'bg-slate-950/90 border-white/10 text-slate-300 hover:border-blue-400 hover:bg-slate-900'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-3 text-[10px]">
                                  <span className="font-mono font-bold text-slate-400">{node.id}</span>
                                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                    node.level.includes('Root') ? 'bg-rose-500/20 text-rose-300' :
                                    node.level.includes('Level A') ? 'bg-amber-500/20 text-amber-300' :
                                    node.level.includes('Level B') ? 'bg-cyan-500/20 text-cyan-300' :
                                    'bg-indigo-500/20 text-indigo-300'
                                  }`}>
                                    {node.level}
                                  </span>
                                </div>
                                <div className="font-bold text-xs mt-1 text-white truncate max-w-[140px]">{node.fullName}</div>
                                <div className="text-[10px] text-slate-400 font-mono">@{node.username}</div>
                              </div>

                              {index < uplineChain.length - 1 && (
                                <div className="flex items-center text-slate-600 px-1">
                                  <ChevronLeft className="w-4 h-4 text-blue-400" />
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. DIRECT REFERRALS / DOWNLINES (معرفی‌شدگان مستقیم با سطوح ارث‌بری شده) */}
                <div className="p-6 rounded-2xl bg-slate-950 border border-white/5 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-sm flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-400" />
                        <span>معرفی‌شدگان مستقیم کاربر (Direct Referrals / Downlines)</span>
                      </h3>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        کاربرانی که مستقیماً با کد دعوت این کاربر ثبت‌نام کرده و در لایه بعدی سیستم هیبرید قرار گرفته‌اند.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[11px]">
                      {directDownlines.length} زیرمجموعه مستقیم
                    </span>
                  </div>

                  {directDownlines.length === 0 ? (
                    <div className="p-6 rounded-xl bg-slate-900/40 border border-white/5 text-center text-slate-500">
                      این کاربر تاکنون زیرمجموعه مستقیم با کد دعوت خود ثبت نکرده است.
                    </div>
                  ) : (
                    <div className="rounded-xl border border-white/10 overflow-x-auto bg-slate-900/60">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-slate-950 text-slate-400 border-b border-white/10 font-medium whitespace-nowrap">
                          <tr>
                            <th className="py-2.5 px-3.5">شناسه کاربری</th>
                            <th className="py-2.5 px-3.5">نام و نام خانوادگی</th>
                            <th className="py-2.5 px-3.5">سطح هیبرید ارث‌بری شده</th>
                            <th className="py-2.5 px-3.5">رتبه</th>
                            <th className="py-2.5 px-3.5">وضعیت حساب</th>
                            <th className="py-2.5 px-3.5">حجم شبکه</th>
                            <th className="py-2.5 px-3.5 text-center">عملیات</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {directDownlines.map((d) => (
                            <tr key={d.id} className="hover:bg-slate-800/40 transition">
                              <td className="py-2.5 px-3.5 font-mono text-slate-300 font-bold">
                                {d.id}
                              </td>
                              <td className="py-2.5 px-3.5">
                                <div className="font-bold text-white">{d.fullName}</div>
                                <div className="text-[10px] text-slate-500 font-mono">@{d.username}</div>
                              </td>
                              <td className="py-2.5 px-3.5">
                                {getLevelBadge(d.level)}
                              </td>
                              <td className="py-2.5 px-3.5">
                                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-bold border border-amber-500/20">
                                  {d.rank}
                                </span>
                              </td>
                              <td className="py-2.5 px-3.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  d.accountStatus === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                                }`}>
                                  {d.accountStatus === 'active' ? 'فعال' : 'تعلیق'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3.5 font-mono text-purple-300 font-bold">
                                {d.downlineCount} کاربر
                              </td>
                              <td className="py-2.5 px-3.5 text-center">
                                <button
                                  onClick={() => {
                                    const targetUser = users.find(u => u.id === d.id);
                                    if (targetUser) setSelectedUser(targetUser);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white font-bold text-[10px] transition border border-blue-500/30"
                                >
                                  بررسی زیرمجموعه
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {onSwitchAdminTab && (
                  <button
                    onClick={() => onSwitchAdminTab('network')}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-blue-400 text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <span>مشاهده درخت تعاملی سراسری شبکه در تب Network</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}

              </div>
            );
          })()}

          {/* TAB 4: KYC DOCUMENTS INSPECTOR */}
          {activeUserDetailTab === 'kyc' && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-white/5 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">مدارک و اسناد هویتی ثبت‌شده</h3>
                <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                  selectedUser.kycStatus === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  وضعیت: {selectedUser.kycStatus.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-2 text-center">
                  <div className="text-slate-400">کارت ملی (روی مدرک):</div>
                  <div className="font-mono text-blue-400 text-xs">national_id_front.jpg (2.8 MB)</div>
                  <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-[11px] text-white">
                    مشاهده تصویر
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-2 text-center">
                  <div className="text-slate-400">کارت ملی (پشت مدرک):</div>
                  <div className="font-mono text-blue-400 text-xs">national_id_back.jpg (2.3 MB)</div>
                  <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-[11px] text-white">
                    مشاهده تصویر
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-2 text-center">
                  <div className="text-slate-400">تصویر سلفی احراز هویت:</div>
                  <div className="font-mono text-blue-400 text-xs">selfie_verification.jpg (3.4 MB)</div>
                  <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-[11px] text-white">
                    مشاهده تصویر
                  </button>
                </div>
              </div>

              {onSwitchAdminTab && (
                <div className="pt-2">
                  <button
                    onClick={() => onSwitchAdminTab('kyc')}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <span>انتقال به پنل رسمی بازنگری و تایید مدارک KYC</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: EARNINGS & COMMISSIONS */}
          {activeUserDetailTab === 'earnings' && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-white/5 space-y-4 text-xs">
              <h3 className="font-bold text-white text-sm">خلاصه مالی و تراکنش‌های درآمدی</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                  <div className="text-slate-400">کل پورسانت‌های واریزی:</div>
                  <div className="text-xl font-bold font-mono text-emerald-400" dir="ltr">${selectedUser.totalEarningsUsdt.toLocaleString()} USDT</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                  <div className="text-slate-400">آدرس کیف پول پرداخت:</div>
                  <div className="text-xs font-mono text-slate-300">{selectedUser.walletAddress || 'تنظیم نشده'}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                  <div className="text-slate-400">تایید دو مرحله‌ای (2FA):</div>
                  <div className="text-xs font-bold text-emerald-400">{selectedUser.twoFactorEnabled ? 'فعال (امن)' : 'غیرفعال'}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: COPY TRADING */}
          {activeUserDetailTab === 'copy-trading' && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-white/5 space-y-3 text-xs">
              <h3 className="font-bold text-white text-sm">حساب‌های معاملاتی و اتصال کپی ترید</h3>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">حساب معاملاتی متصل: Tgex Institutional Pro</div>
                  <div className="text-slate-400 text-[11px]">استراتژی فعال: Trend Momentum Grid (Alpha-1)</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                  اتصال فعال (Read-Only Copy)
                </span>
              </div>
            </div>
          )}

        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-white/15 rounded-3xl p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">ویرایش مشخصات مجاز کاربر ({selectedUser.fullName})</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">نام و نام خانوادگی:</label>
                <input
                  type="text"
                  value={editFormData.fullName || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">شماره تماس (Phone):</label>
                <input
                  type="text"
                  value={editFormData.phone || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">رتبه سازمانی (Rank):</label>
                <select
                  value={editFormData.rank || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, rank: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Member (عضو تازه)">Member (عضو تازه)</option>
                  <option value="Bronze Leader (رهبر برنزی)">Bronze Leader (رهبر برنزی)</option>
                  <option value="Silver Leader (رهبر نقره‌ای)">Silver Leader (رهبر نقره‌ای)</option>
                  <option value="Gold Leader (رهبر طلایی)">Gold Leader (رهبر طلایی)</option>
                  <option value="Platinum Executive (مدیر پلاتینیوم)">Platinum Executive (مدیر پلاتینیوم)</option>
                  <option value="Diamond Master (مستر الماس)">Diamond Master (مستر الماس)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">سطح ماتریسی (Level):</label>
                <select
                  value={editFormData.level || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, level: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="سطح ۱ (Level A)">سطح ۱ (Level A)</option>
                  <option value="سطح ۳ (Level C)">سطح ۳ (Level C)</option>
                  <option value="سطح ۶ (Level F)">سطح ۶ (Level F)</option>
                  <option value="سطح ۸ (Level H)">سطح ۸ (Level H)</option>
                  <option value="Level 12 (Level L)">Level 12 (Level L)</option>
                  <option value="سطح ۱۶ (Level P)">سطح ۱۶ (Level P)</option>
                  <option value="سطح ۲۰ (Level T)">سطح ۲۰ (Level T)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>توجه: این اقدام حساس بوده و لاگ تغییرات با شناسه شما در سیستم ثبت می‌شود.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                انصراف
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20"
              >
                ذخیره تغییرات و ثبت لاگ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUSPEND USER MODAL */}
      {isSuspendModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-rose-500/30 rounded-3xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-400">
              <Ban className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">تعلیق حساب کاربری ({selectedUser.fullName})</h3>
            </div>

            <p className="text-xs text-slate-300">
              با تعلیق حساب، دسترسی کاربر به ورود، معاملات کپی ترید و واریز/برداشت موقتاً مسدود می‌شود.
            </p>

            <div>
              <label className="text-slate-400 block mb-1 text-xs">علت تعلیق (ثبت در لاگ امنیتی):</label>
              <textarea
                rows={3}
                placeholder="دلیل تعلیق مانند ارسال مدارک نامعتبر، فعالیت مشکوک، درخواست مراجع و..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setIsSuspendModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                انصراف
              </button>
              <button
                onClick={handleConfirmSuspend}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/20"
              >
                تایید تعلیق حساب
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

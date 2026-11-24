import React, { useState } from 'react';
import { PageId, AdminRoleType, AdminTab } from '../../types';
import { adminAuthService, AdminAccount, ROLE_PERMISSIONS } from '../../services/adminAuthService';
import { 
  UserCheck, 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Trash2, 
  Key, 
  Eye, 
  EyeOff, 
  Layers, 
  Settings,
  ShieldAlert,
  Mail,
  User as UserIcon,
  Check
} from 'lucide-react';

const ALL_ADMIN_TABS: { id: AdminTab; label: string; color: string }[] = [
  { id: 'dashboard', label: 'داشبورد اصلی', color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
  { id: 'users', label: 'مدیریت کاربران', color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  { id: 'kyc', label: 'تایید هویت KYC', color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  { id: 'withdrawals', label: 'برداشت‌ها و ولت', color: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' },
  { id: 'network', label: 'شبکه و هیبرید', color: 'bg-pink-500/10 text-pink-400 border border-pink-500/20' },
  { id: 'levels', label: 'لایه‌های هیبرید', color: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' },
  { id: 'ranks', label: 'رتبه‌ها و پاداش‌ها', color: 'bg-rose-500/10 text-rose-400 border border-rose-500/20' },
  { id: 'commissions', label: 'پورسانت‌ها', color: 'bg-teal-500/10 text-teal-400 border border-teal-500/20' },
  { id: 'copy-trading', label: 'کپی تریدینگ', color: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' },
  { id: 'api', label: 'کلیدهای API', color: 'bg-slate-500/10 text-slate-400 border border-slate-500/20' },
  { id: 'cms', label: 'مدیریت صفحات', color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  { id: 'blog', label: 'وبلاگ و سئو', color: 'bg-lime-500/10 text-lime-400 border border-lime-500/20' },
  { id: 'notifications', label: 'اعلان‌ها', color: 'bg-sky-500/10 text-sky-400 border border-sky-500/20' },
  { id: 'audit-logs', label: 'امنیت و لاگ', color: 'bg-red-500/10 text-red-400 border border-red-500/20' },
  { id: 'admins', label: 'سرپرستان', color: 'bg-rose-500/10 text-rose-400 border border-rose-500/20' },
  { id: 'roles', label: 'نقش‌ها و RBAC', color: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' },
  { id: 'settings', label: 'تنظیمات', color: 'bg-gray-500/10 text-gray-400 border border-gray-500/20' }
];

export const AdminAdminsPage: React.FC<{ 
  currentAdminRole: AdminRoleType; 
  onNavigate?: (page: PageId) => void 
}> = ({ currentAdminRole }) => {
  const [admins, setAdmins] = useState<AdminAccount[]>(adminAuthService.getAllAdmins());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<AdminRoleType>('admin');
  const [newPermissionLevel, setNewPermissionLevel] = useState<'read' | 'write' | 'delete'>('write');
  const [newAllowedTabs, setNewAllowedTabs] = useState<AdminTab[]>(['dashboard', 'users', 'withdrawals', 'network', 'levels']);
  
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const togglePasswordVisibility = (adminId: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [adminId]: !prev[adminId]
    }));
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentAdmin = adminAuthService.getCurrentAdmin() || {
      id: 'ADM-001',
      email: 'admin',
      role: 'super_admin' as AdminRoleType,
      username: 'superadmin',
      fullName: 'Super Admin',
      roleTitle: 'Super Admin',
      status: 'active' as const,
      lastLogin: '',
      createdAt: '',
      permissions: [],
      avatar: 'SA'
    };

    if (!newPassword.trim() || newPassword.length < 6) {
      showToast('رمز عبور باید حداقل ۶ کاراکتر باشد.');
      return;
    }

    if (newAllowedTabs.length === 0) {
      showToast('حداقل یک صفحه مجاز برای ادمین انتخاب کنید.');
      return;
    }

    const created = adminAuthService.createAdmin(
      newEmail,
      newFullName,
      newUsername,
      newRole,
      currentAdmin,
      newPassword,
      newAllowedTabs,
      newPermissionLevel
    );

    setAdmins(adminAuthService.getAllAdmins());
    setShowCreateModal(false);
    setNewFullName('');
    setNewEmail('');
    setNewUsername('');
    setNewPassword('');
    setNewRole('admin');
    setNewPermissionLevel('write');
    setNewAllowedTabs(['dashboard', 'users', 'withdrawals', 'network', 'levels']);
    showToast(`حساب مدیر جدید برای "${created.fullName}" با کلمه عبور اختصاصی ایجاد شد.`);
  };

  const handleToggleStatus = (adminId: string) => {
    const currentAdmin = adminAuthService.getCurrentAdmin() || {
      id: 'ADM-001',
      email: 'admin',
      role: 'super_admin' as AdminRoleType,
      username: 'superadmin',
      fullName: 'Super Admin',
      roleTitle: 'Super Admin',
      status: 'active' as const,
      lastLogin: '',
      createdAt: '',
      permissions: [],
      avatar: 'SA'
    };

    const success = adminAuthService.toggleAdminStatus(adminId, currentAdmin);
    if (success) {
      setAdmins(adminAuthService.getAllAdmins());
      showToast('وضعیت حساب کاربری مدیر به‌روزرسانی شد.');
    } else {
      showToast('امکان غیرفعال‌سازی مدیر ارشد (Super Admin) وجود ندارد.');
    }
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-mono mb-1.5 border border-rose-500/20">
            <Lock className="w-3.5 h-3.5" />
            <span>ADMINISTRATOR ACCOUNTS & CUSTOM PERMISSIONS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            مدیریت دسترسی‌ها و کلمات عبور سرپرستان
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            تعریف حساب‌های مدیریتی جدید با نام کاربری، کلمه عبور اختصاصی، محدودیت دسترسی به صفحات منو و سطوح عملیاتی.
          </p>
        </div>

        {currentAdminRole === 'super_admin' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>ایجاد سرپرست با دسترسی سفارشی</span>
          </button>
        )}
      </div>

      {/* Admins Table */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="font-bold text-white text-sm flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-rose-400" />
            <span>فهرست مدیران و کدهای دسترسی احراز شده ({admins.length} نفر)</span>
          </div>
          <span className="text-xs text-rose-400 font-mono font-bold">SUPER ADM PRIVILEGES ONLY</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/70 text-slate-400 font-medium border-b border-white/5">
              <tr>
                <th className="p-3.5">نام سرپرست / شناسه</th>
                <th className="p-3.5">نام کاربری و کلمه عبور</th>
                <th className="p-3.5">Email سازمانی</th>
                <th className="p-3.5">نقش پایه (Role)</th>
                <th className="p-3.5">سطح عملیات</th>
                <th className="p-3.5">منوهای مجاز</th>
                <th className="p-3.5">وضعیت</th>
                <th className="p-3.5 text-center">مدیریت وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {admins.map((adm) => {
                const isPassVisible = visiblePasswords[adm.id] || false;
                const plainPassword = adm.password || '••••••••';
                const adminAllowedTabs = adm.allowedTabs || ['dashboard', 'users', 'withdrawals', 'network', 'levels'];
                
                return (
                  <tr key={adm.id} className="hover:bg-white/5 transition">
                    {/* Column 1: Profile */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/10 text-white flex items-center justify-center font-bold text-xs">
                          {adm.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-white font-sans">{adm.fullName}</div>
                          <div className="text-[10px] text-slate-400">{adm.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Credentials */}
                    <td className="p-3.5 text-slate-300 font-mono">
                      <div className="space-y-1 text-right" dir="ltr">
                        <div className="text-xs text-blue-400 font-bold">@{adm.username}</div>
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="font-bold text-slate-200">
                            {isPassVisible ? plainPassword : '••••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(adm.id)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                            title="نمایش/عدم نمایش کلمه عبور"
                          >
                            {isPassVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Column 3: Email */}
                    <td className="p-3.5 text-slate-400 font-mono" dir="ltr">
                      {adm.email}
                    </td>

                    {/* Column 4: Base Role */}
                    <td className="p-3.5 font-sans">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        adm.role === 'super_admin' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        adm.role === 'compliance_admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        adm.role === 'financial_admin' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {adm.roleTitle}
                      </span>
                    </td>

                    {/* Column 5: Operation Level */}
                    <td className="p-3.5 font-sans">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        adm.permissionLevel === 'delete' ? 'bg-red-500/20 text-red-300 border border-red-500/20' :
                        adm.permissionLevel === 'write' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20' :
                        'bg-slate-500/20 text-slate-400 border border-slate-500/20'
                      }`}>
                        {adm.permissionLevel === 'delete' ? 'حذف و ویرایش (Full Delete)' :
                         adm.permissionLevel === 'write' ? 'ایجاد و ویرایش (Write)' :
                         'فقط مشاهده (Read Only)'}
                      </span>
                    </td>

                    {/* Column 6: Permitted Pages */}
                    <td className="p-3.5 font-sans max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {adminAllowedTabs.map((tabId) => {
                          const tabObj = ALL_ADMIN_TABS.find(t => t.id === tabId);
                          return (
                            <span 
                              key={tabId} 
                              className={`px-1.5 py-0.5 rounded text-[9px] font-medium border ${
                                tabObj?.color || 'bg-slate-800 text-slate-400 border-white/5'
                              }`}
                            >
                              {tabObj?.label || tabId}
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    {/* Column 7: Status */}
                    <td className="p-3.5 font-sans">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        adm.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {adm.status === 'active' ? 'فعال' : 'مسدود'}
                      </span>
                    </td>

                    {/* Column 8: Management */}
                    <td className="p-3.5 text-center font-sans">
                      {adm.role !== 'super_admin' ? (
                        <button
                          onClick={() => handleToggleStatus(adm.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            adm.status === 'active'
                              ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {adm.status === 'active' ? 'غیرفعال‌سازی' : 'فعال‌سازی'}
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">PROTECTED</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix Overview */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>ماتریس دسترسی نقش‌های سیستم (Role-Based Access Control)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {Object.entries(ROLE_PERMISSIONS).map(([key, value]) => (
            <div key={key} className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
              <div className="font-bold text-white">{value.title}</div>
              <div className="text-[11px] text-slate-400 font-mono space-y-1">
                {value.permissions.slice(0, 4).map((p, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-emerald-400/90">
                    <span>✓</span>
                    <span>{p}</span>
                  </div>
                ))}
                {value.permissions.length > 4 && (
                  <div className="text-slate-500 text-[10px]">
                    + {value.permissions.length - 4} دسترسی مجاز دیگر
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-white/20 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-rose-400">
                <UserCheck className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">ایجاد سرپرست جدید سفارشی</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                بستن
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">نام و نام خانوادگی:</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="مثلاً: علی رضایی"
                  className="w-full p-3 bg-slate-950 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Email سازمانی (@tgex.io):</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="ali.rezaei@tgex.io"
                  className="w-full p-3 bg-slate-950 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">نام کاربری ادمین:</label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="ali_admin"
                    className="w-full p-3 bg-slate-950 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">کلمه عبور ادمین:</label>
                  <input
                    type="text"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="رمز ورود سفارشی"
                    className="w-full p-3 bg-slate-950 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">نقش پایه (Role):</label>
                  <select
                    value={newRole}
                    onChange={(e: any) => setNewRole(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-rose-500 font-sans"
                  >
                    <option value="admin">مدیر سیستم (Admin)</option>
                    <option value="compliance_admin">ناظر احراز هویت (Compliance)</option>
                    <option value="financial_admin">مدیر امور مالی (Finance)</option>
                    <option value="support_admin">پشتیبانی و محتوا (Support)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">سطح عملیات (Operations):</label>
                  <select
                    value={newPermissionLevel}
                    onChange={(e: any) => setNewPermissionLevel(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-rose-500 font-sans"
                  >
                    <option value="read">فقط مشاهده (Read Only)</option>
                    <option value="write">ایجاد و ویرایش (Write)</option>
                    <option value="delete">دسترسی کامل و حذف (Delete)</option>
                  </select>
                </div>
              </div>

              {/* Allowed Pages (Checkboxes) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">صفحات مجاز منوی مدیریت:</label>
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950 border border-white/10 rounded-2xl max-h-36 overflow-y-auto">
                  {ALL_ADMIN_TABS.map((tab) => {
                    const isChecked = newAllowedTabs.includes(tab.id);
                    return (
                      <label 
                        key={tab.id} 
                        className={`flex items-center gap-2 p-1.5 rounded text-[11px] transition cursor-pointer hover:bg-white/5 ${
                          isChecked ? 'text-white font-bold' : 'text-slate-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewAllowedTabs([...newAllowedTabs, tab.id]);
                            } else {
                              setNewAllowedTabs(newAllowedTabs.filter(t => t !== tab.id));
                            }
                          }}
                          className="rounded border-white/10 bg-slate-900 text-rose-500 focus:ring-rose-500 w-3.5 h-3.5"
                        />
                        <span>{tab.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-rose-600/30 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>صدور دسترسی سفارشی</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

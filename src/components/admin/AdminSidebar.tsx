import React from 'react';
import { AdminTab, AdminRoleType, PageId } from '../../types';
import { databaseService } from '../../services/db/databaseService';
import { adminAuthService } from '../../services/adminAuthService';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Network, 
  Layers, 
  Award, 
  DollarSign, 
  Zap, 
  Terminal, 
  FileEdit, 
  BookOpen,
  Bell, 
  FileText, 
  UserCheck, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  LogOut, 
  Shield, 
  CheckCircle2,
  ExternalLink,
  Wallet,
  MessageSquare
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  adminRole: AdminRoleType;
  onRoleChange: (role: AdminRoleType) => void;
  adminEmail: string;
  onExitAdmin: () => void;
  onNavigatePage?: (page: PageId) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  adminRole,
  onRoleChange,
  adminEmail,
  onExitAdmin,
  onNavigatePage,
  isOpenMobile,
  onCloseMobile
}) => {
  const pendingWithdrawalsCount = databaseService.getWithdrawalRequests().filter(r => r.status === 'pending').length;

  const menuItems: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { 
      id: 'dashboard', 
      label: 'داشبورد اصلی', 
      icon: LayoutDashboard 
    },
    { 
      id: 'users', 
      label: 'مدیریت کاربران', 
      icon: Users, 
      badge: 'Active' 
    },
    { 
      id: 'withdrawals', 
      label: 'درخواست‌های تسویه و ولت', 
      icon: Wallet, 
      badge: pendingWithdrawalsCount > 0 ? `${pendingWithdrawalsCount} New` : undefined 
    },
    { 
      id: 'network', 
      label: 'شبکه و سیستم هیبرید', 
      icon: Network 
    },
    { 
      id: 'levels', 
      label: 'سیستم هیبرید ۲۰ سطحی', 
      icon: Layers 
    },
    { 
      id: 'ranks', 
      label: 'رتبه‌ها و پاداش‌ها', 
      icon: Award 
    },
    { 
      id: 'commissions', 
      label: 'پورسانت‌ها و تسویه‌ها', 
      icon: DollarSign 
    },
    { 
      id: 'api', 
      label: 'مدیریت API و کلیکس', 
      icon: Terminal 
    },
    { 
      id: 'cms', 
      label: 'مدیریت صفحات عمومی وب‌سایت', 
      icon: FileEdit 
    },
    { 
      id: 'blog', 
      label: 'مدیریت وبلاگ و سئو (Word)', 
      icon: BookOpen 
    },
    { 
      id: 'notifications', 
      label: 'اعلان‌های سیستمی', 
      icon: Bell 
    },
    { 
      id: 'audit-logs', 
      label: 'گزارش‌های امنیتی', 
      icon: FileText 
    },
    { 
      id: 'admins', 
      label: 'مدیریت سرپرستان', 
      icon: UserCheck, 
      badge: 'Super' 
    },
    { 
      id: 'roles', 
      label: 'نقش‌ها و دسترسی‌ها', 
      icon: Shield 
    },
    { 
      id: 'tickets', 
      label: 'تیکت‌های پشتیبانی', 
      icon: MessageSquare,
      badge: 'Support'
    },
    { 
      id: 'settings', 
      label: 'تنظیمات سامانه', 
      icon: Settings 
    }
  ];

  const roleLabels: Record<AdminRoleType, { name: string; color: string }> = {
    super_admin: { name: 'مدیر ارشد (Super Admin)', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
    admin: { name: 'مدیر سیستم (Admin)', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    compliance_admin: { name: 'کارشناس انطباق (Compliance)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    financial_admin: { name: 'مدیر مالی (Financial)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    support_admin: { name: 'پشتیبانی (Support Admin)', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
    viewer: { name: 'ناظر خواندنی (Viewer)', color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' }
  };

  return (
    <aside className={`w-72 bg-slate-950 border-l border-white/10 flex flex-col justify-between shrink-0 h-full overflow-y-auto ${
      isOpenMobile ? `fixed inset-y-0 right-0 z-50 shadow-2xl block` : 'hidden lg:flex'
    }`}>
      
      {/* Sidebar Header */}
      <div className="p-5 border-b border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-base shadow-lg shadow-blue-500/25">
              TX
            </div>
            <div>
              <div className="font-black text-white text-base tracking-tight flex items-center gap-1.5">
                <span>Tgex</span>
                <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded">
                  ADMIN
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">ENTERPRISE CONSOLE</div>
            </div>
          </div>

          {isOpenMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800 lg:hidden"
            >
              ✕
            </button>
          )}
        </div>

        {/* Role Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] text-slate-400 font-semibold block">
            سطح دسترسی فعلی سرپرست:
          </label>
          <select
            value={adminRole}
            onChange={(e) => onRoleChange(e.target.value as AdminRoleType)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="super_admin">Super Admin (مدیر ارشد)</option>
            <option value="admin">System Admin (مدیر سیستم)</option>
            <option value="compliance_admin">Compliance (انطباق و KYC)</option>
            <option value="financial_admin">Financial (مالی و برداشت)</option>
            <option value="support_admin">Support (پشتیبانی)</option>
            <option value="viewer">Viewer (ناظر سیستم)</option>
          </select>
        </div>
      </div>

      {/* Navigation List */}
      <div className="p-3 flex-1 overflow-y-auto space-y-1">
        {(() => {
          const currentAdmin = adminAuthService.getCurrentAdmin();
          const filteredItems = menuItems.filter(item => {
            if (!currentAdmin) return true;
            if (currentAdmin.role === 'super_admin') return true;
            if (currentAdmin.allowedTabs) {
              return currentAdmin.allowedTabs.includes(item.id);
            }
            return true;
          });

          return filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                    item.badge.includes('New') 
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          });
        })()}
      </div>

      {/* Footer Exit Button */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <button
          onClick={onExitAdmin}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
        >
          <ExternalLink className="w-4 h-4 text-slate-400" />
          <span>خروج به سایت اصلی</span>
        </button>
      </div>

    </aside>
  );
};

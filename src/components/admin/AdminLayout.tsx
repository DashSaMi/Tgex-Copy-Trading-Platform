import React, { useState, useEffect } from 'react';
import { AdminTab, AdminRoleType, PageId, User } from '../../types';
import { AdminSidebar } from './AdminSidebar';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminUsersPage } from './AdminUsersPage';
import { AdminWithdrawalsPage } from './AdminWithdrawalsPage';
import { AdminNetworkPage } from './AdminNetworkPage';
import { AdminLevelsPage } from './AdminLevelsPage';
import { AdminRanksPage } from './AdminRanksPage';
import { AdminCommissionsPage } from './AdminCommissionsPage';
import { AdminApiPage } from './AdminApiPage';
import { AdminCmsPage } from './AdminCmsPage';
import { AdminBlogPage } from './AdminBlogPage';
import { AdminNotificationsPage } from './AdminNotificationsPage';
import { AdminAuditLogsPage } from './AdminAuditLogsPage';
import { AdminAdminsPage } from './AdminAdminsPage';
import { AdminRolesPage } from './AdminRolesPage';
import { AdminSettingsPage } from './AdminSettingsPage';
import { AdminTicketsPage } from './AdminTicketsPage';
import { exchangeService } from '../../services/exchange';
import { adminAuthService } from '../../services/adminAuthService';
import { 
  ShieldCheck, 
  Menu, 
  Bell, 
  Search, 
  LogOut, 
  ExternalLink,
  Terminal,
  FileEdit,
  Settings as SettingsIcon,
  Zap,
  Layers,
  DollarSign
} from 'lucide-react';

interface AdminLayoutProps {
  currentUser: User | null;
  onNavigatePage: (page: PageId) => void;
  onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentUser,
  onNavigatePage,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const initialAdminSession = adminAuthService.getCurrentSession();
  const [adminRole, setAdminRole] = useState<AdminRoleType>(initialAdminSession?.admin.role || 'super_admin');
  const [adminEmail, setAdminEmail] = useState<string>(initialAdminSession?.admin.email || '');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedUserIdForInspection, setSelectedUserIdForInspection] = useState<string | null>(null);

  useEffect(() => {
    const session = adminAuthService.getCurrentSession();
    if (session?.admin) {
      setAdminRole(session.admin.role);
      setAdminEmail(session.admin.email);
    }
  }, []);

  // Safeguard: Redirect to first allowed tab if current active tab is not permitted
  useEffect(() => {
    const session = adminAuthService.getCurrentSession();
    if (session?.admin) {
      const currentAdmin = session.admin;
      if (currentAdmin.role !== 'super_admin' && currentAdmin.allowedTabs) {
        if (!currentAdmin.allowedTabs.includes(activeTab)) {
          const firstAllowed = currentAdmin.allowedTabs[0];
          if (firstAllowed) {
            setActiveTab(firstAllowed);
          }
        }
      }
    }
  }, [activeTab]);

  const handleSelectUserFromOverview = (userId: string) => {
    setSelectedUserIdForInspection(userId);
    setActiveTab('users');
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white" dir="rtl">
      
      {/* Admin Top Appbar */}
      <header className="h-16 bg-slate-950/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-sm">
              TX
            </div>
            <div className="hidden sm:block font-black text-white text-base tracking-tight">
              Tgex <span className="text-blue-500 font-mono text-xs font-bold">ADMIN CONSOLE</span>
            </div>
          </div>
        </div>

        {/* Global Admin Actions */}
        <div className="flex items-center gap-3">
          
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono">{adminEmail}</span>
            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold">
              {adminRole.toUpperCase()}
            </span>
          </div>

          <button
            onClick={() => onNavigatePage('home')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs transition flex items-center gap-1.5"
            title="مشاهده سایت اصلی"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">سایت اصلی</span>
          </button>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs transition flex items-center gap-1"
            title="خروج از حساب"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* Main Workspace with Sidebar & Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab !== 'users') setSelectedUserIdForInspection(null);
          }}
          adminRole={adminRole}
          onRoleChange={setAdminRole}
          adminEmail={adminEmail}
          onExitAdmin={() => onNavigatePage('home')}
          onNavigatePage={onNavigatePage}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic Admin Body Area */}
        <main className="flex-1 overflow-y-auto min-h-screen p-4 sm:p-6 lg:p-8 bg-[#05070a] w-full">
          <div className="max-w-7xl mx-auto w-full pb-16">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <AdminDashboardOverview
              onSwitchTab={(tab) => setActiveTab(tab)}
              onSelectUser={handleSelectUserFromOverview}
            />
          )}

          {/* TAB 2: USERS */}
          {activeTab === 'users' && (
            <AdminUsersPage 
              currentAdminRole={adminRole}
              currentAdminEmail={adminEmail}
              initialSelectedUserId={selectedUserIdForInspection}
              onNavigatePage={onNavigatePage}
              onSwitchAdminTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* TAB 3: WITHDRAWALS */}
          {activeTab === 'withdrawals' && (
            <AdminWithdrawalsPage />
          )}

          {/* TAB 5: NETWORK & MATRIX */}
          {activeTab === 'network' && (
            <AdminNetworkPage onSelectUser={(id) => handleSelectUserFromOverview(id)} />
          )}

          {/* TAB 6: 20 LEVELS */}
          {activeTab === 'levels' && (
            <AdminLevelsPage />
          )}

          {/* TAB 7: RANKS & REWARDS */}
          {activeTab === 'ranks' && (
            <AdminRanksPage />
          )}

          {/* TAB 8: COMMISSIONS & LEDGER */}
          {activeTab === 'commissions' && (
            <AdminCommissionsPage />
          )}

          {/* TAB 9: API & WEBHOOKS */}
          {activeTab === 'api' && (
            <AdminApiPage />
          )}

          {/* TAB 11: CMS (Public Pages Content Management) */}
          {activeTab === 'cms' && (
            <AdminCmsPage onNavigate={onNavigatePage} />
          )}

          {/* TAB 12: BLOG & WORD EDITOR */}
          {activeTab === 'blog' && (
            <AdminBlogPage />
          )}

          {/* TAB 12: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <AdminNotificationsPage />
          )}

          {/* TAB 13: AUDIT LOGS */}
          {activeTab === 'audit-logs' && (
            <AdminAuditLogsPage />
          )}

          {/* TAB 14: ADMINS MANAGEMENT */}
          {activeTab === 'admins' && (
            <AdminAdminsPage currentAdminRole={adminRole} />
          )}

          {/* TAB 15: RBAC ROLES */}
          {activeTab === 'roles' && (
            <AdminRolesPage />
          )}

          {/* TAB 16: SETTINGS */}
          {activeTab === 'settings' && (
            <AdminSettingsPage />
          )}

          {/* TAB 17: TICKETS */}
          {activeTab === 'tickets' && (
            <AdminTicketsPage />
          )}

          </div>
        </main>
      </div>

    </div>
  );
};

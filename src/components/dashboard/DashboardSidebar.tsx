import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardTab, User, PageId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from '../LanguageSwitcher';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Layers,
  TrendingUp,
  Award,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Wallet,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  MessageSquare,
  Megaphone
} from 'lucide-react';

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  user: User;
  onLogout: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onNavigatePage: (page: PageId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  onSelectTab,
  user,
  onLogout,
  isOpenMobile,
  onCloseMobile,
  onNavigatePage,
  isCollapsed,
  onToggleCollapse
}) => {
  const { t, dir, language } = useLanguage();
  const isFa = language === 'fa';

  const navGroups: {
    groupLabel: string;
    items: { id: DashboardTab; label: string; icon: any; count?: string | number }[];
  }[] = [
    {
      groupLabel: isFa ? 'نمای کلی و مالی' : 'Workspace',
      items: [
        { id: 'overview', label: t('dash.nav.overview'), icon: LayoutDashboard },
        { id: 'earnings', label: t('dash.nav.earnings'), icon: TrendingUp },
        { id: 'withdrawals', label: t('dash.nav.withdrawals'), icon: Wallet }
      ]
    },
    {
      groupLabel: isFa ? 'شبکه و جایگاه' : 'Network & Growth',
      items: [
        { id: 'network', label: t('dash.nav.network'), icon: Users },
        {
          id: 'referrals',
          label: t('dash.nav.referrals'),
          icon: UserPlus,
          count: user.directReferralsCount ?? 0
        },
        { id: 'levels', label: t('dash.nav.levels'), icon: Layers },
        { id: 'rank', label: t('dash.nav.rank'), icon: Award },
        { id: 'ads', label: t('dash.nav.ads', 'تبلیغات و بورد شخصی'), icon: Megaphone }
      ]
    },
    {
      groupLabel: isFa ? 'حساب و پشتیبانی' : 'Account',
      items: [
        {
          id: 'security',
          label: isFa ? 'پروفایل و امنیت' : 'Profile & Security',
          icon: ShieldCheck
        },
        { id: 'notifications', label: t('dash.nav.notifications'), icon: Bell },
        {
          id: 'support-tickets',
          label: t('dash.nav.support_tickets', 'تیکت‌های پشتیبانی'),
          icon: MessageSquare
        }
      ]
    }
  ];

  const renderSidebarContent = (collapsed: boolean) => {
    return (
      <div className="h-full flex flex-col justify-between px-3 py-4 text-slate-200 select-none" dir={dir}>
        {/* Top Section */}
        <div className="space-y-4 overflow-y-auto overflow-x-visible pr-0.5">
          {/* Header Row */}
          <div className="flex items-center justify-between px-1">
            {collapsed ? (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="mx-auto w-9 h-9 rounded-xl bg-slate-900 border border-white/10 hover:border-blue-500/40 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
                title={isFa ? 'باز کردن منو' : 'Expand sidebar'}
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-xs font-mono shrink-0">
                    TG
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-white text-sm truncate">{t('dash.nav.title')}</div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {user.rankName || t('dash.nav.member')}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition shrink-0 cursor-pointer"
                  title={isFa ? 'جمع کردن منو' : 'Collapse sidebar'}
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>

                {isOpenMobile && (
                  <button
                    type="button"
                    onClick={onCloseMobile}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/[0.06] md:hidden shrink-0 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile Language Switcher */}
          {!collapsed && isOpenMobile && (
            <div className="px-1 md:hidden">
              <LanguageSwitcher variant="navbar" className="w-full" />
            </div>
          )}

          {/* Grouped Navigation */}
          <nav className="space-y-4 pt-1">
            {navGroups.map((group) => (
              <div key={group.groupLabel} className="space-y-1">
                {!collapsed && (
                  <div className="px-2.5 pb-1 text-[11px] font-medium text-slate-500 truncate">
                    {group.groupLabel}
                  </div>
                )}

                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    if (collapsed) {
                      return (
                        <div key={item.id} className="relative group flex justify-center">
                          <button
                            type="button"
                            onClick={() => onSelectTab(item.id)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                            }`}
                          >
                            <Icon className="w-[18px] h-[18px]" />
                          </button>

                          <div
                            className={`absolute top-1/2 -translate-y-1/2 ${
                              dir === 'rtl' ? 'right-full mr-3' : 'left-full ml-3'
                            } z-50 pointer-events-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-xs font-semibold text-white shadow-xl whitespace-nowrap`}
                          >
                            <span>{item.label}</span>
                            {item.count !== undefined && (
                              <span className="text-[11px] font-mono tabular-nums text-blue-400">
                                {item.count}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectTab(item.id);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className={`relative w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-blue-500/12 text-white font-semibold'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-blue-400' : 'text-slate-500'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.count !== undefined && (
                          <span
                            className={`text-xs font-mono tabular-nums shrink-0 ${
                              isActive ? 'text-blue-300' : 'text-slate-500'
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-white/[0.07] space-y-1">
          {collapsed ? (
            <>
              <div className="relative group flex justify-center">
                <button
                  type="button"
                  onClick={() => onNavigatePage('home')}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  {dir === 'rtl' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                <div
                  className={`absolute top-1/2 -translate-y-1/2 ${
                    dir === 'rtl' ? 'right-full mr-3' : 'left-full ml-3'
                  } z-50 pointer-events-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-xs font-semibold text-white shadow-xl whitespace-nowrap`}
                >
                  {t('dash.nav.back_to_site')}
                </div>
              </div>

              <div className="relative group flex justify-center">
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
                <div
                  className={`absolute top-1/2 -translate-y-1/2 ${
                    dir === 'rtl' ? 'right-full mr-3' : 'left-full ml-3'
                  } z-50 pointer-events-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-xs font-semibold text-rose-300 shadow-xl whitespace-nowrap`}
                >
                  {t('nav.logout', 'خروج از حساب')}
                </div>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onNavigatePage('home')}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                <span className="truncate">{t('dash.nav.back_to_site')}</span>
                {dir === 'rtl' ? <ChevronLeft className="w-3.5 h-3.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span className="truncate">{t('nav.logout', 'خروج از حساب')}</span>
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Docked Rail */}
      <aside
        className={`hidden md:block shrink-0 transition-[width] duration-200 ${
          isCollapsed ? 'w-[72px]' : 'w-60'
        } bg-[#070A11] border-e border-white/[0.08]`}
      >
        <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-visible">
          {renderSidebarContent(isCollapsed)}
        </div>
      </aside>

      {/* Mobile & Tablet Slide-Over Drawer */}
      <AnimatePresence>
        {isOpenMobile && (
          <div className="fixed inset-0 z-[9999] md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-[#05070A]/85 backdrop-blur-md z-[9998]"
            />

            <motion.div
              initial={{ x: dir === 'rtl' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: dir === 'rtl' ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className={`fixed top-0 bottom-0 ${
                dir === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'
              } w-72 max-w-[85vw] bg-[#080C14] border-white/10 shadow-2xl overflow-y-auto z-[9999]`}
            >
              {renderSidebarContent(false)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

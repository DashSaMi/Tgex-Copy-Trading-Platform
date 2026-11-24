import React, { useState } from 'react';
import { AdminRolePermission, AdminRoleType } from '../../types';
import { 
  UserCheck, 
  ShieldCheck, 
  Lock, 
  Check, 
  X, 
  AlertCircle,
  Users,
  Settings
} from 'lucide-react';

export const AdminRolesPage: React.FC = () => {
  const [roles, setRoles] = useState<AdminRolePermission[]>([
    {
      id: 'role_1',
      roleKey: 'super_admin',
      name: 'Super Administrator',
      farsiName: 'مدیر کل و حاکم سیستم',
      description: 'دسترسی کامل و تام‌الاختیار به تمامی جداول، تراکنش‌های مالی، تعلیق کاربران، احراز هویت و تغییر نقش‌ها.',
      assignedAdminsCount: 2,
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      permissions: {
        canManageUsers: true,
        canEditProfiles: true,
        canSuspendUsers: true,
        canReviewKyc: true,
        canManageCommissions: true,
        canConfigureRanks: true,
        canManageRoles: true,
        canViewAuditLogs: true,
        canConfigureSystem: true
      }
    },
    {
      id: 'role_2',
      roleKey: 'compliance_admin',
      name: 'Compliance & AML Officer',
      farsiName: 'افسر انطباق و احراز هویت (AML/KYC)',
      description: 'مسئول بازنگری مدارک شناسایی، تایید و رد درخواست‌های احراز هویت، و بررسی عدم پولشویی.',
      assignedAdminsCount: 4,
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      permissions: {
        canManageUsers: true,
        canEditProfiles: false,
        canSuspendUsers: false,
        canReviewKyc: true,
        canManageCommissions: false,
        canConfigureRanks: false,
        canManageRoles: false,
        canViewAuditLogs: true,
        canConfigureSystem: false
      }
    },
    {
      id: 'role_3',
      roleKey: 'financial_admin',
      name: 'Financial Controller',
      farsiName: 'مدیر مالی و تسویه حساب‌ها',
      description: 'مدیریت و آزادسازی دوره‌های تسویه پورسانت ماتریس، مانیتورینگ استخرهای رهبری و بازبینی تراکنش‌ها.',
      assignedAdminsCount: 3,
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      permissions: {
        canManageUsers: false,
        canEditProfiles: false,
        canSuspendUsers: false,
        canReviewKyc: false,
        canManageCommissions: true,
        canConfigureRanks: true,
        canManageRoles: false,
        canViewAuditLogs: true,
        canConfigureSystem: false
      }
    },
    {
      id: 'role_4',
      roleKey: 'support_admin',
      name: 'Support & Operations Lead',
      farsiName: 'پشتیبانی و عملیات کاربران',
      description: 'پاسخگویی به تیکت‌ها، ویرایش شماره‌های تماس احراز نشده و راهنمایی ساختار شبکه.',
      assignedAdminsCount: 6,
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      permissions: {
        canManageUsers: true,
        canEditProfiles: true,
        canSuspendUsers: false,
        canReviewKyc: false,
        canManageCommissions: false,
        canConfigureRanks: false,
        canManageRoles: false,
        canViewAuditLogs: true,
        canConfigureSystem: false
      }
    }
  ]);

  return (
    <div className="space-y-6 pb-12 text-slate-200 text-right" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>ROLE-BASED ACCESS CONTROL (RBAC)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            نقش‌ها و ماتریس دسترسی سازمانی (Admin Roles & Permissions)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            جداسازی وظایف مدیریتی بر اساس اصل حداقل دسترسی و استانداردهای امنیت سایبری مالی.
          </p>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">{role.farsiName}</h3>
                <div className="text-xs font-mono text-slate-400">{role.name}</div>
              </div>
              <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${role.badgeColor}`}>
                {role.assignedAdminsCount} مدیر فعال
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
              {role.description}
            </p>

            <div className="pt-3 border-t border-white/5 space-y-2 text-xs">
              <div className="text-[11px] font-bold text-slate-400 mb-2">مجوزهای دسترسی این نقش:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  {role.permissions.canManageUsers ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-600" />}
                  <span className={role.permissions.canManageUsers ? 'text-white' : 'text-slate-500'}>مشاهده کاربران</span>
                </div>
                <div className="flex items-center gap-2">
                  {role.permissions.canEditProfiles ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-600" />}
                  <span className={role.permissions.canEditProfiles ? 'text-white' : 'text-slate-500'}>ویرایش پروفایل</span>
                </div>
                <div className="flex items-center gap-2">
                  {role.permissions.canSuspendUsers ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-600" />}
                  <span className={role.permissions.canSuspendUsers ? 'text-white' : 'text-slate-500'}>تعلیق/مسدودی' Users'</span>
                </div>
                <div className="flex items-center gap-2">
                  {role.permissions.canReviewKyc ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-600" />}
                  <span className={role.permissions.canReviewKyc ? 'text-white' : 'text-slate-500'}>تایید/رد مدارک KYC</span>
                </div>
                <div className="flex items-center gap-2">
                  {role.permissions.canManageCommissions ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-600" />}
                  <span className={role.permissions.canManageCommissions ? 'text-white' : 'text-slate-500'}>تسویه کمیسیون‌ها</span>
                </div>
                <div className="flex items-center gap-2">
                  {role.permissions.canManageRoles ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-600" />}
                  <span className={role.permissions.canManageRoles ? 'text-white' : 'text-slate-500'}>مدیریت دسترسی‌ها</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

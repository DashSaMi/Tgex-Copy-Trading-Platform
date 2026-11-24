// TGEX Dedicated Admin Authentication & Session Management Service
// Strictly decoupled from standard user authentication

import { AdminRoleType, AdminTab } from '../types';
import { adminService } from './adminService';

export interface AdminAccount {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: AdminRoleType;
  roleTitle: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
  permissions: string[];
  avatar: string;
  password?: string;
  allowedTabs?: AdminTab[];
  permissionLevel?: 'read' | 'write' | 'delete';
}

export interface AdminSession {
  token: string;
  admin: AdminAccount;
  loginTimestamp: string;
  expiresAt: string;
}

const STORAGE_ADMIN_SESSION_KEY = 'tgex_admin_secure_session_vault';
const STORAGE_ADMIN_ACCOUNTS_KEY = 'tgex_admin_accounts_registry';

// Role permissions matrix
export const ROLE_PERMISSIONS: Record<AdminRoleType, { title: string; permissions: string[] }> = {
  super_admin: {
    title: 'Super Administrator (دسترسی کلان)',
    permissions: [
      'admin.all',
      'users.view', 'users.edit', 'users.suspend', 'users.delete',
      'kyc.view', 'kyc.approve', 'kyc.reject', 'kyc.request_info',
      'network.view', 'network.reassign',
      'levels.view', 'levels.edit_rates',
      'ranks.view', 'ranks.edit_rules',
      'commissions.view', 'commissions.payout', 'commissions.recalculate',
      'copy_trading.view', 'copy_trading.configure',
      'api.view', 'api.rotate_keys',
      'cms.view', 'cms.edit', 'cms.publish',
      'notifications.create', 'notifications.broadcast',
      'audit.view', 'audit.export',
      'admins.manage', 'admins.create', 'admins.delete',
      'settings.edit'
    ]
  },
  admin: {
    title: 'System Administrator (مدیر سیستم)',
    permissions: [
      'users.view', 'users.edit', 'users.suspend',
      'kyc.view', 'kyc.approve', 'kyc.reject', 'kyc.request_info',
      'network.view',
      'levels.view',
      'ranks.view',
      'commissions.view',
      'copy_trading.view',
      'cms.view', 'cms.edit',
      'notifications.create',
      'audit.view',
      'settings.view'
    ]
  },
  compliance_admin: {
    title: 'KYC & Compliance Officer (ناظر احراز هویت و تطبیق)',
    permissions: [
      'users.view',
      'kyc.view', 'kyc.approve', 'kyc.reject', 'kyc.request_info',
      'audit.view'
    ]
  },
  financial_admin: {
    title: 'Finance & Settlement Manager (مدیر امور مالی و پورسانت)',
    permissions: [
      'users.view',
      'commissions.view', 'commissions.payout',
      'levels.view',
      'ranks.view',
      'copy_trading.view',
      'audit.view'
    ]
  },
  support_admin: {
    title: 'Support & Content Lead (مسئول پشتیبانی و محتوا)',
    permissions: [
      'users.view',
      'cms.view', 'cms.edit', 'cms.publish',
      'notifications.create',
      'copy_trading.view'
    ]
  },
  viewer: {
    title: 'Read-Only Auditor (ناظر فقط خواندنی)',
    permissions: [
      'users.view',
      'kyc.view',
      'network.view',
      'levels.view',
      'ranks.view',
      'commissions.view',
      'audit.view'
    ]
  }
};

export class AdminAuthService {
  // Hold authenticated admin Bearer token strictly in memory (never localStorage/sessionStorage)
  private memorySession: AdminSession | null = null;

  constructor() {
    // Purge any legacy client-stored admin session tokens
    try {
      localStorage.removeItem(STORAGE_ADMIN_SESSION_KEY);
      sessionStorage.removeItem(STORAGE_ADMIN_SESSION_KEY);
    } catch {}
  }

  private getStoredAccounts(): AdminAccount[] {
    try {
      const data = localStorage.getItem(STORAGE_ADMIN_ACCOUNTS_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  }

  private saveAccounts(accounts: AdminAccount[]) {
    try {
      localStorage.setItem(STORAGE_ADMIN_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error('Failed to save admin accounts', e);
    }
  }

  /**
   * Authenticate Administrator via Server API
   */
  async login(emailOrUsername: string, passwordAttempt: string): Promise<{ success: boolean; session?: AdminSession; error?: string }> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: emailOrUsername,
          password: passwordAttempt
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.token || !data.admin) {
        return {
          success: false,
          error: data.message || 'حساب مدیریتی با این مشخصات یافت نشد یا رمز عبور نادرست است.'
        };
      }

      const session: AdminSession = {
        token: data.token,
        admin: data.admin,
        loginTimestamp: new Date().toISOString(),
        expiresAt: data.expiresAt || new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
      };

      this.memorySession = session;

      // Record Audit Log
      adminService.recordAuditLog({
        adminEmail: data.admin.email,
        adminRole: data.admin.role,
        action: 'ADMIN_LOGIN',
        targetType: 'system',
        targetId: data.admin.id,
        targetName: data.admin.fullName,
        details: `ورود موفق به پنل مدیریت با نقش ${data.admin.roleTitle}`,
        ipAddress: 'server-verified',
        status: 'success'
      });

      return { success: true, session };
    } catch {
      return { success: false, error: 'خطا در برقراری ارتباط با سرور احراز هویت مدیریت.' };
    }
  }

  /**
   * Log out administrator
   */
  async logout(): Promise<void> {
    const session = this.getSession();
    if (session) {
      adminService.recordAuditLog({
        adminEmail: session.admin.email,
        adminRole: session.admin.role,
        action: 'ADMIN_LOGOUT',
        targetType: 'system',
        targetId: session.admin.id,
        targetName: session.admin.fullName,
        details: 'خروج امن سرپرست از کنسول مدیریت',
        ipAddress: 'server-verified',
        status: 'success'
      });
    }

    this.memorySession = null;
    try {
      localStorage.removeItem(STORAGE_ADMIN_SESSION_KEY);
    } catch {}
  }

  /**
   * Get active admin session
   */
  getSession(): AdminSession | null {
    if (!this.memorySession) return null;

    if (new Date(this.memorySession.expiresAt).getTime() < Date.now()) {
      this.memorySession = null;
      return null;
    }

    return this.memorySession;
  }

  getCurrentSession(): AdminSession | null {
    return this.getSession();
  }

  /**
   * Get current authenticated Admin Account
   */
  getCurrentAdmin(): AdminAccount | null {
    const session = this.getSession();
    return session ? session.admin : null;
  }

  /**
   * Verify if current session is an authenticated admin
   */
  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  /**
   * Verify if current admin has specific permission
   */
  hasPermission(permission: string): boolean {
    const admin = this.getCurrentAdmin();
    if (!admin) return false;
    if (admin.role === 'super_admin') return true;
    return admin.permissions.includes(permission) || admin.permissions.includes('admin.all');
  }

  /**
   * List all admin accounts
   */
  getAllAdmins(): AdminAccount[] {
    const current = this.getCurrentAdmin();
    const stored = this.getStoredAccounts();
    if (current && !stored.some(a => a.email === current.email)) {
      return [current, ...stored];
    }
    return stored;
  }

  /**
   * Create new admin account
   */
  createAdmin(
    email: string,
    fullName: string,
    username: string,
    role: AdminRoleType,
    creatorAdmin: AdminAccount,
    _password?: string,
    allowedTabs?: AdminTab[],
    permissionLevel?: 'read' | 'write' | 'delete'
  ): AdminAccount {
    const accounts = this.getStoredAccounts();
    const newAdmin: AdminAccount = {
      id: `ADM-00${accounts.length + 2}`,
      email,
      fullName,
      username,
      role,
      roleTitle: ROLE_PERMISSIONS[role].title,
      status: 'active',
      lastLogin: 'هرگز',
      createdAt: new Date().toISOString().slice(0, 10),
      permissions: ROLE_PERMISSIONS[role].permissions,
      avatar: fullName.slice(0, 2).toUpperCase(),
      allowedTabs: allowedTabs || ['dashboard', 'users', 'kyc', 'withdrawals'],
      permissionLevel: permissionLevel || 'write'
    };

    accounts.push(newAdmin);
    this.saveAccounts(accounts);

    adminService.recordAuditLog({
      adminEmail: creatorAdmin.email,
      adminRole: creatorAdmin.role,
      action: 'ADMIN_CREATED',
      targetType: 'role',
      targetId: newAdmin.id,
      targetName: newAdmin.fullName,
      details: `ایجاد حساب کاربری ادمین جدید برای ${fullName} با نقش ${newAdmin.roleTitle} و سطح دسترسی ${permissionLevel || 'write'}`,
      ipAddress: 'server-verified',
      status: 'success'
    });

    return newAdmin;
  }

  /**
   * Check if current logged in admin has write permission
   */
  hasWritePermission(): boolean {
    const admin = this.getCurrentAdmin();
    if (!admin) return false;
    if (admin.role === 'super_admin') return true;
    return admin.permissionLevel === 'write' || admin.permissionLevel === 'delete';
  }

  /**
   * Check if current logged in admin has delete permission
   */
  hasDeletePermission(): boolean {
    const admin = this.getCurrentAdmin();
    if (!admin) return false;
    if (admin.role === 'super_admin') return true;
    return admin.permissionLevel === 'delete';
  }

  /**
   * Toggle admin active status
   */
  toggleAdminStatus(adminId: string, performerAdmin: AdminAccount): boolean {
    const accounts = this.getStoredAccounts();
    const target = accounts.find(a => a.id === adminId);
    if (!target || target.role === 'super_admin') return false;

    target.status = target.status === 'active' ? 'inactive' : 'active';
    this.saveAccounts(accounts);

    adminService.recordAuditLog({
      adminEmail: performerAdmin.email,
      adminRole: performerAdmin.role,
      action: 'ADMIN_STATUS_CHANGED',
      targetType: 'role',
      targetId: target.id,
      targetName: target.fullName,
      details: `تغییر وضعیت حساب ادمین به: ${target.status === 'active' ? 'فعال' : 'غیرفعال'}`,
      ipAddress: 'server-verified',
      status: 'warning'
    });

    return true;
  }
}

export const adminAuthService = new AdminAuthService();

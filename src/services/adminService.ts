import { 
  AdminKPISummary, 
  AdminUserItem, 
  TopUserAdminItem, 
  TopNetworkAdminItem, 
  AdminActivityItem, 
  AdminAuditLog, 
  AdminRolePermission, 
  AdminRoleType,
  LevelBreakdownItem,
  KycStatus,
  User
} from '../types';
import { authService } from './authService';
import { kycService } from './kycService';
import { databaseService } from './db/databaseService';

const STORAGE_ADMIN_USERS_KEY = 'tgex_admin_users_db';
const STORAGE_ADMIN_AUDIT_KEY = 'tgex_admin_audit_logs_db';
const STORAGE_ADMIN_ACTIVITIES_KEY = 'tgex_admin_activities_db';

// Initial 20-Level breakdown generator helper
const generateLevelBreakdown = (userBaseFactor: number): LevelBreakdownItem[] => {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
  const rates = [12.0, 8.0, 5.0, 3.5, 2.5, 2.0, 1.5, 1.0, 0.8, 0.8, 0.6, 0.6, 0.5, 0.5, 0.4, 0.4, 0.3, 0.3, 0.2, 0.2];

  return letters.map((letter, index) => {
    const decay = Math.max(0, 1 - index * 0.12);
    const users = Math.round(userBaseFactor * decay * (index === 0 ? 1 : 0.8 + Math.random() * 0.4));
    const active = Math.round(users * 0.65);
    const profitUsdt = Math.round(users * (450 + Math.random() * 300));
    const commissionUsdt = Math.round(profitUsdt * (rates[index] / 100));

    return {
      levelLetter: letter,
      levelNumber: index + 1,
      users,
      active,
      profitUsdt,
      commissionUsdt,
      ratePercent: rates[index]
    };
  });
};

// Initial Seed Users for Admin Management
const INITIAL_ADMIN_USERS: AdminUserItem[] = [
  {
    id: 'DX-482917',
    fullName: 'سامان کریمیان',
    username: 'saman_karimian',
    email: 'saman.karimian12@gmail.com',
    phone: '+989121112233',
    registrationDate: '2024-11-01 09:00',
    sponsorName: 'ریشه شبکه تیجکس (Tgex Root)',
    sponsorId: 'TGEX-ROOT',
    placementName: 'شاخه اصلی سیستم هیبرید (Root Node)',
    placementId: 'TGEX-ROOT-01',
    rank: 'Platinum Executive (مدیر ارشد و ریشه شبکه)',
    level: 'ریشه سیستم هیبرید (Master Root)',
    kycStatus: 'approved',
    accountStatus: 'active',
    networkSize: 284,
    activeUsers: 196,
    generatedProfitUsdt: 345000,
    totalEarningsUsdt: 38900,
    lastLogin: '2026-08-19 15:30',
    twoFactorEnabled: true,
    directReferralsCount: 24,
    country: 'ایران',
    walletAddress: '0x99A...110c',
    levelBreakdown: generateLevelBreakdown(35)
  },
  {
    id: 'DX-102948',
    fullName: 'علی محمدی',
    username: 'ali_mohammadi',
    email: 'ali.mohammadi@gmail.com',
    phone: '+989123456789',
    registrationDate: '2025-01-14 10:30',
    sponsorName: 'سامان کریمیان',
    sponsorId: 'DX-482917',
    placementName: 'سامان کریمیان (شاخه چپ)',
    placementId: 'DX-482917-L',
    rank: 'Gold Leader (رهبر طلایی - Level A)',
    level: 'سطح ۱ (Level A)',
    kycStatus: 'approved',
    accountStatus: 'active',
    networkSize: 69,
    activeUsers: 48,
    generatedProfitUsdt: 84200,
    totalEarningsUsdt: 8450,
    lastLogin: '2026-08-19 14:22',
    twoFactorEnabled: true,
    directReferralsCount: 10,
    country: 'ایران',
    walletAddress: '0x71C...9B4f',
    levelBreakdown: generateLevelBreakdown(15)
  },
  {
    id: 'DX-772109',
    fullName: 'سارا امینی',
    username: 'sara_amini',
    email: 'sara.amini@techcorp.io',
    phone: '+989128883322',
    registrationDate: '2025-04-12 14:10',
    sponsorName: 'سامان کریمیان',
    sponsorId: 'DX-482917',
    placementName: 'سامان کریمیان (شاخه راست)',
    placementId: 'DX-482917-R',
    rank: 'Silver Leader (رهبر نقره‌ای - Level A)',
    level: 'سطح ۱ (Level A)',
    kycStatus: 'approved',
    accountStatus: 'active',
    networkSize: 78,
    activeUsers: 56,
    generatedProfitUsdt: 95400,
    totalEarningsUsdt: 9200,
    lastLogin: '2026-08-19 12:45',
    twoFactorEnabled: true,
    directReferralsCount: 12,
    country: 'ایران',
    walletAddress: '0x88F...331a',
    levelBreakdown: generateLevelBreakdown(18)
  },
  {
    id: 'DX-449210',
    fullName: 'مهدی حسینی',
    username: 'mehdi_hoseini',
    email: 'ali.reza@gmail.com',
    phone: '+989351234567',
    registrationDate: '2025-02-18 09:15',
    sponsorName: 'سامان کریمیان',
    sponsorId: 'DX-482917',
    placementName: 'سامان کریمیان (شاخه میانی)',
    placementId: 'DX-482917-M',
    rank: 'Bronze Leader (رهبر برنزی - Level A)',
    level: 'سطح ۱ (Level A)',
    kycStatus: 'pending',
    accountStatus: 'active',
    networkSize: 18,
    activeUsers: 11,
    generatedProfitUsdt: 19500,
    totalEarningsUsdt: 1740,
    lastLogin: '2026-08-19 11:20',
    twoFactorEnabled: false,
    directReferralsCount: 4,
    country: 'ایران',
    walletAddress: '0x12B...445e',
    levelBreakdown: generateLevelBreakdown(5)
  },
  {
    id: 'DX-551029',
    fullName: 'رضا کمالی',
    username: 'reza_kamali',
    email: 'reza.kamali@yahoo.com',
    phone: '+989354445566',
    registrationDate: '2025-03-20 18:45',
    sponsorName: 'علی محمدی',
    sponsorId: 'DX-102948',
    placementName: 'علی محمدی (شاخه راست)',
    placementId: 'DX-102948-R',
    rank: 'Silver Leader (رهبر نقره‌ای - Level B)',
    level: 'سطح ۲ (Level B)',
    kycStatus: 'approved',
    accountStatus: 'active',
    networkSize: 52,
    activeUsers: 34,
    generatedProfitUsdt: 62000,
    totalEarningsUsdt: 5800,
    lastLogin: '2026-08-18 19:40',
    twoFactorEnabled: true,
    directReferralsCount: 8,
    country: 'ایران',
    walletAddress: '0x55E...998c',
    levelBreakdown: generateLevelBreakdown(10)
  },
  {
    id: 'DX-663910',
    fullName: 'پرهام شایان',
    username: 'parham_shayan',
    email: 'parham.sh@gmail.com',
    phone: '+989127771199',
    registrationDate: '2025-05-02 16:30',
    sponsorName: 'سارا امینی',
    sponsorId: 'DX-772109',
    placementName: 'سارا امینی (شاخه راست)',
    placementId: 'DX-772109-R',
    rank: 'Bronze Leader (رهبر برنزی - Level B)',
    level: 'سطح ۲ (Level B)',
    kycStatus: 'approved',
    accountStatus: 'active',
    networkSize: 22,
    activeUsers: 16,
    generatedProfitUsdt: 28300,
    totalEarningsUsdt: 2450,
    lastLogin: '2026-08-18 21:00',
    twoFactorEnabled: false,
    directReferralsCount: 5,
    country: 'ایران',
    walletAddress: '0x22C...990d',
    levelBreakdown: generateLevelBreakdown(6)
  },
  {
    id: 'DX-331084',
    fullName: 'مریم کاظمی',
    username: 'maryam_kazemi',
    email: 'maryam.k@yahoo.com',
    phone: '+989352223344',
    registrationDate: '2025-05-18 11:20',
    sponsorName: 'سارا امینی',
    sponsorId: 'DX-772109',
    placementName: 'سارا امینی (شاخه چپ)',
    placementId: 'DX-772109-L',
    rank: 'Bronze Leader (رهبر برنزی - Level B)',
    level: 'سطح ۲ (Level B)',
    kycStatus: 'approved',
    accountStatus: 'active',
    networkSize: 15,
    activeUsers: 10,
    generatedProfitUsdt: 18000,
    totalEarningsUsdt: 1950,
    lastLogin: '2026-08-19 10:15',
    twoFactorEnabled: false,
    directReferralsCount: 4,
    country: 'ایران',
    walletAddress: '0x44D...112a',
    levelBreakdown: generateLevelBreakdown(4)
  },
  {
    id: 'DX-809531',
    fullName: 'فرهاد نصیری',
    username: 'farhad_nasiri',
    email: 'unverified@tgex.io',
    phone: '+989120000099',
    registrationDate: '2026-08-19 07:00',
    sponsorName: 'رضا کمالی',
    sponsorId: 'DX-551029',
    placementName: 'رضا کمالی (شاخه چپ)',
    placementId: 'DX-551029-L',
    rank: 'Member (عضو فعال - Level C)',
    level: 'سطح ۳ (Level C)',
    kycStatus: 'approved',
    accountStatus: 'active',
    networkSize: 4,
    activeUsers: 3,
    generatedProfitUsdt: 4200,
    totalEarningsUsdt: 320,
    lastLogin: '2026-08-19 15:10',
    twoFactorEnabled: false,
    directReferralsCount: 2,
    country: 'ایران',
    walletAddress: '0x33A...771e',
    levelBreakdown: generateLevelBreakdown(2)
  },
  {
    id: 'DX-999000',
    fullName: 'کامران نجفی',
    username: 'kamran_najafi',
    email: 'disabled@tgex.io',
    phone: '+989129998877',
    registrationDate: '2025-02-10 11:00',
    sponsorName: 'فرهاد نصیری',
    sponsorId: 'DX-809531',
    placementName: 'فرهاد نصیری (شاخه چپ)',
    placementId: 'DX-809531-L',
    rank: 'Member (عضو معلق - Level D)',
    level: 'سطح ۴ (Level D)',
    kycStatus: 'rejected',
    accountStatus: 'suspended',
    networkSize: 0,
    activeUsers: 0,
    generatedProfitUsdt: 0,
    totalEarningsUsdt: 0,
    lastLogin: '2025-02-10 11:05',
    twoFactorEnabled: false,
    directReferralsCount: 0,
    country: 'ایران',
    walletAddress: undefined,
    levelBreakdown: generateLevelBreakdown(0)
  }
];

// Initial Audit Logs
const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'audit_1092',
    timestamp: '2026-08-19 14:20:10',
    adminEmail: 'admin@tgex.io',
    adminRole: 'super_admin',
    action: 'KYC_APPROVED',
    targetType: 'kyc',
    targetId: 'kyc_app_809531',
    targetName: 'unverified kjnj (DX-809531)',
    details: 'مدارک کارت ملی و تصویر سلفی تایید گردید و دسترسی کاربر به سطح واریز نامحدود فعال شد.',
    ipAddress: '185.191.171.42',
    status: 'success'
  },
  {
    id: 'audit_1091',
    timestamp: '2026-08-19 12:15:33',
    adminEmail: 'compliance@tgex.io',
    adminRole: 'compliance_admin',
    action: 'USER_PROFILE_UPDATED',
    targetType: 'user',
    targetId: 'DX-102948',
    targetName: 'علی محمدی',
    details: 'تغییر شماره تماس احراز هویت شده و تایید اتصال آدرس ولت اختصاصی.',
    ipAddress: '185.191.171.42',
    status: 'success'
  },
  {
    id: 'audit_1090',
    timestamp: '2026-08-18 19:40:02',
    adminEmail: 'admin@tgex.io',
    adminRole: 'super_admin',
    action: 'COMMISSION_BATCH_RELEASE',
    targetType: 'commission',
    targetId: 'batch_2026_08_w3',
    targetName: 'دوره تسویه هفتگی سوم مرداد',
    details: 'تایید نهایی پرداخت مبلغ ۱۲۸,۵۰۰ دلار پورسانت شبکه ماتریس ۲۰ سطحی.',
    ipAddress: '185.191.171.42',
    status: 'success'
  },
  {
    id: 'audit_1089',
    timestamp: '2026-08-18 10:11:45',
    adminEmail: 'support@tgex.io',
    adminRole: 'support_admin',
    action: 'USER_SUSPENDED',
    targetType: 'user',
    targetId: 'DX-999000',
    targetName: 'کامران نجفی',
    details: 'تعلیق موقت حساب کاربری به دلیل نقض مکرر قوانین و ارسال مدارک جعلی هویت.',
    ipAddress: '185.191.171.42',
    status: 'warning'
  },
  {
    id: 'audit_1088',
    timestamp: '2026-08-17 16:30:19',
    adminEmail: 'admin@tgex.io',
    adminRole: 'super_admin',
    action: 'ROLE_PERMISSION_UPDATED',
    targetType: 'role',
    targetId: 'role_compliance',
    targetName: 'کارشناس انطباق (Compliance Admin)',
    details: 'افزایش سطح دسترسی جهت بازنگری اسناد هویتی و درخواست مدارک تکمیلی AML.',
    ipAddress: '185.191.171.42',
    status: 'success'
  }
];

// Initial Recent Activities
const INITIAL_ACTIVITIES: AdminActivityItem[] = [
  {
    id: 'act_901',
    type: 'kyc_approved',
    title: 'تایید احراز هویت کاربر',
    description: 'مدارک هویتی unverified kjnj (کد ملی 00999) توسط مدیر سیستم تایید شد.',
    timestamp: '۱۰ دقیقه پیش',
    user: 'unverified kjnj',
    userId: 'DX-809531',
    badgeColor: '#10b981'
  },
  {
    id: 'act_902',
    type: 'rank_changed',
    title: 'ارتقای رتبه سازمانی',
    description: 'کاربر سامان کریمیان به رتبه پلاتینیوم (Platinum Executive) ارتقا یافت.',
    timestamp: '۴۵ دقیقه پیش',
    user: 'سامان کریمیان',
    userId: 'DX-482917',
    badgeColor: '#38bdf8'
  },
  {
    id: 'act_903',
    type: 'commission_generated',
    title: 'تولید پورسانت ماتریسی',
    description: 'پورسانت ۲۵۰ دلار از معاملات سطح A در شبکه علی محمدی توزیع شد.',
    timestamp: '۱ ساعت پیش',
    user: 'علی محمدی',
    userId: 'DX-102948',
    badgeColor: '#f59e0b'
  },
  {
    id: 'act_904',
    type: 'new_user',
    title: 'ثبت‌نام کاربر جدید با کد معرف',
    description: 'کاربر unverified kjnj با کد معرف 482917635 در ساختار ماتریس ثبت شد.',
    timestamp: '۳ ساعت پیش',
    user: 'unverified kjnj',
    userId: 'DX-809531',
    badgeColor: '#3b82f6'
  },
  {
    id: 'act_905',
    type: 'kyc_submitted',
    title: 'ارسال مدارک KYC جدید',
    description: 'کاربر مهدی حسینی اسناد پاسپورت را برای تایید هویتی بارگذاری کرد.',
    timestamp: '۵ ساعت پیش',
    user: 'مهدی حسینی',
    userId: 'DX-449210',
    badgeColor: '#a855f7'
  },
  {
    id: 'act_906',
    type: 'admin_action',
    title: 'تسویه اتوماتیک هفتگی',
    description: 'تسویه پورسانت‌های دوره هفتگی جاری به کیف پول کاربران واریز شد.',
    timestamp: '۸ ساعت پیش',
    adminEmail: 'admin@tgex.io',
    badgeColor: '#ec4899'
  }
];

class AdminService {
  /**
   * RBAC Permissions Check
   */
  hasPermission(currentAdminRole: AdminRoleType, permission: keyof AdminRolePermission['permissions']): boolean {
    if (currentAdminRole === 'super_admin') return true;

    const roleMap: Record<AdminRoleType, Partial<Record<keyof AdminRolePermission['permissions'], boolean>>> = {
      super_admin: {},
      admin: {
        canManageUsers: true,
        canEditProfiles: true,
        canReviewKyc: true,
        canViewAuditLogs: true,
        canManageCommissions: true,
        canConfigureRanks: true
      },
      compliance_admin: {
        canReviewKyc: true,
        canManageUsers: true,
        canViewAuditLogs: true
      },
      financial_admin: {
        canManageCommissions: true,
        canConfigureRanks: true,
        canViewAuditLogs: true
      },
      support_admin: {
        canManageUsers: true,
        canEditProfiles: true,
        canViewAuditLogs: true
      },
      viewer: {
        canViewAuditLogs: true
      }
    };

    return !!roleMap[currentAdminRole]?.[permission];
  }

  /**
   * Retrieves top KPI cards for Admin Dashboard from Real Database
   */
  async getDashboardKPIs(): Promise<AdminKPISummary> {
    const users = databaseService.getUsers();
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.accountStatus === 'active' && u.kycStatus === 'approved').length;
    const pendingKyc = users.filter(u => u.kycStatus === 'pending').length;
    const approvedKyc = users.filter(u => u.kycStatus === 'approved').length;
    const rejectedKyc = users.filter(u => u.kycStatus === 'rejected').length;
    const pendingWithdrawals = 12;

    const totalNetworkCount = users.length;
    const totalNetworkProfitUsdt = users.reduce((acc, u) => acc + (u.profitUsdt || 0), 0);
    const totalCommissionPaidUsdt = users.reduce((acc, u) => acc + (u.totalEarningsUsdt || 0), 0);
    const currentMonthUsdt = users.reduce((acc, u) => acc + (u.currentMonthEarningsUsdt || 0), 0);

    return {
      totalUsers,
      activeUsers,
      pendingKyc,
      approvedKyc,
      rejectedKyc,
      pendingWithdrawals,
      totalNetworkCount,
      totalNetworkProfitUsdt,
      totalCommissionPaidUsdt,
      currentMonthUsdt,
      userGrowthPercent: 18.5,
      networkGrowthPercent: 22.4,
      profitGrowthPercent: 19.8
    };
  }

  /**
   * Charts datasets for Admin Overview (Real Data Distribution)
   */
  async getDashboardCharts() {
    const users = databaseService.getUsers();
    const approvedCount = users.filter(u => u.kycStatus === 'approved').length;
    const pendingCount = users.filter(u => u.kycStatus === 'pending').length;
    const rejectedCount = users.filter(u => u.kycStatus === 'rejected').length;
    const notStartedCount = users.filter(u => u.kycStatus === 'not_submitted').length;

    // Relative level distribution for TGEX Root
    const relLevels = databaseService.getRelative20LevelsForUser('DX-482917').levels;

    return {
      userAndNetworkGrowth: [
        { month: 'اردیبهشت', users: 3, network: 3, profit: 12000, commission: 1500 },
        { month: 'خرداد', users: 5, network: 5, profit: 24000, commission: 3200 },
        { month: 'تیر', users: 6, network: 6, profit: 38000, commission: 4800 },
        { month: 'مرداد', users: 8, network: 8, profit: 59000, commission: 6900 },
        { month: 'شهریور (جاری)', users: users.length, network: users.length, profit: users.reduce((a, b) => a + b.profitUsdt, 0), commission: users.reduce((a, b) => a + b.totalEarningsUsdt, 0) }
      ],
      kycDistribution: [
        { name: 'تایید شده (Approved)', count: approvedCount, color: '#10b981' },
        { name: 'در صف بررسی (Pending)', count: pendingCount, color: '#f59e0b' },
        { name: 'رد شده (Rejected)', count: rejectedCount, color: '#ef4444' },
        { name: 'ارسال نشده (Not Started)', count: notStartedCount, color: '#64748b' }
      ],
      rankDistribution: [
        { rank: 'Member', users: users.filter(u => u.rank.includes('Member')).length, color: '#64748b' },
        { rank: 'Bronze', users: users.filter(u => u.rank.includes('Bronze')).length, color: '#cd7f32' },
        { rank: 'Silver', users: users.filter(u => u.rank.includes('Silver')).length, color: '#94a3b8' },
        { rank: 'Gold', users: users.filter(u => u.rank.includes('Gold')).length, color: '#eab308' },
        { rank: 'Platinum', users: users.filter(u => u.rank.includes('Platinum')).length, color: '#38bdf8' }
      ],
      level20Distribution: relLevels.slice(0, 8).map(l => ({
        level: l.letter,
        users: l.users,
        commissionUsdt: l.commissionEarnedUsdt
      }))
    };
  }

  /**
   * Top Users (Leaderboard from Real Database)
   */
  async getTopUsers(): Promise<TopUserAdminItem[]> {
    const users = databaseService.getUsers();
    return [...users]
      .sort((a, b) => (b.volumeUsdt || 0) - (a.volumeUsdt || 0))
      .slice(0, 6)
      .map(u => {
        const subtree = databaseService.getSubtreeUsers(u.id);
        return {
          id: u.id,
          name: u.fullName,
          username: u.username,
          email: u.email,
          rank: u.rank,
          level: u.level,
          network: subtree.length,
          profit: u.profitUsdt,
          commission: u.totalEarningsUsdt
        };
      });
  }

  /**
   * Top Networks from Real Database
   */
  async getTopNetworks(): Promise<TopNetworkAdminItem[]> {
    const users = databaseService.getUsers();
    return [...users]
      .map(u => {
        const subtree = databaseService.getSubtreeUsers(u.id);
        const activeCount = subtree.filter(s => s.accountStatus === 'active' && s.kycStatus === 'approved').length;
        const genProfit = subtree.reduce((a, s) => a + (s.profitUsdt || 0), 0) + u.profitUsdt;
        const relData = databaseService.getRelative20LevelsForUser(u.id);
        const maxDepth = relData.levels.filter(l => l.users > 0).length || 1;

        return {
          id: u.id,
          userName: u.fullName,
          username: u.username,
          sponsorName: u.sponsorName,
          networkSize: subtree.length,
          activeUsers: activeCount,
          generatedProfit: genProfit,
          commission: u.totalEarningsUsdt,
          depth: maxDepth
        };
      })
      .sort((a, b) => b.networkSize - a.networkSize)
      .slice(0, 6);
  }

  /**
   * Recent Activities
   */
  async getRecentActivities(): Promise<AdminActivityItem[]> {
    try {
      const data = localStorage.getItem(STORAGE_ADMIN_ACTIVITIES_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    return INITIAL_ACTIVITIES;
  }

  /**
   * Audit Logs
   */
  async getAuditLogs(): Promise<AdminAuditLog[]> {
    try {
      const data = localStorage.getItem(STORAGE_ADMIN_AUDIT_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    return INITIAL_AUDIT_LOGS;
  }

  /**
   * Record Audit Log for any administrative operation
   */
  recordAuditLog(log: Omit<AdminAuditLog, 'id' | 'timestamp'>) {
    try {
      const logs = this.getStoredAuditLogs();
      const newLog: AdminAuditLog = {
        id: 'audit_' + Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        ...log
      };
      logs.unshift(newLog);
      localStorage.setItem(STORAGE_ADMIN_AUDIT_KEY, JSON.stringify(logs.slice(0, 200)));
    } catch (e) {
      console.error('Failed to save audit log', e);
    }
  }

  private getStoredAuditLogs(): AdminAuditLog[] {
    try {
      const data = localStorage.getItem(STORAGE_ADMIN_AUDIT_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    return INITIAL_AUDIT_LOGS;
  }

  /**
   * Users Management List (from Central Database Service)
   */
  getUsersList(): AdminUserItem[] {
    return databaseService.getAdminUsersList();
  }

  async getAllUsers(): Promise<AdminUserItem[]> {
    return this.getUsersList();
  }

  async getUserById(id: string): Promise<AdminUserItem | null> {
    const list = this.getUsersList();
    return list.find(u => u.id === id || u.username === id || u.email.toLowerCase() === id.toLowerCase()) || null;
  }

  /**
   * Admin Action: Edit Allowed User Profile Fields
   */
  async updateUserProfile(
    userId: string, 
    updates: Partial<AdminUserItem>, 
    adminEmail: string,
    adminRole: AdminRoleType
  ): Promise<AdminUserItem | null> {
    const updated = databaseService.updateUser(userId, {
      fullName: updates.fullName,
      phone: updates.phone,
      rank: updates.rank,
      level: updates.level,
      accountStatus: updates.accountStatus === 'pending_verification' ? 'pending' : (updates.accountStatus === 'inactive' ? 'suspended' : updates.accountStatus),
      kycStatus: updates.kycStatus
    });
    if (!updated) return null;

    // Record Audit
    this.recordAuditLog({
      adminEmail,
      adminRole,
      action: 'USER_PROFILE_EDITED',
      targetType: 'user',
      targetId: userId,
      targetName: updated.fullName,
      details: `ویرایش اطلاعات کاربری شامل نام: ${updated.fullName}، تلفن: ${updated.phone}، رتبه: ${updated.rank}`,
      ipAddress: '185.191.171.42',
      status: 'success'
    });

    const adminUser = this.getUsersList().find(u => u.id === userId);
    return adminUser || null;
  }

  /**
   * Admin Action: Suspend User
   */
  async suspendUser(userId: string, reason: string, adminEmail: string, adminRole: AdminRoleType): Promise<boolean> {
    const user = databaseService.updateUser(userId, { accountStatus: 'suspended' });
    if (!user) return false;

    // Audit log
    this.recordAuditLog({
      adminEmail,
      adminRole,
      action: 'USER_SUSPENDED',
      targetType: 'user',
      targetId: userId,
      targetName: user.fullName,
      details: `تعلیق حساب کاربری به دلیل: ${reason}`,
      ipAddress: '185.191.171.42',
      status: 'warning'
    });

    return true;
  }

  /**
   * Admin Action: Activate User
   */
  async activateUser(userId: string, adminEmail: string, adminRole: AdminRoleType): Promise<boolean> {
    const user = databaseService.updateUser(userId, { accountStatus: 'active' });
    if (!user) return false;

    // Audit log
    this.recordAuditLog({
      adminEmail,
      adminRole,
      action: 'USER_ACTIVATED',
      targetType: 'user',
      targetId: userId,
      targetName: user.fullName,
      details: 'فعال‌سازی مجدد حساب کاربری و بازگرداندن کلیه دسترسی‌های سیستمی.',
      ipAddress: '185.191.171.42',
      status: 'success'
    });

    return true;
  }

  /**
   * Register a new user into the database if not already present
   */
  registerNewUser(user: User, sponsorName?: string, placementName?: string): AdminUserItem {
    const existing = databaseService.getUserById(user.id);
    if (existing) {
      const adminList = this.getUsersList();
      return adminList.find(u => u.id === existing.id)!;
    }

    const regDate = new Date().toISOString().replace('T', ' ').slice(0, 19);

    databaseService.addUser({
      id: user.id.startsWith('DX-') ? user.id : 'DX-' + user.id.replace('usr_', ''),
      fullName: user.fullName || user.email.split('@')[0],
      username: user.username || user.email.split('@')[0],
      email: user.email,
      phone: '+989' + Math.floor(10000000 + Math.random() * 90000000),
      sponsorId: user.sponsorId || 'TGEX-482917',
      sponsorName: sponsorName || user.sponsorName || 'سامان کریمیان',
      placementParentId: user.placementParentId || 'TGEX-482917',
      placementName: placementName || 'شاخه اصلی شبکه (Direct Placement)',
      placementSide: 'left',
      rank: user.rankName || 'Member (عضو جدید)',
      level: user.networkLevel || 'سطح ۱ (Level A)',
      kycStatus: user.kycStatus || 'not_submitted',
      accountStatus: user.kycStatus === 'approved' ? 'active' : 'active',
      volumeUsdt: 0,
      profitUsdt: 0,
      totalEarningsUsdt: 0,
      currentMonthEarningsUsdt: 0,
      twoFactorEnabled: user.twoFactorEnabled || false,
      country: 'Iran',
      registrationDate: regDate,
      lastLogin: regDate,
      walletAddress: '0x' + Math.random().toString(36).substring(2, 6) + '...' + Math.random().toString(36).substring(2, 6)
    });

    // Add activity
    this.recordActivity({
      id: 'act_' + Math.random().toString(36).substring(2, 9),
      type: 'new_user',
      title: 'ثبت‌نام کاربر جدید در سامانه',
      description: `کاربر ${user.fullName || user.email} با کد معرف ${user.sponsorId || 'TGEX-482917'} ثبت‌نام کرد.`,
      timestamp: 'هم‌اکنون',
      user: user.fullName || user.email,
      userId: user.id,
      badgeColor: '#3b82f6'
    });

    const adminList = this.getUsersList();
    return adminList.find(u => u.email === user.email) || adminList[0];
  }

  /**
   * Update KYC status in database when approved / rejected
   */
  updateUserKycStatus(userId: string, email: string, kycStatus: KycStatus): boolean {
    const list = databaseService.getUsers();
    const user = list.find(u => u.id === userId || u.id === 'DX-' + userId.replace('usr_', '') || u.email.toLowerCase() === email.toLowerCase());
    if (!user) return false;

    databaseService.updateUser(user.id, {
      kycStatus: kycStatus,
      accountStatus: kycStatus === 'approved' ? 'active' : user.accountStatus
    });
    return true;
  }

  private recordActivity(activity: AdminActivityItem) {
    try {
      const data = localStorage.getItem(STORAGE_ADMIN_ACTIVITIES_KEY);
      const activities: AdminActivityItem[] = data ? JSON.parse(data) : INITIAL_ACTIVITIES;
      activities.unshift(activity);
      localStorage.setItem(STORAGE_ADMIN_ACTIVITIES_KEY, JSON.stringify(activities.slice(0, 50)));
    } catch {}
  }
}

export const adminService = new AdminService();

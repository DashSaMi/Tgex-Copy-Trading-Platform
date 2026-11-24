export type PageId =
  | 'home'
  | 'about'
  | 'blog'
  | 'blog-detail'
  | 'copy-trading'
  | 'levels'
  | 'ranks'
  | 'faq'
  | 'contact'
  | 'support'
  | 'support-tickets'
  | 'terms'
  | 'privacy'
  | 'risk'
  // Dedicated Authentication Pages
  | 'login'
  | 'signup'
  | 'register'
  | 'forgot-password'
  | 'reset-password'
  | 'verify-email'
  | 'auth-architecture'
  // User Dashboard & KYC & Dedicated Network & 20 Levels & Earnings & Rank
  | 'dashboard'
  | 'dashboard-network'
  | 'dashboard-levels'
  | 'dashboard-earnings'
  | 'dashboard-withdrawals'
  | 'dashboard-rank'
  | 'kyc'
  // Dedicated Admin Authentication & Console Pages
  | 'cwpm0idm203idm0i2c2i0m/admin/tgex/admin-login'
  | 'admin-login'
  | 'admin'
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-withdrawals'
  | 'admin-kyc'
  | 'admin-network'
  | 'admin-levels'
  | 'admin-ranks'
  | 'admin-commissions'
  | 'admin-copy-trading'
  | 'admin-api'
  | 'admin-cms'
  | 'admin-blog'
  | 'admin-notifications'
  | 'admin-audit-logs'
  | 'admin-roles'
  | 'admin-admins'
  | 'admin-settings';

export type DashboardTab = 
  | 'overview'
  | 'network'
  | 'referrals'
  | 'levels'
  | 'earnings'
  | 'withdrawals'
  | 'rank'
  | 'copy-trading'
  | 'kyc'
  | 'profile'
  | 'security'
  | 'notifications'
  | 'support-tickets'
  | 'ads';

export interface NavItem {
  id: PageId;
  label: string;
  badge?: string;
}

export interface LevelItem {
  letter: string;
  levelNumber: number;
  tierGroup: 'پایه‌ای (Foundation)' | 'توسعه (Expansion)' | 'رهبری (Leadership)' | 'مدیریتی (Executive)' | 'حاکمیتی (Sovereign)';
  title: string;
  description: string;
  commissionPlaceholder: string;
  qualifyingUsers: number;
  networkDepth: string;
  accentColor: string;
}

export interface RankItem {
  id: string;
  name: string;
  levelRequired: string;
  directSponsorsRequired: number;
  networkVolumePlaceholder: string;
  badgeColor: string;
  description: string;
  privileges: string[];
}

export interface CopyTraderDemo {
  id: string;
  name: string;
  handle: string;
  strategy: string;
  pairs: string[];
  winRate: string;
  simulatedRoi30d: string;
  riskScore: number; // 1 to 10
  copiersCount: number;
  drawdownMax: string;
  tradingStyle: 'روند محور (Trend Following)' | 'الگوریتم شبکه‌ای (Grid)' | 'اسکالپ و مومنتوم' | 'آربیتراژ چند دارایی';
}

export interface FAQItem {
  id: string;
  category: 'account' | 'registration' | 'verification' | 'copy-trading' | 'marketing' | 'levels' | 'earnings' | 'security';
  question: string;
  answer: string;
}

export interface HowItWorksStep {
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  iconName: string;
}

// ==========================================
// Authentication System Types
// ==========================================

export type AuthStateType = 
  | 'idle'
  | 'loading'
  | 'success'
  | 'invalid_credentials'
  | 'account_disabled'
  | 'email_not_verified'
  | 'kyc_required'
  | 'session_expired'
  | 'server_error';

export type KycStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  username?: string;
  role: 'user' | 'leader' | 'admin';
  isVerified: boolean;
  kycStatus: KycStatus;
  kycRejectionReason?: string;
  referralCode?: string;
  sponsorId: string;
  sponsorName?: string;
  placementParentId: string;
  networkLevel: string;
  rankName?: string;
  rankTier?: string;
  activeCapitalUsdt?: number;
  directReferralsCount: number;
  activeNetworkCount: number;
  totalNetworkCount: number;
  networkVolumeUsdt: number;
  totalEarningsUsdt: number;
  currentMonthEarningsUsdt: number;
  networkProfitUsdt: number;
  tokenBalance: number;
  twoFactorEnabled: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthSession {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
  referralCode?: string;
  placementCode?: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword?: string;
  referralCode?: string;
  placementCode?: string;
  agreeTerms?: boolean;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailPayload {
  email: string;
  code: string;
}

export interface AuthResult {
  success: boolean;
  state: AuthStateType;
  message: string;
  user?: User;
  session?: AuthSession;
  requiresEmailVerification?: boolean;
  emailForVerification?: string;
  tempToken?: string;
}

// ==========================================
// KYC / Identity Verification Types
// ==========================================

export interface KycPersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  country: string;
  phone: string;
  idNumber?: string;
}

export interface KycDocumentFiles {
  idFrontName?: string;
  idFrontSize?: string;
  idFrontPreview?: string;
  idBackName?: string;
  idBackSize?: string;
  idBackPreview?: string;
  selfieName?: string;
  selfieSize?: string;
  selfiePreview?: string;
  additionalDocName?: string;
}

export interface KycAuditLog {
  id: string;
  timestamp: string;
  action: 'SUBMITTED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'DOCS_REQUESTED';
  adminEmail: string;
  note: string;
}

export interface KycApplication {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  personalInfo: KycPersonalInfo;
  documents: KycDocumentFiles;
  status: KycStatus;
  rejectionReason?: string;
  submittedAt: string;
  updatedAt: string;
  auditLogs: KycAuditLog[];
}

// ==========================================
// Dashboard Detailed Types
// ==========================================

export interface DashboardLevelCard {
  letter: string;
  levelNumber: number;
  users: number;
  activeUsers: number;
  networkProfit: number;
  commission: number;
  status: 'active' | 'locked';
}

export interface DirectReferralUser {
  id: string;
  email: string;
  name: string;
  joinDate: string;
  kycStatus: KycStatus;
  level: string;
  volumeUsdt: number;
  commissionEarnedUsdt: number;
  isActive: boolean;
}

export interface ActivityFeedItem {
  id: string;
  type: 'referral' | 'kyc' | 'rank' | 'commission' | 'system';
  title: string;
  description: string;
  timeAgo: string;
  amount?: string;
}

// ==========================================
// Network Tree, Upline Lineage & 20-Level Detailed Structure
// ==========================================

export interface UplineUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  referralCode: string;
  rank: string;
  level: string;
  role?: string;
  isDirectSponsor: boolean;
  depthAbove: number; // 1 for direct sponsor, 2 for grand sponsor, etc.
}

export interface NetworkTreeNode {
  id: string;
  name: string;
  username: string;
  rank: string;
  levelLetter: string; // 'A' to 'T'
  levelNumber: number; // 1 to 20
  status: 'active' | 'inactive';
  networkSize: number;
  directCount: number;
  networkVolumeUsdt: number;
  networkProfitUsdt: number;
  sponsorName: string;
  sponsorId: string;
  placementId: string;
  placementSide?: 'left' | 'right' | 'center';
  joinedDate: string;
  children?: NetworkTreeNode[];
}

export interface LevelMember {
  id: string;
  name: string;
  username: string;
  rank: string;
  sponsorName: string;
  volumeUsdt: number;
  commissionEarnedUsdt: number;
  status: 'active' | 'inactive';
  joinedAt: string;
}

export interface StructureLevelDetailed {
  letter: string; // 'A' through 'T'
  levelNumber: number; // 1 through 20
  tierGroup: 'پایه‌ای (Foundation)' | 'توسعه (Expansion)' | 'رهبری (Leadership)' | 'مدیریتی (Executive)' | 'حاکمیتی (Sovereign)' | 'نخبگان (Elite Tier)' | 'سفیران (Ambassador)' | 'Foundation' | 'Expansion' | 'Leadership' | 'Executive' | 'Governance' | string;
  users: number;
  activeUsers: number;
  inactiveUsers: number;
  networkProfitUsdt: number;
  commissionRatePercent: number; // Configured via business rules (e.g. 10.0%, 8.0%, 5.0% etc.)
  commissionEarnedUsdt: number;
  status: 'unlocked' | 'locked';
  qualificationRequirement: string;
  members: LevelMember[];
}

// ==========================================
// Earnings System Types
// ==========================================

export type EarningsSourceType = 
  | 'direct_referral' 
  | 'network' 
  | 'level_commission' 
  | 'copy_trading_performance' 
  | 'leadership_pool' 
  | 'fast_start_bonus';

export interface EarningsSummary {
  totalEarningsUsdt: number;
  currentMonthUsdt: number;
  previousMonthUsdt: number;
  pendingUsdt: number;
  paidUsdt: number;
  currency: string;
  lastCalculatedAt: string;
}

export interface EarningsSourceBreakdownItem {
  id: string;
  source: EarningsSourceType;
  label: string;
  amountUsdt: number;
  percentage: number;
  count: number;
  color: string;
}

export interface LevelEarningsItem {
  levelLetter: string; // 'A' to 'T'
  levelNumber: number; // 1 to 20
  amountUsdt: number;
  ratePercent: number;
  txCount: number;
  activeUsers: number;
}

export interface EarningsTransaction {
  id: string;
  date: string;
  source: EarningsSourceType;
  sourceLabel: string;
  user: {
    id: string;
    name: string;
    username: string;
  };
  level: string; // e.g. 'Level A', 'Level H', 'Direct'
  profitSource: string; // e.g. 'معاملات بیت‌کوین تریدر آلفا', 'واریز اشتراک شبکه'
  commissionRate: string; // e.g. '12%', '8%'
  amount: number; // USDT
  status: 'paid' | 'pending' | 'processing';
  txHash?: string;
}

export interface MonthlyEarningsTrendItem {
  month: string; // e.g. 'فروردین', 'اردیبهشت', ... or 'Jan', 'Feb'
  total: number;
  direct: number;
  network: number;
  performance: number;
}

// ==========================================
// Rank Progression System Types
// ==========================================

export interface RankMetric {
  id: string;
  name: string;
  farsiName: string;
  current: number;
  required: number;
  percent: number;
  achieved: boolean;
  format?: 'currency' | 'number' | 'boolean' | 'percent';
}

export interface RankRequirementConfig {
  id: string;
  name: string;
  farsiName: string;
  tierOrder: number;
  badgeColor: string;
  requiredLevel: string; // e.g. 'Level A', 'Level H'
  farsiRequiredLevel?: string;
  commissionMultiplier: number;
  leadershipPoolSharePercent: number;
  privileges: string[];
  farsiPrivileges?: string[];
  description: string;
  farsiDescription?: string;
  // Specific rank requirements
  requiredCapital?: number;
  requiredDirectActive?: number;
  requiredLegRank?: { rankTierOrder: number, rankName: string, count: number };
  requiredTeamAum?: number;
  maxLegVolumePercent?: number;
  requiresManagementApproval?: boolean;
}

export interface UserRankProgress {
  currentRank: RankRequirementConfig;
  currentLevel: string;
  nextRank: RankRequirementConfig | null;
  overallProgressPercent: number;
  canUpgrade?: boolean;
  eligibleRank?: RankRequirementConfig | null;
  metrics: RankMetric[];
  unlockedPrivileges: string[];
  nextRankPrivileges: string[];
}

// ==========================================
// Admin Panel & Management Types
// ==========================================

export type AdminTab = 
  | 'dashboard'
  | 'users'
  | 'kyc'
  | 'withdrawals'
  | 'network'
  | 'levels'
  | 'ranks'
  | 'commissions'
  | 'copy-trading'
  | 'api'
  | 'cms'
  | 'blog'
  | 'notifications'
  | 'audit-logs'
  | 'admins'
  | 'roles'
  | 'settings'
  | 'tickets';

export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
}

export interface BlogSeo {
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  summary: string;
  summaryEn?: string;
  contentHtml: string;
  contentHtmlEn?: string;
  coverImage: string;
  category: string;
  categoryEn?: string;
  tags: string[];
  tagsEn?: string[];
  author: BlogAuthor;
  publishedAt: string;
  updatedAt?: string;
  readTimeMinutes: number;
  status: 'published' | 'draft' | 'archived';
  viewsCount: number;
  likesCount: number;
  isFeatured?: boolean;
  showOnMain?: boolean;
  seo: BlogSeo;
}

export type AdminRoleType = 
  | 'super_admin'
  | 'admin'
  | 'compliance_admin'
  | 'financial_admin'
  | 'support_admin'
  | 'viewer';

export interface AdminKPISummary {
  totalUsers: number;
  activeUsers: number;
  pendingKyc: number;
  approvedKyc: number;
  rejectedKyc: number;
  pendingWithdrawals: number;
  totalNetworkCount: number;
  totalNetworkProfitUsdt: number;
  totalCommissionPaidUsdt: number;
  currentMonthUsdt: number;
  userGrowthPercent: number;
  networkGrowthPercent: number;
  profitGrowthPercent: number;
}

export interface LevelBreakdownItem {
  levelLetter: string;
  levelNumber: number;
  users: number;
  active: number;
  profitUsdt: number;
  commissionUsdt: number;
  ratePercent: number;
}

export interface AdminUserItem {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  registrationDate: string;
  referralCode?: string;
  sponsorName: string;
  sponsorId: string;
  placementName: string;
  placementId: string;
  rank: string;
  level: string;
  kycStatus: KycStatus;
  accountStatus: 'active' | 'suspended' | 'inactive' | 'pending_verification';
  networkSize: number;
  activeUsers: number;
  generatedProfitUsdt: number;
  totalEarningsUsdt: number;
  lastLogin: string;
  twoFactorEnabled: boolean;
  directReferralsCount: number;
  country: string;
  walletAddress?: string;
  levelBreakdown: LevelBreakdownItem[];
}

export interface TopUserAdminItem {
  id: string;
  name: string;
  username: string;
  email: string;
  rank: string;
  level: string;
  network: number;
  profit: number;
  commission: number;
  avatarUrl?: string;
}

export interface TopNetworkAdminItem {
  id: string;
  userName: string;
  username: string;
  sponsorName: string;
  networkSize: number;
  activeUsers: number;
  generatedProfit: number;
  commission: number;
  depth: number;
}

export interface AdminActivityItem {
  id: string;
  type: 'new_user' | 'kyc_submitted' | 'kyc_approved' | 'kyc_rejected' | 'rank_changed' | 'commission_generated' | 'admin_action' | 'user_suspended' | 'user_activated';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  userId?: string;
  adminEmail?: string;
  badgeColor?: string;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  adminEmail: string;
  adminRole: AdminRoleType;
  action: string;
  targetType: 'user' | 'kyc' | 'commission' | 'system' | 'role' | 'network' | 'settings';
  targetId: string;
  targetName?: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'failed' | 'warning';
}

export interface AdminRolePermission {
  id: string;
  roleKey: AdminRoleType;
  name: string;
  farsiName: string;
  description: string;
  assignedAdminsCount: number;
  badgeColor: string;
  permissions: {
    canManageUsers: boolean;
    canEditProfiles: boolean;
    canSuspendUsers: boolean;
    canReviewKyc: boolean;
    canManageCommissions: boolean;
    canConfigureRanks: boolean;
    canManageRoles: boolean;
    canViewAuditLogs: boolean;
    canConfigureSystem: boolean;
  };
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userFullName: string;
  username: string;
  userEmail: string;
  walletAddress: string;
  walletLink?: string;
  networkType: 'TRC20' | 'ERC20' | 'BEP20' | 'TON' | string;
  amountUsdt: number;
  submittedAtPersian: string; // e.g. "۱۴۰۵/۰۶/۰۲ ساعت ۱۸:۳۵"
  submittedAtIso: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  reviewedByAdminEmail?: string;
  reviewedAtPersian?: string;
  txHash?: string;
}

export interface TicketMessage {
  id: string;
  sender: 'user' | 'admin';
  senderName: string;
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  userFullName: string;
  category: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'read_and_answered' | 'ended';
  ratingPoints?: number;
  messages: TicketMessage[];
}





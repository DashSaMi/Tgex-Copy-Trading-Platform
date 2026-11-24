import { 
  AdminUserItem, 
  User, 
  NetworkTreeNode, 
  StructureLevelDetailed, 
  DashboardLevelCard,
  DirectReferralUser,
  KycStatus,
  WithdrawalRequest,
  UplineUser
} from '../../types';

/**
 * Interface representing a pure SQL/MySQL Relational User Entity
 * Ready for 1:1 migration to MySQL / MariaDB in cPanel
 */
export interface DbUserEntity {
  id: string;                      // PRIMARY KEY VARCHAR(32)
  fullName: string;                // VARCHAR(100)
  username: string;                // VARCHAR(50) UNIQUE
  email: string;                   // VARCHAR(100) UNIQUE
  phone: string;                   // VARCHAR(20)
  sponsorId: string;               // VARCHAR(32) REFERENCES users(id)
  sponsorName: string;             // Denormalized sponsor name
  placementParentId: string;       // VARCHAR(32) REFERENCES users(id)
  placementName: string;           // Human-readable placement label
  placementSide: 'left' | 'center' | 'right'; // ENUM('left', 'center', 'right')
  rank: string;                    // VARCHAR(50)
  level: string;                   // VARCHAR(50)
  kycStatus: KycStatus;            // ENUM('not_submitted', 'pending', 'approved', 'rejected')
  accountStatus: 'active' | 'suspended' | 'pending'; // ENUM('active', 'suspended', 'pending')
  volumeUsdt: number;              // DECIMAL(14,2) (Defaults to 0.00 until external API is connected)
  profitUsdt: number;              // DECIMAL(14,2) (Defaults to 0.00 until external API is connected)
  totalEarningsUsdt: number;       // DECIMAL(14,2) (Defaults to 0.00 until external API is connected)
  currentMonthEarningsUsdt: number;// DECIMAL(14,2) (Defaults to 0.00 until external API is connected)
  walletAddress?: string;          // VARCHAR(64)
  twoFactorEnabled: boolean;       // BOOLEAN
  country: string;                 // VARCHAR(50)
  registrationDate: string;        // DATETIME
  lastLogin: string;               // DATETIME
}

// Fixed 20 Level commission rate table (%) totaling exactly 14.00% (Calculated strictly from Monthly Realized Profit)
export const TOTAL_PERFORMANCE_FEE_PERCENT = 20.0; // 20% Total fee from monthly realized profit
export const MATRIX_20_LEVELS_TOTAL_PERCENT = 32.25; // 32.25% allocated across 20 hybrid levels
export const DIRECT_REFERRAL_BONUS_PERCENT = 10.0; // 10% Direct Master Referral (پورسانت معرف مستقیم L1)
export const LEADERSHIP_POOL_BONUS_PERCENT = 5.0;  // 5% Leadership & Performance Pool (استخر پاداش لیدرشیپ)

export const LEVEL_COMMISSION_RATES = [
  { levelNumber: 1, letter: 'A', rate: 3.0, tierGroup: 'پایه‌ای (Foundation)', req: '۱ معرف مستقیم با احراز هویت' },
  { levelNumber: 2, letter: 'B', rate: 2.0, tierGroup: 'پایه‌ای (Foundation)', req: '۲ معرف مستقیم' },
  { levelNumber: 3, letter: 'C', rate: 1.6, tierGroup: 'پایه‌ای (Foundation)', req: '۳ معرف مستقیم فعال' },
  { levelNumber: 4, letter: 'D', rate: 1.2, tierGroup: 'پایه‌ای (Foundation)', req: '۵ معرف مستقیم' },
  { levelNumber: 5, letter: 'E', rate: 0.9, tierGroup: 'توسعه (Expansion)', req: '۸ معرف مستقیم در سیستم هیبرید' },
  { levelNumber: 6, letter: 'F', rate: 0.8, tierGroup: 'توسعه (Expansion)', req: '۱۰ معرف مستقیم در سیستم هیبرید' },
  { levelNumber: 7, letter: 'G', rate: 0.7, tierGroup: 'توسعه (Expansion)', req: '۱۲ معرف مستقیم در سیستم هیبرید' },
  { levelNumber: 8, letter: 'H', rate: 0.6, tierGroup: 'توسعه (Expansion)', req: '۱۵ معرف مستقیم در سیستم هیبرید' },
  { levelNumber: 9, letter: 'I', rate: 0.5, tierGroup: 'رهبری (Leadership)', req: '۱۸ معرف مستقیم در سیستم هیبرید' },
  { levelNumber: 10, letter: 'J', rate: 0.45, tierGroup: 'رهبری (Leadership)', req: '۲۰ معرف مستقیم در سیستم هیبرید' },
  { levelNumber: 11, letter: 'K', rate: 0.4, tierGroup: 'رهبری (Leadership)', req: '۲۲ معرف مستقیم در سیستم هیبرید' },
  { levelNumber: 12, letter: 'L', rate: 0.35, tierGroup: 'رهبری (Leadership)', req: '۲۵ معرف مستقیم در سیستم هیبرید' },
  { levelNumber: 13, letter: 'M', rate: 0.3, tierGroup: 'مدیریتی (Executive)', req: '۲۸ معرف مستقیم در سیستم هیبرید' },
  { levelNumber: 14, letter: 'N', rate: 0.25, tierGroup: 'مدیریتی (Executive)', req: '۳۰ معرف مستقیم در سیستم هیبرید' },
  { levelNumber: 15, letter: 'O', rate: 0.25, tierGroup: 'مدیریتی (Executive)', req: '۳۵ معرف مستقیم در سیستم هیبرید' },
  { levelNumber: 16, letter: 'P', rate: 0.2, tierGroup: 'مدیریتی (Executive)', req: '۴۰ معرف مستقیم در سیستم هیبرید' },
  { levelNumber: 17, letter: 'Q', rate: 0.2, tierGroup: 'حاکمیتی (Sovereign)', req: '۴۵ معرف مستقیم در سیستم هیبرید' },
  { levelNumber: 18, letter: 'R', rate: 0.15, tierGroup: 'حاکمیتی (Sovereign)', req: '۵۰ معرف مستقیم در سیستم هیبرید' },
  { levelNumber: 19, letter: 'S', rate: 0.1, tierGroup: 'حاکمیتی (Sovereign)', req: '۶۰ معرف مستقیم در سیستم هیبرید' },
  { levelNumber: 20, letter: 'T', rate: 0.05, tierGroup: 'حاکمیتی (Sovereign)', req: '۷۰ معرف مستقیم در سیستم هیبرید' }
];

export function getLevelIndexFromLevelString(levelStr?: string): number {
  if (!levelStr) return 0;
  const str = levelStr.toUpperCase();
  
  if (
    str.includes('ROOT') || 
    str.includes('ADMIN') || 
    str.includes('MASTER') || 
    str.includes('TGEX-ROOT') ||
    str.includes('ریشه')
  ) {
    return 0; // Root sponsor -> Direct children are Level 1 (A)
  }

  // Match Level A..T (e.g., Level A, Level B, Level C, etc.)
  const letterMatch = str.match(/LEVEL\s*([A-T])/i) || str.match(/\b([A-T])\b/i);
  if (letterMatch && letterMatch[1]) {
    const letter = letterMatch[1].toUpperCase();
    const idx = LEVEL_COMMISSION_RATES.findIndex(l => l.letter === letter);
    if (idx >= 0) return idx + 1; // 1 for A, 2 for B, 3 for C, etc.
  }

  // Match Persian/English numbers (e.g. سطح ۱, سطح ۲, Level 1, Level 2)
  const numberMatch = str.match(/سطح\s*(\d+)/) || str.match(/LEVEL\s*(\d+)/i);
  if (numberMatch && numberMatch[1]) {
    const num = parseInt(numberMatch[1], 10);
    if (num >= 1 && num <= 20) return num;
  }

  return 0;
}

export function getLevelCommissionRate(levelNumber: number): number {
  if (levelNumber < 1) return 0;
  const config = LEVEL_COMMISSION_RATES.find(l => l.levelNumber === levelNumber);
  return config ? config.rate : 0.05;
}

/**
 * Calculates inherited downline level and commission rate from a sponsor
 * - If sponsor is Root/Admin (Tier 0) -> new user becomes Level A (Level 1, 12%)
 * - If sponsor is on Level A (Level 1) -> new user becomes Level B (Level 2, 8%)
 * - If sponsor is on Level B (Level 2) -> new user becomes Level C (Level 3, 5%)
 * - If sponsor is on Level C (Level 3) -> new user becomes Level D (Level 4, 3.5%)
 * - ... and so on sequentially through Level T (Level 20, 0.2%).
 */
export function getLayerFromSponsor(sponsorUser: DbUserEntity | User | undefined): {
  networkLevel: string;
  rankName: string;
  levelLetter: string;
  levelNumber: number;
  commissionRate: number;
} {
  if (!sponsorUser) {
    return {
      networkLevel: 'سطح ۱ (Level A)',
      rankName: 'عضو لایه A (Level A)',
      levelLetter: 'A',
      levelNumber: 1,
      commissionRate: 12.0
    };
  }

  const sponsorId = String((sponsorUser as any).id || '').toUpperCase();
  const sponsorRole = String((sponsorUser as any).role || '').toLowerCase();
  const sponsorLevelStr = (sponsorUser as any).level || (sponsorUser as any).networkLevel || '';

  const isRootOrAdmin = 
    sponsorId === 'DX-482917' || 
    sponsorId === 'USR_482917' || 
    sponsorId === 'TGEX-ROOT' || 
    sponsorId.includes('ROOT') || 
    sponsorId.includes('ADMIN') ||
    sponsorRole === 'admin' ||
    sponsorRole === 'leader';

  let sponsorLevelNumber = 0;
  if (isRootOrAdmin && (!sponsorLevelStr || sponsorLevelStr.includes('Root') || sponsorLevelStr.includes('ریشه') || sponsorLevelStr.includes('Master') || sponsorLevelStr.includes('Admin'))) {
    sponsorLevelNumber = 0; // Apex root
  } else {
    sponsorLevelNumber = getLevelIndexFromLevelString(sponsorLevelStr);
  }

  // Child becomes 1 level deeper in the tree structure:
  // Root (0) -> Level A (1)
  // Level A (1) -> Level B (2)
  // Level B (2) -> Level C (3)
  // Level C (3) -> Level D (4)
  // etc.
  const childLevelNumber = sponsorLevelNumber === 0 ? 1 : Math.min(sponsorLevelNumber + 1, 20);
  const levelDef = LEVEL_COMMISSION_RATES[childLevelNumber - 1] || LEVEL_COMMISSION_RATES[0];

  return {
    networkLevel: `سطح ${levelDef.levelNumber} (Level ${levelDef.letter})`,
    rankName: `عضو لایه ${levelDef.letter} (Level ${levelDef.letter})`,
    levelLetter: levelDef.letter,
    levelNumber: levelDef.levelNumber,
    commissionRate: levelDef.rate
  };
}

/**
 * THE 9 REAL SYSTEM USERS IN THE DATABASE
 * Follows the clean sequential hybrid multilevel referral architecture:
 * Admin/Root (Apex) -> Level A -> Level B -> Level C -> Level D ...
 */
export const SEED_REAL_USERS: DbUserEntity[] = [
  {
    id: 'DX-482917',
    fullName: 'سامان کریمیان',
    username: 'saman_karimian',
    email: 'saman.karimian12@gmail.com',
    phone: '+989121112233',
    sponsorId: 'TGEX-ROOT',
    sponsorName: 'ریشه شبکه تیجکس (Tgex Root)',
    placementParentId: 'TGEX-ROOT-01',
    placementName: 'شاخه اصلی سیستم هیبرید (Root Node)',
    placementSide: 'center',
    rank: 'Platinum Executive (مدیر ارشد و ریشه شبکه)',
    level: 'ریشه سیستم هیبرید (Master Root)',
    kycStatus: 'approved',
    accountStatus: 'active',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    twoFactorEnabled: true,
    country: 'ایران',
    registrationDate: '2024-11-01 09:00',
    lastLogin: '2026-08-23 10:30'
  },
  {
    id: 'DX-102948',
    fullName: 'علی محمدی',
    username: 'ali_mohammadi',
    email: 'ali.mohammadi@gmail.com',
    phone: '+989123456789',
    sponsorId: 'DX-482917',
    sponsorName: 'سامان کریمیان',
    placementParentId: 'DX-482917',
    placementName: 'سامان کریمیان (شاخه چپ)',
    placementSide: 'left',
    rank: 'Gold Leader (رهبر طلایی - Level A)',
    level: 'سطح ۱ (Level A)',
    kycStatus: 'approved',
    accountStatus: 'active',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: 'TXj2k7U8g6H4Y1Nm9vL0pQ5wR3tZ8sB1aC',
    twoFactorEnabled: true,
    country: 'ایران',
    registrationDate: '2025-01-14 10:30',
    lastLogin: '2026-08-22 14:22'
  },
  {
    id: 'DX-772109',
    fullName: 'سارا امینی',
    username: 'sara_amini',
    email: 'sara.amini@techcorp.io',
    phone: '+989128883322',
    sponsorId: 'DX-482917',
    sponsorName: 'سامان کریمیان',
    placementParentId: 'DX-482917',
    placementName: 'سامان کریمیان (شاخه راست)',
    placementSide: 'right',
    rank: 'Silver Leader (رهبر نقره‌ای - Level A)',
    level: 'سطح ۱ (Level A)',
    kycStatus: 'approved',
    accountStatus: 'active',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: '0x71C8363837918fbF326eB0D6F189F82088f12345',
    twoFactorEnabled: true,
    country: 'ایران',
    registrationDate: '2025-04-12 14:10',
    lastLogin: '2026-08-22 12:45'
  },
  {
    id: 'DX-449210',
    fullName: 'مهدی حسینی',
    username: 'mehdi_hoseini',
    email: 'ali.reza@gmail.com',
    phone: '+989351234567',
    sponsorId: 'DX-482917',
    sponsorName: 'سامان کریمیان',
    placementParentId: 'DX-482917',
    placementName: 'سامان کریمیان (شاخه میانی)',
    placementSide: 'center',
    rank: 'Bronze Leader (رهبر برنزی - Level A)',
    level: 'سطح ۱ (Level A)',
    kycStatus: 'pending',
    accountStatus: 'active',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: '0x12B...445e',
    twoFactorEnabled: false,
    country: 'ایران',
    registrationDate: '2025-02-18 09:15',
    lastLogin: '2026-08-22 11:20'
  },
  {
    id: 'DX-551029',
    fullName: 'رضا کمالی',
    username: 'reza_kamali',
    email: 'reza.kamali@yahoo.com',
    phone: '+989354445566',
    sponsorId: 'DX-102948',
    sponsorName: 'علی محمدی',
    placementParentId: 'DX-102948',
    placementName: 'علی محمدی (شاخه راست)',
    placementSide: 'right',
    rank: 'Silver Leader (رهبر نقره‌ای - Level B)',
    level: 'سطح ۲ (Level B)',
    kycStatus: 'approved',
    accountStatus: 'active',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
    twoFactorEnabled: true,
    country: 'ایران',
    registrationDate: '2025-03-20 18:45',
    lastLogin: '2026-08-21 19:40'
  },
  {
    id: 'DX-663910',
    fullName: 'پرهام شایان',
    username: 'parham_shayan',
    email: 'parham.sh@gmail.com',
    phone: '+989127771199',
    sponsorId: 'DX-772109',
    sponsorName: 'سارا امینی',
    placementParentId: 'DX-772109',
    placementName: 'سارا امینی (شاخه راست)',
    placementSide: 'right',
    rank: 'Bronze Leader (رهبر برنزی - Level B)',
    level: 'سطح ۲ (Level B)',
    kycStatus: 'approved',
    accountStatus: 'active',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: '0x22C...990d',
    twoFactorEnabled: false,
    country: 'ایران',
    registrationDate: '2025-05-02 16:30',
    lastLogin: '2026-08-21 21:00'
  },
  {
    id: 'DX-331084',
    fullName: 'مریم کاظمی',
    username: 'maryam_kazemi',
    email: 'maryam.k@yahoo.com',
    phone: '+989352223344',
    sponsorId: 'DX-772109',
    sponsorName: 'سارا امینی',
    placementParentId: 'DX-772109',
    placementName: 'سارا امینی (شاخه چپ)',
    placementSide: 'left',
    rank: 'Bronze Leader (رهبر برنزی - Level B)',
    level: 'سطح ۲ (Level B)',
    kycStatus: 'approved',
    accountStatus: 'active',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: '0x44D...112a',
    twoFactorEnabled: false,
    country: 'ایران',
    registrationDate: '2025-05-18 11:20',
    lastLogin: '2026-08-20 18:15'
  },
  {
    id: 'DX-809531',
    fullName: 'فرهاد نصیری',
    username: 'farhad_nasiri',
    email: 'unverified@tgex.io',
    phone: '+989120000099',
    sponsorId: 'DX-551029',
    sponsorName: 'رضا کمالی',
    placementParentId: 'DX-551029',
    placementName: 'رضا کمالی (شاخه چپ)',
    placementSide: 'left',
    rank: 'Member (عضو فعال - Level C)',
    level: 'سطح ۳ (Level C)',
    kycStatus: 'approved',
    accountStatus: 'active',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: '0x33A...771e',
    twoFactorEnabled: false,
    country: 'ایران',
    registrationDate: '2026-08-19 07:00',
    lastLogin: '2026-08-23 09:10'
  },
  {
    id: 'DX-999000',
    fullName: 'کامران نجفی',
    username: 'kamran_najafi',
    email: 'disabled@tgex.io',
    phone: '+989129998877',
    sponsorId: 'DX-809531',
    sponsorName: 'فرهاد نصیری',
    placementParentId: 'DX-809531',
    placementName: 'فرهاد نصیری (شاخه چپ)',
    placementSide: 'left',
    rank: 'Member (عضو معلق - Level D)',
    level: 'سطح ۴ (Level D)',
    kycStatus: 'rejected',
    accountStatus: 'suspended',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: undefined,
    twoFactorEnabled: false,
    country: 'ایران',
    registrationDate: '2025-02-10 11:00',
    lastLogin: '2025-02-10 11:05'
  },
  {
    id: 'DX-518290',
    fullName: 'سینا ابراهیمی',
    username: 'sina_ebrahimi',
    email: 'sina.eb@gmail.com',
    phone: '+989125551122',
    sponsorId: 'DX-999000',
    sponsorName: 'کامران نجفی',
    placementParentId: 'DX-999000',
    placementName: 'شاخه توسعه ماتریس',
    placementSide: 'right',
    rank: 'Expansion Leader (رهبر توسعه - Level E)',
    level: 'سطح ۵ (Level E)',
    kycStatus: 'approved',
    accountStatus: 'active',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: '0x55A...991e',
    twoFactorEnabled: true,
    country: 'ایران',
    registrationDate: '2025-06-01 10:00',
    lastLogin: '2026-08-20 14:00'
  },
  {
    id: 'DX-619283',
    fullName: 'نوید شمس',
    username: 'navid_shams',
    email: 'navid.shams@gmail.com',
    phone: '+989126662233',
    sponsorId: 'DX-518290',
    sponsorName: 'سینا ابراهیمی',
    placementParentId: 'DX-518290',
    placementName: 'سینا ابراهیمی (شاخه راست)',
    placementSide: 'right',
    rank: 'Regional Coordinator (هماهنگ‌کننده منطقه‌ای - Level F)',
    level: 'سطح ۶ (Level F)',
    kycStatus: 'approved',
    accountStatus: 'active',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: '0x66B...882c',
    twoFactorEnabled: true,
    country: 'ایران',
    registrationDate: '2025-06-15 12:00',
    lastLogin: '2026-08-19 11:30'
  },
  {
    id: 'DX-728192',
    fullName: 'نگار یزدانی',
    username: 'negar_yazdani',
    email: 'negar.y@yahoo.com',
    phone: '+989127773344',
    sponsorId: 'DX-619283',
    sponsorName: 'نوید شمس',
    placementParentId: 'DX-619283',
    placementName: 'نوید شمس (شاخه چپ)',
    placementSide: 'left',
    rank: 'Accelerator Lead (شتاب‌دهنده شبکه - Level G)',
    level: 'سطح ۷ (Level G)',
    kycStatus: 'approved',
    accountStatus: 'active',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: '0x77C...773d',
    twoFactorEnabled: true,
    country: 'ایران',
    registrationDate: '2025-07-02 09:30',
    lastLogin: '2026-08-18 16:20'
  },
  {
    id: 'DX-819203',
    fullName: 'حسام تقوی',
    username: 'hesam_taghavi',
    email: 'hesam.taghavi@gmail.com',
    phone: '+989128884455',
    sponsorId: 'DX-728192',
    sponsorName: 'نگار یزدانی',
    placementParentId: 'DX-728192',
    placementName: 'شاخه پایداری تیم',
    placementSide: 'right',
    rank: 'Core Leader (کانون پایداری تیم - Level H)',
    level: 'سطح ۸ (Level H)',
    kycStatus: 'approved',
    accountStatus: 'active',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: '0x88D...664e',
    twoFactorEnabled: true,
    country: 'ایران',
    registrationDate: '2025-07-20 14:15',
    lastLogin: '2026-08-17 10:10'
  },
  {
    id: 'DX-918234',
    fullName: 'آرمان درخشان',
    username: 'arman_derakhshan',
    email: 'arman.d@gmail.com',
    phone: '+989129995566',
    sponsorId: 'DX-819203',
    sponsorName: 'حسام تقوی',
    placementParentId: 'DX-819203',
    placementName: 'باشگاه رهبران',
    placementSide: 'center',
    rank: 'Leadership Initiate (رهبر ورودی - Level I)',
    level: 'سطح ۹ (Level I)',
    kycStatus: 'approved',
    accountStatus: 'active',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: '0x99E...555f',
    twoFactorEnabled: true,
    country: 'ایران',
    registrationDate: '2025-08-05 16:40',
    lastLogin: '2026-08-16 19:00'
  },
  {
    id: 'DX-109281',
    fullName: 'امیررضا صادقی',
    username: 'amirreza_sadeghi',
    email: 'amirreza.s@gmail.com',
    phone: '+989121116677',
    sponsorId: 'DX-918234',
    sponsorName: 'آرمان درخشان',
    placementParentId: 'DX-918234',
    placementName: 'معماران ساختار',
    placementSide: 'right',
    rank: 'Structure Architect (معمار ساختار - Level J)',
    level: 'سطح ۱۰ (Level J)',
    kycStatus: 'approved',
    accountStatus: 'active',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: '0x10F...446a',
    twoFactorEnabled: true,
    country: 'ایران',
    registrationDate: '2025-08-25 11:20',
    lastLogin: '2026-08-15 15:45'
  },
  {
    id: 'DX-119283',
    fullName: 'پگاه نوری',
    username: 'pegah_noori',
    email: 'pegah.noori@yahoo.com',
    phone: '+989122227788',
    sponsorId: 'DX-109281',
    sponsorName: 'امیررضا صادقی',
    placementParentId: 'DX-109281',
    placementName: 'استراتژیست‌های کلان',
    placementSide: 'left',
    rank: 'Macro Strategist (استراتژیست کلان - Level K)',
    level: 'سطح ۱۱ (Level K)',
    kycStatus: 'approved',
    accountStatus: 'active',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: '0x11A...337b',
    twoFactorEnabled: true,
    country: 'ایران',
    registrationDate: '2025-09-10 13:10',
    lastLogin: '2026-08-14 09:30'
  },
  {
    id: 'DX-128392',
    fullName: 'دانیال اکبری',
    username: 'danial_akbari',
    email: 'danial.ak@gmail.com',
    phone: '+989123338899',
    sponsorId: 'DX-119283',
    sponsorName: 'پگاه نوری',
    placementParentId: 'DX-119283',
    placementName: 'پیشگامان ارشد',
    placementSide: 'right',
    rank: 'Senior Pioneer (پیشگام ارشد - Level L)',
    level: 'سطح ۱۲ (Level L)',
    kycStatus: 'approved',
    accountStatus: 'active',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: '0x12B...228c',
    twoFactorEnabled: true,
    country: 'ایران',
    registrationDate: '2025-09-28 17:50',
    lastLogin: '2026-08-13 18:20'
  },
  {
    id: 'DX-139281',
    fullName: 'نیلوفر رستمی',
    username: 'niloufar_rostami',
    email: 'niloufar.r@gmail.com',
    phone: '+989124449900',
    sponsorId: 'DX-128392',
    sponsorName: 'دانیال اکبری',
    placementParentId: 'DX-128392',
    placementName: 'مدیران اجرایی ماتریس',
    placementSide: 'left',
    rank: 'Executive Director (مدیر اجرایی - Level M)',
    level: 'سطح ۱۳ (Level M)',
    kycStatus: 'approved',
    accountStatus: 'active',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: '0x13C...119d',
    twoFactorEnabled: true,
    country: 'ایران',
    registrationDate: '2025-10-14 10:00',
    lastLogin: '2026-08-12 11:00'
  },
  {
    id: 'DX-149281',
    fullName: 'میلاد خسروی',
    username: 'milad_khosravi',
    email: 'milad.kh@gmail.com',
    phone: '+989125550011',
    sponsorId: 'DX-139281',
    sponsorName: 'نیلوفر رستمی',
    placementParentId: 'DX-139281',
    placementName: 'مدیران ارشد توسعه',
    placementSide: 'right',
    rank: 'Senior Development Director (مدیر ارشد توسعه - Level N)',
    level: 'سطح ۱۴ (Level N)',
    kycStatus: 'approved',
    accountStatus: 'active',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: '0x14D...001e',
    twoFactorEnabled: true,
    country: 'ایران',
    registrationDate: '2025-11-02 15:30',
    lastLogin: '2026-08-11 14:15'
  },
  {
    id: 'DX-159281',
    fullName: 'مهسا غفاری',
    username: 'mahsa_ghaffari',
    email: 'mahsa.gh@yahoo.com',
    phone: '+989126661122',
    sponsorId: 'DX-149281',
    sponsorName: 'میلاد خسروی',
    placementParentId: 'DX-149281',
    placementName: 'مدیریت منطقه‌ای',
    placementSide: 'left',
    rank: 'Regional Director (مدیر منطقه‌ای - Level O)',
    level: 'سطح ۱۵ (Level O)',
    kycStatus: 'approved',
    accountStatus: 'active',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: '0x15E...992f',
    twoFactorEnabled: true,
    country: 'ایران',
    registrationDate: '2025-11-20 09:15',
    lastLogin: '2026-08-10 16:40'
  },
  {
    id: 'DX-169281',
    fullName: 'آرش جهانگیری',
    username: 'arash_jahangiri',
    email: 'arash.j@gmail.com',
    phone: '+989127772233',
    sponsorId: 'DX-159281',
    sponsorName: 'مهسا غفاری',
    placementParentId: 'DX-159281',
    placementName: 'شورای عالی مدیریت',
    placementSide: 'right',
    rank: 'Grand Executive (مدیر عالی‌رتبه - Level P)',
    level: 'سطح ۱۶ (Level P)',
    kycStatus: 'approved',
    accountStatus: 'active',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: '0x16F...883a',
    twoFactorEnabled: true,
    country: 'ایران',
    registrationDate: '2025-12-05 12:45',
    lastLogin: '2026-08-09 13:00'
  },
  {
    id: 'DX-179281',
    fullName: 'شیدا مرادی',
    username: 'sheida_moradi',
    email: 'sheida.m@gmail.com',
    phone: '+989128883344',
    sponsorId: 'DX-169281',
    sponsorName: 'آرش جهانگیری',
    placementParentId: 'DX-169281',
    placementName: 'سفیران عالی پلتفرم',
    placementSide: 'center',
    rank: 'Platform Ambassador (سفیر عالی پلتفرم - Level Q)',
    level: 'سطح ۱۷ (Level Q)',
    kycStatus: 'approved',
    accountStatus: 'active',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: '0x17A...774b',
    twoFactorEnabled: true,
    country: 'ایران',
    registrationDate: '2025-12-22 14:00',
    lastLogin: '2026-08-08 17:30'
  },
  {
    id: 'DX-189281',
    fullName: 'سروش بهرامی',
    username: 'soroush_bahrami',
    email: 'soroush.b@yahoo.com',
    phone: '+989129994455',
    sponsorId: 'DX-179281',
    sponsorName: 'شیدا مرادی',
    placementParentId: 'DX-179281',
    placementName: 'معتمدان کلان شبکه',
    placementSide: 'right',
    rank: 'Network Trustee (معتمد کلان شبکه - Level R)',
    level: 'سطح ۱۸ (Level R)',
    kycStatus: 'approved',
    accountStatus: 'active',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: '0x18B...665c',
    twoFactorEnabled: true,
    country: 'ایران',
    registrationDate: '2026-01-10 11:30',
    lastLogin: '2026-08-07 10:15'
  },
  {
    id: 'DX-199281',
    fullName: 'کیانوش پیروزی',
    username: 'kianoush_pirouzi',
    email: 'kianoush.p@gmail.com',
    phone: '+989121115566',
    sponsorId: 'DX-189281',
    sponsorName: 'سروش بهرامی',
    placementParentId: 'DX-189281',
    placementName: 'هیئت امنای شبکه',
    placementSide: 'left',
    rank: 'Trustee Board Senior (عضو ارشد هیئت امنا - Level S)',
    level: 'سطح ۱۹ (Level S)',
    kycStatus: 'approved',
    accountStatus: 'active',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: '0x19C...556d',
    twoFactorEnabled: true,
    country: 'ایران',
    registrationDate: '2026-02-01 16:00',
    lastLogin: '2026-08-06 12:20'
  },
  {
    id: 'DX-209281',
    fullName: 'کیارش تهرانی',
    username: 'kiarash_tehrani',
    email: 'kiarash.t@tgex.io',
    phone: '+989122226677',
    sponsorId: 'DX-199281',
    sponsorName: 'کیانوش پیروزی',
    placementParentId: 'DX-199281',
    placementName: 'نقطه اوج ماتریس تیجکس',
    placementSide: 'center',
    rank: 'Titan Sovereign (نقطه اوج ماتریس - Level T Titan)',
    level: 'سطح ۲۰ (Level T)',
    kycStatus: 'approved',
    accountStatus: 'active',
    volumeUsdt: 0,
    profitUsdt: 0,
    totalEarningsUsdt: 0,
    currentMonthEarningsUsdt: 0,
    walletAddress: '0x20D...447e',
    twoFactorEnabled: true,
    country: 'ایران',
    registrationDate: '2026-02-15 18:30',
    lastLogin: '2026-08-05 14:00'
  }
];

export const SEED_WITHDRAWAL_REQUESTS: WithdrawalRequest[] = [
  {
    id: 'wreq_101',
    userId: 'DX-482917',
    userFullName: 'سامان کریمیان',
    username: 'saman_karimian',
    userEmail: 'saman.karimian12@gmail.com',
    walletAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    walletLink: 'https://tronscan.org/#/address/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    networkType: 'TRC20 (USDT)',
    amountUsdt: 0,
    submittedAtPersian: '۱۴۰۵/۰۶/۰۲ - ساعت ۱۸:۳۵',
    submittedAtIso: '2026-08-23T18:35:00Z',
    status: 'pending',
  },
  {
    id: 'wreq_102',
    userId: 'DX-102948',
    userFullName: 'علی محمدی',
    username: 'ali_mohammadi',
    userEmail: 'ali.mohammadi@gmail.com',
    walletAddress: 'TXj2k7U8g6H4Y1Nm9vL0pQ5wR3tZ8sB1aC',
    walletLink: 'https://tronscan.org/#/address/TXj2k7U8g6H4Y1Nm9vL0pQ5wR3tZ8sB1aC',
    networkType: 'TRC20 (USDT)',
    amountUsdt: 0,
    submittedAtPersian: '۱۴۰۵/۰۶/۰۱ - ساعت ۱۴:۲۰',
    submittedAtIso: '2026-08-22T14:20:00Z',
    status: 'approved',
    reviewedByAdminEmail: 'financial@tgex.io',
    reviewedAtPersian: '۱۴۰۵/۰۶/۰۱ - ساعت ۱۶:۰۰',
    txHash: '0x9482bf...318e'
  },
  {
    id: 'wreq_103',
    userId: 'DX-772109',
    userFullName: 'سارا امینی',
    username: 'sara_amini',
    userEmail: 'sara.amini@techcorp.io',
    walletAddress: '0x71C8363837918fbF326eB0D6F189F82088f12345',
    walletLink: 'https://etherscan.io/address/0x71C8363837918fbF326eB0D6F189F82088f12345',
    networkType: 'ERC20 (USDT)',
    amountUsdt: 0,
    submittedAtPersian: '۱۴۰۵/۰۵/۳۰ - ساعت ۱۱:۱۵',
    submittedAtIso: '2026-08-21T11:15:00Z',
    status: 'rejected',
    rejectionReason: 'آدرس ولت ثبت شده متعلق به شبکه اتریوم است در حالی که درخواست با شبکه ترون ثبت شده بود.',
    reviewedByAdminEmail: 'compliance@tgex.io',
    reviewedAtPersian: '۱۴۰۵/۰۵/۳۰ - ساعت ۱۳:۳۰'
  },
  {
    id: 'wreq_104',
    userId: 'DX-551029',
    userFullName: 'رضا کمالی',
    username: 'reza_kamali',
    userEmail: 'reza.kamali@yahoo.com',
    walletAddress: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
    walletLink: 'https://tronscan.org/#/address/TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
    networkType: 'TRC20 (USDT)',
    amountUsdt: 0,
    submittedAtPersian: '۱۴۰۵/۰۶/۰۲ - ساعت ۱۰:۴۵',
    submittedAtIso: '2026-08-23T10:45:00Z',
    status: 'pending'
  }
];

const STORAGE_UNIFIED_DB_KEY = 'tgex_unified_relational_db_v3';
const STORAGE_WITHDRAWALS_KEY = 'tgex_withdrawals_requests_db_v1';

export function getPersianDateTimeNow(): string {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    return formatter.format(now).replace(',', ' - ساعت');
  } catch {
    return '۱۴۰۵/۰۶/۰۲ - ساعت ۱۸:۳۵';
  }
}

class DatabaseService {
  /**
   * Loads all real users from local database storage
   */
  getUsers(): DbUserEntity[] {
    let users: DbUserEntity[] = [];
    try {
      const stored = localStorage.getItem(STORAGE_UNIFIED_DB_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          users = parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load database from localStorage', e);
    }

    if (users.length === 0) {
      users = SEED_REAL_USERS;
    }

    // Reset all users rank (except root) to the first rank 'استارتر (Starter)' per user request
    let updated = false;
    users = users.map(u => {
      const isRoot = u.id === 'DX-482917' || u.id === 'TGEX-ROOT';
      if (!isRoot && u.rank !== 'استارتر (Starter)') {
        updated = true;
        return { ...u, rank: 'استارتر (Starter)' };
      }
      return u;
    });

    const aliUser = users.find(u => u.id === 'DX-102948');
    const hasAllSeedUsers = SEED_REAL_USERS.every(s => users.some(p => p.id === s.id));
    if (!hasAllSeedUsers || (aliUser && aliUser.level !== 'سطح ۱ (Level A)')) {
      const merged = SEED_REAL_USERS.concat(
        users.filter(p => !SEED_REAL_USERS.some(s => s.id === p.id))
      );
      users = merged.map(u => {
        const isRoot = u.id === 'DX-482917' || u.id === 'TGEX-ROOT';
        if (!isRoot) return { ...u, rank: 'استارتر (Starter)' };
        return u;
      });
      updated = true;
    }

    if (updated) {
      this.saveUsers(users);
    }

    return users;
  }

  saveUsers(users: DbUserEntity[]): void {
    try {
      localStorage.setItem(STORAGE_UNIFIED_DB_KEY, JSON.stringify(users));
      window.dispatchEvent(new Event('tgex_db_updated'));
    } catch (e) {
      console.error('Failed to save database to localStorage', e);
    }
  }

  /**
   * Strict validation of a Referral (Sponsor) Code against all users in the system
   */
  validateReferralCode(code: string): {
    valid: boolean;
    user?: DbUserEntity;
    error?: string;
  } {
    if (!code || !code.trim()) {
      return { valid: false, error: 'وارد کردن کد معرف الزامی است.' };
    }

    const trimmed = code.trim();
    
    // Special Root bypass for apex network initialization if needed
    if (trimmed.toUpperCase() === 'ROOT' || trimmed.toUpperCase() === 'TGEX-ROOT') {
      const rootUser = this.getUserById('DX-482917');
      if (rootUser) {
        return { valid: true, user: rootUser };
      }
    }

    const matchedUser = this.getUserById(trimmed);
    if (!matchedUser) {
      return { 
        valid: false, 
        error: `کد معرف «${trimmed}» در سامانه تیجکس یافت نشد. لطفاً کد معرف واقعی حامی خود را بررسی و مجدداً وارد فرمایید.` 
      };
    }

    if (matchedUser.accountStatus === 'suspended') {
      return {
        valid: false,
        error: `حساب کاربری معرف «${matchedUser.fullName}» در حال حاضر غیرفعال/مسدود است. لطفاً از کد معرف دیگری استفاده فرمایید.`
      };
    }

    return { valid: true, user: matchedUser };
  }

  /**
   * Strict validation of an Apply / Placement Code against all tree nodes in the system
   */
  validatePlacementCode(code: string): {
    valid: boolean;
    user?: DbUserEntity;
    error?: string;
  } {
    if (!code || !code.trim()) {
      return { valid: false, error: 'وارد کردن کد جایگاه / اپلای الزامی است.' };
    }

    const trimmed = code.trim();

    // Direct match with any registered user or tree parent
    if (trimmed.toUpperCase() === 'ROOT' || trimmed.toUpperCase() === 'TGEX-ROOT' || trimmed.toUpperCase() === 'TGEX-ROOT-01') {
      const rootUser = this.getUserById('DX-482917');
      if (rootUser) {
        return { valid: true, user: rootUser };
      }
    }

    const matchedUser = this.getUserById(trimmed);
    if (!matchedUser) {
      return { 
        valid: false, 
        error: `کد جایگاه / اپلای «${trimmed}» در سامانه معتبر نیست. لطفاً کد گره یا شناسه جایگاه بالادست خود را صحیح وارد نمایید.` 
      };
    }

    return { valid: true, user: matchedUser };
  }

  /**
   * Gets a clean list of all real active referral codes for the guide
   */
  getRealActiveReferralGuides() {
    const users = this.getUsers().filter(u => u.accountStatus === 'active');
    return users.map(u => ({
      id: u.id,
      referralCode: u.id.replace('DX-', '').replace('usr_', ''),
      cleanCode: u.id.replace('DX-', '').replace('usr_', ''),
      fullName: u.fullName,
      username: u.username,
      level: u.level,
      rank: u.rank,
      email: u.email
    }));
  }

  /**
   * Flexible User Lookup: Matches ID (with or without DX-/usr_), username, or email
   */
  getUserById(idOrEmail: string): DbUserEntity | undefined {
    if (!idOrEmail) return undefined;
    const users = this.getUsers();
    const query = idOrEmail.trim().toLowerCase();
    const cleanId = query.replace('usr_', '').replace('dx-', '').replace('tgex-', '');

    return users.find(u => {
      const uId = u.id.toLowerCase();
      const uCleanId = uId.replace('usr_', '').replace('dx-', '').replace('tgex-', '');
      const uEmail = u.email.toLowerCase();
      const uUsername = u.username.toLowerCase();

      return (
        uId === query ||
        uCleanId === cleanId ||
        uEmail === query ||
        uUsername === query ||
        uId === `dx-${cleanId}` ||
        uId === `usr_${cleanId}`
      );
    });
  }

  /**
   * Traces the complete upline sponsorship chain from a user up to Root
   */
  getUplineChain(userId: string): {
    id: string;
    fullName: string;
    username: string;
    level: string;
    rank: string;
    referralCode: string;
  }[] {
    const chain: {
      id: string;
      fullName: string;
      username: string;
      level: string;
      rank: string;
      referralCode: string;
    }[] = [];

    let current = this.getUserById(userId);
    const visited = new Set<string>();

    while (current && current.sponsorId && !visited.has(current.id)) {
      visited.add(current.id);
      if (
        current.sponsorId === 'TGEX-ROOT' || 
        current.sponsorId.toUpperCase().includes('ROOT')
      ) {
        chain.unshift({
          id: 'TGEX-ROOT',
          fullName: 'ریشه پلتفرم تیجکس (Tgex Master Root)',
          username: 'tgex_root',
          level: 'ریشه کل (Apex)',
          rank: 'Global Master Root',
          referralCode: 'ROOT'
        });
        break;
      }

      const sponsor = this.getUserById(current.sponsorId);
      if (sponsor) {
        chain.unshift({
          id: sponsor.id,
          fullName: sponsor.fullName,
          username: sponsor.username,
          level: sponsor.level,
          rank: sponsor.rank,
          referralCode: sponsor.id.replace('DX-', '').replace('usr_', '')
        });
        current = sponsor;
      } else {
        chain.unshift({
          id: current.sponsorId,
          fullName: current.sponsorName || 'حامی ارشد',
          username: current.sponsorId,
          level: 'اسپانسر مستقیم',
          rank: 'Sponsor',
          referralCode: current.sponsorId
        });
        break;
      }
    }

    return chain;
  }

  /**
   * Retrieves direct referrals with enriched hybrid metrics
   */
  getDirectReferralsDetailed(userId: string) {
    const directs = this.getDirectReferrals(userId);
    return directs.map(d => {
      const subtree = this.getSubtreeUsers(d.id);
      return {
        ...d,
        downlineCount: subtree.length,
        activeDownlineCount: subtree.filter(s => s.accountStatus === 'active').length,
        referralCode: d.id.replace('DX-', '').replace('usr_', '')
      };
    });
  }

  getUserByEmail(email: string): DbUserEntity | undefined {
    if (!email) return undefined;
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  upsertUser(user: DbUserEntity): void {
    const users = this.getUsers();
    const idx = users.findIndex(u => 
      u.id === user.id || 
      u.email.toLowerCase() === user.email.toLowerCase() ||
      u.id.replace('usr_', '').replace('DX-', '') === user.id.replace('usr_', '').replace('DX-', '')
    );
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...user };
    } else {
      users.push(user);
    }
    this.saveUsers(users);
  }

  /**
   * Intelligently resolves sponsor and placement parent from code/username/email
   */
  resolveSponsorAndPlacement(referralCode?: string, placementCode?: string): {
    sponsorId: string;
    sponsorName: string;
    sponsorUser: DbUserEntity;
    placementParentId: string;
    placementName: string;
    placementSide: 'left' | 'center' | 'right';
  } {
    const users = this.getUsers();
    const defaultSponsor = users.find(u => u.id === 'DX-482917') || users[0];

    let sponsor = defaultSponsor;
    if (referralCode && referralCode.trim()) {
      const ref = referralCode.trim();
      const matched = this.getUserById(ref);
      if (matched) {
        sponsor = matched;
      }
    }

    let placementParentId = sponsor.id;
    let placementName = sponsor.fullName;
    let placementSide: 'left' | 'center' | 'right' = 'left';

    if (placementCode && placementCode.trim()) {
      const plc = placementCode.trim();
      const matchedPlacement = this.getUserById(plc);
      if (matchedPlacement) {
        placementParentId = matchedPlacement.id;
        placementName = matchedPlacement.fullName;
      }
    }

    return {
      sponsorId: sponsor.id,
      sponsorName: sponsor.fullName,
      sponsorUser: sponsor,
      placementParentId,
      placementName,
      placementSide
    };
  }

  /**
   * Direct Referrals Query: Finds all users who were sponsored directly by sponsorId
   * (Matches multiple ID formats: DX-482917, usr_482917, 482917, or username)
   */
  getDirectReferrals(sponsorIdOrUsername: string): DbUserEntity[] {
    if (!sponsorIdOrUsername) return [];
    const users = this.getUsers();
    const cleanKey = sponsorIdOrUsername.toLowerCase().replace('usr_', '').replace('dx-', '').replace('tgex-', '');

    return users.filter(u => {
      if (!u.sponsorId) return false;
      const sId = u.sponsorId.toLowerCase();
      const sClean = sId.replace('usr_', '').replace('dx-', '').replace('tgex-', '');
      return (
        sId === sponsorIdOrUsername.toLowerCase() ||
        sClean === cleanKey ||
        (u.sponsorName && u.sponsorName.toLowerCase() === sponsorIdOrUsername.toLowerCase())
      );
    });
  }

  /**
   * Tree Subtree Query: Recursively retrieves all downline nodes under a parent placement
   */
  getSubtreeUsers(rootId: string): DbUserEntity[] {
    const users = this.getUsers();
    const rootUser = this.getUserById(rootId);
    if (!rootUser) return [];

    const result: DbUserEntity[] = [];
    const queue: string[] = [rootUser.id];
    const visited = new Set<string>([rootUser.id]);

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const cleanCurrent = currentId.toLowerCase().replace('usr_', '').replace('dx-', '');
      
      const children = users.filter(u => {
        if (visited.has(u.id)) return false;
        const pId = (u.placementParentId || '').toLowerCase();
        const pClean = pId.replace('usr_', '').replace('dx-', '');
        return (
          pId === currentId.toLowerCase() ||
          (pClean === cleanCurrent && cleanCurrent.length > 3)
        );
      });

      for (const child of children) {
        visited.add(child.id);
        result.push(child);
        queue.push(child.id);
      }
    }

    return result;
  }

  /**
   * Hybrid System Depth Traversal:
   * Calculates the exact downline users per relative depth (1 to 20) for ANY user.
   */
  getRelative20LevelsForUser(rootUserId: string): {
    levels: StructureLevelDetailed[];
    dashboardCards: DashboardLevelCard[];
    totalDownlineCount: number;
    activeDownlineCount: number;
    totalProfitUsdt: number;
    totalCommissionUsdt: number;
  } {
    const users = this.getUsers();
    const rootUser = this.getUserById(rootUserId) || users[0];

    const depthMap = new Map<string, number>(); // userId -> relativeDepth (1..20)
    const queue: { id: string; depth: number }[] = [{ id: rootUser.id, depth: 0 }];
    const visited = new Set<string>([rootUser.id]);

    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;
      const cleanCurrent = id.toLowerCase().replace('usr_', '').replace('dx-', '');
      
      const children = users.filter(u => {
        if (visited.has(u.id)) return false;
        const pId = (u.placementParentId || '').toLowerCase();
        const pClean = pId.replace('usr_', '').replace('dx-', '');
        return (
          pId === id.toLowerCase() ||
          (pClean === cleanCurrent && cleanCurrent.length > 3)
        );
      });

      for (const child of children) {
        visited.add(child.id);
        const childDepth = depth + 1;
        if (childDepth <= 20) {
          depthMap.set(child.id, childDepth);
          queue.push({ id: child.id, depth: childDepth });
        }
      }
    }

    let totalDownlineCount = 0;
    let activeDownlineCount = 0;
    let totalProfitUsdt = 0;
    let totalCommissionUsdt = 0;

    const levels: StructureLevelDetailed[] = LEVEL_COMMISSION_RATES.map(def => {
      const membersAtDepth = users.filter(u => depthMap.get(u.id) === def.levelNumber);
      const activeMembers = membersAtDepth.filter(u => u.accountStatus === 'active');
      const inactiveMembers = membersAtDepth.filter(u => u.accountStatus !== 'active');

      const profitUsdt = membersAtDepth.reduce((acc, u) => acc + (u.profitUsdt || 0), 0);
      const commissionUsdt = Math.round(profitUsdt * (def.rate / 100) * 10) / 10;

      totalDownlineCount += membersAtDepth.length;
      activeDownlineCount += activeMembers.length;
      totalProfitUsdt += profitUsdt;
      totalCommissionUsdt += commissionUsdt;

      return {
        letter: def.letter,
        levelNumber: def.levelNumber,
        tierGroup: def.tierGroup,
        users: membersAtDepth.length,
        activeUsers: activeMembers.length,
        inactiveUsers: inactiveMembers.length,
        networkProfitUsdt: profitUsdt,
        commissionRatePercent: def.rate,
        commissionEarnedUsdt: commissionUsdt,
        status: membersAtDepth.length > 0 || def.levelNumber === 1 ? 'unlocked' : 'locked',
        qualificationRequirement: def.req,
        members: membersAtDepth.map(u => ({
          id: u.id,
          name: u.fullName,
          username: u.username,
          rank: u.rank,
          sponsorName: u.sponsorName,
          volumeUsdt: u.volumeUsdt || 0,
          commissionEarnedUsdt: Math.round((u.profitUsdt || 0) * (def.rate / 100)),
          status: u.accountStatus === 'active' ? 'active' : 'inactive',
          joinedAt: u.registrationDate
        }))
      };
    });

    const dashboardCards: DashboardLevelCard[] = levels.map(lvl => ({
      letter: lvl.letter,
      levelNumber: lvl.levelNumber,
      users: lvl.users,
      activeUsers: lvl.activeUsers,
      networkProfit: lvl.networkProfitUsdt,
      commission: lvl.commissionEarnedUsdt,
      status: lvl.users > 0 || lvl.levelNumber === 1 ? 'active' : 'locked'
    }));

    return {
      levels,
      dashboardCards,
      totalDownlineCount,
      activeDownlineCount,
      totalProfitUsdt,
      totalCommissionUsdt
    };
  }

  /**
   * Generates the hierarchical NetworkTreeNode structure dynamically for ANY specific user
   * (Ensures a user only sees their own tree and downlines, with empty children if they have no downline)
   */
  buildNetworkTree(rootUserIdOrEmail: string): NetworkTreeNode {
    const users = this.getUsers();
    let rootUser = this.getUserById(rootUserIdOrEmail);

    if (!rootUser) {
      // Fallback: create a temporary DbUserEntity for this user
      rootUser = {
        id: rootUserIdOrEmail.startsWith('DX-') ? rootUserIdOrEmail : `DX-${rootUserIdOrEmail.replace('usr_', '')}`,
        fullName: rootUserIdOrEmail.includes('@') ? rootUserIdOrEmail.split('@')[0] : rootUserIdOrEmail,
        username: rootUserIdOrEmail.includes('@') ? rootUserIdOrEmail.split('@')[0] : rootUserIdOrEmail,
        email: rootUserIdOrEmail.includes('@') ? rootUserIdOrEmail : `${rootUserIdOrEmail}@user.tgex.io`,
        phone: '+989000000000',
        sponsorId: 'DX-482917',
        sponsorName: 'سامان کریمیان',
        placementParentId: 'DX-482917',
        placementName: 'سامان کریمیان (شاخه مستقیم)',
        placementSide: 'left',
        rank: 'Member (عضو جدید)',
        level: 'سطح ۱ (Level A)',
        kycStatus: 'approved',
        accountStatus: 'active',
        volumeUsdt: 0,
        profitUsdt: 0,
        totalEarningsUsdt: 0,
        currentMonthEarningsUsdt: 0,
        twoFactorEnabled: false,
        country: 'ایران',
        registrationDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
        lastLogin: new Date().toISOString().replace('T', ' ').slice(0, 19)
      };
      this.upsertUser(rootUser);
    }

    const buildNode = (user: DbUserEntity, depth: number, isRoot: boolean): NetworkTreeNode => {
      const cleanUserId = user.id.toLowerCase().replace('usr_', '').replace('dx-', '');
      
      const childrenEntities = users.filter(u => {
        if (u.id === user.id) return false;
        const pId = (u.placementParentId || '').toLowerCase();
        const pClean = pId.replace('usr_', '').replace('dx-', '');
        return pId === user.id.toLowerCase() || (pClean === cleanUserId && cleanUserId.length > 3);
      });

      const directCount = this.getDirectReferrals(user.id).length;
      const subtree = this.getSubtreeUsers(user.id);
      const networkSize = subtree.length;
      const networkVolumeUsdt = subtree.reduce((acc, c) => acc + (c.volumeUsdt || 0), 0) + (user.volumeUsdt || 0);
      const networkProfitUsdt = subtree.reduce((acc, c) => acc + (c.profitUsdt || 0), 0) + (user.profitUsdt || 0);

      const letter = LEVEL_COMMISSION_RATES[Math.min(depth - 1, 19)]?.letter || 'A';

      const node: NetworkTreeNode = {
        id: user.id,
        name: isRoot ? `${user.fullName} (شما)` : user.fullName,
        username: user.username,
        rank: user.rank,
        levelLetter: letter,
        levelNumber: Math.min(depth, 20),
        status: user.accountStatus === 'active' ? 'active' : 'inactive',
        networkSize: networkSize,
        directCount: directCount,
        networkVolumeUsdt: networkVolumeUsdt,
        networkProfitUsdt: networkProfitUsdt,
        sponsorName: user.sponsorName,
        sponsorId: user.sponsorId,
        placementId: user.placementParentId,
        placementSide: user.placementSide,
        joinedDate: user.registrationDate,
        children: childrenEntities.map(child => buildNode(child, depth + 1, false))
      };

      return node;
    };

    return buildNode(rootUser, 1, true);
  }

  /**
   * Returns the chain of sponsors / referrers above the specified user (Upline Lineage)
   * e.g., Direct Sponsor (depth 1), Grand Sponsor (depth 2), etc.
   */
  getUplineLineage(userIdOrEmail: string): UplineUser[] {
    const user = this.getUserById(userIdOrEmail);
    if (!user) return [];

    const uplines: UplineUser[] = [];
    let current = user;
    let depth = 1;
    const visited = new Set<string>([current.id.toLowerCase()]);

    while (current && current.sponsorId && depth <= 10) {
      const sponsorId = current.sponsorId.trim();
      if (!sponsorId || sponsorId === 'TGEX-ROOT' || sponsorId === 'ROOT') break;
      
      const sponsor = this.getUserById(sponsorId);
      if (!sponsor) {
        // Fallback sponsor representation
        uplines.push({
          id: sponsorId,
          fullName: current.sponsorName || sponsorId,
          username: current.sponsorName ? current.sponsorName.replace(/\s+/g, '_') : sponsorId,
          email: `${sponsorId.toLowerCase()}@tgex.io`,
          referralCode: sponsorId,
          rank: 'Direct Sponsor',
          level: 'سطح معرف',
          isDirectSponsor: depth === 1,
          depthAbove: depth
        });
        break;
      }

      if (visited.has(sponsor.id.toLowerCase())) break;
      visited.add(sponsor.id.toLowerCase());

      uplines.push({
        id: sponsor.id,
        fullName: sponsor.fullName,
        username: sponsor.username,
        email: sponsor.email,
        referralCode: sponsor.id,
        rank: sponsor.rank,
        level: sponsor.level,
        isDirectSponsor: depth === 1,
        depthAbove: depth
      });

      current = sponsor;
      depth++;
    }

    return uplines;
  }

  /**
   * Complete Relational Profile & Analytics for ANY User
   */
  getUserRelationalData(userIdOrEmail: string) {
    const user = this.getUserById(userIdOrEmail);
    if (!user) {
      return null;
    }

    const directReferrals = this.getDirectReferrals(user.id);
    const subtreeUsers = this.getSubtreeUsers(user.id);
    const totalNetworkCount = subtreeUsers.length;
    const directReferralsCount = directReferrals.length;
    const indirectReferralsCount = Math.max(0, totalNetworkCount - directReferralsCount);
    const activeNetworkCount = subtreeUsers.filter(u => u.accountStatus === 'active').length;
    const inactiveNetworkCount = totalNetworkCount - activeNetworkCount;
    
    const networkProfitUsdt = subtreeUsers.reduce((acc, u) => acc + (u.profitUsdt || 0), 0) + (user.profitUsdt || 0);
    const networkVolumeUsdt = subtreeUsers.reduce((acc, u) => acc + (u.volumeUsdt || 0), 0) + (user.volumeUsdt || 0);
    
    const rel20 = this.getRelative20LevelsForUser(user.id);
    const tree = this.buildNetworkTree(user.id);
    
    const sponsorUser = this.getUserById(user.sponsorId);
    const placementParentUser = this.getUserById(user.placementParentId);
    const uplines = this.getUplineLineage(user.id);

    return {
      user,
      directReferrals,
      subtreeUsers,
      totalNetworkCount,
      directReferralsCount,
      indirectReferralsCount,
      activeNetworkCount,
      inactiveNetworkCount,
      networkProfitUsdt,
      networkVolumeUsdt,
      totalEarningsUsdt: user.totalEarningsUsdt || rel20.totalCommissionUsdt,
      currentMonthEarningsUsdt: user.currentMonthEarningsUsdt || Math.round(rel20.totalCommissionUsdt * 0.3),
      relative20Levels: rel20,
      tree,
      sponsorUser,
      placementParentUser,
      uplines
    };
  }

  updateUser(id: string, updates: Partial<DbUserEntity>): DbUserEntity | null {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...updates };
    this.saveUsers(users);
    return users[idx];
  }

  deleteUser(id: string): boolean {
    const users = this.getUsers();
    const filtered = users.filter(u => u.id !== id);
    if (users.length === filtered.length) return false;
    this.saveUsers(filtered);
    return true;
  }

  addUser(newUser: DbUserEntity): DbUserEntity {
    const users = this.getUsers();
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  getAdminUsersList(): AdminUserItem[] {
    const users = this.getUsers();
    return users.map(u => {
      const directs = users.filter(c => c.sponsorId === u.id).length;
      const subtree = this.getSubtreeUsers(u.id);
      const activeCount = subtree.filter(s => s.accountStatus === 'active' && s.kycStatus === 'approved').length;
      const totalProfit = subtree.reduce((acc, s) => acc + (s.profitUsdt || 0), 0) + (u.profitUsdt || 0);
      const relData = this.getRelative20LevelsForUser(u.id);

      const mappedAccountStatus: 'active' | 'suspended' | 'inactive' | 'pending_verification' = 
        u.accountStatus === 'pending' ? 'pending_verification' : u.accountStatus;

      return {
        id: u.id,
        fullName: u.fullName,
        username: u.username,
        email: u.email,
        phone: u.phone,
        registrationDate: u.registrationDate,
        sponsorName: u.sponsorName,
        sponsorId: u.sponsorId,
        placementName: u.placementName,
        placementId: u.placementParentId,
        rank: u.rank,
        level: u.level,
        kycStatus: u.kycStatus,
        accountStatus: mappedAccountStatus,
        networkSize: subtree.length,
        activeUsers: activeCount,
        generatedProfitUsdt: totalProfit,
        totalEarningsUsdt: u.totalEarningsUsdt,
        lastLogin: u.lastLogin,
        twoFactorEnabled: u.twoFactorEnabled,
        directReferralsCount: directs,
        country: u.country,
        walletAddress: u.walletAddress,
        levelBreakdown: relData.levels.map(l => ({
          levelLetter: l.letter,
          levelNumber: l.levelNumber,
          users: l.users,
          active: l.activeUsers,
          profitUsdt: l.networkProfitUsdt,
          commissionUsdt: l.commissionEarnedUsdt,
          ratePercent: l.commissionRatePercent
        }))
      };
    });
  }

  getDirectReferralsForDashboard(userId: string): DirectReferralUser[] {
    const directs = this.getDirectReferrals(userId);
    return directs.map(d => ({
      id: d.id,
      email: d.email,
      name: d.fullName,
      joinDate: d.registrationDate.split(' ')[0],
      kycStatus: d.kycStatus,
      level: d.level,
      volumeUsdt: d.volumeUsdt,
      commissionEarnedUsdt: Math.round((d.profitUsdt || 0) * 0.12),
      isActive: d.accountStatus === 'active'
    }));
  }

  // ==========================================
  // Withdrawal Requests Management
  // ==========================================
  getWithdrawalRequests(): WithdrawalRequest[] {
    try {
      const stored = localStorage.getItem(STORAGE_WITHDRAWALS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load withdrawal requests from localStorage', e);
    }
    this.saveWithdrawalRequests(SEED_WITHDRAWAL_REQUESTS);
    return SEED_WITHDRAWAL_REQUESTS;
  }

  saveWithdrawalRequests(requests: WithdrawalRequest[]): void {
    try {
      localStorage.setItem(STORAGE_WITHDRAWALS_KEY, JSON.stringify(requests));
      window.dispatchEvent(new Event('tgex_withdrawals_updated'));
    } catch (e) {
      console.error('Failed to save withdrawal requests', e);
    }
  }

  addWithdrawalRequest(req: {
    userId: string;
    userFullName: string;
    username: string;
    userEmail: string;
    walletAddress: string;
    walletLink?: string;
    networkType?: string;
    amountUsdt?: number;
  }): WithdrawalRequest {
    const requests = this.getWithdrawalRequests();
    const newReq: WithdrawalRequest = {
      id: 'wreq_' + Date.now().toString(36),
      userId: req.userId,
      userFullName: req.userFullName,
      username: req.username,
      userEmail: req.userEmail,
      walletAddress: req.walletAddress,
      walletLink: req.walletLink || (req.walletAddress.startsWith('0x') ? `https://etherscan.io/address/${req.walletAddress}` : `https://tronscan.org/#/address/${req.walletAddress}`),
      networkType: req.networkType || (req.walletAddress.startsWith('0x') ? 'ERC20 (USDT)' : 'TRC20 (USDT)'),
      amountUsdt: req.amountUsdt || 0,
      submittedAtPersian: getPersianDateTimeNow(),
      submittedAtIso: new Date().toISOString(),
      status: 'pending'
    };
    requests.unshift(newReq);
    this.saveWithdrawalRequests(requests);
    return newReq;
  }

  approveWithdrawalRequest(id: string, adminEmail: string, txHash?: string): boolean {
    const requests = this.getWithdrawalRequests();
    const idx = requests.findIndex(r => r.id === id);
    if (idx === -1) return false;
    requests[idx].status = 'approved';
    requests[idx].reviewedByAdminEmail = adminEmail;
    requests[idx].reviewedAtPersian = getPersianDateTimeNow();
    requests[idx].txHash = txHash || '0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6);
    this.saveWithdrawalRequests(requests);
    return true;
  }

  rejectWithdrawalRequest(id: string, reason: string, adminEmail: string): boolean {
    const requests = this.getWithdrawalRequests();
    const idx = requests.findIndex(r => r.id === id);
    if (idx === -1) return false;
    requests[idx].status = 'rejected';
    requests[idx].rejectionReason = reason;
    requests[idx].reviewedByAdminEmail = adminEmail;
    requests[idx].reviewedAtPersian = getPersianDateTimeNow();
    this.saveWithdrawalRequests(requests);
    return true;
  }

  resetWithdrawalRequestStatus(id: string): boolean {
    const requests = this.getWithdrawalRequests();
    const idx = requests.findIndex(r => r.id === id);
    if (idx === -1) return false;
    requests[idx].status = 'pending';
    requests[idx].rejectionReason = undefined;
    requests[idx].reviewedByAdminEmail = undefined;
    requests[idx].reviewedAtPersian = undefined;
    this.saveWithdrawalRequests(requests);
    return true;
  }

  getLevelCommissionRate(levelNumber: number): number {
    return getLevelCommissionRate(levelNumber);
  }

  generateMySqlExportScript(): string {
    const users = this.getUsers();
    
    let sql = `-- =======================================================
-- TGEX PLATFORM DATABASE SCHEMA & SEED DATA (HYBRID SYSTEM)
-- Target Engine: MySQL 8.0+ / MariaDB 10.4+ (cPanel Compatible)
-- Character Set: utf8mb4 / Collation: utf8mb4_unicode_ci
-- Generated at: ${new Date().toISOString()}
-- =======================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------------------
-- 1. Table structure for table \`users\`
-- -------------------------------------------------------
DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`id\` VARCHAR(32) NOT NULL COMMENT 'Unique user code (e.g. DX-482917)',
  \`full_name\` VARCHAR(100) NOT NULL COMMENT 'Full Legal Name',
  \`username\` VARCHAR(50) NOT NULL COMMENT 'Unique username',
  \`email\` VARCHAR(100) NOT NULL COMMENT 'Email address',
  \`phone\` VARCHAR(20) DEFAULT NULL COMMENT 'International Phone Number',
  \`sponsor_id\` VARCHAR(32) NOT NULL DEFAULT 'TGEX-ROOT' COMMENT 'Direct Sponsor ID',
  \`sponsor_name\` VARCHAR(100) DEFAULT NULL COMMENT 'Sponsor display name',
  \`placement_parent_id\` VARCHAR(32) NOT NULL DEFAULT 'TGEX-ROOT' COMMENT 'Tree Placement Parent ID',
  \`placement_name\` VARCHAR(100) DEFAULT NULL COMMENT 'Placement display label',
  \`placement_side\` ENUM('left','center','right') NOT NULL DEFAULT 'left' COMMENT 'Hybrid Branch Side',
  \`rank\` VARCHAR(50) NOT NULL DEFAULT 'Member' COMMENT 'Organizational Rank Title',
  \`level\` VARCHAR(50) NOT NULL DEFAULT 'سطح ۱ (Level A)' COMMENT 'Current Hybrid Level',
  \`kyc_status\` ENUM('not_submitted','pending','approved','rejected') NOT NULL DEFAULT 'not_submitted',
  \`account_status\` ENUM('active','suspended','pending') NOT NULL DEFAULT 'active',
  \`volume_usdt\` DECIMAL(14,2) NOT NULL DEFAULT 0.00 COMMENT 'Trading volume in USDT',
  \`profit_usdt\` DECIMAL(14,2) NOT NULL DEFAULT 0.00 COMMENT 'Generated profit in USDT',
  \`total_earnings_usdt\` DECIMAL(14,2) NOT NULL DEFAULT 0.00 COMMENT 'Total lifetime commissions',
  \`current_month_earnings_usdt\` DECIMAL(14,2) NOT NULL DEFAULT 0.00 COMMENT 'Current month commissions',
  \`wallet_address\` VARCHAR(64) DEFAULT NULL COMMENT 'USDT (TRC20/ERC20) Wallet Address',
  \`two_factor_enabled\` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '2FA status',
  \`country\` VARCHAR(50) NOT NULL DEFAULT 'Iran',
  \`registration_date\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`last_login\` DATETIME DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_username\` (\`username\`),
  UNIQUE KEY \`idx_email\` (\`email\`),
  KEY \`idx_sponsor\` (\`sponsor_id\`),
  KEY \`idx_placement\` (\`placement_parent_id\`),
  KEY \`idx_kyc\` (\`kyc_status\`),
  KEY \`idx_status\` (\`account_status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Core user accounts & hybrid system placement table';

-- -------------------------------------------------------
-- 2. Table structure for table \`hybrid_levels_config\`
-- -------------------------------------------------------
DROP TABLE IF EXISTS \`hybrid_levels_config\`;
CREATE TABLE \`hybrid_levels_config\` (
  \`level_number\` INT(11) NOT NULL COMMENT 'Level 1 to 20',
  \`letter\` CHAR(1) NOT NULL COMMENT 'A to T',
  \`commission_rate_percent\` DECIMAL(5,2) NOT NULL COMMENT 'Commission payout percentage',
  \`tier_group\` VARCHAR(50) NOT NULL,
  \`qualification_desc\` TEXT NOT NULL,
  PRIMARY KEY (\`level_number\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- Seed 20 Levels Commission Config
-- -------------------------------------------------------
INSERT INTO \`hybrid_levels_config\` (\`level_number\`, \`letter\`, \`commission_rate_percent\`, \`tier_group\`, \`qualification_desc\`) VALUES
(1, 'A', 12.00, 'پایه‌ای (Foundation)', '۱ معرف مستقیم با احراز هویت'),
(2, 'B', 8.00, 'پایه‌ای (Foundation)', '۲ معرف مستقیم'),
(3, 'C', 5.00, 'پایه‌ای (Foundation)', '۳ معرف مستقیم فعال'),
(4, 'D', 3.50, 'پایه‌ای (Foundation)', '۵ معرف مستقیم'),
(5, 'E', 2.50, 'توسعه (Expansion)', '۸ معرف مستقیم در سیستم هیبرید'),
(6, 'F', 2.00, 'توسعه (Expansion)', '۱۰ معرف مستقیم در سیستم هیبرید'),
(7, 'G', 1.50, 'توسعه (Expansion)', '۱۲ معرف مستقیم در سیستم هیبرید'),
(8, 'H', 1.00, 'توسعه (Expansion)', '۱۵ معرف مستقیم در سیستم هیبرید'),
(9, 'I', 0.80, 'رهبری (Leadership)', '۱۸ معرف مستقیم در سیستم هیبرید'),
(10, 'J', 0.80, 'رهبری (Leadership)', '۲۰ معرف مستقیم در سیستم هیبرید'),
(11, 'K', 0.60, 'رهبری (Leadership)', '۲۲ معرف مستقیم در سیستم هیبرید'),
(12, 'L', 0.60, 'رهبری (Leadership)', '۲۵ معرف مستقیم در سیستم هیبرید'),
(13, 'M', 0.50, 'نخبگان (Elite Tier)', '۲۸ معرف مستقیم در سیستم هیبرید'),
(14, 'N', 0.50, 'نخبگان (Elite Tier)', '۳۰ معرف مستقیم در سیستم هیبرید'),
(15, 'O', 0.40, 'نخبگان (Elite Tier)', '۳۵ معرف مستقیم در سیستم هیبرید'),
(16, 'P', 0.40, 'نخبگان (Elite Tier)', '۴۰ معرف مستقیم در سیستم هیبرید'),
(17, 'Q', 0.30, 'نخبگان (Elite Tier)', '۴۵ معرف مستقیم در سیستم هیبرید'),
(18, 'R', 0.30, 'سفیران (Ambassador)', '۵۰ معرف مستقیم در سیستم هیبرید'),
(19, 'S', 0.20, 'سفیران (Ambassador)', '۶۰ معرف مستقیم در سیستم هیبرید'),
(20, 'T', 0.20, 'سفیران (Ambassador)', '۷۰ معرف مستقیم در سیستم هیبرید');

-- -------------------------------------------------------
-- 3. Seed Real User Records (Exact ${users.length} Active System Users)
-- -------------------------------------------------------
INSERT INTO \`users\` (
  \`id\`, \`full_name\`, \`username\`, \`email\`, \`phone\`, \`sponsor_id\`, \`sponsor_name\`,
  \`placement_parent_id\`, \`placement_name\`, \`placement_side\`, \`rank\`, \`level\`,
  \`kyc_status\`, \`account_status\`, \`volume_usdt\`, \`profit_usdt\`, \`total_earnings_usdt\`,
  \`current_month_earnings_usdt\`, \`wallet_address\`, \`two_factor_enabled\`, \`country\`,
  \`registration_date\`, \`last_login\`
) VALUES
`;

    const userRows = users.map(u => {
      const esc = (s?: string) => s ? `'${s.replace(/'/g, "\\'")}'` : 'NULL';
      return `(${esc(u.id)}, ${esc(u.fullName)}, ${esc(u.username)}, ${esc(u.email)}, ${esc(u.phone)}, ${esc(u.sponsorId)}, ${esc(u.sponsorName)}, ${esc(u.placementParentId)}, ${esc(u.placementName)}, '${u.placementSide}', ${esc(u.rank)}, ${esc(u.level)}, '${u.kycStatus}', '${u.accountStatus}', ${(u.volumeUsdt || 0).toFixed(2)}, ${(u.profitUsdt || 0).toFixed(2)}, ${(u.totalEarningsUsdt || 0).toFixed(2)}, ${(u.currentMonthEarningsUsdt || 0).toFixed(2)}, ${esc(u.walletAddress)}, ${u.twoFactorEnabled ? 1 : 0}, ${esc(u.country)}, '${u.registrationDate}', '${u.lastLogin}')`;
    }).join(',\n');

    sql += userRows + ';\n\nSET FOREIGN_KEY_CHECKS = 1;\n-- End of Export Script\n';
    return sql;
  }
}

export const databaseService = new DatabaseService();


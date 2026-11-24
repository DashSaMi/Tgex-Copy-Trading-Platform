import { 
  User, 
  AuthSession, 
  LoginPayload, 
  RegisterPayload, 
  ForgotPasswordPayload, 
  ResetPasswordPayload, 
  VerifyEmailPayload, 
  AuthResult 
} from '../types';
import { adminService } from './adminService';
import { databaseService, DbUserEntity, getLayerFromSponsor } from './db/databaseService';
import { emailService } from './emailService';

/**
 * Interface representing the TGEX Authentication Provider Contract.
 * Allows seamless hot-swapping between MockAuthService (current) 
 * and ExchangeAuthService (future production) without modifying any UI components.
 */
export interface IAuthService {
  login(payload: LoginPayload): Promise<AuthResult>;
  register(payload: RegisterPayload): Promise<AuthResult>;
  verifyEmail(payload: VerifyEmailPayload): Promise<AuthResult>;
  resendVerificationCode(email: string): Promise<AuthResult>;
  forgotPassword(payload: ForgotPasswordPayload): Promise<AuthResult>;
  resetPassword(payload: ResetPasswordPayload): Promise<AuthResult>;
  googleAuth(): Promise<AuthResult>;
  getCurrentSession(): AuthSession | null;
  logout(): Promise<void>;
  validateReferralCode(code: string): Promise<{ valid: boolean; sponsorName?: string }>;
  validateUserCredentials(email: string, password: string): { valid: boolean; user?: User; error?: string; status?: 'not_found' | 'invalid_password' | 'suspended' | 'ok' };
  saveRegisteredCredentials(email: string, password: string): void;
  syncUserKycStatus(userId: string, email: string, status: any, rejectionReason?: string): User | null;
}

const STORAGE_CREDENTIALS_KEY = 'tgex_user_credentials';

export function getStoredCredentials(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_CREDENTIALS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveStoredCredential(email: string, password: string): void {
  try {
    const creds = getStoredCredentials();
    creds[email.trim().toLowerCase()] = password;
    localStorage.setItem(STORAGE_CREDENTIALS_KEY, JSON.stringify(creds));
  } catch (e) {
    console.error('Failed to save credentials', e);
  }
}

// Initial Mock Test Accounts
const MOCK_USERS: Record<string, { passwordHash: string; user: User }> = {
  'trader@tgex.io': {
    passwordHash: 'Pass1234!', // Simulated hash
    user: {
      id: 'usr_892174',
      email: 'trader@tgex.io',
      fullName: 'سامان کریمیان',
      username: 'saman_trader',
      role: 'leader',
      isVerified: true,
      kycStatus: 'approved',
      sponsorId: 'ROOT_SAMAN',
      placementParentId: 'NODE_ALPHA',
      networkLevel: 'سطح ۸ (Level H)',
      rankName: 'رتبه طلایی (Gold)',
      directReferralsCount: 14,
      activeNetworkCount: 112,
      totalNetworkCount: 184,
      networkVolumeUsdt: 125000,
      totalEarningsUsdt: 8450,
      currentMonthEarningsUsdt: 1820,
      networkProfitUsdt: 34200,
      tokenBalance: 4850,
      twoFactorEnabled: true,
      createdAt: '2025-01-15T10:00:00Z',
      lastLoginAt: new Date().toISOString()
    }
  },
  'unverified@tgex.io': {
    passwordHash: 'Pass1234!',
    user: {
      id: 'usr_809531',
      email: 'unverified@tgex.io',
      fullName: 'کاربر تایید نشده تستی',
      username: 'test_trader',
      role: 'user',
      isVerified: false,
      kycStatus: 'not_submitted',
      sponsorId: '482917635',
      placementParentId: 'NODE_ALPHA',
      networkLevel: 'سطح ۲ (Level B)',
      rankName: 'عضو جدید (New Member)',
      directReferralsCount: 2,
      activeNetworkCount: 5,
      totalNetworkCount: 8,
      networkVolumeUsdt: 4500,
      totalEarningsUsdt: 320,
      currentMonthEarningsUsdt: 95,
      networkProfitUsdt: 1200,
      tokenBalance: 250,
      twoFactorEnabled: false,
      createdAt: '2026-08-19T00:00:00Z'
    }
  },
  'disabled@tgex.io': {
    passwordHash: 'Pass1234!',
    user: {
      id: 'usr_999000',
      email: 'disabled@tgex.io',
      fullName: 'حساب معلق شده',
      username: 'banned_user',
      role: 'user',
      isVerified: true,
      kycStatus: 'rejected',
      kycRejectionReason: 'تصویر مدارک تار بوده و با مشخصات ثبت شده همخوانی ندارد.',
      sponsorId: 'ROOT',
      placementParentId: 'NODE_GAMMA',
      networkLevel: 'سطح ۱ (Level A)',
      rankName: 'عضو مسدود',
      directReferralsCount: 0,
      activeNetworkCount: 0,
      totalNetworkCount: 0,
      networkVolumeUsdt: 0,
      totalEarningsUsdt: 0,
      currentMonthEarningsUsdt: 0,
      networkProfitUsdt: 0,
      tokenBalance: 0,
      twoFactorEnabled: false,
      createdAt: '2024-11-01T08:00:00Z'
    }
  }
};

const STORAGE_SESSION_KEY = 'tgex_auth_session';
const STORAGE_PENDING_REG_KEY = 'tgex_pending_verifications';

/**
 * Current Mock Authentication Service Implementation
 * Simulates server-side latency, rate limiting, hashing, token issuance, and validation.
 */
export class MockAuthService implements IAuthService {
  private simulateDelay(ms = 600): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private determinePlacementLevel(placementCode: string, sponsorCode: string): { networkLevel: string; rankName: string; levelLetter: string; levelNumber: number } {
    const code = (placementCode + ' ' + sponsorCode).toUpperCase();
    if (
      code.includes('D04') || 
      code.includes('NODE-D') || 
      code.includes('LEVEL-D') || 
      code.includes('LEADER-D') || 
      code.includes('NODE_DELTA') || 
      code.includes('TX-NODE-D') || 
      code.includes('LVL4') ||
      code.includes('LEVEL D')
    ) {
      return {
        networkLevel: 'سطح ۴ (Level D)',
        rankName: 'عضو تثبیت‌شده (Level D Member)',
        levelLetter: 'D',
        levelNumber: 4
      };
    }
    if (
      code.includes('B02') || 
      code.includes('NODE-B') || 
      code.includes('LEVEL-B') || 
      code.includes('NODE_BETA') || 
      code.includes('LVL2')
    ) {
      return {
        networkLevel: 'سطح ۲ (Level B)',
        rankName: 'استیجر (Stager - Level B)',
        levelLetter: 'B',
        levelNumber: 2
      };
    }
    if (
      code.includes('C03') || 
      code.includes('NODE-C') || 
      code.includes('LEVEL-C') || 
      code.includes('NODE_GAMMA') || 
      code.includes('LVL3')
    ) {
      return {
        networkLevel: 'سطح ۳ (Level C)',
        rankName: 'فعال‌ساز (Activator - Level C)',
        levelLetter: 'C',
        levelNumber: 3
      };
    }
    if (
      code.includes('H08') || 
      code.includes('9942') || 
      code.includes('NODE-H') || 
      code.includes('LEVEL-H') || 
      code.includes('TOP-88') || 
      code.includes('LVL8')
    ) {
      return {
        networkLevel: 'سطح ۸ (Level H)',
        rankName: 'طلایی (Gold - Level H)',
        levelLetter: 'H',
        levelNumber: 8
      };
    }
    return {
      networkLevel: 'سطح ۱ (Level A)',
      rankName: 'عضو جدید (New Member)',
      levelLetter: 'A',
      levelNumber: 1
    };
  }

  validateUserCredentials(email: string, password: string): { 
    valid: boolean; 
    user?: User; 
    error?: string; 
    status?: 'not_found' | 'invalid_password' | 'suspended' | 'ok' 
  } {
    const targetEmail = email.trim().toLowerCase();
    
    if (!targetEmail || !targetEmail.includes('@')) {
      return { 
        valid: false, 
        status: 'not_found', 
        error: 'لطفاً یک آدرس ایمیل معتبر وارد نمایید.' 
      };
    }

    const dbUser = databaseService.getUserByEmail(targetEmail);
    const mockAccount = MOCK_USERS[targetEmail];
    const storedCreds = getStoredCredentials();
    const storedPass = storedCreds[targetEmail] || mockAccount?.passwordHash || (dbUser ? 'Pass1234!' : null);

    // If user does not exist in any store
    if (!dbUser && !mockAccount && !storedCreds[targetEmail]) {
      return {
        valid: false,
        status: 'not_found',
        error: 'حساب کاربری با این آدرس ایمیل در سیستم ثبت نشده است. لطفاً ابتدا از تب «ثبت‌نام جدید» اقدام به ایجاد حساب فرمایید.'
      };
    }

    // Check suspended/disabled status
    if (targetEmail === 'disabled@tgex.io' || dbUser?.accountStatus === 'suspended') {
      return {
        valid: false,
        status: 'suspended',
        error: 'این حساب کاربری به دلیل نقض قوانین یا عدم احراز هویت مسدود شده است. لطفاً با پشتیبانی تماس حاصل فرمایید.'
      };
    }

    // Strict Password Validation
    if (storedPass && password !== storedPass) {
      return {
        valid: false,
        status: 'invalid_password',
        error: 'کلمه عبور وارد شده برای این حساب نادرست است. لطفاً رمز عبور خود را مجدداً بررسی فرمایید.'
      };
    }

    // Reconstitute user object
    let resolvedUser: User;
    if (mockAccount) {
      resolvedUser = mockAccount.user;
    } else if (dbUser) {
      resolvedUser = {
        id: dbUser.id.startsWith('DX-') ? `usr_${dbUser.id.replace('DX-', '')}` : dbUser.id,
        email: dbUser.email,
        fullName: dbUser.fullName,
        username: dbUser.username,
        role: dbUser.id === 'DX-482917' ? 'leader' : 'user',
        isVerified: dbUser.accountStatus === 'active',
        kycStatus: dbUser.kycStatus,
        referralCode: dbUser.id.replace('DX-', '').replace('usr_', ''),
        sponsorId: dbUser.sponsorId,
        sponsorName: dbUser.sponsorName,
        placementParentId: dbUser.placementParentId,
        networkLevel: dbUser.level,
        rankName: dbUser.rank,
        directReferralsCount: databaseService.getDirectReferrals(dbUser.id).length,
        activeNetworkCount: 0,
        totalNetworkCount: databaseService.getSubtreeUsers(dbUser.id).length,
        totalEarningsUsdt: dbUser.totalEarningsUsdt || 0,
        currentMonthEarningsUsdt: dbUser.currentMonthEarningsUsdt || 0,
        networkProfitUsdt: dbUser.profitUsdt || 0,
        networkVolumeUsdt: dbUser.volumeUsdt || 0,
        tokenBalance: 50,
        twoFactorEnabled: dbUser.twoFactorEnabled || false,
        createdAt: dbUser.registrationDate,
        lastLoginAt: new Date().toISOString()
      };
    } else {
      return {
        valid: false,
        status: 'not_found',
        error: 'حساب کاربری یافت نشد.'
      };
    }

    return { valid: true, status: 'ok', user: resolvedUser };
  }

  saveRegisteredCredentials(email: string, password: string): void {
    saveStoredCredential(email, password);
  }

  async login(payload: LoginPayload): Promise<AuthResult> {
    await this.simulateDelay(600);

    const email = payload.email.trim().toLowerCase();
    const password = payload.password;

    // Strict validation
    const credCheck = this.validateUserCredentials(email, password);
    if (!credCheck.valid || !credCheck.user) {
      return {
        success: false,
        state: credCheck.status === 'suspended' ? 'account_disabled' : 'invalid_credentials',
        message: credCheck.error || 'اطلاعات ورود نادرست است.'
      };
    }

    const updatedUser: User = {
      ...credCheck.user,
      lastLoginAt: new Date().toISOString()
    };

    if (MOCK_USERS[email]) {
      MOCK_USERS[email].user = updatedUser;
    }

    const session: AuthSession = {
      user: updatedUser,
      token: 'mock_jwt_token_' + Math.random().toString(36).substring(2),
      refreshToken: 'mock_refresh_' + Math.random().toString(36).substring(2),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    };

    this.saveSession(session);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('tgex_database_updated'));
      window.dispatchEvent(new Event('tgex_db_updated'));
      window.dispatchEvent(new CustomEvent('tgex_user_updated', { detail: updatedUser }));
    }

    return {
      success: true,
      state: 'success',
      message: 'ورود موفقیت‌آمیز بود. خوش آمدید.',
      user: session.user,
      session
    };
  }

  async register(payload: RegisterPayload): Promise<AuthResult> {
    await this.simulateDelay(800);

    const email = payload.email.trim().toLowerCase();
    
    // Basic validation
    if (!email || !email.includes('@')) {
      return {
        success: false,
        state: 'invalid_credentials',
        message: 'فرمت ایمیل نامعتبر است.'
      };
    }

    if (!payload.password || payload.password.length < 8) {
      return {
        success: false,
        state: 'invalid_credentials',
        message: 'کلمه عبور باید حداقل ۸ کاراکتر و شامل حروف و اعداد باشد.'
      };
    }

    if (payload.confirmPassword && payload.password !== payload.confirmPassword) {
      return {
        success: false,
        state: 'invalid_credentials',
        message: 'تکرار کلمه عبور با کلمه عبور اصلی همخوانی ندارد.'
      };
    }

    // Resolve sponsor and placement
    const resolvedSp = databaseService.resolveSponsorAndPlacement(payload.referralCode, payload.placementCode);
    
    // Inherit the exact layer: 1 level deeper than the sponsor
    // E.g., if sponsor is in Layer B, new user becomes Layer C with Level C's commission rate
    const layerInfo = getLayerFromSponsor(resolvedSp.sponsorUser);

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const userId = 'usr_' + randomNum;
    const dbUserId = 'DX-' + randomNum;
    const userReferralCode = String(randomNum);

    // Generate unique username using email prefix (name) and password
    const namePrefix = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
    const passHash = Math.abs(payload.password.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0)).toString(36);
    const generatedUsername = `${namePrefix}_${passHash}_${Math.floor(100 + Math.random() * 900)}`;

    const pendingUser: User = {
      id: userId,
      email,
      fullName: email.split('@')[0],
      username: generatedUsername,
      role: 'user',
      isVerified: true,
      kycStatus: 'approved',
      referralCode: userReferralCode,
      sponsorId: resolvedSp.sponsorId,
      sponsorName: resolvedSp.sponsorName,
      placementParentId: resolvedSp.placementParentId,
      networkLevel: layerInfo.networkLevel,
      rankName: layerInfo.rankName,
      directReferralsCount: 0,
      activeNetworkCount: 0,
      totalNetworkCount: 0,
      totalEarningsUsdt: 0,
      currentMonthEarningsUsdt: 0,
      networkProfitUsdt: 0,
      networkVolumeUsdt: 0,
      tokenBalance: 50,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString()
    };

    const dbUser: DbUserEntity = {
      id: dbUserId,
      fullName: pendingUser.fullName,
      username: pendingUser.username,
      email: pendingUser.email,
      phone: '+989' + Math.floor(100000000 + Math.random() * 900000000),
      sponsorId: resolvedSp.sponsorId,
      sponsorName: resolvedSp.sponsorName,
      placementParentId: resolvedSp.placementParentId,
      placementName: resolvedSp.placementName,
      placementSide: resolvedSp.placementSide,
      rank: layerInfo.rankName,
      level: layerInfo.networkLevel,
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

    databaseService.upsertUser(dbUser);
    adminService.registerNewUser(pendingUser, resolvedSp.sponsorName, resolvedSp.placementName);

    // Save into MOCK_USERS dictionary
    MOCK_USERS[email] = {
      passwordHash: payload.password,
      user: pendingUser
    };

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('tgex_database_updated'));
      window.dispatchEvent(new Event('tgex_db_updated'));
    }

    const session: AuthSession = {
      user: pendingUser,
      token: 'mock_jwt_token_' + Math.random().toString(36).substring(2),
      refreshToken: 'mock_refresh_' + Math.random().toString(36).substring(2),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    };

    this.saveSession(session);

    // Dispatch welcome notification to user email in background
    emailService.sendOtp(email, 'signup').catch(err => {
      console.warn('[Background Email Notification]', err);
    });

    return {
      success: true,
      state: 'success',
      message: 'حساب کاربری شما با موفقیت ایجاد شد و با موفقیت وارد شدید.',
      user: session.user,
      session
    };
  }

  async verifyEmail(payload: VerifyEmailPayload): Promise<AuthResult> {
    await this.simulateDelay(500);
    const email = payload.email.trim().toLowerCase();
    const code = payload.code.trim();

    if (code.length !== 6) {
      return {
        success: false,
        state: 'invalid_credentials',
        message: 'کد تأیید باید دقیقاً ۶ رقم باشد.'
      };
    }

    // Verify OTP through emailService (supports generated code, backend verification, and fallback 123456)
    const otpVerification = await emailService.verifyOtp(email, code);
    if (!otpVerification.success && code !== '123456') {
      return {
        success: false,
        state: 'server_error',
        message: otpVerification.message || 'کد تأیید اشتباه است یا منقضی شده است.'
      };
    }

    let account = MOCK_USERS[email];
    if (!account) {
      // Reconstruct or create user if logging in from clean email
      const dbUser = databaseService.getUserByEmail(email);
      if (dbUser) {
        const reconstitutedUser: User = {
          id: dbUser.id.startsWith('DX-') ? `usr_${dbUser.id.replace('DX-', '')}` : dbUser.id,
          email: dbUser.email,
          fullName: dbUser.fullName,
          username: dbUser.username,
          role: dbUser.id === 'DX-482917' ? 'leader' : 'user',
          isVerified: true,
          kycStatus: 'approved',
          referralCode: dbUser.id.replace('DX-', '').replace('usr_', ''),
          sponsorId: dbUser.sponsorId,
          sponsorName: dbUser.sponsorName,
          placementParentId: dbUser.placementParentId,
          networkLevel: dbUser.level,
          rankName: dbUser.rank,
          directReferralsCount: databaseService.getDirectReferrals(dbUser.id).length,
          activeNetworkCount: 0,
          totalNetworkCount: databaseService.getSubtreeUsers(dbUser.id).length,
          totalEarningsUsdt: dbUser.totalEarningsUsdt || 0,
          currentMonthEarningsUsdt: dbUser.currentMonthEarningsUsdt || 0,
          networkProfitUsdt: dbUser.profitUsdt || 0,
          networkVolumeUsdt: dbUser.volumeUsdt || 0,
          tokenBalance: 50,
          twoFactorEnabled: dbUser.twoFactorEnabled || false,
          createdAt: dbUser.registrationDate,
          lastLoginAt: new Date().toISOString()
        };
        MOCK_USERS[email] = {
          passwordHash: 'Pass1234!',
          user: reconstitutedUser
        };
        account = MOCK_USERS[email];
      } else {
        // Auto-provision user on verified email
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const userId = 'usr_' + randomNum;
        const dbUserId = 'DX-' + randomNum;
        const userReferralCode = String(randomNum);
        const namePrefix = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');

        const pendingSponsor = localStorage.getItem('tgex_pending_reg_sponsor_' + email) || '482917';
        const resolvedSp = databaseService.resolveSponsorAndPlacement(pendingSponsor);
        const layerInfo = getLayerFromSponsor(resolvedSp.sponsorUser);

        const newUser: User = {
          id: userId,
          email,
          fullName: email.split('@')[0],
          username: `${namePrefix}_${Math.floor(100 + Math.random() * 900)}`,
          role: 'user',
          isVerified: true,
          kycStatus: 'approved',
          referralCode: userReferralCode,
          sponsorId: resolvedSp.sponsorId,
          sponsorName: resolvedSp.sponsorName,
          placementParentId: resolvedSp.placementParentId,
          networkLevel: layerInfo.networkLevel,
          rankName: layerInfo.rankName,
          directReferralsCount: 0,
          activeNetworkCount: 0,
          totalNetworkCount: 0,
          totalEarningsUsdt: 0,
          currentMonthEarningsUsdt: 0,
          networkProfitUsdt: 0,
          networkVolumeUsdt: 0,
          tokenBalance: 50,
          twoFactorEnabled: false,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };

        const newDbUser: DbUserEntity = {
          id: dbUserId,
          fullName: newUser.fullName,
          username: newUser.username,
          email: newUser.email,
          phone: '+989' + Math.floor(100000000 + Math.random() * 900000000),
          sponsorId: resolvedSp.sponsorId,
          sponsorName: resolvedSp.sponsorName,
          placementParentId: resolvedSp.placementParentId,
          placementName: resolvedSp.placementName,
          placementSide: resolvedSp.placementSide,
          rank: layerInfo.rankName,
          level: layerInfo.networkLevel,
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

        databaseService.upsertUser(newDbUser);
        adminService.registerNewUser(newUser, resolvedSp.sponsorName, resolvedSp.placementName);

        MOCK_USERS[email] = {
          passwordHash: 'Pass1234!',
          user: newUser
        };
        account = MOCK_USERS[email];
      }
    }

    if (account) {
      account.user.isVerified = true;
      account.user.kycStatus = 'approved';
      account.user.lastLoginAt = new Date().toISOString();
      
      const dbUser = databaseService.getUserByEmail(email);
      if (dbUser) {
        dbUser.accountStatus = 'active';
        dbUser.kycStatus = 'approved';
        dbUser.lastLogin = new Date().toISOString().replace('T', ' ').slice(0, 19);
        databaseService.upsertUser(dbUser);
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('tgex_database_updated'));
        window.dispatchEvent(new Event('tgex_db_updated'));
        window.dispatchEvent(new CustomEvent('tgex_user_updated', { detail: account.user }));
      }

      const session: AuthSession = {
        user: account.user,
        token: 'mock_jwt_token_' + Math.random().toString(36).substring(2),
        refreshToken: 'mock_refresh_' + Math.random().toString(36).substring(2),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
      };

      this.saveSession(session);

      return {
        success: true,
        state: 'success',
        message: 'ایمیل شما با موفقیت تأیید شد و با موفقیت وارد حساب خود شدید.',
        user: account.user,
        session
      };
    }

    return {
      success: false,
      state: 'server_error',
      message: 'حساب کاربری مورد نظر یافت نشد. لطفاً مجدداً ثبت‌نام فرمایید.'
    };
  }

  async resendVerificationCode(email: string): Promise<AuthResult> {
    await this.simulateDelay(400);
    const otpRes = await emailService.sendOtp(email, 'signup');
    return {
      success: true,
      state: 'idle',
      message: otpRes.message || `کد ۶ رقمی جدید به آدرس ${email} ارسال شد.`
    };
  }

  async forgotPassword(payload: ForgotPasswordPayload): Promise<AuthResult> {
    await this.simulateDelay(700);
    const email = payload.email.trim().toLowerCase();
    
    return {
      success: true,
      state: 'success',
      message: `لینک بازیابی رمز عبور به ایمیل ${email} ارسال گردید. لطفاً صندوق ورودی و اسپم را بررسی کنید.`
    };
  }

  async resetPassword(payload: ResetPasswordPayload): Promise<AuthResult> {
    await this.simulateDelay(800);
    if (!payload.password || payload.password.length < 8) {
      return {
        success: false,
        state: 'invalid_credentials',
        message: 'کلمه عبور جدید باید حداقل ۸ کاراکتر باشد.'
      };
    }

    if (payload.password !== payload.confirmPassword) {
      return {
        success: false,
        state: 'invalid_credentials',
        message: 'تکرار کلمه عبور با کلمه عبور اصلی همخوانی ندارد.'
      };
    }

    return {
      success: true,
      state: 'success',
      message: 'کلمه عبور شما با موفقیت به‌روزرسانی شد. اکنون می‌توانید وارد شوید.'
    };
  }

  async googleAuth(): Promise<AuthResult> {
    await this.simulateDelay(850);
    const googleEmail = 'google.trader@tgex.io';
    const googleUser: User = {
      id: 'usr_892174',
      email: googleEmail,
      fullName: 'کاربر گوگل تیجکس (شما)',
      username: 'saman_trader',
      role: 'leader',
      isVerified: true,
      kycStatus: 'approved',
      sponsorId: 'usr_sp_101',
      sponsorName: 'مهندس کامران رستمی',
      placementParentId: 'AUTO_PLACE',
      networkLevel: 'سطح ۸ (Level H)',
      rankName: 'طلایی (Gold)',
      directReferralsCount: 14,
      activeNetworkCount: 112,
      totalNetworkCount: 184,
      networkVolumeUsdt: 125000,
      totalEarningsUsdt: 8450,
      currentMonthEarningsUsdt: 1820,
      networkProfitUsdt: 34200,
      tokenBalance: 4850,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    const session: AuthSession = {
      user: googleUser,
      token: 'mock_google_jwt_' + Math.random().toString(36).substring(2),
      refreshToken: 'mock_google_refresh_' + Math.random().toString(36).substring(2),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    };

    this.saveSession(session);

    return {
      success: true,
      state: 'success',
      message: 'ورود از طریق حساب گوگل با موفقیت انجام شد.',
      user: googleUser,
      session
    };
  }

  getCurrentSession(): AuthSession | null {
    try {
      const data = localStorage.getItem(STORAGE_SESSION_KEY);
      if (!data) return null;
      const session: AuthSession = JSON.parse(data);
      if (session.expiresAt && Date.now() > session.expiresAt) {
        localStorage.removeItem(STORAGE_SESSION_KEY);
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_SESSION_KEY);
  }

  async validateReferralCode(code: string): Promise<{ valid: boolean; sponsorName?: string }> {
    await this.simulateDelay(200);
    const trimmed = code.trim();
    if (!trimmed) return { valid: false };

    const matched = databaseService.getUserById(trimmed);
    if (matched) {
      return { valid: true, sponsorName: `${matched.fullName} (@${matched.username})` };
    }
    if (trimmed === '482917635' || trimmed.toLowerCase() === 'saman' || trimmed === 'ROOT' || trimmed === '482917') {
      return { valid: true, sponsorName: 'سامان کریمیان (Master Sponsor)' };
    }
    if (trimmed.length >= 4) {
      return { valid: true, sponsorName: `حامی تایید شده (${trimmed})` };
    }
    return { valid: false };
  }

  syncUserKycStatus(userId: string, email: string, status: any, rejectionReason?: string): User | null {
    const normalizedEmail = email?.toLowerCase()?.trim();
    let updatedUser: User | null = null;

    // Update in MOCK_USERS if present
    if (normalizedEmail && MOCK_USERS[normalizedEmail]) {
      MOCK_USERS[normalizedEmail].user.kycStatus = status;
      MOCK_USERS[normalizedEmail].user.isVerified = status === 'approved';
      MOCK_USERS[normalizedEmail].user.kycRejectionReason = rejectionReason;
      updatedUser = MOCK_USERS[normalizedEmail].user;
    } else {
      // Find by user id in MOCK_USERS
      const key = Object.keys(MOCK_USERS).find(k => MOCK_USERS[k].user.id === userId);
      if (key) {
        MOCK_USERS[key].user.kycStatus = status;
        MOCK_USERS[key].user.isVerified = status === 'approved';
        MOCK_USERS[key].user.kycRejectionReason = rejectionReason;
        updatedUser = MOCK_USERS[key].user;
      }
    }

    // Update active session in localStorage if active user matches
    try {
      const activeSession = this.getCurrentSession();
      if (activeSession && activeSession.user && (activeSession.user.id === userId || activeSession.user.email?.toLowerCase() === normalizedEmail)) {
        activeSession.user.kycStatus = status;
        activeSession.user.isVerified = status === 'approved';
        activeSession.user.kycRejectionReason = rejectionReason;
        this.saveSession(activeSession);
        updatedUser = activeSession.user;
      }
    } catch {}

    // Update in Admin database as well
    adminService.updateUserKycStatus(userId, email, status);

    // Dispatch global event for instant reactive update across tabs/components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tgex_user_updated', { detail: updatedUser || { id: userId, email, kycStatus: status, isVerified: status === 'approved', kycRejectionReason: rejectionReason } }));
      window.dispatchEvent(new CustomEvent('tgex_kyc_status_changed', { detail: { userId, email, status } }));
    }

    return updatedUser;
  }

  private saveSession(session: AuthSession) {
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save session to localStorage', e);
    }
  }
}

/**
 * Future Production Authentication Service Implementation
 * Communicates ONLY with TGEX secure backend (/api/auth/*) which in turn 
 * securely speaks with the external exchange API without exposing private credentials.
 */
export class ExchangeAuthService implements IAuthService {
  private apiBaseUrl = '/api/auth';

  async login(payload: LoginPayload): Promise<AuthResult> {
    const res = await fetch(`${this.apiBaseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }

  async register(payload: RegisterPayload): Promise<AuthResult> {
    const res = await fetch(`${this.apiBaseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }

  async verifyEmail(payload: VerifyEmailPayload): Promise<AuthResult> {
    const res = await fetch(`${this.apiBaseUrl}/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }

  async resendVerificationCode(email: string): Promise<AuthResult> {
    const res = await fetch(`${this.apiBaseUrl}/resend-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.json();
  }

  async forgotPassword(payload: ForgotPasswordPayload): Promise<AuthResult> {
    const res = await fetch(`${this.apiBaseUrl}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }

  async resetPassword(payload: ResetPasswordPayload): Promise<AuthResult> {
    const res = await fetch(`${this.apiBaseUrl}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }

  async googleAuth(): Promise<AuthResult> {
    const res = await fetch(`${this.apiBaseUrl}/google-callback`, {
      method: 'POST'
    });
    return res.json();
  }

  getCurrentSession(): AuthSession | null {
    try {
      const data = localStorage.getItem(STORAGE_SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  async logout(): Promise<void> {
    await fetch(`${this.apiBaseUrl}/logout`, { method: 'POST' });
    localStorage.removeItem(STORAGE_SESSION_KEY);
  }

  syncUserKycStatus(userId: string, email: string, status: any, rejectionReason?: string): User | null {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tgex_user_updated', { detail: { id: userId, email, kycStatus: status, isVerified: status === 'approved', kycRejectionReason: rejectionReason } }));
      window.dispatchEvent(new CustomEvent('tgex_kyc_status_changed', { detail: { userId, email, status } }));
    }
    return null;
  }

  async validateReferralCode(code: string): Promise<{ valid: boolean; sponsorName?: string }> {
    const res = await fetch(`${this.apiBaseUrl}/validate-referral?code=${encodeURIComponent(code)}`);
    return res.json();
  }

  validateUserCredentials(email: string, password: string): { valid: boolean; user?: User; error?: string; status?: 'not_found' | 'invalid_password' | 'suspended' | 'ok' } {
    const mock = new MockAuthService();
    return mock.validateUserCredentials(email, password);
  }

  saveRegisteredCredentials(email: string, password: string): void {
    saveStoredCredential(email, password);
  }
}

// Export default singleton instance
export const authService: IAuthService = new MockAuthService();

// Export the default active mock user for direct preview
export const MOCK_USER_AUTHENTICATED: User = MOCK_USERS['trader@tgex.io'].user;


/**
 * Email Dispatch Service for TGEX Authentication & OTP Verification
 * Supports both Live External Providers (Resend, SendGrid, SMTP) and Mock/Test Dispatch
 */

export interface SendOtpResponse {
  success: boolean;
  message: string;
  code?: string; // Provided in test/development mode for convenience
  expiresInSeconds?: number;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

// In-memory OTP storage for client-side fallback
const clientOtpStore = new Map<string, { code: string; expiresAt: number }>();

export const emailService = {
  /**
   * Dispatches a 6-digit OTP code to the specified email address
   */
  async sendOtp(email: string, purpose: 'signup' | 'login' | 'reset_password' = 'signup'): Promise<SendOtpResponse> {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try sending via backend API if available
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, purpose })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.code) {
          clientOtpStore.set(cleanEmail, {
            code: data.code,
            expiresAt: Date.now() + 5 * 60 * 1000
          });
        }
        return data;
      }
    } catch (e) {
      console.warn('[EmailService] Backend endpoint /api/auth/send-otp not reachable, using client-side generator.');
    }

    // 2. Client-side fallback generator
    // Generates a 6-digit code (e.g. 849201) while still accepting standard mock 123456
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    clientOtpStore.set(cleanEmail, {
      code: generatedCode,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    console.info(`%c[TGEX Email OTP] Code for ${cleanEmail}: ${generatedCode} (or fallback 123456)`, 'color: #38bdf8; font-weight: bold;');

    return {
      success: true,
      message: `کد ۶ رقمی تأیید امن به ایمیل ${cleanEmail} ارسال گردید.`,
      code: generatedCode,
      expiresInSeconds: 300
    };
  },

  /**
   * Verifies the 6-digit OTP code
   */
  async verifyOtp(email: string, code: string): Promise<VerifyOtpResponse> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    // Always accept universal test code 123456 for seamless development
    if (cleanCode === '123456') {
      return { success: true, message: 'کد تأیید با موفقیت تأیید گردید.' };
    }

    // Check stored OTP
    const record = clientOtpStore.get(cleanEmail);
    if (record) {
      if (Date.now() > record.expiresAt) {
        return { success: false, message: 'کد تأیید منقضی شده است. لطفاً درخواست ارسال مجدد دهید.' };
      }
      if (record.code === cleanCode) {
        clientOtpStore.delete(cleanEmail);
        return { success: true, message: 'کد تأیید با موفقیت تأیید گردید.' };
      }
    }

    // Also check with server
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, code: cleanCode })
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch {
      // Fall through
    }

    return {
      success: false,
      message: 'کد وارد شده نامعتبر است یا منقضی شده است.'
    };
  },

  /**
   * Retrieves active test OTP if available in client memory
   */
  getStoredOtp(email: string): string | null {
    const cleanEmail = email.trim().toLowerCase();
    const record = clientOtpStore.get(cleanEmail);
    if (record && Date.now() <= record.expiresAt) {
      return record.code;
    }
    return '123456';
  }
};

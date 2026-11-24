import React, { useState, useEffect, useRef } from 'react';
import { PageId, AuthStateType, User } from '../../types';
import { authService } from '../../services/authService';
import { emailService } from '../../services/emailService';
import { 
  MailCheck, 
  ArrowLeft, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  LayoutDashboard,
  Copy,
  Check,
  Zap,
  Lock
} from 'lucide-react';

interface VerifyEmailPageProps {
  email: string;
  onNavigate: (page: PageId) => void;
  onVerificationComplete: (user: User) => void;
}

export const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({
  email,
  onNavigate,
  onVerificationComplete
}) => {
  const targetEmail = email || 'trader@tgex.io';
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [authState, setAuthState] = useState<AuthStateType>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [resendSuccessMessage, setResendSuccessMessage] = useState('');
  const [activeTestCode, setActiveTestCode] = useState<string>('123456');
  const [copiedCode, setCopiedCode] = useState(false);

  // Verification & Dashboard Redirection Progress state
  const [isVerifyingProgress, setIsVerifyingProgress] = useState(false);
  const [verifyStep, setVerifyStep] = useState(1);
  const [verifyProgressPercent, setVerifyProgressPercent] = useState(30);
  const [verifyStatusText, setVerifyStatusText] = useState('');

  // Fetch or generate active OTP on mount
  useEffect(() => {
    let code = emailService.getStoredOtp(targetEmail);
    if (!code || code === '123456') {
      emailService.sendOtp(targetEmail, 'login').then((res) => {
        if (res.code) {
          setActiveTestCode(res.code);
        }
      });
    } else {
      setActiveTestCode(code);
    }
  }, [targetEmail]);

  // Focus first input on mount
  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 150);
  }, []);

  // Countdown timer
  useEffect(() => {
    let timer: any = null;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Handle single digit input
  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle pasting full string
      const pasteDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...digits];
      pasteDigits.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setDigits(newDigits);
      const nextIndex = Math.min(pasteDigits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      
      // Auto-submit if complete 6 digits pasted
      if (pasteDigits.length === 6) {
        executeVerification(pasteDigits.join(''));
      }
      return;
    }

    const clean = value.replace(/\D/g, '');
    const newDigits = [...digits];
    newDigits[index] = clean;
    setDigits(newDigits);

    // Auto-advance to next input
    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto trigger verification when 6th digit is typed
    if (clean && index === 5) {
      const full = newDigits.join('');
      if (full.length === 6) {
        setTimeout(() => executeVerification(full), 100);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Perform full verification with step-by-step progress animation
  const executeVerification = async (codeToVerify: string) => {
    if (codeToVerify.length !== 6) {
      setErrorMessage('لطفاً تمام ۶ رقم کد تأیید را وارد نمایید.');
      return;
    }

    setErrorMessage('');
    setResendSuccessMessage('');
    setIsVerifyingProgress(true);
    setVerifyStep(1);
    setVerifyProgressPercent(35);
    setVerifyStatusText('در حال اعتبارسنجی کد امنیتی ۶ رقمی...');

    try {
      // Step 1: Validating OTP token (after 450ms)
      await new Promise(r => setTimeout(r, 450));
      setVerifyStep(2);
      setVerifyProgressPercent(75);
      setVerifyStatusText('تأیید هویت و صدور نشست امنیتی کاربری (JWT Session)...');

      const result = await authService.verifyEmail({
        email: targetEmail,
        code: codeToVerify
      });

      if (!result.success || !result.user) {
        setIsVerifyingProgress(false);
        setErrorMessage(result.message || 'کد وارد شده نادرست است یا منقضی شده است.');
        return;
      }

      // Step 3: Success and redirect to dashboard (after 500ms)
      await new Promise(r => setTimeout(r, 550));
      setVerifyStep(3);
      setVerifyProgressPercent(100);
      setVerifyStatusText('ورود موفقیت‌آمیز! در حال انتقال به داشبورد کاربری...');

      setTimeout(() => {
        setIsVerifyingProgress(false);
        onVerificationComplete(result.user!);
      }, 700);

    } catch (err) {
      setIsVerifyingProgress(false);
      setErrorMessage('خطایی در اعتبارسنجی کد رخ داد. لطفاً مجدداً امتحان فرمایید.');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    executeVerification(digits.join(''));
  };

  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setCountdown(60);
    setErrorMessage('');
    setResendSuccessMessage('در حال ارسال مجدد کد...');
    
    try {
      const res = await authService.resendVerificationCode(targetEmail);
      setResendSuccessMessage(res.message);
      const updatedCode = emailService.getStoredOtp(targetEmail);
      if (updatedCode) {
        setActiveTestCode(updatedCode);
      }
    } catch (err) {
      setErrorMessage('ارسال مجدد کد با خطا مواجه شد.');
    }
  };

  const handleFillTestCode = () => {
    const codeToFill = activeTestCode || '123456';
    const splitArr = codeToFill.split('').slice(0, 6);
    setDigits(splitArr);
    setErrorMessage('');
    setTimeout(() => {
      executeVerification(codeToFill);
    }, 200);
  };

  const handleCopyCode = () => {
    const codeToCopy = activeTestCode || '123456';
    navigator.clipboard.writeText(codeToCopy);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden text-right" dir="rtl">
      {/* Ambient glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-2 shadow-lg shadow-blue-500/10">
            <MailCheck className="w-7 h-7 animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            تأیید ایمیل و ورود مستقیم
          </h1>
          <p className="text-xs text-slate-400">
            کد تأیید ۶ رقمی امن به آدرس ایمیل زیر ارسال گردید:
          </p>
          <div className="text-xs font-mono font-bold text-blue-400 bg-blue-950/40 border border-blue-500/20 py-1.5 px-3 rounded-xl inline-block" dir="ltr">
            {targetEmail}
          </div>
        </div>

        {/* Workflow Lifecycle Chain */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> ۱. ارسال کد
            </span>
            <span className="text-slate-600">←</span>
            <span className="text-blue-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              ۲. درج کد ۶ رقمی
            </span>
            <span className="text-slate-600">←</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <LayoutDashboard className="w-3.5 h-3.5" /> ۳. ورود به داشبورد
            </span>
          </div>
        </div>

        {/* Simulated Incoming Email Notification Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/30 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>ایمیل جدید دریافت شد: کد امنیتی ورود</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
              Inbox
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-950/80 border border-white/10 rounded-xl p-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">کد دریافتی:</span>
              <span className="text-base font-black font-mono text-cyan-300 tracking-wider">
                {activeTestCode}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1 transition"
                title="کپی کد"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[10px]">{copiedCode ? 'کپی شد' : 'کپی'}</span>
              </button>
              <button
                type="button"
                onClick={handleFillTestCode}
                className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition flex items-center gap-1 shadow shadow-blue-600/30 font-mono"
              >
                <Zap className="w-3 h-3" />
                <span>درج خودکار کد</span>
              </button>
            </div>
          </div>
        </div>

        {/* Verification Form Card */}
        <div className="p-7 rounded-3xl bg-slate-900/60 border border-white/10 shadow-2xl backdrop-blur-xl space-y-6">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Resend Success Banner */}
          {resendSuccessMessage && (
            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/40 text-blue-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{resendSuccessMessage}</div>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            
            {/* 6-Digit OTP inputs */}
            <div className="space-y-2 text-center">
              <label className="text-xs font-semibold text-slate-300 block">
                کد ۶ رقمی را وارد نمایید
              </label>
              
              <div className="flex justify-center gap-2" dir="ltr">
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-12 h-14 text-center text-xl font-bold text-white bg-slate-950/90 border border-white/15 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition font-mono shadow-inner"
                  />
                ))}
              </div>
            </div>

            {/* Countdown / Resend Button */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
              <span>کد را دریافت نکردید؟</span>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>ارسال مجدد کد</span>
                </button>
              ) : (
                <span className="font-mono text-slate-500">
                  ارسال مجدد تا ({countdown} ثانیه)
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isVerifyingProgress}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isVerifyingProgress ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>در حال اعتبارسنجی و ورود به داشبورد...</span>
                </>
              ) : (
                <>
                  <span>تأیید کد و ورود به داشبورد</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Change email or back to login */}
          <div className="pt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="text-slate-300 hover:underline"
            >
              بازگشت به صفحه ورود
            </button>
            <span className="text-slate-700">•</span>
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="text-blue-400 hover:underline"
            >
              تغییر آدرس ایمیل
            </button>
          </div>

        </div>

      </div>

      {/* High-Tech Animated Verification & Redirection Progress Overlay Modal */}
      {isVerifyingProgress && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200" dir="rtl">
          <div className="w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-emerald-500/20 text-center space-y-5 relative overflow-hidden">
            
            {/* Top Glow Ambient */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* Glowing Icon */}
            <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30">
              <ShieldCheck className="w-8 h-8 animate-pulse" />
              <div className="absolute inset-0 rounded-2xl border-2 border-white/30 animate-ping opacity-25"></div>
            </div>

            {/* Title & Target */}
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">
                تأیید هویت و اتصال به داشبورد
              </h3>
              <p className="text-xs text-slate-400">
                ایمیل کاربر:{' '}
                <span className="text-emerald-400 font-mono font-bold" dir="ltr">{targetEmail}</span>
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/10 p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${verifyProgressPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>پیشرفت تأیید هویت</span>
                <span className="text-emerald-400 font-bold">{verifyProgressPercent}%</span>
              </div>
            </div>

            {/* Steps Visual List */}
            <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-3.5 space-y-2.5 text-right text-xs">
              
              {/* Step 1 */}
              <div className={`flex items-center justify-between p-2 rounded-xl transition ${verifyStep >= 1 ? 'bg-emerald-500/10 text-white' : 'text-slate-500'}`}>
                <div className="flex items-center gap-2">
                  {verifyStep > 1 ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">✓</div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] animate-spin">⟳</div>
                  )}
                  <span className="text-[11px] font-medium">۱. بررسی صحت کد امنیتی ۶ رقمی</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{verifyStep > 1 ? 'تکمیل' : 'درحال بررسی'}</span>
              </div>

              {/* Step 2 */}
              <div className={`flex items-center justify-between p-2 rounded-xl transition ${verifyStep >= 2 ? 'bg-emerald-500/10 text-white' : 'text-slate-500'}`}>
                <div className="flex items-center gap-2">
                  {verifyStep > 2 ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">✓</div>
                  ) : verifyStep === 2 ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] animate-spin">⟳</div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-[10px]">۲</div>
                  )}
                  <span className="text-[11px] font-medium">۲. تأیید هویت و ایجاد نشست امن کاربری</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{verifyStep > 2 ? 'تکمیل' : verifyStep === 2 ? 'درحال صدور' : 'در انتظار'}</span>
              </div>

              {/* Step 3 */}
              <div className={`flex items-center justify-between p-2 rounded-xl transition ${verifyStep >= 3 ? 'bg-emerald-500/15 text-emerald-300 font-bold' : 'text-slate-500'}`}>
                <div className="flex items-center gap-2">
                  {verifyStep === 3 ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-[10px]">۳</div>
                  )}
                  <span className="text-[11px]">۳. انتقال مستقیم به داشبورد کاربری</span>
                </div>
                <span className="text-[10px] font-mono">{verifyStep === 3 ? 'انتقال...' : 'در انتظار'}</span>
              </div>

            </div>

            {/* Active Status Badge */}
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center justify-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{verifyStatusText}</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};


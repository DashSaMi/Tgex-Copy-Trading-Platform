import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId, User } from '../../types';
import { authService } from '../../services/authService';
import { emailService } from '../../services/emailService';
import { useLanguage } from '../../context/LanguageContext';
import authVaultImg from '../../assets/images/auth_vault_visual_1795337868267.jpg';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  LifeBuoy,
  X,
  UserCheck,
  ShieldCheck,
  Network,
  KeyRound
} from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: PageId) => void;
  onLoginSuccess: (user: User) => void;
  onEmailVerificationNeeded: (email: string) => void;
  currentUser?: User | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigate,
  onLoginSuccess,
  onEmailVerificationNeeded,
  currentUser
}) => {
  const { language, dir } = useLanguage();
  const isFa = language === 'fa';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Support Ticket Modal state
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketName, setTicketName] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketSubject, setTicketSubject] = useState(isFa ? 'مشکل در ورود به حساب کاربری' : 'Login Account Assistance');
  const [ticketMessage, setTicketMessage] = useState(
    isFa
      ? 'با سلام، در هنگام ورود به حساب کاربری با مشکل مواجه شده‌ام. لطفاً راهنمایی بفرمایید.'
      : 'Hello, I am having trouble accessing my account. Please assist.'
  );
  const [ticketSubmittedId, setTicketSubmittedId] = useState<string | null>(null);

  // Email OTP sending progress state
  const [isSendingProgress, setIsSendingProgress] = useState(false);
  const [sendingStatusText, setSendingStatusText] = useState('');

  const handleOpenTicketModal = () => {
    setTicketEmail(email.trim() || 'user@example.com');
    setTicketName(email.split('@')[0] || (isFa ? 'کاربر گرامی' : 'User'));
    setIsTicketModalOpen(true);
    setTicketSubmittedId(null);
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicketId = 'TKT-' + Math.floor(10000 + Math.random() * 90000);
    const existingTickets = JSON.parse(localStorage.getItem('tgex_support_tickets') || '[]');
    existingTickets.unshift({
      id: newTicketId,
      name: ticketName,
      email: ticketEmail,
      subject: ticketSubject,
      message: ticketMessage,
      createdAt: new Date().toISOString(),
      status: 'pending'
    });
    localStorage.setItem('tgex_support_tickets', JSON.stringify(existingTickets));
    setTicketSubmittedId(newTicketId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const targetEmail = email.trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes('@')) {
      setErrorMessage(isFa ? 'لطفاً یک آدرس ایمیل معتبر وارد نمایید.' : 'Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage(isFa ? 'کلمه عبور باید حداقل ۶ کاراکتر باشد.' : 'Password must be at least 6 characters.');
      return;
    }

    if (targetEmail === 'disabled@tgex.io') {
      setErrorMessage(isFa ? 'این حساب کاربری به دلیل نقض قوانین مسدود شده است.' : 'This account has been suspended.');
      return;
    }

    // STRICT CHECK: Verify that the account exists and password is correct!
    const credCheck = authService.validateUserCredentials(targetEmail, password);
    if (!credCheck.valid) {
      setErrorMessage(
        credCheck.error ||
          (isFa
            ? 'اطلاعات ورود نادرست است. اگر هنوز حساب کاربری ایجاد نکرده‌اید، لطفاً از بخش «ثبت‌نام» اقدام نمایید.'
            : 'Invalid login credentials. Please check your email and password or sign up.')
      );
      return;
    }

    // Start Login OTP flow
    setIsSendingProgress(true);
    setSendingStatusText(
      isFa
        ? 'در حال بررسی حساب کاربری و تأیید هویت...'
        : 'Verifying registered account credentials...'
    );

    try {
      await new Promise((r) => setTimeout(r, 600));
      setSendingStatusText(
        isFa
          ? 'در حال ارسال کد تأیید امنیتی (OTP) به ایمیل...'
          : 'Sending secure OTP verification code to email...'
      );

      await emailService.sendOtp(targetEmail, 'signup' === 'signup' ? 'login' : 'login');

      await new Promise((r) => setTimeout(r, 500));
      setSendingStatusText(
        isFa
          ? 'کد تأیید ارسال شد! در حال هدایت به صفحه تأیید...'
          : 'OTP sent! Redirecting to verification...'
      );

      setTimeout(() => {
        setIsSendingProgress(false);
        onEmailVerificationNeeded(targetEmail);
      }, 500);
    } catch (err) {
      setIsSendingProgress(false);
      setErrorMessage(
        isFa
          ? 'خطا در ارسال کد تأیید ایمیل. لطفاً مجدداً تلاش کنید.'
          : 'Error sending verification email code. Please retry.'
      );
    }
  };

  return (
    <div
      className={`min-h-[88vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative overflow-hidden ${isFa ? 'text-right' : 'text-left'}`}
      dir={dir}
    >
      {/* Subtle Architectural Backdrop */}
      <div className="absolute top-0 right-1/4 w-[480px] h-[480px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[420px] h-[420px] bg-cyan-500/8 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="w-full max-w-5xl rounded-3xl bg-[#070B14]/95 border border-white/10 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Architectural Visual Showcase Column */}
        <motion.div
          initial={{ opacity: 0, x: isFa ? 14 : -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative min-h-[260px] lg:min-h-[600px] flex flex-col justify-between p-7 sm:p-9 bg-slate-950 overflow-hidden border-b lg:border-b-0 lg:border-e border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#060A13] to-slate-950" />
          <img
            src={authVaultImg}
            alt={isFa ? 'زیرساخت امنیتی حساب کاربری تیجکس' : 'TGEX Non-Custodial Security Architecture'}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/65 to-slate-950/40" />

          {/* Top Brand Signature */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/25">
                TG
              </div>
              <div>
                <div className="text-sm font-black text-white tracking-tight">TGEX</div>
                <div className="text-[10px] font-mono text-cyan-300/90">HYBRID ARCHITECTURE</div>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-300/80">20-LEVEL · NON-CUSTODIAL</span>
          </div>

          {/* Bottom Value Pillars */}
          <div className="relative z-10 space-y-5 pt-10">
            <div className="space-y-2">
              <div className="text-xs font-mono text-cyan-400 font-bold">
                {isFa ? 'پورتال دسترسی اختصاصی' : 'CLIENT ACCESS PORTAL'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight text-balance">
                {isFa
                  ? 'مدیریت شبکه و پاداش‌های ۲۰ سطحی در یک نگاه'
                  : 'Unified Control Over Your 20-Level Network'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed">
                {isFa
                  ? 'تأیید ورود دو مرحله‌ای با ایمیل، ساختار شفاف اسپیل‌اور و پایش لحظه‌ای جایگاه شما در ساختار سازمانی.'
                  : 'Email OTP verification, transparent spillover topology, and real-time visibility into your organizational branch.'}
              </p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-slate-200">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isFa ? 'عدم دسترسی سیستم به کلید برداشت صرافی شما' : 'Zero withdrawal permissions — funds remain on your exchange'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Network className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{isFa ? 'محاسبه دقیق پورسانت بر مبنای Sponsor واقعی' : 'Commissions anchored strictly to your real Sponsor'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{isFa ? 'احراز هویت دو مرحله‌ای با کد یک‌بارمصرف ایمیل' : 'Two-step security protected by one-time email OTP'}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Authentication Form Column */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center"
        >
          <div className="max-w-md mx-auto w-full space-y-6">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {isFa ? 'ورود به حساب کاربری' : 'Sign In to TGEX'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                {isFa
                  ? 'برای دسترسی به داشبورد، ساختار شبکه و سطوح ۲۰ گانه وارد شوید.'
                  : 'Access your live dashboard, branch topology, and 20-tier performance.'}
              </p>
            </div>

            {currentUser && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-bold text-white">{isFa ? 'نشست فعال شما:' : 'Active Session:'}</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 truncate">{currentUser.email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isFa ? 'ورود مستقیم به داشبورد' : 'Go directly to Dashboard'}</span>
                  {isFa ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

            {/* Segmented Mode Switcher */}
            <div className="p-1 rounded-2xl bg-slate-950 border border-white/10 flex items-center gap-1">
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5 transition-all duration-200"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isFa ? 'ورود به حساب' : 'Log In'}</span>
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onNavigate('signup')}
                className="flex-1 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
              >
                <span>{isFa ? 'ثبت‌نام جدید' : 'Sign Up'}</span>
              </motion.button>
            </div>

            {/* Error / Success Alerts */}
            <AnimatePresence mode="wait">
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-4 rounded-2xl bg-rose-950/75 border border-rose-500/40 text-rose-200 text-xs space-y-2.5"
                >
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="flex-1 leading-relaxed">{errorMessage}</div>
                  </div>
                  <div className="pt-2 border-t border-rose-500/20 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-rose-300">
                      {isFa ? 'هنوز ثبت‌نام نکرده‌اید یا مشکلی دارید؟' : 'Need an account or assistance?'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onNavigate('signup')}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 text-[11px] font-bold transition cursor-pointer"
                      >
                        {isFa ? 'ایجاد حساب جدید' : 'Create Account'}
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenTicketModal}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <LifeBuoy className="w-3.5 h-3.5" />
                        <span>{isFa ? 'پشتیبانی' : 'Support'}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-3.5 rounded-2xl bg-emerald-950/75 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isFa ? 'آدرس ایمیل:' : 'Email Address:'}</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-blue-500 transition"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-400" />
                    <span>{isFa ? 'کلمه عبور:' : 'Password:'}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => onNavigate('forgot-password')}
                    className="text-[11px] text-blue-400 hover:underline cursor-pointer"
                  >
                    {isFa ? 'فراموشی کلمه عبور؟' : 'Forgot Password?'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-950 border border-white/15 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-blue-500 transition"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 left-auto z-10 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-slate-950 border-white/20 text-blue-600 focus:ring-0"
                  />
                  <span>{isFa ? 'مرا به خاطر بسپار' : 'Remember me'}</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSendingProgress}
                className="group relative w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 overflow-hidden mt-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                {isSendingProgress ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin relative z-10" />
                    <span className="relative z-10">{sendingStatusText || (isFa ? 'در حال ارسال کد تأیید...' : 'Sending verification OTP...')}</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">{isFa ? 'ورود به حساب و دریافت کد تأیید' : 'Log In & Request OTP Code'}</span>
                    {isFa ? <ArrowLeft className="w-4 h-4 relative z-10" /> : <ArrowRight className="w-4 h-4 relative z-10" />}
                  </>
                )}
              </button>
            </form>

            <div className="pt-5 border-t border-white/10 text-center text-xs text-slate-400">
              {isFa ? 'هنوز حساب کاربری ندارید؟' : "Don't have an account yet?"}{' '}
              <button
                type="button"
                onClick={() => onNavigate('signup')}
                className="text-blue-400 hover:underline font-bold cursor-pointer"
              >
                {isFa ? 'ثبت‌نام در پلتفرم' : 'Create Account'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Support Ticket Modal */}
      <AnimatePresence>
        {isTicketModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            dir={dir}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="w-full max-w-lg rounded-3xl bg-slate-900 border border-white/15 p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <LifeBuoy className="w-5 h-5 text-rose-400" />
                  <span>{isFa ? 'ثبت تیکت پشتیبانی ورود' : 'Login Support Ticket'}</span>
                </h3>
                <button onClick={() => setIsTicketModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {ticketSubmittedId ? (
                <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs space-y-3 text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <div className="font-bold text-sm">{isFa ? 'تیکت شما با موفقیت ثبت شد!' : 'Support Ticket Submitted!'}</div>
                  <div className="text-[11px] font-mono text-emerald-300">
                    {isFa ? `کد پیگیری: ${ticketSubmittedId}` : `Tracking ID: ${ticketSubmittedId}`}
                  </div>
                  <p className="text-slate-300">
                    {isFa
                      ? 'کارشناسان پشتیبانی به زودی وضعیت حساب شما را بررسی و نتیجه را اطلاع‌رسانی خواهند کرد.'
                      : 'Our support team will review your account status and respond promptly.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsTicketModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
                  >
                    {isFa ? 'بازگشت به صفحه ورود' : 'Return to Login'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitTicket} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-300">{isFa ? 'نام:' : 'Full Name:'}</label>
                    <input
                      type="text"
                      value={ticketName}
                      onChange={(e) => setTicketName(e.target.value)}
                      required
                      className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300">{isFa ? 'آدرس ایمیل:' : 'Email Address:'}</label>
                    <input
                      type="email"
                      value={ticketEmail}
                      onChange={(e) => setTicketEmail(e.target.value)}
                      required
                      className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300">{isFa ? 'موضوع:' : 'Subject:'}</label>
                    <input
                      type="text"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      required
                      className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300">{isFa ? 'متن پیام:' : 'Message:'}</label>
                    <textarea
                      rows={3}
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      required
                      className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white resize-none"
                    />
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsTicketModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
                    >
                      {isFa ? 'انصراف' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
                    >
                      {isFa ? 'ارسال تیکت' : 'Submit Ticket'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

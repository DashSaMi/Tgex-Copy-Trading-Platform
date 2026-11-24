import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId } from '../../types';
import { authService } from '../../services/authService';
import { emailService } from '../../services/emailService';
import { databaseService, getLayerFromSponsor } from '../../services/db/databaseService';
import { useLanguage } from '../../context/LanguageContext';
import authVaultImg from '../../assets/images/auth_vault_visual_1795337868267.jpg';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  UserPlus,
  Sparkles,
  HelpCircle,
  LifeBuoy,
  Network,
  Layers,
  X
} from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (page: PageId) => void;
  onEmailVerificationNeeded: (email: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigate,
  onEmailVerificationNeeded
}) => {
  const { language, dir } = useLanguage();
  const isFa = language === 'fa';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sponsorCode, setSponsorCode] = useState('482917');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSponsorTooltip, setShowSponsorTooltip] = useState(false);

  // Live password validation states
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const hasMinLength = password.length >= 8;
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const metCriteriaCount = [hasMinLength, hasNumber, hasSymbol, hasUppercase].filter(Boolean).length;

  // Support Ticket Modal state
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketName, setTicketName] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketSubject, setTicketSubject] = useState(isFa ? 'درخواست دریافت کد معرف معتبر' : 'Request Valid Referral Sponsor Code');
  const [ticketMessage, setTicketMessage] = useState(
    isFa
      ? 'با سلام، برای ثبت‌نام در سامانه نیاز به کد معرف فعال دارم. لطفاً راهنمایی بفرمایید.'
      : 'Hello, I need an active referral sponsor code to complete my registration. Please advise.'
  );
  const [ticketSubmittedId, setTicketSubmittedId] = useState<string | null>(null);

  // Email OTP sending progress state
  const [isSendingProgress, setIsSendingProgress] = useState(false);
  const [sendingStatusText, setSendingStatusText] = useState('');

  // Live validation of entered referral code against database
  const sponsorValidation = useMemo(() => {
    if (!sponsorCode.trim()) return null;
    const res = databaseService.validateReferralCode(sponsorCode.trim());
    if (res.valid && res.user) {
      const inheritedLayer = getLayerFromSponsor(res.user);
      return {
        ...res,
        name: res.user.fullName,
        userLevel: res.user.level,
        inheritedLayer
      };
    }
    return res;
  }, [sponsorCode]);

  const activeGuides = useMemo(() => {
    return databaseService.getRealActiveReferralGuides();
  }, []);

  const handleApplyCodes = (refCode: string) => {
    setSponsorCode(refCode);
    setShowSponsorTooltip(false);
    setErrorMessage('');
  };

  const handleOpenTicketModal = () => {
    setTicketEmail(email.trim() || 'user@example.com');
    setTicketName(email.split('@')[0] || (isFa ? 'کاربر جدید' : 'New User'));
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

    if (password.length < 8) {
      setErrorMessage(isFa ? 'کلمه عبور باید حداقل ۸ کاراکتر باشد.' : 'Password must be at least 8 characters.');
      return;
    }

    if (metCriteriaCount < 3) {
      setErrorMessage(
        isFa
          ? 'لطفاً کلمه عبور قوی‌تری انتخاب کنید (حداقل ۳ مورد از معیارهای امنیتی باید سبز باشند).'
          : 'Please choose a stronger password (at least 3 security criteria must be met).'
      );
      return;
    }

    if (!sponsorCode.trim()) {
      setErrorMessage(isFa ? 'لطفاً کد معرف (کد دعوت) را وارد نمایید.' : 'Please enter sponsor referral code.');
      return;
    }
    if (!sponsorValidation || !sponsorValidation.valid) {
      setErrorMessage(
        isFa
          ? `کد معرف «${sponsorCode}» نامعتبر است یا در پایگاه داده وجود ندارد.`
          : `Sponsor referral code "${sponsorCode}" is invalid or not found in database.`
      );
      return;
    }

    setIsSendingProgress(true);
    setSendingStatusText(
      isFa
        ? 'در حال اعتبارسنجی اطلاعات و کد معرف...'
        : 'Validating registration data & referral code...'
    );

    try {
      authService.saveRegisteredCredentials(targetEmail, password);
      localStorage.setItem('tgex_pending_reg_sponsor_' + targetEmail, sponsorCode.trim());

      await new Promise((r) => setTimeout(r, 600));
      setSendingStatusText(isFa ? 'در حال صدور کد تأیید ایمیل (OTP)...' : 'Generating secure email verification OTP...');

      await emailService.sendOtp(targetEmail, 'signup');

      await new Promise((r) => setTimeout(r, 600));
      setSendingStatusText(isFa ? 'کد تأیید ارسال شد! در حال انتقال...' : 'OTP sent successfully! Redirecting...');

      setTimeout(() => {
        setIsSendingProgress(false);
        onEmailVerificationNeeded(targetEmail);
      }, 500);
    } catch (err) {
      setIsSendingProgress(false);
      setErrorMessage(
        isFa
          ? 'خطا در برقراری ارتباط با سرویس ثبت‌نام.'
          : 'Registration network error occurred.'
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
          className="lg:col-span-5 relative min-h-[260px] lg:min-h-[640px] flex flex-col justify-between p-7 sm:p-9 bg-slate-950 overflow-hidden border-b lg:border-b-0 lg:border-e border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#060A13] to-slate-950" />
          <img
            src={authVaultImg}
            alt={isFa ? 'ساختار عضویت در شبکه ۲۰ سطحی تیجکس' : 'TGEX 20-Level Onboarding Vault'}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/65 to-slate-950/40" />

          {/* Brand Header */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/25">
                TG
              </div>
              <div>
                <div className="text-sm font-black text-white tracking-tight">TGEX</div>
                <div className="text-[10px] font-mono text-cyan-300/90">SUN SYSTEM · 20 LEVELS</div>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-300/80">SPONSOR VERIFIED</span>
          </div>

          {/* Onboarding Highlights */}
          <div className="relative z-10 space-y-5 pt-10">
            <div className="space-y-2">
              <div className="text-xs font-mono text-cyan-400 font-bold">
                {isFa ? 'عضویت در شبکه هیبرید' : 'HYBRID NETWORK ONBOARDING'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight text-balance">
                {isFa
                  ? 'شروع عضویت با جایگاه‌یابی هوشمند و شفاف'
                  : 'Precision Onboarding Into the 20-Level Matrix'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed">
                {isFa
                  ? 'با وارد کردن کد معرف معتبر، جایگاه شما در ساختار ۲۰ سطحی ثبت شده و پورسانت‌ها بر اساس حامی واقعی محاسبه می‌شوند.'
                  : 'Enter an active Sponsor ID to anchor your node in the 20-level Sun System with guaranteed spillover placement.'}
              </p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-slate-200">
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{isFa ? '۲۰٪ سهم بازاریابی: ۳٪ مستقیم · ۱۴٪ شبکه ۲۰ سطح · ۳٪ استخر رهبری' : '20% Marketing Pool: 3% Direct · 14% 20-Lv · 3% Leadership'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Network className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{isFa ? 'حداکثر ۲۰ معرفی مستقیم + سرریز خودکار (Spillover)' : 'Max 20 direct frontlines + automated Spillover placement'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isFa ? 'احراز ایمیل با OTP و حفظ کامل مالکیت سرمایه' : 'OTP verified identity with full capital sovereignty'}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Registration Form Column */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center"
        >
          <div className="max-w-md mx-auto w-full space-y-5">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {isFa ? 'ایجاد حساب کاربری جدید' : 'Create Your TGEX Account'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                {isFa
                  ? 'اطلاعات ورود و کد معرف خود را وارد کنید تا جایگاه شبکه شما فعال شود.'
                  : 'Complete your credentials and verify your Sponsor code to join.'}
              </p>
            </div>

            {/* Segmented Switcher */}
            <div className="p-1 rounded-2xl bg-slate-950 border border-white/10 flex items-center gap-1">
              <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onNavigate('login')}
                className="flex-1 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isFa ? 'ورود به حساب' : 'Log In'}</span>
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5 transition-all duration-200"
              >
                <UserPlus className="w-3.5 h-3.5" />
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
                  className="p-4 rounded-2xl bg-rose-950/75 border border-rose-500/40 text-rose-200 text-xs space-y-2"
                >
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="flex-1 leading-relaxed">{errorMessage}</div>
                  </div>
                  <div className="pt-2 border-t border-rose-500/20 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-rose-300">
                      {isFa ? 'کد معتبر ندارید یا مشکلی پیش آمده؟' : 'Need an active sponsor code or support?'}
                    </span>
                    <button
                      type="button"
                      onClick={handleOpenTicketModal}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <LifeBuoy className="w-3.5 h-3.5" />
                      <span>{isFa ? 'ثبت تیکت پشتیبانی' : 'Support Ticket'}</span>
                    </button>
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

            {/* Registration Form */}
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
                  placeholder="user@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-blue-500 transition"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-400" />
                    <span>{isFa ? 'کلمه عبور:' : 'Password:'}</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {isFa ? 'حداقل ۸ کاراکتر و علائم' : 'Min 8 chars, symbols & digits'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
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

                <AnimatePresence>
                  {(isPasswordFocused || password.length > 0) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 space-y-2.5 mt-2">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] items-center">
                            <span className="text-slate-400">{isFa ? 'سطح امنیت رمز عبور:' : 'Password Strength:'}</span>
                            <span
                              className={`font-bold ${
                                metCriteriaCount === 0
                                  ? 'text-rose-400'
                                  : metCriteriaCount === 1
                                    ? 'text-orange-400'
                                    : metCriteriaCount === 2
                                      ? 'text-amber-400'
                                      : metCriteriaCount === 3
                                        ? 'text-lime-400'
                                        : 'text-emerald-400'
                              }`}
                            >
                              {metCriteriaCount === 0
                                ? isFa ? 'خیلی ضعیف' : 'Very Weak'
                                : metCriteriaCount === 1
                                  ? isFa ? 'ضعیف' : 'Weak'
                                  : metCriteriaCount === 2
                                    ? isFa ? 'متوسط' : 'Moderate'
                                    : metCriteriaCount === 3
                                      ? isFa ? 'خوب و امن' : 'Strong'
                                      : isFa ? 'بسیار امن' : 'Very Strong'}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 rounded-full ${
                                metCriteriaCount === 0
                                  ? 'bg-rose-500 w-[10%]'
                                  : metCriteriaCount === 1
                                    ? 'bg-orange-500 w-[25%]'
                                    : metCriteriaCount === 2
                                      ? 'bg-amber-500 w-[50%]'
                                      : metCriteriaCount === 3
                                        ? 'bg-lime-500 w-[75%]'
                                        : 'bg-emerald-500 w-[100%]'
                              }`}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-white/5">
                          <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                            <span>{hasMinLength ? '●' : '○'}</span>
                            <span>{isFa ? 'حداقل ۸ کاراکتر' : '8+ characters'}</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                            <span>{hasNumber ? '●' : '○'}</span>
                            <span>{isFa ? 'اعداد (0-9)' : 'Digits (0-9)'}</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${hasSymbol ? 'text-emerald-400' : 'text-slate-500'}`}>
                            <span>{hasSymbol ? '●' : '○'}</span>
                            <span>{isFa ? 'نماد (!@#$%)' : 'Symbols (!@#$%)'}</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-400' : 'text-slate-500'}`}>
                            <span>{hasUppercase ? '●' : '○'}</span>
                            <span>{isFa ? 'حرف بزرگ (A-Z)' : 'Uppercase (A-Z)'}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sponsor Code */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <UserPlus className="w-3.5 h-3.5 text-blue-400" />
                    <span>{isFa ? 'کد معرف (Sponsor Code):' : 'Sponsor Referral Code:'}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSponsorTooltip(!showSponsorTooltip)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{isFa ? 'معرف‌های فعال' : 'Active Sponsors'}</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={sponsorCode}
                    onChange={(e) => setSponsorCode(e.target.value)}
                    placeholder={isFa ? 'مثال: 482917' : 'e.g. 482917'}
                    required
                    className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white text-sm font-mono focus:outline-none transition ${
                      sponsorValidation?.valid
                        ? 'border-emerald-500/60 focus:border-emerald-500'
                        : 'border-rose-500/50 focus:border-rose-500'
                    }`}
                    dir="ltr"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {sponsorValidation?.valid ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-400" />
                    )}
                  </div>
                </div>

                {sponsorValidation?.valid ? (
                  <div className="p-3 rounded-xl bg-emerald-950/35 border border-emerald-500/25 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-emerald-300">
                      <span>
                        {isFa
                          ? `معرف: ${sponsorValidation.name} (${sponsorValidation.userLevel})`
                          : `Verified Sponsor: ${sponsorValidation.name} (${sponsorValidation.userLevel})`}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">
                        {isFa ? 'تأیید شد' : 'VERIFIED'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        {isFa ? 'لایه جایگاه در شبکه:' : 'Placement depth tier:'}{' '}
                        <strong className="text-white font-mono">{sponsorValidation.inheritedLayer?.networkLevel}</strong> (
                        {sponsorValidation.inheritedLayer?.rankName})
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-rose-400 font-mono">
                    {isFa ? 'کد معرف نامعتبر است یا در پایگاه داده یافت نشد' : 'Referral code is invalid or not registered'}
                  </div>
                )}
              </div>

              <AnimatePresence>
                {showSponsorTooltip && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-blue-500/30 text-xs space-y-2">
                      <div className="flex items-center justify-between text-white font-bold">
                        <span>{isFa ? 'لیست معرف‌های فعال:' : 'Active System Sponsors:'}</span>
                        <button type="button" onClick={() => setShowSponsorTooltip(false)} className="text-slate-400 hover:text-white cursor-pointer">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-44 overflow-y-auto">
                        {activeGuides.map((guide) => (
                          <div
                            key={guide.id}
                            onClick={() => handleApplyCodes(guide.referralCode)}
                            className="p-2.5 rounded-xl bg-slate-900 hover:bg-blue-900/35 border border-white/10 flex items-center justify-between cursor-pointer transition text-[11px]"
                          >
                            <div>
                              <div className="font-bold text-white flex items-center gap-2">
                                <span>{guide.fullName}</span>
                                <span className="text-[10px] text-blue-400 font-mono">({guide.level})</span>
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                {isFa ? 'کد معرف:' : 'Code:'} <strong className="text-emerald-400">{guide.referralCode}</strong>
                              </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-lg bg-blue-600/25 text-blue-300 font-bold text-[10px]">
                              {isFa ? 'انتخاب' : 'Select'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
                    <span className="relative z-10">{isFa ? 'ثبت‌نام و دریافت کد تأیید ایمیل' : 'Sign Up & Request Email OTP'}</span>
                    {isFa ? <ArrowLeft className="w-4 h-4 relative z-10" /> : <ArrowRight className="w-4 h-4 relative z-10" />}
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-white/10 text-center text-xs space-y-1.5">
              <div className="text-slate-400">
                {isFa ? 'قبلاً ثبت‌نام کرده‌اید؟' : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="text-blue-400 hover:underline font-bold cursor-pointer"
                >
                  {isFa ? 'ورود به حساب کاربری' : 'Log In Here'}
                </button>
              </div>
              <div className="text-[11px] text-slate-500">
                {isFa
                  ? 'با ثبت‌نام در TGEX، قوانین و شرایط فعالیت در شبکه ۲۰ سطحی را می‌پذیرید.'
                  : 'By registering with TGEX, you agree to our platform and 20-tier network terms.'}
              </div>
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
                  <span>{isFa ? 'ثبت تیکت پشتیبانی کد معرف' : 'Referral Code Support Ticket'}</span>
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
                      ? 'تیم پشتیبانی TGEX به زودی کدهای معرف و جایگاه فعال را به ایمیل شما ارسال خواهد نمود.'
                      : 'The TGEX support desk will promptly email you active sponsor codes and guidance.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsTicketModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
                  >
                    {isFa ? 'بازگشت به فرم ثبت‌نام' : 'Return to Registration'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitTicket} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-300">{isFa ? 'نام و نام خانوادگی:' : 'Full Name:'}</label>
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
                    <label className="font-bold text-slate-300">{isFa ? 'موضوع تیکت:' : 'Subject:'}</label>
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
                      {isFa ? 'ارسال تیکت به پشتیبانی' : 'Submit Ticket'}
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

import React, { useState } from 'react';
import { PageId, AuthStateType } from '../../types';
import { authService } from '../../services/authService';
import { 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Check
} from 'lucide-react';

interface ResetPasswordPageProps {
  token?: string;
  onNavigate: (page: PageId) => void;
  onResetComplete: () => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({
  token = 'tgex_reset_token_mock',
  onNavigate,
  onResetComplete
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [authState, setAuthState] = useState<AuthStateType>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!passwordsMatch) {
      setErrorMessage('کلمه عبور و تکرار آن با یکدیگر همخوانی ندارند.');
      return;
    }

    setAuthState('loading');

    try {
      const result = await authService.resetPassword({
        token,
        password,
        confirmPassword
      });

      setAuthState(result.state);

      if (result.success) {
        setSuccessMessage(result.message);
        setTimeout(() => {
          onResetComplete();
        }, 1200);
      } else {
        setErrorMessage(result.message);
      }
    } catch (err) {
      setAuthState('server_error');
      setErrorMessage('تغییر رمز عبور با خطا مواجه شد.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-2 shadow-lg shadow-blue-500/10">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            تنظیم کلمه عبور جدید
          </h1>
          <p className="text-xs text-slate-400">
            کلمه عبور جدید و مستحکمی برای حساب تیجکس (Tgex) خود انتخاب فرمایید.
          </p>
        </div>

        {/* Card */}
        <div className="p-7 rounded-3xl bg-slate-900/60 border border-white/10 shadow-2xl backdrop-blur-xl space-y-5">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{successMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* New Password */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-semibold text-slate-300 block">
                کلمه عبور جدید
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="حداقل ۸ کاراکتر"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  dir="ltr"
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition pl-10 pr-10"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-semibold text-slate-300 block">
                تکرار کلمه عبور جدید
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="تکرار کلمه عبور"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  dir="ltr"
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition pl-10"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Criteria Checklist */}
            {password && (
              <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 grid grid-cols-2 gap-2 text-[11px]">
                <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <Check className="w-3.5 h-3.5" />
                  <span>حداقل ۸ کاراکتر</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber && hasLetter ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <Check className="w-3.5 h-3.5" />
                  <span>شامل حروف و اعداد</span>
                </div>
                <div className={`flex items-center gap-1.5 col-span-2 ${passwordsMatch ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <Check className="w-3.5 h-3.5" />
                  <span>تطابق هر دو فیلد کلمه عبور</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={authState === 'loading'}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {authState === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>در حال به‌روزرسانی کلمه عبور...</span>
                </>
              ) : (
                <>
                  <span>ذخیره و ورود به حساب</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          <div className="pt-2 text-center text-xs text-slate-400">
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="text-blue-400 hover:underline"
            >
              انصراف و بازگشت به ورود
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

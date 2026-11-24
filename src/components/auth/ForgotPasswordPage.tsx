import React, { useState } from 'react';
import { PageId, AuthStateType } from '../../types';
import { authService } from '../../services/authService';
import { 
  KeyRound, 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2,
  ShieldCheck
} from 'lucide-react';

interface ForgotPasswordPageProps {
  onNavigate: (page: PageId) => void;
  onResetLinkSent: (email: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onNavigate,
  onResetLinkSent
}) => {
  const [email, setEmail] = useState('');
  const [authState, setAuthState] = useState<AuthStateType>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setAuthState('loading');

    try {
      const result = await authService.forgotPassword({ email });
      setAuthState(result.state);

      if (result.success) {
        setSuccessMessage(result.message);
        setTimeout(() => {
          onResetLinkSent(email);
        }, 1500);
      } else {
        setErrorMessage(result.message);
      }
    } catch (err) {
      setAuthState('server_error');
      setErrorMessage('ارسال لینک با خطا مواجه شد. لطفاً بعداً مجدداً امتحان کنید.');
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
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            بازیابی کلمه عبور
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            ایمیل متصل به حساب کاربری تیجکس (Tgex) خود را وارد کنید تا لینک امن بازنشانی برایتان ارسال گردد.
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
            
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-semibold text-slate-300 block">
                آدرس ایمیل ثبت‌شده
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition pl-10"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={authState === 'loading'}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {authState === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>در حال ارسال لینک بازیابی...</span>
                </>
              ) : (
                <>
                  <span>ارسال لینک بازیابی رمز عبور</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Quick Shortcuts */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-slate-400">
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              بازگشت به صفحه ورود
            </button>
            <button
              type="button"
              onClick={() => onNavigate('reset-password')}
              className="text-slate-500 hover:text-slate-300 font-mono text-[11px]"
            >
              کد ریست دارم →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Lock, 
  Mail, 
  Share2, 
  GitFork, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccessToast?: (message: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  initialMode = 'login', 
  onClose,
  onSuccessToast
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sponsorCode, setSponsorCode] = useState('482917635');
  const [placementCode, setPlacementCode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setAuthError('Passwords do not match. Please verify your entries.');
        return;
      }
      if (!agreeTerms) {
        setAuthError('Please agree to the Terms of Service & Risk Disclosures.');
        return;
      }
    }

    setIsLoading(true);

    // Simulate authentication processing
    setTimeout(() => {
      setIsLoading(false);
      const msg = mode === 'register' 
        ? `Account initialized successfully for ${email}! In the subsequent implementation stage, your account will be linked to Sponsor #${sponsorCode || 'ROOT'}.`
        : `Welcome back, ${email}! Stage 1 Public Portal mock session active.`;
      
      setAuthSuccess(msg);
      if (onSuccessToast) onSuccessToast(msg);

      setTimeout(() => {
        setAuthSuccess(null);
        onClose();
      }, 2500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#0e1320] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top gradient stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500"></div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3">
              {mode === 'login' ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
            </div>
            <h3 className="text-2xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans']">
              {mode === 'login' ? 'Member Portal Access' : 'Create TGEX Account'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {mode === 'login' 
                ? 'Sign in to access your 20-level dashboard preview.' 
                : 'Join the marketing network.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-900/90 rounded-xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setAuthError(null); }}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setAuthError(null); }}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Notice info pill */}
          <div className="mb-5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>
              <strong>Note:</strong> Stage 1 Mock Auth. Real API & KYC integration will connect in future stages.
            </span>
          </div>

          {authSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs space-y-2 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
              <p className="font-semibold">{authSuccess}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {authError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="trader@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Register only) */}
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>
              )}

              {/* Network Sponsor Code (Register only) */}
              {mode === 'register' && (
                <div className="pt-2 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-['JetBrains_Mono']">
                      Referral Information
                    </span>
                    <span className="text-[10px] text-slate-500">Direct Sponsor</span>
                  </div>

                  {/* Sponsor Code */}
                  <div>
                    <label className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                        Sponsor Referral Code
                      </span>
                      <span className="text-[10px] text-slate-500">Who invited you?</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 482917"
                      value={sponsorCode}
                      onChange={(e) => setSponsorCode(e.target.value)}
                      className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-emerald-300 font-['JetBrains_Mono'] placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>

                  {/* Terms Checkbox */}
                  <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-[11px] text-slate-400 leading-tight">
                      I understand TGEX provides marketing & 20-level hierarchy tools, while trade execution occurs via external APIs with inherent financial risks.
                    </span>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/20 transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    <span>{mode === 'login' ? 'Authenticate & Enter' : 'Complete Registration'}</span>
                  </>
                )}
              </button>

            </form>
          )}

          {/* Switch Prompt */}
          <div className="mt-6 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <p>
                Don't have a TGEX ID yet?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setAuthError(null); }}
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  Register now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setAuthError(null); }}
                  className="text-cyan-400 hover:underline font-semibold"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

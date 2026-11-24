import { useLanguage } from '../../context/LanguageContext';
import React, { useState } from 'react';
import { PageId } from '../../types';
import { adminAuthService } from '../../services/adminAuthService';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Key, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Terminal, 
  ShieldAlert, 
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminLoginPageProps {
  onNavigate: (page: PageId) => void;
  onAdminLoginSuccess: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onNavigate,
  onAdminLoginSuccess
}) => {
  const { t, language, dir } = useLanguage();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await adminAuthService.login(identifier, password);
      if (res.success) {
        onAdminLoginSuccess();
      } else {
        setErrorMsg(res.error || t('admin.login.error_invalid'));
      }
    } catch (err) {
      setErrorMsg(t('admin.login.error_service'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#030508] text-slate-100 flex flex-col justify-between items-center py-10 px-4 sm:px-6 relative overflow-hidden ${language === 'fa' ? 'text-right' : 'text-left'}`} dir={dir}>
      
      {/* Background Ambient Grid & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Link */}
      <div className="w-full max-w-md flex items-center justify-between z-10">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10"
        >
          {dir === 'rtl' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5 rotate-180" />}
          <span>{t('admin.login.back_to_site')}</span>
        </button>

        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{t('admin.login.secure_gateway')}</span>
        </div>
      </div>

      {/* Main Admin Auth Container */}
      <div className="w-full max-w-md bg-slate-950/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/40 relative z-10 backdrop-blur-xl space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white font-black text-2xl shadow-xl shadow-blue-600/30 border border-white/20 mb-1">
            TX
          </div>
          <div>
            <div className="font-mono text-xs tracking-widest text-blue-400 font-bold uppercase">
              TGEX ADMINISTRATION
            </div>
            <h1 className="text-2xl font-black text-white mt-0.5">
              {t('admin.login.title')}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {t('admin.login.subtitle')}
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email / Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>{t('admin.login.identifier_label')}</span>
              <span className="text-[10px] text-slate-500 font-mono">ADMIN ID</span>
            </label>
            <div className="relative">
              <Mail className={`w-4 h-4 absolute ${dir === 'rtl' ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400`} />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@tgex.io"
                className={`w-full ${dir === 'rtl' ? 'pl-4 pr-10' : 'pr-4 pl-10'} py-3 bg-slate-900/90 border border-white/10 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition font-mono`}
                dir="ltr"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-300">{t('admin.login.password_label')}</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] text-blue-400 hover:text-blue-300 transition"
              >
                {t('admin.login.forgot_password')}
              </button>
            </div>
            <div className="relative">
              <Key className={`w-4 h-4 absolute ${dir === 'rtl' ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400`} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full ${dir === 'rtl' ? 'pl-10 pr-10' : 'pr-10 pl-10'} py-3 bg-slate-900/90 border border-white/10 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition font-mono`}
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute ${dir === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-white`}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-blue-600/30 border border-white/15 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                <span>{t('admin.login.loading_btn')}</span>
              </span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>{t('admin.login.submit_btn')}</span>
              </>
            )}
          </button>
        </form>

        {/* Security Disclaimers */}
        <div className="pt-2 text-center text-[10px] text-slate-500 space-y-1 font-mono">
          <div className="flex items-center justify-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>SESSION ENCRYPTION: TLS 1.3 / AES-256</span>
          </div>
          <div>All login attempts and IP addresses are recorded to security audit logs.</div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-white/20 rounded-3xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 text-blue-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-bold text-white text-sm">{t('admin.login.forgot_modal_title')}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t('admin.login.forgot_modal_desc')}
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-slate-400">
              {t('admin.login.forgot_modal_footer')}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
              >
                {t('admin.login.forgot_modal_btn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Footer */}
      <footer className="text-center text-[11px] text-slate-600 font-mono mt-6 z-10">
        {t('admin.login.footer')}
      </footer>

    </div>
  );
};

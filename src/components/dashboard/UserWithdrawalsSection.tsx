import React, { useState, useEffect } from 'react';
import { User, WithdrawalRequest } from '../../types';
import { databaseService } from '../../services/db/databaseService';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Wallet, 
  Send, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  DollarSign, 
  HelpCircle,
  RefreshCw,
  Info
} from 'lucide-react';

interface UserWithdrawalsSectionProps {
  user: User;
}

export const UserWithdrawalsSection: React.FC<UserWithdrawalsSectionProps> = ({ user }) => {
  const { t, language } = useLanguage();
  const isRtl = language === 'fa';

  const [walletInput, setWalletInput] = useState(user.walletAddress || '');
  const [networkType, setNetworkType] = useState('USDT (TRC20)');
  const [amountInput, setAmountInput] = useState('');
  const [userRequests, setUserRequests] = useState<WithdrawalRequest[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const loadUserRequests = () => {
    const all = databaseService.getWithdrawalRequests();
    const mine = all.filter(r => 
      r.userId === user.id || 
      r.userId === 'DX-' + user.id.replace('usr_', '') ||
      r.userEmail?.toLowerCase() === user.email?.toLowerCase() ||
      r.username?.toLowerCase() === user.username?.toLowerCase()
    );
    setUserRequests(mine);
  };

  useEffect(() => {
    loadUserRequests();
    const handleUpdate = () => loadUserRequests();
    window.addEventListener('tgex_withdrawals_updated', handleUpdate);
    return () => window.removeEventListener('tgex_withdrawals_updated', handleUpdate);
  }, [user]);

  const showNotification = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4500);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showNotification(t('dash.withdraw.copy_success'), 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanWallet = walletInput.trim();
    if (!cleanWallet) {
      showNotification(isRtl ? 'لطفاً آدرس یا لینک ولت معتبر خود را وارد نمایید.' : 'Please enter a valid wallet address or link.', 'error');
      return;
    }

    if (cleanWallet.length < 20) {
      showNotification(isRtl ? 'آدرس ولت وارد شده بسیار کوتاه است و معتبر نمی‌باشد.' : 'The wallet address entered is too short and invalid.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const created = databaseService.addWithdrawalRequest({
        userId: user.id || 'DX-482917',
        userFullName: user.fullName || (isRtl ? 'کاربر گرامی' : 'Valued User'),
        username: user.username || user.email?.split('@')[0] || 'user',
        userEmail: user.email || 'user@tgex.io',
        walletAddress: cleanWallet,
        walletLink: cleanWallet.startsWith('http') 
          ? cleanWallet 
          : cleanWallet.startsWith('0x') 
          ? `https://etherscan.io/address/${cleanWallet}` 
          : `https://tronscan.org/#/address/${cleanWallet}`,
        networkType: networkType,
        amountUsdt: parseFloat(amountInput) || 0
      });

      showNotification(isRtl ? 'درخواست تسویه با موفقیت ثبت شد و به پنل مدیریت ارسال گردید.' : 'Settlement request successfully submitted and sent to the management panel.', 'success');
      setAmountInput('');
      loadUserRequests();
    } catch (err) {
      showNotification(isRtl ? 'خطا در ثبت درخواست. لطفاً دوباره تلاش فرمایید.' : 'Error submitting request. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`space-y-6 text-slate-200 ${isRtl ? 'font-vazir' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Toast Notification */}
      {notification && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 shadow-xl transition-all ${
          notification.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' :
          notification.type === 'error' ? 'bg-rose-950/90 border-rose-500/50 text-rose-200' :
          'bg-blue-950/90 border-blue-500/50 text-blue-200'
        }`}>
          {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {notification.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
          {notification.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-2">
              <Wallet className="w-3.5 h-3.5" />
              <span>DIGITAL WALLET & SETTLEMENT ENGINE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {t('dash.withdraw.title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {t('dash.withdraw.desc')}
            </p>
          </div>

          {/* Balance card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 shrink-0 text-center min-w-[200px]">
            <div className="text-[11px] text-slate-400">{t('dash.withdraw.balance_label')}</div>
            <div className={`text-2xl font-black text-emerald-400 font-mono my-1 ${isRtl ? 'text-right' : 'text-left'}`} dir="ltr">0.00 USDT</div>
            <div className="text-[9px] text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              {t('common.klix_sync')}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left/Form Column: 5 Cols */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-5">
            
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
              <Send className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-white text-sm">{t('dash.withdraw.form_title')}</h3>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-4">
              
              {/* User Identity Info Preview */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>{t('dash.withdraw.applicant_name')}</span>
                  <span className="text-white font-bold">{user.fullName || (isRtl ? 'کاربر گرامی' : 'Valued User')}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>{t('dash.withdraw.user_identity')}</span>
                  <span className="text-blue-400 font-mono">@{user.username || 'user'} ({user.id || 'DX-482917'})</span>
                </div>
              </div>

              {/* Network Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  {t('dash.withdraw.network_select')}
                </label>
                <select
                  value={networkType}
                  onChange={(e) => setNetworkType(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="USDT (TRC20)">{t('dash.withdraw.network_trc20')}</option>
                  <option value="USDT (TON)">{t('dash.withdraw.network_ton')}</option>
                  <option value="USDT (BEP20)">{t('dash.withdraw.network_bep20')}</option>
                  <option value="USDT (ERC20)">{t('dash.withdraw.network_erc20')}</option>
                </select>
              </div>

              {/* Wallet Address or Explorer Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  {t('dash.withdraw.address_label')}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isRtl ? 'مثلاً: TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' : 'e.g. TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'}
                  value={walletInput}
                  onChange={(e) => setWalletInput(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                  dir="ltr"
                />
                <p className="text-[10px] text-slate-500">
                  {t('dash.withdraw.address_hint').replace('{network}', networkType)}
                </p>
              </div>

              {/* Amount (Optional for live sync) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  {t('dash.withdraw.amount_input_label')}
                </label>
                <input
                  type="number"
                  placeholder={t('dash.withdraw.amount_placeholder')}
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                  dir="ltr"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-bold text-xs transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{t('dash.withdraw.submit_btn_label')}</span>
              </button>

            </form>

            {/* Note box */}
            <div className="p-3.5 rounded-2xl bg-blue-950/20 border border-blue-500/20 text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('dash.withdraw.review_process_title')}</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[10px]">
                {t('dash.withdraw.review_process_desc')}
              </p>
            </div>

          </div>
        </div>

        {/* Right/History Column: 7 Cols */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">{t('dash.withdraw.history_title')}</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">{t('dash.withdraw.history_summary').replace('{count}', userRequests.length.toString())}</span>
            </div>

            {userRequests.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center text-slate-500">
                  <Wallet className="w-7 h-7" />
                </div>
                <div className="text-sm font-bold text-slate-300">{t('dash.withdraw.empty_history')}</div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {t('dash.withdraw.empty_desc')}
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {userRequests.map((req) => {
                  const isPending = req.status === 'pending';
                  const isApproved = req.status === 'approved';
                  const isRejected = req.status === 'rejected';

                  return (
                    <div 
                      key={req.id} 
                      className={`p-4 rounded-2xl border transition-all space-y-3 ${
                        isApproved ? 'bg-emerald-950/15 border-emerald-500/30' :
                        isRejected ? 'bg-rose-950/20 border-rose-500/30' :
                        'bg-slate-950/80 border-amber-500/30'
                      }`}
                    >
                      {/* Top Row: Timestamp & Status */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                        <div className="flex items-center gap-2 text-xs">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-300 font-bold">{t('dash.withdraw.submitted_at')}</span>
                          <span className="text-amber-300 font-mono font-bold text-[11px]">{isRtl ? req.submittedAtPersian : req.submittedAt}</span>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {isPending && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                              <span>{t('dash.withdraw.status.pending')}</span>
                            </span>
                          )}
                          {isApproved && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{t('dash.withdraw.status.completed')}</span>
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold">
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                              <span>{t('dash.withdraw.status.rejected')}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Wallet and Network Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 space-y-1">
                          <span className="text-slate-500 text-[10px]">{t('dash.withdraw.network_label')}</span>
                          <div className="font-bold text-cyan-300 font-mono">{req.networkType || 'USDT (TRC20)'}</div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 space-y-1">
                          <span className="text-slate-500 text-[10px]">{t('dash.withdraw.tracking_id')}</span>
                          <div className="font-mono text-slate-300 text-[11px]">{req.id}</div>
                        </div>
                      </div>

                      {/* Wallet Address Display */}
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] text-emerald-300 truncate" dir="ltr">
                          {req.walletAddress}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleCopy(req.walletAddress, req.id)}
                            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
                            title={isRtl ? 'کپی آدرس' : 'Copy Address'}
                          >
                            {copiedId === req.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          {req.walletLink && (
                            <a
                              href={req.walletLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition"
                              title={isRtl ? 'مشاهده در بلاکچین' : 'View on Blockchain'}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Approval Info Details */}
                      {isApproved && (
                        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs space-y-1">
                          <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t('dash.withdraw.approved_title')}</span>
                          </div>
                          {(isRtl ? req.reviewedAtPersian : req.reviewedAt) && (
                            <div className="text-[11px] text-slate-300">
                              {t('dash.withdraw.approval_time')} <span className="font-bold text-white">{isRtl ? req.reviewedAtPersian : req.reviewedAt}</span>
                            </div>
                          )}
                          {req.txHash && (
                            <div className="text-[10px] text-cyan-300 font-mono break-all">
                              {t('dash.withdraw.tx_hash_label')} {req.txHash}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Rejection Reason Display (Critical user request) */}
                      {isRejected && req.rejectionReason && (
                        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs space-y-1.5 animate-pulse-slow">
                          <div className="flex items-center gap-1.5 text-rose-300 font-bold">
                            <AlertTriangle className="w-4 h-4 text-rose-400" />
                            <span>{t('dash.withdraw.rejection_title')}</span>
                          </div>
                          <p className="text-rose-200 text-[11px] leading-relaxed bg-black/20 p-2 rounded-lg border border-rose-500/20">
                            {req.rejectionReason}
                          </p>
                          <p className="text-[10px] text-rose-400">
                            {t('dash.withdraw.rejection_hint')}
                          </p>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { PageId } from '../../types';
import { 
  Bell, 
  Plus, 
  Send, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Users, 
  ShieldAlert, 
  Megaphone,
  Radio,
  FileText
} from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'urgent' | 'maintenance';
  targetAudience: 'all' | 'kyc_pending' | 'active_traders' | 'leaders';
  status: 'published' | 'draft' | 'archived';
  sentAt: string;
  readCount: number;
  totalRecipients: number;
  author: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-101',
    title: 'ارتقای نسخه موتور کپی تریدینگ صرافی',
    message: 'به اطلاع می‌رساند کلیه فرآیندهای همگام‌سازی ترید با موفقیت به نسخه ۲.۴ ارتقا یافت.',
    type: 'info',
    targetAudience: 'all',
    status: 'published',
    sentAt: '2026-08-19 09:00',
    readCount: 940,
    totalRecipients: 1284,
    author: 'super.admin@tgex.io'
  },
  {
    id: 'NOTIF-102',
    title: 'لزوم تکمیل مدارک هویتی احراز هویت (KYC)',
    message: 'کاربران گرامی، جهت فعال‌سازی تسویه پورسانت‌های ماهانه، نسبت به بارگذاری کارت شناسایی اقدام فرمایید.',
    type: 'warning',
    targetAudience: 'kyc_pending',
    status: 'published',
    sentAt: '2026-08-18 15:30',
    readCount: 182,
    totalRecipients: 240,
    author: 'compliance@tgex.io'
  },
  {
    id: 'NOTIF-103',
    title: 'تسویه کامل سودهای هفتگی استخر رهبران طلایی و پلاتینوم',
    message: 'پاداش‌های استخر رهبری به کیف‌پول‌های اعضای دارای رتبه واریز گردید.',
    type: 'urgent',
    targetAudience: 'leaders',
    status: 'published',
    sentAt: '2026-08-17 12:00',
    readCount: 96,
    totalRecipients: 98,
    author: 'finance@tgex.io'
  }
];

export const AdminNotificationsPage: React.FC<{ onNavigate?: (page: PageId) => void }> = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newType, setNewType] = useState<'info' | 'warning' | 'urgent' | 'maintenance'>('info');
  const [newTarget, setNewTarget] = useState<'all' | 'kyc_pending' | 'active_traders' | 'leaders'>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      message: newMessage,
      type: newType,
      targetAudience: newTarget,
      status: 'published',
      sentAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      readCount: 0,
      totalRecipients: newTarget === 'all' ? 1284 : newTarget === 'leaders' ? 98 : 240,
      author: 'super.admin@tgex.io'
    };

    setNotifications([newNotif, ...notifications]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewMessage('');
    showToast('اعلان سیستمی جدید با موفقیت ایجاد و برای کاربران هدف ارسال گردید.');
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    showToast('اعلان مورد نظر حذف شد.');
  };

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-mono mb-1.5 border border-blue-500/20">
            <Bell className="w-3.5 h-3.5" />
            <span>GLOBAL BROADCAST & NOTIFICATIONS CENTER</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            مدیریت اعلان‌های سیستمی و پیام‌های همگانی
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            ارسال اطلاعیه‌های مهم، هشدارهای امنیتی، وضعیت‌های نگهداری و پیام‌های هدفمند برای کاربران پلتفرم.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ارسال اعلان جدید (Broadcast)</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div 
            key={notif.id}
            className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-white/20 transition"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                  notif.type === 'urgent' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  notif.type === 'warning' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {notif.type.toUpperCase()}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  هدف: {notif.targetAudience === 'all' ? 'همه کاربران (All)' : notif.targetAudience === 'leaders' ? 'راهبران سازمان' : 'در انتظار KYC'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">• {notif.sentAt}</span>
              </div>

              <h3 className="font-bold text-white text-sm sm:text-base">{notif.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{notif.message}</p>
            </div>

            <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 text-xs font-mono">
              <div className="text-slate-400 text-[11px]">
                دیده شده: <strong className="text-cyan-400 font-bold">{notif.readCount}</strong> / {notif.totalRecipients}
              </div>
              <button
                onClick={() => handleDelete(notif.id)}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition text-xs flex items-center gap-1"
                title="حذف اعلان"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">حذف</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-white/20 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-blue-400">
                <Radio className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">ارسال پیام همگانی به کاربران</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                بستن
              </button>
            </div>

            <form onSubmit={handleCreateNotification} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">عنوان اعلان:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثلاً: اطلاعیه واریز پورسانت‌های ماهانه"
                  className="w-full p-3 bg-slate-950 border border-white/10 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">سطح اهمیت:</label>
                  <select
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
                  >
                    <option value="info">عادی و اطلاع‌رسانی (Info)</option>
                    <option value="warning">هشدار مهم (Warning)</option>
                    <option value="urgent">فوری و امنیتی (Urgent)</option>
                    <option value="maintenance">'Actions' نگهداری سرور</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">گروه مخاطبان هدف:</label>
                  <select
                    value={newTarget}
                    onChange={(e: any) => setNewTarget(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
                  >
                    <option value="all">تمام کاربران ثبت‌نامی</option>
                    <option value="kyc_pending">کاربران در انتظار KYC</option>
                    <option value="active_traders">مشترکین کپی تریدینگ</option>
                    <option value="leaders">دارندگان رتبه و راهبران</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">متن پیام:</label>
                <textarea
                  rows={4}
                  required
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="متن کامل پیام جهت نمایش در اعلان‌های کاربران..."
                  className="w-full p-3 bg-slate-950 border border-white/10 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-blue-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>انتشار و ارسال سراسری</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

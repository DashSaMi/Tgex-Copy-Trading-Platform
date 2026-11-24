import React, { useState, useEffect } from 'react';
import { User, SupportTicket, TicketMessage } from '../../types';
import { ticketService } from '../../services/ticketService';
import { 
  MessageSquare, 
  Send, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Star, 
  Image as ImageIcon,
  User as UserIcon,
  HelpCircle,
  X,
  FileText
} from 'lucide-react';

interface UserSupportTicketsSectionProps {
  user: User;
}

export const UserSupportTicketsSection: React.FC<UserSupportTicketsSectionProps> = ({ user }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  
  // New ticket form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [category, setCategory] = useState('ولت و مالی');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<string | null>(null);
  
  // New message text state
  const [replyMessage, setReplyMessage] = useState('');
  
  // Image preview/modal
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Sync tickets
  const fetchTickets = () => {
    const userTickets = ticketService.getUserTickets(user.id || user.email);
    // Sort so most recent is at top
    userTickets.sort((a, b) => b.id.localeCompare(a.id));
    setTickets(userTickets);
    
    // Update selected ticket details if open
    if (selectedTicket) {
      const updated = ticketService.getTicketById(selectedTicket.id);
      if (updated) setSelectedTicket(updated);
    }
  };

  useEffect(() => {
    fetchTickets();
    
    // Setup real-time event listener
    window.addEventListener('tgex_support_tickets_updated', fetchTickets);
    return () => {
      window.removeEventListener('tgex_support_tickets_updated', fetchTickets);
    };
  }, [user.id, user.email, selectedTicket?.id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newTicket = ticketService.createTicket(
      user.id || user.email,
      user.email,
      user.fullName || user.email.split('@')[0],
      category,
      description,
      imageFile || undefined
    );

    setDescription('');
    setImageFile(null);
    setShowCreateForm(false);
    setSelectedTicket(newTicket);
    fetchTickets();
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    ticketService.addMessage(
      selectedTicket.id,
      'user',
      user.fullName || user.email.split('@')[0],
      replyMessage
    );

    setReplyMessage('');
    fetchTickets();
  };

  const handleRateSupport = (points: number) => {
    if (!selectedTicket) return;
    ticketService.rateTicket(selectedTicket.id, points);
    fetchTickets();
  };

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-mono mb-1.5 border border-blue-500/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>24/7 SUPPORT CENTER</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">پشتیبانی و تیکت‌های گفتگو</h2>
          <p className="text-xs text-slate-400 mt-1">
            مشکلات مالی، فنی، یا سوالات مربوط به لایه‌های شبکه خود را از این قسمت مستقیماً با کارشناسان ما مطرح نمایید.
          </p>
        </div>

        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>ارسال تیکت جدید</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left List of Tickets */}
        <div className="lg:col-span-1 space-y-3.5">
          <div className="p-4 bg-slate-950 border border-white/10 rounded-2xl text-xs font-bold text-slate-400">
            تیکت‌های شما ({tickets.length})
          </div>

          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
            {tickets.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-white/10 text-center space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
                <div className="text-xs font-bold text-slate-400">هیچ تیکتی یافت نشد</div>
                <p className="text-[10px] text-slate-500">برای ارسال سوال خود، دکمه «ارسال تیکت جدید» را کلیک کنید.</p>
              </div>
            ) : (
              tickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                const lastMsg = t.messages[t.messages.length - 1];
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTicket(t);
                      setShowCreateForm(false);
                    }}
                    className={`w-full text-right p-4 rounded-2xl border transition flex flex-col gap-2.5 cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-600/15 border-blue-500/40 shadow-md' 
                        : 'bg-slate-900/55 hover:bg-slate-900/90 border-white/15'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-mono text-[10px] text-slate-400">شناسه: {t.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        t.status === 'pending' ? 'bg-amber-500/20 text-amber-300' :
                        t.status === 'read_and_answered' ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {t.status === 'pending' ? 'در انتظار بررسی' :
                         t.status === 'read_and_answered' ? 'پاسخ داده شده' :
                         'خاتمه یافته'}
                      </span>
                    </div>

                    <div className="font-bold text-white text-xs truncate w-full">{t.category}</div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 w-full">{t.description}</p>

                    <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-white/5 pt-2 mt-1">
                      <span>بروزرسانی: {t.updatedAt}</span>
                      {t.ratingPoints && (
                        <span className="flex items-center gap-0.5 text-amber-400">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{t.ratingPoints}</span>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active View (Create or Chat Detail) */}
        <div className="lg:col-span-2">
          
          {/* 1. Create Form View */}
          {showCreateForm ? (
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-5 shadow-xl animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-blue-400">
                  <Plus className="w-5 h-5" />
                  <h3 className="font-bold text-white text-sm">ارسال تیکت پشتیبانی جدید</h3>
                </div>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">دسته‌بندی موضوع:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="ولت و مالی">ولت و امور مالی (برداشت/واریز)</option>
                    <option value="شبکه و لایه‌ها">شبکه، پورسانت و لایه‌های هیبرید</option>
                    <option value="کپی تریدینگ">کپی تریدینگ و حساب‌های کپی‌شده</option>
                    <option value="مشکل فنی و امنیتی">مشکل فنی سامانه و امنیت حساب</option>
                    <option value="عمومی / سایر">سایر موارد عمومی</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">توضیحات و شرح سوال شما:</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    placeholder="شرح کامل پرسش یا مشکل خود را با جزئیات کامل در این کادر بنویسید..."
                    className="w-full p-3.5 bg-slate-950 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                  />
                </div>

                {/* File Upload with Drag/Click support */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                    <span>آپلود تصویر پیوست (اختیاری):</span>
                  </label>

                  <div className="flex items-center gap-4">
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/15 hover:border-blue-500/50 rounded-2xl p-4 cursor-pointer bg-slate-950 transition w-full sm:w-1/2">
                      <ImageIcon className="w-6 h-6 text-slate-500 mb-1" />
                      <span className="text-[10px] text-slate-400 font-bold">انتخاب فایل تصویر</span>
                      <span className="text-[8px] text-slate-500 mt-0.5">JPG, PNG (Max 5MB)</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="hidden" 
                      />
                    </label>

                    {imageFile && (
                      <div className="relative group w-24 h-24 rounded-2xl overflow-hidden border border-white/10 bg-slate-950">
                        <img 
                          src={imageFile} 
                          alt="Attachment preview" 
                          className="w-full h-full object-cover" 
                        />
                        <button
                          type="button"
                          onClick={() => setImageFile(null)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-rose-400 font-bold text-xs"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-blue-600/30 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>ثبت و ارسال تیکت</span>
                  </button>
                </div>
              </form>
            </div>
          ) : selectedTicket ? (
            
            // 2. Chat Thread View
            <div className="rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col h-[550px] shadow-xl overflow-hidden animate-in fade-in-50 duration-150">
              
              {/* Header */}
              <div className="p-4 bg-slate-950 border-b border-white/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                      {selectedTicket.id}
                    </span>
                    <h4 className="font-bold text-white text-xs">{selectedTicket.category}</h4>
                  </div>
                  <div className="text-[9px] text-slate-500 mt-1">ایجاد شده در: {selectedTicket.createdAt}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedTicket.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                    selectedTicket.status === 'read_and_answered' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {selectedTicket.status === 'pending' ? 'در انتظار بررسی' :
                     selectedTicket.status === 'read_and_answered' ? 'پاسخ داده شده' :
                     'خاتمه یافته'}
                  </span>
                </div>
              </div>

              {/* Chat messages stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
                
                {/* Original Description */}
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span>توضیحات اصلی تیکت:</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {selectedTicket.description}
                  </p>

                  {selectedTicket.imageUrl && (
                    <div className="pt-2">
                      <div className="text-[9px] text-slate-500 mb-1">تصویر ضمیمه شده:</div>
                      <button 
                        onClick={() => setPreviewImage(selectedTicket.imageUrl!)}
                        className="relative rounded-xl overflow-hidden border border-white/10 bg-slate-950 max-w-[200px] h-32 block hover:opacity-85 transition group cursor-zoom-in"
                      >
                        <img 
                          src={selectedTicket.imageUrl} 
                          alt="Attachment" 
                          className="w-full h-full object-cover" 
                        />
                      </button>
                    </div>
                  )}
                </div>

                {/* Separator */}
                <div className="flex items-center justify-center">
                  <span className="h-[1px] bg-white/10 flex-1" />
                  <span className="px-3 text-[9px] text-slate-500 font-bold">شروع گفتگو</span>
                  <span className="h-[1px] bg-white/10 flex-1" />
                </div>

                {/* Message items */}
                {selectedTicket.messages.map((msg) => {
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex ${isAdmin ? 'justify-start' : 'justify-end'} w-full`}
                    >
                      <div className={`max-w-[85%] p-3.5 rounded-2xl space-y-1.5 ${
                        isAdmin 
                          ? 'bg-blue-600/20 border border-blue-500/25 text-white rounded-tr-none' 
                          : 'bg-slate-900 border border-white/5 text-slate-200 rounded-tl-none'
                      }`}>
                        <div className="flex items-center justify-between gap-4 text-[9px] text-slate-400">
                          <span className={`font-bold ${isAdmin ? 'text-blue-300' : 'text-emerald-400'}`}>
                            {isAdmin ? 'پشتیبان سیستم' : msg.senderName}
                          </span>
                          <span className="font-mono">{msg.createdAt}</span>
                        </div>
                        <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Send Reply or Review Points */}
              {selectedTicket.status === 'ended' ? (
                <div className="p-5 bg-slate-950 border-t border-white/10 space-y-4">
                  <div className="flex items-center gap-2 text-amber-400">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <div className="text-xs font-bold text-white">این تیکت توسط کارشناس پشتیبانی خاتمه یافته است.</div>
                  </div>

                  {selectedTicket.ratingPoints ? (
                    <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-400">
                      <span>امتیاز ثبت شده شما به این گفتگو:</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: selectedTicket.ratingPoints }).map((_, idx) => (
                          <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-900 border border-white/10 rounded-2xl space-y-3">
                      <div className="text-[11px] font-bold text-slate-300">لطفاً به کیفیت پاسخگویی و حل مشکل خود امتیاز دهید:</div>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((stars) => (
                          <button
                            key={stars}
                            onClick={() => handleRateSupport(stars)}
                            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-white/10 text-amber-400 hover:scale-105 transition cursor-pointer flex items-center gap-1"
                            title={`ثبت امتیاز ${stars} ستاره`}
                          >
                            <Star className="w-4 h-4 fill-amber-400" />
                            <span className="text-xs font-bold font-mono">{stars}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSendReply} className="p-3 bg-slate-950 border-t border-white/10 flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="پیام خود را تایپ کنید..."
                    className="flex-1 p-3 bg-slate-900 border border-white/15 focus:border-blue-500 rounded-xl text-xs text-white focus:outline-none focus:ring-0"
                  />
                  <button
                    type="submit"
                    className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}

            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-slate-900/40 border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-3.5 h-[500px]">
              <MessageSquare className="w-12 h-12 text-slate-600" />
              <div className="text-sm font-bold text-slate-400">یک گفتگو را از منوی سمت راست انتخاب کنید.</div>
              <p className="text-xs text-slate-500 max-w-sm">
                مشاهده تاریخچه و گفتگوهای فعال یا ثبت تیکت جدید از این پنل در دسترس است.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white z-50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={previewImage} 
              alt="Attachment Full View" 
              className="max-h-[85vh] object-contain rounded-2xl mx-auto shadow-2xl" 
            />
          </div>
        </div>
      )}

    </div>
  );
};

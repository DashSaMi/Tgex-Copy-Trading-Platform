import React, { useState, useEffect } from 'react';
import { SupportTicket, TicketMessage } from '../../types';
import { ticketService } from '../../services/ticketService';
import { 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Star, 
  Image as ImageIcon,
  User as UserIcon,
  Search,
  Filter,
  CheckCircle2,
  X,
  Mail,
  UserCheck
} from 'lucide-react';

export const AdminTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'read_and_answered' | 'ended'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | string>('all');
  
  // Admin response text
  const [replyText, setReplyText] = useState('');
  
  // Zoom image URL
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchTickets = () => {
    const all = ticketService.getAllTickets();
    // Sort most recently updated at the top
    all.sort((a, b) => b.id.localeCompare(a.id));
    setTickets(all);

    // Update selected ticket details if open
    if (selectedTicket) {
      const updated = ticketService.getTicketById(selectedTicket.id);
      if (updated) setSelectedTicket(updated);
    }
  };

  useEffect(() => {
    fetchTickets();
    
    // Listen for database updates to sync admin views immediately
    window.addEventListener('tgex_support_tickets_updated', fetchTickets);
    window.addEventListener('tgex_database_updated', fetchTickets);
    return () => {
      window.removeEventListener('tgex_support_tickets_updated', fetchTickets);
      window.removeEventListener('tgex_database_updated', fetchTickets);
    };
  }, [selectedTicket?.id]);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    // "after each chat it form admin it make pending chat as readed and aswer"
    ticketService.addMessage(
      selectedTicket.id,
      'admin',
      'پشتیبان سیستم',
      replyText
    );

    setReplyText('');
    fetchTickets();
  };

  const handleEndChat = () => {
    if (!selectedTicket) return;
    if (window.confirm('آیا از بستن و خاتمه دادن به این گفتگوی پشتیبانی اطمینان دارید؟')) {
      ticketService.endTicket(selectedTicket.id);
      fetchTickets();
    }
  };

  // Filter logic
  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.userFullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <span>مرکز مدیریت تیکت‌های پشتیبانی</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            پاسخگویی به سوالات کاربران، مشاهده عکس‌های پیوست، ردگیری رضایت و بستن گفتگوها
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/20">
            {tickets.filter(t => t.status === 'pending').length} تیکت در انتظار بررسی
          </span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute right-3 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در شناسه، نام، ایمیل، متن..."
            className="w-full pl-3 pr-9 py-2 bg-slate-900 border border-white/15 focus:border-blue-500 rounded-xl text-xs text-white focus:outline-none"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full p-2.5 bg-slate-900 border border-white/15 rounded-xl text-xs text-white focus:outline-none"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="pending">در انتظار بررسی ادمین 🟡</option>
            <option value="read_and_answered">پاسخ داده شده 🟢</option>
            <option value="ended">خاتمه یافته 🔴</option>
          </select>
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full p-2.5 bg-slate-900 border border-white/15 rounded-xl text-xs text-white focus:outline-none"
          >
            <option value="all">همه دسته‌بندی‌ها</option>
            <option value="ولت و مالی">ولت و امور مالی</option>
            <option value="شبکه و لایه‌ها">شبکه و لایه‌ها</option>
            <option value="کپی تریدینگ">کپی تریدینگ</option>
            <option value="مشکل فنی و امنیتی">مشکل فنی و امنیتی</option>
            <option value="عمومی / سایر">عمومی / سایر</option>
          </select>
        </div>

        <div className="flex items-center justify-end text-xs text-slate-500">
          <span>{filteredTickets.length} تیکت یافت شد</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ticket list left */}
        <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {filteredTickets.length === 0 ? (
            <div className="p-8 bg-slate-900/40 border border-dashed border-white/10 rounded-2xl text-center space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-700 mx-auto" />
              <div className="text-xs font-bold text-slate-400">تیکتی پیدا نشد</div>
            </div>
          ) : (
            filteredTickets.map((t) => {
              const isSelected = selectedTicket?.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`w-full text-right p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex flex-col gap-2 ${
                    isSelected 
                      ? 'bg-blue-600/15 border-blue-500' 
                      : 'bg-slate-900 hover:bg-slate-900/80 border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center w-full text-[10px]">
                    <span className="font-mono text-slate-400">{t.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      t.status === 'pending' ? 'bg-amber-500/20 text-amber-300' :
                      t.status === 'read_and_answered' ? 'bg-emerald-500/20 text-emerald-300' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {t.status === 'pending' ? 'بررسی نشده' :
                       t.status === 'read_and_answered' ? 'پاسخ داده شده' :
                       'خاتمه یافته'}
                    </span>
                  </div>

                  <div className="text-white text-xs font-bold">{t.userFullName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{t.userEmail}</div>

                  <div className="text-[11px] font-medium text-blue-400 bg-blue-500/5 px-2 py-1 rounded border border-blue-500/10 mt-1">
                    {t.category}
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-1 w-full mt-1">{t.description}</p>

                  <div className="flex justify-between items-center text-[9px] text-slate-500 border-t border-white/5 pt-2 mt-1">
                    <span>ثبت: {t.createdAt}</span>
                    {t.ratingPoints && (
                      <span className="flex items-center gap-0.5 text-amber-400 font-bold bg-amber-500/15 px-1.5 py-0.5 rounded">
                        <Star className="w-2.5 h-2.5 fill-amber-400" />
                        <span>امتیاز {t.ratingPoints}</span>
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Detailed Chat Stream right */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <div className="rounded-3xl bg-slate-900 border border-white/10 flex flex-col h-[600px] shadow-xl overflow-hidden animate-in fade-in-50 duration-150">
              
              {/* Header */}
              <div className="p-4 bg-slate-950 border-b border-white/10 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded">{selectedTicket.id}</span>
                    <h3 className="font-bold text-white text-xs">{selectedTicket.userFullName} ({selectedTicket.userEmail})</h3>
                  </div>
                  <div className="text-[10px] text-slate-500">تاریخ ثبت تیکت: {selectedTicket.createdAt}</div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedTicket.status !== 'ended' && (
                    <button
                      onClick={handleEndChat}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      خاتمه و بستن گفتگو
                    </button>
                  )}
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedTicket.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                    selectedTicket.status === 'read_and_answered' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {selectedTicket.status === 'pending' ? 'در انتظار ادمین' :
                     selectedTicket.status === 'read_and_answered' ? 'پاسخ داده شده' :
                     'خاتمه یافته'}
                  </span>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
                
                {/* Description card */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-blue-400">دسته‌بندی موضوع: {selectedTicket.category}</span>
                    <span className="font-mono">ثبت: {selectedTicket.createdAt}</span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {selectedTicket.description}
                  </p>

                  {selectedTicket.imageUrl && (
                    <div className="pt-2">
                      <div className="text-[9px] text-slate-500 mb-1">تصویر پیوست شده توسط کاربر:</div>
                      <button 
                        onClick={() => setPreviewImage(selectedTicket.imageUrl!)}
                        className="relative rounded-xl overflow-hidden border border-white/10 bg-slate-950 max-w-[240px] h-36 block hover:opacity-85 transition cursor-zoom-in"
                      >
                        <img 
                          src={selectedTicket.imageUrl} 
                          alt="User upload" 
                          className="w-full h-full object-cover" 
                        />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <span className="h-[1px] bg-white/10 flex-1" />
                  <span className="px-3 text-[10px] text-slate-500 font-bold">تاریخچه مکالمات تیکت</span>
                  <span className="h-[1px] bg-white/10 flex-1" />
                </div>

                {/* Message stream */}
                {selectedTicket.messages.map((msg) => {
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} w-full`}
                    >
                      <div className={`max-w-[85%] p-3.5 rounded-2xl space-y-1.5 ${
                        isAdmin 
                          ? 'bg-blue-600/25 border border-blue-500/30 text-white rounded-tl-none' 
                          : 'bg-slate-900 border border-white/10 text-slate-200 rounded-tr-none'
                      }`}>
                        <div className="flex items-center justify-between gap-4 text-[9px] text-slate-400">
                          <span className={`font-bold ${isAdmin ? 'text-blue-300' : 'text-emerald-400'}`}>
                            {isAdmin ? 'مدیریت و پشتیبانی' : msg.senderName}
                          </span>
                          <span className="font-mono">{msg.createdAt}</span>
                        </div>
                        <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Response input */}
              {selectedTicket.status === 'ended' ? (
                <div className="p-5 bg-slate-950 border-t border-white/10">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>این گفتگو خاتمه یافته و آرشیو شده است.</span>
                    </div>

                    {selectedTicket.ratingPoints && (
                      <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/15 px-3 py-1 rounded-xl">
                        <span>رضایت کاربر:</span>
                        <span className="font-bold text-sm font-mono">{selectedTicket.ratingPoints}</span>
                        <div className="flex">
                          {Array.from({ length: selectedTicket.ratingPoints }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendReply} className="p-3 bg-slate-950 border-t border-white/10 flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="پاسخ ادمین و راهنمایی کاربر..."
                    className="flex-1 p-3 bg-slate-900 border border-white/15 focus:border-blue-500 rounded-xl text-xs text-white focus:outline-none"
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
            <div className="p-12 rounded-3xl bg-slate-900/40 border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-3.5 h-[600px]">
              <MessageSquare className="w-12 h-12 text-slate-700" />
              <div className="text-sm font-bold text-slate-400">یک تیکت را از پنل سمت راست انتخاب نمایید.</div>
              <p className="text-xs text-slate-500">
                با کلیک بر روی هر تیکت می‌توانید سوابق کامل سوال، توضیحات پیوست و عکس‌های ارسالی کاربر را مشاهده کرده و مستقیماً پاسخ ارسال کنید.
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

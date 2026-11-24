import React from 'react';
import { KycStatus } from '../../types';
import { ShieldCheck, ShieldAlert, Clock, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface KycStatusBannerProps {
  status: KycStatus;
  rejectionReason?: string;
  onStartKyc?: () => void;
}

export const KycStatusBanner: React.FC<KycStatusBannerProps> = ({
  status,
  rejectionReason,
  onStartKyc
}) => {
  if (status === 'approved') {
    return (
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>احراز هویت تایید شده (KYC Verified)</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                فعال و نامحدود
              </span>
            </div>
            <p className="text-slate-400 text-[11px] mt-0.5">
              مدارک هویتی شما تایید شده و تمامی امکانات واریز و برداشت پاداش‌های بازاریابی فعال هستند.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>مدارک در نوبت بررسی (In Review)</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                در حال بررسی
              </span>
            </div>
            <p className="text-slate-400 text-[11px] mt-0.5">
              مدارک شما با موفقیت ارسال گردیده و کارشناسان واحد انطباق (Compliance) در حال اعتبارسنجی هستند (معمولاً کمتر از ۲ ساعت).
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-rose-300 flex items-center gap-2">
              <span>احراز هویت رد شد (KYC Rejected)</span>
              <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px]">
                نیاز به بازنگری
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              <strong className="text-rose-400">علت رد مدارک: </strong>
              {rejectionReason || 'مدارک ارسالی خوانا نبود یا با اطلاعات کاربری مطابقت نداشت.'}
            </p>
          </div>
        </div>

        {onStartKyc && (
          <button
            onClick={onStartKyc}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition flex items-center justify-center gap-1.5 flex-shrink-0"
          >
            <span>بارگذاری مجدد مدارک</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  // Not Started
  return (
    <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-white flex items-center gap-2">
            <span>احراز هویت هنوز تکمیل نشده است (Not Started)</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px]">
              الزامی برای برداشت
            </span>
          </div>
          <p className="text-slate-400 text-[11px] mt-0.5">
            جهت انطباق با قوانین جهانی مالی و فعال‌سازی برداشت پاداش‌های بازاریابی، احراز هویت را در چند گام ساده انجام دهید.
          </p>
        </div>
      </div>

      {onStartKyc && (
        <button
          onClick={onStartKyc}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-1.5 flex-shrink-0"
        >
          <span>تکمیل احراز هویت</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

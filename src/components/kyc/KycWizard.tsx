import React, { useState } from 'react';
import { User, KycPersonalInfo, KycDocumentFiles } from '../../types';
import { kycService } from '../../services/kycService';
import { 
  ShieldCheck, 
  UploadCloud, 
  FileText, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  ArrowLeft, 
  ArrowRight,
  Info,
  Trash2
} from 'lucide-react';

interface KycWizardProps {
  user: User;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const KycWizard: React.FC<KycWizardProps> = ({ user, onSuccess, onCancel }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [personalInfo, setPersonalInfo] = useState<KycPersonalInfo>({
    firstName: user.fullName ? user.fullName.split(' ')[0] : '',
    lastName: user.fullName ? user.fullName.split(' ').slice(1).join(' ') : '',
    dateOfBirth: '1995-01-01',
    country: 'ایران',
    phone: '+98',
    idNumber: ''
  });

  const [documents, setDocuments] = useState<KycDocumentFiles>({});

  // Helper for simulated file selection
  const handleFileSimulate = (key: keyof KycDocumentFiles, defaultName: string, sizeStr: string) => {
    setDocuments(prev => ({
      ...prev,
      [key]: defaultName,
      [`${key}Size` as any]: sizeStr
    }));
    setErrorMsg(null);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalInfo.firstName.trim() || !personalInfo.lastName.trim() || !personalInfo.idNumber?.trim()) {
      setErrorMsg('لطفاً تمامی فیلدهای الزامی را به دقت تکمیل نمایید.');
      return;
    }
    setErrorMsg(null);
    setCurrentStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!documents.idFrontName) {
      setErrorMsg('بارگذاری تصویر روی کارت شناسایی / گذرنامه الزامی است.');
      return;
    }
    if (!documents.selfieName) {
      setErrorMsg('بارگذاری تصویر سلفی همراه با مدرک شناسایی الزامی است.');
      return;
    }
    setErrorMsg(null);
    setCurrentStep(3);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await kycService.submitApplication(user, personalInfo, documents);
      setLoading(false);
      onSuccess();
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'خطا در ثبت مدارک احراز هویت.');
    }
  };

  return (
    <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/80 border border-white/10 max-w-3xl mx-auto space-y-8 text-slate-200">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
          SECURE AML / KYC VERIFICATION
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          فرآیند احراز هویت تیجکس (KYC)
        </h2>
        <p className="text-xs text-slate-400">
          اطلاعات شما با استاندارد رمزنگاری بانکی و به صورت کاملاً ایزوله ذخیره شده و هیچ‌گاه در صفحات عمومی نمایش داده نمی‌شود.
        </p>
      </div>

      {/* Step Progress Bar */}
      <div className="flex items-center justify-between max-w-md mx-auto relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 -z-0"></div>
        <div 
          className="absolute top-1/2 right-0 h-0.5 bg-blue-600 -translate-y-1/2 -z-0 transition-all duration-300"
          style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
        ></div>

        <div className={`flex flex-col items-center gap-1.5 z-10 ${currentStep >= 1 ? 'text-blue-400' : 'text-slate-500'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${currentStep >= 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-slate-800'}`}>
            ۱
          </div>
          <span className="text-[10px]">اطلاعات فردی</span>
        </div>

        <div className={`flex flex-col items-center gap-1.5 z-10 ${currentStep >= 2 ? 'text-blue-400' : 'text-slate-500'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${currentStep >= 2 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-slate-800'}`}>
            ۲
          </div>
          <span className="text-[10px]">بارگذاری مدارک</span>
        </div>

        <div className={`flex flex-col items-center gap-1.5 z-10 ${currentStep === 3 ? 'text-blue-400' : 'text-slate-500'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${currentStep === 3 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-slate-800'}`}>
            ۳
          </div>
          <span className="text-[10px]">تایید نهایی</span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Personal Info */}
      {currentStep === 1 && (
        <form onSubmit={handleStep1Submit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">نام (مطابق مدرک شناسایی)</label>
              <input
                type="text"
                required
                value={personalInfo.firstName}
                onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                placeholder="مثال: سامان"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">نام خانوادگی</label>
              <input
                type="text"
                required
                value={personalInfo.lastName}
                onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                placeholder="مثال: کریمیان"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">کد ملی / شماره پاسپورت</label>
              <input
                type="text"
                required
                value={personalInfo.idNumber || ''}
                onChange={(e) => setPersonalInfo({ ...personalInfo, idNumber: e.target.value })}
                placeholder="مثال: 0012938475"
                dir="ltr"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">تاریخ تولد</label>
              <input
                type="date"
                required
                value={personalInfo.dateOfBirth}
                onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                dir="ltr"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">کشور اقامت</label>
              <select
                value={personalInfo.country}
                onChange={(e) => setPersonalInfo({ ...personalInfo, country: e.target.value })}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="ایران">ایران (Iran)</option>
                <option value="امارات">امارات متحده عربی (UAE)</option>
                <option value="ترکیه">ترکیه (Turkey)</option>
                <option value="عمان">عمان (Oman)</option>
                <option value="سایر">سایر کشورها</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">شماره تماس فعال</label>
              <input
                type="tel"
                required
                value={personalInfo.phone}
                onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                dir="ltr"
                placeholder="+98912..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

          </div>

          <div className="flex justify-between items-center pt-4">
            {onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:text-white"
              >
                انصراف
              </button>
            ) : <div></div>}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/25 flex items-center gap-2"
            >
              <span>مرحله بعد: بارگذاری مدارک</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: Document Upload */}
      {currentStep === 2 && (
        <form onSubmit={handleStep2Submit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Front ID */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-400" />
                  تصویر روی کارت ملی / پاسپورت (الزامی)
                </span>
              </div>

              {documents.idFrontName ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="truncate text-emerald-300 font-mono">{documents.idFrontName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDocuments({ ...documents, idFrontName: undefined })}
                    className="text-rose-400 hover:text-rose-300 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => handleFileSimulate('idFrontName', 'national_id_front.jpg', '2.4 MB')}
                  className="border-2 border-dashed border-white/10 hover:border-blue-500/50 rounded-xl p-5 text-center cursor-pointer transition bg-slate-900/40 space-y-2"
                >
                  <UploadCloud className="w-6 h-6 text-blue-400 mx-auto" />
                  <div className="text-xs font-bold text-white">کلیک جهت انتخاب فایل یا درگ تصویر</div>
                  <div className="text-[10px] text-slate-500">فرمت‌های مجاز: JPG, PNG, PDF (حداکثر ۱۰ مگابایت)</div>
                </div>
              )}
            </div>

            {/* Back ID (Optional) */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  تصویر پشت کارت ملی (اختیاری)
                </span>
              </div>

              {documents.idBackName ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="truncate text-emerald-300 font-mono">{documents.idBackName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDocuments({ ...documents, idBackName: undefined })}
                    className="text-rose-400 hover:text-rose-300 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => handleFileSimulate('idBackName', 'national_id_back.jpg', '1.9 MB')}
                  className="border-2 border-dashed border-white/10 hover:border-cyan-500/50 rounded-xl p-5 text-center cursor-pointer transition bg-slate-900/40 space-y-2"
                >
                  <UploadCloud className="w-6 h-6 text-cyan-400 mx-auto" />
                  <div className="text-xs font-bold text-white">کلیک جهت بارگذاری پشت مدرک</div>
                  <div className="text-[10px] text-slate-500">برای پاسپورت نیازی نیست</div>
                </div>
              )}
            </div>

            {/* Selfie with ID */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3 md:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-amber-400" />
                  تصویر سلفی همراه با مدرک هویتی در دست (الزامی)
                </span>
              </div>

              {documents.selfieName ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="truncate text-emerald-300 font-mono">{documents.selfieName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDocuments({ ...documents, selfieName: undefined })}
                    className="text-rose-400 hover:text-rose-300 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => handleFileSimulate('selfieName', 'selfie_verification.jpg', '3.5 MB')}
                  className="border-2 border-dashed border-white/10 hover:border-amber-500/50 rounded-xl p-6 text-center cursor-pointer transition bg-slate-900/40 space-y-2"
                >
                  <Camera className="w-7 h-7 text-amber-400 mx-auto" />
                  <div className="text-xs font-bold text-white">کلیک جهت بارگذاری تصویر سلفی</div>
                  <div className="text-[10px] text-slate-400 max-w-sm mx-auto">
                    لطفاً مدرک شناسایی را در دست گرفته به طوری که چهره و متن کارت کاملاً واضح و بدون بازتاب نور باشند.
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Security Guarantee Box */}
          <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/20 flex items-center gap-3 text-xs text-blue-300">
            <Lock className="w-5 h-5 flex-shrink-0 text-blue-400" />
            <p className="leading-relaxed text-[11px]">
              <strong>استاندارد امنیت خزانه‌ای:</strong> فایل‌ها در استوریج ایزوله با دسترسی بدون URL عمومی ذخیره شده و فرآیند اسکن امنیتی آنتی‌ویروس را طی می‌کنند.
            </p>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:text-white flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>مرحله قبل</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/25 flex items-center gap-2"
            >
              <span>مرحله بعد: بررسی نهایی</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Review & Submit */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-950/70 border border-white/10 space-y-4 text-xs">
            <h3 className="font-bold text-white text-sm border-b border-white/5 pb-2">
              خلاصه اطلاعات جهت ارسال به واحد انطباق (Compliance)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
              <div>
                <span className="text-slate-500 block">نام و نام خانوادگی:</span>
                <span className="font-bold text-white">{personalInfo.firstName} {personalInfo.lastName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">کد ملی / پاسپورت:</span>
                <span className="font-mono text-white">{personalInfo.idNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">تاریخ تولد:</span>
                <span className="font-mono text-white">{personalInfo.dateOfBirth}</span>
              </div>
              <div>
                <span className="text-slate-500 block">کشور و شماره تماس:</span>
                <span className="font-mono text-white">{personalInfo.country} ({personalInfo.phone})</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 space-y-2">
              <span className="text-slate-500 block text-[11px]">مدارک آماده ارسال:</span>
              <div className="flex flex-wrap gap-2 text-[11px]">
                {documents.idFrontName && (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-white/5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    روی کارت: {documents.idFrontName}
                  </span>
                )}
                {documents.selfieName && (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-white/5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    سلفی: {documents.selfieName}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:text-white flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>ویرایش مدارک</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleFinalSubmit}
              className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/30 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>در حال ارسال و رمزنگاری امن...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>ارسال نهایی درخواست احراز هویت</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

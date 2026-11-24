import React, { useState, useEffect } from 'react';
import { PageId } from '../../types';
import { 
  cmsService, 
  WebsiteCmsData, 
  HomeCmsContent, 
  AboutCmsContent, 
  FaqCmsContent, 
  AnnouncementCmsContent,
  FaqItemCms
} from '../../services/cmsService';
import { 
  Globe, 
  Save, 
  CheckCircle2, 
  Sliders, 
  FileText, 
  Eye, 
  RotateCcw, 
  Sparkles, 
  Shield, 
  Zap, 
  Network, 
  Plus, 
  Trash2, 
  ExternalLink,
  HelpCircle,
  Megaphone,
  Layers,
  BarChart3,
  Info,
  Check,
  SplitSquareVertical,
  Monitor
} from 'lucide-react';

interface AdminCmsPageProps {
  onNavigate?: (page: PageId) => void;
}

export const AdminCmsPage: React.FC<AdminCmsPageProps> = ({ onNavigate }) => {
  // Local state for the full CMS data being edited
  const [cmsData, setCmsData] = useState<WebsiteCmsData>(() => cmsService.getData());
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'faq' | 'announcement'>('home');
  const [viewMode, setViewMode] = useState<'editor' | 'split'>('editor');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sync if external update happens
  useEffect(() => {
    const unsub = cmsService.subscribe((updated) => {
      // only update if not dirty
      if (!hasUnsavedChanges) {
        setCmsData(updated);
      }
    });
    return () => unsub();
  }, [hasUnsavedChanges]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleSaveAll = () => {
    cmsService.updateAll(cmsData);
    setHasUnsavedChanges(false);
    showToast('تمامی تغییرات محتوایی با موفقیت ذخیره و در وب‌سایت عمومی اعمال گردید.');
  };

  const handleSaveSection = (sectionKey: 'home' | 'about' | 'faq' | 'announcement', sectionLabel: string) => {
    if (sectionKey === 'home') cmsService.updateHome(cmsData.home);
    else if (sectionKey === 'about') cmsService.updateAbout(cmsData.about);
    else if (sectionKey === 'faq') cmsService.updateFaq(cmsData.faq);
    else if (sectionKey === 'announcement') cmsService.updateAnnouncement(cmsData.announcement);

    setSavedSection(sectionKey);
    setTimeout(() => setSavedSection(null), 2500);
    setHasUnsavedChanges(false);
    showToast(`بخش "${sectionLabel}" با موفقیت ذخیره و بلافاصله در وب‌سایت عمومی منتشر شد.`);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('آیا از بازنشانی تمامی متون به مقادیر پیش‌فرض اطمینان دارید؟ تغییرات فعلی جایگزین خواهند شد.')) {
      const def = cmsService.resetToDefaults();
      setCmsData(def);
      setHasUnsavedChanges(false);
      showToast('تمام متون وب‌سایت به تنظیمات پیش‌فرض کارخانه بازگردانده شد.');
    }
  };

  // Helper updates
  const updateHomeField = <K extends keyof HomeCmsContent>(field: K, value: HomeCmsContent[K]) => {
    setCmsData(prev => ({
      ...prev,
      home: { ...prev.home, [field]: value }
    }));
    setHasUnsavedChanges(true);
  };

  const updateAboutField = <K extends keyof AboutCmsContent>(field: K, value: AboutCmsContent[K]) => {
    setCmsData(prev => ({
      ...prev,
      about: { ...prev.about, [field]: value }
    }));
    setHasUnsavedChanges(true);
  };

  const updateAnnouncementField = <K extends keyof AnnouncementCmsContent>(field: K, value: AnnouncementCmsContent[K]) => {
    setCmsData(prev => ({
      ...prev,
      announcement: { ...prev.announcement, [field]: value }
    }));
    setHasUnsavedChanges(true);
  };

  const updateFaqField = <K extends keyof FaqCmsContent>(field: K, value: FaqCmsContent[K]) => {
    setCmsData(prev => ({
      ...prev,
      faq: { ...prev.faq, [field]: value }
    }));
    setHasUnsavedChanges(true);
  };

  const updateFaqItem = (index: number, key: keyof FaqItemCms, val: string) => {
    const updated = [...cmsData.faq.items];
    updated[index] = { ...updated[index], [key]: val };
    updateFaqField('items', updated);
  };

  const addFaqItem = () => {
    const newItem: FaqItemCms = {
      id: `faq_${Date.now()}`,
      category: 'general',
      question: 'عنوان پرسش جدید را وارد کنید',
      answer: 'پاسخ کامل این پرسش متداول را اینجا درج نمایید.'
    };
    updateFaqField('items', [newItem, ...cmsData.faq.items]);
  };

  const removeFaqItem = (index: number) => {
    const updated = cmsData.faq.items.filter((_, i) => i !== index);
    updateFaqField('items', updated);
  };

  const updateHomeFaqItem = (index: number, key: 'q' | 'a', val: string) => {
    const updated = [...cmsData.home.faqs];
    updated[index] = { ...updated[index], [key]: val };
    updateHomeField('faqs', updated);
  };

  return (
    <div className="space-y-8" dir="rtl">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. Sleek Header Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono font-bold">
            <Globe className="w-3.5 h-3.5" />
            <span>WEBSITE CMS & LIVE CONTENT ENGINE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            مدیریت محتوای صفحات عمومی وب‌سایت
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
            محتوای واقعی تمامی بخش‌های سایت شامل صفحه اصلی، درباره ما، سوالات متداول و اعلان سراسری را ویرایش کنید. هر بخشی که ذخیره شود بلافاصله روی وب‌سایت زنده اعمال می‌شود.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {hasUnsavedChanges && (
            <span className="text-xs text-amber-400 flex items-center gap-1.5 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              تغییرات ذخیره‌نشده دارید
            </span>
          )}

          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white font-bold text-xs border border-white/10 transition"
            title="بازنشانی تمام متون به مقادیر اولیه"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>بازنشانی پیش‌فرض</span>
          </button>

          {onNavigate && (
            <button
              onClick={() => onNavigate(activeTab === 'announcement' ? 'home' : activeTab)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white font-bold text-xs border border-white/10 transition"
              title="مشاهده صفحه عمومی در سایت"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>مشاهده در سایت</span>
            </button>
          )}

          <button
            onClick={handleSaveAll}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            <span>ذخیره کلی تغییرات</span>
          </button>
        </div>
      </div>

      {/* 2. Top Navigation Pill Tabs & View Mode Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        
        {/* Page Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { key: 'home', label: 'صفحه اصلی (Home Landing)', icon: Globe },
            { key: 'about', label: 'درباره ما (About Us)', icon: FileText },
            { key: 'faq', label: 'سوالات متداول (FAQ)', icon: HelpCircle },
            { key: 'announcement', label: 'اعلان سراسری بالای سایت', icon: Megaphone }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 border border-blue-400/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900 border border-white/5'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* View Mode Toggle: Wide Editor vs Split with Live Preview */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/10 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('editor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'editor'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>حالت تمام‌صفحه ویرایشگر</span>
          </button>

          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'split'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>نمای پیش‌نمایش در کنار</span>
          </button>
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className={`grid gap-8 items-start ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
        
        {/* Editor Form Column */}
        <div className={viewMode === 'split' ? 'lg:col-span-7 space-y-8' : 'space-y-8 max-w-5xl mx-auto w-full'}>
          
          {/* ========================================================= */}
          {/* TAB 1: HOME PAGE CONTENT */}
          {/* ========================================================= */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              
              {/* Section 1: Hero & CTA */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>سربرگ اصلی و هیرو (Hero Section)</span>
                    </h3>
                    <p className="text-xs text-slate-400">تیتر H1، زیرعنوان توضیحی، برچسب بالای سربرگ و دکمه‌های اقدام به عمل</p>
                  </div>

                  <button
                    onClick={() => handleSaveSection('home', 'سربرگ اصلی')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/20"
                  >
                    {savedSection === 'home' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
                    <span>{savedSection === 'home' ? 'ذخیره شد!' : 'ذخیره این بخش'}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      متن برچسب بالای سربرگ (Badge Tag)
                    </label>
                    <input
                      type="text"
                      value={cmsData.home.heroBadge}
                      onChange={(e) => updateHomeField('heroBadge', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      عنوان اصلی صفحه هیرو (H1 Main Title)
                    </label>
                    <input
                      type="text"
                      value={cmsData.home.heroTitle}
                      onChange={(e) => updateHomeField('heroTitle', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm font-bold focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      توضیحات تکمیلی زیر عنوان (Subtitle Description)
                    </label>
                    <textarea
                      rows={3}
                      value={cmsData.home.heroSubtitle}
                      onChange={(e) => updateHomeField('heroSubtitle', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs leading-relaxed focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        متن دکمه اول (Primary CTA)
                      </label>
                      <input
                        type="text"
                        value={cmsData.home.ctaPrimary}
                        onChange={(e) => updateHomeField('ctaPrimary', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        متن دکمه دوم (Secondary CTA)
                      </label>
                      <input
                        type="text"
                        value={cmsData.home.ctaSecondary}
                        onChange={(e) => updateHomeField('ctaSecondary', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Key Stats & Platform Metrics */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-emerald-400" />
                      <span>آمارهای کلیدی صفحه اصلی (Key Metrics)</span>
                    </h3>
                    <p className="text-xs text-slate-400">نمایش ۴ آمار اعتمادساز در نوار زیر دکمه‌های هیرو</p>
                  </div>

                  <button
                    onClick={() => handleSaveSection('home', 'آمارهای کلیدی')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/20"
                  >
                    {savedSection === 'home' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
                    <span>ذخیره این بخش</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                    <div className="text-xs font-bold text-cyan-400">آمار ۱: حجم معاملات ماهانه</div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">مقدار نمایشی</label>
                      <input
                        type="text"
                        value={cmsData.home.stat1Val}
                        onChange={(e) => updateHomeField('stat1Val', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">برچسب زیر مقدار</label>
                      <input
                        type="text"
                        value={cmsData.home.stat1Label}
                        onChange={(e) => updateHomeField('stat1Label', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                    <div className="text-xs font-bold text-blue-400">آمار ۲: کاربران فعال</div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">مقدار نمایشی</label>
                      <input
                        type="text"
                        value={cmsData.home.stat2Val}
                        onChange={(e) => updateHomeField('stat2Val', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">برچسب زیر مقدار</label>
                      <input
                        type="text"
                        value={cmsData.home.stat2Label}
                        onChange={(e) => updateHomeField('stat2Label', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                    <div className="text-xs font-bold text-amber-400">آمار ۳: پاداش‌های توزیع‌شده</div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">مقدار نمایشی</label>
                      <input
                        type="text"
                        value={cmsData.home.stat3Val}
                        onChange={(e) => updateHomeField('stat3Val', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">برچسب زیر مقدار</label>
                      <input
                        type="text"
                        value={cmsData.home.stat3Label}
                        onChange={(e) => updateHomeField('stat3Label', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                    <div className="text-xs font-bold text-emerald-400">آمار ۴: آپ‌تایم شبکه</div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">مقدار نمایشی</label>
                      <input
                        type="text"
                        value={cmsData.home.stat4Val}
                        onChange={(e) => updateHomeField('stat4Val', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">برچسب زیر مقدار</label>
                      <input
                        type="text"
                        value={cmsData.home.stat4Label}
                        onChange={(e) => updateHomeField('stat4Label', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Competitive Advantages */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-400" />
                      <span>مزایای رقابتی پلتفرم (Competitive Advantages)</span>
                    </h3>
                    <p className="text-xs text-slate-400">عناوین و شرح مزیت‌های امنیتی و فنی نمایش داده شده در کارت‌های صفحه اصلی</p>
                  </div>

                  <button
                    onClick={() => handleSaveSection('home', 'مزایای رقابتی')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/20"
                  >
                    {savedSection === 'home' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
                    <span>ذخیره این بخش</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      <span>مزیت اول (امنیت و عدم تصدی)</span>
                    </div>
                    <input
                      type="text"
                      value={cmsData.home.feat1Title}
                      onChange={(e) => updateHomeField('feat1Title', e.target.value)}
                      placeholder="عنوان مزیت اول"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-bold"
                    />
                    <textarea
                      rows={2}
                      value={cmsData.home.feat1Desc}
                      onChange={(e) => updateHomeField('feat1Desc', e.target.value)}
                      placeholder="توضیحات مزیت اول"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs leading-relaxed"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                    <div className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span>مزیت دوم (تسویه سود واقعی)</span>
                    </div>
                    <input
                      type="text"
                      value={cmsData.home.feat2Title}
                      onChange={(e) => updateHomeField('feat2Title', e.target.value)}
                      placeholder="عنوان مزیت دوم"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-bold"
                    />
                    <textarea
                      rows={2}
                      value={cmsData.home.feat2Desc}
                      onChange={(e) => updateHomeField('feat2Desc', e.target.value)}
                      placeholder="توضیحات مزیت دوم"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs leading-relaxed"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                    <div className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                      <Network className="w-3.5 h-3.5" />
                      <span>مزیت سوم (ماتریس هوشمند ۲۰ لایه‌ای)</span>
                    </div>
                    <input
                      type="text"
                      value={cmsData.home.feat3Title}
                      onChange={(e) => updateHomeField('feat3Title', e.target.value)}
                      placeholder="عنوان مزیت سوم"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-bold"
                    />
                    <textarea
                      rows={2}
                      value={cmsData.home.feat3Desc}
                      onChange={(e) => updateHomeField('feat3Desc', e.target.value)}
                      placeholder="توضیحات مزیت سوم"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Home FAQs */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-cyan-400" />
                      <span>سوالات متداول فوتر صفحه اصلی (Home FAQs)</span>
                    </h3>
                    <p className="text-xs text-slate-400">ویرایش پرسش و پاسخ‌های اصلی انتهای لندینگ پیج</p>
                  </div>

                  <button
                    onClick={() => handleSaveSection('home', 'سوالات متداول صفحه اصلی')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/20"
                  >
                    {savedSection === 'home' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
                    <span>ذخیره این بخش</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {cmsData.home.faqs.map((faq, idx) => (
                    <div key={faq.id || idx} className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2.5">
                      <div className="text-xs font-bold text-cyan-400">پرسش {idx + 1}:</div>
                      <input
                        type="text"
                        value={faq.q}
                        onChange={(e) => updateHomeFaqItem(idx, 'q', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-bold"
                      />
                      <textarea
                        rows={2}
                        value={faq.a}
                        onChange={(e) => updateHomeFaqItem(idx, 'a', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: ABOUT US PAGE CONTENT */}
          {/* ========================================================= */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              
              {/* Section 1: Hero & Tagline */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span>سربرگ صفحه درباره ما (Hero & Tagline)</span>
                    </h3>
                    <p className="text-xs text-slate-400">عنوان اصلی، برچسب بالا و متن مقدمه صفحه درباره ما</p>
                  </div>

                  <button
                    onClick={() => handleSaveSection('about', 'سربرگ درباره ما')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/20"
                  >
                    {savedSection === 'about' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
                    <span>ذخیره این بخش</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">برچسب بالای تیتر (Tagline)</label>
                    <input
                      type="text"
                      value={cmsData.about.tagline}
                      onChange={(e) => updateAboutField('tagline', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">عنوان اصلی (H1 Title)</label>
                    <input
                      type="text"
                      value={cmsData.about.title}
                      onChange={(e) => updateAboutField('title', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">زیرعنوان و توضیحات اصلی (Subtitle)</label>
                    <textarea
                      rows={3}
                      value={cmsData.about.subtitle}
                      onChange={(e) => updateAboutField('subtitle', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Mission & Vision */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span>ماموریت و چشم‌انداز (Mission & Vision)</span>
                    </h3>
                    <p className="text-xs text-slate-400">کارت‌های اسلایدی ماموریت و چشم‌انداز جهانی در صفحه درباره ما</p>
                  </div>

                  <button
                    onClick={() => handleSaveSection('about', 'ماموریت و چشم‌انداز')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/20"
                  >
                    {savedSection === 'about' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
                    <span>ذخیره این بخش</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mission */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                    <div className="text-xs font-bold text-blue-400">کارت ماموریت ما:</div>
                    <input
                      type="text"
                      value={cmsData.about.missionTitle}
                      onChange={(e) => updateAboutField('missionTitle', e.target.value)}
                      placeholder="عنوان ماموریت"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-bold"
                    />
                    <textarea
                      rows={4}
                      value={cmsData.about.missionText}
                      onChange={(e) => updateAboutField('missionText', e.target.value)}
                      placeholder="متن ماموریت"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs leading-relaxed"
                    />
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">آمار توانمندسازی</label>
                      <input
                        type="text"
                        value={cmsData.about.missionStat}
                        onChange={(e) => updateAboutField('missionStat', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Vision */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                    <div className="text-xs font-bold text-purple-400">کارت چشم‌انداز جهانی:</div>
                    <input
                      type="text"
                      value={cmsData.about.visionTitle}
                      onChange={(e) => updateAboutField('visionTitle', e.target.value)}
                      placeholder="عنوان چشم‌انداز"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-bold"
                    />
                    <textarea
                      rows={4}
                      value={cmsData.about.visionText}
                      onChange={(e) => updateAboutField('visionText', e.target.value)}
                      placeholder="متن چشم‌انداز"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs leading-relaxed"
                    />
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">آمار پوشش جغرافیایی</label>
                      <input
                        type="text"
                        value={cmsData.about.visionStat}
                        onChange={(e) => updateAboutField('visionStat', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: 3 Pillars */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <span>۳ ستون اصلی معماری تیجکس (The 3 Architectural Pillars)</span>
                    </h3>
                    <p className="text-xs text-slate-400">عناوین و شرح کارت‌های سه ستون اصلی زیرساخت در صفحه درباره ما</p>
                  </div>

                  <button
                    onClick={() => handleSaveSection('about', '۳ ستون اصلی')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/20"
                  >
                    {savedSection === 'about' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
                    <span>ذخیره این بخش</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                    <div className="text-xs font-bold text-blue-400">ستون ۱: عدم تصدی (Zero-Custody)</div>
                    <input
                      type="text"
                      value={cmsData.about.pillar1Title}
                      onChange={(e) => updateAboutField('pillar1Title', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-bold"
                    />
                    <textarea
                      rows={2}
                      value={cmsData.about.pillar1Desc}
                      onChange={(e) => updateAboutField('pillar1Desc', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs leading-relaxed"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                    <div className="text-xs font-bold text-purple-400">ستون ۲: سیستم اسپیل‌اور (Spillover Matrix)</div>
                    <input
                      type="text"
                      value={cmsData.about.pillar2Title}
                      onChange={(e) => updateAboutField('pillar2Title', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-bold"
                    />
                    <textarea
                      rows={2}
                      value={cmsData.about.pillar2Desc}
                      onChange={(e) => updateAboutField('pillar2Desc', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs leading-relaxed"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                    <div className="text-xs font-bold text-emerald-400">ستون ۳: سرعت و تأخیر پایین (Low-Latency)</div>
                    <input
                      type="text"
                      value={cmsData.about.pillar3Title}
                      onChange={(e) => updateAboutField('pillar3Title', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-bold"
                    />
                    <textarea
                      rows={2}
                      value={cmsData.about.pillar3Desc}
                      onChange={(e) => updateAboutField('pillar3Desc', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs leading-relaxed"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: FAQ PAGE CONTENT */}
          {/* ========================================================= */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-cyan-400" />
                      <span>مدیریت کامل پرسش و پاسخ‌های متداول (FAQ Management)</span>
                    </h3>
                    <p className="text-xs text-slate-400">افزودن، ویرایش، حذف و دسته‌بندی سوالات متداول در صفحه اختصاصی FAQ</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={addFaqItem}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-xs border border-emerald-500/30 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>افزودن پرسش جدید</span>
                    </button>

                    <button
                      onClick={() => handleSaveSection('faq', 'پرسش‌های متداول')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/20"
                    >
                      {savedSection === 'faq' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
                      <span>ذخیره تغییرات FAQ</span>
                    </button>
                  </div>
                </div>

                {/* Page Title & Subtitle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-white/5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">عنوان صفحه FAQ</label>
                    <input
                      type="text"
                      value={cmsData.faq.title}
                      onChange={(e) => updateFaqField('title', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">زیرعنوان توضیحی صفحه</label>
                    <input
                      type="text"
                      value={cmsData.faq.subtitle}
                      onChange={(e) => updateFaqField('subtitle', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                    />
                  </div>
                </div>

                {/* FAQ List Items */}
                <div className="space-y-4">
                  {cmsData.faq.items.map((item, index) => (
                    <div key={item.id || index} className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3 relative group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 font-bold font-mono text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-300">پرسش شماره {index + 1}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={item.category}
                            onChange={(e) => updateFaqItem(index, 'category', e.target.value)}
                            className="px-2 py-1 rounded-lg bg-slate-900 border border-white/10 text-slate-300 text-[11px] focus:outline-none"
                          >
                            <option value="registration">ثبت‌نام و احراز هویت</option>
                            <option value="security">امنیت دارایی و API</option>
                            <option value="verification">انطباق و وریفای</option>
                            <option value="marketing">بازاریابی و اسپیل‌اور</option>
                            <option value="levels">سطوح ۲۰ لایه</option>
                            <option value="earnings">تسویه پاداش‌ها</option>
                            <option value="general">عمومی</option>
                          </select>

                          <button
                            onClick={() => removeFaqItem(index)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/20 transition"
                            title="حذف این پرسش"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">متن صورت سوال</label>
                        <input
                          type="text"
                          value={item.question}
                          onChange={(e) => updateFaqItem(index, 'question', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">متن پاسخ کامل</label>
                        <textarea
                          rows={3}
                          value={item.answer}
                          onChange={(e) => updateFaqItem(index, 'answer', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: GLOBAL ANNOUNCEMENT BANNER */}
          {/* ========================================================= */}
          {activeTab === 'announcement' && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-amber-400" />
                      <span>تنظیمات بنر سراسری اعلان بالای وب‌سایت</span>
                    </h3>
                    <p className="text-xs text-slate-400">نمایش نوار باریک فوری در بالای هدر کلیه صفحات وب‌سایت برای اطلاع‌رسانی اخبار و رخدادها</p>
                  </div>

                  <button
                    onClick={() => handleSaveSection('announcement', 'بنر اعلان سراسری')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/20"
                  >
                    {savedSection === 'announcement' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
                    <span>ذخیره بنر اعلان</span>
                  </button>
                </div>

                <div className="space-y-5">
                  
                  {/* Toggle Switch */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">وضعیت نمایش بنر اعلان در سایت</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">در صورت غیرفعال بودن، نوار بالای هدر پنهان خواهد شد.</div>
                    </div>

                    <button
                      onClick={() => updateAnnouncementField('enabled', !cmsData.announcement.enabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        cmsData.announcement.enabled ? 'bg-blue-600' : 'bg-slate-800'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          cmsData.announcement.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">نشان برچسب اعلان (Badge)</label>
                    <input
                      type="text"
                      value={cmsData.announcement.badge}
                      onChange={(e) => updateAnnouncementField('badge', e.target.value)}
                      placeholder="مثال: خبر مهم، آپدیت اوراکل"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">متن پیام اعلان سراسری</label>
                    <input
                      type="text"
                      value={cmsData.announcement.text}
                      onChange={(e) => updateAnnouncementField('text', e.target.value)}
                      placeholder="پیام یا خبر مورد نظر برای نمایش به کاربران..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">متن لینک اقدام</label>
                      <input
                        type="text"
                        value={cmsData.announcement.linkText}
                        onChange={(e) => updateAnnouncementField('linkText', e.target.value)}
                        placeholder="مثال: مشاهده جزئیات، مطالعه بیشتر"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">صفحه مقصد لینک</label>
                      <select
                        value={cmsData.announcement.linkTarget}
                        onChange={(e) => updateAnnouncementField('linkTarget', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                      >
                        <option value="about">صفحه درباره ما (About)</option>
                        <option value="levels">صفحه سطوح درآمدی ۲۰ گانه (Levels)</option>
                        <option value="ranks">صفحه رتبه‌ها و پاداش‌ها (Ranks)</option>
                        <option value="faq">صفحه سوالات متداول (FAQ)</option>
                        <option value="home">صفحه اصلی (Home)</option>
                      </select>
                    </div>
                  </div>

                  {/* Live Visual Preview of Banner */}
                  <div className="pt-2">
                    <div className="text-xs font-bold text-slate-400 mb-2">پیش‌نمایش بصری بنر اعلان:</div>
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-cyan-950/80 border border-blue-500/30 flex items-center justify-between gap-3 text-xs shadow-lg">
                      <div className="flex items-center gap-2 text-slate-200">
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                          {cmsData.announcement.badge || 'اعلان'}
                        </span>
                        <span className="line-clamp-1">{cmsData.announcement.text}</span>
                      </div>
                      <span className="text-[11px] text-cyan-400 font-bold underline shrink-0 cursor-pointer">
                        {cmsData.announcement.linkText} ←
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>

        {/* Live Preview Side Column (Rendered only when in Split View) */}
        {viewMode === 'split' && (
          <div className="lg:col-span-5 space-y-4 sticky top-20">
            <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>پیش‌نمایش همزمان با تایپ (Real-Time Preview)</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 px-2.5 py-0.5 rounded-full bg-slate-950 border border-white/10">
                {activeTab.toUpperCase()}
              </span>
            </div>

            <div className="bg-[#05070a] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-6 max-h-[700px] overflow-y-auto">
              
              {/* Home Preview */}
              {activeTab === 'home' && (
                <div className="space-y-6 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-mono">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>{cmsData.home.heroBadge}</span>
                  </div>

                  <h2 className="text-xl font-black text-white leading-tight">
                    {cmsData.home.heroTitle}
                  </h2>

                  <p className="text-xs text-slate-300 leading-relaxed text-right">
                    {cmsData.home.heroSubtitle}
                  </p>

                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-600/30">
                      {cmsData.home.ctaPrimary}
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 font-bold text-xs">
                      {cmsData.home.ctaSecondary}
                    </button>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 text-right pt-4 border-t border-white/10">
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                      <div className="text-sm font-bold text-cyan-400 font-mono">{cmsData.home.stat1Val}</div>
                      <div className="text-[10px] text-slate-400">{cmsData.home.stat1Label}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                      <div className="text-sm font-bold text-blue-400 font-mono">{cmsData.home.stat2Val}</div>
                      <div className="text-[10px] text-slate-400">{cmsData.home.stat2Label}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                      <div className="text-sm font-bold text-amber-400 font-mono">{cmsData.home.stat3Val}</div>
                      <div className="text-[10px] text-slate-400">{cmsData.home.stat3Label}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                      <div className="text-sm font-bold text-emerald-400 font-mono">{cmsData.home.stat4Val}</div>
                      <div className="text-[10px] text-slate-400">{cmsData.home.stat4Label}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* About Preview */}
              {activeTab === 'about' && (
                <div className="space-y-4 text-right">
                  <div className="text-xs font-bold text-blue-400">{cmsData.about.tagline}</div>
                  <h2 className="text-lg font-black text-white">{cmsData.about.title}</h2>
                  <p className="text-xs text-slate-300 leading-relaxed">{cmsData.about.subtitle}</p>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10 space-y-1.5 mt-4">
                    <div className="text-xs font-bold text-cyan-300">{cmsData.about.missionTitle}</div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{cmsData.about.missionText}</p>
                    <div className="text-[10px] text-slate-500 font-mono pt-1">{cmsData.about.missionStat}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10 space-y-1.5">
                    <div className="text-xs font-bold text-purple-300">{cmsData.about.visionTitle}</div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{cmsData.about.visionText}</p>
                    <div className="text-[10px] text-slate-500 font-mono pt-1">{cmsData.about.visionStat}</div>
                  </div>
                </div>
              )}

              {/* FAQ Preview */}
              {activeTab === 'faq' && (
                <div className="space-y-3 text-right">
                  <h3 className="text-sm font-bold text-white">{cmsData.faq.title}</h3>
                  <p className="text-[11px] text-slate-400">{cmsData.faq.subtitle}</p>
                  <div className="space-y-2 pt-2">
                    {cmsData.faq.items.slice(0, 4).map((item, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-white/10 space-y-1">
                        <div className="text-xs font-bold text-white">{item.question}</div>
                        <p className="text-[11px] text-slate-400">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Announcement Preview */}
              {activeTab === 'announcement' && (
                <div className="space-y-3 text-right">
                  <div className="text-xs font-bold text-white">نحوه نمایش در بالای هدر وب‌سایت:</div>
                  <div className="p-3 rounded-xl bg-blue-900/40 border border-blue-500/30 text-xs text-blue-200">
                    <div className="font-bold text-blue-300 mb-1">[{cmsData.announcement.badge}]</div>
                    <div>{cmsData.announcement.text}</div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

    </div>
  );
};

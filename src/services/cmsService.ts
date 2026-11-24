import { useState, useEffect } from 'react';

export interface HomeCmsContent {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  stat1Val: string;
  stat1Label: string;
  stat2Val: string;
  stat2Label: string;
  stat3Val: string;
  stat3Label: string;
  stat4Val: string;
  stat4Label: string;
  feat1Title: string;
  feat1Desc: string;
  feat2Title: string;
  feat2Desc: string;
  feat3Title: string;
  feat3Desc: string;
  faqs: Array<{ id: string; q: string; a: string }>;
}

export interface AboutCmsContent {
  tagline: string;
  title: string;
  subtitle: string;
  missionTitle: string;
  missionText: string;
  missionStat: string;
  visionTitle: string;
  visionText: string;
  visionStat: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
}

export interface FaqItemCms {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface FaqCmsContent {
  title: string;
  subtitle: string;
  items: FaqItemCms[];
}

export interface AnnouncementCmsContent {
  enabled: boolean;
  badge: string;
  text: string;
  linkText: string;
  linkTarget: string;
}

export interface WebsiteCmsData {
  home: HomeCmsContent;
  about: AboutCmsContent;
  faq: FaqCmsContent;
  announcement: AnnouncementCmsContent;
  lastUpdated: string;
}

export const DEFAULT_CMS_DATA: WebsiteCmsData = {
  home: {
    heroBadge: '✨ نسل جدید کپی تریدینگ و درآمدزایی ۲۰ لایه‌ای',
    heroTitle: 'آینده درآمد خودکار با کپی تریدینگ هوشمند',
    heroSubtitle: 'به بهترین تریدرهای جهان متصل شوید، از سود روزانه معاملات بهره‌مند شوید و با شبکه ۲۰ لایه‌ای، درآمد پسیو خود را چند برابر کنید.',
    ctaPrimary: 'ثبت‌نام و شروع کسب درآمد',
    ctaSecondary: 'مشاهده طرح درآمدی ۲۰ لول',
    stat1Val: '۱۲.۴M$',
    stat1Label: 'حجم ماهانه معاملات',
    stat2Val: '۱۸.۵K+',
    stat2Label: 'کاربران فعال پلتفرم',
    stat3Val: '۱.۸M$',
    stat3Label: 'پاداش‌های توزیع شده',
    stat4Val: '۹۹.۹%',
    stat4Label: 'آپ‌تایم و پایداری شبکه',
    feat1Title: 'امنیت ۱۰۰٪ Non-Custodial',
    feat1Desc: 'سرمایه در صرافی خودتان باقی می‌ماند و اتصال صرفاً از طریق کلیدهای API با مجوز مشاهده و معامله (بدون حق برداشت) برقرار می‌شود.',
    feat2Title: 'محاسبه آنی بر پایه Realized Profit',
    feat2Desc: 'پورسانت‌ها منحصراً از معاملات سودده محاسبه شده و به صورت لحظه‌ای به کیف‌پول کاربری تسویه می‌گردند.',
    feat3Title: 'شبکه ۲۰ سطحی ماتریس هوشمند',
    feat3Desc: 'کسب پاداش پایدار از ۲۰ لایه عمقی با شفافیت کامل، تفکیک حامی از جایگاه و بدون امکان بدهی یا ایجاد ریسک مالی برای پلتفرم.',
    faqs: [
      {
        id: 'home_faq_1',
        q: 'آیا پلتفرم به پول من دسترسی دارد؟',
        a: 'خیر. تیجکس یک پلتفرم کاملاً Non-Custodial است. کلیدهای API فقط با مجوز خواندن و ترید کار می‌کنند و هیچ‌گاه امکان برداشت وجه از حساب شما وجود ندارد.'
      },
      {
        id: 'home_faq_2',
        q: 'حداقل سرمایه برای شروع چقدر است؟',
        a: 'حداقل سرمایه پیشنهادی ۱۰۰ دلار در صرافی است، اما برای مدیریت ریسک بهینه و تقسیم‌بندی استاندارد پوزیشن‌ها، ۵۰۰ دلار توصیه می‌شود.'
      },
      {
        id: 'home_faq_3',
        q: 'پاداش‌ها چه زمانی پرداخت می‌شوند؟',
        a: 'کمیسیون‌ها به صورت لحظه‌ای پس از بسته‌شدن هر معامله سودده محاسبه شده و بلافاصله به موجودی کیف پول کاربری شما افزوده می‌شود.'
      },
      {
        id: 'home_faq_4',
        q: 'آیا نیاز به تجربه ترید دارم؟',
        a: 'خیر! سیستم کپی تریدینگ ما به صورت کاملاً خودکار معاملات مستر تریدرهای بین‌المللی را در حساب صرافی شما منعکس و اجرا می‌کند.'
      },
      {
        id: 'home_faq_5',
        q: 'چگونه می‌توانم زیرمجموعه دعوت کنم؟',
        a: 'پس از ثبت‌نام، لینک رفرال اختصاصی خود را از بخش داشبورد دریافت کرده و با دوستان یا در شبکه‌های اجتماعی به اشتراک بگذارید.'
      }
    ]
  },
  about: {
    tagline: 'درباره اکوسیستم تیجکس',
    title: 'تحول در تجارت اجتماعی و فین‌تک',
    subtitle: 'تیجکس با ترکیب هوش مصنوعی، کپی تریدینگ و معماری شبکه‌ای ۲۰ لایه‌ای، پلی امن میان تریدرهای حرفه‌ای و سرمایه‌گذاران جهانی ساخته است.',
    missionTitle: 'ماموریت ما در بازارهای مالی',
    missionText: 'دموکراتیزه کردن سود بازارهای مالی. ما اینجا هستیم تا از طریق کپی تریدینگ هوشمند و توزیع عادلانه کارمزدها، قدرت واقعی را به بازاریابان و کاربران خرد بازگردانیم.',
    missionStat: '۴۷,۵۰۰+ کاربر توانمند شده',
    visionTitle: 'چشم‌انداز جهانی تیجکس',
    visionText: 'تبدیل شدن به معتبرترین و بزرگترین پلتفرم بدون تصدی دارایی (Non-Custodial) در خاورمیانه و جهان، با تعریف استانداردهای نوین شفافیت و امنیت.',
    visionStat: '۱۵۰+ کشور تحت پوشش',
    pillar1Title: 'تضمین عدم تصدی (Zero-Custody)',
    pillar1Desc: 'عدم دسترسی پلتفرم به موجودی کاربر. کلیدهای خصوصی و دارایی‌ها همیشه در صرافی شخصی شما امن هستند.',
    pillar2Title: 'سیستم اسپیل‌اور (Spillover Matrix)',
    pillar2Desc: 'تفکیک هوشمند معرف از جایگاه سازمانی. سیستم پیشرفته ما تضمین می‌کند هیچ عضوی در شبکه بدون پاداش نمی‌ماند.',
    pillar3Title: 'اجرای فوق سریع (Low-Latency)',
    pillar3Desc: 'سرورهای توزیع‌شده جهانی با قابلیت اجرای همزمان هزاران سفارش بدون Slippage و با تأخیر زیر میلی‌ثانیه.'
  },
  faq: {
    title: 'سوالات متداول (FAQ)',
    subtitle: 'پاسخ به سوالات پرتکرار پیرامون نحوه کارکرد پلتفرم تیجکس، امنیت دارایی‌ها، سطوح و نحوه تسویه حساب',
    items: [
      {
        id: 'faq_1',
        category: 'registration',
        question: 'تیجکس (Tgex) چیست و چگونه کار می‌کند؟',
        answer: 'تیجکس یک پلتفرم فناوری فین‌تک است که دو قابلیت کلیدی را پیوند می‌دهد: کپی تریدینگ همگام‌سازی شده با صرافی‌های بین‌المللی و ساختار بازاریابی شبکه‌ای ۲۰ سطحی با محاسبات کاملاً سرورساید و شفاف.'
      },
      {
        id: 'faq_2',
        category: 'security',
        question: 'آیا سرمایه من نزد تیجکس نگهداری می‌شود؟',
        answer: 'خیر. تیجکس فاقد دسترسی به دارایی‌های شماست. سرمایه شما در حساب صرافی شخصی خودتان باقی می‌ماند و اتصال از طریق کلیدهای API صرفاً با دسترسی مشاهده و اجرای معامله (Read & Trade) بدون حق برداشت انجام می‌شود.'
      },
      {
        id: 'faq_3',
        category: 'verification',
        question: 'تفاوت احراز هویت (KYC) با ثبت‌نام و ورود چیست؟',
        answer: 'ثبت‌نام و ورود صرفاً هویت ورود شما را تایید می‌کنند، در حالی که احراز هویت (KYC) یک فرآیند انطباقی قانونی برای تایید مدارک هویتی مطابق استانداردهای ضد پولشویی (AML) جهت فعال‌سازی برداشت پاداش‌های بازاریابی است.'
      },
      {
        id: 'faq_4',
        category: 'marketing',
        question: 'تفاوت کد حامی (Sponsor) با کد جایگاه (Placement) چیست؟',
        answer: 'حامی شخصی است که شما را مستقیماً به تیجکس دعوت کرده و پاداش معرف مستقیم به ایشان تعلق می‌گیرد. اما جایگاه موقعیت فیزیکی شما در ماتریس ۲۰ سطحی است که بر اساس ظرفیت شاخه‌ها و ریزش (Spillover) مشخص می‌شود.'
      },
      {
        id: 'faq_5',
        category: 'levels',
        question: 'چگونه می‌توانم به سطوح بالاتر (A تا T) ارتقا پیدا کنم؟',
        answer: 'ارتقای سطح به صورت خودکار و بر اساس تعداد معرف‌های مستقیم فعال شما و حجم معاملاتی تحت پوشش در شبکه محاسبه می‌گردد و نیازی به خرید اشتراک‌های اجباری ندارد.'
      },
      {
        id: 'faq_6',
        category: 'earnings',
        question: 'پاداش‌های بازاریابی چگونه تسویه می‌شوند؟',
        answer: 'پاداش‌های شبکه بر اساس کارمزدهای واقعی تولید شده از کپی تریدینگ محاسبه شده و مستقیماً به موجودی کیف پول کاربری شما در داشبورد واریز می‌گردد.'
      }
    ]
  },
  announcement: {
    enabled: true,
    badge: 'اعلان رسمی',
    text: '🚀 اتصال نسخه ۲.۴ موتور اوراکل کپی تریدینگ با تسویه آنی پورسانت‌های ماتریس ۲۰ سطحی فعال گردید.',
    linkText: 'مشاهده جزئیات فنی',
    linkTarget: 'about'
  },
  lastUpdated: '2026-09-02 20:00'
};

const CMS_STORAGE_KEY = 'tgex_public_website_cms_data_v2';
const CMS_UPDATE_EVENT = 'tgex_cms_content_updated';

class CmsService {
  private data: WebsiteCmsData;

  constructor() {
    this.data = this.loadFromStorage();
  }

  private loadFromStorage(): WebsiteCmsData {
    try {
      const stored = localStorage.getItem(CMS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_CMS_DATA,
          ...parsed,
          home: { ...DEFAULT_CMS_DATA.home, ...(parsed.home || {}) },
          about: { ...DEFAULT_CMS_DATA.about, ...(parsed.about || {}) },
          faq: { ...DEFAULT_CMS_DATA.faq, ...(parsed.faq || {}) },
          announcement: { ...DEFAULT_CMS_DATA.announcement, ...(parsed.announcement || {}) }
        };
      }
    } catch {
      // fallback
    }
    return DEFAULT_CMS_DATA;
  }

  public getData(): WebsiteCmsData {
    return this.data;
  }

  public getHome(): HomeCmsContent {
    return this.data.home;
  }

  public getAbout(): AboutCmsContent {
    return this.data.about;
  }

  public getFaq(): FaqCmsContent {
    return this.data.faq;
  }

  public getAnnouncement(): AnnouncementCmsContent {
    return this.data.announcement;
  }

  public updateHome(homeData: Partial<HomeCmsContent>): WebsiteCmsData {
    this.data = {
      ...this.data,
      home: { ...this.data.home, ...homeData },
      lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    this.saveAndNotify();
    return this.data;
  }

  public updateAbout(aboutData: Partial<AboutCmsContent>): WebsiteCmsData {
    this.data = {
      ...this.data,
      about: { ...this.data.about, ...aboutData },
      lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    this.saveAndNotify();
    return this.data;
  }

  public updateFaq(faqData: Partial<FaqCmsContent>): WebsiteCmsData {
    this.data = {
      ...this.data,
      faq: { ...this.data.faq, ...faqData },
      lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    this.saveAndNotify();
    return this.data;
  }

  public updateAnnouncement(announcementData: Partial<AnnouncementCmsContent>): WebsiteCmsData {
    this.data = {
      ...this.data,
      announcement: { ...this.data.announcement, ...announcementData },
      lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    this.saveAndNotify();
    return this.data;
  }

  public updateAll(newData: Partial<WebsiteCmsData>): WebsiteCmsData {
    this.data = {
      ...this.data,
      ...newData,
      lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    this.saveAndNotify();
    return this.data;
  }

  public resetToDefaults(): WebsiteCmsData {
    this.data = {
      ...DEFAULT_CMS_DATA,
      lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    this.saveAndNotify();
    return this.data;
  }

  private saveAndNotify() {
    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(this.data));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(CMS_UPDATE_EVENT, { detail: this.data }));
      }
    } catch (e) {
      console.error('Failed to save CMS data', e);
    }
  }

  public subscribe(callback: (data: WebsiteCmsData) => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<WebsiteCmsData>;
      callback(customEvent.detail || this.data);
    };
    window.addEventListener(CMS_UPDATE_EVENT, handler);
    return () => window.removeEventListener(CMS_UPDATE_EVENT, handler);
  }
}

export const cmsService = new CmsService();

export function useCmsContent(): WebsiteCmsData {
  const [data, setData] = useState<WebsiteCmsData>(() => cmsService.getData());

  useEffect(() => {
    const unsubscribe = cmsService.subscribe((updated) => {
      setData({ ...updated });
    });
    return () => unsubscribe();
  }, []);

  return data;
}

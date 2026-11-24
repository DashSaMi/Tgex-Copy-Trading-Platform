import { BlogPost } from '../types';
import blogCoverMatrix from '../assets/images/blog_cover_matrix.jpg';
import blogCoverRisk from '../assets/images/blog_cover_risk.jpg';
import blogCoverSecurity from '../assets/images/blog_cover_security.jpg';
import blogChartInline from '../assets/images/blog_chart_inline.jpg';
import authorAria from '../assets/images/author_aria.jpg';
import authorSara from '../assets/images/author_sara.jpg';
import authorBehzad from '../assets/images/author_behzad.jpg';

const BLOG_STORAGE_KEY = 'tgex_blog_posts_v1';

const REMOTE_TO_LOCAL_IMAGE_MAP: Array<[string, string]> = [
  ['photo-1642790106117-e829e14a795f', blogCoverMatrix],
  ['photo-1590283603385-17ffb3a7f29f', blogCoverRisk],
  ['photo-1563986768609-322da13575f3', blogCoverSecurity],
  ['photo-1611974789855-9c2a0a7236a3', blogChartInline],
  ['photo-1534528741775-53994a69daeb', authorAria],
  ['photo-1573496359142-b8d87734a5a2', authorSara],
  ['photo-1507003211169-0a1dd7228f2d', authorBehzad]
];

function localizeBlogUrl(url?: string, fallback: string = blogCoverMatrix): string {
  if (!url) return fallback;
  for (const [token, localAsset] of REMOTE_TO_LOCAL_IMAGE_MAP) {
    if (url.includes(token)) return localAsset;
  }
  return url;
}

function localizeHtmlImages(html?: string): string | undefined {
  if (!html) return html;
  let updated = html;
  updated = updated.replace(/https:\/\/images\.unsplash\.com\/photo-1611974789855-9c2a0a7236a3[^"']*/g, blogChartInline);
  updated = updated.replace(/https:\/\/images\.unsplash\.com\/photo-1642790106117-e829e14a795f[^"']*/g, blogCoverMatrix);
  updated = updated.replace(/https:\/\/images\.unsplash\.com\/photo-1590283603385-17ffb3a7f29f[^"']*/g, blogCoverRisk);
  updated = updated.replace(/https:\/\/images\.unsplash\.com\/photo-1563986768609-322da13575f3[^"']*/g, blogCoverSecurity);
  return updated;
}

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'complete-guide-to-20-level-matrix-rewards',
    title: 'راهنمای جامع مدل پاداش‌دهی ماتریس ۲۰ سطحی و همگام‌سازی کپی تریدینگ',
    titleEn: 'Comprehensive Guide to the 20-Level Matrix Reward Model & Copy-Trading Synchronization',
    subtitle: 'بررسی ساختار توزیع ۱۴٪ پورسانت شبکه و ۳٪ استخر رهبری بر مبنای سود واقعی (Realized Profit)',
    subtitleEn: 'In-depth analysis of 14% network commission distribution and 3% leadership pool based on Realized Profit',
    summary: 'در این مقاله تخصصی، نحوه کارکرد موتور توزیع پورسانت ماتریس هیبرید تیجکس، سطوح A تا T و فرمول محاسبه سهم از سود واقعی معاملات تشریح شده است.',
    summaryEn: 'In this technical guide, learn how the TGEX hybrid matrix commission engine works, exploring levels A through T and the mathematical formula for calculating shares from Realized Profit.',
    coverImage: blogCoverMatrix,
    category: 'طرح درآمدی و ماتریس',
    categoryEn: 'Reward Model & Matrix',
    tags: ['ماتریس ۲۰ سطحی', 'کپی تریدینگ', 'پاداش بازاریابی', 'Realized Profit'],
    tagsEn: ['20-Level Matrix', 'Copy Trading', 'Network Rewards', 'Realized Profit'],
    author: {
      name: 'مهندس آریا شایان',
      role: 'معمار ارشد سیستم‌های مالی تیجکس',
      avatar: authorAria,
      bio: 'تحلیل‌گر فناوری‌های فین‌تک و توسعه‌دهنده زیرساخت‌های محاسباتی صرافی.'
    },
    publishedAt: '2026-08-25',
    updatedAt: '2026-08-26',
    readTimeMinutes: 7,
    status: 'published',
    viewsCount: 3420,
    likesCount: 284,
    isFeatured: true,
    showOnMain: true,
    seo: {
      metaTitle: 'راهنمای جامع ماتریس ۲۰ سطحی تیجکس | پاداش کپی تریدینگ و درآمد دلاری',
      metaDescription: 'کامل‌ترین آموزش نحوه کسب درآمد از ماتریس ۲۰ لول تیجکس، شرایط احراز رتبه‌ها و دریافت پورسانت واقعی از کپی تریدینگ.',
      focusKeyword: 'ماتریس ۲۰ سطحی کپی تریدینگ'
    },
    contentHtml: `
      <p class="lead-text" style="font-size: 18px; line-height: 1.8; color: #cbd5e1; font-weight: 500;">
        ساختار بازاریابی شبکه‌ای هیبرید تیجکس با تلفیق مدل ماتریس اسپیل‌اور و کپی تریدینگ همگام، استانداردی نوین در توزیع عادلانه ارزش مالی میان سرمایه‌گذاران و راهبران پلتفرم پایه‌ریزی کرده است.
      </p>

      <h2 style="font-size: 24px; font-weight: 800; color: #38bdf8; margin-top: 32px; margin-bottom: 16px;">
        ۱. اصل بنیادین پرداخت بر مبنای Realized Profit
      </h2>
      <p style="font-size: 16px; line-height: 1.8; color: #94a3b8;">
        بر خلاف مدل‌های سنتی که پورسانت‌ها را بر اساس ورود سرمایه اولیه (Deposition) یا حجم‌های کاذب می‌پردازند، پلتفرم تیجکس تنها و تنها زمانی پورسانت پرداخت می‌کند که یک معامله با <strong style="color: #10b981;">سود قطعی بسته شده باشد (Realized Profit)</strong>. این مکانیزم تضمین‌کننده پایداری ریاضی سیستم و عدم ایجاد هرگونه بدهی شناور است.
      </p>

      <div style="background: rgba(14, 165, 233, 0.08); border-right: 4px solid #0284c7; padding: 20px; border-radius: 12px; margin: 24px 0;">
        <h4 style="color: #38bdf8; font-weight: bold; margin-bottom: 8px; font-size: 16px;">نکته امنیتی و مدیریت ریسک</h4>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.7; margin: 0;">
          در دوره‌هایی که معاملات مستر تریدر بدون سود یا دارای بازده منفی باشند، هیچ کارمزد و پورسانتی از طرف سیستم آزاد نمی‌شود؛ در نتیجه ریسک پلتفرم صفر بوده و دارایی معامله‌گران به طور کامل حفظ می‌گردد.
        </p>
      </div>

      <h2 style="font-size: 24px; font-weight: 800; color: #38bdf8; margin-top: 32px; margin-bottom: 16px;">
        ۲. جدول تخصیص درصدهای ماتریس ۲۰ سطحی (ماده ۸ آیین‌نامه)
      </h2>
      <p style="font-size: 16px; line-height: 1.8; color: #94a3b8;">
        در مجموع ۱۴.۰۰٪ از سود واقعی به ۲۰ لایه زیرمجموعه تعلق می‌گیرد که جزئیات ۵ سطح اول به شرح جدول زیر است:
      </p>

      <div style="overflow-x: auto; margin: 24px 0;">
        <table style="width: 100%; border-collapse: collapse; text-align: right; font-size: 14px; background: #0b1120; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
          <thead>
            <tr style="background: #1e293b; color: #f8fafc;">
              <th style="padding: 14px; border-bottom: 1px solid rgba(255,255,255,0.1);">سطح ماتریس</th>
              <th style="padding: 14px; border-bottom: 1px solid rgba(255,255,255,0.1);">نماد لول</th>
              <th style="padding: 14px; border-bottom: 1px solid rgba(255,255,255,0.1);">درصد پورسانت از سود</th>
              <th style="padding: 14px; border-bottom: 1px solid rgba(255,255,255,0.1);">حداقل رتبه مورد نیاز</th>
            </tr>
          </thead>
          <tbody style="color: #cbd5e1;">
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 12px 14px; font-weight: bold;">سطح ۱</td>
              <td style="padding: 12px 14px; color: #38bdf8;">Level A</td>
              <td style="padding: 12px 14px; color: #10b981; font-weight: bold;">۳.۰۰٪</td>
              <td style="padding: 12px 14px;">استارتر (Starter)</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02);">
              <td style="padding: 12px 14px; font-weight: bold;">سطح ۲</td>
              <td style="padding: 12px 14px; color: #38bdf8;">Level B</td>
              <td style="padding: 12px 14px; color: #10b981; font-weight: bold;">۲.۰۰٪</td>
              <td style="padding: 12px 14px;">استارتر (Starter)</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 12px 14px; font-weight: bold;">سطح ۳</td>
              <td style="padding: 12px 14px; color: #38bdf8;">Level C</td>
              <td style="padding: 12px 14px; color: #10b981; font-weight: bold;">۱.۶۰٪</td>
              <td style="padding: 12px 14px;">استارتر (Starter)</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02);">
              <td style="padding: 12px 14px; font-weight: bold;">سطح ۴</td>
              <td style="padding: 12px 14px; color: #38bdf8;">Level D</td>
              <td style="padding: 12px 14px; color: #10b981; font-weight: bold;">۱.۲۰٪</td>
              <td style="padding: 12px 14px;">استیجر (Stager)</td>
            </tr>
            <tr>
              <td style="padding: 12px 14px; font-weight: bold;">سطح ۵</td>
              <td style="padding: 12px 14px; color: #38bdf8;">Level E</td>
              <td style="padding: 12px 14px; color: #10b981; font-weight: bold;">۰.۹۰٪</td>
              <td style="padding: 12px 14px;">استیجر (Stager)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 style="font-size: 24px; font-weight: 800; color: #38bdf8; margin-top: 32px; margin-bottom: 16px;">
        ۳. نحوه بهره‌مندی از استخر رهبری ۳٪ (Leadership Pool)
      </h2>
      <p style="font-size: 16px; line-height: 1.8; color: #94a3b8;">
        اعضایی که به رتبه <strong>مدیر (Manager)</strong> و بالاتر ارتقا پیدا می‌کنند، علاوه بر ۲۰ سطح ماتریس، وارد استخر اختصاصی ۳٪ سود کل اکوسیستم می‌شوند که بر اساس سیستم امتیازی (۱۰ تا ۴۰ امتیاز) میان رهبران تقسیم می‌گردد.
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <img src="${blogChartInline}" alt="تحلیل عملکرد کپی تریدینگ و درآمد ماتریس" style="width: 85%; border-radius: 16px; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);" />
        <p style="font-size: 13px; color: #64748b; margin-top: 10px;">نمودار رشد درآمدی شبکه و شبیه‌سازی سود محقق‌شده</p>
      </div>

      <h2 style="font-size: 24px; font-weight: 800; color: #38bdf8; margin-top: 32px; margin-bottom: 16px;">
        نتیجه‌گیری و گام‌های پیشنهادی
      </h2>
      <p style="font-size: 16px; line-height: 1.8; color: #94a3b8;">
        برای بهینه‌سازی درآمد خود، پیشنهاد می‌شود ابتدا با ثبت حداقل ۲ معرف مستقیم، رتبه استیجر را فعال کنید تا عمق لایه‌های ۴ و ۵ ماتریس برای شما باز شود. سپس با ایجاد تعادل در خطوط و رشد حجم AUM تیم، مسیر ارتقا به رتبه‌های مدیریتی را هموار نمایید.
      </p>
    `,
    contentHtmlEn: `
      <p class="lead-text" style="font-size: 18px; line-height: 1.8; color: #cbd5e1; font-weight: 500;">
        The TGEX hybrid network architecture combines spillover matrix distribution with synchronized copy trading, establishing a new benchmark in equitable financial value sharing between investors and network leaders.
      </p>

      <h2 style="font-size: 24px; font-weight: 800; color: #38bdf8; margin-top: 32px; margin-bottom: 16px;">
        1. The Core Principle: Settlements Based on Realized Profit
      </h2>
      <p style="font-size: 16px; line-height: 1.8; color: #94a3b8;">
        Unlike traditional schemes that pay commissions on deposits or inflated artificial volume, TGEX pays rewards strictly when a trade concludes with <strong style="color: #10b981;">Realized Profit</strong>. This mathematical safeguard ensures continuous long-term platform stability with zero floating liabilities.
      </p>

      <div style="background: rgba(14, 165, 233, 0.08); border-left: 4px solid #0284c7; padding: 20px; border-radius: 12px; margin: 24px 0;">
        <h4 style="color: #38bdf8; font-weight: bold; margin-bottom: 8px; font-size: 16px;">Security Note & Risk Management</h4>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.7; margin: 0;">
          During periods where Master Trader trades yield no profit or experience drawdown, zero commission fees are deducted or released by the system, ensuring complete protection of trader capital.
        </p>
      </div>

      <h2 style="font-size: 24px; font-weight: 800; color: #38bdf8; margin-top: 32px; margin-bottom: 16px;">
        2. The 20-Level Commission Allocation Structure
      </h2>
      <p style="font-size: 16px; line-height: 1.8; color: #94a3b8;">
        A total of 14.00% of realized profit is distributed across 20 downline levels. The structure for the first 5 levels is shown below:
      </p>

      <div style="overflow-x: auto; margin: 24px 0;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; background: #0b1120; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
          <thead>
            <tr style="background: #1e293b; color: #f8fafc;">
              <th style="padding: 14px; border-bottom: 1px solid rgba(255,255,255,0.1);">Matrix Level</th>
              <th style="padding: 14px; border-bottom: 1px solid rgba(255,255,255,0.1);">Code</th>
              <th style="padding: 14px; border-bottom: 1px solid rgba(255,255,255,0.1);">Profit Commission %</th>
              <th style="padding: 14px; border-bottom: 1px solid rgba(255,255,255,0.1);">Minimum Rank</th>
            </tr>
          </thead>
          <tbody style="color: #cbd5e1;">
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 12px 14px; font-weight: bold;">Level 1</td>
              <td style="padding: 12px 14px; color: #38bdf8;">Level A</td>
              <td style="padding: 12px 14px; color: #10b981; font-weight: bold;">3.00%</td>
              <td style="padding: 12px 14px;">Starter</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02);">
              <td style="padding: 12px 14px; font-weight: bold;">Level 2</td>
              <td style="padding: 12px 14px; color: #38bdf8;">Level B</td>
              <td style="padding: 12px 14px; color: #10b981; font-weight: bold;">2.00%</td>
              <td style="padding: 12px 14px;">Starter</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 12px 14px; font-weight: bold;">Level 3</td>
              <td style="padding: 12px 14px; color: #38bdf8;">Level C</td>
              <td style="padding: 12px 14px; color: #10b981; font-weight: bold;">1.60%</td>
              <td style="padding: 12px 14px;">Starter</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02);">
              <td style="padding: 12px 14px; font-weight: bold;">Level 4</td>
              <td style="padding: 12px 14px; color: #38bdf8;">Level D</td>
              <td style="padding: 12px 14px; color: #10b981; font-weight: bold;">1.20%</td>
              <td style="padding: 12px 14px;">Stager</td>
            </tr>
            <tr>
              <td style="padding: 12px 14px; font-weight: bold;">Level 5</td>
              <td style="padding: 12px 14px; color: #38bdf8;">Level E</td>
              <td style="padding: 12px 14px; color: #10b981; font-weight: bold;">0.90%</td>
              <td style="padding: 12px 14px;">Stager</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 style="font-size: 24px; font-weight: 800; color: #38bdf8; margin-top: 32px; margin-bottom: 16px;">
        3. Benefiting from the 3% Global Leadership Royalty Pool
      </h2>
      <p style="font-size: 16px; line-height: 1.8; color: #94a3b8;">
        Members advancing to <strong>Manager</strong> rank and above unlock access to the exclusive 3% Global Leadership Pool in addition to the 20-level matrix, distributed via a merit points system (10 to 40 points).
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <img src="${blogChartInline}" alt="Copy trading performance analysis and matrix revenue" style="width: 85%; border-radius: 16px; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);" />
        <p style="font-size: 13px; color: #64748b; margin-top: 10px;">Network revenue growth trajectory & simulated realized profit</p>
      </div>

      <h2 style="font-size: 24px; font-weight: 800; color: #38bdf8; margin-top: 32px; margin-bottom: 16px;">
        Conclusion & Next Steps
      </h2>
      <p style="font-size: 16px; line-height: 1.8; color: #94a3b8;">
        To optimize your revenue potential, start by introducing at least 2 active direct referrals to achieve Stager rank and unlock depth through levels 4 and 5. Then maintain balanced downline volume and scale team AUM towards executive management tiers.
      </p>
    `
  },
  {
    id: 'post-2',
    slug: 'risk-management-in-copy-trading',
    title: 'اصول مدیریت ریسک و حفظ سرمایه در انتخاب مستر تریدرها',
    titleEn: 'Principles of Risk Management & Capital Preservation in Master Trader Selection',
    subtitle: 'چگونه دراداون (Drawdown) و وین‌ریت واقعی را ارزیابی کرده و سبد متنوع بسازیم؟',
    subtitleEn: 'How to evaluate Max Drawdown, win-rate metrics, and construct a resilient diversified portfolio',
    summary: 'معیارهای حیاتی برای انتخاب معامله‌گران برتر، بررسی نسبت شارپ، کنترل لوریج و جلوگیری از ریسک‌های ناشی از استراتژی‌های مارتینگل.',
    summaryEn: 'Crucial criteria for picking top traders, evaluating Sharpe ratios, leverage control, and preventing catastrophic risk from Martingale techniques.',
    coverImage: blogCoverRisk,
    category: 'آموزش کپی تریدینگ',
    categoryEn: 'Copy Trading Guides',
    tags: ['مدیریت ریسک', 'مستر تریدر', 'دراداون', 'تحلیل کارنامه'],
    tagsEn: ['Risk Management', 'Master Trader', 'Drawdown', 'Portfolio Audit'],
    author: {
      name: 'دکتر سارا رادمنش',
      role: 'مدیر تحلیل ریسک و انطباق سرمایه',
      avatar: authorSara,
      bio: 'متخصص مدیریت پرتفوی و استاد بازارهای مشتقه بین‌المللی.'
    },
    publishedAt: '2026-08-22',
    readTimeMinutes: 5,
    status: 'published',
    viewsCount: 2150,
    likesCount: 198,
    showOnMain: true,
    seo: {
      metaTitle: 'اصول مدیریت ریسک در کپی تریدینگ | آموزش تحلیل کارنامه تریدرها',
      metaDescription: 'راهنمای گام به گام تحلیل ریسک، انتخاب بهترین مستر تریدر و تنظیم دراداون مجاز در پلتفرم کپی تریدینگ تیجکس.',
      focusKeyword: 'مدیریت ریسک کپی تریدینگ'
    },
    contentHtml: `
      <p style="font-size: 16px; line-height: 1.8; color: #cbd5e1;">
        یکی از رایج‌ترین اشتباهات سرمایه‌گذاران مبتدی در کپی تریدینگ، تمرکز انحصاری بر روی بازدهی ماهانه (ROI) بدون توجه به حداکثر افت سرمایه (Max Drawdown) است.
      </p>

      <h3 style="font-size: 20px; font-weight: 700; color: #38bdf8; margin-top: 24px;">۱. بررسی حداکثر دراداون تاریخی (Max Drawdown)</h3>
      <p style="font-size: 15px; line-height: 1.8; color: #94a3b8;">
        دراداون نشان‌دهنده بیشترین افت موجودی یک حساب از نقطه اوج تا قعر در طول یک دوره است. تریدرهایی با دراداون بالای ۳۰٪ نیازمند احتیاط مضاعف هستند.
      </p>

      <h3 style="font-size: 20px; font-weight: 700; color: #38bdf8; margin-top: 24px;">۲. تنوع‌بخشی به سبد تریدرها (Diversification)</h3>
      <p style="font-size: 15px; line-height: 1.8; color: #94a3b8;">
        سرمایه خود را به جای تخصیص ۱۰۰٪ به یک معامله‌گر، میان ۳ تا ۵ مستر تریدر با سبک‌های متفاوت (مانند اسکالپ، سوئینگ و ترند فالویینگ) تقسیم کنید.
      </p>
    `,
    contentHtmlEn: `
      <p style="font-size: 16px; line-height: 1.8; color: #cbd5e1;">
        One of the most frequent pitfalls for copy-trading beginners is focusing exclusively on monthly ROI while ignoring historical Max Drawdown.
      </p>

      <h3 style="font-size: 20px; font-weight: 700; color: #38bdf8; margin-top: 24px;">1. Examining Historical Max Drawdown</h3>
      <p style="font-size: 15px; line-height: 1.8; color: #94a3b8;">
        Drawdown measures the maximum peak-to-trough decline in account balance over a specific period. Traders experiencing drawdowns exceeding 30% warrant extra caution.
      </p>

      <h3 style="font-size: 20px; font-weight: 700; color: #38bdf8; margin-top: 24px;">2. Multi-Trader Diversification</h3>
      <p style="font-size: 15px; line-height: 1.8; color: #94a3b8;">
        Rather than allocating 100% of your capital to a single provider, split allocations across 3 to 5 Master Traders with uncorrelated trading styles (such as scalping, swing trading, and momentum trend-following).
      </p>
    `
  },
  {
    id: 'post-3',
    slug: 'tgex-security-and-read-only-api',
    title: 'امنیت دارایی‌ها در تیجکس: چرا دسترسی Read-Only کلید اطمینان است؟',
    titleEn: 'Asset Security at TGEX: Why Non-Custodial Read-Only API Keys Protect Your Capital',
    subtitle: 'بررسی معماری اتصال به صرافی و عدم امکان برداشت وجه توسط پلتفرم',
    subtitleEn: 'Architecture review of direct exchange integration with absolute zero withdrawal permissions',
    summary: 'بررسی لایه‌های امنیتی تیجکس، رمزنگاری ۲۵۶ بیتی کلیدها و چرایی عدم امکان دسترسی مستقیم سرور به دارایی کاربران.',
    summaryEn: 'Exploring TGEX multilayer security, 256-bit encryption, and why platform servers never have custody or withdrawal access to your funds.',
    coverImage: blogCoverSecurity,
    category: 'امنیت و کریپتو',
    categoryEn: 'Security & Crypto',
    tags: ['امنیت', 'API', 'رمزنگاری', 'صرافی'],
    tagsEn: ['Security', 'API Integration', 'Encryption', 'Exchange'],
    author: {
      name: 'مهندس بهزاد نوری',
      role: 'سرپرست امنیت سایبری و بلاک‌چین',
      avatar: authorBehzad,
      bio: 'متخصص امنیت نرم‌افزار و زیرساخت‌های توزیع‌شده.'
    },
    publishedAt: '2026-08-18',
    readTimeMinutes: 4,
    status: 'published',
    viewsCount: 1890,
    likesCount: 145,
    showOnMain: true,
    seo: {
      metaTitle: 'امنیت کپی تریدینگ تیجکس | رمزنگاری کلیدهای API و اتصال امن',
      metaDescription: 'چرا سرمایه شما در صرافی شخصی امن است و پلتفرم تیجکس هیچ دسترسی برداشتی به دارایی‌ها ندارد.',
      focusKeyword: 'امنیت کپی تریدینگ'
    },
    contentHtml: `
      <p style="font-size: 16px; line-height: 1.8; color: #cbd5e1;">
        در پلتفرم تیجکس، اصل Non-Custodial (غیر حضانتی) حاکم است؛ این بدان معناست که کاربران وجوه خود را در صرافی‌های قانونی و تحت نظارت خود نگه می‌دارند.
      </p>
      <h3 style="font-size: 20px; font-weight: 700; color: #38bdf8; margin-top: 24px;">اتصال انحصاری از طریق API بدون مجوز برداشت (No Withdrawal)</h3>
      <p style="font-size: 15px; line-height: 1.8; color: #94a3b8;">
        کلیدهای ارسالی تنها دسترسی ثبت سفارشات همگام را دارند و هرگونه دسترسی به انتقال یا برداشت وجه در سطح سرور صرافی غیرفعال است.
      </p>
    `,
    contentHtmlEn: `
      <p style="font-size: 16px; line-height: 1.8; color: #cbd5e1;">
        At TGEX, the Non-Custodial architecture ensures that users always maintain full custody of their funds inside their own verified exchange accounts.
      </p>
      <h3 style="font-size: 20px; font-weight: 700; color: #38bdf8; margin-top: 24px;">Strict Read & Trade API Keys (Zero Withdrawal Permissions)</h3>
      <p style="font-size: 15px; line-height: 1.8; color: #94a3b8;">
        Connected API keys only possess permission to mirror and execute automated copy orders. All fund withdrawal, internal transfer, and custody actions are permanently disabled at the exchange API level.
      </p>
    `
  }
];

class BlogService {
  private posts: BlogPost[] = [];

  constructor() {
    this.loadPosts();
  }

  private loadPosts() {
    try {
      const stored = localStorage.getItem(BLOG_STORAGE_KEY);
      if (stored) {
        const parsed: BlogPost[] = JSON.parse(stored);
        this.posts = parsed.map((p) => ({
          ...p,
          coverImage: localizeBlogUrl(p.coverImage, blogCoverMatrix),
          contentHtml: localizeHtmlImages(p.contentHtml) || p.contentHtml,
          contentHtmlEn: localizeHtmlImages(p.contentHtmlEn),
          author: {
            ...p.author,
            avatar: localizeBlogUrl(p.author?.avatar, authorAria)
          }
        }));
      } else {
        this.posts = [...INITIAL_BLOG_POSTS];
        this.savePosts();
      }
    } catch {
      this.posts = [...INITIAL_BLOG_POSTS];
    }
  }

  private savePosts() {
    try {
      localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(this.posts));
    } catch (err) {
      console.error('Failed to persist blog posts:', err);
    }
  }

  public getAllPosts(): BlogPost[] {
    return [...this.posts];
  }

  public getPublishedPosts(): BlogPost[] {
    return this.posts.filter(p => p.status === 'published');
  }

  public getPostBySlug(slug: string): BlogPost | undefined {
    return this.posts.find(p => p.slug === slug);
  }

  public getPostById(id: string): BlogPost | undefined {
    return this.posts.find(p => p.id === id);
  }

  public createPost(post: Omit<BlogPost, 'id' | 'viewsCount' | 'likesCount' | 'publishedAt'>): BlogPost {
    const newPost: BlogPost = {
      ...post,
      id: `post-${Date.now()}`,
      viewsCount: 1,
      likesCount: 0,
      publishedAt: new Date().toISOString().split('T')[0]
    };
    this.posts.unshift(newPost);
    this.savePosts();
    return newPost;
  }

  public updatePost(id: string, updates: Partial<BlogPost>): BlogPost | null {
    const idx = this.posts.findIndex(p => p.id === id);
    if (idx === -1) return null;

    this.posts[idx] = {
      ...this.posts[idx],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    this.savePosts();
    return this.posts[idx];
  }

  public deletePost(id: string): boolean {
    const initialLen = this.posts.length;
    this.posts = this.posts.filter(p => p.id !== id);
    if (this.posts.length !== initialLen) {
      this.savePosts();
      return true;
    }
    return false;
  }

  public incrementViews(slug: string) {
    const post = this.posts.find(p => p.slug === slug);
    if (post) {
      post.viewsCount = (post.viewsCount || 0) + 1;
      this.savePosts();
    }
  }

  public toggleLike(slug: string): number {
    const post = this.posts.find(p => p.slug === slug);
    if (post) {
      post.likesCount = (post.likesCount || 0) + 1;
      this.savePosts();
      return post.likesCount;
    }
    return 0;
  }
}

export const blogService = new BlogService();

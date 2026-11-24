const fs = require('fs');
const file = 'src/components/admin/AdminNetworkPage.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('useLanguage')) {
  content = content.replace(
    "import { databaseService, DbUserEntity } from '../../services/db/databaseService';",
    "import { databaseService, DbUserEntity } from '../../services/db/databaseService';\nimport { useLanguage } from '../../context/LanguageContext';"
  );
  content = content.replace(
    "const AdminNetworkPage: React.FC<{}> = () => {",
    "const AdminNetworkPage: React.FC<{}> = () => {\n  const { language, dir } = useLanguage();"
  );
  content = content.replace(
    'className="space-y-6 pb-12 text-slate-200"',
    'className={`space-y-6 pb-12 text-slate-200 ${language === \'fa\' ? \'text-right\' : \'text-left\'}`} dir={dir}'
  );
  
  const translations = {
    'جستجوی کاربر با نام، نام کاربری یا User ID جهت فوکوس روی شبکه...': 'Search user by Name, Username or ID to focus...',
    'جستجو و ردیابی': 'Search & Track',
    'حامی مستقیم (Sponsor):': 'Direct Sponsor:',
    'شناسه: ': 'ID: ',
    'جایگاه ساختاری (سیستم هیبرید):': 'Structural Placement (Hybrid):',
    'شناسه والد: ': 'Parent ID: ',
    'اعضای فعال / غیرفعال:': 'Active / Inactive Members:',
    ' فعال': ' Active',
    ' غیرفعال': ' Inactive',
    'سود و پورسانت تولیدی:': 'Generated Profit & Commission:',
    'اتصال به API وب‌سایت کلیکس': 'Klix Website API Connection',
    'درخت تعاملی سیستم هیبرید سازمان (Global Hybrid Network Tree)': 'Interactive Global Hybrid Network Tree',
    'اسکرول به راست': 'Scroll Right',
    'راست': 'Right',
    'اسکرول به چپ': 'Scroll Left',
    'چپ': 'Left',
    'بزرگ‌نمایی (Zoom In)': 'Zoom In',
    'کوچک‌نمایی (Zoom Out)': 'Zoom Out',
    'تنظیم مجدد بزرگ‌نمایی': 'Reset Zoom',
    'گره ریشه / شاخه اصلی سیستم هیبرید': 'Root Node / Main Hybrid Branch',
    'لیدرها و اعضای احراز شده': 'Verified Leaders & Members',
    'قابلیت پیمایش و اسکرول افقی کامل (Overflow-X) حتی با ده‌ها کاربر در یک سطح': 'Full horizontal scrolling capability (Overflow-X) even with dozens of users',
    'برای باز یا بسته کردن شاخه‌ها از دکمه‌های + و − روی کارت‌ها استفاده نمایید.': 'Use the + and - buttons on the cards to expand or collapse branches.'
  };

  for (const [fa, en] of Object.entries(translations)) {
    content = content.replace(
      new RegExp(`(>|'|"| )(${fa})(<|'|"| )`, 'g'),
      `$1{language === 'fa' ? '$2' : '${en}'}$3`
    );
  }
  
  // also handle some cases manually
  content = content.replace(
    `placeholder="جستجوی کاربر با نام، نام کاربری یا User ID جهت فوکوس روی شبکه..."`,
    `placeholder={language === 'fa' ? "جستجوی کاربر با نام، نام کاربری یا User ID جهت فوکوس روی شبکه..." : "Search user by Name, Username or ID to focus..."}`
  );
  content = content.replace(
    `title="اسکرول به راست"`,
    `title={language === 'fa' ? "اسکرول به راست" : "Scroll Right"}`
  );
  content = content.replace(
    `title="اسکرول به چپ"`,
    `title={language === 'fa' ? "اسکرول به چپ" : "Scroll Left"}`
  );
  content = content.replace(
    `title="بزرگ‌نمایی (Zoom In)"`,
    `title={language === 'fa' ? "بزرگ‌نمایی (Zoom In)" : "Zoom In"}`
  );
  content = content.replace(
    `title="کوچک‌نمایی (Zoom Out)"`,
    `title={language === 'fa' ? "کوچک‌نمایی (Zoom Out)" : "Zoom Out"}`
  );
  content = content.replace(
    `title="تنظیم مجدد بزرگ‌نمایی"`,
    `title={language === 'fa' ? "تنظیم مجدد بزرگ‌نمایی" : "Reset Zoom"}`
  );
  
  content = content.replace(
    `<span>جستجو و ردیابی</span>`,
    `<span>{language === 'fa' ? 'جستجو و ردیابی' : 'Search & Track'}</span>`
  );
  
  fs.writeFileSync(file, content);
}

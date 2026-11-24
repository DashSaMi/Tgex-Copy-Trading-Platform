import os
import re

directories = ['src/components/admin', 'src/components/dashboard']
translations = {
    'جستجوی کاربر با نام، نام کاربری یا User ID جهت فوکوس روی شبکه...': 'Search user by name, username or User ID to focus...',
    'جستجو و ردیابی': 'Search & Track',
    'حامی مستقیم (Sponsor):': 'Direct Sponsor:',
    'جایگاه ساختاری (سیستم هیبرید):': 'Structural Placement (Hybrid):',
    'اعضای فعال / غیرفعال:': 'Active / Inactive Members:',
    'سود و پورسانت تولیدی:': 'Generated Profit & Commission:',
    'اتصال به API وب‌سایت کلیکس': 'Klix Website API Connection',
    'درخت تعاملی سیستم هیبرید سازمان (Global Hybrid Network Tree)': 'Global Hybrid Network Tree',
    'اسکرول به راست': 'Scroll Right',
    'اسکرول به چپ': 'Scroll Left',
    'راست': 'Right',
    'چپ': 'Left',
    'بزرگ‌نمایی (Zoom In)': 'Zoom In',
    'کوچک‌نمایی (Zoom Out)': 'Zoom Out',
    'تنظیم مجدد بزرگ‌نمایی': 'Reset Zoom',
    'گره ریشه / شاخه اصلی سیستم هیبرید': 'Root Node / Main Hybrid Branch',
    'لیدرها و اعضای احراز شده': 'Verified Leaders & Members',
    'قابلیت پیمایش و اسکرول افقی کامل (Overflow-X) حتی با ده‌ها کاربر در یک سطح': 'Full horizontal scrolling capability (Overflow-X)',
    'برای باز یا بسته کردن شاخه‌ها از دکمه‌های + و − روی کارت‌ها استفاده نمایید.': 'Use the + and - buttons on the cards to expand or collapse branches.',
    'باز کردن زیرشاخه‌ها': 'Expand Branches',
    'بستن زیرشاخه‌ها': 'Collapse Branches',
    'درخت تعاملی و سراسری سیستم هیبرید (Interactive Hybrid Tree)': 'Interactive Global Hybrid Tree',
    'ردیابی خطوط حامی (Sponsor)، جایگاه ساختاری در سیستم هیبرید (Placement)، اتصال واقعی کاربران دیتابیس و اسکرول نامحدود افقی.': 'Track Sponsor lines, Hybrid Placement, Real DB users and unlimited horizontal scroll.',
    'همگام‌سازی درخت': 'Sync Tree',
    'سطح هیبرید:': 'Hybrid Level:',
    'کل ساختار:': 'Total Structure:',
    ' کاربر': ' Users',
    ' فعال': ' Active',
    ' غیرفعال': ' Inactive',
    'مدیریت سرپرستان و مدیران ارشد (Admin & Staff)': 'Admin & Staff Management',
    'افزودن مدیران جدید، تعیین نقش، دسترسی به ماژول‌های پنل و کنترل لاگین ادمین‌ها.': 'Add new admins, set roles, module access and control logins.',
    'افزودن مدیر جدید': 'Add New Admin',
    'نام کامل مدیر': 'Full Name',
    'ایمیل': 'Email',
    'نقش (Role)': 'Role',
    'وضعیت (Status)': 'Status',
    'آخرین ورود': 'Last Login',
    'عملیات': 'Actions',
    'آفلاین': 'Offline',
    'آنلاین': 'Online',
    'مدیریت دسترسی‌ها (RBAC) و نقش‌ها': 'RBAC & Roles Management',
    'تعریف نقش‌های جدید، شخصی‌سازی سطح دسترسی (Permissions) و مدیریت سیاست‌های امنیتی.': 'Define new roles, customize permissions and security policies.',
    'افزودن نقش جدید': 'Add New Role',
    'گزارش‌های امنیتی و حسابرسی (Security Audit Logs)': 'Security Audit Logs',
    'ثبت و مانیتورینگ تمامی رویدادها، لاگین‌ها، تغییرات ساختاری و خطاهای سیستمی سرور.': 'Monitor all events, logins, structural changes and system errors.',
    'استخراج گزارش (CSV)': 'Export (CSV)',
    'پیکربندی سیستم و پارامترهای اصلی (Platform Settings)': 'Platform Core Settings',
    'تنظیم پارامترهای پایه‌ای سامانه، کارمزدها، محدودیت‌های برداشت و متغیرهای امنیتی.': 'Configure core parameters, fees, withdrawal limits and security variables.',
    'مدیریت محتوای پلتفرم (CMS)': 'Content Management System (CMS)',
    'به‌روزرسانی قوانین، اخبار، اطلاعیه‌های داشبورد کاربران و صفحات استاتیک وب‌سایت.': 'Update rules, news, dashboard announcements and static pages.',
    'تنظیمات API وب‌سایت کلیکس (Klix Integration)': 'Klix API Integration Settings',
    'مدیریت وب‌هوک‌ها، کلیدهای دسترسی (API Keys) و اتصال سرور به دیتابیس معاملات کلیکس.': 'Manage webhooks, API keys and server connections to Klix trading database.',
    'مدیریت سطوح سازمان و استخرهای پاداش رهبری': 'Organization Ranks & Leadership Pools',
    'تعیین شرایط ارتقاء رتبه سازمانی (Directs, Volume) و تخصیص درصدهای استخر جهانی پلتفرم.': 'Set rank upgrade conditions and platform global pool allocations.',
    'مدیریت توزیع پورسانت‌ها (Commissions & Ledgers)': 'Commissions & Ledgers Management',
    'بررسی تراکنش‌های پاداش شبکه، تسویه خودکار سیستم هیبرید و ریز گزارشات مالی ماتریس.': 'Review network reward transactions, automatic hybrid system settlements and matrix financial reports.',
    'ارسال اعلان‌های سیستمی و پیام به کاربران (Notifications)': 'System Notifications & Messaging',
    'ارسال پیام‌های گروهی، پوش‌نوتیفیکیشن، و ایمیل‌های سیستمی به کاربران یا لایه‌های خاص.': 'Send broadcast messages, push notifications and system emails to specific users or layers.',
}

def translate_file(filepath):
    with open(filepath, 'r', encoding='utf8') as f:
        content = f.read()

    # ensure useLanguage is imported
    if 'useLanguage' not in content:
        content = content.replace("import React", "import { useLanguage } from '../../context/LanguageContext';\nimport React")
        # Add destructuring right inside the component
        # Need to find the component definition
        component_match = re.search(r'const\s+([A-Za-z0-9_]+)\s*(?:[:\w\s<>]+)?\s*=\s*(?:<[^>]+>\s*)?\([^)]*\)\s*=>\s*{', content)
        if component_match:
            component_decl = component_match.group(0)
            content = content.replace(component_decl, component_decl + "\n  const { language, dir } = useLanguage();\n")
            
            # replace text-slate-200 or space-y-6 pb-12
            content = content.replace('className="space-y-6 pb-12 text-slate-200"', 'className={`space-y-6 pb-12 text-slate-200 ${language === \'fa\' ? \'text-right\' : \'text-left\'}`} dir={dir}')

    for fa, en in translations.items():
        # Look for the exact persian string surrounded by >, <, ", or '
        # To make it safe, we can manually replace string literals in jsx if we are careful
        content = content.replace(f"'{fa}'", f"(language === 'fa' ? '{fa}' : '{en}')")
        content = content.replace(f'"{fa}"', f"(language === 'fa' ? '{fa}' : '{en}')")
        content = content.replace(f'>{fa}<', f">{{language === 'fa' ? '{fa}' : '{en}'}}<")
        content = content.replace(f'>{fa} ', f">{{language === 'fa' ? '{fa}' : '{en}'}} ")
        content = content.replace(f' {fa}<', f" {{language === 'fa' ? '{fa}' : '{en}'}}<")
        
        # In case the JSX text is free floating:
        content = content.replace(f">{fa}", f">{{language === 'fa' ? '{fa}' : '{en}'}}")
        content = content.replace(f"{fa}<", f"{{language === 'fa' ? '{fa}' : '{en}'}}<")

    with open(filepath, 'w', encoding='utf8') as f:
        f.write(content)

for root, _, files in os.walk('src/components/admin'):
    for file in files:
        if file.endswith('.tsx'):
            translate_file(os.path.join(root, file))

import os
import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf8') as f:
        content = f.read()

    # Fix double translations like {language === 'fa' ? (language === 'fa' ? 'چپ' : 'Left') : 'Left'}
    # Replace (language === 'fa' \? (language === 'fa' \? '([^']+)' : '([^']+)') : '([^']+)')
    content = re.sub(r"\{language === 'fa' \? \(language === 'fa' \? '([^']+)' : '([^']+)'\) : '([^']+)'\}", r"{language === 'fa' ? '\1' : '\2'}", content)
    
    # Also handle strings that are now: title="{language === 'fa' ? 'اسکرول به {language === 'fa' ? 'راست' : 'Right'}' : 'Scroll Right'}"
    # This is messy. We should just replace everything between language === 'fa' ? and the end.
    
    # Simple search and replace for specific broken strings
    fixes = {
        "{language === 'fa' ? (language === 'fa' ? 'چپ' : 'Left') : 'Left'}": "{language === 'fa' ? 'چپ' : 'Left'}",
        "{language === 'fa' ? (language === 'fa' ? 'راست' : 'Right') : 'Right'}": "{language === 'fa' ? 'راست' : 'Right'}",
        "(language === 'fa' ? 'باز کردن زیرشاخه‌ها' : 'Expand Branches')": "'باز کردن زیرشاخه‌ها'",
        "(language === 'fa' ? 'بستن زیرشاخه‌ها' : 'Collapse Branches')": "'بستن زیرشاخه‌ها'",
        '"{language === \'fa\' ? (language === \'fa\' ? \'جستجوی کاربر با نام، نام کاربری یا User ID جهت فوکوس روی شبکه...\' : \'Search user by name, username or User ID to focus...\') : \'Search user by Name, Username or ID to focus...\'}"': '{language === \'fa\' ? \'جستجوی کاربر با نام، نام کاربری یا User ID جهت فوکوس روی شبکه...\' : \'Search user by name, username or User ID to focus...\'}',
        "{language === 'fa' ? (language === 'fa' ? 'اعضای فعال / غیرفعال:' : 'Active / Inactive Members:') : 'Active / Inactive Members:'}": "{language === 'fa' ? 'اعضای فعال / غیرفعال:' : 'Active / Inactive Members:'}",
        "{language === 'fa' ? (language === 'fa' ? 'سود و پورسانت تولیدی:' : 'Generated Profit & Commission:') : 'Generated Profit & Commission:'}": "{language === 'fa' ? 'سود و پورسانت تولیدی:' : 'Generated Profit & Commission:'}",
        "{language === 'fa' ? (language === 'fa' ? 'اتصال به API وب‌سایت کلیکس' : 'Klix Website API Connection') : 'Klix Website API Connection'}": "{language === 'fa' ? 'اتصال به API وب‌سایت کلیکس' : 'Klix Website API Connection'}",
        '"{language === \'fa\' ? \'اسکرول به {language === \'fa\' ? \'راست\' : \'Right\'}\' : \'Scroll Right\'}"': '{language === \'fa\' ? \'اسکرول به راست\' : \'Scroll Right\'}',
        '"{language === \'fa\' ? \'اسکرول به {language === \'fa\' ? \'چپ\' : \'Left\'}\' : \'Scroll Left\'}"': '{language === \'fa\' ? \'اسکرول به چپ\' : \'Scroll Left\'}',
        "{language === 'fa' ? (language === 'fa' ? 'بزرگ‌نمایی (Zoom In)' : 'Zoom In') : \"Zoom In\"}": "{language === 'fa' ? 'بزرگ‌نمایی (Zoom In)' : 'Zoom In'}",
        "{language === 'fa' ? (language === 'fa' ? 'کوچک‌نمایی (Zoom Out)' : 'Zoom Out') : \"Zoom Out\"}": "{language === 'fa' ? 'کوچک‌نمایی (Zoom Out)' : 'Zoom Out'}",
        '"{language === \'fa\' ? (language === \'fa\' ? \'تنظیم مجدد بزرگ‌نمایی\' : \'Reset Zoom\') : \'Reset Zoom\'}"': '{language === \'fa\' ? \'تنظیم مجدد بزرگ‌نمایی\' : \'Reset Zoom\'}',
        "{language === 'fa' ? (language === 'fa' ? 'گره ریشه / شاخه اصلی سیستم هیبرید' : 'Root Node / Main Hybrid Branch') : 'Root Node / Main Hybrid Branch'}": "{language === 'fa' ? 'گره ریشه / شاخه اصلی سیستم هیبرید' : 'Root Node / Main Hybrid Branch'}",
        "{language === 'fa' ? (language === 'fa' ? 'لیدرها و اعضای احراز شده' : 'Verified Leaders & Members') : 'Verified Leaders & Members'}": "{language === 'fa' ? 'لیدرها و اعضای احراز شده' : 'Verified Leaders & Members'}",
        "درخت تعاملی و سراسری سیستم هیبرید (Interactive Hybrid Tree)": "{language === 'fa' ? 'درخت تعاملی و سراسری سیستم هیبرید (Interactive Hybrid Tree)' : 'Interactive Global Hybrid Tree'}",
        "ردیابی خطوط حامی (Sponsor)، جایگاه ساختاری در سیستم هیبرید (Placement)، اتصال واقعی کاربران دیتابیس و اسکرول نامحدود افقی.": "{language === 'fa' ? 'ردیابی خطوط حامی (Sponsor)، جایگاه ساختاری در سیستم هیبرید (Placement)، اتصال واقعی کاربران دیتابیس و اسکرول نامحدود افقی.' : 'Track Sponsor lines, Hybrid Placement, Real DB users and unlimited horizontal scroll.'}",
        "جستجو و ردیابی": "{language === 'fa' ? 'جستجو و ردیابی' : 'Search & Track'}",
        "شناسه: ": "{language === 'fa' ? 'شناسه: ' : 'ID: '}",
        "شناسه والد: ": "{language === 'fa' ? 'شناسه والد: ' : 'Parent ID: '}",
        "سامان کریمیان": "Saman Karimian",
        "ریشه شبکه تیجکس": "Tgex Network Root",
        "شاخه اصلی سیستم هیبرید": "Main Hybrid Branch",
        "سطح ۱۲ (Level L)": "Level 12 (Level L)",
    }

    for broken, fixed in fixes.items():
        content = content.replace(broken, fixed)

    with open(filepath, 'w', encoding='utf8') as f:
        f.write(content)

for root, _, files in os.walk('src/components/admin'):
    for file in files:
        if file.endswith('.tsx'):
            fix_file(os.path.join(root, file))


const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Fix line 93:
  content = content.replace(
    /placementName: u\.placementName \|\| `\$\{u\.fullName\} \(شاخه \$\{u\.placementSide === 'left' \? '\{language === 'fa' \? \(language === 'fa' \? \(language === 'fa' \? 'چپ' : 'Left'\) : 'Left'\) : 'Left'\}' : '\{language === 'fa' \? \(language === 'fa' \? \(language === 'fa' \? 'راست' : 'Right'\) : 'Right'\) : 'Right'\}'\}\)`,/g,
    "placementName: u.placementName || `${u.fullName} (${language === 'fa' ? (u.placementSide === 'left' ? 'شاخه چپ' : 'شاخه راست') : (u.placementSide === 'left' ? 'Left Branch' : 'Right Branch')})`,"
  );

  content = content.replace(
    /placeholder="\{language === 'fa' \? \(language === 'fa' \? \(language === 'fa' \? 'جستجوی کاربر با نام، نام کاربری یا User ID جهت فوکوس روی شبکه\.\.\.' : 'Search user by name, username or User ID to focus\.\.\.'\) : 'Search user by name, username or User ID to focus\.\.\.'\) : 'Search user by Name, Username or ID to focus\.\.\.'\}"/g,
    "placeholder={language === 'fa' ? 'جستجوی کاربر با نام، نام کاربری یا User ID جهت فوکوس روی شبکه...' : 'Search user by Name, Username or ID to focus...'}"
  );

  content = content.replace(
    /title="\{language === 'fa' \? 'اسکرول به \{language === 'fa' \? \(language === 'fa' \? \(language === 'fa' \? 'راست' : 'Right'\) : 'Right'\) : 'Right'\}' : 'Scroll Right'\}"/g,
    "title={language === 'fa' ? 'اسکرول به راست' : 'Scroll Right'}"
  );
  
  content = content.replace(
    /title="\{language === 'fa' \? 'اسکرول به \{language === 'fa' \? \(language === 'fa' \? \(language === 'fa' \? 'چپ' : 'Left'\) : 'Left'\) : 'Left'\}' : 'Scroll Left'\}"/g,
    "title={language === 'fa' ? 'اسکرول به چپ' : 'Scroll Left'}"
  );
  
  content = content.replace(
    /title="\{language === 'fa' \? \(language === 'fa' \? \(language === 'fa' \? 'تنظیم مجدد بزرگ‌نمایی' : 'Reset Zoom'\) : 'Reset Zoom'\) : 'Reset Zoom'\}"/g,
    "title={language === 'fa' ? 'تنظیم مجدد بزرگ‌نمایی' : 'Reset Zoom'}"
  );
  
  content = content.replace(
    /title=\{isCollapsed \? \(language === 'fa' \? 'باز کردن زیرشاخه‌ها' : 'Expand Branches'\) : \(language === 'fa' \? 'بستن زیرشاخه‌ها' : 'Collapse Branches'\)\}/g,
    "title={isCollapsed ? (language === 'fa' ? 'باز کردن زیرشاخه‌ها' : 'Expand Branches') : (language === 'fa' ? 'بستن زیرشاخه‌ها' : 'Collapse Branches')}"
  );

  fs.writeFileSync(file, content);
}

fixFile('src/components/admin/AdminNetworkPage.tsx');

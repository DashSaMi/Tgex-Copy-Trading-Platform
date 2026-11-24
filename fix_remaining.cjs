const fs = require('fs');

const files = [
    'src/components/admin/AdminNetworkPage.tsx',
    'src/components/admin/AdminAuditLogsPage.tsx',
    'src/components/admin/AdminRolesPage.tsx'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Replace {language === 'fa' ? 'fa' : 'en'} -> 'en' globally if language is undefined in these files outside component
    content = content.replace(/\{language === 'fa' \? '([^']+)' : '([^']+)'\}/g, "'$2'");
    content = content.replace(/\(language === 'fa' \? '([^']+)' : '([^']+)'\)/g, "'$2'");
    content = content.replace(/language === 'fa' \? '([^']+)' : '([^']+)'/g, "'$2'");
    
    // Also remove any stray dir={dir} if dir is missing
    // Actually AdminNetworkPage.tsx has `const { language, dir } = useLanguage();` inside the component.
    // So dir should be defined inside the component.
    // Where is the error? line 264
    
    fs.writeFileSync(file, content);
});


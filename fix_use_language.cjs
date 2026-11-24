const fs = require('fs');
const path = require('path');

function injectUseLanguage(file) {
  let content = fs.readFileSync(file, 'utf8');

  // If useLanguage is missing the hook call, inject it.
  if (content.includes("import { useLanguage }") && !content.includes("const { language, dir } = useLanguage();") && !content.includes("const { t, language, dir } = useLanguage();")) {
    
    // Find component definition
    const componentRegex = /(export\s+(?:default\s+)?const\s+[A-Za-z0-9_]+\s*(?::\s*React\.FC(?:<[^>]*>)?\s*)?=\s*(?:\([^)]*\)\s*=>|function\s*\([^)]*\))\s*\{)/;
    
    if (componentRegex.test(content)) {
        content = content.replace(componentRegex, "$1\n  const { language, dir } = useLanguage();\n");
    } else {
        const functionRegex = /(export\s+(?:default\s+)?function\s+[A-Za-z0-9_]+\s*\([^)]*\)\s*\{)/;
        if (functionRegex.test(content)) {
            content = content.replace(functionRegex, "$1\n  const { language, dir } = useLanguage();\n");
        }
    }
    
    fs.writeFileSync(file, content);
  }
}

const dir = 'src/components/admin';
fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.tsx')) {
    injectUseLanguage(path.join(dir, file));
  }
});


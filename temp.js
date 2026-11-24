const fs = require('fs');
let code = fs.readFileSync('src/components/pages/HomePage.tsx', 'utf-8');
console.log(code.substring(code.indexOf('LEFT COLUMN'), code.indexOf('4-STEP COMPUTERIZED ROADMAP')));

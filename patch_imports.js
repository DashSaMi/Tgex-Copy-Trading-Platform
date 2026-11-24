const fs = require('fs');
let code = fs.readFileSync('src/components/pages/HomePage.tsx', 'utf-8');

if (!code.includes("import { motion }")) {
  code = code.replace("import React from 'react';", "import React from 'react';\nimport { motion } from 'motion/react';");
  fs.writeFileSync('src/components/pages/HomePage.tsx', code);
}

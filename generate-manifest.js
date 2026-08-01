// generate-manifest.js
const fs = require('fs');
const path = require('path');

const papersDir = './papers';
const files = fs.readdirSync(papersDir).filter(f => f.endsWith('.md'));
fs.writeFileSync('./manifest.json', JSON.stringify(files, null, 2));
console.log('✅ manifest.json 已生成');
import fs from 'node:fs';
const s=fs.readFileSync('script.js','utf8');
for(const t of ['catalogue-art-gifts.json','buildCatalogue','product-card','catalogue-root']) if(!s.includes(t)) throw new Error(`catalogue renderer missing ${t}`);
console.log('Art & Gifts catalogue renderer source contract PASS');

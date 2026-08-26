import fs from 'node:fs';
const checks={
'index.html':['Handmade with Care','Our Approach','From a photograph, memory or idea','Custom Creations','The story continues','Step inside the Velvet Universe'],
'catalogue.html':['Art & Gifts Collection','Order as shown — or create something uniquely yours.'],
'custom-orders.html':['Your photograph. Your story. Made by hand.','What Can We Create for You?','One subject, many possibilities','How a custom creation works','Custom creation request'],
'about.html':['About Velvet Charms','Fourteen Makers, Many Creative Worlds'],
'faq.html':['Frequently Asked Questions'],
'contact.html':['Contact'],
'universe.html':['Velvet Universe']};
for(const [f,terms] of Object.entries(checks)){const s=fs.readFileSync(f,'utf8'); for(const t of terms) if(!s.includes(t)) throw new Error(`${f} lost approved content: ${t}`);}
console.log('Art & Gifts approved content regression guard PASS');

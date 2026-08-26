import fs from 'node:fs';
const must=(file,terms)=>{const s=fs.readFileSync(file,'utf8'); for(const t of terms) if(!s.includes(t)) throw new Error(`${file} missing: ${t}`); return s;};
must('index.html',['Handmade with Care','Our Approach','Custom Creations','Step inside the Velvet Universe','catalogue.html','custom-orders.html','about.html','faq.html','contact.html','universe.html']);
must('catalogue.html',['catalogue-root','Art & Gifts Collection']);
must('custom-orders.html',['Your photograph. Your story. Made by hand.','What Can We Create for You?','How a custom creation works','Custom creation request','Photographs or visual references — up to 5']);
const about=must('about.html',['Fourteen artists, one creative home','About Velvet Charms','Many skills, one commission']);
for(let i=1;i<=14;i++){const n=String(i).padStart(2,'0'); if(!about.includes(`assets/artists/artist-${n}.svg`)) throw new Error(`about missing artist ${n}`);}
for(const f of ['index.html','catalogue.html','custom-orders.html','about.html','faq.html','contact.html','universe.html']) if(!fs.existsSync(f)) throw new Error(`missing page ${f}`);
const runtime=fs.readFileSync('script.js','utf8');
if(!runtime.includes('catalogue-art-gifts.json')) throw new Error('catalogue runtime lost JSON source');
const data=JSON.parse(fs.readFileSync('catalogue-art-gifts.json','utf8'));
let products=0,images=0; const walk=(x)=>{if(Array.isArray(x)) return x.forEach(walk); if(x&&typeof x==='object'){if(typeof x.id==='string'&&typeof x.name==='string'&&('price' in x||Array.isArray(x.images))){products++; if(Array.isArray(x.images)){images+=x.images.length; for(const im of x.images) if(!fs.existsSync(im)) throw new Error(`missing catalogue image ${im}`);}} for(const v of Object.values(x)) walk(v);}}; walk(data);
if(products<33) throw new Error(`expected at least 33 products, got ${products}`);
if(images<118) throw new Error(`expected at least 118 image refs, got ${images}`);
console.log(`Art & Gifts full-site contract PASS (${products} products, ${images} image refs)`);

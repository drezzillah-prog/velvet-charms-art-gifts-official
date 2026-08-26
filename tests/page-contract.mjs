import fs from 'node:fs';
const pages=['index.html','catalogue.html','custom-orders.html','about.html','faq.html','contact.html','universe.html'];
const nav=['index.html','catalogue.html','custom-orders.html','about.html','faq.html','contact.html','universe.html'];
for(const page of pages){
  const s=fs.readFileSync(page,'utf8');
  for(const href of nav) if(!s.includes(`href="${href}"`)) throw new Error(`${page} missing nav ${href}`);
  if(!s.includes('localization.js')) throw new Error(`${page} missing language state wiring`);
  if(page==='catalogue.html'){
    if(!s.includes('catalogue-language.js')||!s.includes('catalogue-language-polish.js')) throw new Error('catalogue missing observer-free language wiring');
    if(s.includes('<script src="multilingual.js"')||s.includes('<script src="language-polish.js"')||s.includes('href="performance.css"')) throw new Error('catalogue reintroduced known observer/visibility regression');
  } else if(!s.includes('<script src="multilingual.js"')) throw new Error(`${page} missing mature multilingual runtime`);
}
const catLang=fs.readFileSync('catalogue-language.js','utf8');
const catPolish=fs.readFileSync('catalogue-language-polish.js','utf8');
if(catLang.includes('new MutationObserver')||catPolish.includes('new MutationObserver')) throw new Error('catalogue language path must remain observer-free');
console.log('Art & Gifts page/navigation/language contract PASS');

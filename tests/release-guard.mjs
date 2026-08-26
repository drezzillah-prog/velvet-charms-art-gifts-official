import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const mustExist = (file) => { if (!fs.existsSync(file)) throw new Error(`Missing required release file: ${file}`); };
const mustContain = (file, terms) => {
  const source = read(file);
  for (const term of terms) if (!source.includes(term)) throw new Error(`${file} missing release-critical content: ${term}`);
  return source;
};

for (const file of ['index.html','catalogue.html','custom-orders.html','about.html','faq.html','contact.html','universe.html','catalogue-art-gifts.json','script.js','features.js','localization.js','localization-ro.js','localization-ro-modern.js','multilingual.js','multilingual-pages.js','catalogue-language.js','catalogue-page-multilingual.js','catalogue-multilingual.js','catalogue-extra-translations.js','catalogue-language-polish.js','nav-parity.js']) mustExist(file);

mustContain('index.html', ['Handmade with Care','Our Approach','Custom Creations','Velvet Universe']);
const about = mustContain('about.html', ['About Velvet Charms']);
for (let i=1;i<=14;i++) {
  const n=String(i).padStart(2,'0');
  if (!about.includes(`assets/artists/artist-${n}.svg`)) throw new Error(`About page missing artist ${n}`);
}
mustContain('custom-orders.html', ['Custom creation request','Photographs or visual references — up to 5','painting_portrait_1.jpg','clay_3d_painting_1.png','Mini Portrait Ornament.jpg','clay_christmas_21.png','PersonalizedCase (1).png','Custom Hair Set.png']);
const catalogue = mustContain('catalogue.html', ['catalogue-root','Made Especially for You','catalogue-language.js','catalogue-language-polish.js','features.js']);
if (catalogue.includes('performance.css')) throw new Error('Art & Gifts catalogue must not load performance.css');
if (/<script[^>]+src=["']multilingual\.js["']/i.test(catalogue)) throw new Error('Art & Gifts catalogue must not load global multilingual.js directly');
if (/<script[^>]+src=["']language-polish\.js["']/i.test(catalogue)) throw new Error('Art & Gifts catalogue must not load global language-polish.js');

const catLanguage = read('catalogue-language.js');
for (const lang of ['en','ro','fr','it','de']) if (!catLanguage.includes(`'${lang}'`)) throw new Error(`Catalogue language missing ${lang}`);
if (catLanguage.includes('MutationObserver')) throw new Error('Catalogue language runtime must remain observer-free');

const compatibility = read('localization.js');
if (!compatibility.includes("const isCatalogue = page === 'catalogue.html'")) throw new Error('Compatibility localization must detect catalogue');
if (!compatibility.includes('if (!isCatalogue)')) throw new Error('Compatibility observers must stay off catalogue');
const modernLoadBlock = compatibility.indexOf("modern.src = 'localization-ro-modern.js'");
const catalogueGuard = compatibility.indexOf('if (!isCatalogue)');
if (modernLoadBlock < 0 || catalogueGuard < 0 || catalogueGuard > modernLoadBlock) throw new Error('Romanian modern observer layer must be skipped on catalogue');

const navParity = read('nav-parity.js');
const earlyReturn = navParity.indexOf("if(page==='catalogue.html')");
const heavyLoad = navParity.indexOf("load('multilingual.js')");
if (earlyReturn < 0 || heavyLoad < 0 || earlyReturn > heavyLoad) throw new Error('Navigation runtime must exit on catalogue before loading heavy multilingual runtime');

const multiPages = read('multilingual-pages.js');
for (const lang of ['fr','it','de']) if (!multiPages.includes(`${lang}:`)) throw new Error(`Full-page translation layer missing ${lang}`);

console.log('Art & Gifts release guard PASS: core pages/copy, 14 artists, custom examples, five-language catalogue wiring and observer-free catalogue protections are present.');

(function(){
  "use strict";
  const labels={
    en:{"index.html":"Home","catalogue.html":"Catalogue","custom-orders.html":"Custom Creations","about.html":"About","faq.html":"FAQ","contact.html":"Contact","universe.html":"Velvet Universe",sister:"Visit Body Glow",custom:"Explore custom creations"},
    ro:{"index.html":"Acasă","catalogue.html":"Catalog","custom-orders.html":"Creații personalizate","about.html":"Despre noi","faq.html":"Întrebări frecvente","contact.html":"Contact","universe.html":"Universul Velvet",sister:"Vizitează Body Glow",custom:"Descoperă creațiile personalizate"},
    fr:{"index.html":"Accueil","catalogue.html":"Catalogue","custom-orders.html":"Créations sur mesure","about.html":"À propos","faq.html":"FAQ","contact.html":"Contact","universe.html":"Univers Velvet",sister:"Découvrir Body Glow",custom:"Découvrir les créations sur mesure"},
    it:{"index.html":"Home","catalogue.html":"Catalogo","custom-orders.html":"Creazioni su misura","about.html":"Chi siamo","faq.html":"FAQ","contact.html":"Contatti","universe.html":"Universo Velvet",sister:"Scopri Body Glow",custom:"Scopri le creazioni su misura"},
    de:{"index.html":"Startseite","catalogue.html":"Katalog","custom-orders.html":"Individuelle Kreationen","about.html":"Über uns","faq.html":"FAQ","contact.html":"Kontakt","universe.html":"Velvet Universum",sister:"Body Glow entdecken",custom:"Individuelle Kreationen entdecken"}
  };
  function current(){const l=(window.VELVET_GET_LANGUAGE?.()||document.documentElement.lang||'en').slice(0,2).toLowerCase();return labels[l]?l:'en';}
  function apply(){
    const lang=current(),dict=labels[lang];
    document.querySelectorAll('.nav a').forEach(link=>{
      const href=(link.getAttribute('href')||'').split('?')[0];
      if(dict[href]) link.textContent=dict[href];
      if(link.classList.contains('sister-link')||href.includes('velvet-charms-body-glow')) link.textContent=dict.sister;
    });
    document.querySelectorAll('.custom-process a[href="custom-orders.html"]').forEach(link=>{link.textContent=dict.custom;});
  }
  function load(src){if(document.querySelector(`script[src="${src}"]`))return Promise.resolve();return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.body.appendChild(s);});}
  async function ensureLocalization(){
    try{
      if(!window.VELVET_GET_LANGUAGE) await load('multilingual.js');
      const page=location.pathname.split('/').pop()||'index.html';
      if(page==='universe.html'&&!document.querySelector('script[src="multilingual-universe.js"]')) await load('multilingual-universe.js');
      if(!document.querySelector('script[src="language-polish.js"]')) await load('language-polish.js');
      apply();
    }catch(error){console.warn('Extended navigation localization could not be loaded:',error);}
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(ensureLocalization,20));
  window.addEventListener('velvet-language-changed',apply);
  document.addEventListener('velvet:language-change',apply);
  new MutationObserver(apply).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
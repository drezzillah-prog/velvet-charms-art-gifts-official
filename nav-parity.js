(function(){
  "use strict";
  const labels={
    en:{"index.html":"Home","catalogue.html":"Catalogue","custom-orders.html":"Custom Creations","about.html":"About","faq.html":"FAQ","contact.html":"Contact","universe.html":"Velvet Universe"},
    ro:{"index.html":"Acasă","catalogue.html":"Catalog","custom-orders.html":"Creații personalizate","about.html":"Despre noi","faq.html":"Întrebări frecvente","contact.html":"Contact","universe.html":"Universul Velvet"}
  };
  function apply(){
    const lang=document.documentElement.lang==="ro"?"ro":"en";
    document.querySelectorAll('.nav a').forEach(link=>{
      const href=(link.getAttribute('href')||'').split('?')[0];
      if(labels[lang][href]) link.textContent=labels[lang][href];
      if(link.classList.contains('sister-link')||href.includes('velvet-charms-body-glow')) link.textContent=lang==='ro'?'Vizitează Body Glow':'Visit Body Glow';
    });
  }
  document.addEventListener('DOMContentLoaded',apply);
  new MutationObserver(apply).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
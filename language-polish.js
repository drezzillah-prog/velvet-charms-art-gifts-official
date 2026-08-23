/* Final language polish for customer-facing FR/IT/DE copy. Keeps checkout/source values unchanged. */
(() => {
  'use strict';
  const exact={
    fr:{
      'Ensemble cheveux personnalisé':'Ensemble d’accessoires pour cheveux personnalisé',
      'Ensemble cheveux personnalisé — 3 pièces assorties':'Ensemble d’accessoires pour cheveux personnalisé — 3 pièces assorties',
      'Set de 4 dessous de verre en résine époxy':'Lot de 4 dessous de verre en résine époxy',
      'Set de photophores en résine époxy':'Ensemble de photophores en résine époxy'
    },
    it:{
      'Abbina al mio outfit o alla mia reference':'Abbina al mio outfit o alla mia immagine di riferimento',
      'Abbina al mio arredamento o alla reference':'Abbina al mio arredamento o all’immagine di riferimento',
      'Abbina alla mia stanza o alla reference':'Abbina alla stanza o all’immagine di riferimento',
      'Creato dalla tua reference':'Creato a partire dalla tua immagine di riferimento',
      'Set capelli personalizzato':'Set di accessori per capelli personalizzato',
      'Set capelli personalizzato — 3 pezzi coordinati':'Set di accessori per capelli personalizzato — 3 pezzi coordinati',
      'Confezione signature Velvet':'Confezione Velvet esclusiva'
    },
    de:{
      'Velvet Signature-Verpackung':'Velvet-Signaturverpackung',
      'Die Velvet Details':'Die besonderen Velvet-Details'
    }
  };
  const lang=()=>{const l=(window.VELVET_GET_LANGUAGE?.()||document.documentElement.lang||'en').slice(0,2).toLowerCase();return ['fr','it','de'].includes(l)?l:'en';};
  const original=new WeakMap();
  function polished(value,l){
    const clean=String(value||'').trim();
    if(!clean||l==='en')return value;
    let out=exact[l]?.[clean]||clean;
    let m;
    if((m=clean.match(/^(\d+) photo\(s\) de référence privée\(s\)$/))&&l==='fr') out=Number(m[1])===1?'1 photo de référence privée':`${m[1]} photos de référence privées`;
    if((m=clean.match(/^(\d+) private Referenzfoto\(s\)$/))&&l==='de') out=Number(m[1])===1?'1 privates Referenzfoto':`${m[1]} private Referenzfotos`;
    return String(value).replace(clean,out);
  }
  function apply(root=document.body){
    if(!root)return;const l=lang();
    const scan=node=>{
      const w=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);
      while(w.nextNode()){
        const n=w.currentNode;if(!n.nodeValue.trim())continue;
        if(!original.has(n))original.set(n,n.nodeValue);
        n.nodeValue=l==='en'?original.get(n):polished(n.nodeValue,l);
      }
    };
    if(root.nodeType===Node.ELEMENT_NODE)scan(root);
  }
  let queued=false;function schedule(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;apply(document.body);});}
  const obs=new MutationObserver(schedule);
  function start(){apply(document.body);obs.observe(document.body,{childList:true,subtree:true,characterData:true});}
  window.addEventListener('velvet-language-changed',()=>setTimeout(()=>apply(document.body),0));
  document.addEventListener('velvet:language-change',()=>setTimeout(()=>apply(document.body),0));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
/* Romanian additions for copy introduced after the original EN/RO dictionary. */
(() => {
  'use strict';
  if ((localStorage.getItem('velvet_language_art_gifts') || 'en') !== 'ro') return;
  const map = new Map([
    ['Cozy, heart-warming handmade treasures — paintings, sculptural pieces, resin, leather, accessories and keepsakes designed to become part of a story.','Comori artizanale calde și pline de suflet — picturi, piese sculpturale, rășină, piele, accesorii și obiecte-amintire create pentru a deveni parte dintr-o poveste.'],
    ['Everything you see is slow-crafted with attention to texture, personality and detail: painted portraits, sculptural reliefs, resin creations, leather pieces, accessories and meaningful handmade gifts.','Fiecare piesă este realizată în ritmul pe care îl cere lucrul manual, cu atenție la textură, personalitate și detalii: portrete pictate, reliefuri sculpturale, creații din rășină, piese din piele, accesorii și cadouri artizanale cu semnificație.']
  ]);
  const translate = (root) => {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const key = node.nodeValue.trim();
      if (!map.has(key)) continue;
      const leading = node.nodeValue.match(/^\s*/)?.[0] || '';
      const trailing = node.nodeValue.match(/\s*$/)?.[0] || '';
      node.nodeValue = leading + map.get(key) + trailing;
    }
  };
  const start = () => {
    translate(document.body);
    new MutationObserver((mutations) => mutations.forEach((m) => m.addedNodes.forEach((n) => {
      if (n.nodeType === Node.ELEMENT_NODE) translate(n);
    }))).observe(document.body, {childList:true, subtree:true});
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true}); else start();
})();

/* features.js — Cart + Wishlist for Velvet Charms
   Safe augment: does not replace your existing scripts.
   Put this file in repo root and include <script src="features.js"></script>
*/

(() => {
  const CATALOG_FILES = ['/catalogue-art-gifts.json'];

  /* ---------- Utilities ---------- */
  function qs(sel,parent=document){return parent.querySelector(sel);}
  function qsa(sel,parent=document){return Array.from(parent.querySelectorAll(sel));}
  function $(tag,attrs={},parent=null){
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k,v])=>{
      if(k==='html') el.innerHTML = v;
      else if(k==='text') el.textContent = v;
      else el.setAttribute(k,v);
    });
    if(parent) parent.appendChild(el);
    return el;
  }
  function money(n){ return (Number(n)||0).toFixed(2) + ' USD'; }

  /* ---------- LocalStorage keys ---------- */
  const CART_KEY = 'velvetcharms_cart_v1';
  const WISH_KEY = 'velvetcharms_wishlist_v1';

  function loadCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch(e){return {};} }
  function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); }
  function loadWish(){ try { return JSON.parse(localStorage.getItem(WISH_KEY)) || []; } catch(e){return [];} }
  function saveWish(w){ localStorage.setItem(WISH_KEY, JSON.stringify(w)); }

  /* ---------- Catalog loading ---------- */
  let catalogue = {};
  async function loadCatalogues(){
    const promises = CATALOG_FILES.map(f => fetch(f).then(r => r.ok? r.json().catch(()=>null) : null).catch(()=>null));
    const results = await Promise.all(promises);
    results.forEach(json=>{
      if(!json || !json.categories) return;
      json.categories.forEach(cat=>{
        if(cat.products) cat.products.forEach(p => catalogue[p.id] = p);
        if(cat.subcategories) {
          cat.subcategories.forEach(sc=>{
            if(sc.products) sc.products.forEach(p=>catalogue[p.id] = p);
            if(sc.subcategories) sc.subcategories.forEach(sc2=>{
              if(sc2.products) sc2.products.forEach(p=>catalogue[p.id] = p);
            });
          });
        }
      });
    });
  }

  /* ---------- DOM: header icons, cart drawer ---------- */
  function injectHeaderUI(){
    const header = qs('nav') || qs('header') || document.body;
    if(!header) return;
    const wrapper = $('div',{class:'vc-header-actions'}, header);
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '10px';

    const wishBtn = $('button',{class:'vc-wish-btn','aria-label':'Wishlist'},wrapper);
    wishBtn.innerHTML = '❤ <span class="vc-count"></span>';
    wishBtn.addEventListener('click', ()=> {
      window.location.href = '/wishlist.html';
    });

    const cartBtn = $('button',{class:'vc-cart-btn','aria-label':'Cart'},wrapper);
    cartBtn.innerHTML = '🛒 <span class="vc-count"></span>';
    cartBtn.addEventListener('click', ()=> toggleCartDrawer(true));
    updateHeaderCounts();
  }

  function updateHeaderCounts(){
    const cart = loadCart();
    const qty = Object.values(cart).reduce((s,i)=>s + (i.qty||0),0);
    const wish = loadWish().length;
    qsa('.vc-header-actions .vc-count').forEach(span => span.textContent =
      span.parentElement.classList.contains('vc-wish-btn') ? wish : qty
    );
  }

  /* ---------- drawer ---------- */
  let drawerEl = null;
  function createCartDrawer(){
    if(drawerEl) return;
    drawerEl = $('div',{class:'vc-cart-drawer'}, document.body);
    drawerEl.innerHTML = `
      <div class="vc-cart-drawer__backdrop"></div>
      <aside class="vc-cart-drawer__panel" role="dialog" aria-label="Cart">
        <button class="vc-cart-drawer__close" aria-label="Close cart">✕</button>
        <h3>Your Cart</h3>
        <div class="vc-cart-items"></div>
        <div class="vc-cart-summary">
          <div class="vc-cart-subtotal">Subtotal: <strong class="vc-subtotal"></strong></div>
          <div style="display:flex; gap:8px; margin-top:8px;">
            <button class="vc-checkout-all">Checkout All (opens PayPal)</button>
            <button class="vc-clear-cart">Clear</button>
          </div>
        </div>
      </aside>
    `;
    qs('.vc-cart-drawer__close',drawerEl).addEventListener('click', ()=> toggleCartDrawer(false));
    qs('.vc-cart-drawer__backdrop',drawerEl).addEventListener('click', ()=> toggleCartDrawer(false));
    qs('.vc-clear-cart',drawerEl).addEventListener('click', ()=> {
      if(confirm('Clear cart?')) { localStorage.removeItem(CART_KEY); renderCartItems(); updateHeaderCounts(); }
    });
    qs('.vc-checkout-all',drawerEl).addEventListener('click', checkoutAll);
    renderCartItems();
  }

  function toggleCartDrawer(open){
    createCartDrawer();
    drawerEl.classList.toggle('vc-open', !!open);
    renderCartItems();
  }

  function renderCartItems(){
    createCartDrawer();
    const container = qs('.vc-cart-items',drawerEl);
    container.innerHTML = '';

    const cart = loadCart();
    const ids = Object.keys(cart);
    if(ids.length === 0){
      container.innerHTML = `<p class="vc-empty">Cart is empty — add something lovely 💚</p>`;
      qs('.vc-subtotal',drawerEl).textContent = money(0);
      updateHeaderCounts();
      return;
    }

    let total = 0;

    ids.forEach(id=>{
      const item = cart[id];
      const prod = catalogue[id] || item;
      const price = Number(item.price || prod.price || 0);
      const qty = item.qty || 1;
      total += price * qty;

      const row = $('div',{class:'vc-cart-row'}, container);
      row.innerHTML = `
        <div class="vc-cart-row__left">
          <img src="${(prod.images && prod.images[0]) ? encodeURI(prod.images[0]) : ''}" alt="" onerror="this.style.display='none'">
        </div>
        <div class="vc-cart-row__mid">
          <a href="/product.html?id=${id}" class="vc-cart-row__title">${prod.name || item.name}</a>
          <div class="vc-cart-row__price">${money(price)} × <span class="vc-qty">${qty}</span></div>
        </div>
        <div class="vc-cart-row__actions">
          <button class="vc-dec">−</button>
          <button class="vc-inc">+</button>
          <button class="vc-remove">Remove</button>
          <div><button class="vc-checkout-item">Checkout</button></div>
        </div>
      `;

      qs('.vc-inc',row).addEventListener('click', ()=> {
        cart[id].qty = (cart[id].qty || 1) + 1; saveCart(cart); renderCartItems(); updateHeaderCounts();
      });
      qs('.vc-dec',row).addEventListener('click', ()=> {
        cart[id].qty = Math.max(1,(cart[id].qty || 1)-1); saveCart(cart); renderCartItems(); updateHeaderCounts();
      });
      qs('.vc-remove',row).addEventListener('click', ()=> {
        delete cart[id]; saveCart(cart); renderCartItems(); updateHeaderCounts();
      });
      qs('.vc-checkout-item',row).addEventListener('click', ()=> {
        const link = (prod.paymentLink || item.paymentLink);
        if(link) window.open(link, '_blank');
      });
    });

    qs('.vc-subtotal',drawerEl).textContent = money(total);
    updateHeaderCounts();
  }

  function checkoutAll(){
    const cart = loadCart();
    const ids = Object.keys(cart);
    if(ids.length === 0) return alert('Cart empty');

    ids.forEach(id=>{
      const prod = catalogue[id] || cart[id];
      if(prod && prod.paymentLink){
        window.open(prod.paymentLink, '_blank');
      }
    });
  }

  /* ---------- Add / Wish ---------- */
  function addToCart(productId, productObj, qty=1){
    const cart = loadCart();
    if(!cart[productId]){
      cart[productId] = { id: productId, name: productObj.name || productId, price: productObj.price || 0, paymentLink: productObj.paymentLink || '' , qty:0};
    }
    cart[productId].qty = (cart[productId].qty || 0) + qty;
    saveCart(cart);
    renderCartItems();
    updateHeaderCounts();
  }

  function toggleWishlist(productId){
    const w = loadWish();
    const i = w.indexOf(productId);
    if(i === -1) { w.push(productId); saveWish(w); return true; }
    w.splice(i,1); saveWish(w); return false;
  }

  /* ---------- Insert buttons ---------- */
  function insertButtonsOnProductPage(productId, productObj){
    const selectors = ['.product-actions', '.product-details', '.product-meta', '#product-info', '.product-card', 'main', 'body'];
    let container = selectors.map(s=>qs(s)).find(x=>x!==null);
    if(!container) container = document.body;

    if(container.querySelector('.vc-product-controls')) return;

    const controls = $('div',{class:'vc-product-controls'}, container);
    controls.innerHTML = `
      <button class="vc-ialoveit small">❤ I love it</button>
      <button class="vc-addcart small">Add to cart</button>
      <div class="vc-product-price">Price: <strong>${money(productObj.price)}</strong></div>
    `;

    qs('.vc-addcart',controls).addEventListener('click', ()=> {
      addToCart(productId, productObj, 1);
      qs('.vc-addcart',controls).textContent = 'Added ✓';
      setTimeout(()=> qs('.vc-addcart',controls).textContent = 'Add to cart', 1000);
    });

    qs('.vc-ialoveit',controls).addEventListener('click', ()=> {
      const now = toggleWishlist(productId);
      qs('.vc-ialoveit',controls).textContent = now? '❤ Saved' : '❤ I love it';
      updateHeaderCounts();
    });
  }

  function insertButtonsOnCatalogue(){
    const anchors = Array.from(document.querySelectorAll('a[href*="product.html"]'));
    anchors.forEach(a=>{
      try {
        const url = new URL(a.href, location.href);
        const pid = url.searchParams.get('id');
        if(!pid) return;

        const card = a.closest('.product-card, .card, .product, article, li, div.item, div.product-card') || a.parentElement;

        if(card && card.querySelector('.vc-mini-controls')) return;

        const cont = card || a;

        const btnWrap = $('div',{class:'vc-mini-controls'}, cont);
        btnWrap.style.marginTop = '6px';

        const heart = $('button',{class:'vc-mini-love','data-id':pid}, btnWrap);
        heart.textContent = '❤';

        heart.addEventListener('click', (e)=>{
          e.stopPropagation();
          const now = toggleWishlist(pid);
          heart.textContent = now? '❤' : '♡';
          updateHeaderCounts();
        });

        const add = $('button',{class:'vc-mini-add','data-id':pid}, btnWrap);
        add.textContent = 'Add';

        add.addEventListener('click', (e)=>{
          e.stopPropagation();
          const prod = catalogue[pid] || { name: a.textContent.trim(), price: 0, paymentLink: '' };
          addToCart(pid, prod, 1);
          add.textContent = '✓';
          setTimeout(()=> add.textContent = 'Add', 900);
        });

      } catch(e){}
    });
  }

  /* ---------- Wishlist page ---------- */
  function createWishlistPage(){
    if(!location.pathname.endsWith('/wishlist.html') && !location.pathname.endsWith('wishlist.html')) return;

    (async ()=>{
      await ensureCataloguesLoaded();

      const w = loadWish();
      const container = $('div',{class:'vc-wishlist-root'}, document.body);
      container.innerHTML = `<h2>Your wishlist</h2><div class="vc-wishlist-items"></div>`;

      const list = qs('.vc-wishlist-items',container);

      if(w.length === 0) {
        list.innerHTML = `<p>No saved items yet.</p>`;
        return;
      }

      w.forEach(id=>{
        const prod = catalogue[id] || { name: id, images: [], price: 0, paymentLink: ''};

        const card = $('div',{class:'vc-wish-card'}, list);

        card.innerHTML = `
          <div class="vc-wish-card__img"><img src="${(prod.images && prod.images[0])? encodeURI(prod.images[0]) : ''}" onerror="this.style.display='none'"></div>
          <div class="vc-wish-card__body">
            <a href="/product.html?id=${id}" class="vc-wish-title">${prod.name}</a>
            <div class="vc-wish-price">${money(prod.price)}</div>
            <div style="margin-top:8px">
              <button data-id="${id}" class="vc-wish-add">Add to cart</button>
              <button data-id="${id}" class="vc-wish-remove">Remove</button>
            </div>
          </div>
        `;

        qs('.vc-wish-add',card).addEventListener('click', ()=> {
          addToCart(id, prod, 1);
          alert('Added to cart');
        });

        qs('.vc-wish-remove',card).addEventListener('click', ()=> {
          const arr = loadWish().filter(x=>x!==id);
          saveWish(arr);
          card.remove();
          updateHeaderCounts();
        });
      });
    })();
  }

  /* ---------- boot ---------- */
  function getProductIdFromUrl(){
    try{
      const url = new URL(location.href);
      return url.searchParams.get('id'); 
    }catch(e){ return null; }
  }

  let catalogLoaded = false;
  async function ensureCataloguesLoaded(){
    if(catalogLoaded) return;
    await loadCatalogues();
    catalogLoaded = true;
  }

  async function boot(){
    await ensureCataloguesLoaded();
    injectHeaderUI();
    createCartDrawer();

    insertButtonsOnCatalogue();

    const pid = getProductIdFromUrl();
    if(pid){
      const prod = catalogue[pid] || { id: pid, name: pid, price: 0, images: [], paymentLink: ''};
      insertButtonsOnProductPage(pid, prod);
    }

    qsa('[data-product-id]').forEach(el=>{
      const id = el.getAttribute('data-product-id');
      if(!id) return;

      if(el.querySelector('.vc-mini-controls')) return;

      const ctrl = $('div',{class:'vc-mini-controls'}, el);
      const heart = $('button',{class:'vc-mini-love','data-id':id}, ctrl);
      heart.textContent = '❤';

      heart.addEventListener('click', ()=> {
        const now = toggleWishlist(id);
        heart.textContent = now? '❤':'♡';
        updateHeaderCounts();
      });

      const add = $('button',{class:'vc-mini-add','data-id':id}, ctrl);
      add.textContent = 'Add';
      add.addEventListener('click', ()=> {
        addToCart(id, catalogue[id]||{},1);
        add.textContent='✓';
        setTimeout(()=>add.textContent='Add',800);
      });
    });

    createWishlistPage();
    updateHeaderCounts();
  }

  /* ---------- ⭐⭐⭐ ADDED: re-run insertion after catalogue is rendered ⭐⭐⭐ */
  document.addEventListener("catalogueRendered", () => {
    console.log("Catalogue rendered — reinserting wishlist/cart buttons…");
    insertButtonsOnCatalogue();
    updateHeaderCounts();
  });

  /* ---------- run ---------- */
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  /* ---------- CSS fallback ---------- */
})();

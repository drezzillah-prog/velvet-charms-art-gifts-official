(function () {
  "use strict";

  const CATALOGUE_FILE = "catalogue-art-gifts.json";
  const ROMANIAN_PRICING_FILE = "pricing-ro.json";
  const HIDDEN_BUNDLE_IDS = new Set(["relax_restore", "cozy_winter", "home_harmony"]);
  const CHECKOUT_BLOCKED_IDS = new Set(["epoxy_lamp", "wall_clock_large"]);

  function applyRomanianPricing(data, pricing) {
    const apply = product => {
      const ron = Number(pricing?.[product.id]);
      if (!Number.isFinite(ron)) return;
      product.price_ro = ron;
      product.price_ro_eur = Number((ron / 5).toFixed(2));
    };
    (data.categories || []).forEach(category => {
      (category.products || []).forEach(apply);
      (category.subcategories || []).forEach(subcategory => (subcategory.products || []).forEach(apply));
    });
    return data;
  }

  function normalizeCustomerFacingCopy(data) {
    const normalizeProduct = product => { if (product?.name === "Decorptive Hair Combs") product.name = "Decorative Hair Combs"; };
    (data.categories || []).forEach(category => {
      (category.products || []).forEach(normalizeProduct);
      (category.subcategories || []).forEach(subcategory => (subcategory.products || []).forEach(normalizeProduct));
    });
    return data;
  }

  function prepareEuStorefront(data) {
    const prepare = product => {
      if (HIDDEN_BUNDLE_IDS.has(product.id)) product.__storefront_hidden = true;
      if (CHECKOUT_BLOCKED_IDS.has(product.id)) product.__checkout_blocked = true;
    };
    (data.categories || []).forEach(category => {
      (category.products || []).forEach(prepare);
      (category.subcategories || []).forEach(subcategory => (subcategory.products || []).forEach(prepare));
    });
    return data;
  }

  async function loadCatalogue() {
    const [catalogueResponse, pricingResponse] = await Promise.all([fetch(CATALOGUE_FILE, { cache: "no-store" }), fetch(ROMANIAN_PRICING_FILE, { cache: "no-store" })]);
    if (!catalogueResponse.ok) throw new Error("Failed to load catalogue");
    const data = prepareEuStorefront(normalizeCustomerFacingCopy(await catalogueResponse.json()));
    if (pricingResponse.ok) { try { applyRomanianPricing(data, await pricingResponse.json()); } catch (error) { console.warn("Romanian pricing map could not be applied:", error); } }
    return data;
  }

  function escapeHtml(value) { return String(value || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
  function buildGallery(product) {
    let gallery = "";
    if (product.images && product.images.length) {
      gallery += `<img src="${escapeHtml(product.images[0])}" class="main-img" alt="${escapeHtml(product.name)}" loading="lazy" decoding="async">`;
      if (product.images.length > 1) { gallery += '<div class="thumbs">'; product.images.slice(1).forEach(img => { gallery += `<img src="${escapeHtml(img)}" alt="${escapeHtml(product.name)} example" loading="lazy" decoding="async">`; }); gallery += "</div>"; }
    }
    return gallery;
  }
  function visibleProducts(products) { return (products || []).filter(product => !product.__storefront_hidden); }
  function categoryHasVisibleProducts(category) { return visibleProducts(category.products).length > 0 || (category.subcategories || []).some(sub => visibleProducts(sub.products).length); }
  function buildCatalogueNav(categories) {
    const nav = document.getElementById("catalogue-nav"); if (!nav) return;
    nav.innerHTML = `<div class="catalogue-nav-inner">${categories.filter(categoryHasVisibleProducts).map(category => `<a href="#${escapeHtml(category.id)}">${escapeHtml(category.name)}</a>`).join("")}</div>`;
  }
  function approximateMakingTime(categoryName, subcategoryName) {
    if (categoryName === "Paintings & Portraits") return subcategoryName === "Portraits" || subcategoryName === "Festive Portraits" ? "10–20 business days" : "7–14 business days";
    if (categoryName === "Hair Accessories") return "3–7 business days";
    if (categoryName === "Epoxy & Clay Creations") return subcategoryName === "Epoxy Lamp" || subcategoryName === "Phone Cases" ? "10–20 business days" : "5–10 business days";
    if (categoryName === "Leather Bags") return "15–30 business days";
    if (categoryName === "Wall Clock") return "10–20 business days";
    if (categoryName === "Bundles") return "7–14 business days";
    if (categoryName === "Knitted & Braided Wool Creations") return ["Hand-Knitted Scarves", "Matching Winter Set", "Felted Animals", "Pet Wear"].includes(subcategoryName) ? "7–14 business days" : "5–10 business days";
    return "Confirmed with your production slot";
  }
  function productCard(product, categoryName, subcategoryName = "") {
    const blocked = Boolean(product.__checkout_blocked);
    return `<div class="product-card" data-product-id="${escapeHtml(product.id)}">${buildGallery(product)}<h4>${escapeHtml(product.name)}</h4><p>${escapeHtml(product.description || "")}</p><p class="product-making-time"><strong>Approximate making time:</strong> ${escapeHtml(approximateMakingTime(categoryName, subcategoryName))}</p><div class="price" data-eur-price="${Number(product.price)}"${Number.isFinite(Number(product.price_ro)) ? ` data-ro-price="${Number(product.price_ro)}"` : ""}>${window.VELVET_CURRENCY ? window.VELVET_CURRENCY.displayMoney(product.price, product.price_ro) : new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR" }).format(Number(product.price))}</div>${blocked ? '<p class="category-notice">Temporarily unavailable for checkout while product conformity is reviewed.</p>' : ""}<div class="product-actions">${blocked ? '<button class="buy-btn add-cart-btn" type="button" disabled aria-disabled="true">Checkout unavailable</button>' : `<button class="buy-btn add-cart-btn" type="button" data-add-to-cart="${escapeHtml(product.id)}">Add to cart</button>`}<button class="btn small customization-btn" type="button" data-customize-product="${escapeHtml(product.id)}">Request customization</button></div></div>`;
  }
  function renderCatalogue(data) {
    const root = document.getElementById("catalogue-root"); if (!root) return;
    window.VELVET_CATALOGUE = data; buildCatalogueNav(data.categories || []); let html = "";
    (data.categories || []).filter(categoryHasVisibleProducts).forEach(category => {
      html += `<section class="catalogue-category" id="${escapeHtml(category.id)}"><h2>${escapeHtml(category.name)}</h2>`;
      if (category.notice) html += `<p class="category-notice">${escapeHtml(category.notice)}</p>`;
      if (Array.isArray(category.subcategories)) category.subcategories.forEach(sub => { const products = visibleProducts(sub.products); if (!products.length) return; html += `<h3 class="catalogue-sub">${escapeHtml(sub.name)}</h3><div class="catalogue-grid">`; products.forEach(product => { html += productCard(product, category.name, sub.name); }); html += "</div>"; });
      const products = visibleProducts(category.products); if (products.length) { html += '<div class="catalogue-grid">'; products.forEach(product => { html += productCard(product, category.name); }); html += "</div>"; }
      html += "</section>";
    });
    root.innerHTML = html; root.classList.remove("loading"); document.dispatchEvent(new CustomEvent("velvet:catalogue-rendered"));
  }
  document.addEventListener("DOMContentLoaded", async () => { try { renderCatalogue(await loadCatalogue()); } catch (err) { console.error(err); const root = document.getElementById("catalogue-root"); if (root) { root.classList.remove("loading"); root.innerHTML = '<p class="catalogue-error">The catalogue could not be loaded. Please refresh the page.</p>'; } } });
  document.addEventListener("click", function (event) {
    if (event.target.matches(".thumbs img")) { const clicked = event.target, card = clicked.closest(".product-card"); if (!card) return; const main = card.querySelector(".main-img"); if (main) { main.src = clicked.src; main.alt = clicked.alt || main.alt; } }
    if (event.target.classList && event.target.classList.contains("main-img")) openLightbox(event.target.src, event.target.alt);
  });
  function openLightbox(src, alt) {
    let lightbox = document.querySelector(".lightbox");
    if (!lightbox) { lightbox = document.createElement("div"); lightbox.className = "lightbox hidden"; lightbox.innerHTML = '<img src="" alt=""><button class="lightbox-close" type="button" aria-label="Close image">×</button>'; document.body.appendChild(lightbox); lightbox.addEventListener("click", event => { if (event.target === lightbox || event.target.matches(".lightbox-close")) lightbox.classList.add("hidden"); }); }
    const image = lightbox.querySelector("img"); if (image) { image.src = src; image.alt = alt || "Product image"; } lightbox.classList.remove("hidden");
  }
})();
/* features.js — Velvet Charms Art & Gifts
   Full multi-item cart + safe PayPal handoff.
   Existing Buy and Request customization links remain available.
*/
(function () {
  "use strict";

  const CART_KEY = "velvet_cart_art_gifts";

  function emptyCart() {
    return { items: [], requiredByDate: "" };
  }

  function loadCart() {
    try {
      const stored = JSON.parse(localStorage.getItem(CART_KEY));
      if (!stored || !Array.isArray(stored.items)) return emptyCart();
      return {
        requiredByDate: /^\d{4}-\d{2}-\d{2}$/.test(String(stored.requiredByDate || ""))
          ? String(stored.requiredByDate)
          : "",
        items: stored.items
          .filter(item => item && typeof item.id === "string")
          .map(item => ({
            id: item.id,
            name: String(item.name || ""),
            price: Number(item.price) || 0,
            qty: Math.max(1, Math.min(99, Number.parseInt(item.qty, 10) || 1))
          }))
      };
    } catch {
      return emptyCart();
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
  }

  function allProducts() {
    const categories = window.VELVET_CATALOGUE?.categories || [];
    const products = [];

    categories.forEach(category => {
      if (Array.isArray(category.products)) products.push(...category.products);
      (category.subcategories || []).forEach(subcategory => {
        if (Array.isArray(subcategory.products)) products.push(...subcategory.products);
      });
    });

    return products;
  }

  function findProduct(id) {
    return allProducts().find(product => product.id === id);
  }

  function euro(value) {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "EUR"
    }).format(Number(value) || 0);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function addToCart(product, qty = 1) {
    if (!product || !product.id || !Number.isFinite(Number(product.price))) return;

    const cart = loadCart();
    const existing = cart.items.find(item => item.id === product.id);

    if (existing) {
      existing.qty = Math.min(99, existing.qty + qty);
      existing.name = product.name;
      existing.price = Number(product.price);
    } else {
      cart.items.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        qty: Math.max(1, qty)
      });
    }

    saveCart(cart);
    openCart();
  }

  function syncPrices(cart) {
    let changed = false;

    cart.items.forEach(item => {
      const product = findProduct(item.id);
      if (!product) return;
      const currentPrice = Number(product.price);
      if (item.price !== currentPrice || item.name !== product.name) {
        item.price = currentPrice;
        item.name = product.name;
        changed = true;
      }
    });

    if (changed) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function totals(cart) {
    return {
      count: cart.items.reduce((sum, item) => sum + item.qty, 0),
      subtotal: cart.items.reduce((sum, item) => sum + item.price * item.qty, 0)
    };
  }

  function createCartUI() {
    if (document.querySelector("[data-cart-drawer]")) return;

    document.body.insertAdjacentHTML("beforeend", `
      <button class="cart-launcher" type="button" data-cart-open aria-label="Open shopping cart">
        Cart <span data-cart-count>0</span>
      </button>
      <div class="cart-backdrop" data-cart-backdrop></div>
      <aside class="cart-drawer" data-cart-drawer aria-hidden="true" aria-label="Shopping cart">
        <div class="cart-header">
          <h2>Your cart</h2>
          <button class="cart-close" type="button" data-cart-close aria-label="Close shopping cart">×</button>
        </div>
        <div class="cart-items" data-cart-items></div>
        <div class="cart-summary">
          <div class="cart-summary-row"><span>Subtotal</span><strong data-cart-subtotal>€0.00</strong></div>
          <div class="cart-summary-row cart-total"><span>Total</span><strong data-cart-total>€0.00</strong></div>
          <label class="cart-needed-date">
            <span>Do you need it by a specific date? <small>(optional)</small></span>
            <input type="date" data-required-by-date>
            <small>Your preferred date is confirmed only after we review the creation and current production schedule.</small>
          </label>
          <p class="cart-production-note">Payment reserves your place in our handmade production schedule. We will confirm the estimated production and dispatch window after reviewing your order.</p>
          <p class="cart-shipping-note">Shipping is handled separately according to destination, parcel size and weight.</p>
          <button class="cart-checkout" type="button" data-checkout-all>Checkout securely with PayPal</button>
          <p class="cart-status" data-cart-status aria-live="polite"></p>
        </div>
      </aside>
    `);

    renderCart();
  }

  function renderCart() {
    const root = document.querySelector("[data-cart-items]");
    if (!root) return;

    const cart = loadCart();
    syncPrices(cart);
    const summary = totals(cart);

    document.querySelectorAll("[data-cart-count]").forEach(node => {
      node.textContent = summary.count;
    });

    const subtotal = document.querySelector("[data-cart-subtotal]");
    const total = document.querySelector("[data-cart-total]");
    if (subtotal) subtotal.textContent = euro(summary.subtotal);
    if (total) total.textContent = euro(summary.subtotal);

    const dateInput = document.querySelector("[data-required-by-date]");
    if (dateInput) {
      dateInput.value = cart.requiredByDate || "";
      dateInput.min = new Date().toISOString().slice(0, 10);
    }

    const checkout = document.querySelector("[data-checkout-all]");
    if (checkout) checkout.disabled = cart.items.length === 0;

    if (!cart.items.length) {
      root.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
      return;
    }

    root.innerHTML = cart.items.map((item, index) => `
      <div class="cart-item">
        <div class="cart-item-details">
          <p class="cart-item-name">${escapeHtml(item.name)}</p>
          <p class="cart-item-price">${euro(item.price)} each</p>
          <div class="cart-quantity">
            <button type="button" data-cart-decrease="${index}" aria-label="Decrease quantity">−</button>
            <strong>${item.qty}</strong>
            <button type="button" data-cart-increase="${index}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="cart-item-side">
          <strong>${euro(item.price * item.qty)}</strong>
          <button class="cart-remove" type="button" data-cart-remove="${index}">Remove</button>
        </div>
      </div>
    `).join("");
  }

  function openCart() {
    document.querySelector("[data-cart-drawer]")?.classList.add("is-open");
    document.querySelector("[data-cart-backdrop]")?.classList.add("is-open");
    document.querySelector("[data-cart-drawer]")?.setAttribute("aria-hidden", "false");
  }

  function closeCart() {
    document.querySelector("[data-cart-drawer]")?.classList.remove("is-open");
    document.querySelector("[data-cart-backdrop]")?.classList.remove("is-open");
    document.querySelector("[data-cart-drawer]")?.setAttribute("aria-hidden", "true");
  }

  async function checkoutAll() {
    const cart = loadCart();
    if (!cart.items.length) return;

    const status = document.querySelector("[data-cart-status]");
    const button = document.querySelector("[data-checkout-all]");
    if (status) status.textContent = "Preparing secure checkout…";
    if (button) button.disabled = true;

    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart })
      });
      const data = await response.json();

      if (!response.ok || !data.approveUrl || !data.orderID) {
        throw new Error(data.error || "Checkout could not be started.");
      }

      sessionStorage.setItem("velvet_art_pending_order", data.orderID);
      window.location.href = data.approveUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      if (status) status.textContent = error.message || "Checkout could not be started.";
      if (button) button.disabled = false;
    }
  }

  async function captureReturnedPayment() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") !== "success") return;

    const orderID = params.get("token") || sessionStorage.getItem("velvet_art_pending_order");
    const cart = loadCart();
    if (!orderID || !cart.items.length) return;

    createCartUI();
    openCart();
    const status = document.querySelector("[data-cart-status]");
    if (status) status.textContent = "Confirming your PayPal payment…";

    try {
      const response = await fetch("/api/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID, cart })
      });
      const data = await response.json();
      if (!response.ok || data.status !== "COMPLETED") {
        throw new Error(data.error || "Payment could not be confirmed.");
      }

      localStorage.removeItem(CART_KEY);
      sessionStorage.removeItem("velvet_art_pending_order");
      renderCart();
      if (status) status.textContent = "Payment confirmed. Thank you — we will review your handmade order and contact you with the production window.";
      window.history.replaceState({}, "", window.location.pathname);
    } catch (error) {
      console.error("Capture error:", error);
      if (status) status.textContent = error.message || "Payment could not be confirmed. Please contact us before trying again.";
    }
  }

  document.addEventListener("click", event => {
    const addButton = event.target.closest("[data-add-to-cart]");
    if (addButton) {
      const product = findProduct(addButton.dataset.addToCart);
      if (product) addToCart(product, 1);
      return;
    }

    if (event.target.closest("[data-cart-open]")) openCart();
    if (event.target.closest("[data-cart-close]") || event.target.matches("[data-cart-backdrop]")) closeCart();

    const increase = event.target.closest("[data-cart-increase]");
    const decrease = event.target.closest("[data-cart-decrease]");
    const remove = event.target.closest("[data-cart-remove]");

    if (increase || decrease || remove) {
      const cart = loadCart();
      const index = Number((increase || decrease || remove).dataset.cartIncrease ?? (increase || decrease || remove).dataset.cartDecrease ?? (increase || decrease || remove).dataset.cartRemove);
      if (!Number.isInteger(index) || !cart.items[index]) return;

      if (increase) cart.items[index].qty = Math.min(99, cart.items[index].qty + 1);
      if (decrease) {
        cart.items[index].qty -= 1;
        if (cart.items[index].qty <= 0) cart.items.splice(index, 1);
      }
      if (remove) cart.items.splice(index, 1);
      saveCart(cart);
    }

    if (event.target.closest("[data-checkout-all]")) checkoutAll();
  });

  document.addEventListener("change", event => {
    if (!event.target.matches("[data-required-by-date]")) return;
    const cart = loadCart();
    cart.requiredByDate = event.target.value || "";
    saveCart(cart);
  });

  document.addEventListener("velvet:catalogue-rendered", renderCart);

  document.addEventListener("DOMContentLoaded", () => {
    createCartUI();
    captureReturnedPayment();
  });
})();

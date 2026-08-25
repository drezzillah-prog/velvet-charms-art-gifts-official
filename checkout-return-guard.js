/* checkout-return-guard.js — clear PayPal return states without losing a safe retry */
(() => {
  "use strict";
  const CART_KEY = "velvet_cart_art_gifts";
  const PENDING_KEY = "velvet_art_pending_order";

  document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const paymentState = params.get("payment");

    if (paymentState === "cancelled") {
      sessionStorage.removeItem(PENDING_KEY);
      setTimeout(() => {
        const status = document.querySelector("[data-cart-status]");
        if (status) status.textContent = "PayPal checkout was cancelled. Your cart is still here so you can review it or try again.";
      }, 0);
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (paymentState !== "success") return;
    const orderID = params.get("token") || sessionStorage.getItem(PENDING_KEY);
    const hasCart = Boolean(localStorage.getItem(CART_KEY));
    if (orderID && hasCart) return;

    setTimeout(() => {
      const status = document.querySelector("[data-cart-status]");
      if (status) {
        status.textContent = "PayPal returned without enough local order information to confirm the payment safely. Please do not place a second order; contact us so we can verify it first.";
      }
    }, 0);
  });
})();

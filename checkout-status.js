/* checkout-status.js — clear PayPal return states for Art & Gifts */
(function () {
  "use strict";

  function showMessage(message, type) {
    const host = document.querySelector(".catalogue-hero");
    if (!host || !message) return;

    let banner = document.querySelector("[data-payment-status-banner]");
    if (!banner) {
      banner = document.createElement("div");
      banner.setAttribute("data-payment-status-banner", "");
      banner.className = "payment-status-banner";
      host.insertAdjacentElement("afterend", banner);
    }

    banner.classList.remove("is-success", "is-cancelled");
    banner.classList.add(type === "success" ? "is-success" : "is-cancelled");
    banner.textContent = message;
  }

  document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");

    if (payment === "cancelled") {
      showMessage(
        document.documentElement.lang === "ro"
          ? "Plata a fost anulată. Coșul tău a fost păstrat și poți reveni la comandă oricând."
          : "Payment was cancelled. Your cart has been kept and you can return to your order whenever you are ready.",
        "cancelled"
      );

      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("payment");
      window.history.replaceState({}, "", cleanUrl.pathname + cleanUrl.search + cleanUrl.hash);
    }
  });
})();

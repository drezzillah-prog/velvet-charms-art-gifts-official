/* checkout-return-guard.js — clear PayPal return states without losing a safe retry */
(() => {
  "use strict";
  const CART_KEY = "velvet_cart_art_gifts";
  const PENDING_KEY = "velvet_art_pending_order";
  const copy = {
    en: {
      cancelled: "PayPal checkout was cancelled. Your cart is still here so you can review it or try again.",
      missing: "PayPal returned without enough local order information to confirm the payment safely. Please do not place a second order; contact us so we can verify it first."
    },
    ro: {
      cancelled: "Plata prin PayPal a fost anulată. Coșul tău este păstrat pentru a-l putea verifica sau pentru a încerca din nou.",
      missing: "PayPal a revenit fără suficiente informații locale despre comandă pentru a confirma plata în siguranță. Te rugăm să nu plasezi o a doua comandă; contactează-ne pentru a o verifica mai întâi."
    },
    fr: {
      cancelled: "Le paiement PayPal a été annulé. Votre panier est toujours disponible afin que vous puissiez le vérifier ou réessayer.",
      missing: "PayPal est revenu sans suffisamment d’informations locales sur la commande pour confirmer le paiement en toute sécurité. Veuillez ne pas passer une deuxième commande ; contactez-nous afin que nous puissions d’abord la vérifier."
    },
    it: {
      cancelled: "Il pagamento PayPal è stato annullato. Il carrello è ancora disponibile per consentirti di controllarlo o riprovare.",
      missing: "PayPal è tornato senza informazioni locali sufficienti sull’ordine per confermare il pagamento in sicurezza. Non effettuare un secondo ordine; contattaci per consentirci di verificarlo prima."
    },
    de: {
      cancelled: "Der PayPal-Bezahlvorgang wurde abgebrochen. Ihr Warenkorb bleibt erhalten, damit Sie ihn prüfen oder es erneut versuchen können.",
      missing: "PayPal ist ohne ausreichende lokale Bestellinformationen zurückgekehrt, um die Zahlung sicher zu bestätigen. Bitte geben Sie keine zweite Bestellung auf; kontaktieren Sie uns, damit wir sie zuerst prüfen können."
    }
  };
  function language() {
    const value = (window.VELVET_GET_LANGUAGE?.() || document.documentElement.lang || localStorage.getItem("velvet_language_art_gifts") || "en").slice(0, 2).toLowerCase();
    return copy[value] ? value : "en";
  }

  document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const paymentState = params.get("payment");
    const c = copy[language()];

    if (paymentState === "cancelled") {
      sessionStorage.removeItem(PENDING_KEY);
      setTimeout(() => {
        const status = document.querySelector("[data-cart-status]");
        if (status && status.textContent !== c.cancelled) status.textContent = c.cancelled;
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
      if (status && status.textContent !== c.missing) status.textContent = c.missing;
    }, 0);
  });
})();

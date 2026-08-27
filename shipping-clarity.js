(() => {
  'use strict';
  const copy = {
    en: {
      total: 'Product total',
      shipping: 'Shipping is not included in the product total. After we review the destination, parcel size and weight, we confirm the shipping cost separately. No shipping charge is taken without your approval.',
      uploadFailed: 'Photo upload failed. Please try again.',
      tooManyPhotos: 'Please choose no more than 5 reference photos.',
      uploadProgress: (current, total, percent) => `Uploading photo ${current} of ${total}: ${percent}%`,
      preparingCheckout: 'Preparing secure checkout…',
      checkoutError: 'Checkout could not be started. Please try again or contact us.',
      confirmingPayment: 'Confirming your PayPal payment…',
      paymentFailed: 'Payment could not be confirmed. Please contact us before trying again.',
      paymentConfirmed: 'Payment confirmed. Thank you — we will review your handmade order and contact you with the production window.'
    },
    ro: {
      total: 'Total produse',
      shipping: 'Transportul nu este inclus în totalul produselor. După ce verificăm destinația, dimensiunea și greutatea coletului, îți comunicăm separat costul transportului. Nu se percepe nicio taxă de transport fără acordul tău.',
      uploadFailed: 'Încărcarea fotografiei a eșuat. Te rugăm să încerci din nou.',
      tooManyPhotos: 'Te rugăm să alegi maximum 5 fotografii de referință.',
      uploadProgress: (current, total, percent) => `Se încarcă fotografia ${current} din ${total}: ${percent}%`,
      preparingCheckout: 'Se pregătește plata securizată…',
      checkoutError: 'Plata nu a putut fi inițiată. Te rugăm să încerci din nou sau să ne contactezi.',
      confirmingPayment: 'Se confirmă plata prin PayPal…',
      paymentFailed: 'Plata nu a putut fi confirmată. Te rugăm să ne contactezi înainte de a încerca din nou.',
      paymentConfirmed: 'Plata a fost confirmată. Îți mulțumim — vom verifica comanda handmade și te vom contacta cu intervalul de producție.'
    },
    fr: {
      total: 'Total des produits',
      shipping: 'La livraison n’est pas incluse dans le total des produits. Après vérification de la destination, des dimensions et du poids du colis, nous vous confirmons séparément les frais de livraison. Aucun frais de livraison n’est prélevé sans votre accord.',
      uploadFailed: 'Le téléchargement de la photo a échoué. Veuillez réessayer.',
      tooManyPhotos: 'Veuillez sélectionner au maximum 5 photos de référence.',
      uploadProgress: (current, total, percent) => `Téléchargement de la photo ${current} sur ${total} : ${percent} %`,
      preparingCheckout: 'Préparation du paiement sécurisé…',
      checkoutError: 'Le paiement n’a pas pu être démarré. Veuillez réessayer ou nous contacter.',
      confirmingPayment: 'Confirmation de votre paiement PayPal…',
      paymentFailed: 'Le paiement n’a pas pu être confirmé. Veuillez nous contacter avant de réessayer.',
      paymentConfirmed: 'Paiement confirmé. Merci — nous allons examiner votre commande artisanale et vous contacter avec le délai de production.'
    },
    it: {
      total: 'Totale prodotti',
      shipping: 'La spedizione non è inclusa nel totale dei prodotti. Dopo aver verificato destinazione, dimensioni e peso del pacco, ti comunichiamo separatamente il costo della spedizione. Nessun costo di spedizione viene addebitato senza la tua approvazione.',
      uploadFailed: 'Il caricamento della foto non è riuscito. Riprova.',
      tooManyPhotos: 'Seleziona al massimo 5 foto di riferimento.',
      uploadProgress: (current, total, percent) => `Caricamento foto ${current} di ${total}: ${percent}%`,
      preparingCheckout: 'Preparazione del pagamento sicuro…',
      checkoutError: 'Non è stato possibile avviare il pagamento. Riprova o contattaci.',
      confirmingPayment: 'Conferma del pagamento PayPal…',
      paymentFailed: 'Non è stato possibile confermare il pagamento. Contattaci prima di riprovare.',
      paymentConfirmed: 'Pagamento confermato. Grazie — esamineremo il tuo ordine artigianale e ti contatteremo con i tempi di produzione.'
    },
    de: {
      total: 'Produktgesamtbetrag',
      shipping: 'Die Versandkosten sind nicht im Produktgesamtbetrag enthalten. Nach Prüfung von Zielort, Paketgröße und Gewicht bestätigen wir die Versandkosten separat. Versandkosten werden nur mit Ihrer Zustimmung berechnet.',
      uploadFailed: 'Das Hochladen des Fotos ist fehlgeschlagen. Bitte versuchen Sie es erneut.',
      tooManyPhotos: 'Bitte wählen Sie höchstens 5 Referenzfotos aus.',
      uploadProgress: (current, total, percent) => `Foto ${current} von ${total} wird hochgeladen: ${percent}%`,
      preparingCheckout: 'Sichere Zahlung wird vorbereitet…',
      checkoutError: 'Der Bezahlvorgang konnte nicht gestartet werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.',
      confirmingPayment: 'Ihre PayPal-Zahlung wird bestätigt…',
      paymentFailed: 'Die Zahlung konnte nicht bestätigt werden. Bitte kontaktieren Sie uns, bevor Sie es erneut versuchen.',
      paymentConfirmed: 'Zahlung bestätigt. Vielen Dank — wir prüfen Ihre handgefertigte Bestellung und melden uns mit dem Produktionszeitraum.'
    }
  };
  const language = () => {
    const value = (window.VELVET_GET_LANGUAGE?.() || document.documentElement.lang || localStorage.getItem('velvet_language_art_gifts') || 'en').slice(0, 2).toLowerCase();
    return copy[value] ? value : 'en';
  };
  const staticKeys = ['uploadFailed', 'tooManyPhotos', 'preparingCheckout', 'checkoutError', 'confirmingPayment', 'paymentFailed', 'paymentConfirmed'];
  function translatedKey(text) {
    for (const lang of Object.keys(copy)) {
      for (const key of staticKeys) {
        if (copy[lang][key] === text) return key;
      }
    }
    return null;
  }
  function setText(node, value) {
    if (node && node.textContent !== value) node.textContent = value;
  }
  function apply() {
    const c = copy[language()];
    setText(document.querySelector('.cart-summary-row.cart-total span'), c.total);
    setText(document.querySelector('.cart-shipping-note'), c.shipping);

    const uploadStatus = document.querySelector('[data-custom-upload-status]');
    if (uploadStatus && uploadStatus.textContent.trim()) {
      const text = uploadStatus.textContent.trim();
      const numbers = text.match(/(\d+)\D+(\d+)\D+(\d+)\s*%/);
      if (numbers) {
        setText(uploadStatus, c.uploadProgress(numbers[1], numbers[2], numbers[3]));
      } else {
        const key = translatedKey(text);
        setText(uploadStatus, key ? c[key] : c.uploadFailed);
      }
    }

    const cartStatus = document.querySelector('[data-cart-status]');
    if (cartStatus && cartStatus.textContent.trim()) {
      const text = cartStatus.textContent.trim();
      const key = translatedKey(text);
      if (key) setText(cartStatus, c[key]);
      else if (language() !== 'en' && /checkout|paypal|payment|order/i.test(text)) setText(cartStatus, c.checkoutError);
    }
  }
  let scheduled = false;
  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => {
      scheduled = false;
      apply();
    });
  }
  document.addEventListener('DOMContentLoaded', scheduleApply);
  window.addEventListener('velvet-language-changed', scheduleApply);
  document.addEventListener('velvet:language-change', scheduleApply);
  new MutationObserver(scheduleApply).observe(document.documentElement, { childList: true, subtree: true });
})();

/* Velvet Charms Art & Gifts — curated EN/RO/FR/IT/DE localization layer */
(() => {
  'use strict';

  const STORAGE_KEY = 'velvet_language_art_gifts';
  const SUPPORTED = ['en', 'ro', 'fr', 'it', 'de'];
  const LABELS = { en: 'EN', ro: 'RO', fr: 'FR', it: 'IT', de: 'DE' };

  const dictionaries = {
    fr: {
      'Home':'Accueil','Catalogue':'Catalogue','Custom Creations':'Créations sur mesure','About':'À propos','FAQ':'FAQ','Contact':'Contact','Velvet Universe':'Univers Velvet','Visit Body Glow':'Découvrir Body Glow',
      'Handmade with Care':'Créé à la main, avec soin','Browse Catalogue':'Découvrir le catalogue','Our Approach':'Notre approche',
      'Cozy, heart-warming handmade treasures — paintings, sculptural pieces, resin, leather, accessories and keepsakes designed to become part of a story.':'Des créations artisanales chaleureuses et pleines d’âme — peintures, pièces sculptées, résine, cuir, accessoires et objets-souvenirs imaginés pour s’inscrire dans une histoire.',
      'Everything you see is slow-crafted with attention to texture, personality and detail: painted portraits, sculptural reliefs, resin creations, leather pieces, accessories and meaningful handmade gifts.':'Chaque pièce est réalisée lentement, avec une attention particulière aux textures, au caractère et aux détails : portraits peints, reliefs sculptés, créations en résine, pièces en cuir, accessoires et cadeaux artisanaux porteurs de sens.',
      'From a photograph, memory or idea':'À partir d’une photo, d’un souvenir ou d’une idée','A pet, a loved one, a meaningful place or an imagined character can become a painted, sculpted, felted, resin or mixed-media piece made especially for you.':'Un animal cher, une personne aimée, un lieu précieux ou un personnage imaginé peut devenir une création peinte, sculptée, feutrée, en résine ou en techniques mixtes, réalisée spécialement pour vous.','Discover custom creations':'Découvrir les créations sur mesure',
      'The story continues':'L’histoire continue','Step inside the Velvet Universe':'Entrez dans l’Univers Velvet','Discover the details that make Art & Gifts more than a catalogue — personal commissions, collectible touches, meaningful keepsakes and handmade pieces designed to be treasured.':'Découvrez ce qui fait d’Art & Gifts bien plus qu’un catalogue : commandes personnalisées, détails à collectionner, souvenirs chargés de sens et pièces artisanales pensées pour être précieusement conservées.',
      'Art & Gifts Collection':'Collection Art & Gifts','Order as shown — or create something uniquely yours.':'Commandez la pièce telle qu’elle est présentée — ou imaginez une version qui vous ressemble vraiment.',
      'Add to cart':'Ajouter au panier','Request customization':'Personnaliser','Cart':'Panier','Your cart':'Votre panier','Subtotal':'Sous-total','Total':'Total','Remove':'Retirer','Edit customization':'Modifier la personnalisation','Your cart is empty.':'Votre panier est vide.','Checkout securely with PayPal':'Payer en toute sécurité avec PayPal',
      'Do you need it by a specific date?':'Avez-vous besoin de votre commande pour une date précise ?','(optional)':'(facultatif)','Your preferred date is confirmed only after we review the creation and current production schedule.':'La date souhaitée n’est confirmée qu’après examen de la création et de notre planning de production.','Payment reserves your place in our handmade production schedule. We will confirm the estimated production and dispatch window after reviewing your order.':'Votre paiement réserve votre place dans notre planning de fabrication artisanale. Après examen de votre commande, nous vous confirmerons la période estimée de réalisation et d’expédition.','Shipping is handled separately according to destination, parcel size and weight.':'Les frais de livraison sont calculés séparément selon la destination, les dimensions et le poids du colis.',
      'Customize product':'Personnaliser la création','Choose your preferences, add any special instructions and, if useful, attach private reference photos.':'Choisissez vos préférences, ajoutez vos indications particulières et, si nécessaire, joignez des photos de référence privées.','1. Options':'1. Options','2. Photos':'2. Photos','3. Review':'3. Vérification','Special instructions':'Indications particulières','Continue to photos':'Continuer vers les photos','Reference photos (up to 5)':'Photos de référence (5 maximum)','Continue to review':'Continuer vers la vérification','Save customization':'Enregistrer la personnalisation','Cancel':'Annuler',
      'Your photograph. Your story. Made by hand.':'Votre photo. Votre histoire. Façonnée à la main.','What Can We Create for You?':'Que pouvons-nous créer pour vous ?','Explore the catalogue':'Explorer le catalogue','Start a custom request':'Démarrer une demande sur mesure','One subject, many possibilities':'Un sujet, mille possibilités','Choose the form that fits the story':'Choisissez la forme qui raconte le mieux votre histoire','Something entirely new':'Une création entièrement nouvelle','From reference to finished piece':'De la référence à la pièce achevée','How a custom creation works':'Comment naît une création sur mesure','Begin with the details that matter':'Commencez par les détails qui comptent','Custom creation request':'Demande de création sur mesure','Your name':'Votre nom','What would you like us to create?':'Que souhaitez-vous nous confier ?','Preferred size / materials / details':'Dimensions / matières / détails souhaités','Photographs or visual references — up to 5':'Photos ou références visuelles — 5 maximum','Send custom request':'Envoyer la demande',
      'Frequently Asked Questions':'Questions fréquentes','About Velvet Charms':'À propos de Velvet Charms','Orders & Payments':'Commandes & paiements','Name':'Nom','Message':'Message','Send':'Envoyer','Sending…':'Envoi…','Message sent. Thank you!':'Votre message a bien été envoyé. Merci !',
      'Paintings & Portraits':'Peintures & portraits','Landscapes':'Paysages','Portraits':'Portraits','Festive Portraits':'Portraits de fête','Hair Accessories':'Accessoires pour cheveux','Hair Clips':'Barrettes','Hair Pins':'Épingles à cheveux','Hair Combs':'Peignes décoratifs','Epoxy & Clay Creations':'Créations en résine & argile','Home Decorations':'Décoration intérieure','Epoxy Jewelry':'Bijoux en résine','Phone Cases':'Coques de téléphone','Leather Bags':'Sacs en cuir','Wall Clock':'Horloge murale','Bundles':'Coffrets',
      'Signature Velvet wrapping':'Emballage signature Velvet','Minimal recyclable wrapping':'Emballage minimal recyclable','No gift wrapping':'Sans emballage cadeau','Include a blank card':'Ajouter une carte vierge','I will write the message in special instructions':'J’indiquerai le message dans les instructions particulières','No card':'Sans carte','Surprise me':'Surprenez-moi','Moon':'Lune','Star':'Étoile','Butterfly':'Papillon','Key':'Clé','Flower':'Fleur','Heart':'Cœur','Include my first Velvet Passport':'Ajouter mon premier Velvet Passport','Add stamps to my existing Passport':'Ajouter les tampons à mon Passport existant'
    },
    it: {
      'Home':'Home','Catalogue':'Catalogo','Custom Creations':'Creazioni su misura','About':'Chi siamo','FAQ':'FAQ','Contact':'Contatti','Velvet Universe':'Universo Velvet','Visit Body Glow':'Scopri Body Glow',
      'Handmade with Care':'Fatto a mano, con cura','Browse Catalogue':'Scopri il catalogo','Our Approach':'Il nostro modo di creare',
      'Cozy, heart-warming handmade treasures — paintings, sculptural pieces, resin, leather, accessories and keepsakes designed to become part of a story.':'Creazioni artigianali calde e ricche di carattere — dipinti, pezzi scultorei, resina, pelle, accessori e ricordi pensati per diventare parte di una storia.',
      'Everything you see is slow-crafted with attention to texture, personality and detail: painted portraits, sculptural reliefs, resin creations, leather pieces, accessories and meaningful handmade gifts.':'Ogni pezzo nasce con il tempo che il lavoro artigianale richiede, curando texture, personalità e dettagli: ritratti dipinti, rilievi scultorei, creazioni in resina, articoli in pelle, accessori e regali fatti a mano pieni di significato.',
      'From a photograph, memory or idea':'Da una fotografia, un ricordo o un’idea','A pet, a loved one, a meaningful place or an imagined character can become a painted, sculpted, felted, resin or mixed-media piece made especially for you.':'Un animale amato, una persona cara, un luogo speciale o un personaggio immaginato può diventare un’opera dipinta, scolpita, infeltrita, in resina o mixed media, creata appositamente per te.','Discover custom creations':'Scopri le creazioni su misura',
      'The story continues':'La storia continua','Step inside the Velvet Universe':'Entra nell’Universo Velvet','Discover the details that make Art & Gifts more than a catalogue — personal commissions, collectible touches, meaningful keepsakes and handmade pieces designed to be treasured.':'Scopri i dettagli che rendono Art & Gifts molto più di un catalogo: commissioni personali, piccoli elementi da collezionare, ricordi significativi e creazioni artigianali pensate per durare nel tempo.',
      'Art & Gifts Collection':'Collezione Art & Gifts','Order as shown — or create something uniquely yours.':'Ordina il pezzo così com’è oppure crea una versione davvero tua.',
      'Add to cart':'Aggiungi al carrello','Request customization':'Personalizza','Cart':'Carrello','Your cart':'Il tuo carrello','Subtotal':'Subtotale','Total':'Totale','Remove':'Rimuovi','Edit customization':'Modifica personalizzazione','Your cart is empty.':'Il carrello è vuoto.','Checkout securely with PayPal':'Paga in sicurezza con PayPal',
      'Do you need it by a specific date?':'Ti serve l’ordine entro una data precisa?','(optional)':'(facoltativo)','Your preferred date is confirmed only after we review the creation and current production schedule.':'La data richiesta viene confermata solo dopo aver valutato la creazione e il programma di produzione attuale.','Payment reserves your place in our handmade production schedule. We will confirm the estimated production and dispatch window after reviewing your order.':'Il pagamento riserva il tuo posto nel nostro programma di produzione artigianale. Dopo aver esaminato l’ordine, confermeremo il periodo stimato di lavorazione e spedizione.','Shipping is handled separately according to destination, parcel size and weight.':'La spedizione viene calcolata separatamente in base a destinazione, dimensioni e peso del pacco.',
      'Customize product':'Personalizza il prodotto','Choose your preferences, add any special instructions and, if useful, attach private reference photos.':'Scegli le tue preferenze, aggiungi eventuali indicazioni speciali e, se utile, allega fotografie di riferimento private.','1. Options':'1. Opzioni','2. Photos':'2. Foto','3. Review':'3. Riepilogo','Special instructions':'Indicazioni speciali','Continue to photos':'Continua alle foto','Reference photos (up to 5)':'Foto di riferimento (massimo 5)','Continue to review':'Continua al riepilogo','Save customization':'Salva personalizzazione','Cancel':'Annulla',
      'Your photograph. Your story. Made by hand.':'La tua fotografia. La tua storia. Creata a mano.','What Can We Create for You?':'Cosa possiamo creare per te?','Explore the catalogue':'Esplora il catalogo','Start a custom request':'Inizia una richiesta su misura','One subject, many possibilities':'Un soggetto, tante possibilità','Choose the form that fits the story':'Scegli la forma più adatta alla tua storia','Something entirely new':'Qualcosa di completamente nuovo','From reference to finished piece':'Dalla referenza alla creazione finita','How a custom creation works':'Come nasce una creazione su misura','Begin with the details that matter':'Parti dai dettagli che contano','Custom creation request':'Richiesta di creazione su misura','Your name':'Il tuo nome','What would you like us to create?':'Cosa vorresti che creassimo?','Preferred size / materials / details':'Dimensioni / materiali / dettagli preferiti','Photographs or visual references — up to 5':'Fotografie o riferimenti visivi — massimo 5','Send custom request':'Invia la richiesta',
      'Frequently Asked Questions':'Domande frequenti','About Velvet Charms':'Chi è Velvet Charms','Orders & Payments':'Ordini e pagamenti','Name':'Nome','Message':'Messaggio','Send':'Invia','Sending…':'Invio…','Message sent. Thank you!':'Messaggio inviato. Grazie!',
      'Paintings & Portraits':'Dipinti e ritratti','Landscapes':'Paesaggi','Portraits':'Ritratti','Festive Portraits':'Ritratti festivi','Hair Accessories':'Accessori per capelli','Hair Clips':'Fermagli','Hair Pins':'Forcine','Hair Combs':'Pettini decorativi','Epoxy & Clay Creations':'Creazioni in resina e argilla','Home Decorations':'Decorazioni per la casa','Epoxy Jewelry':'Gioielli in resina','Phone Cases':'Cover per telefono','Leather Bags':'Borse in pelle','Wall Clock':'Orologio da parete','Bundles':'Set',
      'Signature Velvet wrapping':'Confezione signature Velvet','Minimal recyclable wrapping':'Confezione essenziale riciclabile','No gift wrapping':'Senza confezione regalo','Include a blank card':'Aggiungi un biglietto vuoto','I will write the message in special instructions':'Scriverò il messaggio nelle indicazioni speciali','No card':'Senza biglietto','Surprise me':'Sorprendimi','Moon':'Luna','Star':'Stella','Butterfly':'Farfalla','Key':'Chiave','Flower':'Fiore','Heart':'Cuore','Include my first Velvet Passport':'Aggiungi il mio primo Velvet Passport','Add stamps to my existing Passport':'Aggiungi i timbri al mio Passport esistente'
    },
    de: {
      'Home':'Startseite','Catalogue':'Katalog','Custom Creations':'Individuelle Anfertigungen','About':'Über uns','FAQ':'FAQ','Contact':'Kontakt','Velvet Universe':'Velvet Universum','Visit Body Glow':'Body Glow entdecken',
      'Handmade with Care':'Mit Sorgfalt von Hand gefertigt','Browse Catalogue':'Katalog entdecken','Our Approach':'Wie wir arbeiten',
      'Cozy, heart-warming handmade treasures — paintings, sculptural pieces, resin, leather, accessories and keepsakes designed to become part of a story.':'Wärmende, charaktervolle Handarbeiten — Gemälde, skulpturale Stücke, Resin, Leder, Accessoires und Erinnerungsstücke, die Teil einer persönlichen Geschichte werden dürfen.',
      'Everything you see is slow-crafted with attention to texture, personality and detail: painted portraits, sculptural reliefs, resin creations, leather pieces, accessories and meaningful handmade gifts.':'Jedes Stück entsteht in sorgfältiger Handarbeit mit Blick für Haptik, Persönlichkeit und Details: gemalte Porträts, plastische Reliefs, Resin-Kreationen, Lederarbeiten, Accessoires und bedeutungsvolle handgefertigte Geschenke.',
      'From a photograph, memory or idea':'Aus einem Foto, einer Erinnerung oder einer Idee','A pet, a loved one, a meaningful place or an imagined character can become a painted, sculpted, felted, resin or mixed-media piece made especially for you.':'Ein geliebtes Tier, ein besonderer Mensch, ein bedeutsamer Ort oder eine Figur aus Ihrer Vorstellung kann zu einem gemalten, modellierten, gefilzten, aus Resin gefertigten oder in Mixed Media gestalteten Unikat werden.','Discover custom creations':'Individuelle Anfertigungen entdecken',
      'The story continues':'Die Geschichte geht weiter','Step inside the Velvet Universe':'Willkommen im Velvet Universum','Discover the details that make Art & Gifts more than a catalogue — personal commissions, collectible touches, meaningful keepsakes and handmade pieces designed to be treasured.':'Entdecken Sie die Details, die Art & Gifts zu mehr als einem Katalog machen: persönliche Auftragsarbeiten, sammelbare Akzente, bedeutungsvolle Erinnerungsstücke und handgefertigte Stücke, die bleiben dürfen.',
      'Art & Gifts Collection':'Art & Gifts Kollektion','Order as shown — or create something uniquely yours.':'Bestellen Sie das Stück wie gezeigt – oder gestalten Sie eine ganz persönliche Variante.',
      'Add to cart':'In den Warenkorb','Request customization':'Personalisieren','Cart':'Warenkorb','Your cart':'Ihr Warenkorb','Subtotal':'Zwischensumme','Total':'Gesamtsumme','Remove':'Entfernen','Edit customization':'Personalisierung bearbeiten','Your cart is empty.':'Ihr Warenkorb ist leer.','Checkout securely with PayPal':'Sicher mit PayPal bezahlen',
      'Do you need it by a specific date?':'Benötigen Sie Ihre Bestellung zu einem bestimmten Termin?','(optional)':'(optional)','Your preferred date is confirmed only after we review the creation and current production schedule.':'Ihr Wunschtermin wird erst bestätigt, nachdem wir die Anfertigung und unsere aktuelle Produktionsplanung geprüft haben.','Payment reserves your place in our handmade production schedule. We will confirm the estimated production and dispatch window after reviewing your order.':'Mit der Zahlung reservieren Sie Ihren Platz in unserer handwerklichen Produktionsplanung. Nach Prüfung Ihrer Bestellung bestätigen wir den voraussichtlichen Fertigungs- und Versandzeitraum.','Shipping is handled separately according to destination, parcel size and weight.':'Die Versandkosten werden separat nach Zielort, Paketgröße und Gewicht berechnet.',
      'Customize product':'Produkt personalisieren','Choose your preferences, add any special instructions and, if useful, attach private reference photos.':'Wählen Sie Ihre Wünsche, ergänzen Sie besondere Hinweise und fügen Sie bei Bedarf private Referenzfotos hinzu.','1. Options':'1. Optionen','2. Photos':'2. Fotos','3. Review':'3. Prüfen','Special instructions':'Besondere Hinweise','Continue to photos':'Weiter zu den Fotos','Reference photos (up to 5)':'Referenzfotos (max. 5)','Continue to review':'Weiter zur Prüfung','Save customization':'Personalisierung speichern','Cancel':'Abbrechen',
      'Your photograph. Your story. Made by hand.':'Ihr Foto. Ihre Geschichte. Von Hand gestaltet.','What Can We Create for You?':'Was dürfen wir für Sie gestalten?','Explore the catalogue':'Katalog entdecken','Start a custom request':'Individuelle Anfrage starten','One subject, many possibilities':'Ein Motiv, viele Möglichkeiten','Choose the form that fits the story':'Wählen Sie die Form, die zu Ihrer Geschichte passt','Something entirely new':'Etwas ganz Neues','From reference to finished piece':'Von der Vorlage zum fertigen Stück','How a custom creation works':'So entsteht Ihre individuelle Anfertigung','Begin with the details that matter':'Beginnen Sie mit den Details, die zählen','Custom creation request':'Anfrage für eine individuelle Anfertigung','Your name':'Ihr Name','What would you like us to create?':'Was dürfen wir für Sie anfertigen?','Preferred size / materials / details':'Gewünschte Größe / Materialien / Details','Photographs or visual references — up to 5':'Fotos oder visuelle Referenzen — max. 5','Send custom request':'Anfrage senden',
      'Frequently Asked Questions':'Häufige Fragen','About Velvet Charms':'Über Velvet Charms','Orders & Payments':'Bestellungen & Zahlung','Name':'Name','Message':'Nachricht','Send':'Senden','Sending…':'Wird gesendet…','Message sent. Thank you!':'Nachricht gesendet. Vielen Dank!',
      'Paintings & Portraits':'Gemälde & Porträts','Landscapes':'Landschaften','Portraits':'Porträts','Festive Portraits':'Festliche Porträts','Hair Accessories':'Haarschmuck','Hair Clips':'Haarspangen','Hair Pins':'Haarnadeln','Hair Combs':'Dekorative Kämme','Epoxy & Clay Creations':'Resin- & Tonkreationen','Home Decorations':'Wohndekoration','Epoxy Jewelry':'Resin-Schmuck','Phone Cases':'Handyhüllen','Leather Bags':'Ledertaschen','Wall Clock':'Wanduhr','Bundles':'Sets',
      'Signature Velvet wrapping':'Velvet Signature-Verpackung','Minimal recyclable wrapping':'Schlichte recycelbare Verpackung','No gift wrapping':'Keine Geschenkverpackung','Include a blank card':'Leere Karte beilegen','I will write the message in special instructions':'Ich schreibe den Kartentext in die besonderen Hinweise','No card':'Keine Karte','Surprise me':'Überraschen Sie mich','Moon':'Mond','Star':'Stern','Butterfly':'Schmetterling','Key':'Schlüssel','Flower':'Blume','Heart':'Herz','Include my first Velvet Passport':'Meinen ersten Velvet Passport beilegen','Add stamps to my existing Passport':'Stempel in meinen vorhandenen Passport eintragen'
    }
  };

  function preferredLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (SUPPORTED.includes(saved)) return saved;
    const browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return SUPPORTED.includes(browser) ? browser : 'en';
  }

  const originals = new WeakMap();
  const originalAttrs = new WeakMap();
  let current = preferredLanguage();
  let observer;

  function remember(node) {
    if (!originals.has(node)) originals.set(node, node.nodeValue);
  }
  function rememberAttr(el, name) {
    if (!originalAttrs.has(el)) originalAttrs.set(el, {});
    const bag = originalAttrs.get(el);
    if (!(name in bag)) bag[name] = el.getAttribute(name);
  }
  function translateString(source) {
    if (current === 'en' || current === 'ro') return source;
    const map = dictionaries[current] || {};
    const trimmed = String(source || '').trim();
    if (!trimmed) return source;
    const translated = map[trimmed];
    if (!translated) return source;
    const leading = source.match(/^\s*/)?.[0] || '';
    const trailing = source.match(/\s*$/)?.[0] || '';
    return leading + translated + trailing;
  }

  function translateTree(root = document.body) {
    if (!root) return;
    if (current === 'ro') {
      document.querySelectorAll('.lang-en').forEach(el => { el.style.display = 'none'; });
      document.querySelectorAll('.lang-ro').forEach(el => { el.style.display = ''; });
      return;
    }
    document.querySelectorAll('.lang-ro').forEach(el => { el.style.display = 'none'; });
    document.querySelectorAll('.lang-en').forEach(el => { el.style.display = ''; });

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || ['SCRIPT','STYLE','NOSCRIPT'].includes(parent.tagName) || parent.closest('.velvet-language-switcher')) return NodeFilter.FILTER_REJECT;
        return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      remember(node);
      const original = originals.get(node);
      node.nodeValue = current === 'en' ? original : translateString(original);
    }

    root.querySelectorAll?.('[placeholder],[title],[aria-label]').forEach(el => {
      for (const attr of ['placeholder','title','aria-label']) {
        if (!el.hasAttribute(attr) || el.closest('.velvet-language-switcher')) continue;
        rememberAttr(el, attr);
        const source = originalAttrs.get(el)[attr];
        el.setAttribute(attr, current === 'en' ? source : translateString(source));
      }
    });
  }

  function makeSwitcher() {
    if (document.querySelector('.velvet-language-switcher')) return;
    const host = document.querySelector('.header-inner') || document.querySelector('.site-header') || document.body;
    const wrap = document.createElement('div');
    wrap.className = 'velvet-language-switcher';
    wrap.setAttribute('aria-label', 'Language');
    SUPPORTED.forEach(lang => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = LABELS[lang];
      button.dataset.lang = lang;
      button.setAttribute('aria-pressed', String(current === lang));
      button.addEventListener('click', () => setLanguage(lang));
      wrap.appendChild(button);
    });
    host.appendChild(wrap);
    const style = document.createElement('style');
    style.textContent = `.velvet-language-switcher{display:flex;gap:.28rem;align-items:center;justify-content:center;flex-wrap:wrap;margin-left:auto;padding:.25rem .35rem}.velvet-language-switcher button{border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.08);color:inherit;border-radius:999px;padding:.3rem .48rem;font:inherit;font-size:.72rem;letter-spacing:.05em;cursor:pointer}.velvet-language-switcher button[aria-pressed="true"]{background:rgba(255,255,255,.22);border-color:rgba(255,255,255,.58)}@media(max-width:760px){.velvet-language-switcher{width:100%;margin:.35rem 0 0}}`;
    document.head.appendChild(style);
  }

  function setLanguage(lang) {
    if (!SUPPORTED.includes(lang)) lang = 'en';
    current = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.querySelectorAll('.velvet-language-switcher button').forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang)));
    if (lang === 'ro' && window.VELVET_SET_LANGUAGE) {
      window.VELVET_SET_LANGUAGE('ro');
    } else if (window.VELVET_SET_LANGUAGE) {
      window.VELVET_SET_LANGUAGE('en');
    }
    translateTree(document.body);
    window.dispatchEvent(new CustomEvent('velvet-language-changed', { detail: { language: lang } }));
  }

  function startObserver() {
    observer?.disconnect();
    observer = new MutationObserver(mutations => {
      observer.disconnect();
      for (const mutation of mutations) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) translateTree(node);
          else if (node.nodeType === Node.TEXT_NODE && node.parentElement) translateTree(node.parentElement);
        });
      }
      observer.observe(document.body, { childList: true, subtree: true });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function init() {
    makeSwitcher();
    setLanguage(current);
    startObserver();
    window.VELVET_GET_LANGUAGE = () => current;
    window.VELVET_SET_SITE_LANGUAGE = setLanguage;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

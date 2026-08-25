/* localization.js — Velvet Charms Art & Gifts: curated EN/RO localization */
(function () {
  "use strict";

  const LANGUAGE_KEY = "velvet_language_art_gifts";
  const originals = new WeakMap();
  let currentLanguage = localStorage.getItem(LANGUAGE_KEY) || (navigator.language?.toLowerCase().startsWith("ro") ? "ro" : "en");

  const ro = {
    "Home":"Acasă","Catalogue":"Catalog","About":"Despre noi","Contact":"Contact","Visit Body Glow":"Vizitează Body Glow",
    "Handmade with Care":"Creat manual, cu grijă","Browse Catalogue":"Descoperă catalogul","Our Approach":"Felul în care lucrăm",
    "Cozy, heart-warming handmade treasures — candles, soaps, knitted winterwear, paintings and epoxy home pieces designed to become keepsakes.":"Creații lucrate manual, calde și pline de personalitate — lumânări, săpunuri, tricotaje, picturi și obiecte decorative din rășină, gândite să devină amintiri de păstrat.",
    "Everything you see is slow-crafted with attention to texture and detail: sculptural candles, essential oil soaps, brushed knitwear and layered mixed-media artworks.":"Fiecare piesă este realizată în ritmul pe care îl cere lucrul manual, cu atenție la textură și detalii: lumânări sculpturale, săpunuri cu uleiuri esențiale, tricotaje atent finisate și lucrări mixed-media construite în straturi.",
    "Art & Gifts Collection":"Colecția Artă & Cadouri","Order as shown — or create something uniquely yours.":"Comandă piesa așa cum este prezentată sau creează o variantă cu adevărat a ta.",
    "How Custom Orders Work":"Cum funcționează comenzile personalizate","Choose an item or share your idea":"Alege o piesă sau povestește-ne ideea ta","Describe colors, size, materials, mood, and details":"Spune-ne culorile, dimensiunea, materialele, atmosfera și detaliile dorite","Receive concept visuals or previews":"Primești schițe conceptuale sau previzualizări","Request refinements until perfect":"Ceri ajustări până când detaliile sunt potrivite","We craft your one-of-a-kind piece":"Realizăm piesa ta unicat","Every item is handmade — never mass produced.":"Fiecare piesă este realizată manual — niciodată produsă în serie.",
    "About Velvet Charms":"Despre Velvet Charms","Orders & Payments":"Comenzi & Plăți","Contact page":"pagina de Contact",
    "Velvet Charms is a small handmade brand focused on cozy, thoughtful creations. Each item is crafted with care, patience, and attention to detail — from candles and natural soaps to knitted pieces and decorative creations.":"Velvet Charms este un brand artizanal dedicat creațiilor cu personalitate, realizate atent și cu răbdare. Fiecare piesă este lucrată cu grijă pentru detalii — de la lumânări și săpunuri naturale până la tricotaje și obiecte decorative.",
    "Many of our products are made in small batches, and we also welcome custom commissions. If you have a specific idea, size, scent, color palette, or gift concept in mind, feel free to reach out.":"Multe dintre produsele noastre sunt realizate în serii mici, iar comenzile personalizate sunt binevenite. Dacă ai în minte o idee, o dimensiune, o paletă cromatică, un parfum sau un concept de cadou, ne poți spune exact ce îți dorești.",
    "Orders are placed directly through our website. Payments are processed securely via PayPal, allowing you to pay using your PayPal balance or debit/credit card.":"Comenzile se plasează direct pe site, iar plata este procesată în siguranță prin PayPal, folosind contul PayPal sau un card de debit ori credit eligibil.",
    "Once your order is confirmed, you will receive updates regarding preparation and delivery. Handmade items may require a short processing time — quality always comes first.":"După confirmarea comenzii vei primi informații despre realizare și expediere. Fiind produse lucrate manual, timpul de pregătire diferă în funcție de complexitate — calitatea rămâne prioritară.",
    "For commissions, questions, or special requests, please use the Contact page. We usually respond within 24–48 hours.":"Pentru comenzi personalizate, întrebări sau cereri speciale, folosește pagina de Contact. Răspundem de regulă în 24–48 de ore.",
    "Name":"Nume","Email (optional)":"E-mail (opțional)","Message":"Mesaj","Attach one file (image/pdf)":"Atașează un fișier (imagine/PDF)","Send":"Trimite","Sending…":"Se trimite…","Message sent. Thank you!":"Mesaj trimis. Îți mulțumim!",

    "Paintings & Portraits":"Picturi & Portrete","Landscapes":"Peisaje","Portraits":"Portrete","Festive Portraits":"Portrete festive",
    "All artworks in this category are custom commissions. You may request any scene, character, portrait, landscape, or theme.":"Toate lucrările din această categorie sunt realizate la comandă. Poți solicita o scenă, un personaj, un portret, un peisaj sau orice temă potrivită stilului nostru de lucru.",
    "Small Landscape Painting — 20×20 cm":"Pictură peisaj — mică, 20×20 cm","Medium Landscape Painting — 30×40 cm":"Pictură peisaj — medie, 30×40 cm","Large Landscape Painting — 50×70 cm":"Pictură peisaj — mare, 50×70 cm",
    "Mini landscape — acrylic on stretched canvas.":"Peisaj în format mic, pictat în acrilic pe pânză întinsă.","Medium landscape with textured brushwork.":"Peisaj de dimensiune medie, cu tușe și texturi picturale vizibile.","Large statement landscape painting.":"Peisaj de mari dimensiuni, conceput ca piesă de accent.",
    "2D Portrait — 30×40 cm":"Portret 2D — 30×40 cm","3D Portrait Relief — 30×40 cm":"Portret 3D în relief — 30×40 cm","Couple or Family Portrait — 40×50 cm":"Portret de cuplu sau familie — 40×50 cm","Mini Portrait Ornament — 10×10 cm":"Mini-portret decorativ — 10×10 cm",
    "2D painted portrait — person or pet.":"Portret pictat 2D — persoană sau animal de companie.","3D mixed-media portrait with sculptural texture.":"Portret 3D mixed-media cu textură sculpturală.","Multi-person detailed portrait.":"Portret detaliat cu mai multe persoane.","Small hand-painted ornament keepsake.":"Mică piesă-amintire pictată manual.",
    "Holiday-Themed Portrait (2D) — 30×40 cm":"Portret festiv 2D — 30×40 cm","3D Festive Portrait Relief — 30×40 cm":"Portret festiv 3D în relief — 30×40 cm","Festive-themed 2D portrait with holiday magic.":"Portret 2D cu atmosferă festivă și detalii de sărbătoare.","Sculpted and painted festive portrait.":"Portret festiv sculptat și pictat manual.",

    "Hair Accessories":"Accesorii pentru păr","Hair Clips":"Clame de păr","Hair Pins":"Ace de păr","Hair Combs":"Piepteni decorativi","Custom Hair Set":"Set personalizat pentru păr",
    "Decorative Hair Clips":"Clame decorative pentru păr","Decorative Hair Pins":"Ace decorative pentru păr","Decorptive Hair Combs":"Piepteni decorativi pentru păr","Custom Hair Set — Any 3 Matching Pieces":"Set personalizat — 3 piese asortate la alegere",
    "Handmade decorative hair clips crafted from resin, glass, or wool.":"Clame decorative realizate manual din rășină, sticlă sau lână.","Elegant handcrafted hair pins — perfect for daily wear or special occasions.":"Ace de păr elegante, lucrate manual, potrivite atât pentru purtare zilnică, cât și pentru ocazii speciale.","Handmade decorative combs crafted with resin, pearlescent touches, or mixed media.":"Piepteni decorativi realizați manual cu rășină, accente perlate sau tehnici mixed-media.","Personalized matching hair accessory set — choose color theme and style.":"Set asortat de accesorii pentru păr, personalizat după paleta cromatică și stilul ales.",

    "Epoxy & Clay Creations":"Creații din rășină & lut","Home Decorations":"Decorațiuni pentru casă","Epoxy Lamp":"Lampă din rășină","Epoxy Candle Holders":"Suporturi de lumânări din rășină","Epoxy & Clay Keychains":"Brelocuri din rășină & lut","Epoxy Jewelry":"Bijuterii din rășină","Epoxy & Wood Jewelry Box":"Cutie de bijuterii din lemn & rășină","Phone Cases":"Huse de telefon",
    "Epoxy Coasters Set (4 pcs)":"Set suporturi din rășină (4 buc.)","Epoxy Tray (12 inches)":"Tavă decorativă din rășină (12 inch)","Decorative Figurine — Small (5 cm)":"Figurină decorativă — mică (5 cm)","Decorative Figurine — Medium (12 cm)":"Figurină decorativă — medie (12 cm)","Decorative Figurine — Large (20 cm)":"Figurină decorativă — mare (20 cm)","Epoxy Lamp — 25 cm":"Lampă din rășină — 25 cm","Epoxy Candle Holders — Set":"Set suporturi de lumânări din rășină","Custom Epoxy & Clay Keychains":"Brelocuri personalizate din rășină & lut","Epoxy Resin Pendant":"Pandantiv din rășină","Epoxy Earrings — Pair":"Cercei din rășină — pereche","Epoxy Ring — Adjustable":"Inel din rășină — reglabil","Custom Epoxy Case":"Husă personalizată din rășină",
    "Clear or tinted epoxy coasters with floral or metallic inclusions.":"Suporturi din rășină transparentă sau colorată, cu inserții florale ori metalice.","Decorative epoxy tray with marbled or galaxy effects.":"Tavă decorativă din rășină, cu efecte marmorate sau inspirate de galaxii.","Small decorative figurine sculpted from clay or epoxy.":"Figurină decorativă mică, sculptată din lut sau rășină.","Medium epoxy/clay figurine with detailed finish.":"Figurină de dimensiune medie din rășină sau lut, finisată în detaliu.","Large handcrafted figurine — custom colors available.":"Figurină mare lucrată manual — disponibilă și în culori personalizate.","Epoxy lamp with glowing core and replaceable bulb.":"Lampă din rășină cu nucleu luminos și bec înlocuibil.","Handcrafted epoxy candle holders with floral and crystal inclusions.":"Suporturi pentru lumânări realizate manual din rășină, cu inserții florale și cristaline.","Handmade epoxy or clay keychains — Christmas, floral, or custom themes.":"Brelocuri lucrate manual din rășină sau lut — teme festive, florale ori complet personalizate.","Hand-poured epoxy pendants with flowers or glitter.":"Pandantive turnate manual din rășină, cu flori sau accente strălucitoare.","Lightweight epoxy earrings with hypoallergenic hooks.":"Cercei ușori din rășină, cu tortițe hipoalergenice.","Transparent or tinted adjustable epoxy ring.":"Inel reglabil din rășină transparentă sau colorată.","Wooden jewelry box with epoxy lid.":"Cutie de bijuterii din lemn, cu capac decorativ din rășină.","Custom epoxy phone case with embedded flowers or designs.":"Husă de telefon personalizată din rășină, cu flori sau alte elemente decorative încorporate.",

    "Leather Bags":"Genți din piele","Leather Bag — Small":"Geantă din piele — mică","Leather Bag — Medium":"Geantă din piele — medie","Leather Bag — Large":"Geantă din piele — mare","Small handcrafted leather bag with adjustable strap.":"Geantă mică din piele, lucrată manual, cu bareta reglabilă.","Medium leather bag — perfect for daily use.":"Geantă medie din piele, potrivită pentru utilizare zilnică.","Large elegant leather bag with reinforced stitching.":"Geantă mare și elegantă din piele, cu cusături întărite.",
    "Wall Clock":"Ceas de perete","Wall Clock — Large":"Ceas de perete — mare","Large epoxy-and-wood wall clock with metal hands.":"Ceas de perete de mari dimensiuni, realizat din lemn și rășină, cu ace metalice.",
    "Bundles":"Seturi","Relax & Restore Set":"Set Relax & Restore","Cozy Winter Set":"Set Cozy Winter","Home Harmony Box":"Cutie Home Harmony","Herbal soap + face cream + small wax candle.":"Săpun vegetal + cremă de ten + lumânare mică din ceară.","Beanie + scarf + mittens + small candle bundle.":"Căciulă + fular + mănuși + o lumânare mică.","Epoxy decor + wax candle + seasonal soap.":"Decorațiune din rășină + lumânare din ceară + săpun de sezon.",

    "Buy":"Cumpără","Add to cart":"Adaugă în coș","Request customization":"Personalizează","Cart":"Coș","Your cart":"Coșul tău","Subtotal":"Subtotal","Total":"Total","Remove":"Elimină","Edit customization":"Editează personalizarea","Your cart is empty.":"Coșul tău este gol.",
    "Do you need it by a specific date?":"Ai nevoie de comandă până la o anumită dată?","(optional)":"(opțional)","Your preferred date is confirmed only after we review the creation and current production schedule.":"Data preferată este confirmată numai după ce analizăm creația și programul actual de producție.","Payment reserves your place in our handmade production schedule. We will confirm the estimated production and dispatch window after reviewing your order.":"Plata îți rezervă locul în programul nostru de producție artizanală. După analizarea comenzii îți confirmăm intervalul estimat de realizare și expediere.","Shipping is handled separately according to destination, parcel size and weight.":"Livrarea se calculează separat în funcție de destinație, dimensiunea și greutatea coletului.","Checkout securely with PayPal":"Plătește în siguranță cu PayPal",
    "Customize product":"Personalizează produsul","Choose your preferences, add any special instructions and, if useful, attach private reference photos.":"Alege preferințele, adaugă instrucțiuni speciale și, dacă este util, atașează în privat fotografii de referință.","1. Options":"1. Opțiuni","2. Photos":"2. Fotografii","3. Review":"3. Verificare","Special instructions":"Instrucțiuni speciale","Continue to photos":"Continuă la fotografii","Reference photos (up to 5)":"Fotografii de referință (maximum 5)","Useful for portraits, pets, colors, shapes, inspiration or other personalized details.":"Pot fi folosite pentru portrete, animale, culori, forme, inspirație sau alte detalii personalizate.","Back":"Înapoi","Review customization":"Verifică personalizarea","Add customized item to cart":"Adaugă produsul personalizat în coș","Choose an option":"Alege o opțiune","As displayed, with no extra options.":"Așa cum este prezentat, fără opțiuni suplimentare.","Please confirm every detail before adding this item to your cart.":"Verifică toate detaliile înainte de a adăuga produsul în coș.","Reference photo":"Fotografie de referință","attached":"atașată","Saved photo":"Fotografie salvată",
    "Approximate making time:":"Timp aproximativ de realizare:","3–7 business days":"3–7 zile lucrătoare","5–10 business days":"5–10 zile lucrătoare","7–14 business days":"7–14 zile lucrătoare","10–20 business days":"10–20 de zile lucrătoare","15–30 business days":"15–30 de zile lucrătoare","Confirmed with your production slot":"Confirmat odată cu intervalul tău de producție",
    "artwork style":"stil artistic","color palette":"paletă cromatică","background treatment":"tratarea fundalului","metal tone":"nuanța metalului","finish":"finisaj","inclusions":"inserții","leather color":"culoarea pielii","hardware":"accesorii metalice","personalization":"personalizare","number style":"stilul cifrelor","gift theme":"tema cadoului","gift wrap":"ambalare cadou","gift card":"card cadou","collectible charm":"charm de colecție","velvet passport":"Pașaport Velvet",
    "Realistic":"Realist","Painterly":"Pictural","Whimsical":"Fantezist","Minimal":"Minimalist","Mixed media":"Mixed-media","Artist's recommendation":"Recomandarea artistului",
    "Natural":"Naturală","Soft pastel":"Pastel delicat","Warm earthy":"Tonuri calde, pământii","Jewel tones":"Nuanțe de pietre prețioase","Dark and moody":"Închisă și dramatică","Bright and joyful":"Vibrantă și veselă","Match my reference photo":"Potrivită fotografiei mele",
    "Detailed background":"Fundal detaliat","Soft atmospheric background":"Fundal atmosferic delicat","Simple color background":"Fundal simplu colorat",
    "Neutral":"Neutră","Match my outfit or reference":"Potrivită ținutei sau referinței mele","Gold tone":"Auriu","Silver tone":"Argintiu","Rose-gold tone":"Auriu roz","Glossy":"Lucios","Satin":"Satinat","Pearlescent":"Perlat","Botanical":"Botanic",
    "Clear and natural":"Transparent și natural","Match my décor or reference":"Potrivit decorului sau referinței mele","Matte details":"Detalii mate","Metallic accents":"Accente metalice","No inclusions":"Fără inserții","Dried botanicals":"Plante uscate","Gold or silver leaf":"Foiță aurie sau argintie","Subtle shimmer":"Strălucire discretă","Small keepsake supplied by customer":"Mică amintire furnizată de client",
    "Black":"Negru","Chocolate brown":"Maro ciocolatiu","Cognac":"Coniac","Natural tan":"Cafeniu natural","Burgundy":"Burgund","Forest green":"Verde pădure","Antique brass":"Alamă antichizată","No initials":"Fără inițiale","Embossed initials":"Inițiale embosate","Small hand-painted detail":"Mic detaliu pictat manual","I will describe it in special instructions":"Voi descrie în instrucțiunile speciale",
    "Natural wood and neutral":"Lemn natural și tonuri neutre","Match my room or reference":"Potrivit camerei sau referinței mele","Classic numerals":"Cifre clasice","Roman numerals":"Cifre romane","Minimal markers":"Marcaje minimaliste","No numerals":"Fără cifre","Glossy resin":"Rășină lucioasă","Natural texture":"Textură naturală",
    "Relaxation":"Relaxare","Celebration":"Sărbătoare","Romantic":"Romantic","Housewarming":"Casă nouă","Seasonal":"Sezonieră",
    "Signature Velvet wrapping":"Ambalare Velvet signature","Minimal recyclable wrapping":"Ambalare minimalistă reciclabilă","No gift wrapping":"Fără ambalare cadou","Include a blank card":"Include un card necompletat","I will write the message in special instructions":"Voi scrie mesajul în instrucțiunile speciale","No card":"Fără card","Surprise me":"Surprinde-mă","Moon":"Lună","Star":"Stea","Butterfly":"Fluture","Key":"Cheie","Flower":"Floare","Heart":"Inimă","No charm":"Fără charm","Include my first Velvet Passport":"Include primul meu Pașaport Velvet","Add stamps to my existing Passport":"Adaugă ștampile în Pașaportul existent","No Passport":"Fără Pașaport"
  };

  function normalize(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function translated(value) {
    const key = normalize(value);
    return currentLanguage === "ro" && ro[key] ? ro[key] : value;
  }

  function translateTextNode(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE || !node.parentElement) return;
    if (["SCRIPT", "STYLE", "TEXTAREA", "OPTION"].includes(node.parentElement.tagName)) return;
    const raw = node.nodeValue;
    if (!normalize(raw)) return;
    if (!originals.has(node)) originals.set(node, raw);
    const original = originals.get(node);
    const clean = normalize(original);
    const replacement = currentLanguage === "ro" && ro[clean] ? ro[clean] : original;
    if (replacement !== node.nodeValue) node.nodeValue = replacement;
  }

  function translateSelectOptions(root) {
    root.querySelectorAll?.("option").forEach(option => {
      if (!option.dataset.vcOriginal) option.dataset.vcOriginal = option.textContent;
      const original = option.dataset.vcOriginal;
      option.textContent = currentLanguage === "ro" && ro[normalize(original)] ? ro[normalize(original)] : original;
    });
  }

  function walk(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) translateTextNode(node);
    translateSelectOptions(root);
    document.documentElement.lang = currentLanguage;
  }

  function installToggle() {
    if (document.querySelector(".language-switch")) return;
    const header = document.querySelector(".header-inner");
    if (!header) return;
    const wrap = document.createElement("div");
    wrap.className = "language-switch";
    wrap.setAttribute("aria-label", "Language selector");
    wrap.innerHTML = '<button type="button" data-lang="en">EN</button><span>/</span><button type="button" data-lang="ro">RO</button>';
    header.appendChild(wrap);
    wrap.addEventListener("click", event => {
      const button = event.target.closest("[data-lang]");
      if (!button) return;
      setLanguage(button.dataset.lang);
    });
    refreshToggle();
  }

  function refreshToggle() {
    document.querySelectorAll(".language-switch [data-lang]").forEach(button => {
      button.classList.toggle("active", button.dataset.lang === currentLanguage);
      button.setAttribute("aria-pressed", button.dataset.lang === currentLanguage ? "true" : "false");
    });
  }

  function setLanguage(language) {
    currentLanguage = language === "ro" ? "ro" : "en";
    localStorage.setItem(LANGUAGE_KEY, currentLanguage);
    walk(document.body);
    refreshToggle();
    document.dispatchEvent(new CustomEvent("velvet:language-change", { detail: { language: currentLanguage } }));
  }

  document.addEventListener("DOMContentLoaded", () => {
    installToggle();
    walk(document.body);
    const observer = new MutationObserver(records => {
      records.forEach(record => record.addedNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
        else if (node.nodeType === Node.ELEMENT_NODE) walk(node);
      }));
      refreshToggle();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });

  window.VELVET_LANGUAGE = {
    get current() { return currentLanguage; },
    set: setLanguage,
    translate: translated
  };
})();

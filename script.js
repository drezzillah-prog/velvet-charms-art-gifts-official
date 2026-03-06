(function () {

const CATALOGUE_FILE = "catalogue-art-gifts.json";

async function loadCatalogue() {
  const res = await fetch(CATALOGUE_FILE, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load catalogue");
  return res.json();
}

function buildGallery(product){

  let gallery = "";

  if (product.images && product.images.length) {

    gallery += `
      <img 
        src="${product.images[0]}" 
        class="main-img"
        alt="${product.name}">
    `;

    if (product.images.length > 1) {

      gallery += `<div class="thumbs">`;

      product.images.slice(1).forEach(img => {
        gallery += `<img src="${img}" alt="">`;
      });

      gallery += `</div>`;
    }
  }

  return gallery;
}

function renderCatalogue(data){

  const root = document.getElementById("catalogue-root");

  if (!root) return;

  let html = "";

  data.categories.forEach(category => {

    html += `
      <section class="catalogue-category">
      <h2>${category.name}</h2>
    `;

    if (category.notice) {
      html += `<p class="category-notice">${category.notice}</p>`;
    }

    if (category.subcategories) {

      category.subcategories.forEach(sub => {

        html += `
          <h3 class="catalogue-sub">${sub.name}</h3>
          <div class="catalogue-grid">
        `;

        sub.products.forEach(product => {

          html += `
          <div class="product-card">

            ${buildGallery(product)}

            <h4>${product.name}</h4>

            <p>${product.description || ""}</p>

            <div class="price">${product.price} €</div>

            <a 
              class="buy-btn" 
              href="${product.paymentLink}" 
              target="_blank">
              Buy
            </a>

            <a 
              class="btn small"
              href="contact.html?product=${encodeURIComponent(product.name)}">
              Request customization
            </a>

          </div>
          `;

        });

        html += `</div>`;

      });

    }

    if (category.products) {

      html += `<div class="catalogue-grid">`;

      category.products.forEach(product => {

        html += `
        <div class="product-card">

          ${buildGallery(product)}

          <h4>${product.name}</h4>

          <p>${product.description || ""}</p>

          <div class="price">${product.price} €</div>

          <a 
            class="buy-btn" 
            href="${product.paymentLink}" 
            target="_blank">
            Buy
          </a>

          <a 
            class="btn small"
            href="contact.html?product=${encodeURIComponent(product.name)}">
            Request customization
          </a>

        </div>
        `;

      });

      html += `</div>`;

    }

    html += `</section>`;

  });

  root.innerHTML = html;

}

document.addEventListener("DOMContentLoaded", async () => {

  try {

    const data = await loadCatalogue();

    renderCatalogue(data);

  } catch (err) {

    console.error(err);

  }

});


document.addEventListener("click", function(e){

  if(e.target.matches(".thumbs img")){

    const clicked = e.target;

    const card = clicked.closest(".product-card");

    if(!card) return;

    const main = card.querySelector(".main-img");

    if(main){
      main.src = clicked.src;
    }

  }

  if(e.target.classList && e.target.classList.contains("main-img")){
    openLightbox(e.target.src);
  }

});


function openLightbox(src){

  let lb = document.querySelector(".lightbox");

  if(!lb){

    lb = document.createElement("div");

    lb.className = "lightbox hidden";

    lb.innerHTML = `<img src="">`;

    document.body.appendChild(lb);

    lb.addEventListener("click", () => {

      lb.classList.add("hidden");

    });

  }

  const img = lb.querySelector("img");

  if(img){
    img.src = src;
  }

  lb.classList.remove("hidden");

}

})();

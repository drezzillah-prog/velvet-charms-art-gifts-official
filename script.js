/* ===============================
   LOAD CATALOGUE
================================ */

async function loadCatalogue(){

  try{
    const res = await fetch("catalogue.json");
    const data = await res.json();

    renderCatalogue(data);

  }catch(err){
    console.error("Catalogue load error:", err);
  }

}

window.addEventListener("DOMContentLoaded", loadCatalogue);


/* ===============================
   RENDER STRUCTURE
================================ */

function renderCatalogue(data){

  const root = document.getElementById("catalogue-root");
  root.innerHTML = "";

  data.categories.forEach(category=>{

    const section = document.createElement("section");
    section.className = "category-section";

    const title = document.createElement("h2");
    title.className = "category-title";
    title.textContent = category.name;
    section.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "product-grid";

    category.products.forEach(product=>{
      grid.appendChild(createProductCard(product));
    });

    section.appendChild(grid);
    root.appendChild(section);

  });

}


/* ===============================
   PRODUCT CARD (FIXED VERSION)
================================ */

function createProductCard(product){

  const card = document.createElement("div");
  card.className = "product-card";


  /* ---------- MAIN IMAGE (FORCED STRUCTURE) ---------- */

  const mainImg = document.createElement("img");
  mainImg.className = "product-main-image";

  if(product.images && product.images.length > 0){
    mainImg.src = product.images[0];
  }
  else if(product.image){
    mainImg.src = product.image;
  }

  card.appendChild(mainImg);


  /* ---------- THUMBNAILS (ONLY IF MULTIPLE) ---------- */

  if(product.images && product.images.length > 1){

    const thumbs = document.createElement("div");
    thumbs.className = "product-thumbs";

    product.images.forEach(img=>{

      const t = document.createElement("img");
      t.src = img;
      t.className = "product-thumb";

      t.onclick = ()=>{
        mainImg.src = img;
      };

      thumbs.appendChild(t);
    });

    card.appendChild(thumbs);
  }


  /* ---------- TEXT ---------- */

  const name = document.createElement("div");
  name.className = "product-name";
  name.textContent = product.name;
  card.appendChild(name);

  const desc = document.createElement("div");
  desc.className = "product-desc";
  desc.textContent = product.description;
  card.appendChild(desc);

  const price = document.createElement("div");
  price.className = "product-price";
  price.textContent = product.price + " €";
  card.appendChild(price);


  /* ---------- BUY BUTTON ---------- */

  const btn = document.createElement("button");
  btn.className = "buy-btn";
  btn.textContent = "Buy";

  if(product.paymentLink){
    btn.onclick = ()=> window.open(product.paymentLink,"_blank");
  }

  card.appendChild(btn);

  return card;
}

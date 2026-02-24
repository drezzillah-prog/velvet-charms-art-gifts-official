/* Velvet Charms Catalogue Renderer */

const FILE = "catalogue-art-gifts.json";

async function loadCatalogue(){
  const res = await fetch(FILE,{cache:"no-store"});
  return res.json();
}

function createProductCard(product){

  const card = document.createElement("div");
  card.className = "product-card";

  const mainImg = document.createElement("img");
  mainImg.className = "product-main-image";
  mainImg.src = product.images[0];

  card.appendChild(mainImg);

  /* thumbnails */

  if(product.images.length > 1){

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

  /* text */

  const name = document.createElement("div");
  name.className="product-name";
  name.textContent = product.name;
  card.appendChild(name);

  const desc = document.createElement("div");
  desc.className="product-desc";
  desc.textContent = product.description;
  card.appendChild(desc);

  const price = document.createElement("div");
  price.className="product-price";
  price.textContent = product.price + " €";
  card.appendChild(price);

  const btn = document.createElement("button");
  btn.className="buy-btn";
  btn.textContent="Buy";
  btn.onclick = ()=> window.open(product.paymentLink,"_blank");
  card.appendChild(btn);

  return card;
}

function renderCatalogue(data){

  const root = document.getElementById("catalogue-root");

  data.categories.forEach(cat=>{

    const title = document.createElement("h2");
    title.className="category-title";
    title.textContent = cat.name;
    root.appendChild(title);

    if(cat.notice){
      const notice = document.createElement("p");
      notice.textContent = cat.notice;
      root.appendChild(notice);
    }

    if(cat.subcategories){

      cat.subcategories.forEach(sub=>{

        const subTitle = document.createElement("h3");
        subTitle.className="subcategory-title";
        subTitle.textContent = sub.name;
        root.appendChild(subTitle);

        const grid = document.createElement("div");
        grid.className="products-grid";

        sub.products.forEach(p=>{
          grid.appendChild(createProductCard(p));
        });

        root.appendChild(grid);
      });
    }

    if(cat.products){

      const grid = document.createElement("div");
      grid.className="products-grid";

      cat.products.forEach(p=>{
        grid.appendChild(createProductCard(p));
      });

      root.appendChild(grid);
    }

  });
}

document.addEventListener("DOMContentLoaded", async()=>{
  const data = await loadCatalogue();
  renderCatalogue(data);
});

/* script.js — Velvet Charms Art & Gifts FINAL */

(function () {

const CATALOGUE_FILE = "catalogue-art-gifts.json";

async function loadCatalogue(){
  const res = await fetch(CATALOGUE_FILE,{cache:"no-store"});
  if(!res.ok) throw new Error("Failed to load catalogue");
  return res.json();
}

function renderCatalogue(data){

  const root=document.getElementById("catalogue-root");
  if(!root) return;

  let html="";

  data.categories.forEach(category=>{

    html+=`<section class="catalogue-category">
            <h2>${category.name}</h2>`;

    if(category.subcategories){

      category.subcategories.forEach(sub=>{

        html+=`
        <h3>${sub.name}</h3>
        <div class="catalogue-grid">`;

        sub.products.forEach(product=>{

          let mainId="img_"+Math.random().toString(36).substring(2);

          let gallery=`
          <div class="image-frame">
            <img src="${product.images[0]}" class="main-img" id="${mainId}">
          </div>`;

          if(product.images.length>1){

            gallery+=`<div class="thumbs">`;

            product.images.forEach(img=>{
              gallery+=`
              <img src="${img}"
              onclick="document.getElementById('${mainId}').src='${img}'">`;
            });

            gallery+=`</div>`;
          }

          html+=`
          <div class="product-card">

            ${gallery}

            <h4>${product.name}</h4>
            <p>${product.description||""}</p>

            <div class="price">${product.price} €</div>

            <a class="buy-btn" href="${product.paymentLink}" target="_blank">
            Buy
            </a>

          </div>`;
        });

        html+=`</div>`;
      });
    }

    html+=`</section>`;
  });

  root.innerHTML=html;
}

document.addEventListener("DOMContentLoaded",async()=>{
  try{
    const data=await loadCatalogue();
    renderCatalogue(data);
  }catch(e){
    console.error(e);
  }
});

})();

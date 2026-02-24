async function loadCatalogue(){

  const root = document.getElementById("catalogue-root");
  if(!root) return;

  const res = await fetch("catalogue.json");
  const data = await res.json();

  root.innerHTML = "";

  data.forEach(product => {

    const card = document.createElement("div");
    card.className = "product-card";

    const mainImage = product.images && product.images.length
      ? product.images[0]
      : "";

    card.innerHTML = `
      <img class="product-main-image" src="${mainImage}">
      
      <div class="product-thumbs">
        ${(product.images || []).map(img => `
          <img src="${img}">
        `).join("")}
      </div>

      <div class="product-title">${product.name}</div>
      <div class="product-desc">${product.description || ""}</div>
      <div class="product-price">${product.price || ""}</div>

      <button class="buy-btn">Buy</button>
    `;

    const main = card.querySelector(".product-main-image");
    const thumbs = card.querySelectorAll(".product-thumbs img");

    thumbs.forEach(t=>{
      t.onclick = () => main.src = t.src;
    });

    root.appendChild(card);

  });
}

loadCatalogue();

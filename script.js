/* script.js — Art & Gifts ONLY */
(async () => {
  const root = document.getElementById("catalogue-root");

  async function loadCatalogue() {
    try {
      const res = await fetch("catalogue-art-gifts.json");
      if (!res.ok) throw new Error("Failed " + res.status);
      return await res.json();
    } catch (err) {
      console.error("Catalogue load failed:", err);
      root.textContent = "Failed to load catalogue.";
      throw err;
    }
  }

  function renderCatalogue(data) {
    root.classList.remove("loading");
    root.innerHTML = "";

    data.categories.forEach(category => {
      const h3 = document.createElement("h3");
      h3.textContent = category.name;
      root.appendChild(h3);

      category.products.forEach(prod => {
        const card = document.createElement("div");
        card.className = "product-card";

        const img = document.createElement("img");
        img.src = prod.images?.[0] || "";
        img.alt = prod.name;
        img.onerror = () => img.style.display = "none";

        const title = document.createElement("a");
        title.href = `product.html?id=${prod.id}`;
        title.textContent = prod.name;

        const price = document.createElement("div");
        price.className = "price";
        price.textContent = prod.price + " USD";

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(price);

        root.appendChild(card);
      });
    });
  }

  try {
    const data = await loadCatalogue();
    renderCatalogue(data);
  } catch (e) {}
})();

/* script.js — Velvet Charms Art & Gifts */

(function () {

  const CATALOGUE_FILE = "catalogue-art-gifts.json";

  async function loadCatalogue() {
    const res = await fetch(CATALOGUE_FILE, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load " + CATALOGUE_FILE);
    return res.json();
  }

  function renderCatalogue(data) {
    const root = document.getElementById("catalogue-root");
    if (!root) return;

    root.classList.remove("loading");

    root.innerHTML = data.map(item => `
      <div class="product-card">
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>${item.description || ""}</p>
      </div>
    `).join("");
  }

  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const data = await loadCatalogue();
      renderCatalogue(data);
    } catch (err) {
      console.error(err);
    }
  });

})();

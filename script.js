/* script.js — Velvet Charms Art & Gifts
   Loads ONLY catalogue-art-gifts.json
*/

(function () {

  const CATALOGUE_FILE = "catalogue-art-gifts.json";

  async function loadCatalogue() {
    const res = await fetch(CATALOGUE_FILE, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load " + CATALOGUE_FILE);
    console.info("Loaded catalogue:", CATALOGUE_FILE);
    return res.json();
  }

  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const data = await loadCatalogue();
      window.VELVET_CATALOGUE = data;
    } catch (err) {
      console.error(err);
    }
  });

})();

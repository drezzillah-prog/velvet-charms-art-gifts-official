/* features.js — Velvet Charms Art & Gifts
   Wishlist only (no cart checkout)
*/

(function () {

  const WISHLIST_KEY = "velvet_wishlist_art_gifts";

  function loadWishlist() {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveWishlist(list) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  }

  function toggleWishlist(id) {
    const list = loadWishlist();
    const idx = list.indexOf(id);
    if (idx >= 0) list.splice(idx, 1);
    else list.push(id);
    saveWishlist(list);
    alert("Wishlist updated");
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-wishlist]").forEach(btn => {
      btn.addEventListener("click", () => {
        toggleWishlist(btn.dataset.wishlist);
      });
    });
  });

})();

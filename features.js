/* features.js — Velvet Charms Art & Gifts
   Wishlist + PayPal.me checkout (LAUNCH VERSION)
*/

(function () {

  const WISHLIST_KEY = "velvet_wishlist_art_gifts";
  const PAYPAL_ME = "https://paypal.me/VelvetCharmsOfficial";

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
    alert("Wishlist updated ❤️");
  }

  function renderWishlist() {
    const root = document.getElementById("vc-wishlist-root");
    if (!root) return;

    const wishlist = loadWishlist();
    root.innerHTML = "<h2>Your Wishlist</h2>";

    if (!wishlist.length) {
      root.innerHTML += "<p>Your wishlist is empty.</p>";
      return;
    }

    const ul = document.createElement("ul");
    ul.style.listStyle = "none";
    ul.style.padding = "0";

    wishlist.forEach(id => {
      const li = document.createElement("li");
      li.style.marginBottom = "10px";
      li.textContent = id;
      ul.appendChild(li);
    });

    root.appendChild(ul);

    const note = document.createElement("p");
    note.innerHTML = `
      <strong>How to pay:</strong><br>
      You will be redirected to PayPal.<br>
      Please write the <em>product name(s)</em> from your wishlist in the PayPal note.
    `;
    note.style.marginTop = "20px";

    const btn = document.createElement("a");
    btn.href = PAYPAL_ME;
    btn.target = "_blank";
    btn.className = "btn";
    btn.textContent = "Pay via PayPal";

    btn.style.display = "inline-block";
    btn.style.marginTop = "10px";

    root.appendChild(note);
    root.appendChild(btn);
  }

  document.addEventListener("DOMContentLoaded", () => {

    // Wishlist buttons in catalogue
    document.querySelectorAll("[data-wishlist]").forEach(btn => {
      btn.addEventListener("click", () => {
        toggleWishlist(btn.dataset.wishlist);
      });
    });

    // Wishlist page
    renderWishlist();
  });

})();

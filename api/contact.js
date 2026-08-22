function formspreeUrl() {
  const configured = String(process.env.FORMSPREE_ENDPOINT || "").trim();
  if (/^https:\/\/formspree\.io\/f\/[A-Za-z0-9_-]+$/.test(configured)) return configured;
  const formId = String(process.env.FORMSPREE_FORM_ID || "").trim();
  return /^[A-Za-z0-9_-]+$/.test(formId) ? `https://formspree.io/f/${formId}` : "";
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const name = String(req.body?.name || "").trim().slice(0, 120);
  const email = String(req.body?.email || "").trim().slice(0, 254);
  const message = String(req.body?.message || "").trim().slice(0, 5000);
  const referencePhotos = Array.isArray(req.body?.referencePhotos)
    ? req.body.referencePhotos.map(value => String(value || "").trim()).filter(Boolean).slice(0, 5)
    : [];
  if (!name || !message || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return res.status(400).json({ error: "Please check your name, email and message." });
  }
  if (referencePhotos.some(pathname => !/^custom-orders\/[A-Za-z0-9._/-]+$/.test(pathname))) {
    return res.status(400).json({ error: "One or more photo references are invalid." });
  }

  const endpoint = formspreeUrl();
  if (!endpoint) {
    return res.status(503).json({ error: "The contact form is being connected. Please try again shortly." });
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        message,
        reference_photos: referencePhotos.length ? referencePhotos.join("\n") : "None",
        reference_photo_count: referencePhotos.length,
        _subject: referencePhotos.length
          ? "New Velvet Charms custom creation request"
          : "New Velvet Charms website message"
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("Formspree submission failed:", response.status, data);
      return res.status(502).json({ error: "The message could not be sent. Please try again." });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Contact submission error:", error);
    return res.status(502).json({ error: "The message could not be sent. Please try again." });
  }
};

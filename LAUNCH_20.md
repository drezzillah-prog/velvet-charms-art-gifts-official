# Velvet Charms launch — 20 essential tasks

1. Hide mixed Art & Gifts bundles from the EU storefront without deleting source SKUs.
2. Block mixed bundles server-side from PayPal order creation.
3. Block mixed bundles server-side from PayPal capture/recovery.
4. Block Epoxy Lamp from checkout pending conformity review.
5. Block Wall Clock from checkout pending conformity review.
6. Add regression tests for EU visibility and checkout gates.
7. Import the exact knitted/felted catalogue family additively from the pinned Body Glow source.
8. Preserve knitted/felted product IDs, names, variants, options and customization fields.
9. Verify every imported knitted/felted image exists in Art & Gifts; copy missing assets without changing Body Glow.
10. Extend curated Romanian pricing for imported products without overwriting existing 33 prices.
11. Implement Velvet Box / Build Your Own for exactly 3–4 currently eligible EU products.
12. Keep Velvet Box on quote/confirmed-price flow rather than inventing a fixed checkout price.
13. Ensure blocked/hidden products cannot be reintroduced through cart state or direct API calls.
14. Update catalogue integrity tests for the additive catalogue while preserving all original 33 products and 118 original image references.
15. Run the complete Art & Gifts test suite and resolve regressions.
16. Fix Studio USA browser UI so both supplier-formula and fragrance gates are visibly/orderably blocked.
17. Add Studio regression coverage for fragrance-gated products and preserve secure PayPal return/capture behavior.
18. Re-audit Studio USA pages/API/docs for stale EU/EUR/art/candle architecture and run Studio Integrity.
19. Verify Body Glow remains unchanged at the pinned source commit and no writes occurred.
20. Verify Vercel project bindings/previews for Art & Gifts and Studio; keep Studio STORE_LIVE disabled until external legal/formula/PayPal launch gates pass.

No merge to main until the applicable automated checks and launch gates pass.

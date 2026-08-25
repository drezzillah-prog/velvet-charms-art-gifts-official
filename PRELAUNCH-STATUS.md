# Velvet Charms Art & Gifts — prelaunch status

Internal handoff only. This file is not customer-facing.

## Completed on the safe preview branch

- 33 products, 6 categories, 14 subcategories and all 118 product-image references preserved.
- Curated Romanian pricing separate from international pricing; Romanian pricing is selected from visitor access geolocation, not shipping address.
- Multi-product cart, quantities, galleries/lightbox and product customization.
- PayPal create/capture with server-side catalogue pricing and exact cart fingerprint binding.
- Customizations, preferred date and private reference-photo metadata are bound to the approved PayPal order.
- PayPal cancel/return handling and idempotent payment recovery.
- Seller handoff after successful payment with order/capture IDs, customer/order details and signed private reference links.
- Custom Creations supports up to five photographs/visual references from the first request.
- Contact and Custom Creation photos use private Vercel Blob storage; seller-side access is through signed private viewer links.
- Shipping disclosure: checkout total is product-only; shipping is separately quoted and never charged without approval.
- EN / RO / FR / IT / DE localization and language persistence.
- Velvet Universe is customer-facing and does not expose internal future roadmap/Artist Editions/seasonal planning.
- Mobile/responsive safeguards and long-text handling.
- robots.txt, sitemap.xml and initial SEO metadata.
- Automated prelaunch suite: catalogue integrity/image count/pricing, capture security, Contact, seller handoff, PayPal return, end-to-end order flow and static page/asset/API-route audit.
- Current branch is ahead of `main` and not behind it. `main` has intentionally not been changed.

## Verified negative checkout scenarios

Automated tests reject changed price/PayPal amount, changed customization, changed preferred date and changed reference pathname after PayPal approval. They also cover failed/non-completed capture and already-completed-order recovery without double capture.

## External / owner/Codex-gated items before production

1. Confirm the real Formspree environment value in Vercel and perform one real Contact/Custom Creation delivery test.
2. Verify a real private Blob upload/view flow in the authenticated deployment environment.
3. Perform one real low-value PayPal transaction only with explicit owner approval.
4. Complete authenticated visual browser QA on representative mobile + desktop viewports, including all five languages and German long-text wrapping.
5. Generate the Art & Gifts team photography using the same 14 generated identities used by Body Glow, with natural varied angles/distances and Art & Gifts activities/products.
6. Supply verified trader/company details before publishing final Terms / Trader Information / Privacy wording.
7. Complete applicable GPSR/category-specific physical-product safety, traceability and online-warning information before affected products are offered for sale.
8. Set final canonical/production-domain metadata after the final domain is confirmed.
9. Merge to `main` / production only after explicit owner approval.

## Do not redo

Do not replace curated RO pricing with direct EUR conversion. Do not use shipping address to decide Romanian pricing. Do not re-enable Resend for the current launch flow. Do not expose internal future-roadmap/Artist Editions/seasonal planning in Velvet Universe. Do not remove products, categories, subcategories, galleries, image references, custom creation upload, current customizations or five-language localization.

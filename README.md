# Poseidon's Eden storefront

Next.js 16 storefront for Poseidon's Eden, reading the catalogue from the Poseidon Medusa backend on Railway
(shared code: Riccodata/nookipets-selfhosted, `STORE_SLUG=poseidon`). Product photos live in the shared R2
bucket under `photos.hello-shop.app/poseidon/`.

- `src/lib/medusa.ts` reads products and categories from the Store API (cached for an hour).
- The ten big departments and their media are listed in `src/lib/site.ts`; each has a landing page at
  `/category/<handle>`.
- Motion assets in `public/media` were generated with Higgsfield and graded/compressed by
  `D:/hello/_migration/tools/prep_media.py` (loops, posters, scroll frame sequences, stills).
- Journal, FAQ, Terms and Privacy content is built from the archived Wix site by
  `scripts/build-content.py` into `src/content/*.json`. FAQ answers that still contain template
  placeholders are held back in `src/content/faq-pending.json`.
- No prices and no checkout yet: products show "Pricing coming soon" and an "Ask about this" email link.
- The site is set to `noindex` (layout metadata and `robots.ts`) until launch.

## Environment

```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://backend-production-ce81487c.up.railway.app
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
```

## Develop

```bash
npm install
npm run dev
```

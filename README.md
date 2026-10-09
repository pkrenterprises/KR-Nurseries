# KR Nurseries — Cloudflare Ready

This package is prepared for Cloudflare Pages / Wrangler deployment.

## Structure

- `public/` — complete static website
- `public/_headers` — security and caching headers
- `public/_redirects` — SPA fallback
- `public/robots.txt` — crawler instructions
- `public/sitemap.xml` — sitemap
- `wrangler.toml` — Cloudflare Pages configuration

## Deploy with Wrangler

1. Install Wrangler: `npm install -g wrangler`
2. Login: `npx wrangler login`
3. From this project directory run:

   `npx wrangler pages deploy public --project-name kr-nurseries`

If the Pages project does not exist yet, Wrangler will prompt you to create it.

## Cloudflare Dashboard

Alternatively create a Pages project in Cloudflare Dashboard and set the build output directory to `public`. This is a static site, so no build command is required.

## Custom domain

After deployment, add your domain under Cloudflare Pages → Custom domains.

### Important admin note

The requested phone-number admin login is browser-side only. It is not secure authentication and gallery changes are stored in that browser's localStorage. For a production multi-device admin panel, connect authentication and image storage to a backend/database.


### Delivery policy
Delivery is available across Andhra Pradesh, Telangana, Tamil Nadu and Karnataka. Free delivery applies to agricultural product orders above 3,000 quantity; delivery terms may vary by product and destination.

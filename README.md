# Stonebridge Finance

A fictional online banking site built with Next.js, TypeScript, Tailwind CSS,
and Framer Motion, for a school project. Public marketing site + a full mock
banking dashboard (accounts, transfers, bill pay, cards, loans, statements,
analytics) behind a Customer ID → password → OTP login. All data is
in-memory mock data — nothing here touches a real bank.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Sample sign-in credentials are documented separately (ask whoever gave you
this repo, or check chat history) — the dashboard only accepts the five
seeded demo profiles in `src/lib/mock-data.ts`.

## Project structure

- `src/app/` — routes. `/` is the public marketing site; `/login`,
  `/login/otp`, `/register` are the auth flow; everything under
  `/dashboard` is the signed-in app.
- `src/components/` — UI components, split into marketing (top-level) and
  `dashboard/` (signed-in app) folders.
- `src/lib/` — mock data, the auth context, the bank-data context (all
  account/transaction/card state lives here, in memory), and small
  formatting helpers.

## Deploying to Vercel

1. Push this repo to GitHub (see below).
2. Go to [vercel.com/new](https://vercel.com/new), import the repo — Vercel
   auto-detects Next.js, no config needed.
3. Deploy. You'll get a `*.vercel.app` URL immediately.
4. Once you buy a domain, add it under **Project → Settings → Domains** and
   follow Vercel's DNS instructions (usually an `A`/`CNAME` record at your
   registrar).
5. Add an environment variable so metadata, the sitemap, and canonical URLs
   point at your real domain instead of the Vercel preview URL:
   **Project → Settings → Environment Variables**
   ```
   NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com
   ```
   Redeploy after adding it (Vercel prompts you to).

## Pushing to GitHub

```bash
git add .
git commit -m "Ready for deploy"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

If the local repo already has commits (it does — this was scaffolded with
`git init`), just add the remote and push.

## Getting indexed on Google

The site is already wired for this — here's what's in place and what you
need to do once the domain is live:

**Already done:**
- `robots.txt` (`/robots.txt`) — allows the public homepage, blocks
  `/dashboard`, `/login`, `/register` from being crawled.
- `sitemap.xml` (`/sitemap.xml`) — lists the homepage.
- Per-page `noindex` on every signed-in and auth page, so only `/` can ever
  appear in search results.
- Open Graph + Twitter card meta tags and a generated share image
  (`/opengraph-image`), so links posted on social/Slack/iMessage show a
  proper preview card.
- `BankOrCreditUnion` structured data (JSON-LD) on the homepage.
- A generated favicon, Apple touch icon, and web app manifest.

**Once you own the domain:**
1. Set `NEXT_PUBLIC_SITE_URL` in Vercel (see above) and redeploy.
2. Confirm `https://yourdomain.com/sitemap.xml` and
   `https://yourdomain.com/robots.txt` load and reference the right domain.
3. Go to [Google Search Console](https://search.google.com/search-console),
   add your domain as a property, and verify ownership (Search Console will
   give you a DNS TXT record to add at your registrar — this is the easiest
   verification method and covers the whole domain).
4. Under **Sitemaps**, submit `https://yourdomain.com/sitemap.xml`.
5. Use **URL Inspection** on your homepage and click **Request Indexing**.

Indexing isn't instant — it can take anywhere from a few hours to a couple
of weeks for Google to crawl and show the page in results, even after
you've done everything above.

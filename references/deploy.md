# Deploy and domain

The setup that worked: code on **GitHub** (a private repo is fine), hosting on **Vercel** connected to it, so pushing `main` publishes the site and every other branch gets its own private preview URL. Vercel's free Hobby plan covers a personal portfolio. Netlify and Cloudflare Pages work much the same way, so if they prefer one of those, adapt the steps.

## 1. GitHub

- If they don't have an account, they create one at github.com.
- The repo was started in phase 2 (`git init -b main`). From the repo root, with the GitHub CLI signed in: `gh repo create <name> --private --source . --push`. Explain that private means only they can see the code; the site itself is still public.
- Before the first push, check `.gitignore` covers `node_modules/`, `dist/`, `dist-ssr/`, `.env*`, `.vercel`, `.DS_Store` and their private `references/` folder (`templates/gitignore`). Run `git status` and look at what's about to go up: no client material they're not allowed to share, no secrets.

## 2. Vercel

They sign up at vercel.com with their GitHub account (they do this part in the browser), then **Add New → Project**, import the repo, and set:
- **Root Directory: `site`.** This one matters: the app is in a subfolder.
- Framework preset Vite, install `pnpm install`, build `pnpm build`, output `dist`. `templates/site/vercel.json` (placed in `site/`) sets these too, so the dashboard and the repo agree.

After the first deploy they get a `*.vercel.app` address. Set `siteUrl` to it until they have a domain. Check it loads, then check a page that doesn't exist returns the 404 page.

What they get from then on:
- push to `main` → production;
- push any other branch → a preview deployment with its own URL. Under **Settings → Deployment Protection**, Vercel Authentication keeps previews visible only to their Vercel account, which is useful for unfinished case studies.

To check headers and rewrites, test a preview deployment with `curl -I <url>`; the local dev server doesn't apply `vercel.json`.

## 3. Security headers

`templates/site/vercel.json` sends a few low-risk headers on every response: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a `Permissions-Policy` that turns off camera, microphone and location, and `X-Frame-Options: SAMEORIGIN`. Skip a strict Content-Security-Policy unless they want to maintain one; analytics and embeds keep breaking it.

## 4. Their own domain

If they don't have one, they buy it at a registrar (Cloudflare Registrar sells at cost; Namecheap, Porkbun or Vercel itself also work). Buying is their action.

1. In Vercel: **Project → Settings → Domains → Add**: add `example.com` and `www.example.com`, and set `www` to redirect to the bare domain (or the reverse; pick one address and stick with it).
2. Vercel shows the DNS records to create, usually an `A` record for the apex and a `CNAME` for `www`. Use the exact values Vercel shows; they change over time.
3. At their DNS provider, they create those records. **On Cloudflare, set them to "DNS only" (grey cloud), not proxied.** Vercel issues the HTTPS certificate and runs its own CDN; a Cloudflare proxy in front double-caches and breaks certificate renewal.
4. **Leave email records alone.** If the domain already has MX, SPF (TXT) or DKIM records for email, don't touch or delete them. Only add or replace the `A`/`CNAME` records for the website.
5. If the domain pointed at an old site (Framer, Squarespace…), replace those old `A`/`CNAME` records rather than adding next to them.
6. Wait for Vercel to show the domain as valid (minutes, occasionally an hour), then load it.

Afterwards:
- Change `siteUrl` in `src/content/site.ts` to the domain, rebuild and push, so canonical links and previews use it.
- Add a permanent redirect from the `*.vercel.app` production alias to the domain, so there's one address. Do this only once the domain works, or the live site redirects to a domain that doesn't answer yet:

  ```json
  "redirects": [
    { "source": "/:path*", "has": [{ "type": "host", "value": "their-project.vercel.app" }], "destination": "https://example.com/:path*", "permanent": true }
  ]
  ```
- If their old site had URLs people may have saved, add permanent redirects for those paths in `vercel.json`, to the matching new page or to `/`.
- If an old URL needs a different trailing-slash or casing variant, test both.

## 5. After launch

- Paste a few page URLs into LinkedIn's Post Inspector and a Slack message to check the preview cards.
- Submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools.
- Ask an AI agent to summarise a case-study URL to confirm it can read the prerendered text.

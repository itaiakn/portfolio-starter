# Pages, link previews and crawlers

A Vite + React site normally sends an empty `<div id="root">` and builds the page in the browser. People see the page, but anything that reads the raw HTML doesn't: LinkedIn and Slack link previews, many AI agents (a recruiter asking ChatGPT or Claude "summarise this portfolio"), some search engines. This phase fixes that, and sets clear rules for who may index what.

## Prerender every page at build time

The build renders each page to HTML once, with React's `renderToString`, and writes it to `dist/<page>/index.html`. In the browser the app then replaces that HTML before the first paint, so visitors see no difference. The pieces, all in `templates/site/`:

| File | Job |
|---|---|
| `src/routes.tsx` | Every page by path (`'/': Home, '/project-x': ProjectX, '/404': NotFound`), shared by the browser and the build. Also `pages`: title and one line per page, for `llms.txt` |
| `src/main.tsx` | Picks the page for `location.pathname` (or `/404`) and renders it |
| `src/entry-server.tsx` | `render(path)` for the build, plus `llms()` |
| `scripts/prerender.mjs` | After the client and server builds: writes each page's HTML, moves its `<title>`/`<meta>` into `<head>`, writes `404.html`, `sitemap.xml`, `llms.txt`, and adds the sitemap line to `robots.txt` |
| `package.json` `build` | `tsc -b && vite build && vite build --ssr src/entry-server.tsx --outDir dist-ssr && node scripts/prerender.mjs` |

Add `dist-ssr/` to `.gitignore`.

**The one rule this adds:** code that runs while a component renders must not touch browser-only APIs (`window`, `document`, `localStorage`, `matchMedia`). Read them in `useEffect` or event handlers, or guard with `typeof window !== 'undefined'`. Otherwise the build fails, loudly, which is the good kind of failure. Put this rule in CLAUDE.md.

The browser app renders fresh rather than "hydrating" the server HTML. Hydration saves a little work but breaks on any difference between the two renders. Keeping it simple was the right call for a portfolio.

Simple routing: one entry per page in `routes.tsx`, plain `<a href>` links between pages. A portfolio of under twenty pages doesn't need a router library, and real page loads make the view transitions in `extras.md` work.

## Page titles and link previews: `PageMeta`

Every page renders `<PageMeta title description path image? noindex? />` first (`templates/site/src/components/PageMeta.tsx`). It outputs the title, description, canonical URL and the Open Graph / Twitter tags link previews read. React 19 moves these tags into `<head>` in the browser, and the prerender moves them there in the static HTML.

- **One source for the address:** `siteUrl` in `src/content/site.ts`. Before the first deploy there's no address yet: leave the placeholder, then set it to the `*.vercel.app` address Vercel gives them, and to their domain once it's connected. Canonical links, preview tags, the sitemap and `llms.txt` all read it, so moving to a new domain is a one-line change.
- **Titles** like "Project name - Their Name". Descriptions in their own words, not generated filler.
- **Share cards** (`og:image`): a 1200×630 PNG per page in `public/images/share/`, passed as `image="/images/share/home.png"`. PNG because every preview reader accepts it. Without `image`, `PageMeta` leaves the image tags out, so a page never points at a missing file. See `extras.md` for generating them.

## A real 404

Don't use a "send every path to index.html" fallback. It answers every typo'd URL with the homepage and a 200 status, which search engines count as a "soft 404". Instead, the prerender writes `dist/404.html` from a `NotFound` page, which Vercel serves with a real 404 status for any path that isn't a page. On Vercel each page also gets an explicit rewrite to its file (`templates/site/vercel.json`), with or without a trailing slash.

## Who may read what: search engines, agents, AI training

Ask them what they want before writing any rules. Typical wishes:
1. The homepage findable on Google.
2. Case studies with client work **readable by a person or an agent they send the link to**, but not listed in search results.
3. Their images and some or all pages kept out of AI training sets.

The key rule: **use `noindex`, not robots.txt `Disallow`, to keep a page out of search.**
- `noindex` (an `X-Robots-Tag: noindex, noarchive` header from `vercel.json`, plus `<meta name="robots" content="noindex, noarchive">` in the page via `PageMeta`'s `noindex`): the crawler fetches the page, sees the tag and leaves it out. Agents can still read it.
- `Disallow` in robots.txt does the opposite of what people expect: a crawler that can't fetch the page never sees its noindex, Google can still list a disallowed URL it finds linked elsewhere, and agents that respect robots.txt are turned away.

So: robots.txt for *fetching* (images, AI-training crawlers), noindex for *search listing*. `templates/site/robots.txt` shows the pattern:
- `User-agent: *` blocks only `/images/`, with an `Allow` line for each image that may be fetched: `/images/share/`, always, because link-preview bots (Twitterbot, LinkedInBot) respect robots.txt and would otherwise show cards with no image, plus anything else they want findable, such as a portrait. The share cards also get an `X-Robots-Tag: noindex` header in `vercel.json`, so preview bots can fetch them but they stay out of image search. The AI-training group below doesn't inherit the `Allow`, so the cards stay blocked for it.
- A separate group for AI-training crawlers (GPTBot, ClaudeBot, CCBot, Google-Extended, Applebot-Extended, Bytespider, meta-externalagent, …) that blocks images and any sensitive page. A crawler with its own group doesn't inherit `*`'s rules, so the group repeats them.
- Agents that fetch a page only when a person asks (ChatGPT-User, Claude-User, Perplexity-User) stay out of that group, so a recruiter's agent still works.
- Lists of crawler names change. Check each vendor's crawler page or darkvisitors.com for the current list.

Also: `rel="nofollow"` on internal links to noindex pages, and a résumé PDF can get the same noindex header (plus `Content-Disposition: inline` so browsers show it instead of downloading it). In `vercel.json` `headers`:

```json
{ "source": "/resume.pdf", "headers": [
  { "key": "X-Robots-Tag", "value": "noindex, noarchive" },
  { "key": "Content-Disposition", "value": "inline; filename=\"resume.pdf\"" }
] }
```

## sitemap.xml and llms.txt

- **`sitemap.xml`** lists only the pages meant for search (often just the homepage). The prerender writes it and appends `Sitemap: <siteUrl>/sitemap.xml` to robots.txt. Once the site is live they can submit it in Google Search Console (verify the domain with a DNS TXT record) and Bing Webmaster Tools.
- **`llms.txt`** (llmstxt.org): a short plain-text map of the site for agents: who they are in two lines, links to the résumé, LinkedIn and email, and each page with one line about it. Built from `pages` in `routes.tsx`.

## Adding a page later

Write this checklist into their CLAUDE.md: an entry in `routes` (and `pages`), a rewrite in `vercel.json`, a `PageMeta`, and, if it's a noindex page, its path in the noindex header rule.

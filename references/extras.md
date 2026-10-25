# Extras

Small things that made the original site feel finished. Offer them; none is required.

## Page transitions between pages

Modern browsers can crossfade between pages on ordinary link clicks, with one CSS rule and no JavaScript router:

```css
@view-transition { navigation: auto; }
::view-transition-old(root) { animation: page-fade-out .2s ease-out both; }
::view-transition-new(root) { animation: page-rise-in .4s cubic-bezier(.2, .7, .2, 1) both; }
@keyframes page-fade-out { to { opacity: 0; } }
@keyframes page-rise-in { from { opacity: 0; transform: translateY(12px); } }
@media (prefers-reduced-motion: reduce) { ::view-transition-old(root), ::view-transition-new(root) { animation: none; } }
```

Chrome, Edge and Safari 18.2+ animate it; other browsers just load the page. For the new page to fade in with its content instead of a blank screen, the app has to render before the first paint:
- the entry script tag is `blocking="render"` in `index.html`;
- `main.tsx` renders inside `flushSync(...)`;
- Vite drops `blocking="render"` from the built script tag, so a tiny plugin puts it back (`templates/site/vite.config.ts`).

## Favicon, Apple touch icon, theme colour

`public/favicon.png` (48px) and `public/apple-touch-icon.png` (180px), linked from `index.html`, plus `<meta name="theme-color">`. A face or a simple shape reads at 16px; initials in a display font usually smudge.

## Share cards, generated rather than hand-made

Instead of designing a 1200×630 card per page in Figma, you can render them from the site's own pieces with headless Chrome: a small script builds an HTML page per card (cover image, name, title, in the site's fonts and colours), screenshots it at 1200×630, and writes it to `public/images/share/`. They then stay in step with the covers and copy. Rerun the script after changing a cover. Ask Claude to write one if they want this. Puppeteer or Playwright, installed in a scratch folder, works well.

## Analytics

Optional, and their choice. Lightweight options: Vercel Web Analytics (one toggle in the dashboard plus a small package), Plausible or Umami (privacy-friendly, cookieless), Microsoft Clarity (free heatmaps and session recordings; uses cookies, so mention consent if they have EU visitors). Whatever they pick, skip it on localhost so their own visits don't count:

```js
if (!/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) { /* load the tag */ }
```

## Email links that copy

People on a laptop often have no mail app set up, so `mailto:` opens something unwanted. The pack's `EmailLink` copies the address and shows a "copied" toast when clicked with a mouse, and opens the mail app on phones. It uses shadcn `sonner` for the toast.

## Small accessibility and polish items

- Visible focus rings on everything clickable; check by tabbing through a page.
- Respect `prefers-reduced-motion` on every animation and autoplaying video.
- External links open in a new tab with `rel="noreferrer"`.
- `text-wrap: pretty` on paragraphs and `balance` on headings avoids single-word last lines.
- A "back to top" button on long case studies (`BackToTop` in the pack).
- Check the site at 360px wide (small Android phones) as well as a common iPhone width.

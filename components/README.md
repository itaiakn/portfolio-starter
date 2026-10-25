# Component pack (optional)

A small set of React components for showing work on a portfolio: a full-screen image preview, image pairs and before/after comparisons, a draggable before/after slider, a looping demo video, quotes, a top bar with a phone menu, a back-to-top button, email links that copy the address, and page meta tags.

They're ported from a working portfolio, keeping the **behaviour**: keyboard and screen-reader support, focus that returns where it came from, `prefers-reduced-motion` and `prefers-reduced-transparency`, lazy loading, real image sizes so nothing shifts, and safe server rendering (nothing touches `window` or `document` while rendering, so prerendering with `renderToString` works).

The **look** is deliberately plain. It's built from your shadcn theme tokens (`--muted`, `--border`, `--background`, `--foreground`, `--radius`, …), so it follows your colours and dark mode, and it's meant to be replaced by your own design. Nothing here is required; take the pieces you want.

## Install

The pack expects a Vite + React 19 + TypeScript project with Tailwind CSS v4, shadcn/ui on the **Radix** base, lucide-react icons and the `@` import alias.

1. **shadcn on the Radix base.** The components use Radix's `asChild`. shadcn's `--defaults` picks the Base UI base, which has no `asChild`, so choose Radix when you init:

   ```sh
   pnpm dlx shadcn@latest init -t vite -b radix -p nova --no-monorepo
   pnpm dlx shadcn@latest add button dialog sonner
   ```

   Any Radix preset works (`-p` picks the look). If the project already uses the Base UI base, the components need `asChild` swapped for Base UI's `render` prop and the Lightbox's `onCloseAutoFocus` for `finalFocus`.

2. **Copy the files** into `src/`:

   | From this folder | To |
   |---|---|
   | `kit/*.tsx` | `src/components/kit/` |
   | `lib/email.ts` | `src/lib/email.ts` |
   | `content/site.ts` | `src/content/site.ts` (if you already have one, just add the missing `siteName`, `siteUrl` or `siteEmail` exports) |
   | `kit.css` | `src/kit.css` |

   If the project already has a `PageMeta` component, keep one of the two.

3. **Import the styles** after your Tailwind/shadcn CSS, either in `main.tsx`:

   ```ts
   import './index.css'
   import './kit.css'
   ```

   or at the end of the imports in `index.css`: `@import "./kit.css";`. Keep it unlayered (don't wrap it in `@layer`): a few rules have to win over shadcn's own classes on the dialog and buttons.

4. **Edit `src/content/site.ts`**: your site's address, your name and your email.

5. **Mount the global pieces once**, next to your app (in `main.tsx` or your root layout):

   ```tsx
   import { Toaster } from '@/components/ui/sonner'
   import { BackToTop } from '@/components/kit/BackToTop'

   <App />
   <BackToTop />
   <Toaster position="bottom-center" />
   ```

   The Toaster is needed for the "Email copied" message. For a small centered pill instead of sonner's card, use `<Toaster position="bottom-center" toastOptions={{ unstyled: true, classNames: { toast: 'kit-toast' } }} />`.

Then run `pnpm build` to check everything type-checks.

### Which shadcn components each piece needs

All of them use `lucide-react`.

| Component | shadcn |
|---|---|
| `Lightbox`, `ImageLightbox` | `button`, `dialog` |
| `MediaPair`, `MediaCompare` (with `ImageLightbox` inside) | `button`, `dialog` |
| `BeforeAfterSplit` | `button`, `dialog` |
| `LoopVideo` | `button` |
| `MediaPlaceholder`, `UserQuote`, `PageMeta` | none |
| `BackToTop`, `TopBar` | `button` |
| `EmailLink`, `lib/email.ts` | `sonner` (with the `Toaster` mounted) |

## Restyling

Everything visual lives in `kit.css`. Start with the `--kit-*` variables at the top: surface colour, radius and padding, media radius and shadow, gaps, caption size, control radius (`999px` makes floating controls round; set it to `var(--radius)` for squarer ones), focus ring, top bar height and width, glass tint, scrim, toast colours. Phone values sit in the `max-width: 43.75rem` block right under them. Then edit any rule directly; the file is yours. Class names all start with `kit-`.

## Components

### `ImageLightbox`
An image on a media surface that opens full screen on click (or Enter/Space), with the caption above it. Focus returns to the image on close. Lazy-loads unless `eager`.

Props: `src`, `alt`, `width`, `height` (the image's real pixel size), `caption?` (defaults to `alt`), `eager?` (for an image near the top of the page), `cutout?` (a transparent PNG with its own edges and shadow: no frame drawn around it), `shaped?` (a transparent PNG of separate UI pieces: the shadow follows the pieces, and the preview keeps a surface behind them), `zoom?` (`false` for a plain image with no preview), `className?`.

```tsx
<ImageLightbox src="/images/dashboard.webp" alt="The new dashboard" width={2400} height={1500} />
```

### `Lightbox`
The full-screen preview `ImageLightbox` and `BeforeAfterSplit` use, on the shadcn `Dialog` (focus trap, Escape, outside click, scroll lock). Use it directly to preview anything else.

Props: `caption`, `children` (what to show), `trigger?` (the element that opens it), or `open?` + `onOpenChange?` to control it yourself, with `returnFocusTo?` (a function returning the element to focus on close, since without a `trigger` Radix doesn't know where focus came from).

```tsx
<Lightbox caption="Flow diagram" trigger={<button type="button">Open diagram</button>}>
  <img className="kit-lightbox-media" src="/images/flow.png" alt="Flow diagram" width={3000} height={1800} />
</Lightbox>
```

### `MediaPair`
Two or more related images on one surface, each with an optional label. Side by side (three in a row, four as a 2×2 grid), `stacked`, or `portrait` (phone screens in narrow centered columns that stay side by side on phones). A single labelled item gives one visual a title inside its surface.

Props: `items: { label?, media }[]`, `layout?: 'side-by-side' | 'stacked' | 'portrait'`.

```tsx
<MediaPair layout="portrait" items={[
  { label: 'Home', media: <ImageLightbox src="/images/home.webp" alt="Home screen" width={1170} height={2532} /> },
  { label: 'Search', media: <ImageLightbox src="/images/search.webp" alt="Search screen" width={1170} height={2532} /> },
]} />
```

### `MediaCompare`
Before and after on one surface, labelled "Before" and "After". `narrow` puts tall, thin strips (a side menu) in two slim columns that stay side by side on phones.

Props: `before`, `after` (any media), `layout?: 'side-by-side' | 'stacked' | 'narrow'`.

```tsx
<MediaCompare before={<ImageLightbox src="/images/old.webp" alt="Old settings page" width={1600} height={1000} />}
  after={<ImageLightbox src="/images/new.webp" alt="New settings page" width={1600} height={1000} />} />
```

### `BeforeAfterSplit`
One image you can switch between Before, After and Split, with a divider you drag anywhere on the image. The divider is a keyboard slider (arrows ±2%, Shift ±10%, Home/End), vertical swipes still scroll the page on touch, and in Before or After the image opens full screen (the preview keeps the current mode, and the divider stays in sync). A missing image shows a labelled placeholder instead of a broken icon.

Props: `label` (names the mode control for screen readers), `caption` (for the full-screen preview), `before` and `after`: `{ src, alt, placeholder, width, height }` (`placeholder` is the text shown if the file is missing).

```tsx
<BeforeAfterSplit label="Compare the old and new checkout" caption="Checkout, before and after"
  before={{ src: '/images/checkout-old.webp', alt: 'Old checkout', placeholder: 'Old checkout', width: 1600, height: 1000 }}
  after={{ src: '/images/checkout-new.webp', alt: 'New checkout', placeholder: 'New checkout', width: 1600, height: 1000 }} />
```

### `LoopVideo`
A short silent UI demo: muted, looping, plays only while on screen, stays paused under reduced motion, with a pause/play button. Loads only its metadata until it plays.

Props: `src`, `poster` (an image shown before it plays), `label` (describes the video), `width`, `height`.

```tsx
<LoopVideo src="/videos/drag-and-drop.mp4" poster="/videos/drag-and-drop.jpg" label="Reordering cards by dragging" width={1920} height={1080} />
```

### `MediaPlaceholder`
A labelled, dashed stand-in for media you haven't exported yet.

Props: `label`, `note?`, `kind?: 'image' | 'video'`, `ratio?` (CSS aspect ratio, default `16 / 10`).

```tsx
<MediaPlaceholder label="Onboarding flow" note="Export from Figma" kind="video" />
```

### `UserQuote`
Someone's words, in quotation marks behind a rule, with an optional line saying who said it.

Props: `children` (the words, without quotation marks), `cite?`.

```tsx
<UserQuote cite="Operations manager">I can finally find the report I need.</UserQuote>
```

### `TopBar`
A bar fixed to the top of every page: an optional Back button, your name linking home, and your links on the right. Transparent at the top of the page, glass with a hairline once the page scrolls (solid under reduced transparency). On phones the links fold into a burger menu over the whole screen: the page behind stops scrolling, Escape closes it and puts focus back on the burger, and tapping a link closes it. With `revealAfter`, the bar stays hidden until a given element (say, the links in your hero) has scrolled past the top, then slides in, so the two sets of links never show together. In-page anchors scroll clear of the bar.

Props: `name` (text or a logo), `homeHref?` (default `/`), `back?` (an href; shows the Back button), `backLabel?`, `children?` (the links, as siblings), `menu?` (different content for the phone menu), `revealAfter?` (a selector), `width?` (a CSS length the contents align to, such as your page column's width).

Leave room for the bar at the top of the page (`padding-top: var(--kit-topbar-height)` or more).

```tsx
<TopBar name="Your Name" back="/#work">
  <Button asChild variant="ghost"><a href="/#work">Work</a></Button>
  <Button asChild variant="ghost"><a href="/#about">About</a></Button>
  <Button asChild variant="ghost"><a href={mailto()} onClick={onEmailClick}>Email</a></Button>
</TopBar>
```

### `BackToTop`
A round button, bottom right, that appears after most of a screen of scrolling. It scrolls up smoothly (instantly under reduced motion) and moves keyboard focus to the page's heading. Mount it once for the whole site.

Props: `focusTarget?` (selector, default `main h1`), `after?` (screen heights scrolled before it shows, default `0.8`).

### `EmailLink` and `lib/email.ts`
An email address as a link. With a mouse, clicking copies the address and shows "Email copied to clipboard" (falling back to the mail app if the clipboard is unavailable); on phones and tablets it opens the mail app as usual. The address comes from `siteEmail` in `src/content/site.ts` unless you pass one.

`EmailLink` props: `address?`, `children?` (link text; defaults to the address), `className?`. For your own email buttons, use `mailto(address?)` for the href and `onEmailClick` as the click handler; it reads the address from the link's `href`.

```tsx
<p>Write to me at <EmailLink />.</p>
<Button asChild variant="outline"><a href={mailto()} onClick={onEmailClick}>Email me</a></Button>
```

### `PageMeta`
Each page's `<title>`, description, canonical URL and link-preview tags (Open Graph and Twitter cards), built from `siteUrl` and `siteName` in `src/content/site.ts`. Render it first in each page; React 19 moves the tags into `<head>` in the browser, and a prerender step has to move them there in the static HTML.

Props: `title`, `description`, `path` (such as `/` or `/projects/checkout`), `image?` (a share card: a path under `public/` or a full URL; 1200×630 unless you pass `imageWidth` / `imageHeight`), `noindex?` (keeps the page out of search results while leaving it readable).

```tsx
<PageMeta title="Checkout redesign - Your Name" description="How we cut checkout to one page." path="/projects/checkout" image="/images/share/checkout.png" noindex />
```

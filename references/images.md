# Images and media

A portfolio is mostly images, so they decide how fast it feels. Large PNG screenshots are usually most of a page's weight, and converting them often cuts it by two thirds or more with no visible difference.

## Formats

| What | Format | Why |
|---|---|---|
| Screenshots and UI over ~300 KB as PNG | **WebP**, lossless if that stays under ~300 KB, otherwise lossy at quality 90 | Keeps UI text crisp when someone opens the image full screen; WebP keeps transparency, unlike JPEG |
| Transparent cutouts (a portrait, UI pieces) | WebP with alpha kept (`alphaQuality: 100`) | JPEG has no transparency |
| Photos | WebP (lossy ~80–90) or JPEG | |
| Small PNGs (under ~300 KB) | Leave as they are | Not worth the churn |
| Link-preview share cards | PNG | Every preview reader accepts it |
| Short UI demos | MP4 (H.264), muted, plus a JPEG poster frame | Plays everywhere |

Not AVIF for now: slower to encode, and older Safari can't show it.

## Converting

`sharp` does it well. Install it in a scratch folder rather than as a project dependency, since the site doesn't need it at runtime:

```js
// node convert.mjs in/ out/
import sharp from 'sharp'
await sharp(src).webp({ lossless: true }).toFile(out)                    // try first
await sharp(src).webp({ quality: 90, alphaQuality: 100 }).toFile(out)    // if lossless is over budget
```

Keep the original full-size exports somewhere outside `site/` (a `design-sources/` folder, or the private `references/`), never in `dist/`.

## No layout shift

Give every `<img>` its real pixel `width` and `height` attributes (and keep CSS `height: auto`). The browser then reserves the right space before the image loads, so the page doesn't jump as images arrive. Ask Claude to read the real dimensions from the files (`sips -g pixelWidth -g pixelHeight file` on a Mac) rather than guess.

`loading="lazy"` on everything below the first screen; `eager` on the hero.

## Transparent images

A transparent PNG or WebP in a box with a CSS `box-shadow` gets a shadow around the empty rectangle, not around the shape. Either the image carries its own shadow (no CSS shadow on it), or use `filter: drop-shadow(...)`, which follows the shape. The component pack's `ImageLightbox` has `cutout` and `shaped` props for exactly this.

## Video

- Short silent loops (a UI interaction): autoplay muted, loop, `playsInline`, play only while on screen, never autoplay under `prefers-reduced-motion`, with a visible pause button. That's the pack's `LoopVideo`.
- Trim loops so the last frame matches the first; a short crossfade at the seam hides a jump.
- Long videos with sound: host them on YouTube, Vimeo or LinkedIn and embed lazily, with a plain "Watch on …" link under the frame for when a browser extension blocks it.

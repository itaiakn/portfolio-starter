# The project

A small, standard stack that Claude knows well and that grows with the site: **React + TypeScript + Vite**, **Tailwind CSS v4**, **shadcn/ui** components, **lucide-react** icons and fonts from **Fontsource**. Every part of it is free and widely used, which means the docs and Claude's knowledge both cover it well.

Why this and not a site builder (Framer, Webflow): full control of every pixel and behaviour, no monthly fee, and the code is theirs. Why not Next.js: a portfolio doesn't need a server, and Vite is simpler to reason about. Prerendering (see `pages-and-crawlers.md`) still gives every page real HTML. If they'd rather use Next.js or Astro, that's fine. Most of the other phases still apply.

## Folder layout

Put the web app in a `site/` subfolder of the repository, not at the root:

```
my-portfolio/            ← git repository root
  CLAUDE.md              ← the spec (see working-with-claude.md)
  docs/decisions.md
  references/            ← private inspiration, gitignored
  .claude/launch.json
  site/                  ← the Vite app; Vercel's Root Directory
    package.json
    index.html
    public/  (images, favicon, robots.txt, résumé PDF)
    src/
    scripts/
```

It keeps notes, references and design source files beside the app without shipping them, and it matches the Vercel setup in `deploy.md`.

## Create it

Check the current docs first. The intent of each step:

1. **Scaffold Vite with React + TypeScript** in `site/`: `pnpm create vite@latest site --template react-ts`, then `pnpm install` inside it.
2. **Tailwind v4** through its Vite plugin (`tailwindcss` and `@tailwindcss/vite`), with `@import "tailwindcss";` at the top of `src/index.css`. v4 needs no `tailwind.config.js`; theme values live in CSS.
3. **The `@` import alias** (`@/components/...`): in `vite.config.ts` (`resolve.alias`, as in `templates/site/vite.config.ts`) and as `"paths": { "@/*": ["./src/*"] }` under `compilerOptions` in both `tsconfig.json` and `tsconfig.app.json`. shadcn needs it. Leave out `baseUrl`, even though shadcn's guide still shows it: TypeScript 6 rejects it (`TS5101: Option 'baseUrl' is deprecated`), and `paths` works without it.
4. **shadcn/ui:** from `site/`, `pnpm dlx shadcn@latest init -t vite -b radix -p nova --no-monorepo` (this worked with shadcn 4.22). Choose the **Radix** base (`-b radix`): the default is now Base UI, which has no `asChild` prop, and the optional component pack and most examples online rely on `asChild`. The preset (`nova`, `vega`, `maia`, `lyra`, `mira`, …) only sets the starting look; let them choose, or pick one and explain they can change the theme later in `index.css`. The preset picks lucide icons and may install and import a font of its own (nova adds Geist in `index.css`): keep it or swap it for theirs, but don't end up importing two. `--yes` skips the prompts. Then add components only as they're needed: `pnpm dlx shadcn@latest add button dialog`. Current shadcn writes `export { cn } from "cn"` in `src/lib/utils.ts`; that's its own drop-in for clsx + tailwind-merge, so leave it.
5. **pnpm build scripts:** pnpm 10+ blocks dependencies' install scripts unless allowed. If the build complains that esbuild isn't built, allow it (`pnpm approve-builds`, or `onlyBuiltDependencies` / `allowBuilds` in `pnpm-workspace.yaml`, depending on their pnpm version).
6. **Start the repository:** `git init -b main` at the repo root (`-b main` because Apple's git still defaults to `master`, and the deploy steps push `main`), copy `templates/gitignore` to `.gitignore`, and delete the `site/.gitignore` Vite made, since the root one covers it. Before the first commit, check `git config user.name` and `user.email`; if they're empty, ask which name and email they want on commits (GitHub offers a private `noreply` address).
7. **Run it:** set up `launch.json` (see `preview.md`) and open the preview. Seeing the Vite starter page in the app is the first real milestone; celebrate it, then commit.
8. **Clear the starter content** when they're ready to build their own: delete `src/App.tsx`, `App.css`, `src/assets/`, and the starter `public/` icons and `site/README.md`, and replace `index.html` with `templates/site/index.html`. Phase 5's page setup replaces `App.tsx` with `src/pages/Home.tsx`, so it's natural to do this then. Keep a linter config if Vite added one.

### shadcn, briefly, for them

shadcn isn't a library you install once. Its CLI copies the source of each component into `src/components/ui/`, where it belongs to them and can be edited like any other file. Prefer a shadcn component over hand-building one (dialogs, carousels, toasts, charts), because shadcn's are accessible out of the box. Write a rule into `CLAUDE.md`: "Use shadcn/ui first; add components with `pnpm dlx shadcn@latest add <name>` from `site/`."

### Icons

`lucide-react` (`import { ArrowRight } from 'lucide-react'`). One icon set keeps the site consistent. For a brand mark Lucide doesn't draw well or at all (it is phasing out brand logos such as LinkedIn's), draw a small custom icon on Lucide's 24px grid with the same 2px stroke, and keep all custom icons in one file such as `src/components/icons.ts`.

## Fonts

Install fonts as packages from Fontsource (`pnpm add @fontsource-variable/inter`) and import them once in `main.tsx`. The site then serves the font files itself: no Google Fonts request, nothing loaded from another company's server, and no flash of the wrong font from a slow CDN.

- **Licence:** only fonts free for commercial use (SIL Open Font License covers nearly all of Fontsource). A portfolio is used to get paid work.
- **Variable** packages (`@fontsource-variable/...`) give every weight in one file.
- To choose a font, a hidden comparison switcher (the same page in 3–6 candidate fonts, sizes held constant) helps more than looking at specimens. Offer it if they're undecided.

## Habits that saved time on the original project

- **Never keep anything you care about in `dist/`.** Every build wipes it. The original project lost its 4K hero exports that way. Source files go in `site/public/` (shipped) or a folder outside `site/` (not shipped).
- **Run `pnpm build` before calling something done.** It type-checks, so it catches errors the dev server ignores.
- **After `pnpm add`, restart the dev server.** A server started before a dependency was installed can serve two copies of React, which shows up as baffling "invalid hook call" errors.
- **Design tokens in one place.** Colours, spacing, radii and type sizes as CSS custom properties in `index.css`, named by role (`--surface`, `--section-gap`), not by page. Changing a token then changes the whole site consistently. Put this rule in their `CLAUDE.md`.

---
name: portfolio-starter
description: Guides someone through setting up their own personal portfolio website with Claude Code, from an empty Mac to a live site on their own domain - toolchain (Homebrew, Node, pnpm, git), a React + Vite + TypeScript project with Tailwind CSS v4, shadcn/ui and lucide icons, a one-click preview in the Claude desktop app, a CLAUDE.md spec to work from, prerendered pages with link previews and sensible search/AI-crawler rules, image optimisation, and deployment to GitHub + Vercel with a custom domain. Includes an optional pack of accessible media components (lightbox, before/after slider, looping video, top bar). Use it whenever someone wants to build, start, set up, scaffold or deploy a personal or designer portfolio, a personal site or case-study site, asks what to install to start building a website with Claude, or wants their existing portfolio project set up properly (preview button, deploy, domain, link previews, SEO), even if they don't say "portfolio" or name any of these tools.
---

# Portfolio starter

You're helping someone, often a designer rather than an engineer, set up the foundations for a portfolio they will design and write themselves. The design and the words are theirs. Your job is the plumbing underneath, so they can spend their time on the parts that matter to them.

This skill is a set of lessons from building one real portfolio (Itai Aknin's, aknin.net) with Claude Code. Each reference file says what to do and why, including the mistakes that cost time. Treat it as guidance, not a script: the person may already have half of this, may want a different tool for some step, or may only need one piece (say, deployment). Adapt to that.

## How to talk to them

The person building is probably not technical, and they came to build a portfolio, not to read about tooling. How you talk matters as much as what you set up.

- **Be brief.** Keep answers and explanations short: a few sentences, not a lecture. Say what you're about to do, do it, and say what changed. Skip background they didn't ask for; they can always ask for more.
- **Use plain, simple language.** No jargon, or define a term in a few words the first time ("pnpm, the tool that downloads the code libraries the site uses"). Many people using this have never opened a terminal.
- **Explain outcomes and trade-offs, not mechanics.** For each step or choice, say what they get and what it costs them: "Your site will load faster, but images take a minute longer to prepare." "Free, but your address ends in .vercel.app until you buy a domain." Leave the how out unless they ask.
- **Default to best practice.** Recommend the common, reliable option and go with it. Bring up a less usual alternative only when there's a reason to: it fits something they told you (a goal, a constraint, the kind of work they show), or the standard option has a real downside for them. When you do, say the reason in one line and what it costs, then let them choose.

## How to work with them

- **Start by finding out where they are.** Before suggesting anything, look: is there a project folder already? Run `command -v brew node pnpm git gh` and check versions. Ask what they want to have at the end of today (a running local site? a live URL?) and whether they already own a domain. Skip anything that's already done and working.
- **Offer, don't impose.** Where the references recommend a choice (pnpm over npm, Vercel over Netlify, a particular font approach), that recommendation is the best-practice option; say why in a line, then go with what they prefer. A working site on their choice beats a perfect site on ours.
- **Their design stays theirs.** Don't pick colours, fonts, layouts or copy for them unless asked. When they do ask for design help, propose two or three options and let them choose before building one.
- **Some steps need them, not you.** Anything that asks for their Mac password (installing Homebrew), signing in to GitHub or Vercel in a browser, buying a domain, or changing DNS at their registrar is something they do. Give them the exact command or click path, explain what they'll see, and wait.
- **Commands change.** The tools here move fast. Before running an install command from these notes, check the tool's current docs (shadcn's Vite installation page, Tailwind's Vite guide, Vercel's domain docs) and prefer what the docs say now. The notes explain the intent so you can adapt.
- **Verify as you go.** After each phase, show that it works: the dev server running in the preview, `pnpm build` passing, the live URL loading. Don't move on from something broken.

## The phases

Read the reference for a phase when you get to it. Most people will go roughly in this order, but follow their lead.

| Phase | What it gets them | Read |
|---|---|---|
| 1. Toolchain | Homebrew, Node, pnpm, git and the GitHub CLI installed in a way that keeps working | `references/toolchain.md` |
| 2. Project | A Vite + React + TypeScript site with Tailwind v4, shadcn/ui, lucide icons and local fonts, in a sensible folder layout | `references/project.md` |
| 3. One-click preview | `.claude/launch.json`, so the Claude desktop app starts and shows the site with one click | `references/preview.md` |
| 4. Working with Claude | A `CLAUDE.md` spec, a decisions log, a private references folder, a commit habit | `references/working-with-claude.md` |
| 5. Pages, previews and crawlers | Real HTML for every page (prerendering), page titles and link-preview cards, a real 404, sitemap, `llms.txt`, and robots rules that keep pages out of search or AI training only where they want | `references/pages-and-crawlers.md` |
| 6. Images and media | Image sizes and formats that load fast without blurry text, no layout shift, videos that behave | `references/images.md` |
| 7. Deploy and domain | GitHub repo, Vercel project with preview deployments, their own domain, DNS | `references/deploy.md` |
| 8. Optional components | Accessible lightbox, before/after slider, looping video, image pairs, top bar, back-to-top, email copy | `components/README.md` |
| Extras | Page transitions, analytics, favicons and share cards, small polish | `references/extras.md` |

Phases 1–4 are what makes building with Claude pleasant; 5–7 are what makes the site real. A person who only wants to start designing today can stop after 4 and come back.

## Templates

`templates/` holds working versions of the files the references talk about. At its top level are the repo-root files: `launch.json` (goes in `.claude/`), a `CLAUDE.md` skeleton, `decisions.md` (goes in `docs/`) and `gitignore` (becomes `.gitignore`). `templates/site/` mirrors the app folder: `index.html`, `vite.config.ts`, `vercel.json`, `package-scripts.json` (the `scripts` to merge into `package.json`), `public/robots.txt`, and the prerender setup (`src/main.tsx`, `src/entry-server.tsx`, `src/routes.tsx`, `src/content/site.ts`, `src/components/PageMeta.tsx`, `src/pages/`, `scripts/prerender.mjs`). They come from a site that works in production, trimmed to the parts anyone needs. Read the matching template, then write the file to fit their project: their name, their pages, their folder layout. Don't copy one in blind, and don't overwrite a file they already have without showing them what changes.

## When you're done

Leave them with:
- the site running locally with one click, and `pnpm build` passing;
- if they got that far, the live URL;
- a `CLAUDE.md` that describes their project as it is now, so their next session with Claude starts informed;
- a short list of what's left (for example: "connect your domain once you've bought it", "add a share card image").

Suggest they commit after each finished step, with a clear message. Git history is how they'll undo a bad idea later.

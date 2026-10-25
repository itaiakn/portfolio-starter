# Portfolio starter

A [Claude Code](https://claude.com/claude-code) skill that helps you set up your own portfolio website: from a Mac with nothing installed to a live site on your own domain. You do the design and the writing. Claude does the setup, explaining each step as it goes.

It's what I learned building [aknin.net](https://aknin.net) with Claude, written down so you don't have to rediscover it:

- **Tools that keep working:** Homebrew, Node, pnpm, git and the GitHub CLI, installed the standard way.
- **A small, standard stack:** React + TypeScript + Vite, Tailwind CSS v4, [shadcn/ui](https://ui.shadcn.com) components, [Lucide](https://lucide.dev) icons and self-hosted fonts.
- **One-click preview** in the Claude desktop app (`.claude/launch.json`).
- **A `CLAUDE.md` spec and a decisions log,** so every new Claude session knows your site.
- **Pages that machines can read:** prerendered HTML, link-preview cards for LinkedIn and Slack, a real 404 page, a sitemap and `llms.txt`, plus robots rules that keep client work out of Google and your images out of AI training while recruiters' AI agents can still read your case studies.
- **Fast images:** when to use WebP, and no layout jumps.
- **Deploy:** GitHub + Vercel with private preview links, and your own domain.
- **Optional components:** an accessible image lightbox, a before/after slider, looping UI videos, image pairs, a top bar with a phone menu, back-to-top, and an email link that copies the address. Neutral styling, so your design takes over.

Nothing is forced. Claude checks what you already have, suggests what we found works, and goes with your choices.

## Install

Easiest: open the Claude desktop app's **Code** tab (or `claude` in a terminal) and say:

> Install the skill from https://github.com/itaiakn/portfolio-starter into ~/.claude/skills

Or clone it yourself:

```bash
git clone https://github.com/itaiakn/portfolio-starter ~/.claude/skills/portfolio-starter
```

No git yet? Use **Code → Download ZIP** on GitHub, unzip it, and move the folder to `~/.claude/skills/portfolio-starter` (in Finder: **Go → Go to Folder…**, then type `~/.claude/skills`; create the folder if it isn't there).

## Use

Make an empty folder for your site, open it in Claude Code, and say something like:

> I want to build my portfolio site. Help me set everything up.

Claude asks where you're starting from and walks you through it. You can also ask for one part only: "set up the one-click preview", "deploy my site to Vercel", "connect my domain".

Some steps need you, not Claude: typing your Mac password for Homebrew, signing in to GitHub and Vercel, buying a domain, and changing its DNS. Claude tells you exactly what to do.

## Update

```bash
git -C ~/.claude/skills/portfolio-starter pull
```

## What's inside

- `SKILL.md`: how Claude should guide you, and the phases.
- `references/`: one guide per phase, with the reasons and the mistakes to avoid.
- `templates/`: working versions of the setup files, for Claude to adapt to your project.
- `components/`: the optional component pack.

MIT licensed. Made by [Itai Aknin](https://aknin.net).

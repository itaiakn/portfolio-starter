# Toolchain

The goal is a set of tools that keeps working next month. That means installing them in one standard place, not borrowing a copy that happens to be lying around.

## What they need

| Tool | What it's for, in plain words |
|---|---|
| Homebrew | The Mac's package manager: it installs and updates the other tools |
| Node | Runs the JavaScript tools that build the site |
| pnpm | Downloads the code libraries the site uses (faster than npm and doesn't duplicate them on disk) |
| git | Keeps the history of every change, so anything can be undone |
| GitHub CLI (`gh`) | Lets Claude create the GitHub repo and open pull requests for them (optional, but it saves a lot of clicking) |

## Check first

```bash
command -v brew node pnpm git gh; node -v; pnpm -v
```

If something is found, check where it lives (`command -v node`). A Node that sits inside another app's bundle (for example under `/Applications/Some App.app/...`) will disappear when that app updates. That happened on the original project and broke every build and the shadcn CLI until Node was installed properly. Recommend replacing it with Homebrew's.

## Install (macOS)

1. **Homebrew.** The install command is on https://brew.sh. It asks for their Mac password, so **they** run it in the Terminal app, not you. Tell them that typing the password shows nothing on screen, which is normal. At the end Homebrew prints two or three "Next steps" lines that add it to the shell's PATH. Those lines matter: ask them to run them, or add `eval "$(/opt/homebrew/bin/brew shellenv)"` to `~/.zprofile` yourself.
2. **The rest:** `brew install node pnpm git gh`. Homebrew's pnpm is simplest. `corepack enable` is the alternative if they prefer pnpm to follow Node.
3. **Check again** in a new terminal: `node -v && pnpm -v && git --version`.
4. **git identity**, if `git config --global user.name` is empty: set their name and email (ask which email they want on public commits; GitHub offers a private `noreply` address).
5. **GitHub sign-in:** `gh auth login` opens a browser. They complete it.

## Why PATH matters for Claude

The Claude desktop app starts commands in a shell that may not read `~/.zprofile`, so `pnpm` can be "not found" even though it works in their terminal. Two fixes, used together on the original project:
- `~/.zprofile` puts `/opt/homebrew/bin` on PATH (step 1 above).
- `.claude/launch.json` runs the dev server through `zsh -lc "…"`, a login shell, so it reads that profile (see `preview.md`).

If a command fails with "command not found" inside Claude but works in Terminal, this is almost always the reason.

## Windows or Linux

The same tools apply. On Windows, suggest `winget install OpenJS.NodeJS.LTS Git.Git GitHub.cli`, then `npm install -g pnpm` (or `corepack enable`). On Linux, use the distribution's package manager or nvm for Node. The `launch.json` runtime then changes from `/bin/zsh -lc` to calling `pnpm` directly. Check the current docs; the original project was only ever run on a Mac.

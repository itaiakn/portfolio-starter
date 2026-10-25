# One-click preview

The Claude desktop app (the Code tab) can start the site's dev server and show it in its built-in browser pane, so the person sees each change as Claude makes it, and Claude can check its own work there. It reads the server's definition from `.claude/launch.json` at the repository root.

## The file

See `templates/launch.json`:

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "portfolio",
      "runtimeExecutable": "/bin/zsh",
      "runtimeArgs": ["-lc", "pnpm --dir site dev --port 5173 --strictPort"],
      "port": 5173
    }
  ]
}
```

Why each part:
- **`/bin/zsh -lc`**: a login shell, so the command sees Homebrew's PATH from `~/.zprofile`. Calling `pnpm` directly fails when the app's environment doesn't include `/opt/homebrew/bin` (see `toolchain.md`).
- **`--dir site`**: the app lives in `site/`, and the file sits at the repo root.
- **`--port 5173 --strictPort`**: a fixed port. Without `--strictPort`, Vite silently moves to 5174 when 5173 is busy, and the preview opens the wrong address or an old server.
- In `site/package.json`, `"dev": "vite --host 127.0.0.1"` keeps the server on the local machine only.

## One entry

Keep a single configuration. Extra entries (spare ports for parallel sessions, a build preview) all show up in every session's preview picker. One server serves the same folder for every session: if port 5173 is already running from another session, reuse it rather than adding a spare. Write that into their `CLAUDE.md`.

To check a production build, run `pnpm build && pnpm preview` from `site/` instead of adding a second entry.

## Using it

Once the file exists, Claude starts the preview by name (`portfolio`). Tell them they can also start it themselves from the app's preview control. If the page is blank or the server exits, read the server log: it's usually a missing dependency (run `pnpm install`), a PATH problem, or a port already in use.

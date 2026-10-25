import type React from 'react'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

// Every page of the site by path. main.tsx renders the matching one in the browser; the build prerenders each into its own HTML
// file (scripts/prerender.mjs) so readers that don't run JavaScript, such as agents and link previews, get the full text.
// "/404" is the not-found page. A new page needs an entry here and in `pages`, a rewrite in vercel.json and a PageMeta.
export const routes: Record<string, () => React.JSX.Element> = { '/': Home, '/404': NotFound }

// The pages as llms.txt lists them (title and one line each). `noindex` pages are left out of the sitemap; give them the
// noindex header in vercel.json and `noindex` on their PageMeta too.
export const pages: { path: string; title: string; description: string; noindex?: boolean }[] = [
  { path: '/', title: 'Your Name', description: 'One line about what you do.' },
]

// Old paths that moved (for example from a previous site). Vercel redirects them (vercel.json); main.tsx covers the dev server.
export const renamed: Record<string, string> = {}

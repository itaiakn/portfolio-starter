// Writes one HTML file per page into dist/ after the client and server builds, so readers that don't run JavaScript (agents,
// link previews, some crawlers) get each page's full text, title and description. "/" overwrites dist/index.html; "/404" becomes
// dist/404.html, which Vercel serves with a 404 status for paths that aren't pages; every other page goes to dist/<path>/index.html.
// The browser app replaces this HTML on load. Also writes the sitemap (every page in `pages` not marked noindex), adds its
// address to robots.txt, and writes llms.txt, a plain-text map of the site for agents.
import { readFile, writeFile, mkdir, rm, appendFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const { render, routes, pages, siteUrl, llms } = await import(`${root}dist-ssr/entry-server.js`)
const template = await readFile(`${root}dist/index.html`, 'utf8')

// React writes a page's <title>, <meta> and canonical <link> where the page renders them; in a static file they belong in <head>,
// replacing the template's defaults.
const headTag = /<title>[\s\S]*?<\/title>|<meta (?:name|property)="[^"]+"[^>]*\/?>|<link rel="canonical"[^>]*\/?>/g
const metaName = tag => tag.match(/^<meta (?:name|property)="([^"]+)"/)?.[1]

for (const path of Object.keys(routes)) {
  let body = render(path)
  const tags = body.match(headTag) ?? []
  body = body.replace(headTag, '')
  let html = template
  for (const tag of tags) {
    if (tag.startsWith('<title>')) { html = html.replace(/<title>[\s\S]*?<\/title>/, tag); continue }
    if (tag.startsWith('<link')) { html = html.replace('</head>', `${tag}</head>`); continue }
    const name = metaName(tag)
    const existing = new RegExp(`<meta name="${name}"[^>]*/?>`)
    html = existing.test(html) ? html.replace(existing, tag) : html.replace('</head>', `${tag}</head>`)
  }
  if (!html.includes('<div id="root"></div>')) throw new Error('prerender: dist/index.html has no empty #root')
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  const file = path === '/' ? `${root}dist/index.html` : path === '/404' ? `${root}dist/404.html` : `${root}dist${path}/index.html`
  await mkdir(file.slice(0, file.lastIndexOf('/')), { recursive: true })
  await writeFile(file, html)
  console.log(`prerendered ${path} (${Math.round(html.length / 1024)} kB)`)
}

const urls = pages.filter(page => !page.noindex).map(page => `  <url><loc>${siteUrl}${page.path}</loc></url>`).join('\n')
await writeFile(`${root}dist/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
await appendFile(`${root}dist/robots.txt`, `\nSitemap: ${siteUrl}/sitemap.xml\n`)
await writeFile(`${root}dist/llms.txt`, llms())
await rm(`${root}dist-ssr`, { recursive: true, force: true })

import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { routes, pages } from './routes'
import { siteName, siteUrl, siteEmail } from './content/site'

export { routes, pages, siteUrl }

// Build-time render of one page to HTML, the same tree main.tsx renders in the browser. Code that runs while rendering must not
// touch browser-only APIs (window, document, localStorage, matchMedia); read them in effects or event handlers instead.
// Anything main.tsx mounts beside <Page /> (a toaster, a back-to-top button) goes here too.
export function render(path: string) {
  const Page = routes[path]
  return renderToString(<StrictMode><Page /></StrictMode>)
}

// llms.txt (llmstxt.org): a short plain-text map of the site for agents, written by the build.
export function llms() {
  const rest = pages.filter(page => page.path !== '/').map(page => `- [${page.title}](${siteUrl}${page.path}): ${page.description}`)
  return `# ${siteName}

> ${pages[0].description}

Homepage: ${siteUrl}/
${!siteEmail || siteEmail.endsWith('@example.com') ? '' : `Email: ${siteEmail}\n`}
## Pages

${rest.join('\n')}
`
}

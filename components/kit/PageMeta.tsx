import { siteName, siteUrl } from '@/content/site'

type PageMetaProps = {
  title: string
  description: string
  /** The page's path, such as `/` or `/projects/redesign`. */
  path: string
  /** A share card (1200×630 by default): a path under public/, such as `/images/share/home.png`, or a full URL. */
  image?: string
  imageWidth?: number
  imageHeight?: number
  /** Keeps the page out of search results while leaving it readable. */
  noindex?: boolean
}

// Every page's head: title, description, canonical URL and the tags LinkedIn, Slack and the like read for a link preview.
// Render it first in each page. React 19 hoists these into <head> in the browser; the build's prerender (scripts/prerender.mjs) moves them there in
// the static HTML.
export function PageMeta({ title, description, path, image, imageWidth = 1200, imageHeight = 630, noindex = false }: PageMetaProps) {
  const url = path === '/' ? `${siteUrl}/` : `${siteUrl}${path}`
  const imageUrl = image && (/^https?:\/\//.test(image) ? image : `${siteUrl}${image.startsWith('/') ? '' : '/'}${image}`)
  return <>
    <title>{title}</title>
    {noindex && <meta name="robots" content="noindex, noarchive" />}
    <meta name="description" content={description} />
    <link rel="canonical" href={url} />
    <meta property="og:type" content={path === '/' ? 'website' : 'article'} />
    <meta property="og:site_name" content={siteName} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={url} />
    {imageUrl && <>
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
    </>}
    <meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {imageUrl && <meta name="twitter:image" content={imageUrl} />}
  </>
}

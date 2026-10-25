import { PageMeta } from '@/components/PageMeta'

// Prerendered to dist/404.html; Vercel serves it with a 404 status for any path that isn't a page.
export default function NotFound() {
  return <main>
    <PageMeta title="Page not found - Your Name" description="This page doesn't exist." path="/404" noindex />
    <h1>Page not found</h1>
    <p><a href="/">Back to the homepage</a></p>
  </main>
}

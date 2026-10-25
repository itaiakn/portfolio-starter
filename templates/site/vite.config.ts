import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// Vite rewrites the entry <script> on build and drops blocking="render"; the attribute keeps the first paint (and any
// view transition into the page) waiting until the app has rendered. Dev serves index.html as written.
const renderBlockingEntry: Plugin = {
  name: 'render-blocking-entry',
  transformIndexHtml: { order: 'post', handler: html => html.replace(/<script type="module" crossorigin src="/, '<script type="module" crossorigin blocking="render" src="') },
}

export default defineConfig({ plugins: [react(), tailwindcss(), renderBlockingEntry], resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } } })

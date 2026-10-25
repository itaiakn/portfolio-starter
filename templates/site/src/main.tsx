import React from 'react'
import ReactDOM from 'react-dom/client'
import { flushSync } from 'react-dom'
// Fonts: import each Fontsource package once, here or in index.css (a shadcn preset may already have added one there).
import './index.css'
import { routes, renamed } from './routes'

const path = window.location.pathname.replace(/\/$/, '') || '/'
if (renamed[path]) window.history.replaceState(null, '', renamed[path] + window.location.search + window.location.hash)
const Page = routes[renamed[path] ?? path] ?? routes['/404']
// Rendered synchronously: the script is render-blocking (index.html), so the first paint, and any view transition into the page,
// shows the real content. The prerendered HTML already in #root is for readers without JavaScript; this render replaces it.
const root = ReactDOM.createRoot(document.getElementById('root')!)
flushSync(() => root.render(<React.StrictMode><Page /></React.StrictMode>))

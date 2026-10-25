import type { MouseEvent } from 'react'
import { toast } from 'sonner'
import { siteEmail } from '@/content/site'

export const mailto = (address = siteEmail) => `mailto:${address}`

// Copies the address and confirms with a toast; if the clipboard is unavailable it falls back to the mail app.
export async function copyEmail(address = siteEmail) {
  try {
    await navigator.clipboard.writeText(address)
    toast('Email copied to clipboard', { id: 'email-copied', duration: 2000 })
  } catch {
    window.location.href = mailto(address)
  }
}

// Click handler for any mailto link: with a mouse it copies the address instead of opening a mail draft; on touch devices it
// lets the mailto through, since phones have a mail app ready. The address comes from the link's own href.
export function onEmailClick(event: MouseEvent<HTMLAnchorElement>) {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  const href = event.currentTarget.getAttribute('href') ?? ''
  if (!href.startsWith('mailto:')) return
  event.preventDefault()
  copyEmail(decodeURIComponent(href.slice('mailto:'.length).split('?')[0]))
}

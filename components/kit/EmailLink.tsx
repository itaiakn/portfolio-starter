import type { ReactNode } from 'react'
import { siteEmail } from '@/content/site'
import { mailto, onEmailClick } from '@/lib/email'

// An email address as a link: copies it with a mouse, opens the mail app on touch devices (see `onEmailClick`).
// Shows the address itself unless `children` gives other text.
export function EmailLink({ address = siteEmail, children, className }: { address?: string; children?: ReactNode; className?: string }) {
  return <a className={className} href={mailto(address)} onClick={onEmailClick}>{children ?? address}</a>
}

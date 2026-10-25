import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

type LightboxProps = {
  caption: string
  children: ReactNode
  trigger?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Where focus goes on close when the lightbox is opened without a `trigger` (Radix only returns focus to its own trigger). */
  returnFocusTo?: () => HTMLElement | null | undefined
}

// One full-screen preview for every image on the site, built on the shadcn Dialog (focus trap, Escape, outside click, scroll lock).
// Caption (left) and close (right) sit above the media so they never cover it.
export function Lightbox({ caption, children, trigger, open, onOpenChange, returnFocusTo }: LightboxProps) {
  return <Dialog open={open} onOpenChange={onOpenChange}>
    {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
    <DialogContent className="kit-lightbox" showCloseButton={false} aria-describedby={undefined}
      onCloseAutoFocus={event => { const target = returnFocusTo?.(); if (target) { event.preventDefault(); target.focus() } }}>
      <div className="kit-lightbox-bar">
        <DialogTitle className="kit-lightbox-caption">{caption}</DialogTitle>
        <DialogClose asChild>
          <Button size="icon-lg" variant="secondary" className="kit-lightbox-close" aria-label="Close preview"><X aria-hidden="true" /></Button>
        </DialogClose>
      </div>
      {children}
    </DialogContent>
  </Dialog>
}

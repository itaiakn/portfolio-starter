import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { ArrowLeft, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Must match the phone breakpoint in kit.css (the `max-width: 43.75rem` block); change both together.
const phone = '(max-width: 43.75rem)'

type TopBarProps = {
  /** The site's name (or a logo), linking home. */
  name: ReactNode
  homeHref?: string
  /** An href for an icon-only Back button before the name, such as `/#work` on a project page. */
  back?: string
  backLabel?: string
  /** The links on the right (pass them as siblings in a fragment). They fold into the burger menu on phones. */
  children?: ReactNode
  /** What the phone menu shows, if it should differ from `children`. */
  menu?: ReactNode
  /** A selector: the bar stays away until that element (say, the hero's own links) has scrolled past the top, then slides in. */
  revealAfter?: string
  /** Width the bar's contents align to (any CSS length), so they line up with the page's column. */
  width?: string
}

// A bar fixed across the top of every page. Transparent at the top of the page; once the page scrolls, glass (blurred, tinted
// background) with a hairline underneath. On phones the links fold into a burger that opens them in a full-viewport glass menu.
export function TopBar({ name, homeHref = '/', back, backLabel = 'Back', children, menu, revealAfter, width }: TopBarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [away, setAway] = useState(Boolean(revealAfter))
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const toggle = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const target = revealAfter ? document.querySelector(revealAfter) : null
    if (!target) { setAway(false); return }
    const observer = new IntersectionObserver(([entry]) => setAway(entry.isIntersecting || entry.boundingClientRect.top > 0))
    observer.observe(target)
    return () => observer.disconnect()
  }, [revealAfter])

  // While the menu is open: the page behind it doesn't scroll, Escape closes it (focus back on the burger), and growing past
  // phone width closes it too.
  useEffect(() => {
    if (!open) return
    document.documentElement.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus() } }
    const media = window.matchMedia(phone)
    const onMedia = () => { if (!media.matches) setOpen(false) }
    window.addEventListener('keydown', onKey)
    media.addEventListener('change', onMedia)
    return () => {
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      media.removeEventListener('change', onMedia)
    }
  }, [open])

  return <>
    <nav className="kit-topbar" style={width ? { '--kit-topbar-width': width } as CSSProperties : undefined} data-reveal={revealAfter ? '' : undefined}
      data-scrolled={scrolled || undefined} data-away={away || undefined} data-open={open || undefined} aria-label="Site navigation">
      <div className="kit-topbar-inner">
        <div className="kit-topbar-start">
          {back && <Button asChild variant="ghost" size="icon-lg" className="kit-topbar-back"><a href={back} aria-label={backLabel}><ArrowLeft aria-hidden="true" /></a></Button>}
          <a className="kit-topbar-home" href={homeHref}>{name}</a>
        </div>
        {children && <>
          <div className="kit-topbar-actions">{children}</div>
          <Button ref={toggle} variant="ghost" size="icon-lg" className="kit-menu-button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls={menuId} onClick={() => setOpen(value => !value)}>
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </>}
      </div>
    </nav>
    {open && <div id={menuId} className="kit-menu" onClick={event => { if ((event.target as HTMLElement).closest('a')) setOpen(false) }}>
      <div className="kit-menu-inner">{menu ?? children}</div>
    </div>}
  </>
}

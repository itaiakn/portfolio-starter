import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

type BackToTopProps = {
  /** Where keyboard focus lands after scrolling up (a selector). */
  focusTarget?: string
  /** How far down (in screen heights) the visitor scrolls before the button appears. */
  after?: number
}

// Floating round button, bottom right; render it once for every page (next to the Toaster, say). Appears once the visitor has
// scrolled most of a screen; on hover the arrow slides up and out while a second one rises in behind it.
export function BackToTop({ focusTarget = 'main h1', after = 0.8 }: BackToTopProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight * after)
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [after])

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    // Keyboard focus follows the visitor to the top instead of staying on a button that is about to hide.
    const heading = document.querySelector<HTMLElement>(focusTarget)
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }) }
  }

  return <Button variant="secondary" size="icon-lg" className="kit-back-to-top" data-visible={visible} inert={!visible} aria-label="Back to top" onClick={toTop}>
    <span className="kit-back-to-top-icons" aria-hidden="true"><ArrowUp /><ArrowUp /></span>
  </Button>
}

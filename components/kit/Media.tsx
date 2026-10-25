import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { ChevronsLeftRight, Film, Image, Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Lightbox } from '@/components/kit/Lightbox'

type PlaceholderProps = {
  label: string
  note?: string
  kind?: 'image' | 'video'
  ratio?: string
}

// Stand-in for media that isn't exported yet. Replace with ImageLightbox or LoopVideo when the asset is ready.
export function MediaPlaceholder({ label, note, kind = 'image', ratio = '16 / 10' }: PlaceholderProps) {
  const Icon = kind === 'video' ? Film : Image
  return <figure className="kit-placeholder" style={{ aspectRatio: ratio }}>
    <Icon aria-hidden="true" />
    <figcaption><strong>{label}</strong>{note && <span>{note}</span>}</figcaption>
  </figure>
}

// Before and after on one surface, each labelled. `narrow`: tall, thin UI strips (such as a side menu) in two slim centered
// columns that stay side by side on phones.
export function MediaCompare({ layout = 'side-by-side', before, after }: { layout?: 'side-by-side' | 'stacked' | 'narrow'; before: ReactNode; after: ReactNode }) {
  return <div className={`kit-media-grid kit-media-grid-${layout} kit-surface`}>
    <div><p className="kit-media-label">Before</p>{before}</div>
    <div><p className="kit-media-label">After</p>{after}</div>
  </div>
}

// Related images on one surface (not a before/after), side by side or stacked; a single labelled item is how a visual gets a
// title inside its surface. Side by side takes three in a row and four as a 2×2 grid, and stacks on phones.
// `portrait`: tall phone screens in narrow, centered columns that stay side by side on phones.
export function MediaPair({ items, layout = 'side-by-side' }: { items: { label?: ReactNode; media: ReactNode }[]; layout?: 'side-by-side' | 'stacked' | 'portrait' }) {
  return <div className={`kit-media-grid kit-media-grid-${layout} kit-surface`}>
    {items.map((item, index) => <div key={index}>{item.label && <p className="kit-media-label">{item.label}</p>}{item.media}</div>)}
  </div>
}

// Short silent loop on a media surface. Plays only while on screen, never autoplays under reduced motion, and has a pause control.
export function LoopVideo({ src, poster, label, width, height }: { src: string; poster: string; label: string; width: number; height: number }) {
  const ref = useRef<HTMLVideoElement>(null)
  // null until the motion preference is read in an effect, so the server render and the first browser render agree.
  const [paused, setPaused] = useState<boolean | null>(null)
  useEffect(() => { setPaused(window.matchMedia('(prefers-reduced-motion: reduce)').matches) }, [])
  useEffect(() => {
    const video = ref.current
    if (!video || paused !== false) { video?.pause(); return }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) video.play().catch(() => {}); else video.pause() }, { threshold: 0.25 })
    observer.observe(video)
    return () => observer.disconnect()
  }, [paused])
  return <div className="kit-loop-video kit-surface">
    <div className="kit-loop-video-stage">
      <video ref={ref} src={src} poster={poster} width={width} height={height} muted loop playsInline preload="metadata" aria-label={label} />
      <Button size="icon-lg" variant="outline" className="kit-loop-video-button" aria-label={paused ? 'Play video' : 'Pause video'} onClick={() => setPaused(!paused)}>
        {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
      </Button>
    </div>
  </div>
}

/** Someone's words; `cite` names who said it (a role, such as "Operations manager"), shown under the quote. */
export function UserQuote({ children, cite }: { children: ReactNode; cite?: string }) {
  if (!cite) return <blockquote className="kit-quote"><p>“{children}”</p></blockquote>
  return <figure className="kit-quote"><blockquote><p>“{children}”</p></blockquote><figcaption className="kit-quote-cite">{cite}</figcaption></figure>
}

type CompareImage = { src: string; alt: string; placeholder: string; width: number; height: number }
type CompareMode = 'before' | 'after' | 'split'
const compareModes: { mode: CompareMode; label: string }[] = [{ mode: 'before', label: 'Before' }, { mode: 'after', label: 'After' }, { mode: 'split', label: 'Split' }]
const clamp = (value: number) => Math.min(100, Math.max(0, value))

function CompareLayer({ image, className, onRatio }: { image: CompareImage; className?: string; onRatio: (ratio: number) => void }) {
  const [missing, setMissing] = useState(false)
  return <div className={`kit-split-layer ${className ?? ''}`}>
    {missing
      ? <MediaPlaceholder label={image.placeholder} note={image.src} ratio="auto" />
      : <img src={image.src} alt={image.alt} width={image.width} height={image.height} draggable={false} onError={() => setMissing(true)} onLoad={event => onRatio(event.currentTarget.naturalWidth / event.currentTarget.naturalHeight)} />}
  </div>
}

function ModeControl({ label, mode, onChange }: { label: string; mode: CompareMode; onChange: (mode: CompareMode) => void }) {
  return <div className="kit-segmented" role="group" aria-label={label}>
    {compareModes.map(option => <button key={option.mode} type="button" aria-pressed={mode === option.mode} onClick={() => onChange(option.mode)}>{option.label}</button>)}
  </div>
}

type StageProps = {
  before: CompareImage
  after: CompareImage
  mode: CompareMode
  position: number
  ratio: number
  onPosition: (position: number) => void
  onRatio: (ratio: number) => void
  onExpand?: () => void
}

// In Split, drag anywhere on the image (or use the arrow keys on the handle) to move the divider.
function SplitStage({ before, after, mode, position, ratio, onPosition, onRatio, onExpand }: StageProps) {
  const stage = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const moveTo = (clientX: number) => {
    const bounds = stage.current!.getBoundingClientRect()
    onPosition(clamp((clientX - bounds.left) / bounds.width * 100))
  }
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (mode !== 'split' || event.button !== 0) return
    dragging.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    moveTo(event.clientX)
  }
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => { if (dragging.current) moveTo(event.clientX) }
  const stopDragging = () => { dragging.current = false }
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 2
    const next = { ArrowLeft: position - step, ArrowDown: position - step, ArrowRight: position + step, ArrowUp: position + step, Home: 0, End: 100 }[event.key]
    if (next === undefined) return
    event.preventDefault()
    onPosition(clamp(next))
  }

  // In Before and After the image itself opens the full-screen preview, like any other zoomable image (click, Enter or Space).
  const zoomable = onExpand && mode !== 'split'
  const zoomProps = zoomable ? {
    role: 'button', tabIndex: 0, 'aria-label': 'Open full-screen preview', onClick: onExpand,
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onExpand() } },
  } : {}
  return <div ref={stage} className={`kit-split-stage kit-split-stage-${mode}${zoomable ? ' kit-split-stage-zoom' : ''}`} style={{ aspectRatio: ratio, '--kit-ratio': ratio, '--kit-split': `${position}%` } as CSSProperties}
    onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={stopDragging} onPointerCancel={stopDragging} {...zoomProps}>
    {mode !== 'before' && <CompareLayer image={after} onRatio={onRatio} />}
    {mode !== 'after' && <CompareLayer image={before} className="kit-split-layer-before" onRatio={onRatio} />}
    {mode === 'split' && <>
      <span className="kit-split-label kit-split-label-before" style={{ opacity: position < 12 ? 0 : 1 }} aria-hidden="true">Before</span>
      <span className="kit-split-label kit-split-label-after" style={{ opacity: position > 88 ? 0 : 1 }} aria-hidden="true">After</span>
      <div className="kit-split-handle" role="slider" tabIndex={0} aria-label="Divider between before and after" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(position)} aria-valuetext={`${Math.round(position)}% before, ${100 - Math.round(position)}% after`} onKeyDown={onKeyDown}>
        <span className="kit-split-knob"><ChevronsLeftRight aria-hidden="true" /></span>
      </div>
    </>}
  </div>
}

// Before / After / Split viewer, opening on After with the mode control centered under the image. The full-screen preview shows
// the current mode; in Split the divider stays draggable and in sync. `label` names the mode control for screen readers.
export function BeforeAfterSplit({ label, caption, before, after }: { label: string; caption: string; before: CompareImage; after: CompareImage }) {
  const [mode, setMode] = useState<CompareMode>('after')
  const [position, setPosition] = useState(50)
  const [ratio, setRatio] = useState(after.width / after.height)
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const stage = { before, after, mode, position, ratio, onPosition: setPosition, onRatio: setRatio }

  return <div ref={root} className="kit-split kit-surface">
    <SplitStage {...stage} onExpand={() => setOpen(true)} />
    <ModeControl label={label} mode={mode} onChange={setMode} />
    <Lightbox caption={caption} open={open} onOpenChange={setOpen} returnFocusTo={() => root.current?.querySelector<HTMLElement>('.kit-split-stage')}>
      <SplitStage {...stage} />
    </Lightbox>
  </div>
}

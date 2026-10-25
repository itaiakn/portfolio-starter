import { cn } from '@/lib/utils'
import { Lightbox } from '@/components/kit/Lightbox'

type ImageLightboxProps = {
  src: string
  alt: string
  /** The image's real pixel size, so the page doesn't shift while it loads. */
  width: number
  height: number
  caption?: string
  eager?: boolean
  cutout?: boolean
  shaped?: boolean
  zoom?: boolean
  className?: string
}

// An image on a media surface that opens in the shared Lightbox on click. Caption defaults to the alt text.
// `cutout`: the image is a transparent PNG that carries its own edges and shadow, so the frame (radius and shadow) is skipped.
// `shaped`: a transparent PNG of separate UI pieces with no shadow of their own; the shadow follows the pieces instead of the image's box.
// `zoom={false}`: small, already-legible images render as a plain image with no preview.
export function ImageLightbox({ src, alt, width, height, caption, eager = false, cutout = false, shaped = false, zoom = true, className }: ImageLightboxProps) {
  const classes = cn('kit-image kit-surface', cutout && 'kit-image-cutout', shaped && 'kit-image-shaped', !zoom && 'kit-image-static', className)
  const image = <img src={src} alt={alt} width={width} height={height} loading={eager ? 'eager' : 'lazy'} />
  const preview = <img className="kit-lightbox-media" src={src} alt={alt} width={width} height={height} />
  if (!zoom) return <div className={classes}>{image}</div>
  return <Lightbox caption={caption ?? alt} trigger={
    <button type="button" className={classes} aria-label={`Expand image: ${alt}`}>{image}</button>
  }>
    {shaped ? <div className="kit-lightbox-shaped">{preview}</div> : preview}
  </Lightbox>
}

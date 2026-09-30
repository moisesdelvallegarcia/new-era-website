import { businessInfo } from '../data/businessInfo.js'

// Shows a slot's photo (or its fallback). Until the photo arrives, renders a neutral
// concrete-toned block with a faint logo so the layout keeps its shape.
function PhotoSlot({ slot, alt, className = '' }) {
  const src = slot.src || slot.fallback

  if (src) {
    return <img src={src} alt={alt} className={`object-cover ${className}`} />
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`grid place-items-center bg-[linear-gradient(135deg,#e4e4e7_0%,#d4d4d8_50%,#e4e4e7_100%)] ${className}`}
    >
      <img src={businessInfo.logo} alt="" className="h-16 w-16 rounded-full opacity-25 mix-blend-multiply" />
    </div>
  )
}

export default PhotoSlot

// Titles and categories live in src/i18n/{en,es}.js under gallery.items[key].
export const galleryItems = [
  { key: 'house-driveway', image: '/media/photos/obra-2026-10-house-driveway-1920w.webp' },
  { key: 'crew-screed', image: '/media/photos/obra-2026-10-crew-screed-1920w.webp' },
  { key: 'pour-day', image: '/media/photos/obra-2026-10-pour-1920w.webp' },
  {
    key: 'finishing-video',
    video: '/media/videos/obra-2026-10-finishing.mp4',
    poster: '/media/videos/obra-2026-10-finishing-poster.webp',
  },
  { key: 'pour-wide', image: '/media/photos/obra-2026-10-pour-wide-1920w.webp' },
  { key: 'placing', image: '/media/photos/obra-2026-10-placing-1920w.webp' },
  { key: 'slab-finish', image: '/media/photos/obra-2026-10-finishing-1920w.webp' },
  { key: 'edge-detail', image: '/media/photos/obra-2026-10-edge-detail-1920w.webp' },
  {
    key: 'edging-video',
    video: '/media/videos/obra-2026-10-edging.mp4',
    poster: '/media/videos/obra-2026-10-edging-poster.webp',
  },
  { key: 'driveway-finish', image: '/media/photos/A9-1920w.webp' },
  { key: 'covered-patio', image: '/media/photos/A4-1920w.webp' },
  { key: 'stamped-walkway', image: '/media/photos/IMG_20211118_162530-640w.webp' },
  { key: 'approach', image: '/media/photos/A02-1920w.webp' },
  { key: 'placement', image: '/media/photos/A01-1920w.webp' },
  { key: 'driveway-surface', image: '/media/photos/A8-1920w.webp' },
]

// Jobsite photos from Panzón (Oct 2026); equipment and basement are still pending. When one arrives, save it under
// public/media/photos/ and set its `src`; until then the page shows a neutral block
// (or `fallback`, when there is one).
export const photoSlots = {
  heroPour: {
    src: '/media/photos/obra-2026-10-pour-1920w.webp',
    fallback: '/media/photos/A9-1920w.webp',
    need: 'Crew during a pour, landscape, 1920px wide or more',
  },
  team: { src: '/media/photos/obra-2026-10-crew-screed-1920w.webp', need: 'The whole team, landscape' },
  finishing: { src: '/media/photos/obra-2026-10-finishing-1920w.webp', need: 'Crew finishing a slab' },
  pour: { src: '/media/photos/obra-2026-10-pour-wide-1920w.webp', need: 'Crew during a pour' },
  edge: { src: '/media/photos/obra-2026-10-edge-detail-1920w.webp', need: 'Close-up of finish work' },
  equipment: { src: null, need: 'Own equipment: pump, skid steers, trucks' },
  basement: { src: null, need: 'Finished basement slab' },
}

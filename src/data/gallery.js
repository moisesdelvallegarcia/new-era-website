// Titles and categories live in src/i18n/{en,es}.js under gallery.items[key].
export const galleryItems = [
  { key: 'driveway-finish', image: '/media/photos/A9-1920w.webp' },
  { key: 'covered-patio', image: '/media/photos/A4-1920w.webp' },
  { key: 'stamped-walkway', image: '/media/photos/IMG_20211118_162530-640w.webp' },
  { key: 'approach', image: '/media/photos/A02-1920w.webp' },
  { key: 'placement', image: '/media/photos/A01-1920w.webp' },
  { key: 'driveway-surface', image: '/media/photos/A8-1920w.webp' },
]

// New jobsite photos pending from Panzón. When one arrives, save it under
// public/media/photos/ and set its `src`; until then the page shows a neutral block
// (or `fallback`, when there is one).
export const photoSlots = {
  heroPour: {
    src: null,
    fallback: '/media/photos/A9-1920w.webp',
    need: 'Crew during a pour, landscape, 1920px wide or more',
  },
  team: { src: null, need: 'The whole team, landscape' },
  finishing: { src: null, need: 'Crew finishing a slab' },
  equipment: { src: null, need: 'Own equipment: pump, skid steers, trucks' },
  basement: { src: null, need: 'Finished basement slab' },
}

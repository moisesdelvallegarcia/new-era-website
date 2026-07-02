import CTASection from '../components/CTASection.jsx'
import GalleryGrid from '../components/GalleryGrid.jsx'
import Section from '../components/Section.jsx'
import { galleryItems } from '../data/gallery.js'

function Gallery() {
  return (
    <>
      <Section
        eyebrow="Gallery"
        title="Concrete project gallery"
        description="A selection of concrete driveways, patios, walkways, and finish work for Central Iowa properties."
      >
        <GalleryGrid items={galleryItems} />
      </Section>
      <CTASection />
    </>
  )
}

export default Gallery

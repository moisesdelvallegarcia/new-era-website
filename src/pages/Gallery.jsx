import CTASection from '../components/CTASection.jsx'
import GalleryGrid from '../components/GalleryGrid.jsx'
import ProjectVideo from '../components/ProjectVideo.jsx'
import Section from '../components/Section.jsx'
import { galleryItems } from '../data/gallery.js'
import { useLanguage } from '../i18n/useLanguage.js'

function Gallery() {
  const { t } = useLanguage()

  return (
    <>
      <Section eyebrow={t.gallery.eyebrow} title={t.gallery.pageTitle} description={t.gallery.pageDescription}>
        <GalleryGrid items={galleryItems} />
      </Section>
      <Section className="bg-zinc-100">
        <ProjectVideo />
      </Section>
      <CTASection />
    </>
  )
}

export default Gallery

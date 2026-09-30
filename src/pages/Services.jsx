import CTASection from '../components/CTASection.jsx'
import HousecallProof from '../components/HousecallProof.jsx'
import Section from '../components/Section.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import { services } from '../data/services.js'
import { useLanguage } from '../i18n/useLanguage.js'

function Services() {
  const { t } = useLanguage()

  return (
    <>
      <Section
        eyebrow={t.services.eyebrow}
        title={t.services.pageTitle}
        description={t.services.pageDescription}
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((slug) => (
            <ServiceCard key={slug} slug={slug} />
          ))}
        </div>
      </Section>
      <HousecallProof />
      <CTASection />
    </>
  )
}

export default Services

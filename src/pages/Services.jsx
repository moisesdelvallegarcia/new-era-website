import CTASection from '../components/CTASection.jsx'
import Section from '../components/Section.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import { services } from '../data/services.js'

function Services() {
  return (
    <>
      <Section
        eyebrow="Services"
        title="Concrete services for residential and commercial projects"
        description="Choose the work you need now, then request a free estimate so the team can review scope, access, timing, and finish expectations."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </Section>
      <CTASection />
    </>
  )
}

export default Services

import { Link } from 'react-router-dom'
import AreasServed from '../components/AreasServed.jsx'
import BuilderBenefits from '../components/BuilderBenefits.jsx'
import CTASection from '../components/CTASection.jsx'
import Hero from '../components/Hero.jsx'
import HousecallProof from '../components/HousecallProof.jsx'
import ProcessSteps from '../components/ProcessSteps.jsx'
import Section from '../components/Section.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import { services } from '../data/services.js'
import { useLanguage } from '../i18n/useLanguage.js'

function Home() {
  const { t, to } = useLanguage()

  return (
    <>
      <Hero />
      <ProcessSteps />
      <BuilderBenefits showPageLink />
      <HousecallProof />

      <Section eyebrow={t.services.eyebrow} title={t.services.title} description={t.services.description}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.slice(0, 4).map((slug) => (
            <ServiceCard key={slug} slug={slug} />
          ))}
        </div>
        <Link
          to={to('/services')}
          className="mt-8 inline-flex rounded border border-zinc-300 px-5 py-3 font-black text-zinc-900 transition hover:border-orange-600 hover:text-orange-700"
        >
          {t.services.viewAll}
        </Link>
      </Section>

      <AreasServed />
      <CTASection />
    </>
  )
}

export default Home

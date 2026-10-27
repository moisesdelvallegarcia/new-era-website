import { Link, Navigate, useParams } from 'react-router-dom'
import CTASection from '../components/CTASection.jsx'
import Section from '../components/Section.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import { areas, fill, findArea } from '../data/areas.js'
import { businessInfo } from '../data/businessInfo.js'
import { housecallCities } from '../data/housecall.js'
import { services } from '../data/services.js'
import { useLanguage } from '../i18n/useLanguage.js'

function Area() {
  const { slug } = useParams()
  const { t, to } = useLanguage()
  const area = findArea(slug)

  if (!area) return <Navigate to={to('/')} replace />

  const { city } = area
  const jobs = housecallCities.find((row) => row.city.toLowerCase() === city.toLowerCase())?.completed_projects
  const lead = jobs ? fill(t.area.lead, { city, jobs }) : fill(t.area.leadNoJobs, { city })

  return (
    <>
      <Section pageTitle eyebrow={t.area.eyebrow} title={fill(t.area.title, { city })} description={lead}>
        {businessInfo.showBuilderNames && (
          <p className="max-w-3xl text-base leading-7 text-zinc-600 sm:text-lg">
            {fill(t.area.builders, { city, builders: businessInfo.builders.join(', ') })}
          </p>
        )}
      </Section>
      <Section className="bg-zinc-50" title={fill(t.area.servicesTitle, { city })}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service} slug={service} />
          ))}
        </div>
      </Section>
      <Section title={t.area.otherAreas}>
        <ul className="flex flex-wrap gap-2">
          {areas
            .filter((other) => other.slug !== slug)
            .map((other) => (
              <li key={other.slug}>
                <Link
                  to={to(`/areas/${other.slug}`)}
                  className="inline-flex rounded-full border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-800 transition hover:border-orange-300 hover:text-orange-700 focus-visible:border-orange-300 focus-visible:text-orange-700"
                >
                  {other.city}, IA
                </Link>
              </li>
            ))}
        </ul>
      </Section>
      <CTASection />
    </>
  )
}

export default Area

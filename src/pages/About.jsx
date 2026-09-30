import BuildersList from '../components/BuildersList.jsx'
import CTASection from '../components/CTASection.jsx'
import PhotoSlot from '../components/PhotoSlot.jsx'
import Section from '../components/Section.jsx'
import { businessInfo } from '../data/businessInfo.js'
import { photoSlots } from '../data/gallery.js'
import { useLanguage } from '../i18n/useLanguage.js'

const photoKeys = ['team', 'finishing', 'equipment', 'basement']

function About() {
  const { t } = useLanguage()

  return (
    <>
      <Section eyebrow={t.about.eyebrow} title={t.about.title}>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="grid gap-8">
            <p className="text-lg leading-8 text-zinc-700">{t.about.intro}</p>
            <p className="border-l-4 border-orange-600 pl-4">
              <span className="block text-xl font-black tracking-tight text-zinc-950">
                {businessInfo.owner}
              </span>
              <span className="text-sm font-bold text-zinc-500">{t.about.ownerLabel}</span>
            </p>
            <dl className="grid grid-cols-3 gap-3">
              {t.about.facts.map((fact) => (
                <div key={fact.label} className="flex flex-col-reverse justify-end rounded-2xl border border-zinc-200 p-4">
                  <dt className="mt-1 text-sm leading-5 text-zinc-600">{fact.label}</dt>
                  <dd className="text-3xl font-black tracking-tight text-zinc-950">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <div>
              <h3 className="font-black text-zinc-950">{t.about.areaTitle}</h3>
              <p className="mt-2 leading-7 text-zinc-600">
                {businessInfo.serviceArea.join(' · ')} · {t.about.areaMore}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {photoKeys.map((key) => (
              <PhotoSlot
                key={key}
                slot={photoSlots[key]}
                alt={t.about.photos[key]}
                className="aspect-[4/3] w-full rounded-2xl"
              />
            ))}
          </div>
        </div>
      </Section>
      <BuildersList />
      <CTASection />
    </>
  )
}

export default About

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
  const { why, crews, company, proud } = t.about

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
            <ul className="flex flex-wrap gap-2">
              {t.about.values.map((value) => (
                <li key={value} className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm font-bold text-zinc-700">
                  {value}
                </li>
              ))}
            </ul>
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

      <section className="bg-zinc-950 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
        <figure className="mx-auto max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-300">{why.eyebrow}</p>
          <blockquote className="mt-5 text-2xl font-black leading-snug tracking-tight sm:text-4xl">
            “{why.quote}”
          </blockquote>
          <p className="mt-6 text-lg leading-8 text-zinc-300">{why.closing}</p>
          <figcaption className="mt-6 text-sm font-bold text-zinc-400">
            {businessInfo.owner}, {t.about.ownerLabel}
          </figcaption>
        </figure>
      </section>

      <Section eyebrow={crews.eyebrow} title={crews.title}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {crews.items.map((crew) => (
            <article key={crew.title} className="rounded-2xl border border-zinc-200 border-t-4 border-t-orange-600 bg-white p-6">
              <p className="text-3xl font-black tracking-tight text-zinc-950">{crew.value}</p>
              <h3 className="mt-2 font-black tracking-tight text-zinc-950">{crew.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{crew.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <p className="rounded-2xl bg-zinc-100 p-6 leading-7 text-zinc-800">{crews.capacity}</p>
          <p className="rounded-2xl bg-zinc-100 p-6 leading-7 text-zinc-800">{crews.equipment}</p>
        </div>
      </Section>

      <Section className="bg-zinc-100">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-zinc-950">{company.title}</h2>
            <dl className="mt-6 divide-y divide-zinc-200 rounded-2xl bg-white">
              {company.rows.map(([label, value]) => (
                <div key={label} className="grid gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
                  <dt className="text-sm font-black text-zinc-500">{label}</dt>
                  <dd className="leading-7 text-zinc-800">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="grid gap-6">
            <article className="rounded-2xl bg-zinc-950 p-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-300">{proud.eyebrow}</p>
              <h3 className="mt-3 text-2xl font-black tracking-tight">{proud.title}</h3>
              <p className="mt-3 leading-7 text-zinc-300">{proud.text}</p>
            </article>
            <div>
              <h3 className="font-black text-zinc-950">{t.about.areaTitle}</h3>
              <p className="mt-2 leading-7 text-zinc-600">
                {businessInfo.serviceArea.join(' · ')} · {t.about.areaMore}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <BuildersList />
      <CTASection />
    </>
  )
}

export default About

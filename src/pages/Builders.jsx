import { Link } from 'react-router-dom'
import BuilderBenefits from '../components/BuilderBenefits.jsx'
import BuildersList from '../components/BuildersList.jsx'
import CTASection from '../components/CTASection.jsx'
import ProcessSteps from '../components/ProcessSteps.jsx'
import Section from '../components/Section.jsx'
import { businessInfo, formatAddress } from '../data/businessInfo.js'
import { services } from '../data/services.js'
import { useLanguage } from '../i18n/useLanguage.js'

// The builder presentation (capability statement + deck) as a page builders can
// be sent to. "Download PDF" prints it; print styles drop the site chrome.
const statKeys = ['jobs', 'yearYards', 'peakYards', 'years']

function Builders() {
  const { t, to } = useLanguage()
  const page = t.buildersPage
  const { why, crews, company } = t.about

  const stats = [
    ...statKeys.map((key) => [businessInfo.stats[key], t.hero.stats[key]]),
    [businessInfo.stats.fieldCrew, page.fieldCrew],
  ]

  const details = [
    [page.ownerRow, businessInfo.owner],
    ...company.rows,
    [page.contactRow, `${businessInfo.phone} · ${businessInfo.email} · ${formatAddress(businessInfo.address)}`],
  ]

  return (
    <>
      <section className="bg-zinc-950 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24 print:py-10">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.24em] text-orange-300">{page.eyebrow}</p>
          <h1 className="max-w-4xl text-4xl font-black leading-[0.98] tracking-tight sm:text-6xl">{page.title}</h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-zinc-300 sm:text-xl">{page.lead}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row print:hidden">
            <Link
              to={to('/contact')}
              className="rounded-full bg-white px-7 py-4 text-center text-base font-black text-zinc-950 transition hover:bg-orange-500 hover:text-white focus-visible:bg-orange-500 focus-visible:text-white"
            >
              {t.hero.primary}
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full border border-white/20 bg-white/5 px-7 py-4 text-center text-base font-black text-white transition hover:border-white/60 hover:bg-white/10 focus-visible:border-white/60"
            >
              {page.print}
            </button>
          </div>
          <dl className="mt-11 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-5">
            {stats.map(([value, label]) => (
              <div key={label} className="flex flex-col-reverse justify-end bg-zinc-950 p-5">
                <dt className="mt-1 text-xs leading-5 text-zinc-400">{label}</dt>
                <dd className="text-3xl font-black tracking-tight text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <BuilderBenefits />
      <ProcessSteps />

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

      <section className="bg-zinc-950 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24 print:break-inside-avoid">
        <figure className="mx-auto max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-300">{why.eyebrow}</p>
          <blockquote className="mt-5 text-2xl font-black leading-snug tracking-tight sm:text-4xl">“{why.quote}”</blockquote>
          <p className="mt-6 text-lg leading-8 text-zinc-300">{why.closing}</p>
          <figcaption className="mt-6 text-sm font-bold text-zinc-400">
            {businessInfo.owner}, {t.about.ownerLabel}
          </figcaption>
        </figure>
      </section>

      <Section className="bg-zinc-100" eyebrow={page.detailsEyebrow} title={page.detailsTitle}>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <dl className="divide-y divide-zinc-200 rounded-2xl bg-white">
            {details.map(([label, value]) => (
              <div key={label} className="grid gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
                <dt className="text-sm font-black text-zinc-500">{label}</dt>
                <dd className="leading-7 text-zinc-800">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="grid gap-8">
            <div>
              <h3 className="font-black text-zinc-950">{page.whatTitle}</h3>
              <p className="mt-2 leading-7 text-zinc-600">
                {services.map((slug) => t.services.items[slug].title).join(' · ')}
              </p>
            </div>
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

export default Builders

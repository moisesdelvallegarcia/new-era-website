import { housecallGeneratedAt, housecallServices } from '../data/housecall.js'
import { useLanguage } from '../i18n/useLanguage.js'

function HousecallProof() {
  const { lang, t } = useLanguage()
  const locale = lang === 'es' ? 'es-US' : 'en-US'
  const services = housecallServices.slice(0, 6)

  if (!services.length) return null

  const max = Number(services[0].completed_projects)
  const formatNumber = (value) => new Intl.NumberFormat(locale).format(Number(value))

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-700">
            {t.proof.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-zinc-950 sm:text-5xl">
            {t.proof.title}
          </h2>
          <p className="mt-5 text-lg leading-8 text-zinc-600">{t.proof.lead}</p>
          {housecallGeneratedAt && (
            <p className="mt-4 text-sm font-bold text-zinc-500">
              {t.proof.updated} {new Date(housecallGeneratedAt).toLocaleDateString(locale)}
            </p>
          )}
        </div>

        <ul className="grid gap-4">
          {services.map((service) => (
            <li key={service.service_label}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-bold text-zinc-800">
                  {t.proof.serviceLabels[service.service_label] || service.service_label}
                </span>
                <span className="text-sm font-bold text-zinc-500">
                  <span className="text-lg font-black text-zinc-950">
                    {formatNumber(service.completed_projects)}
                  </span>{' '}
                  {t.proof.jobs}
                </span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-zinc-100" aria-hidden="true">
                <div
                  className="h-full rounded-full bg-orange-600"
                  style={{ width: `${(100 * Number(service.completed_projects)) / max}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default HousecallProof

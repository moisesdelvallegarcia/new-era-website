import { housecallCities } from '../data/housecall.js'
import { useLanguage } from '../i18n/useLanguage.js'

function AreasServed() {
  const { t } = useLanguage()
  const cities = housecallCities.slice(0, 16)

  if (!cities.length) return null

  const featuredCities = cities.slice(0, 4)
  const supportingCities = cities.slice(4)

  return (
    <section className="bg-zinc-950 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-300">
              {t.areas.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              {t.areas.title}
            </h2>
          </div>
          <p className="text-lg leading-8 text-zinc-300">{t.areas.lead}</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {featuredCities.map((city) => (
            <article
              key={`${city.city}-${city.state}`}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            >
              <p className="text-3xl font-black tracking-tight text-white">{city.completed_projects}</p>
              <p className="mt-1 text-sm text-zinc-400">{t.areas.jobs}</p>
              <h3 className="mt-3 font-black tracking-tight">
                {city.city}, {city.state}
              </h3>
            </article>
          ))}
        </div>

        {supportingCities.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {supportingCities.map((city) => (
              <li
                key={`${city.city}-${city.state}`}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-zinc-200"
              >
                {city.city}, {city.state}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default AreasServed

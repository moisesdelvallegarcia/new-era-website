import { Link } from 'react-router-dom'
import { businessInfo } from '../data/businessInfo.js'
import { useLanguage } from '../i18n/useLanguage.js'

// Builder-first hero: capacity up front, builder names right under it.
function Hero() {
  const { t, to } = useLanguage()

  return (
    <section className="bg-zinc-50 px-4 pb-12 pt-14 sm:px-6 lg:px-8 lg:pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-700">{t.hero.eyebrow}</p>
            <h1 className="mt-4 text-5xl font-black leading-[0.95] tracking-tight text-zinc-950 sm:text-7xl">
              {t.hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">{t.hero.lead}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={to('/contact')}
                className="rounded-full bg-orange-600 px-7 py-4 text-center font-black text-white transition hover:bg-orange-700 focus-visible:bg-orange-700"
              >
                {t.hero.primary}
              </Link>
              <a
                href={businessInfo.phoneHref}
                className="rounded-full border border-zinc-300 px-7 py-4 text-center font-black text-zinc-900 transition hover:border-orange-600 focus-visible:border-orange-600"
              >
                {t.hero.secondary} {businessInfo.phone}
              </a>
            </div>
          </div>
          <ul className="grid gap-3">
            {t.hero.capacity.map(([value, label]) => (
              <li
                key={label}
                className="flex items-baseline gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <span className="w-24 shrink-0 text-4xl font-black text-orange-600">{value}</span>
                <span className="font-bold text-zinc-700">{label}</span>
              </li>
            ))}
          </ul>
        </div>
        {businessInfo.showBuilderNames && (
          <div className="mt-14 border-t border-zinc-200 pt-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">{t.hero.trusted}</p>
            <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-xl font-black text-zinc-800">
              {businessInfo.builders.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

export default Hero

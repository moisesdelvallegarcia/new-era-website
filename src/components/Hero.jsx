import { Link } from 'react-router-dom'
import { businessInfo } from '../data/businessInfo.js'
import { photoSlots } from '../data/gallery.js'
import { useLanguage } from '../i18n/useLanguage.js'
import PhotoSlot from './PhotoSlot.jsx'

const statKeys = ['jobs', 'delivered', 'peakYards', 'years']

function Hero() {
  const { t, to } = useLanguage()
  const backdrop = photoSlots.heroPour.src || photoSlots.heroPour.fallback

  return (
    <section className="relative isolate overflow-hidden bg-zinc-950 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
      {backdrop && (
        <img
          src={backdrop}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full scale-105 object-cover opacity-20 blur-sm"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(9,9,11,0.98)_0%,rgba(9,9,11,0.9)_42%,rgba(9,9,11,0.62)_100%)]" />
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="mb-5 text-xs font-black uppercase tracking-[0.24em] text-orange-300">
            {t.hero.eyebrow}
          </p>
          <h1 className="max-w-4xl text-4xl font-black leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
            {t.hero.title}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">{t.hero.lead}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to={to('/contact')}
              className="rounded-full bg-white px-7 py-4 text-center text-base font-black text-zinc-950 transition hover:bg-orange-500 hover:text-white focus-visible:bg-orange-500 focus-visible:text-white"
            >
              {t.hero.primary}
            </Link>
            <a
              href={businessInfo.phoneHref}
              className="rounded-full border border-white/20 bg-white/5 px-7 py-4 text-center text-base font-black text-white backdrop-blur transition hover:border-white/60 hover:bg-white/10 focus-visible:border-white/60"
            >
              {t.hero.secondary} {businessInfo.phone}
            </a>
          </div>
          <dl className="mt-11 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
            {statKeys.map((key) => (
              <div key={key} className="flex flex-col-reverse justify-end bg-zinc-950/55 p-5 backdrop-blur">
                <dt className="mt-1 text-xs leading-5 text-zinc-400">{t.hero.stats[key]}</dt>
                <dd className="text-3xl font-black tracking-tight text-white">
                  {businessInfo.stats[key]}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900/70 shadow-2xl shadow-black/40">
          <PhotoSlot
            slot={photoSlots.heroPour}
            alt={t.hero.photoAlt}
            className="h-full min-h-[23rem] w-full"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero

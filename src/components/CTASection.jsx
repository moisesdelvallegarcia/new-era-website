import { Link } from 'react-router-dom'
import { businessInfo } from '../data/businessInfo.js'
import { useLanguage } from '../i18n/useLanguage.js'

function CTASection() {
  const { t, to } = useLanguage()

  return (
    <section className="bg-zinc-950 px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-7 rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 lg:flex-row lg:items-center lg:justify-between lg:p-10">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-300">
            {t.cta.eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{t.cta.title}</h2>
          <p className="mt-3 max-w-2xl text-orange-50">{t.cta.text}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to={to('/contact')}
            className="rounded-full bg-white px-6 py-4 text-center font-black text-zinc-950 transition hover:bg-orange-500 hover:text-white focus-visible:bg-orange-500 focus-visible:text-white"
          >
            {t.cta.primary}
          </Link>
          <a
            href={businessInfo.phoneHref}
            className="rounded-full border border-white/20 px-6 py-4 text-center font-black text-white transition hover:bg-white/10 focus-visible:bg-white/10"
          >
            {t.cta.call} {businessInfo.phone}
          </a>
        </div>
      </div>
    </section>
  )
}

export default CTASection

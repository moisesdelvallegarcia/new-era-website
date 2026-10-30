import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { businessInfo } from '../data/businessInfo.js'
import { findTeamMember } from '../data/team.js'

// Digital business card, one per person in src/data/team.js. English only, no
// menu or footer: it is opened from a QR code or a WhatsApp link on a phone.

const SERVICES = ['Basements', 'Garages', 'Driveways', 'Sidewalks', 'Patios', 'Stoops']

const PHOTOS = [
  ['/media/photos/obra-2026-10-finishing-1920w.webp', 'Crew finishing a fresh concrete slab'],
  ['/media/photos/obra-2026-10-house-driveway-1920w.webp', 'New driveway poured at a new home'],
  ['/media/photos/obra-2026-10-pour-1920w.webp', 'Concrete being placed on a residential job'],
]

function Icon({ path, className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {path}
    </svg>
  )
}

const icons = {
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />,
  whatsapp: <path d="M3 21l1.7-4.6A8.5 8.5 0 1 1 8 19.6L3 21zM9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-1 .8c-1-.5-1.6-1.1-2.1-2.1l.8-1-1-2L9 9.5z" />,
  message: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  contact: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6M22 11h-6" />
    </>
  ),
  share: (
    <>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M16 6l-4-4-4 4M12 2v13" />
    </>
  ),
  arrow: <path d="M5 12h14M13 5l7 7-7 7" />,
}

function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])
}

function Card() {
  const { slug } = useParams()
  const person = findTeamMember(slug)
  const [shared, setShared] = useState(false)
  useNoIndex()

  useEffect(() => {
    if (person) document.title = `${person.name} · ${businessInfo.name}`
  }, [person])

  if (!person) return <Navigate to="/" replace />

  const cardUrl = `${businessInfo.siteUrl}/card/${person.slug}`
  const digits = person.phoneE164.replace('+', '')
  const whatsappText = encodeURIComponent(`Hi ${person.firstName}, I got your card from New Era Construction.`)

  async function share() {
    const data = { title: `${person.name} · ${businessInfo.name}`, url: cardUrl }
    try {
      if (navigator.share) {
        await navigator.share(data)
      } else {
        await navigator.clipboard.writeText(cardUrl)
        setShared(true)
      }
    } catch {
      // The person closed the share sheet; nothing to do.
    }
  }

  const quick = [
    ['Call', `tel:${person.phoneE164}`, icons.phone],
    ['WhatsApp', `https://wa.me/${digits}?text=${whatsappText}`, icons.whatsapp],
    ['Text', `sms:${person.phoneE164}`, icons.message],
  ]

  return (
    <div className="min-h-screen bg-zinc-950 sm:py-10">
      <article className="mx-auto min-h-screen w-full max-w-md overflow-hidden bg-white sm:min-h-0 sm:rounded-3xl sm:shadow-2xl">
        <header className="relative h-56">
          <img
            src="/media/photos/obra-2026-10-crew-screed-1920w.webp"
            alt="New Era crew screeding a concrete slab"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-zinc-950/10 via-zinc-950/20 to-zinc-950/70" />
          <div className="absolute -bottom-14 left-6 h-28 w-28 rounded-full bg-white p-2 shadow-xl ring-4 ring-white">
            <img src={businessInfo.logo} alt={businessInfo.name} className="h-full w-full object-contain" />
          </div>
        </header>

        <div className="px-6 pb-10 pt-[4.5rem]">
          <h1 className="text-3xl font-black leading-tight tracking-tight text-zinc-950">{person.name}</h1>
          <p className="mt-1 text-sm font-bold uppercase tracking-[0.14em] text-orange-700">{person.title}</p>
          <p className="mt-2 text-base text-zinc-600">{businessInfo.name} · Des Moines, Iowa</p>
          {person.spanish && (
            <p className="mt-3 inline-block rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-700">
              Se habla español
            </p>
          )}

          <a
            href={`/vcards/${person.slug}.vcf`}
            className="mt-7 flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-orange-700 px-5 text-lg font-black text-white shadow-lg transition hover:bg-orange-800 focus-visible:bg-orange-800"
          >
            <Icon path={icons.contact} className="h-6 w-6" />
            Save contact
          </a>

          <div className="mt-3 grid grid-cols-3 gap-3">
            {quick.map(([label, href, icon]) => (
              <a
                key={label}
                href={href}
                className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl bg-zinc-950 text-sm font-bold text-white transition hover:bg-zinc-800 focus-visible:bg-zinc-800"
              >
                <Icon path={icon} />
                {label}
              </a>
            ))}
          </div>
          <p className="mt-3 text-center text-base font-semibold text-zinc-700">
            <a href={`tel:${person.phoneE164}`} className="hover:text-orange-700">{person.phone}</a>
          </p>

          <dl className="mt-8 grid grid-cols-3 divide-x divide-zinc-200 rounded-2xl border border-zinc-200 text-center">
            {[
              [businessInfo.stats.jobs, 'jobs a year'],
              [businessInfo.stats.yearYards, 'yd³ in 2026'],
              [businessInfo.stats.years, 'years'],
            ].map(([value, label]) => (
              <div key={label} className="px-2 py-4">
                <dt className="sr-only">{label}</dt>
                <dd className="text-xl font-black text-zinc-950">{value}</dd>
                <dd className="text-xs font-semibold uppercase tracking-wide text-zinc-600">{label}</dd>
              </div>
            ))}
          </dl>

          <section className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-zinc-600">Concrete flatwork</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {SERVICES.map((service) => (
                <li key={service} className="rounded-full border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-800">
                  {service}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-zinc-600">Recent work</h2>
              <Link to="/gallery" className="text-sm font-bold text-orange-700 hover:text-orange-800">
                See more
              </Link>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {PHOTOS.map(([src, alt]) => (
                <Link key={src} to="/gallery" className="block aspect-square overflow-hidden rounded-xl">
                  <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
                </Link>
              ))}
            </div>
          </section>

          {businessInfo.showBuilderNames && (
            <section className="mt-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-zinc-600">Builders we pour for</h2>
              <p className="mt-2 text-base leading-relaxed text-zinc-700">{businessInfo.builders.join(' · ')}</p>
            </section>
          )}

          <div className="mt-9 grid gap-3">
            <Link
              to="/contact"
              className="flex min-h-14 items-center justify-between rounded-2xl border-2 border-zinc-950 px-5 text-base font-black text-zinc-950 transition hover:bg-zinc-950 hover:text-white focus-visible:bg-zinc-950 focus-visible:text-white"
            >
              Request a quote
              <Icon path={icons.arrow} />
            </Link>
            <button
              type="button"
              onClick={share}
              className="flex min-h-14 items-center justify-between rounded-2xl bg-zinc-100 px-5 text-base font-bold text-zinc-800 transition hover:bg-zinc-200 focus-visible:bg-zinc-200"
            >
              {shared ? 'Link copied' : `Share ${person.firstName}'s card`}
              <Icon path={icons.share} />
            </button>
          </div>

          <footer className="mt-10 border-t border-zinc-200 pt-6 text-center text-sm text-zinc-600">
            <p>
              Office <a href={businessInfo.phoneHref} className="font-semibold text-zinc-800 hover:text-orange-700">{businessInfo.phone}</a>
            </p>
            <p className="mt-1">
              <Link to="/" className="font-semibold text-zinc-800 hover:text-orange-700">neconstructioniowa.com</Link>
            </p>
          </footer>
        </div>
      </article>
    </div>
  )
}

export default Card

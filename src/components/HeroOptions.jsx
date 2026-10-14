import { Link } from 'react-router-dom'
import { businessInfo } from '../data/businessInfo.js'
import { useLanguage } from '../i18n/useLanguage.js'

// Preview-only homepage directions, picked with ?opcion=a|b|c. Copy lives here
// (not in i18n) until Chris and Erick choose one.
const copy = {
  en: {
    a: {
      title: 'Concrete for Central Iowa builders.',
      lead: 'Basements, garages, driveways and flatwork. Poured on your date.',
    },
    b: {
      eyebrow: 'For home builders and general contractors',
      title: 'Up to 3 houses a day, per crew.',
      lead: 'Basements and garage slabs on your schedule. We get your PO, book the crew, confirm with your super and pour.',
      trusted: 'Builders who keep calling us back',
      capacity: [
        ['3', 'houses a day per pour crew'],
        ['300', 'yards a day on streets and lots'],
        ['48 h', 'to answer any quote'],
      ],
    },
    c: {
      eyebrow: 'Family-owned since 2019 · Se habla español',
      title: 'We want to be the easy part of your build.',
      quote:
        'We know how much responsibility a builder carries. Our goal is to help carry that load.',
      owner: 'Christian Rubio, owner',
      values: ['On time', 'Clean jobsites', 'English & Spanish', 'One-year warranty'],
    },
    call: 'Call',
    quote: 'Get a quote',
  },
  es: {
    a: {
      title: 'Concreto para constructores del centro de Iowa.',
      lead: 'Sótanos, garajes, driveways y flatwork. Colado en su fecha.',
    },
    b: {
      eyebrow: 'Para constructores y contratistas generales',
      title: 'Hasta 3 casas al día, por cuadrilla.',
      lead: 'Sótanos y pisos de garaje en su calendario. Recibimos su PO, apartamos la cuadrilla, confirmamos con su supervisor y colamos.',
      trusted: 'Constructores que nos siguen llamando',
      capacity: [
        ['3', 'casas al día por cuadrilla'],
        ['300', 'yardas al día en calles y estacionamientos'],
        ['48 h', 'para responder cualquier cotización'],
      ],
    },
    c: {
      eyebrow: 'Empresa familiar desde 2019 · Se habla español',
      title: 'Queremos ser la parte fácil de su obra.',
      quote:
        'Entendemos toda la responsabilidad que carga un constructor. Nuestro objetivo es ayudar con esa carga.',
      owner: 'Christian Rubio, dueño',
      values: ['Puntuales', 'Obra limpia', 'Inglés y español', 'Garantía de un año'],
    },
    call: 'Llamar',
    quote: 'Pedir cotización',
  },
}

const statKeys = ['jobs', 'yearYards', 'peakYards', 'years']

function Buttons({ c, to, dark = true }) {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Link
        to={to('/contact')}
        className="rounded-full bg-orange-600 px-7 py-4 text-center font-black text-white transition hover:bg-orange-700"
      >
        {c.quote}
      </Link>
      <a
        href={businessInfo.phoneHref}
        className={`rounded-full border px-7 py-4 text-center font-black transition ${
          dark ? 'border-white/30 text-white hover:bg-white/10' : 'border-zinc-300 text-zinc-900 hover:border-orange-600'
        }`}
      >
        {c.call} {businessInfo.phone}
      </a>
    </div>
  )
}

// A: big photo, few words, numbers under the photo.
export function HeroA() {
  const { lang, t, to } = useLanguage()
  const c = copy[lang]
  return (
    <>
      <section className="relative isolate flex min-h-[78vh] items-end overflow-hidden bg-zinc-950 px-4 pb-14 pt-32 text-white sm:px-6 lg:px-8">
        <img
          src="/media/photos/A10-2880w.webp"
          alt={t.hero.photoAlt}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/10" />
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl">{c.a.title}</h1>
          <p className="mt-5 max-w-xl text-xl text-zinc-200">{c.a.lead}</p>
          <Buttons c={c} to={to} />
        </div>
      </section>
      <dl className="grid grid-cols-2 bg-orange-600 text-white sm:grid-cols-4">
        {statKeys.map((key) => (
          <div key={key} className="border-white/20 px-5 py-6 text-center sm:border-l first:border-l-0">
            <dd className="text-3xl font-black sm:text-4xl">{businessInfo.stats[key]}</dd>
            <dt className="mt-1 text-xs font-bold leading-5 text-orange-50">{t.hero.stats[key]}</dt>
          </div>
        ))}
      </dl>
    </>
  )
}

// B: capacity and builder names first. Talks only to builders.
export function HeroB() {
  const { lang, to } = useLanguage()
  const c = copy[lang]
  return (
    <section className="bg-zinc-50 px-4 pb-12 pt-14 sm:px-6 lg:px-8 lg:pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-700">{c.b.eyebrow}</p>
            <h1 className="mt-4 text-5xl font-black leading-[0.95] tracking-tight text-zinc-950 sm:text-7xl">
              {c.b.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">{c.b.lead}</p>
            <Buttons c={c} to={to} dark={false} />
          </div>
          <ul className="grid gap-3">
            {c.b.capacity.map(([value, label]) => (
              <li key={label} className="flex items-baseline gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <span className="w-24 shrink-0 text-4xl font-black text-orange-600">{value}</span>
                <span className="font-bold text-zinc-700">{label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-14 border-t border-zinc-200 pt-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">{c.b.trusted}</p>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-xl font-black text-zinc-800">
            {businessInfo.builders.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

// C: the people. Owner quote, values, warm light background.
export function HeroC() {
  const { lang, to } = useLanguage()
  const c = copy[lang]
  return (
    <section className="bg-[#F4F3EF] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-700">{c.c.eyebrow}</p>
          <h1 className="mt-4 text-5xl font-black leading-[0.98] tracking-tight text-zinc-950 sm:text-6xl">
            {c.c.title}
          </h1>
          <blockquote className="mt-8 border-l-4 border-orange-600 pl-5 text-xl leading-8 text-zinc-700">
            “{c.c.quote}”
            <footer className="mt-3 text-sm font-black not-italic text-zinc-950">{c.c.owner}</footer>
          </blockquote>
          <ul className="mt-8 flex flex-wrap gap-2">
            {c.c.values.map((value) => (
              <li key={value} className="rounded-full bg-white px-4 py-2 text-sm font-black text-zinc-800 shadow-sm">
                ✓ {value}
              </li>
            ))}
          </ul>
          <Buttons c={c} to={to} dark={false} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <img src="/media/photos/A10-1920w.webp" alt="" className="col-span-2 aspect-[16/9] w-full rounded-3xl object-cover" />
          <img src="/media/photos/A9-1920w.webp" alt="" className="aspect-square w-full rounded-3xl object-cover" />
          <img src="/media/photos/A8-1920w.webp" alt="" className="aspect-square w-full rounded-3xl object-cover" />
        </div>
      </div>
    </section>
  )
}

const labels = [
  ['', 'Actual'],
  ['a', 'A · Foto grande'],
  ['b', 'B · Constructores'],
  ['c', 'C · Familia'],
]

// Floating switcher so whoever reviews can flip between options.
export function OptionSwitcher({ current }) {
  return (
    <nav className="fixed inset-x-0 bottom-20 z-50 mx-auto flex w-fit max-w-[calc(100%-2rem)] flex-wrap justify-center gap-1 rounded-full bg-zinc-950/90 p-1.5 text-sm shadow-2xl backdrop-blur sm:bottom-6">
      {labels.map(([key, label]) => (
        <a
          key={key || 'actual'}
          href={key ? `?opcion=${key}` : '?opcion=actual'}
          className={`rounded-full px-3 py-1.5 font-bold ${
            current === (key || 'actual') ? 'bg-orange-600 text-white' : 'text-zinc-300 hover:text-white'
          }`}
        >
          {label}
        </a>
      ))}
    </nav>
  )
}

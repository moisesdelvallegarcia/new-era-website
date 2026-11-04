import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ContactForm from '../components/ContactForm.jsx'
import { businessInfo } from '../data/businessInfo.js'
import { findTeamMember } from '../data/team.js'
import { copy } from './presentationCopy.js'
import './presentation.css'

// Company presentation sent as a link to builders and general contractors
// (/presentation, optionally ?for=<Company> and ?lang=es). v5, option D: the
// monument and the contact sheet together. The promise POUR DATE / DOESN'T
// MOVE is set as wide as the screen with the job video running inside the
// letters, and right under it a contact sheet of the pour day (frames, clips
// and the facts as cells of their own) proves it on the first scroll. The page
// then argues it in v4's order: what a late pour costs, the season in numbers,
// PO to invoice, what we pour (runs of frames that develop into colour), who
// we pour for, the risk we carry, and the close: pick a pour date and the
// houses (it goes to Bernardo on WhatsApp) or send the plan for a quote.
// Palette "Buzzcocks" (Adobe Color): charcoal, rust, near-black, teal, cream.
// English by default, Mexican Spanish with ?lang=es (every word is in
// presentationCopy.js). No site menu or footer. Only New Era's own job photos,
// clips and stills pulled from those clips: the A0x/A1x/A4/A8/A9 photos and
// new-era-construction.mp4 from the old site are stock.

// WhatsApp goes to the sales rep: the office line may not have WhatsApp.
const sales = findTeamMember('bernardo')
const waNumber = sales.phoneE164.replace('+', '')
const whatsappLink = (text) => `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`

const photo = (name) => `/media/photos/${name}`
const still = (clip, n) => `/media/frames/obra-2026-10-${clip}-frame-${n}.webp`
// Photos exported at 640w and 1920w get both sizes.
const sizes = (base) => ({
  src: photo(`${base}-1920w.webp`),
  srcSet: `${photo(`${base}-640w.webp`)} 640w, ${photo(`${base}-1920w.webp`)} 1920w`,
})

// Ratios are width / height, so each frame keeps its natural shape and a row
// of them comes out the same height. The third item is the key of its alt
// text in presentationCopy.js.
const WIDE = 4 / 3
const TALL = 3 / 4
const CLIP = 480 / 861

const P = {
  pour: [photo('obra-2026-10-pour-640w.webp'), WIDE, 'pour'],
  pourWide: [photo('obra-2026-10-pour-wide-640w.webp'), WIDE, 'pourWide'],
  placing: [photo('obra-2026-10-placing-640w.webp'), TALL, 'placing'],
  screed: [photo('obra-2026-10-crew-screed-640w.webp'), WIDE, 'screed'],
  finishing: [photo('obra-2026-10-finishing-640w.webp'), WIDE, 'finishing'],
  driveway: [photo('obra-2026-10-house-driveway-640w.webp'), WIDE, 'driveway'],
  edge: [photo('obra-2026-10-edge-detail-640w.webp'), TALL, 'edge'],
  walk: [photo('IMG_20211118_162502-640w.webp'), TALL, 'walk'],
  steps: [photo('IMG_20211118_162521-640w.webp'), TALL, 'steps'],
  blockWall: [photo('IMG_20211118_162526-640w.webp'), TALL, 'blockWall'],
  lakeWalk: [photo('IMG_20211118_162530-640w.webp'), TALL, 'lakeWalk'],
  patio: [photo('IMG_20211118_162534-640w.webp'), TALL, 'patio'],
}
const F = (n) => [still('finishing', n), CLIP, `f${n}`]
const E = (n) => [still('edging', n), CLIP, `e${n}`]

// The season in numbers. Pours, addresses and builders: Housecall jobs
// Jan 6 – Oct 31, 2026. Truckloads: DeliveryGo tickets for the same months.
// Yards come from businessInfo.stats.yearYards. Labels are in the copy.
const SEASON = ['630+', '1,700+', '284', '30']

// The contact sheet under the promise: a pour day from truck to finished
// drive, with the facts printed as cells of their own. Rows are justified, so
// every cell in a row has the same height. Strip and unit keys point into the
// copy's `sheet`.
const SHEET = {
  pour: { pic: P.pour, strip: 'pour' },
  yards: { fact: businessInfo.stats.yearYards, unit: 'yardsUnit', strip: 'yardsStrip', tone: 'rust' },
  chute: { pic: P.placing, strip: 'chute' },
  screed: { pic: F(2), strip: 'screed' },
  pours: { fact: '630+', unit: 'poursUnit', strip: 'poursStrip', tone: 'cream' },
  driveway: { pic: P.driveway, strip: 'driveway' },
  float: { pic: F(5), strip: 'float' },
  quote: { fact: '48 h', unit: 'quoteUnit', strip: 'quoteStrip', tone: 'teal' },
  hand: { pic: P.finishing, strip: 'hand' },
  edge: { pic: E(6), strip: 'edge' },
  crews: { fact: '2 × 7', unit: 'crewsUnit', strip: 'crewsStrip', tone: 'charcoal' },
  patio: { pic: P.patio, strip: 'patio' },
  done: { pic: F(8), strip: 'done' },
}
const SHEET_ROWS = {
  wide: [
    ['pour', 'yards', 'chute', 'screed', 'pours', 'driveway'],
    ['float', 'quote', 'hand', 'edge', 'crews', 'patio', 'done'],
  ],
  phone: [
    ['pour', 'yards'],
    ['chute', 'screed', 'pours'],
    ['quote', 'hand'],
    ['edge', 'crews', 'patio'],
  ],
}

// The work: one run of frames per stage of a pour day, in order.
const RUNS = [
  { id: 'placing', year: 2026, frames: [P.pour, P.placing, F(1), P.pourWide] },
  { id: 'screed', year: 2026, frames: [P.screed, F(3), F(4), F(6)] },
  { id: 'edging', year: 2026, frames: [E(1), E(2), P.edge, E(4), E(8)] },
  { id: 'finished', year: 2021, frames: [P.walk, P.steps, P.blockWall, P.lakeWalk] },
]

// Small pictures for the pour planner: one per house.
const HOUSE_FRAMES = [P.driveway, P.pourWide, P.finishing, P.screed, P.pour, P.patio]
const PER_CREW = 3
const CREWS = 2
const MAX_HOUSES = 30

const DAY = 24 * 60 * 60 * 1000
const atMidnight = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
// en-CA writes dates as YYYY-MM-DD, the format a date input expects.
const toInput = (date) => date.toLocaleDateString('en-CA')
const fromInput = (value) => {
  const [y, m, d] = value.split('-').map(Number)
  return y && m && d ? new Date(y, m - 1, d) : null
}

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function usePageSetup(t) {
  useEffect(() => {
    const links = [
      ['preconnect', 'https://fonts.googleapis.com'],
      ['preconnect', 'https://fonts.gstatic.com'],
      ['stylesheet', 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&family=Bebas+Neue&display=swap'],
    ].map(([rel, href]) => {
      const link = document.createElement('link')
      link.rel = rel
      link.href = href
      if (href.includes('gstatic')) link.crossOrigin = ''
      document.head.appendChild(link)
      return link
    })
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.appendChild(robots)
    document.documentElement.classList.add('js')
    const ground = document.body.style.background
    document.body.style.background = '#000000'
    return () => {
      document.body.style.background = ground
      links.forEach((link) => link.remove())
      robots.remove()
      document.documentElement.classList.remove('js')
    }
  }, [])

  // The document's language follows the page's, and goes back when it closes.
  useEffect(() => {
    const before = document.documentElement.lang
    document.documentElement.lang = t.htmlLang
    return () => {
      document.documentElement.lang = before
    }
  }, [t])
}

function useWide(query = '(min-width: 701px)') {
  const [wide, setWide] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const list = window.matchMedia(query)
    const change = () => setWide(list.matches)
    list.addEventListener('change', change)
    return () => list.removeEventListener('change', change)
  }, [query])
  return wide
}

// Parts marked data-rise rise once as they enter the screen; frames marked
// data-shutter open from the bottom edge and sheets marked data-develop turn
// from grey prints into colour (both watched through their parent, since a
// part clipped shut has no visible area). A jump down the page, like the quote
// link, also reveals everything it passed over.
function useRise(root, deps) {
  useEffect(() => {
    const targets = new Map()
    const add = (watched, el) => targets.set(watched, [...(targets.get(watched) || []), el])
    root.current.querySelectorAll('[data-shutter], [data-develop]').forEach((el) => add(el.parentElement, el))
    root.current.querySelectorAll('[data-rise]').forEach((el) => add(el, el))
    const reveal = (watched) => {
      targets.get(watched)?.forEach((el) => el.classList.add('pd-in'))
      observer.unobserve(watched)
      targets.delete(watched)
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) reveal(entry.target)
        for (const watched of [...targets.keys()]) if (watched.getBoundingClientRect().bottom < 0) reveal(watched)
      },
      { threshold: 0.12 }
    )
    targets.forEach((_, watched) => observer.observe(watched))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, ...deps])
}

// A muted loop that only plays while it is on screen, and never under
// reduced motion (the poster stays). Below the fold it loads nothing until
// it comes near.
function Clip({ name, label, eager = false, className }) {
  const ref = useRef(null)
  useEffect(() => {
    const video = ref.current
    if (reducedMotion()) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { rootMargin: '200px 0px' }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])
  return (
    <video
      ref={ref}
      className={className}
      src={`/media/videos/obra-2026-10-${name}.mp4`}
      poster={`/media/videos/obra-2026-10-${name}-poster.webp`}
      muted
      loop
      playsInline
      preload={eager ? 'auto' : 'none'}
      aria-label={label}
    />
  )
}

// A figure counts up once, the first time it is seen. The real figure is in
// the markup from the start, for readers without script or motion.
function CountUp({ value }) {
  const target = Number(value.replace(/[^0-9]/g, ''))
  const suffix = value.replace(/[0-9,]/g, '')
  const ref = useRef(null)
  const [shown, setShown] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (reducedMotion() || !target || el.getBoundingClientRect().top < window.innerHeight) return undefined
    let frame = 0
    setShown(`0${suffix}`)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now) => {
          const t = Math.min(1, (now - start) / 1600)
          const eased = 1 - Math.pow(1 - t, 4)
          setShown(`${Math.round(target * eased).toLocaleString('en-US')}${suffix}`)
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      setShown(value)
    }
  }, [target, suffix, value])

  return (
    <span className="pd-count">
      <span className="pd-count-room" aria-hidden="true">{value}</span>
      <span ref={ref} className="pd-count-live" aria-hidden="true">{shown}</span>
      <span className="pd-sr">{value}</span>
    </span>
  )
}

// One cell of the contact sheet: a frame with its strip, or a fact printed on
// a field of colour.
function Cell({ item, index, t }) {
  if (item.fact) {
    return (
      <figure className={`pd-cell pd-fact pd-fact-${item.tone}`} style={{ '--r': 0.86, '--i': index }}>
        <div className="pd-cell-frame">
          <p className="pd-fact-figure">{item.fact}</p>
          <p className="pd-fact-unit">{t.sheet[item.unit]}</p>
        </div>
        <figcaption className="pd-strip">{t.sheet[item.strip]}</figcaption>
      </figure>
    )
  }
  const [src, ratio, alt] = item.pic
  return (
    <figure className="pd-cell" style={{ '--r': ratio, '--i': index }}>
      <div className="pd-cell-frame">
        <img src={src} alt={t.alt[alt]} width="640" height={Math.round(640 / ratio)} />
      </div>
      <figcaption className="pd-strip">{t.sheet[item.strip]}</figcaption>
    </figure>
  )
}

function Sheet({ t }) {
  // Seven frames to a row need a computer screen; narrower, the rows hold two or three.
  const wide = useWide('(min-width: 1101px)')
  const rows = wide ? SHEET_ROWS.wide : SHEET_ROWS.phone
  let index = 0
  return (
    <div className="pd-sheet" aria-label={t.sheet.label}>
      <div className="pd-sheet-rows" data-develop>
        {rows.map((row) => (
          <div key={row.join()} className="pd-sheet-row">
            {row.map((key) => (
              <Cell key={key} item={SHEET[key]} index={index++} t={t} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// EN / ES, keeping ?for= so a personalised link stays personalised.
function LanguageToggle({ t, lang, params }) {
  const linkFor = (target) => {
    const next = new URLSearchParams(params)
    if (target === 'es') next.set('lang', 'es')
    else next.delete('lang')
    const query = next.toString()
    return `/presentation${query ? `?${query}` : ''}`
  }
  return (
    <span className="pd-lang" role="group" aria-label={t.nav.language}>
      {[
        ['en', 'EN', 'English'],
        ['es', 'ES', 'Español'],
      ].map(([code, short, name]) => (
        <Link
          key={code}
          to={linkFor(code)}
          className="pd-link"
          aria-label={name}
          aria-current={lang === code ? 'true' : undefined}
          lang={code}
          hrefLang={code}
        >
          {short}
        </Link>
      ))}
    </span>
  )
}

function Hero({ t, lang, params, company, heroRef, whatsappHref }) {
  const wide = useWide()
  return (
    <section ref={heroRef} className="pd-hero" aria-labelledby="pd-title">
      <div className="pd-hero-top">
        <nav className="pd-nav" aria-label={t.nav.label}>
          <Link to={lang === 'es' ? '/es' : '/'} className="pd-wordmark">
            <img src={businessInfo.logo} alt="" width="32" height="32" />
            {businessInfo.name}
          </Link>
          {company && <p className="pd-for">{t.nav.for(company)}</p>}
          <div className="pd-nav-links">
            <a href="#process" className="pd-link pd-wide-only">{t.nav.process}</a>
            <a href="#work" className="pd-link pd-wide-only">{t.nav.work}</a>
            <a href="#builders" className="pd-link pd-wide-only">{t.nav.builders}</a>
            <a href={businessInfo.phoneHref} className="pd-link">{wide ? businessInfo.phone : t.nav.call}</a>
            <LanguageToggle t={t} lang={lang} params={params} />
          </div>
        </nav>

        {/* The letters are white on black, multiplied over the clip: the
            footage shows through the letters and the black stays black. */}
        <div className="pd-knock">
          <Clip name="finishing" label={t.hero.clip} eager className="pd-knock-clip" />
          <h1 id="pd-title" className="pd-monument">
            <span className="pd-mask pd-line-top"><span data-line style={{ '--i': 0 }}>{t.hero.top}</span></span>
            <span className="pd-mask pd-line-bottom"><span data-line style={{ '--i': 1 }}>{t.hero.bottom}</span></span>
          </h1>
        </div>

        <div className="pd-hero-foot pd-after">
          <p className="pd-hero-lead">{t.hero.lead}</p>
          <div className="pd-hero-actions">
            <a href="#date" className="pd-action">{t.hero.action}</a>
            <a href={whatsappHref} className="pd-link pd-underline" target="_blank" rel="noreferrer">
              {t.hero.whatsapp(sales.firstName)}
            </a>
          </div>
        </div>
      </div>

      <Sheet t={t} />
    </section>
  )
}

function Cost({ t }) {
  return (
    <section className="pd-cost pd-light" aria-labelledby="pd-cost">
      <div className="pd-split">
        <h2 id="pd-cost" className="pd-head" data-rise>{t.cost.head}</h2>
        <p className="pd-lead" data-rise style={{ '--d': 1 }}>{t.cost.lead}</p>
      </div>
      <ol className="pd-slip" aria-label={t.cost.slipLabel} data-rise>
        {t.cost.slip.map((line, index) => (
          <li key={line} style={{ '--n': index }}>{line}</li>
        ))}
      </ol>
      <p className="pd-cost-turn" data-rise style={{ '--d': 2 }}>{t.cost.turn}</p>
    </section>
  )
}

function Season({ t }) {
  return (
    <section className="pd-season pd-dark" aria-labelledby="pd-season">
      <div className="pd-split">
        <h2 id="pd-season" className="pd-head" data-rise>{t.season.head}</h2>
        <p className="pd-note" data-rise style={{ '--d': 1 }}>{t.season.note}</p>
      </div>
      <p className="pd-yards" data-rise style={{ '--d': 1 }}>
        <span className="pd-yards-figure"><CountUp value={businessInfo.stats.yearYards} /></span>
        <span className="pd-yards-label">{t.season.yards}</span>
      </p>
      <dl className="pd-figures">
        {SEASON.map((value, index) => (
          <div key={value} data-rise style={{ '--d': index + 2 }}>
            <dt><CountUp value={value} /></dt>
            <dd>{t.season.figures[index]}</dd>
          </div>
        ))}
      </dl>
      <figure className="pd-wide">
        <div className="pd-wide-frame">
          <img
            {...sizes('obra-2026-10-pour-wide')}
            sizes="100vw"
            alt={t.alt.wide}
            width="1920"
            height="1440"
            loading="lazy"
          />
        </div>
        <figcaption>{t.season.caption}</figcaption>
      </figure>
    </section>
  )
}

function Process({ t }) {
  return (
    <section className="pd-process pd-light" id="process" aria-labelledby="pd-process">
      <div className="pd-process-media">
        <div className="pd-process-frame" data-shutter>
          <Clip name="edging" label={t.alt.edgingClip} />
        </div>
      </div>
      <div className="pd-process-text">
        <h2 id="pd-process" className="pd-head" data-rise>{t.process.head}</h2>
        <p className="pd-lead" data-rise style={{ '--d': 1 }}>{t.process.lead}</p>
        <ol className="pd-steps">
          {t.process.steps.map(([title, text], index) => (
            <li key={title} data-rise style={{ '--d': index % 2 }}>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Work({ t }) {
  const [hovered, setHovered] = useState(null)
  const [inView, setInView] = useState(RUNS[0].id)
  const list = useRef(null)

  // The run in the middle of the screen develops into colour; the rest stay
  // printed in grey, like a contact sheet. Pointing at a run lights it.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setInView(entry.target.dataset.run)
      },
      { rootMargin: '-42% 0px -42% 0px' }
    )
    list.current.querySelectorAll('[data-run]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  const lit = hovered || inView

  return (
    <section className="pd-work pd-pit" id="work" aria-labelledby="pd-work">
      <div className="pd-rail">
        <h2 id="pd-work" className="pd-head" data-rise>{t.work.head}</h2>
        <p className="pd-lead" data-rise style={{ '--d': 1 }}>{t.work.lead}</p>
        <ul className="pd-services">
          {t.work.services.map(([name, text], index) => (
            <li key={name} data-rise style={{ '--d': (index % 3) + 1 }}>
              <h3>{name}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
      <ul ref={list} className="pd-runs" aria-label={t.work.runsLabel}>
        {RUNS.map((run) => {
          const [name, note] = t.work.runs[run.id]
          return (
            <li
              key={run.id}
              data-run={run.id}
              className={`pd-run ${lit === run.id ? 'pd-lit' : ''}`}
              onMouseEnter={() => setHovered(run.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(run.id)}
              onBlur={() => setHovered(null)}
            >
              <div className="pd-run-frames" tabIndex={0} aria-label={`${name}, ${run.year}`}>
                <span className="pd-run-row">
                  {run.frames.map(([src, ratio, alt]) => (
                    <img key={src} src={src} alt={t.alt[alt]} loading="lazy" width="640" height={Math.round(640 / ratio)} style={{ '--r': ratio }} />
                  ))}
                </span>
              </div>
              <div className="pd-run-line">
                <h3>{name}</h3>
                <p>{note}, {run.year}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Builders({ t }) {
  if (!businessInfo.showBuilderNames) return null
  const names = businessInfo.builders
  const run = (hidden) => (
    <span className="pd-names" aria-hidden={hidden || undefined}>
      {names.map((name) => (
        <span key={name}>
          {name}
          <span className="pd-dot" />
        </span>
      ))}
    </span>
  )
  return (
    <section className="pd-builders" id="builders" aria-labelledby="pd-builders">
      <div className="pd-split">
        <h2 id="pd-builders" className="pd-head" data-rise>{t.builders.head}</h2>
        <p className="pd-lead" data-rise style={{ '--d': 1 }}>{t.builders.lead}</p>
      </div>
      <div className="pd-band" lang="en">
        <div className="pd-track">
          {run(false)}
          {run(true)}
        </div>
      </div>
    </section>
  )
}

function Promise({ t }) {
  return (
    <section className="pd-promise pd-light" aria-labelledby="pd-promise">
      <figure className="pd-promise-photo">
        <div className="pd-promise-frame" data-shutter>
          <img
            {...sizes('obra-2026-10-crew-screed')}
            sizes="(min-width: 821px) 42vw, 100vw"
            alt={t.alt.crew}
            width="1920"
            height="1440"
            loading="lazy"
          />
        </div>
      </figure>
      <div className="pd-promise-text">
        <h2 id="pd-promise" className="pd-head" data-rise>{t.promise.head}</h2>
        <dl className="pd-promises">
          {t.promise.items(businessInfo.phone, businessInfo.owner).map(([title, text], index) => (
            <div key={title} data-rise style={{ '--d': index + 1 }}>
              <dt>{title}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

// The live thing: pick the first pour date and the houses in the phase. The
// date is set as display type, the houses fall into pour days for both crews
// as rows of a contact sheet, and the whole booking goes to Bernardo on
// WhatsApp.
function PourDate({ t, company }) {
  const today = useMemo(() => atMidnight(new Date()), [])
  const earliest = new Date(today.getTime() + 2 * DAY)
  const [value, setValue] = useState(() => toInput(new Date(today.getTime() + 7 * DAY)))
  const [houses, setHouses] = useState(6)
  const chosen = fromInput(value) || earliest
  const change = (step) => setHouses((current) => Math.min(MAX_HOUSES, Math.max(1, current + step)))
  const perDay = PER_CREW * CREWS
  const days = Math.ceil(houses / perDay)
  const rows = Array.from({ length: days }, (_, d) =>
    Array.from({ length: Math.min(perDay, houses - d * perDay) }, (_, h) => d * perDay + h)
  )
  const when = t.longDate(chosen)
  const href = whatsappLink(t.whatsapp.book(sales.firstName, company, houses, when))

  return (
    <section className="pd-date pd-pit" id="date" aria-labelledby="pd-date">
      <div className="pd-split">
        <h2 id="pd-date" className="pd-head">{t.date.head}</h2>
        <p className="pd-lead">{t.date.lead(sales.firstName)}</p>
      </div>

      {/* The chosen date is set like the promise: footage inside the letters. */}
      <div className="pd-knock pd-knock-date">
        <Clip name="edging" label={t.alt.edgingClip} className="pd-knock-clip" />
        <p className="pd-date-big" aria-live="polite">
          <span key={value}>{t.shortDate(chosen)}</span>
        </p>
      </div>

      <div className="pd-date-controls">
        <label className="pd-field">
          <span>{t.date.first}</span>
          <input
            type="date"
            lang={t.htmlLang}
            value={value}
            min={toInput(earliest)}
            onChange={(event) => setValue(event.target.value)}
          />
        </label>
        <div className="pd-field">
          <span id="pd-houses-label">{t.date.houses}</span>
          <div className="pd-stepper" role="group" aria-labelledby="pd-houses-label">
            <button type="button" onClick={() => change(-1)} aria-label={t.date.fewer} disabled={houses <= 1}>−</button>
            <output aria-live="polite">{t.date.count(houses)}</output>
            <button type="button" onClick={() => change(1)} aria-label={t.date.more} disabled={houses >= MAX_HOUSES}>+</button>
          </div>
        </div>
      </div>

      <div className="pd-plan">
        <p className="pd-plan-answer">{t.date.answer(houses, days, when)}</p>
        <ol className="pd-days" aria-label={t.date.daysLabel}>
          {rows.map((row, d) => (
            <li key={d}>
              <span className="pd-day-name">{t.date.day(d + 1)}</span>
              <span className="pd-day-crews">
                {[row.slice(0, PER_CREW), row.slice(PER_CREW)].map((crew, c) =>
                  crew.length ? (
                    <span key={c} className="pd-crew">
                      {crew.map((n) => {
                        const [src] = HOUSE_FRAMES[n % HOUSE_FRAMES.length]
                        return (
                          <span key={n} className="pd-house">
                            <img src={src} alt="" loading="lazy" width="640" height="480" />
                            <span>{t.date.house(n + 1)}</span>
                          </span>
                        )
                      })}
                    </span>
                  ) : null
                )}
              </span>
            </li>
          ))}
        </ol>
        <p className="pd-plan-note">{t.date.note}</p>
      </div>

      <div className="pd-date-actions">
        <a href={href} className="pd-action" target="_blank" rel="noreferrer">
          {t.date.send(houses, sales.firstName)}
        </a>
        <a href={businessInfo.phoneHref} className="pd-link pd-underline">{t.date.call(businessInfo.phone)}</a>
        <a href="#quote" className="pd-link pd-underline">{t.date.quote}</a>
      </div>
    </section>
  )
}

function Quote({ t, lang, company }) {
  const { address } = businessInfo
  return (
    <section className="pd-quote pd-light" id="quote" aria-labelledby="pd-quote">
      <div className="pd-quote-text">
        <h2 id="pd-quote" className="pd-head" data-rise>{t.quote.head}</h2>
        <p className="pd-lead" data-rise style={{ '--d': 1 }}>{t.quote.lead(company)}</p>
        <div className="pd-owner" data-rise style={{ '--d': 2 }}>
          <p>
            {t.quote.owner(businessInfo.owner)}
            <br />
            {address.street}, {address.city}, {address.state} {address.zip}
          </p>
          <p>
            <a href={businessInfo.phoneHref} className="pd-link pd-underline">{businessInfo.phone}</a>
            <br />
            <a href={businessInfo.emailHref} className="pd-link pd-underline">{businessInfo.email}</a>
          </p>
        </div>
        <div className="pd-quote-photo" data-rise style={{ '--d': 3 }}>
          <img
            {...sizes('obra-2026-10-placing')}
            sizes="40vw"
            alt={t.alt.chute}
            width="1440"
            height="1920"
            loading="lazy"
          />
        </div>
      </div>
      <div className="pd-form" data-rise style={{ '--d': 1 }}>
        <ContactForm lang={lang} />
      </div>
    </section>
  )
}

function ActionBar({ t, visible, whatsappHref }) {
  const tab = visible ? 0 : -1
  return (
    <div className={`pd-bar ${visible ? 'pd-on' : ''}`} aria-hidden={!visible}>
      <p>{t.bar.ask}</p>
      <a href={businessInfo.phoneHref} className="pd-action pd-action-quiet" tabIndex={tab}>{t.bar.call}</a>
      <a href={whatsappHref} className="pd-action pd-action-quiet" target="_blank" rel="noreferrer" tabIndex={tab}>{t.bar.whatsapp}</a>
      <a href="#date" className="pd-action" tabIndex={tab}>{t.bar.book}</a>
    </div>
  )
}

function Presentation() {
  const [params] = useSearchParams()
  const company = (params.get('for') || '').trim().slice(0, 60)
  const lang = params.get('lang') === 'es' ? 'es' : 'en'
  const t = copy[lang]
  const root = useRef(null)
  const hero = useRef(null)
  const contact = useRef(null)
  const [pastHero, setPastHero] = useState(false)
  const [atContact, setAtContact] = useState(false)
  const wide = useWide('(min-width: 1101px)')
  usePageSetup(t)
  useRise(root, [wide, lang])

  useEffect(() => {
    document.title = t.title(company)
  }, [t, company])

  // The action bar shows once the first screen has gone by, and steps aside
  // again at the date picker and the form, which carry their own actions.
  useEffect(() => {
    const heroWatch = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), { threshold: 0 })
    const contactWatch = new IntersectionObserver(([entry]) => setAtContact(entry.isIntersecting))
    heroWatch.observe(hero.current.firstElementChild)
    contactWatch.observe(contact.current)
    return () => {
      heroWatch.disconnect()
      contactWatch.disconnect()
    }
  }, [])

  const whatsappHref = whatsappLink(t.whatsapp.quote(sales.firstName, company))

  return (
    <div ref={root} className={`pd pd-${lang}`} lang={t.htmlLang}>
      <Hero t={t} lang={lang} params={params} company={company} heroRef={hero} whatsappHref={whatsappHref} />
      <Cost t={t} />
      <Season t={t} />
      <Process t={t} />
      <Work t={t} />
      <Builders t={t} />
      <Promise t={t} />
      <div ref={contact}>
        <PourDate t={t} company={company} />
        <Quote t={t} lang={lang} company={company} />
      </div>

      <footer className="pd-footer">
        <div className="pd-footer-row">
          <p className="pd-footer-line">
            {t.footer.line(businessInfo.serviceArea.join(', '), businessInfo.founded)}{' '}
            <Link to={lang === 'es' ? '/es' : '/'} className="pd-link pd-underline">neconstructioniowa.com</Link>
          </p>
          <a href="#date" className="pd-action">{t.footer.action}</a>
        </div>
        <p className="pd-footer-name" aria-hidden="true">New Era</p>
      </footer>

      <ActionBar t={t} visible={pastHero && !atContact} whatsappHref={whatsappHref} />
    </div>
  )
}

export default Presentation

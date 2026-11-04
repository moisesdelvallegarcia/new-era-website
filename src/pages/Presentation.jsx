import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ContactForm from '../components/ContactForm.jsx'
import { businessInfo } from '../data/businessInfo.js'
import { findTeamMember } from '../data/team.js'
import './presentation.css'

// Company presentation sent as a link to builders and general contractors
// (/presentation, optionally ?for=<Company>). v5, option D: the monument and
// the contact sheet together. The promise POUR DATE / DOESN'T MOVE is set as
// wide as the screen with the job video running inside the letters, and right
// under it a contact sheet of the pour day (frames, clips and the facts as
// cells of their own) proves it on the first scroll. The page then argues it
// in v4's order: what a late pour costs, the season in numbers, PO to invoice,
// what we pour (runs of frames that develop into colour), who we pour for, the
// risk we carry, and the close: pick a pour date and the houses (it goes to
// Bernardo on WhatsApp) or send the plan for a quote. Palette "Buzzcocks"
// (Adobe Color): charcoal, rust, near-black, teal, cream. English only, no
// site menu or footer. Only New Era's own job photos, clips and stills pulled
// from those clips: the A0x/A1x/A4/A8/A9 photos and new-era-construction.mp4
// from the old site are stock.

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
// of them comes out the same height.
const WIDE = 4 / 3
const TALL = 3 / 4
const CLIP = 480 / 861

const P = {
  pour: [photo('obra-2026-10-pour-640w.webp'), WIDE, 'Ready-mix truck pouring at a new home'],
  pourWide: [photo('obra-2026-10-pour-wide-640w.webp'), WIDE, 'Crew placing a slab beside the truck'],
  placing: [photo('obra-2026-10-placing-640w.webp'), TALL, 'Concrete running down the chute into the forms'],
  screed: [photo('obra-2026-10-crew-screed-640w.webp'), WIDE, 'Crew screeding a fresh slab'],
  finishing: [photo('obra-2026-10-finishing-640w.webp'), WIDE, 'Finisher working a garage slab by hand'],
  driveway: [photo('obra-2026-10-house-driveway-640w.webp'), WIDE, 'Driveway poured in front of a new home'],
  edge: [photo('obra-2026-10-edge-detail-640w.webp'), TALL, 'Edge tooled along the form'],
  walk: [photo('IMG_20211118_162502-640w.webp'), TALL, 'Sidewalk along a retaining wall'],
  steps: [photo('IMG_20211118_162521-640w.webp'), TALL, 'Steps down a side yard'],
  blockWall: [photo('IMG_20211118_162526-640w.webp'), TALL, 'Walk beside a block wall'],
  lakeWalk: [photo('IMG_20211118_162530-640w.webp'), TALL, 'Walk and pad above the lake'],
  patio: [photo('IMG_20211118_162534-640w.webp'), TALL, 'Patio formed and poured behind a house'],
}
const S = (clip, n, alt) => [still(clip, n), CLIP, alt]

// The season in numbers. Pours, addresses and builders: Housecall jobs
// Jan 6 – Oct 31, 2026. Truckloads: DeliveryGo tickets for the same months.
// Yards come from businessInfo.stats.yearYards.
const SEASON = [
  { value: '630+', label: 'pours since January' },
  { value: '1,700+', label: 'truckloads placed' },
  { value: '284', label: 'addresses poured' },
  { value: '30', label: 'builders and contractors' },
]

// The contact sheet under the promise: a pour day from truck to finished
// drive, with the facts printed as cells of their own. Rows are justified, so
// every cell in a row has the same height.
const SHEET = {
  pour: { pic: P.pour, strip: 'Ready-mix at the forms' },
  yards: { fact: businessInfo.stats.yearYards, unit: 'yd³ placed this year', strip: 'For builders', tone: 'rust' },
  chute: { pic: P.placing, strip: 'Down the chute' },
  screed: { pic: S('finishing', 2, 'Screed pulled across a fresh slab'), strip: 'Screed' },
  pours: { fact: '630+', unit: 'pours since January', strip: '284 addresses', tone: 'cream' },
  driveway: { pic: P.driveway, strip: 'Driveway at a new home' },
  float: { pic: S('finishing', 5, 'Crew floating the slab from both sides'), strip: 'Bull float' },
  quote: { fact: '48 h', unit: 'from plan to quote', strip: 'Same day if urgent', tone: 'teal' },
  hand: { pic: P.finishing, strip: 'Hand finish' },
  edge: { pic: S('edging', 6, 'Hand edger run along the form'), strip: 'Edge' },
  crews: { fact: '2 × 7', unit: 'two crews of seven', strip: 'Up to 3 houses a day each', tone: 'charcoal' },
  patio: { pic: P.patio, strip: 'Patio, 2021' },
  done: { pic: S('finishing', 8, 'Finished slab with the crew at the far end'), strip: 'Ready for the next trade' },
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

// What a slipped pour does to the rest of the schedule, one step later each.
const SLIP = ['Framing waits', 'Inspection slips', 'Closing moves', 'Carrying cost runs']

const STEPS = [
  { title: 'We get your PO', text: 'Send the PO or the plan by email or WhatsApp, in English or Spanish.' },
  { title: 'Your date is locked', text: 'We schedule it the same day. The date goes on our calendar and stays there.' },
  { title: 'We walk it with your super', text: 'Forms, grade and access are checked on site with your superintendent before pour day.' },
  { title: 'We pour on the date', text: 'Two crews of seven, up to three houses a day each.' },
  { title: 'We hand it over clean', text: 'Finished, edged and cleaned up, ready for the next trade.' },
  { title: 'We invoice', text: 'Billed against your PO once the work is done.' },
]

const SERVICES = [
  ['Basements and foundations', 'Walls and floors.'],
  ['Garage slabs', 'Poured and finished.'],
  ['Driveways', 'Aprons and full drives.'],
  ['Sidewalks', 'Front walks and public walks.'],
  ['Patios', 'Formed and poured behind the house.'],
  ['Stoops', 'Front and back entries.'],
  ['Streets and flatwork', 'The larger pours, same crews.'],
]

// The work: one run of frames per stage of a pour day, in order.
const RUNS = [
  {
    id: 'placing',
    name: 'Placing',
    note: 'From the truck to the forms',
    year: 2026,
    frames: [P.pour, P.placing, S('finishing', 1, 'Screed set on the forms'), P.pourWide],
  },
  {
    id: 'screed',
    name: 'Screed and float',
    note: 'Flat, then smooth',
    year: 2026,
    frames: [P.screed, S('finishing', 3, 'Two finishers on a fresh slab'), S('finishing', 4, 'Bull float across the slab'), S('finishing', 6, 'Crew finishing the slab from both sides')],
  },
  {
    id: 'edging',
    name: 'Edges and finish',
    note: 'Tooled by hand',
    year: 2026,
    frames: [S('edging', 1, 'Edger set against the form'), S('edging', 2, 'Edger pulled along the slab'), P.edge, S('edging', 4, 'Edger near the end of the run'), S('edging', 8, 'Finished edge beside the form')],
  },
  {
    id: 'finished',
    name: 'Walks, steps and patios',
    note: 'Finished work',
    year: 2021,
    frames: [P.walk, P.steps, P.blockWall, P.lakeWalk],
  },
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
const longDate = (date) => date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
const shortDate = (date) =>
  date
    .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    .replace(',', '')
    .toUpperCase()

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function usePageSetup() {
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
function Cell({ item, index }) {
  if (item.fact) {
    return (
      <figure className={`pd-cell pd-fact pd-fact-${item.tone}`} style={{ '--r': 0.86, '--i': index }}>
        <div className="pd-cell-frame">
          <p className="pd-fact-figure">{item.fact}</p>
          <p className="pd-fact-unit">{item.unit}</p>
        </div>
        <figcaption className="pd-strip">{item.strip}</figcaption>
      </figure>
    )
  }
  const [src, ratio, alt] = item.pic
  return (
    <figure className="pd-cell" style={{ '--r': ratio, '--i': index }}>
      <div className="pd-cell-frame">
        <img src={src} alt={alt} width="640" height={Math.round(640 / ratio)} />
      </div>
      <figcaption className="pd-strip">{item.strip}</figcaption>
    </figure>
  )
}

function Sheet() {
  // Seven frames to a row need a computer screen; narrower, the rows hold two or three.
  const wide = useWide('(min-width: 1101px)')
  const rows = wide ? SHEET_ROWS.wide : SHEET_ROWS.phone
  let index = 0
  return (
    <div className="pd-sheet" aria-label="A pour day, frame by frame">
      <div className="pd-sheet-rows" data-develop>
        {rows.map((row) => (
          <div key={row.join()} className="pd-sheet-row">
            {row.map((key) => (
              <Cell key={key} item={SHEET[key]} index={index++} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function Hero({ company, heroRef, whatsappHref }) {
  const wide = useWide()
  return (
    <section ref={heroRef} className="pd-hero" aria-labelledby="pd-title">
      <div className="pd-hero-top">
        <nav className="pd-nav" aria-label="Presentation">
          <Link to="/" className="pd-wordmark">
            <img src={businessInfo.logo} alt="" width="32" height="32" />
            {businessInfo.name}
          </Link>
          {company && <p className="pd-for">Prepared for {company}</p>}
          <div className="pd-nav-links">
            <a href="#process" className="pd-link pd-wide-only">How it works</a>
            <a href="#work" className="pd-link pd-wide-only">What we pour</a>
            <a href="#builders" className="pd-link pd-wide-only">Builders</a>
            <a href={businessInfo.phoneHref} className="pd-link">{wide ? businessInfo.phone : 'Call'}</a>
          </div>
        </nav>

        {/* The letters are white on black, multiplied over the clip: the
            footage shows through the letters and the black stays black. */}
        <div className="pd-knock">
          <Clip name="finishing" label="New Era crew finishing a slab" eager className="pd-knock-clip" />
          <h1 id="pd-title" className="pd-monument">
            <span className="pd-mask pd-line-top"><span data-line style={{ '--i': 0 }}>Pour date</span></span>
            <span className="pd-mask"><span data-line style={{ '--i': 1 }}>doesn’t move</span></span>
          </h1>
        </div>

        <div className="pd-hero-foot pd-after">
          <p className="pd-hero-lead">
            Basements, garage slabs, driveways and flatwork for home builders in Greater Des Moines. Send the PO and
            your pour date is locked the same day.
          </p>
          <div className="pd-hero-actions">
            <a href="#date" className="pd-action">Book a pour date</a>
            <a href={whatsappHref} className="pd-link pd-underline" target="_blank" rel="noreferrer">
              WhatsApp {sales.firstName}
            </a>
          </div>
        </div>
      </div>

      <Sheet />
    </section>
  )
}

function Cost() {
  return (
    <section className="pd-cost pd-light" aria-labelledby="pd-cost">
      <div className="pd-split">
        <h2 id="pd-cost" className="pd-head" data-rise>One late pour moves the whole house</h2>
        <p className="pd-lead" data-rise style={{ '--d': 1 }}>
          When the concrete sub slips a day, everything behind it slips too. You pay for every one of those days.
        </p>
      </div>
      <ol className="pd-slip" aria-label="What follows a late pour" data-rise>
        {SLIP.map((line, index) => (
          <li key={line} style={{ '--n': index }}>{line}</li>
        ))}
      </ol>
      <p className="pd-cost-turn" data-rise style={{ '--d': 2 }}>
        So we run on the date. It is set the day your PO lands, two crews of seven pour up to three houses a day
        each, and the owner answers the phone.
      </p>
    </section>
  )
}

function Season() {
  return (
    <section className="pd-season pd-dark" aria-labelledby="pd-season">
      <div className="pd-split">
        <h2 id="pd-season" className="pd-head" data-rise>The season so far</h2>
        <p className="pd-note" data-rise style={{ '--d': 1 }}>January to October 2026, from our job and delivery records.</p>
      </div>
      <p className="pd-yards" data-rise style={{ '--d': 1 }}>
        <span className="pd-yards-figure"><CountUp value={businessInfo.stats.yearYards} /></span>
        <span className="pd-yards-label">cubic yards of concrete placed for builders in Greater Des Moines</span>
      </p>
      <dl className="pd-figures">
        {SEASON.map((item, index) => (
          <div key={item.label} data-rise style={{ '--d': index + 2 }}>
            <dt><CountUp value={item.value} /></dt>
            <dd>{item.label}</dd>
          </div>
        ))}
      </dl>
      <figure className="pd-wide">
        <div className="pd-wide-frame">
          <img
            {...sizes('obra-2026-10-pour-wide')}
            sizes="100vw"
            alt="Crew placing a garage slab beside a new house, the mixer truck behind them"
            width="1920"
            height="1440"
            loading="lazy"
          />
        </div>
        <figcaption>Crew placing a garage slab straight from the truck.</figcaption>
      </figure>
    </section>
  )
}

function Process() {
  return (
    <section className="pd-process pd-light" id="process" aria-labelledby="pd-process">
      <div className="pd-process-media">
        <div className="pd-process-frame" data-shutter>
          <Clip name="edging" label="A finisher tooling the edge of a fresh slab" />
        </div>
      </div>
      <div className="pd-process-text">
        <h2 id="pd-process" className="pd-head" data-rise>PO to invoice, nothing to chase</h2>
        <p className="pd-lead" data-rise style={{ '--d': 1 }}>
          Six steps, the same on every job. You always know where your house stands.
        </p>
        <ol className="pd-steps">
          {STEPS.map((step, index) => (
            <li key={step.title} data-rise style={{ '--d': index % 2 }}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Work() {
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
        <h2 id="pd-work" className="pd-head" data-rise>What we pour</h2>
        <p className="pd-lead" data-rise style={{ '--d': 1 }}>
          Everything concrete on a new home, from the basement walls to the front stoop.
        </p>
        <ul className="pd-services">
          {SERVICES.map(([name, text], index) => (
            <li key={name} data-rise style={{ '--d': (index % 3) + 1 }}>
              <h3>{name}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
      <ul ref={list} className="pd-runs" aria-label="A pour day in four runs of frames">
        {RUNS.map((run) => {
          const rows = [run.frames]
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
              <div className="pd-run-frames" tabIndex={0} aria-label={`${run.name}, ${run.year}`}>
                {rows.map((row, r) => (
                  <span key={r} className="pd-run-row">
                    {row.map(([src, ratio, alt]) => (
                      <img key={src} src={src} alt={alt} loading="lazy" width="640" height={Math.round(640 / ratio)} style={{ '--r': ratio }} />
                    ))}
                  </span>
                ))}
              </div>
              <div className="pd-run-line">
                <h3>{run.name}</h3>
                <p>{run.note}, {run.year}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Builders() {
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
        <h2 id="pd-builders" className="pd-head" data-rise>Poured for 30 builders this year</h2>
        <p className="pd-lead" data-rise style={{ '--d': 1 }}>
          Production builders and general contractors across Greater Des Moines, including:
        </p>
      </div>
      <div className="pd-band">
        <div className="pd-track">
          {run(false)}
          {run(true)}
        </div>
      </div>
    </section>
  )
}

function Promise() {
  const items = [
    ['One-year warranty', 'Our work is covered for a full year after the pour.'],
    ['Quote in 48 hours', 'Same day when it is urgent. Send the plan or the address.'],
    ['Se habla español', 'Bilingual crews. Your superintendent and our foreman talk directly, in English or Spanish.'],
    ['The owner picks up', `New Era is owner-run. Call ${businessInfo.phone} and ${businessInfo.owner} answers.`],
  ]
  return (
    <section className="pd-promise pd-light" aria-labelledby="pd-promise">
      <figure className="pd-promise-photo">
        <div className="pd-promise-frame" data-shutter>
          <img
            {...sizes('obra-2026-10-crew-screed')}
            sizes="(min-width: 821px) 42vw, 100vw"
            alt="A New Era crew screeding a fresh slab"
            width="1920"
            height="1440"
            loading="lazy"
          />
        </div>
      </figure>
      <div className="pd-promise-text">
        <h2 id="pd-promise" className="pd-head" data-rise>The risk stays with us</h2>
        <dl className="pd-promises">
          {items.map(([title, text], index) => (
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
function PourDate({ company }) {
  const today = useMemo(() => atMidnight(new Date()), [])
  const earliest = new Date(today.getTime() + 2 * DAY)
  const [value, setValue] = useState(() => toInput(new Date(today.getTime() + 7 * DAY)))
  const [houses, setHouses] = useState(6)
  const chosen = fromInput(value) || earliest
  const change = (step) => setHouses((current) => Math.min(MAX_HOUSES, Math.max(1, current + step)))
  const houseWord = houses === 1 ? 'house' : 'houses'
  const perDay = PER_CREW * CREWS
  const days = Math.ceil(houses / perDay)
  const dayWord = days === 1 ? 'pour day' : 'pour days'
  const rows = Array.from({ length: days }, (_, d) =>
    Array.from({ length: Math.min(perDay, houses - d * perDay) }, (_, h) => d * perDay + h)
  )

  const href = whatsappLink(
    `Hi ${sales.firstName}, I saw New Era's presentation${company ? ` (${company})` : ''} and I'd like to book a pour for ${houses} ${houseWord} starting ${longDate(chosen)}. Address: `
  )

  return (
    <section className="pd-date pd-pit" id="date" aria-labelledby="pd-date">
      <div className="pd-split">
        <h2 id="pd-date" className="pd-head">Book your pour date</h2>
        <p className="pd-lead">
          Pick the first day and the houses in the phase. It goes straight to {sales.firstName} on WhatsApp, in
          English or Spanish.
        </p>
      </div>

      {/* The chosen date is set like the promise: footage inside the letters. */}
      <div className="pd-knock pd-knock-date">
        <Clip name="edging" label="A finisher tooling the edge of a fresh slab" className="pd-knock-clip" />
        <p className="pd-date-big" aria-live="polite">
          <span key={value}>{shortDate(chosen)}</span>
        </p>
      </div>

      <div className="pd-date-controls">
        <label className="pd-field">
          <span>First pour</span>
          <input
            type="date"
            value={value}
            min={toInput(earliest)}
            onChange={(event) => setValue(event.target.value)}
          />
        </label>
        <div className="pd-field">
          <span id="pd-houses-label">Houses</span>
          <div className="pd-stepper" role="group" aria-labelledby="pd-houses-label">
            <button type="button" onClick={() => change(-1)} aria-label="One house fewer" disabled={houses <= 1}>−</button>
            <output aria-live="polite">{houses} {houseWord}</output>
            <button type="button" onClick={() => change(1)} aria-label="One house more" disabled={houses >= MAX_HOUSES}>+</button>
          </div>
        </div>
      </div>

      <div className="pd-plan">
        <p className="pd-plan-answer">
          {houses} {houseWord} {houses === 1 ? 'is' : 'are'} {days} {dayWord} with both crews, starting{' '}
          {longDate(chosen)}.
        </p>
        <ol className="pd-days" aria-label="Pour days">
          {rows.map((row, d) => (
            <li key={d}>
              <span className="pd-day-name">Day {d + 1}</span>
              <span className="pd-day-crews">
                {[row.slice(0, PER_CREW), row.slice(PER_CREW)].map((crew, c) =>
                  crew.length ? (
                    <span key={c} className="pd-crew">
                      {crew.map((n) => {
                        const [src] = HOUSE_FRAMES[n % HOUSE_FRAMES.length]
                        return (
                          <span key={n} className="pd-house">
                            <img src={src} alt="" loading="lazy" width="640" height="480" />
                            <span>House {n + 1}</span>
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
        <p className="pd-plan-note">Up to three houses a day for each crew. We confirm every date when your PO lands.</p>
      </div>

      <div className="pd-date-actions">
        <a href={href} className="pd-action" target="_blank" rel="noreferrer">
          Send {houses} {houseWord} to {sales.firstName}
        </a>
        <a href={businessInfo.phoneHref} className="pd-link pd-underline">Or call {businessInfo.phone}</a>
        <a href="#quote" className="pd-link pd-underline">Send the plan for a quote</a>
      </div>
    </section>
  )
}

function Quote({ company }) {
  const { address } = businessInfo
  return (
    <section className="pd-quote pd-light" id="quote" aria-labelledby="pd-quote">
      <div className="pd-quote-text">
        <h2 id="pd-quote" className="pd-head" data-rise>Send us your next plan</h2>
        <p className="pd-lead" data-rise style={{ '--d': 1 }}>
          {company ? `The next job for ${company}, ` : 'Your next job, '}
          quoted in 48 hours. Same day when it is urgent.
        </p>
        <div className="pd-owner" data-rise style={{ '--d': 2 }}>
          <p>
            {businessInfo.owner}, owner
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
            alt="Concrete running down the chute into the forms"
            width="1440"
            height="1920"
            loading="lazy"
          />
        </div>
      </div>
      <div className="pd-form" data-rise style={{ '--d': 1 }}>
        <ContactForm />
      </div>
    </section>
  )
}

function ActionBar({ visible, whatsappHref }) {
  const tab = visible ? 0 : -1
  return (
    <div className={`pd-bar ${visible ? 'pd-on' : ''}`} aria-hidden={!visible}>
      <p>Ready to book a pour?</p>
      <a href={businessInfo.phoneHref} className="pd-action pd-action-quiet" tabIndex={tab}>Call</a>
      <a href={whatsappHref} className="pd-action pd-action-quiet" target="_blank" rel="noreferrer" tabIndex={tab}>WhatsApp</a>
      <a href="#date" className="pd-action" tabIndex={tab}>Book a date</a>
    </div>
  )
}

function Presentation() {
  const [params] = useSearchParams()
  const company = (params.get('for') || '').trim().slice(0, 60)
  const root = useRef(null)
  const hero = useRef(null)
  const contact = useRef(null)
  const [pastHero, setPastHero] = useState(false)
  const [atContact, setAtContact] = useState(false)
  const wide = useWide('(min-width: 1101px)')
  usePageSetup()
  useRise(root, [wide])

  useEffect(() => {
    document.title = company ? `New Era Construction · for ${company}` : 'New Era Construction · Concrete for builders'
  }, [company])

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

  const whatsappHref = whatsappLink(
    `Hi ${sales.firstName}, I saw New Era's presentation${company ? ` (${company})` : ''} and I'd like a quote.`
  )

  return (
    <div ref={root} className="pd">
      <Hero company={company} heroRef={hero} whatsappHref={whatsappHref} />
      <Cost />
      <Season />
      <Process />
      <Work />
      <Builders />
      <Promise />
      <div ref={contact}>
        <PourDate company={company} />
        <Quote company={company} />
      </div>

      <footer className="pd-footer">
        <div className="pd-footer-row">
          <p className="pd-footer-line">
            Serving {businessInfo.serviceArea.join(', ')}. Family-owned since {businessInfo.founded}. Se habla español.{' '}
            <Link to="/" className="pd-link pd-underline">neconstructioniowa.com</Link>
          </p>
          <a href="#date" className="pd-action">Book a pour date</a>
        </div>
        <p className="pd-footer-name" aria-hidden="true">New Era</p>
      </footer>

      <ActionBar visible={pastHero && !atContact} whatsappHref={whatsappHref} />
    </div>
  )
}

export default Presentation

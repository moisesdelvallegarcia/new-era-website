import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ContactForm from '../components/ContactForm.jsx'
import { businessInfo } from '../data/businessInfo.js'
import { findTeamMember } from '../data/team.js'
import './presentation.css'

// Company presentation sent as a link to builders and general contractors
// (/presentation, optionally ?for=<Company>). v5, option E, "The proof sheet":
// a light, editorial page that joins two earlier directions. From the monument
// (v3/v4): POUR DATE / DOESN'T MOVE set as wide as the screen with the job video
// poured between the words, the numbers and the chosen date as display type,
// the builders band and the name returning at full width. From the contact
// sheet (v3-c): the first screen is a sheet of frames, clips and facts that the
// promise runs through, the six steps are a pour day frame by frame, and what
// we pour is printed in grey runs that develop into colour as they are read.
// The argument is v4's: the cost of a late pour, the season in numbers, PO to
// invoice, what we pour, who we pour for, the risk we carry, then the close.
// English only, no site menu or footer. Only New Era's own job photos, clips
// and stills from those clips: the A0x/A1x/A4/A8/A9 photos and
// new-era-construction.mp4 from the old site are stock.

// WhatsApp goes to the sales rep: the office line may not have WhatsApp.
const sales = findTeamMember('bernardo')
const waNumber = sales.phoneE164.replace('+', '')

const photo = (name) => `/media/photos/${name}`
const still = (clip, n) => `/media/frames/obra-2026-10-${clip}-frame-${n}.webp`
// Photos exported at 640w and 1920w get both sizes.
const sizes = (base) => ({
  src: photo(`${base}-1920w.webp`),
  srcSet: `${photo(`${base}-640w.webp`)} 640w, ${photo(`${base}-1920w.webp`)} 1920w`,
})

// Every frame on the page: [src, width / height, alt].
const WIDE = 4 / 3
const TALL = 3 / 4
const CLIP = 480 / 861
const F = {
  pour: [photo('obra-2026-10-pour-640w.webp'), WIDE, 'Ready-mix truck pouring at a new home'],
  pourWide: [photo('obra-2026-10-pour-wide-640w.webp'), WIDE, 'Crew placing a garage slab beside the truck'],
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
  broom: [photo('IMG_20211118_162600-400h.webp'), TALL, 'Broom-finished slab'],
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

// What a slipped pour does to the rest of the schedule, one step later each.
const SLIP = ['Framing waits', 'Inspection slips', 'Closing moves', 'Carrying cost runs']

// PO to invoice as a strip of six frames, one per step, in the order they happen.
const STEPS = [
  {
    title: 'We get your PO',
    text: 'Send the PO or the plan by email or WhatsApp, in English or Spanish.',
    frame: F.driveway,
  },
  {
    title: 'Your date is locked',
    text: 'We schedule it the same day. The date goes on our calendar and stays there.',
    frame: F.pour,
  },
  {
    title: 'We walk it with your super',
    text: 'Forms, grade and access are checked on site with your superintendent before pour day.',
    frame: S('finishing', 1, 'Screed set across the forms before the pour'),
  },
  {
    title: 'We pour on the date',
    text: 'Two crews of seven, up to three houses a day each.',
    clip: 'finishing',
  },
  {
    title: 'We hand it over clean',
    text: 'Finished, edged and cleaned up, ready for the next trade.',
    frame: S('edging', 8, 'Finished edge beside the form'),
  },
  {
    title: 'We invoice',
    text: 'Billed against your PO once the work is done.',
    frame: F.broom,
  },
]

// What we pour: the list, and runs of frames printed in grey that develop
// into colour as they are read. A service with its own pictures names its run.
const SERVICES = [
  ['Basements and foundations', 'Walls and floors.', null],
  ['Garage slabs', 'Garage floors, poured and finished.', 'slabs'],
  ['Driveways', 'Aprons and full drives.', 'slabs'],
  ['Sidewalks', 'Front walks and public walks.', 'walks'],
  ['Patios', 'Formed and poured behind the house.', 'walks'],
  ['Stoops', 'Front and back entries.', 'walks'],
  ['Streets and flatwork', 'The larger pours, with the same crews.', null],
]
const RUNS = [
  {
    id: 'slabs',
    name: 'Garage slabs and driveways',
    year: 2026,
    frames: [F.driveway, F.pourWide, F.finishing, S('finishing', 6, 'Crew finishing a slab from both sides'), F.screed],
  },
  {
    id: 'hand',
    name: 'Edged and finished by hand',
    year: 2026,
    frames: [
      S('edging', 1, 'Edger set against the form'),
      S('edging', 2, 'Edger pulled along the slab'),
      F.edge,
      S('edging', 4, 'Edger near the end of the run'),
      S('edging', 6, 'Hand edger working the corner'),
      S('finishing', 4, 'Bull float across the slab'),
    ],
  },
  {
    id: 'walks',
    name: 'Walks, steps and patios',
    year: 2021,
    frames: [F.walk, F.steps, F.blockWall, F.lakeWalk, F.patio],
  },
]

// Small pictures for the planner: one per house.
const HOUSE_FRAMES = [F.driveway, F.pourWide, F.finishing, F.screed, F.pour, F.patio]
const PER_CREW = 3
const CREWS = 2

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

const whatsappLink = (text) => `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`

function usePageSetup() {
  useEffect(() => {
    const links = [
      ['preconnect', 'https://fonts.googleapis.com'],
      ['preconnect', 'https://fonts.gstatic.com'],
      [
        'stylesheet',
        'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Newsreader:opsz,wght@6..72,400;6..72,500&display=swap',
      ],
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
    document.body.style.background = '#e6e1d5'
    return () => {
      document.body.style.background = ground
      links.forEach((link) => link.remove())
      robots.remove()
      document.documentElement.classList.remove('js')
    }
  }, [])
}

function useWide() {
  const query = '(min-width: 701px)'
  const [wide, setWide] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const list = window.matchMedia(query)
    const change = () => setWide(list.matches)
    list.addEventListener('change', change)
    return () => list.removeEventListener('change', change)
  }, [])
  return wide
}

// Parts marked data-rise rise once as they enter the screen; frames marked
// data-shutter open from the bottom edge (watched through their parent, since
// while clipped shut they have no visible area). A jump down the page, like
// the quote link, also reveals everything it passed over.
function useRise(root) {
  useEffect(() => {
    const targets = new Map()
    const add = (watched, el) => targets.set(watched, [...(targets.get(watched) || []), el])
    root.current.querySelectorAll('[data-shutter]').forEach((el) => add(el.parentElement, el))
    root.current.querySelectorAll('[data-rise]').forEach((el) => add(el, el))
    const reveal = (watched) => {
      targets.get(watched)?.forEach((el) => el.classList.add('ne-in'))
      observer.unobserve(watched)
      targets.delete(watched)
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) reveal(entry.target)
        for (const watched of [...targets.keys()]) if (watched.getBoundingClientRect().bottom < 0) reveal(watched)
      },
      { threshold: 0.15 }
    )
    targets.forEach((_, watched) => observer.observe(watched))
    return () => observer.disconnect()
  }, [root])
}

// A muted loop that only plays while it is on screen, and never under
// reduced motion (the poster stays). Below the fold it loads nothing until
// it comes near.
function Clip({ name, label, eager = false }) {
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
    <span className="ne-count">
      <span className="ne-count-room" aria-hidden="true">{value}</span>
      <span ref={ref} className="ne-count-live" aria-hidden="true">{shown}</span>
      <span className="ne-sr">{value}</span>
    </span>
  )
}

// One frame of the sheet: a picture or a clip with its strip, the way a
// contact sheet prints the frame number along the edge.
function Frame({ item, strip, index = 0, eager = false, className = '' }) {
  return (
    <figure className={`ne-frame ${className}`} style={{ '--i': index }}>
      <span className="ne-frame-pic">
        {item.clip ? (
          <Clip name={item.clip} label={item.label} eager={eager} />
        ) : (
          <img src={item[0]} alt={item[2]} loading={eager ? 'eager' : 'lazy'} decoding="async" />
        )}
      </span>
      <figcaption className="ne-strip">{strip}</figcaption>
    </figure>
  )
}

// A fact set as a frame of the sheet.
function Fact({ figure, unit, tone, index = 0, className = '' }) {
  return (
    <div className={`ne-fact ne-tone-${tone} ${className}`} style={{ '--i': index }}>
      <p className="ne-fact-figure">{figure}</p>
      <p className="ne-fact-unit">{unit}</p>
    </div>
  )
}

function Film({ className }) {
  return (
    <span className={className} data-shutter>
      <Clip name="finishing" label="New Era crew finishing a slab" eager />
    </span>
  )
}

const HERO_ROW = [
  [F.pour, 'Truck'],
  [F.placing, 'Chute'],
  [{ clip: 'edging', label: 'New Era finisher tooling the edge of a slab' }, 'Edge'],
  [S('finishing', 2, 'Screed pulled across a fresh slab'), 'Screed'],
  [F.finishing, 'Hand finish'],
  [S('finishing', 7, 'Crew floating the far end of a slab'), 'Float'],
]

function Hero({ company, heroRef, whatsappHref }) {
  const wide = useWide()
  return (
    <section ref={heroRef} className="ne-hero" aria-labelledby="ne-title">
      <nav className="ne-nav" aria-label="Presentation">
        <Link to="/" className="ne-wordmark">
          <img src={businessInfo.logo} alt="" width="32" height="32" />
          {businessInfo.name}
        </Link>
        {company && <p className="ne-for">Prepared for {company}</p>}
        <div className="ne-nav-links">
          <a href="#process" className="ne-link ne-wide-only">How it works</a>
          <a href="#work" className="ne-link ne-wide-only">What we pour</a>
          <a href="#builders" className="ne-link ne-wide-only">Builders</a>
          <a href={businessInfo.phoneHref} className="ne-link">{wide ? businessInfo.phone : 'Call'}</a>
        </div>
      </nav>

      <div className="ne-sheet-row">
        {HERO_ROW.map(([item, strip], index) => (
          <Frame key={strip} item={item} strip={strip} index={index} eager />
        ))}
      </div>

      <h1 id="ne-title" className="ne-monument">
        <span className="ne-row ne-row-top">
          <span className="ne-mask"><span data-line style={{ '--i': 0 }}>Pour</span></span>
          {wide && <Film className="ne-slab" />}
          <span className="ne-mask"><span data-line style={{ '--i': 1 }}>date</span></span>
        </span>
        <span className="ne-row ne-row-bottom">
          <span className="ne-mask"><span data-line style={{ '--i': 2 }}>doesn’t move</span></span>
        </span>
      </h1>

      {wide && (
        <div className="ne-beside">
          <Frame item={F.driveway} strip="Driveway" index={7} eager />
          <Frame item={F.patio} strip="Patio" index={8} eager />
        </div>
      )}

      {!wide && <Film className="ne-slab-phone" />}

      <div className="ne-hero-foot">
        <div className="ne-cell ne-after">
          <p className="ne-hero-lead">
            Basements, garage slabs, driveways and flatwork for home builders in Greater Des Moines. Send the PO
            and your pour date is locked the same day.
          </p>
          <div className="ne-cell-side">
            <p className="ne-hero-proof">630+ pours this year for 30 builders. Se habla español.</p>
            <div className="ne-hero-actions">
              <a href="#date" className="ne-action">Book a pour date</a>
              <a href={whatsappHref} className="ne-link ne-underline" target="_blank" rel="noreferrer">
                WhatsApp {sales.firstName}
              </a>
            </div>
          </div>
        </div>
        <Fact figure="48 h" unit="from your plans to our quote" tone="coral" index={9} className="ne-foot-a" />
        <Fact figure="2 × 7" unit="two pour crews of seven" tone="sage" index={10} className="ne-foot-b" />
      </div>
    </section>
  )
}

function Cost() {
  return (
    <section className="ne-cost" aria-labelledby="ne-cost">
      <div className="ne-cost-text">
        <h2 id="ne-cost" className="ne-head" data-rise>One late pour moves the whole house</h2>
        <p className="ne-lead" data-rise style={{ '--d': 1 }}>
          When the concrete sub slips a day, everything behind it slips too. You pay for every one of those days.
        </p>
      </div>
      <ol className="ne-slip" aria-label="What follows a late pour" data-rise>
        {SLIP.map((line, index) => (
          <li key={line} style={{ '--n': index }}>{line}</li>
        ))}
      </ol>
      <p className="ne-cost-turn" data-rise style={{ '--d': 2 }}>
        So we run on the date. It is set the day your PO lands, two crews of seven pour up to three houses a day
        each, and the owner answers the phone.
      </p>
    </section>
  )
}

// The figures sit in the sheet as frames of their own, between two pictures.
function Season() {
  const [pours, loads, addresses, builders] = SEASON
  const tile = (item, tone, index) => (
    <div className={`ne-fact ne-fact-season ne-tone-${tone}`} data-rise style={{ '--d': index }}>
      <p className="ne-fact-figure"><CountUp value={item.value} /></p>
      <p className="ne-fact-unit">{item.label}</p>
    </div>
  )
  return (
    <section className="ne-season" aria-labelledby="ne-season">
      <div className="ne-season-top">
        <h2 id="ne-season" className="ne-head" data-rise>The season so far</h2>
        <p data-rise style={{ '--d': 1 }}>January to October 2026, from our job and delivery records.</p>
      </div>
      <p className="ne-yards" data-rise style={{ '--d': 1 }}>
        <span className="ne-yards-figure"><CountUp value={businessInfo.stats.yearYards} /></span>
        <span className="ne-yards-label">cubic yards of concrete placed for builders in Greater Des Moines</span>
      </p>
      <div className="ne-season-sheet">
        {tile(pours, 'paper', 1)}
        <figure className="ne-frame ne-season-pic" data-rise style={{ '--d': 2 }}>
          <span className="ne-frame-pic">
            <img src={F.pourWide[0]} alt={F.pourWide[2]} loading="lazy" decoding="async" />
          </span>
          <figcaption className="ne-strip">Placing, 2026</figcaption>
        </figure>
        {tile(loads, 'walnut', 3)}
        {tile(addresses, 'paper', 4)}
        <figure className="ne-frame ne-season-pic" data-rise style={{ '--d': 5 }}>
          <span className="ne-frame-pic">
            <img src={F.edge[0]} alt={F.edge[2]} loading="lazy" decoding="async" />
          </span>
          <figcaption className="ne-strip">Edge, 2026</figcaption>
        </figure>
        {tile(builders, 'sage', 6)}
      </div>
    </section>
  )
}

function Wide() {
  return (
    <figure className="ne-wide">
      <div className="ne-wide-frame">
        <img
          {...sizes('obra-2026-10-pour-wide')}
          sizes="100vw"
          alt="Crew placing a garage slab beside a new house, the mixer truck behind them"
          width="1920"
          height="1440"
          loading="lazy"
          decoding="async"
        />
      </div>
      <figcaption>Crew placing a garage slab straight from the truck.</figcaption>
    </figure>
  )
}

// PO to invoice, as the job's own contact sheet: one frame per step.
function Process() {
  return (
    <section className="ne-process" id="process" aria-labelledby="ne-process">
      <div className="ne-process-top">
        <h2 id="ne-process" className="ne-head" data-rise>PO to invoice, nothing to chase</h2>
        <p className="ne-lead" data-rise style={{ '--d': 1 }}>
          Six steps, the same on every job. You always know where your house stands.
        </p>
      </div>
      <ol className="ne-steps">
        {STEPS.map((step, index) => (
          <li key={step.title} className="ne-step" style={{ '--d': index }}>
            <span className="ne-step-pic" data-shutter>
              {step.clip ? (
                <Clip name={step.clip} label="New Era crew finishing a slab on pour day" />
              ) : (
                <img src={step.frame[0]} alt={step.frame[2]} loading="lazy" decoding="async" />
              )}
            </span>
            <h3 className="ne-strip ne-step-strip">{step.title}</h3>
            <p data-rise style={{ '--d': index % 3 }}>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Work() {
  const [hovered, setHovered] = useState(null)
  const [inView, setInView] = useState(null)
  const list = useRef(null)

  // The run in the middle of the screen develops into colour; the rest stay
  // printed in grey, like a contact sheet.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setInView(entry.target.dataset.run)
      },
      { rootMargin: '-40% 0px -40% 0px' }
    )
    list.current.querySelectorAll('[data-run]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const lit = hovered || inView

  return (
    <section className="ne-work" id="work" aria-labelledby="ne-work">
      <div className="ne-work-rail">
        <h2 id="ne-work" className="ne-head" data-rise>What we pour</h2>
        <p className="ne-lead" data-rise style={{ '--d': 1 }}>
          Everything concrete on a new home, from the basement walls to the front stoop.
        </p>
        <ul className="ne-services">
          {SERVICES.map(([name, text, run], index) => (
            <li
              key={name}
              data-rise
              style={{ '--d': index % 3 }}
              data-on={run && lit === run ? 'true' : undefined}
              onMouseEnter={() => run && setHovered(run)}
              onMouseLeave={() => setHovered(null)}
            >
              <h3>{name}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
      <ul ref={list} className={`ne-runs ${hovered ? 'ne-runs-hover' : ''}`}>
        {RUNS.map((run) => (
          <li
            key={run.id}
            data-run={run.id}
            className={`ne-run ${lit === run.id ? 'ne-lit' : ''}`}
            onMouseEnter={() => setHovered(run.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              className="ne-run-frames"
              tabIndex={0}
              aria-label={`${run.name}, ${run.year}`}
              onFocus={() => setHovered(run.id)}
              onBlur={() => setHovered(null)}
            >
              {run.frames.map(([src, ratio, alt]) => (
                <img key={src} src={src} alt={alt} loading="lazy" decoding="async" style={{ '--r': ratio }} />
              ))}
            </div>
            <p className="ne-run-line">
              <span className="ne-run-name">{run.name}</span>
              <span>{run.year}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Builders() {
  if (!businessInfo.showBuilderNames) return null
  const names = businessInfo.builders
  const run = (hidden) => (
    <span className="ne-names" aria-hidden={hidden || undefined}>
      {names.map((name) => (
        <span key={name}>
          {name}
          <span className="ne-dot" />
        </span>
      ))}
    </span>
  )
  return (
    <section className="ne-builders" id="builders" aria-labelledby="ne-builders">
      <div className="ne-builders-text">
        <h2 id="ne-builders" className="ne-head" data-rise>Poured for 30 builders this year</h2>
        <p className="ne-lead" data-rise style={{ '--d': 1 }}>
          Production builders and general contractors across Greater Des Moines, including:
        </p>
      </div>
      <div className="ne-band">
        <div className="ne-track">
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
    <section className="ne-promise" aria-labelledby="ne-promise">
      <div className="ne-promise-pics">
        <figure className="ne-frame ne-promise-main" data-rise>
          <span className="ne-frame-pic" data-shutter>
            <img
              {...sizes('obra-2026-10-crew-screed')}
              sizes="(min-width: 821px) 34vw, 100vw"
              alt="A New Era crew screeding a fresh slab"
              width="1920"
              height="1440"
              loading="lazy"
              decoding="async"
            />
          </span>
          <figcaption className="ne-strip">Screed, 2026</figcaption>
        </figure>
        <figure className="ne-frame ne-promise-side" data-rise style={{ '--d': 1 }}>
          <span className="ne-frame-pic" data-shutter>
            <img src={F.steps[0]} alt={F.steps[2]} loading="lazy" decoding="async" />
          </span>
          <figcaption className="ne-strip">Steps, 2021</figcaption>
        </figure>
      </div>
      <div className="ne-promise-text">
        <h2 id="ne-promise" className="ne-head" data-rise>The risk stays with us</h2>
        <dl className="ne-promises">
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

// The live thing: pick the day and the houses, read the date as display type
// and the pour days it takes with both crews, then send it to Bernardo.
function PourDate({ company }) {
  const today = useMemo(() => atMidnight(new Date()), [])
  const earliest = new Date(today.getTime() + 2 * DAY)
  const [value, setValue] = useState(() => toInput(new Date(today.getTime() + 7 * DAY)))
  const [houses, setHouses] = useState(6)
  const chosen = fromInput(value) || earliest
  const change = (step) => setHouses((current) => Math.min(30, Math.max(1, current + step)))
  const houseWord = houses === 1 ? 'house' : 'houses'
  const perDay = PER_CREW * CREWS
  const days = Math.ceil(houses / perDay)
  const rows = Array.from({ length: days }, (_, d) =>
    Array.from({ length: Math.min(perDay, houses - d * perDay) }, (_, h) => d * perDay + h)
  )

  const href = whatsappLink(
    `Hi ${sales.firstName}, I saw New Era's presentation${company ? ` (${company})` : ''} and I'd like to book a pour for ${houses} ${houseWord} on ${longDate(chosen)}. Address: `
  )

  return (
    <section className="ne-date" id="date" aria-labelledby="ne-date">
      <div className="ne-date-top">
        <div className="ne-date-intro">
          <h2 id="ne-date" className="ne-head">Book your pour date</h2>
          <p>Pick the day and the number of houses. It goes straight to {sales.firstName} on WhatsApp, in English or Spanish.</p>
        </div>
        <div className="ne-date-controls">
          <input
            type="date"
            aria-label="Pour date"
            value={value}
            min={toInput(earliest)}
            onChange={(event) => setValue(event.target.value)}
          />
          <div className="ne-stepper" role="group" aria-label="Number of houses">
            <button type="button" onClick={() => change(-1)} aria-label="One house fewer" disabled={houses <= 1}>−</button>
            <output aria-live="polite">{houses} {houseWord}</output>
            <button type="button" onClick={() => change(1)} aria-label="One house more" disabled={houses >= 30}>+</button>
          </div>
        </div>
      </div>
      <p className="ne-date-big" aria-live="polite">
        <span key={value}>{shortDate(chosen)}</span>
      </p>
      <div className="ne-plan">
        <p className="ne-plan-answer">
          {houses} {houseWord} {houses === 1 ? 'is' : 'are'} {days} {days === 1 ? 'pour day' : 'pour days'} with both
          crews, starting {longDate(chosen)}. Three houses a day for each crew at full pace; we confirm every date when
          your PO lands.
        </p>
        <ol className="ne-days" aria-label="Pour days">
          {rows.map((row, d) => (
            <li key={d}>
              <span className="ne-day-name">Day {d + 1}</span>
              <span className="ne-day-houses">
                {row.map((n) => {
                  const [src] = HOUSE_FRAMES[n % HOUSE_FRAMES.length]
                  return (
                    <span key={n} className={`ne-house ${n % perDay >= PER_CREW ? 'ne-house-b' : ''}`}>
                      <img src={src} alt="" loading="lazy" decoding="async" />
                    </span>
                  )
                })}
              </span>
              <span className="ne-sr">{row.length} {row.length === 1 ? 'house' : 'houses'}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="ne-date-actions">
        <a href={href} className="ne-action" target="_blank" rel="noreferrer">
          Send {houses} {houseWord} to {sales.firstName}
        </a>
        <a href={businessInfo.phoneHref} className="ne-link ne-underline">Or call {businessInfo.phone}</a>
      </div>
    </section>
  )
}

function Quote({ company }) {
  const { address } = businessInfo
  return (
    <section className="ne-quote" id="quote" aria-labelledby="ne-quote">
      <div className="ne-quote-text">
        <h2 id="ne-quote" className="ne-head" data-rise>Send us your next plan</h2>
        <p className="ne-lead" data-rise style={{ '--d': 1 }}>
          {company ? `The next job for ${company}, ` : 'Your next job, '}
          quoted in 48 hours. Same day when it is urgent.
        </p>
        <div className="ne-owner" data-rise style={{ '--d': 2 }}>
          <p>
            {businessInfo.owner}, owner
            <br />
            {address.street}, {address.city}, {address.state} {address.zip}
          </p>
          <p>
            <a href={businessInfo.phoneHref} className="ne-link ne-underline">{businessInfo.phone}</a>
            <br />
            <a href={businessInfo.emailHref} className="ne-link ne-underline">{businessInfo.email}</a>
          </p>
        </div>
        <figure className="ne-frame ne-quote-photo" data-rise style={{ '--d': 3 }}>
          <span className="ne-frame-pic">
            <img
              {...sizes('obra-2026-10-placing')}
              sizes="40vw"
              alt="Concrete running down the chute into the forms"
              width="1440"
              height="1920"
              loading="lazy"
              decoding="async"
            />
          </span>
          <figcaption className="ne-strip">Chute, 2026</figcaption>
        </figure>
      </div>
      <div className="ne-form" data-rise style={{ '--d': 1 }}>
        <ContactForm />
      </div>
    </section>
  )
}

function ActionBar({ visible, whatsappHref }) {
  const tab = visible ? 0 : -1
  return (
    <div className={`ne-bar ${visible ? 'ne-on' : ''}`} aria-hidden={!visible}>
      <p>Ready to book a pour?</p>
      <a href={businessInfo.phoneHref} className="ne-action ne-action-quiet" tabIndex={tab}>Call</a>
      <a href={whatsappHref} className="ne-action ne-action-quiet" target="_blank" rel="noreferrer" tabIndex={tab}>WhatsApp</a>
      <a href="#date" className="ne-action" tabIndex={tab}>Book a date</a>
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
  usePageSetup()
  useRise(root)

  useEffect(() => {
    document.title = company ? `New Era Construction · for ${company}` : 'New Era Construction · Concrete for builders'
  }, [company])

  // The action bar shows once the first screen has gone by, and steps aside
  // again at the date picker and the form, which carry their own actions.
  useEffect(() => {
    const heroWatch = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), { threshold: 0.15 })
    const contactWatch = new IntersectionObserver(([entry]) => setAtContact(entry.isIntersecting))
    heroWatch.observe(hero.current)
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
    <div ref={root} className="ne">
      <Hero company={company} heroRef={hero} whatsappHref={whatsappHref} />
      <Cost />
      <Season />
      <Wide />
      <Process />
      <Work />
      <Builders />
      <Promise />
      <div ref={contact}>
        <PourDate company={company} />
        <Quote company={company} />
      </div>

      <footer className="ne-footer">
        <p className="ne-footer-line">
          Serving {businessInfo.serviceArea.join(', ')}. Family-owned since {businessInfo.founded}. Se habla español.{' '}
          <Link to="/" className="ne-link ne-underline">neconstructioniowa.com</Link>
        </p>
        <p className="ne-footer-name" aria-hidden="true">New Era</p>
      </footer>

      <ActionBar visible={pastHero && !atContact} whatsappHref={whatsappHref} />
    </div>
  )
}

export default Presentation

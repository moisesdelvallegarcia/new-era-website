import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ContactForm from '../components/ContactForm.jsx'
import { businessInfo } from '../data/businessInfo.js'
import { findTeamMember } from '../data/team.js'
import './presentation.css'

// Company presentation sent as a link to builders and general contractors
// (/presentation, optionally ?for=<Company>). v4, "The monument": the promise
// POUR DATE / DOESN'T MOVE set as wide as the screen with the job video poured
// between the words. The page then argues it in order: what a late pour costs
// a builder, the season in numbers, PO to invoice, what we pour, who we pour
// for, the risk we carry, and the close: pick your pour date (it goes to
// Bernardo on WhatsApp) or send the plan for a quote. English only, no site
// menu or footer. Only New Era's own job photos and clips: the A0x/A1x/A4/A8/A9
// photos and new-era-construction.mp4 from the old site are stock.

// WhatsApp goes to the sales rep: the office line may not have WhatsApp.
const sales = findTeamMember('bernardo')
const waNumber = sales.phoneE164.replace('+', '')

const photo = (name) => `/media/photos/${name}`
// Photos exported at 640w and 1920w get both sizes.
const sizes = (base) => ({
  src: photo(`${base}-1920w.webp`),
  srcSet: `${photo(`${base}-640w.webp`)} 640w, ${photo(`${base}-1920w.webp`)} 1920w`,
})

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
  ['Garage slabs', 'Garage floors, poured and finished.'],
  ['Driveways', 'Aprons and full drives.'],
  ['Sidewalks', 'Front walks and public walks.'],
  ['Patios', 'Formed and poured behind the house.'],
  ['Stoops', 'Front and back entries.'],
  ['Streets and flatwork', 'The larger pours, with the same crews.'],
]

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
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=EB+Garamond:wght@400;500&display=swap'
    document.head.appendChild(link)
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.appendChild(robots)
    document.documentElement.classList.add('js')
    const ground = document.body.style.background
    document.body.style.background = '#ddd6c6'
    return () => {
      document.body.style.background = ground
      link.remove()
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
      targets.get(watched)?.forEach((el) => el.classList.add('pv-in'))
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
    <span className="pv-count">
      <span className="pv-count-room" aria-hidden="true">{value}</span>
      <span ref={ref} className="pv-count-live" aria-hidden="true">{shown}</span>
      <span className="pv-sr">{value}</span>
    </span>
  )
}

function Film({ className }) {
  return (
    <span className={className} data-shutter>
      <Clip name="finishing" label="New Era crew finishing a slab" eager />
    </span>
  )
}

function Hero({ company, heroRef, whatsappHref }) {
  const wide = useWide()
  return (
    <section ref={heroRef} className="pv-hero" aria-labelledby="pv-title">
      <nav className="pv-nav" aria-label="Presentation">
        <Link to="/" className="pv-wordmark">
          <img src={businessInfo.logo} alt="" width="32" height="32" />
          {businessInfo.name}
        </Link>
        {company && <p className="pv-for">Prepared for {company}</p>}
        <div className="pv-nav-links">
          <a href="#process" className="pv-link pv-wide-only">How it works</a>
          <a href="#work" className="pv-link pv-wide-only">What we pour</a>
          <a href="#builders" className="pv-link pv-wide-only">Builders</a>
          <a href={businessInfo.phoneHref} className="pv-link">{wide ? businessInfo.phone : 'Call'}</a>
        </div>
      </nav>

      <h1 id="pv-title" className="pv-monument">
        <span className="pv-row pv-row-top">
          <span className="pv-mask"><span data-line style={{ '--i': 0 }}>Pour</span></span>
          {wide && <Film className="pv-slab" />}
          <span className="pv-mask"><span data-line style={{ '--i': 1 }}>date</span></span>
        </span>
        <span className="pv-row pv-row-bottom">
          <span className="pv-mask"><span data-line style={{ '--i': 2 }}>doesn’t move</span></span>
        </span>
      </h1>

      {!wide && <Film className="pv-slab-phone" />}

      <div className="pv-hero-foot pv-after">
        <div className="pv-hero-copy">
          <p className="pv-hero-lead">
            Basements, garage slabs, driveways and flatwork for home builders in Greater Des Moines. Send the PO
            and your pour date is locked the same day.
          </p>
          <p className="pv-hero-proof">630+ pours this year for 30 builders. Se habla español.</p>
        </div>
        <div className="pv-hero-actions">
          <a href="#date" className="pv-action">Book a pour date</a>
          <a href={whatsappHref} className="pv-link pv-underline" target="_blank" rel="noreferrer">
            WhatsApp {sales.firstName}
          </a>
        </div>
      </div>
    </section>
  )
}

function Cost() {
  return (
    <section className="pv-cost" aria-labelledby="pv-cost">
      <div className="pv-cost-text">
        <h2 id="pv-cost" className="pv-head" data-rise>One late pour moves the whole house</h2>
        <p className="pv-lead" data-rise style={{ '--d': 1 }}>
          When the concrete sub slips a day, everything behind it slips too. You pay for every one of those days.
        </p>
      </div>
      <ol className="pv-slip" aria-label="What follows a late pour" data-rise>
        {SLIP.map((line, index) => (
          <li key={line} style={{ '--n': index }}>{line}</li>
        ))}
      </ol>
      <p className="pv-cost-turn" data-rise style={{ '--d': 2 }}>
        So we run on the date. It is set the day your PO lands, two crews of seven pour up to three houses a day
        each, and the owner answers the phone.
      </p>
    </section>
  )
}

function Season() {
  return (
    <section className="pv-season" aria-labelledby="pv-season">
      <div className="pv-season-top">
        <h2 id="pv-season" className="pv-head" data-rise>The season so far</h2>
        <p data-rise style={{ '--d': 1 }}>January to October 2026, from our job and delivery records.</p>
      </div>
      <p className="pv-yards" data-rise style={{ '--d': 1 }}>
        <span className="pv-yards-figure"><CountUp value={businessInfo.stats.yearYards} /></span>
        <span className="pv-yards-label">cubic yards of concrete placed for builders in Greater Des Moines</span>
      </p>
      <dl className="pv-figures">
        {SEASON.map((item, index) => (
          <div key={item.label} data-rise style={{ '--d': index + 2 }}>
            <dt><CountUp value={item.value} /></dt>
            <dd>{item.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Wide() {
  return (
    <figure className="pv-wide">
      <div className="pv-wide-frame">
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
  )
}

function Process() {
  return (
    <section className="pv-process" id="process" aria-labelledby="pv-process">
      <div className="pv-process-media">
        <div className="pv-process-frame" data-shutter>
          <Clip name="edging" label="A finisher tooling the edge of a fresh slab" />
        </div>
      </div>
      <div className="pv-process-text">
        <h2 id="pv-process" className="pv-head" data-rise>PO to invoice, nothing to chase</h2>
        <p className="pv-lead" data-rise style={{ '--d': 1 }}>
          Six steps, the same on every job. You always know where your house stands.
        </p>
        <ol className="pv-steps">
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
  return (
    <section className="pv-work" id="work" aria-labelledby="pv-work">
      <div className="pv-work-text">
        <h2 id="pv-work" className="pv-head" data-rise>What we pour</h2>
        <p className="pv-lead" data-rise style={{ '--d': 1 }}>
          Everything concrete on a new home, from the basement walls to the front stoop.
        </p>
        <ul className="pv-services">
          {SERVICES.map(([name, text], index) => (
            <li key={name} data-rise style={{ '--d': index % 3 }}>
              <h3>{name}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="pv-mosaic">
        <figure className="pv-tile pv-tile-wide" data-rise>
          <div className="pv-tile-frame" data-shutter>
            <img
              {...sizes('obra-2026-10-house-driveway')}
              sizes="(min-width: 821px) 50vw, 100vw"
              alt="Crew finishing a driveway in front of a new home"
              width="1920"
              height="1440"
              loading="lazy"
            />
          </div>
          <figcaption>Driveway at a new home</figcaption>
        </figure>
        <figure className="pv-tile" data-rise style={{ '--d': 1 }}>
          <div className="pv-tile-frame" data-shutter>
            <img
              src={photo('IMG_20211118_162534-640w.webp')}
              alt="A patio formed and poured behind a house"
              width="640"
              height="853"
              loading="lazy"
            />
          </div>
          <figcaption>Patio, formed and poured</figcaption>
        </figure>
        <figure className="pv-tile" data-rise style={{ '--d': 2 }}>
          <div className="pv-tile-frame" data-shutter>
            <img
              src={photo('IMG_20211118_162521-640w.webp')}
              alt="Concrete steps and walk down a side yard"
              width="640"
              height="853"
              loading="lazy"
            />
          </div>
          <figcaption>Steps down a side yard</figcaption>
        </figure>
      </div>
    </section>
  )
}

function Builders() {
  if (!businessInfo.showBuilderNames) return null
  const names = businessInfo.builders
  const run = (hidden) => (
    <span className="pv-names" aria-hidden={hidden || undefined}>
      {names.map((name) => (
        <span key={name}>
          {name}
          <span className="pv-dot" />
        </span>
      ))}
    </span>
  )
  return (
    <section className="pv-builders" id="builders" aria-labelledby="pv-builders">
      <div className="pv-builders-text">
        <h2 id="pv-builders" className="pv-head" data-rise>Poured for 30 builders this year</h2>
        <p className="pv-lead" data-rise style={{ '--d': 1 }}>
          Production builders and general contractors across Greater Des Moines, including:
        </p>
      </div>
      <div className="pv-band">
        <div className="pv-track">
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
    <section className="pv-promise" aria-labelledby="pv-promise">
      <figure className="pv-promise-photo" data-rise>
        <div className="pv-promise-frame" data-shutter>
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
      <div className="pv-promise-text">
        <h2 id="pv-promise" className="pv-head" data-rise>The risk stays with us</h2>
        <dl className="pv-promises">
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

function PourDate({ company }) {
  const today = useMemo(() => atMidnight(new Date()), [])
  const earliest = new Date(today.getTime() + 2 * DAY)
  const [value, setValue] = useState(() => toInput(new Date(today.getTime() + 7 * DAY)))
  const [houses, setHouses] = useState(1)
  const chosen = fromInput(value) || earliest
  const change = (step) => setHouses((current) => Math.min(30, Math.max(1, current + step)))
  const houseWord = houses === 1 ? 'house' : 'houses'

  const href = whatsappLink(
    `Hi ${sales.firstName}, I saw New Era's presentation${company ? ` (${company})` : ''} and I'd like to book a pour for ${houses} ${houseWord} on ${longDate(chosen)}. Address: `
  )

  return (
    <section className="pv-date" id="date" aria-labelledby="pv-date">
      <div className="pv-date-top">
        <div className="pv-date-intro">
          <h2 id="pv-date" className="pv-head">Book your pour date</h2>
          <p>Pick the day and the number of houses. It goes straight to {sales.firstName} on WhatsApp, in English or Spanish.</p>
        </div>
        <div className="pv-date-controls">
          <input
            type="date"
            aria-label="Pour date"
            value={value}
            min={toInput(earliest)}
            onChange={(event) => setValue(event.target.value)}
          />
          <div className="pv-stepper" role="group" aria-label="Number of houses">
            <button type="button" onClick={() => change(-1)} aria-label="One house fewer" disabled={houses <= 1}>−</button>
            <output aria-live="polite">{houses} {houseWord}</output>
            <button type="button" onClick={() => change(1)} aria-label="One house more" disabled={houses >= 30}>+</button>
          </div>
        </div>
      </div>
      <p className="pv-date-big" aria-live="polite">
        <span key={value}>{shortDate(chosen)}</span>
      </p>
      <div className="pv-date-actions">
        <a href={href} className="pv-action pv-action-light" target="_blank" rel="noreferrer">
          Send {houses} {houseWord} to {sales.firstName}
        </a>
        <a href={businessInfo.phoneHref} className="pv-link pv-underline">Or call {businessInfo.phone}</a>
      </div>
    </section>
  )
}

function Quote({ company }) {
  const { address } = businessInfo
  return (
    <section className="pv-quote" id="quote" aria-labelledby="pv-quote">
      <div className="pv-quote-text">
        <h2 id="pv-quote" className="pv-head" data-rise>Send us your next plan</h2>
        <p className="pv-lead" data-rise style={{ '--d': 1 }}>
          {company ? `The next job for ${company}, ` : 'Your next job, '}
          quoted in 48 hours. Same day when it is urgent.
        </p>
        <div className="pv-owner" data-rise style={{ '--d': 2 }}>
          <p>
            {businessInfo.owner}, owner
            <br />
            {address.street}, {address.city}, {address.state} {address.zip}
          </p>
          <p>
            <a href={businessInfo.phoneHref} className="pv-link pv-underline">{businessInfo.phone}</a>
            <br />
            <a href={businessInfo.emailHref} className="pv-link pv-underline">{businessInfo.email}</a>
          </p>
        </div>
        <div className="pv-quote-photo" data-rise style={{ '--d': 3 }}>
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
      <div className="pv-form" data-rise style={{ '--d': 1 }}>
        <ContactForm />
      </div>
    </section>
  )
}

function ActionBar({ visible, whatsappHref }) {
  const tab = visible ? 0 : -1
  return (
    <div className={`pv-bar ${visible ? 'pv-on' : ''}`} aria-hidden={!visible}>
      <p>Ready to book a pour?</p>
      <a href={businessInfo.phoneHref} className="pv-action pv-action-quiet" tabIndex={tab}>Call</a>
      <a href={whatsappHref} className="pv-action pv-action-quiet" target="_blank" rel="noreferrer" tabIndex={tab}>WhatsApp</a>
      <a href="#quote" className="pv-action" tabIndex={tab}>Get a quote</a>
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
    <div ref={root} className="pv">
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

      <footer className="pv-footer">
        <p className="pv-footer-line">
          Serving {businessInfo.serviceArea.join(', ')}. Family-owned since {businessInfo.founded}. Se habla español.{' '}
          <Link to="/" className="pv-link pv-underline">neconstructioniowa.com</Link>
        </p>
        <p className="pv-footer-name" aria-hidden="true">New Era</p>
      </footer>

      <ActionBar visible={pastHero && !atContact} whatsappHref={whatsappHref} />
    </div>
  )
}

export default Presentation

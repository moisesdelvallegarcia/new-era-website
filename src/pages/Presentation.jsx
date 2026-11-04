import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ContactForm from '../components/ContactForm.jsx'
import { businessInfo } from '../data/businessInfo.js'
import { findTeamMember } from '../data/team.js'
import './presentation.css'

// Company presentation sent as a link to builders and general contractors
// (/presentation, optionally ?for=<Company>). Direction "The name as a
// monument": the promise POUR DATE / DOESN'T MOVE is set as wide as the screen
// with the job video poured into the space between the words, like a slab
// between its forms. Then the numbers, the work, the builders, the date picker
// (the reader's own pour date set at the same monumental size) and the quote
// form. The name NEW ERA closes the page at full width. English only, no menu,
// footer or call bar. Only New Era's own job photos and clips: the A0x photos
// and new-era-construction.mp4 from the old site are stock.

// WhatsApp goes to the sales rep: the office line may not have WhatsApp.
const sales = findTeamMember('bernardo')

const photo = (name) => `/media/photos/${name}`

// Three placements repeat down the page: left 3:2, right 4:5, inset 16:9.
const WORK = [
  { kind: 'photo', src: photo('obra-2026-10-house-driveway-1920w.webp'), w: 1920, h: 1440, name: 'Driveway', text: 'Driveway and garage apron at a new home in the metro.', alt: 'Finished driveway in front of a new home' },
  { kind: 'video', src: '/media/videos/obra-2026-10-edging.mp4', poster: '/media/videos/obra-2026-10-edging-poster.webp', name: 'Edging', text: 'Edges tooled by hand while the slab is still fresh.', alt: 'A finisher tooling the edge of a fresh slab' },
  { kind: 'photo', src: photo('obra-2026-10-pour-wide-1920w.webp'), w: 1920, h: 1440, name: 'Garage slab', text: 'The crew placing a garage slab straight from the truck.', alt: 'Crew placing a garage slab beside a new house' },
  { kind: 'photo', src: photo('obra-2026-10-finishing-1920w.webp'), w: 1920, h: 1440, name: 'Finishing', text: 'Hand-finishing a driveway at a new home.', alt: 'Finisher working a fresh driveway slab' },
  { kind: 'photo', src: photo('IMG_20211118_162526-640w.webp'), w: 640, h: 853, name: 'Walkway', text: 'Walkway along a block retaining wall.', alt: 'Concrete walkway beside a retaining wall' },
  { kind: 'photo', src: photo('obra-2026-10-pour-1920w.webp'), w: 1920, h: 1440, name: 'Pour day', text: 'Concrete chuted from the truck into the forms.', alt: 'Mixer truck chuting concrete into the forms' },
]

const DAY = 24 * 60 * 60 * 1000
const atMidnight = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
const toInput = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
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

function usePageSetup() {
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap'
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

// Parts marked data-rise rise once as they enter the screen; the hero frame and
// the work pictures marked data-shutter open from the bottom edge.
function useRise(root) {
  useEffect(() => {
    // A shutter is watched through its parent: while it is clipped shut it has
    // no visible area of its own to intersect.
    const shutters = new Map()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('pv-in')
            shutters.get(entry.target)?.forEach((el) => el.classList.add('pv-in'))
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15 }
    )
    root.current.querySelectorAll('[data-shutter]').forEach((el) => {
      const parent = el.parentElement
      shutters.set(parent, [...(shutters.get(parent) || []), el])
      observer.observe(parent)
    })
    root.current.querySelectorAll('[data-rise]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [root])
}

function Film({ className }) {
  return (
    <span className={className} data-shutter>
      <video
        src="/media/videos/obra-2026-10-finishing.mp4"
        poster="/media/videos/obra-2026-10-finishing-poster.webp"
        autoPlay
        muted
        loop
        playsInline
        aria-label="New Era crew finishing a slab"
      />
    </span>
  )
}

function Hero({ company, whatsappHref, heroRef }) {
  const wide = useWide()
  return (
    <section ref={heroRef} className="pv-hero" aria-labelledby="pv-title">
      <nav className="pv-nav" aria-label="Presentation">
        <Link to="/" className="pv-wordmark">
          <img src={businessInfo.logo} alt="" width="32" height="32" />
          {businessInfo.name}
        </Link>
        <div className="pv-nav-links">
          <a href="#work" className="pv-link pv-wide-only">Work</a>
          <a href="#builders" className="pv-link pv-wide-only">Builders</a>
          <a href="#date" className="pv-link pv-wide-only">Pour date</a>
          <a href={businessInfo.phoneHref} className="pv-link pv-wide-only">{businessInfo.phone}</a>
          <a href="#quote" className="pv-link pv-narrow-only">Quote</a>
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
        <p>
          {company ? `For ${company}: ` : ''}
          {businessInfo.name} pours basements, garages, driveways and flatwork for home builders in Greater Des
          Moines. Your date is booked the day the PO lands.
        </p>
        <div className="pv-hero-actions">
          <a href={whatsappHref} className="pv-link pv-underline" target="_blank" rel="noreferrer">WhatsApp {sales.firstName}</a>
          <a href="#quote" className="pv-action">Request a quote</a>
        </div>
      </div>
    </section>
  )
}

function Numbers({ quoteBy }) {
  const rows = [
    ['3', 'houses a day, per pour crew.'],
    ['2 × 7', 'two pour crews, seven people each.'],
    ['48 h', `to your quote. Send the plan today and have it by ${quoteBy}.`],
    [`${businessInfo.stats.yearYards}`, 'cubic yards placed for builders in Greater Des Moines this year.'],
    [`${businessInfo.founded}`, 'family-owned since then. Se habla español.'],
  ]
  return (
    <section className="pv-numbers" aria-labelledby="pv-numbers">
      <div className="pv-numbers-text">
        <h2 id="pv-numbers" className="pv-head">The numbers behind the date</h2>
        <dl>
          {rows.map(([figure, text], index) => (
            <div key={figure} data-rise style={{ '--d': index + 1 }}>
              <dt>{figure}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      </div>
      <figure className="pv-numbers-photo" data-rise style={{ '--d': 2 }}>
        <img
          src={photo('obra-2026-10-crew-screed-1920w.webp')}
          alt="A New Era crew screeding a fresh slab"
          width="1920"
          height="1440"
          loading="lazy"
        />
      </figure>
    </section>
  )
}

function Work() {
  return (
    <section className="pv-work" id="work" aria-labelledby="pv-work">
      <h2 id="pv-work" className="pv-head">Work</h2>
      <ul className="pv-scatter">
        {WORK.map((item, index) => (
          <li key={item.src} className={`pv-place pv-place-${index % 3}`} data-rise>
            <p className="pv-place-name">{item.name}</p>
            <div className="pv-place-frame" data-shutter>
              {item.kind === 'video' ? (
                <video src={item.src} poster={item.poster} autoPlay muted loop playsInline aria-label={item.alt} />
              ) : (
                <img src={item.src} alt={item.alt} width={item.w} height={item.h} loading="lazy" />
              )}
            </div>
            <p className="pv-place-text">{item.text}</p>
          </li>
        ))}
        <li className="pv-remark" data-rise>
          <p>Basements, garage slabs, driveways, sidewalks, patios and streets.</p>
        </li>
      </ul>
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
      <div className="pv-band">
        <div className="pv-track">
          {run(false)}
          {run(true)}
        </div>
      </div>
      <h2 id="pv-builders" className="pv-builders-line">
        Builders we pour for across Central Iowa, and more every season.
      </h2>
    </section>
  )
}

function PourDate({ company }) {
  const today = useMemo(() => atMidnight(new Date()), [])
  const earliest = new Date(today.getTime() + 2 * DAY)
  const [value, setValue] = useState(() => toInput(new Date(today.getTime() + 7 * DAY)))
  const chosen = fromInput(value) || earliest

  const text = encodeURIComponent(
    `Hi ${sales.firstName}, I saw New Era's presentation${company ? ` (${company})` : ''} and I'd like to book a pour on ${longDate(chosen)}. Address: `
  )
  const href = `https://wa.me/${sales.phoneE164.replace('+', '')}?text=${text}`

  return (
    <section className="pv-date" id="date" aria-labelledby="pv-date">
      <div className="pv-date-top">
        <div>
          <h2 id="pv-date" className="pv-head">Pick your pour date</h2>
          <p data-rise>Choose the day you need. It goes to {sales.firstName} with your message, in English or Spanish.</p>
        </div>
        <label className="pv-date-field" data-rise style={{ '--d': 1 }}>
          <input type="date" aria-label="Pour date" value={value} min={toInput(earliest)} onChange={(event) => setValue(event.target.value)} />
        </label>
      </div>
      <p className="pv-date-big" aria-live="polite">
        <span key={value}>{shortDate(chosen)}</span>
      </p>
      <div className="pv-date-actions">
        <a href={href} className="pv-action" target="_blank" rel="noreferrer">Send this date on WhatsApp</a>
        <a href={businessInfo.phoneHref} className="pv-link pv-underline">Call {businessInfo.phone}</a>
      </div>
      <div className="pv-date-foot">
        <p>{businessInfo.address.city}, Iowa · Se habla español</p>
        <a href={businessInfo.emailHref} className="pv-link">{businessInfo.email}</a>
      </div>
    </section>
  )
}

function Quote({ company }) {
  const { address } = businessInfo
  return (
    <section className="pv-quote" id="quote" aria-labelledby="pv-quote">
      <div className="pv-quote-text">
        <h2 id="pv-quote" className="pv-head">Request a quote</h2>
        <p className="pv-lead" data-rise style={{ '--d': 1 }}>
          {company ? `Send us the next job for ${company}: ` : 'Send us your next job: '}
          the address, the plan or the PO. We answer within 48 hours.
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
          <p>One-year warranty on our work. Se habla español.</p>
        </div>
      </div>
      <div className="pv-form" data-rise style={{ '--d': 1 }}>
        <ContactForm />
      </div>
    </section>
  )
}

function ActionBar({ visible, whatsappHref }) {
  return (
    <div className={`pv-bar ${visible ? 'pv-on' : ''}`} aria-hidden={!visible}>
      <p>Ready to book a pour?</p>
      <a href={businessInfo.phoneHref} className="pv-action pv-action-quiet" tabIndex={visible ? 0 : -1}>Call</a>
      <a href={whatsappHref} className="pv-action pv-action-quiet" target="_blank" rel="noreferrer" tabIndex={visible ? 0 : -1}>WhatsApp</a>
      <a href="#quote" className="pv-action" tabIndex={visible ? 0 : -1}>Get a quote</a>
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

  const quoteBy = useMemo(() => longDate(new Date(Date.now() + 2 * DAY)), [])

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

  const whatsappText = encodeURIComponent(
    `Hi ${sales.firstName}, I saw New Era's presentation${company ? ` (${company})` : ''} and I'd like a quote.`
  )
  const whatsappHref = `https://wa.me/${sales.phoneE164.replace('+', '')}?text=${whatsappText}`

  return (
    <div ref={root} className="pv">
      <Hero company={company} whatsappHref={whatsappHref} heroRef={hero} />
      <Numbers quoteBy={quoteBy} />
      <Work />
      <Builders />
      <div ref={contact}>
        <PourDate company={company} />
        <Quote company={company} />
      </div>

      <footer className="pv-footer">
        <p className="pv-footer-line">
          {businessInfo.serviceArea.join(', ')} · Se habla español ·{' '}
          <Link to="/" className="pv-link">neconstructioniowa.com</Link>
        </p>
        <p className="pv-footer-name">New Era</p>
      </footer>

      <ActionBar visible={pastHero && !atContact} whatsappHref={whatsappHref} />
    </div>
  )
}

export default Presentation

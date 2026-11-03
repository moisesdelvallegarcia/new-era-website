import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ContactForm from '../components/ContactForm.jsx'
import { businessInfo } from '../data/businessInfo.js'
import { findTeamMember } from '../data/team.js'
import './presentation.css'

// Company presentation sent as a link to builders and general contractors
// (/presentation, optionally ?for=<Company>). Six screens: the promise over the
// job video, three numbers, recent work, builders, contact and the quote form.
// An action bar (call, WhatsApp, quote) follows the reader after the first
// screen. English only, no menu, footer or call bar. Only New Era's own job
// photos and clips: the A0x photos and new-era-construction.mp4 from the old
// site are stock.

// WhatsApp goes to the sales rep: the office line may not have WhatsApp.
const sales = findTeamMember('bernardo')

const photo = (name) => `/media/photos/${name}`
const FIGURE_PHOTOS = [
  [photo('obra-2026-10-pour-wide-1920w.webp'), 'Crew during a pour on a new home'],
  [photo('obra-2026-10-crew-screed-1920w.webp'), 'Crew screeding a fresh slab'],
  [photo('obra-2026-10-pour-1920w.webp'), 'Concrete placed from the truck'],
]

const WORK = [
  [photo('obra-2026-10-house-driveway-1920w.webp'), 'Driveway at a new home'],
  [photo('obra-2026-10-finishing-1920w.webp'), 'Slab finished by hand'],
  [photo('obra-2026-10-placing-1920w.webp'), 'Placing concrete along the forms'],
  [photo('IMG_20211118_162502-640w.webp'), 'Sidewalk along a retaining wall'],
  [photo('obra-2026-10-edge-detail-1920w.webp'), 'Edge detail on a fresh slab'],
  [photo('IMG_20211118_162521-640w.webp'), 'Walkway beside a driveway'],
]

function usePageSetup() {
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;600&display=swap'
    document.head.appendChild(link)
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.appendChild(robots)
    document.documentElement.classList.add('js')
    const ground = document.body.style.background
    document.body.style.background = '#e7ebec'
    return () => {
      document.body.style.background = ground
      link.remove()
      robots.remove()
      document.documentElement.classList.remove('js')
    }
  }, [])
}

// Parts marked data-rise rise once as they enter the screen.
function useRise(root) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('pz-in')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.2 }
    )
    root.current.querySelectorAll('[data-rise]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [root])
}

function Figure() {
  const [shown, setShown] = useState(0)

  // Slow crossfade between three photos of the same kind of day.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = setInterval(() => {
      if (!document.hidden) setShown((current) => (current + 1) % FIGURE_PHOTOS.length)
    }, 5600)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="pz-numbers" aria-labelledby="pz-numbers">
      <h2 id="pz-numbers" className="pz-numbers-title" data-rise>Three numbers</h2>
      <div className="pz-figure">
        {FIGURE_PHOTOS.map(([src, alt], index) => (
          <img key={src} src={src} alt={alt} loading="lazy" className={shown === index ? 'pz-on' : ''} />
        ))}
        <div className="pz-figure-scrim" />
        <p className="pz-figure-text" data-rise>cubic yards of concrete placed for builders in Greater Des Moines this year.</p>
        <p className="pz-figure-number" data-rise style={{ '--d': 1 }}>
          {businessInfo.stats.yearYards} <span>yd³</span>
        </p>
      </div>
      <dl className="pz-more">
        <div data-rise>
          <dd>3 houses</dd>
          <dt>a day, per pour crew. Two crews of seven.</dt>
        </div>
        <div data-rise style={{ '--d': 1 }}>
          <dd>48 hours</dd>
          <dt>to get your quote, the same day when it's urgent.</dt>
        </div>
      </dl>
    </section>
  )
}

function Work() {
  const strip = useRef(null)

  function step(direction) {
    const slide = strip.current.querySelector('li')
    strip.current.scrollBy({ left: direction * (slide.offsetWidth + 20), behavior: 'smooth' })
  }

  return (
    <section className="pz-work" aria-labelledby="pz-work">
      <h2 id="pz-work" data-rise>Recent work</h2>
      <ul ref={strip} className="pz-strip" tabIndex={0} aria-label="Photos of recent jobs">
        {WORK.map(([src, alt]) => (
          <li key={src}>
            <img src={src} alt={alt} loading="lazy" />
          </li>
        ))}
      </ul>
      <div className="pz-strip-controls">
        <p style={{ color: 'var(--muted)', fontSize: 'var(--step-small)' }}>
          Basements, garage slabs, driveways, sidewalks, patios and streets
        </p>
        <div>
          <button type="button" onClick={() => step(-1)} aria-label="Previous photo">←</button>
          <button type="button" onClick={() => step(1)} aria-label="Next photo">→</button>
        </div>
      </div>
    </section>
  )
}

function Builders() {
  if (!businessInfo.showBuilderNames) return null
  return (
    <section className="pz-builders" aria-labelledby="pz-builders">
      <h2 id="pz-builders" data-rise>Builders we pour for</h2>
      <ul data-rise style={{ '--d': 1 }}>
        <li>Home builders</li>
        {businessInfo.builders.map((name) => (
          <li key={name}>{name}</li>
        ))}
        <li>and more across Central Iowa</li>
      </ul>
    </section>
  )
}

function Contact({ company }) {
  const { address } = businessInfo
  return (
    <>
      <section className="pz-visit" aria-labelledby="pz-visit">
        <img src={photo('obra-2026-10-crew-screed-1920w.webp')} alt="New Era crew screeding a slab" loading="lazy" />
        <div className="pz-card" data-rise>
          <h2 id="pz-visit">Talk to Christian</h2>
          <p>
            {businessInfo.owner}, owner
            <br />
            {address.street}, {address.city}, {address.state} {address.zip}
          </p>
          <p>
            <a href={businessInfo.phoneHref} className="pz-link">{businessInfo.phone}</a>
            <br />
            <a href={businessInfo.emailHref} className="pz-link">{businessInfo.email}</a>
          </p>
          <p>One-year warranty on our work. Se habla español.</p>
          <a href="#quote" className="pz-action">Request a quote</a>
        </div>
      </section>
      <section className="pz-quote" aria-labelledby="pz-quote" id="quote">
        <div data-rise>
          <h2 id="pz-quote">Request a quote</h2>
          <p>
            {company ? `Send us the next job for ${company}: ` : 'Send us your next job: '}
            the address, the plan or the PO. We answer within 48 hours.
          </p>
        </div>
        <div className="pz-form" data-rise style={{ '--d': 1 }}>
          <ContactForm />
        </div>
      </section>
    </>
  )
}

function ActionBar({ visible, whatsappHref }) {
  return (
    <div className={`pz-bar ${visible ? 'pz-on' : ''}`} aria-hidden={!visible}>
      <p>Ready to book a pour?</p>
      <a href={businessInfo.phoneHref} className="pz-action pz-action-quiet" tabIndex={visible ? 0 : -1}>Call</a>
      <a href={whatsappHref} className="pz-action pz-action-quiet" target="_blank" rel="noreferrer" tabIndex={visible ? 0 : -1}>WhatsApp</a>
      <a href="#quote" className="pz-action" tabIndex={visible ? 0 : -1}>Get a quote</a>
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
  // again at the contact card and the form, which carry their own actions.
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
    <div ref={root} className="pz">
      <section ref={hero} className="pz-hero" aria-labelledby="pz-title">
        <div className="pz-sheet">
          <div className="pz-sheet-top">
            <a href="#quote" className="pz-link">Quote</a>
            <Link to="/" className="pz-wordmark">
              <img src={businessInfo.logo} alt="" />
              {businessInfo.name}
            </Link>
            <a href={businessInfo.phoneHref} className="pz-link">{businessInfo.phone}</a>
          </div>
          <div className="pz-sheet-body">
            <h1 id="pz-title" className="pz-lines">
              <span className="pz-line"><span data-line style={{ '--i': 0 }}>Your pour date</span></span>
              <span className="pz-line"><span data-line style={{ '--i': 1 }}>doesn't move</span></span>
            </h1>
            <p className="pz-after-lines">
              {company ? `For ${company}: ` : ''}
              basements, garages, driveways and flatwork, booked the day your PO lands and poured on that date. Greater Des Moines.
            </p>
            <div className="pz-sheet-actions pz-after-lines">
              <a href="#quote" className="pz-action">Request a quote</a>
              <a href={whatsappHref} className="pz-action pz-action-quiet" target="_blank" rel="noreferrer">WhatsApp us</a>
            </div>
          </div>
        </div>
        <div className="pz-film">
          <video
            src="/media/videos/obra-2026-10-finishing.mp4"
            poster="/media/videos/obra-2026-10-finishing-poster.webp"
            autoPlay
            muted
            loop
            playsInline
            aria-label="New Era crew finishing a slab"
          />
          <div className="pz-film-bar">
            <span className="pz-wide">Family-owned since {businessInfo.founded}</span>
            <Link to="/" className="pz-wordmark pz-narrow">
              <img src={businessInfo.logo} alt="" />
              {businessInfo.name}
            </Link>
            <span>Des Moines, Iowa</span>
          </div>
        </div>
      </section>

      <Figure />
      <Work />
      <Builders />
      <div ref={contact}>
        <Contact company={company} />
      </div>

      <footer className="pz-footer">
        <p>{businessInfo.name}</p>
        <p>
          {businessInfo.serviceArea.join(', ')} · Se habla español ·{' '}
          <Link to="/" className="pz-link">neconstructioniowa.com</Link>
        </p>
      </footer>

      <ActionBar visible={pastHero && !atContact} whatsappHref={whatsappHref} />
    </div>
  )
}

export default Presentation

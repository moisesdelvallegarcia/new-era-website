import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ContactForm from '../components/ContactForm.jsx'
import { businessInfo } from '../data/businessInfo.js'
import { findTeamMember } from '../data/team.js'
import './presentation.css'

// Company presentation sent as a link to builders and general contractors
// (/presentation, optionally ?for=<Company>). Direction "Photographs at uneven
// sizes" (design-taste-frontend): the job photos hung like prints on a gallery
// wall, each at its own size, with a wall label under it. The promise over the
// job video, the numbers with a house counter, recent work, who we pour for,
// contact and the quote form. An action bar (call, WhatsApp, quote) follows the
// reader after the first screen. English only, no menu, footer or call bar.
// Only New Era's own job photos and clips: the A0x photos and
// new-era-construction.mp4 from the old site are stock.

// WhatsApp goes to the sales rep: the office line may not have WhatsApp.
const sales = findTeamMember('bernardo')

const photo = (name) => `/media/photos/${name}`

// Three photos of the same kind of day, crossfading beside the numbers.
const DAY = [
  [photo('obra-2026-10-crew-screed-1920w.webp'), 'Crew screeding a fresh slab'],
  [photo('obra-2026-10-finishing-1920w.webp'), 'Slab finished by hand at a new home'],
  [photo('obra-2026-10-pour-wide-1920w.webp'), 'Crew during a pour on a new home'],
]

// The wall: each print has its own place in a four-column grid (see the CSS).
const WORK = [
  { src: photo('obra-2026-10-house-driveway-1920w.webp'), alt: 'Driveway poured at a new home', name: 'Driveway, new home', kind: 'Driveway', year: 2026 },
  { src: photo('obra-2026-10-placing-1920w.webp'), alt: 'Placing concrete along the forms', name: 'Placing along the forms', kind: 'Flatwork', year: 2026 },
  { video: '/media/videos/obra-2026-10-edging.mp4', src: '/media/videos/obra-2026-10-edging-poster.webp', alt: 'Edging a fresh slab', name: 'Edging a fresh slab', kind: 'Finishing', year: 2026 },
  { src: photo('IMG_20211118_162521-640w.webp'), alt: 'Walkway beside a driveway', name: 'Walk beside a drive', kind: 'Sidewalk', year: 2021 },
  { src: photo('obra-2026-10-pour-1920w.webp'), alt: 'Concrete placed from the truck at a new home', name: 'Garage slab from the truck', kind: 'Garage', year: 2026 },
  { src: photo('IMG_20211118_162502-640w.webp'), alt: 'Sidewalk along a retaining wall', name: 'Walk along a wall', kind: 'Sidewalk', year: 2021 },
  { src: photo('IMG_20211118_162534-640w.webp'), alt: 'Patio formed and poured behind a house', name: 'Patio, formed and poured', kind: 'Patio', year: 2021 },
  { src: photo('obra-2026-10-edge-detail-1920w.webp'), alt: 'Edge detail on a fresh slab', name: 'Edge on a fresh slab', kind: 'Detail', year: 2026 },
]

const KINDS_OF_WORK = ['Basements', 'Garage slabs', 'Driveways', 'Sidewalks', 'Patios', 'Streets']

function usePageSetup() {
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500&display=swap'
    document.head.appendChild(link)
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.appendChild(robots)
    document.documentElement.classList.add('js')
    const ground = document.body.style.background
    document.body.style.background = '#f7f9fa'
    return () => {
      document.body.style.background = ground
      link.remove()
      robots.remove()
      document.documentElement.classList.remove('js')
    }
  }, [])
}

// Parts marked data-rise arrive once as they enter the screen.
function useRise(root) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('gw-in')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )
    root.current.querySelectorAll('[data-rise]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [root])
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// The year's yards count up once, the first time they are seen.
function CountUp({ value }) {
  const target = Number(value.replace(/[^0-9]/g, ''))
  const suffix = value.replace(/[0-9,]/g, '')
  const ref = useRef(null)
  const [shown, setShown] = useState(value)

  useEffect(() => {
    if (reducedMotion() || !target) return undefined
    let frame = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const tick = (now) => {
        const t = Math.min(1, (now - start) / 1400)
        const eased = 1 - Math.pow(1 - t, 4)
        setShown(`${Math.round(target * eased).toLocaleString('en-US')}${suffix}`)
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }, { threshold: 0.6 })
    observer.observe(ref.current)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [target, suffix])

  return <span ref={ref}>{shown}</span>
}

// The live thing: count the houses you need poured, see the days it takes
// at three houses a day per crew, two crews.
function HouseCounter() {
  const [houses, setHouses] = useState(12)
  const perDay = 3 * 2
  const days = Math.ceil(houses / perDay)
  const change = (step) => setHouses((current) => Math.min(60, Math.max(1, current + step)))

  return (
    <div className="gw-counter" data-rise style={{ '--d': 2 }}>
      <h3 id="gw-counter">How many houses this month?</h3>
      <div className="gw-stepper" role="group" aria-labelledby="gw-counter">
        <button type="button" onClick={() => change(-1)} aria-label="One house fewer" disabled={houses <= 1}>−</button>
        <output aria-live="polite">
          <span key={houses} className="gw-tick">{houses}</span> {houses === 1 ? 'house' : 'houses'}
        </output>
        <button type="button" onClick={() => change(1)} aria-label="One house more" disabled={houses >= 60}>+</button>
      </div>
      <p>
        Both crews pour them in <strong>{days} working {days === 1 ? 'day' : 'days'}</strong>, on dates set the day your PO lands.
      </p>
    </div>
  )
}

function Numbers() {
  const [shown, setShown] = useState(0)

  // Slow crossfade between three photos of the same kind of day.
  useEffect(() => {
    if (reducedMotion()) return undefined
    const timer = setInterval(() => {
      if (!document.hidden) setShown((current) => (current + 1) % DAY.length)
    }, 5600)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="gw-numbers gw-grid" aria-labelledby="gw-numbers">
      <div className="gw-numbers-list">
        <h2 id="gw-numbers" data-rise>How the date holds</h2>
        <dl>
          <div data-rise style={{ '--d': 1 }}>
            <dt>3</dt>
            <dd>houses a day, per pour crew.</dd>
          </div>
          <div data-rise style={{ '--d': 2 }}>
            <dt>2 × 7</dt>
            <dd>pour crews of seven people each, working the same day.</dd>
          </div>
          <div data-rise style={{ '--d': 3 }}>
            <dt>48 h</dt>
            <dd>to your quote, the same day when it's urgent.</dd>
          </div>
          <div data-rise style={{ '--d': 4 }}>
            <dt><CountUp value={businessInfo.stats.yearYards} /></dt>
            <dd>cubic yards placed for builders in Greater Des Moines this year.</dd>
          </div>
          <div data-rise style={{ '--d': 5 }}>
            <dt>{businessInfo.founded}</dt>
            <dd>family-owned since then. Se habla español.</dd>
          </div>
        </dl>
      </div>
      <div className="gw-numbers-side">
        <div className="gw-day gw-print" data-rise style={{ '--d': 1 }}>
          {DAY.map(([src, alt], index) => (
            <img key={src} src={src} alt={alt} loading="lazy" width="1920" height="1440" className={shown === index ? 'gw-on' : ''} />
          ))}
        </div>
        <HouseCounter />
      </div>
    </section>
  )
}

function Print({ item, className }) {
  return (
    <figure className={`gw-tile ${className}`} data-rise>
      <div className="gw-print">
        {item.video ? (
          <video src={item.video} poster={item.src} autoPlay muted loop playsInline preload="metadata" aria-label={item.alt} />
        ) : (
          <img src={item.src} alt={item.alt} loading="lazy" />
        )}
      </div>
      <figcaption>
        <span>{item.name}</span>
        <span>{item.kind}, {item.year}</span>
      </figcaption>
    </figure>
  )
}

function Work() {
  return (
    <section className="gw-work" aria-labelledby="gw-work" id="work">
      <h2 id="gw-work" className="gw-work-title" data-rise>
        Recent
        <br />
        work
      </h2>
      {WORK.map((item, index) => (
        <Print key={item.src} item={item} className={`gw-t${index + 1}`} />
      ))}
    </section>
  )
}

function Names() {
  const groups = [
    businessInfo.showBuilderNames && ['Builders', [...businessInfo.builders, 'and more across Central Iowa']],
    ['Towns', businessInfo.serviceArea],
    ['The work', KINDS_OF_WORK],
  ].filter(Boolean)

  return (
    <section className="gw-names gw-grid" aria-labelledby="gw-names" id="builders">
      <h2 id="gw-names" data-rise>Who we pour for</h2>
      <div className="gw-names-cols">
        {groups.map(([kind, names], index) => (
          <ul key={kind} data-rise style={{ '--d': index + 1 }}>
            <li>{kind}</li>
            {names.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  )
}

function Contact({ company, whatsappHref }) {
  const { address } = businessInfo
  return (
    <>
      <section className="gw-contact gw-grid" aria-labelledby="gw-contact" id="contact">
        <p className="gw-statement" data-rise>
          Send the address, the plan or the PO for your next house. The quote is back within 48 hours.
        </p>
        <div className="gw-portrait gw-print" data-rise style={{ '--d': 1 }}>
          <img src={photo('IMG_20211118_162530-640w.webp')} alt="Finished walk and steps beside a driveway" loading="lazy" width="640" height="853" />
        </div>
        <div className="gw-contact-links" data-rise style={{ '--d': 2 }}>
          <h2 id="gw-contact">Talk to {businessInfo.owner.split(' ')[0]}</h2>
          <a href={businessInfo.phoneHref} className="gw-link">{businessInfo.phone}</a>
          <a href={businessInfo.emailHref} className="gw-link">{businessInfo.email}</a>
          <a href={whatsappHref} className="gw-link" target="_blank" rel="noreferrer">WhatsApp {sales.firstName}, sales</a>
          <p>
            {businessInfo.owner}, owner · {address.street}, {address.city}, {address.state} {address.zip}. One-year warranty on our work. Se habla español.
          </p>
        </div>
      </section>
      <section className="gw-quote gw-grid" aria-labelledby="gw-quote" id="quote">
        <div className="gw-quote-text" data-rise>
          <h2 id="gw-quote">Request a quote</h2>
          <p>
            {company ? `Send us the next job for ${company}: ` : 'Send us your next job: '}
            the address, the plan or the PO. We answer within 48 hours.
          </p>
        </div>
        <div className="gw-quote-print gw-print" data-rise style={{ '--d': 1 }}>
          <img src={photo('obra-2026-10-crew-screed-1920w.webp')} alt="New Era crew screeding a slab" loading="lazy" width="1920" height="1440" />
        </div>
        <div className="gw-form" data-rise style={{ '--d': 2 }}>
          <ContactForm />
        </div>
      </section>
    </>
  )
}

function ActionBar({ visible, whatsappHref }) {
  return (
    <div className={`gw-bar ${visible ? 'gw-on' : ''}`} aria-hidden={!visible}>
      <p>Ready to book a pour?</p>
      <a href={businessInfo.phoneHref} className="gw-action gw-action-quiet" tabIndex={visible ? 0 : -1}>Call</a>
      <a href={whatsappHref} className="gw-action gw-action-quiet" target="_blank" rel="noreferrer" tabIndex={visible ? 0 : -1}>WhatsApp</a>
      <a href="#quote" className="gw-action" tabIndex={visible ? 0 : -1}>Get a quote</a>
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
  // again at the contact row and the form, which carry their own actions.
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
    <div ref={root} className="gw">
      <section ref={hero} className="gw-hero" aria-labelledby="gw-title">
        <nav className="gw-nav" aria-label="Presentation">
          <Link to="/" className="gw-wordmark">
            <img src={businessInfo.logo} alt="" width="34" height="34" />
            {businessInfo.name}
          </Link>
          <div className="gw-nav-links">
            <a href="#work" className="gw-link">Work</a>
            <a href="#builders" className="gw-link">Builders</a>
            <a href="#contact" className="gw-link">Contact</a>
          </div>
          <a href="#quote" className="gw-action gw-nav-action">Request a quote</a>
        </nav>

        <div className="gw-hero-wall">
          <h1 id="gw-title" className="gw-lines">
            <span className="gw-line"><span data-line style={{ '--i': 0 }}>Your pour date</span></span>
            <span className="gw-line"><span data-line style={{ '--i': 1 }}>doesn't move</span></span>
          </h1>
          <div className="gw-hero-text gw-after-lines">
            <p>
              {company ? `For ${company}: basements` : 'Basements'}, garages, driveways and flatwork for home builders in
              Greater Des Moines, booked the day your PO lands and poured on that date.
            </p>
            <div className="gw-hero-actions">
              <a href="#quote" className="gw-action">Request a quote</a>
              <a href={whatsappHref} className="gw-action gw-action-dark" target="_blank" rel="noreferrer">WhatsApp us</a>
            </div>
          </div>
          <div className="gw-hero-big gw-print gw-open">
            <video
              src="/media/videos/obra-2026-10-finishing.mp4"
              poster="/media/videos/obra-2026-10-finishing-poster.webp"
              autoPlay
              muted
              loop
              playsInline
              aria-label="New Era crew finishing a slab"
            />
          </div>
          <div className="gw-hero-small gw-print gw-open" style={{ '--i': 2 }}>
            <img src={photo('obra-2026-10-pour-1920w.webp')} alt="Mixer truck placing concrete at a new home" width="1920" height="1440" />
          </div>
          <p className="gw-hero-meta gw-after-lines">
            Family-owned since {businessInfo.founded} · Des Moines, Iowa · Se habla español
          </p>
        </div>
      </section>

      <Numbers />
      <Work />
      <Names />
      <div ref={contact}>
        <Contact company={company} whatsappHref={whatsappHref} />
      </div>

      <footer className="gw-footer">
        <p className="gw-footer-name">{businessInfo.name}</p>
        <p>
          {businessInfo.serviceArea.join(', ')} · Se habla español ·{' '}
          <Link to="/" className="gw-link">neconstructioniowa.com</Link>
        </p>
      </footer>

      <ActionBar visible={pastHero && !atContact} whatsappHref={whatsappHref} />
    </div>
  )
}

export default Presentation

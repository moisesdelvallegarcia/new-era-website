import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ContactForm from '../components/ContactForm.jsx'
import { businessInfo } from '../data/businessInfo.js'
import './presentation.css'

// Company presentation sent as a link to builders and general contractors
// (/presentation, optionally ?for=<Company>). It reads top to bottom and ends in
// the quote form, so the client never leaves the page. English only, no menu,
// footer or call bar. Only New Era's own job photos: the A0x photos from the old
// site look like stock and are left out.

const photo = (name) => `/media/photos/${name}`
const PHOTOS = {
  screed: [photo('obra-2026-10-crew-screed-1920w.webp'), 'Crew screeding a fresh slab', '4 / 3'],
  pour: [photo('obra-2026-10-pour-1920w.webp'), 'Concrete being placed on a residential job', '4 / 3'],
  pourWide: [photo('obra-2026-10-pour-wide-1920w.webp'), 'Crew during a pour', '4 / 3'],
  finishing: [photo('obra-2026-10-finishing-1920w.webp'), 'Crew finishing a slab', '4 / 3'],
  driveway: [photo('obra-2026-10-house-driveway-1920w.webp'), 'New driveway at a new home', '4 / 3'],
  placing: [photo('obra-2026-10-placing-1920w.webp'), 'Placing concrete by the forms', '3 / 4'],
  edge: [photo('obra-2026-10-edge-detail-1920w.webp'), 'Edge detail on a fresh slab', '3 / 4'],
  walk: [photo('IMG_20211118_162502-640w.webp'), 'Sidewalk along a retaining wall', '3 / 4'],
  steps: [photo('IMG_20211118_162521-640w.webp'), 'Walkway beside a driveway', '3 / 4'],
  formed: [photo('IMG_20211118_162526-640w.webp'), 'Slab poured inside its forms', '3 / 4'],
  stamped: [photo('IMG_20211118_162530-640w.webp'), 'Fresh walkway being finished', '3 / 4'],
  bull: [photo('IMG_20211118_162534-640w.webp'), 'Crew working a long pour', '3 / 4'],
  edging: ['/media/videos/obra-2026-10-edging-poster.webp', 'Edging a fresh slab', '4 / 3'],
}

const RING = [
  'screed', 'placing', 'walk', 'pour', 'edge', 'steps', 'finishing', 'formed',
  'driveway', 'stamped', 'pourWide', 'bull', 'edging', 'placing', 'screed', 'edge',
]

// Frames sit on an ellipse (560 × 310 px on a 1440 × 900 screen) and grow
// towards the viewer; on a phone it becomes a circle 132vw across.
const ring = RING.map((key, index) => {
  const angle = (index / RING.length) * Math.PI * 2 - Math.PI / 2
  const sin = Math.sin(angle)
  const cos = Math.cos(angle)
  const tangent = (Math.atan2(310 * cos, -560 * sin) * 180) / Math.PI
  let tilt = ((tangent + 90) % 180) - 90
  tilt = Math.max(-30, Math.min(30, tilt))
  const size = 150 - 50 * Math.max(0, -sin)
  return {
    key,
    style: {
      '--x': `${50 + (560 / 1440) * 100 * cos}%`,
      '--y': `${50 + (310 / 900) * 100 * sin}%`,
      '--w': `${(size / 1440) * 100}vw`,
      '--xm': `${50 + 66 * cos}vw`,
      '--ym': `calc(50% + ${66 * sin}vw)`,
      '--wm': `${64 + 24 * Math.max(0, sin)}px`,
      '--r': PHOTOS[key][2],
      '--a': `${tilt}deg`,
    },
    wideOnly: index % 4 === 3,
  }
})

const STATEMENTS = [
  ['Booked the day your PO lands', 'placing', 'driveway'],
  ['Your date moves, ours moves', 'edge', 'pour'],
  ['Reviewed with your superintendent', 'walk', 'finishing'],
  ['English and Spanish on site', 'bull', 'pourWide'],
  ['Invoices that match your PO', 'stamped', 'screed'],
]

const MOMENTS = [
  ['Your PO arrives', 'It goes into our scheduling system the same day, with the address and the plan.', 'placing', 96],
  ['We book it', 'Crew, concrete and pump are reserved for your date, not squeezed in.', 'walk', 136],
  ['We confirm', 'Date and details are reviewed with your superintendent before we pour.', 'edge', 84],
  ['We pour', 'Form, place and finish, with the same crew from start to end.', 'bull', 120],
  ['We hand over', 'We walk the work with you until you sign off on it.', 'steps', 100],
  ['We invoice', 'The invoice follows your PO line by line. No surprises.', 'stamped', 140],
]

const CREWS = [
  ['Pour crews', 'Two crews of seven', 'They prepare and pour most of our projects: up to three houses a day each.', 'screed'],
  ['Repair crew', 'Five people', 'Repairs, replacements and the smaller jobs, so the pour crews keep their dates.', 'finishing'],
  ['Finishing and support', 'Three people', 'Saw cutting, cleanup and extra hands on the big pours.', 'pourWide'],
  ['Logistics', 'One person', 'Crews, concrete and equipment where they need to be, every morning.', 'pour'],
]

const HOUSES_PER_DAY = 6 // two pour crews, up to three houses a day each

function Img({ name, className = '', eager = false, ...rest }) {
  const [src, alt] = PHOTOS[name]
  return <img src={src} alt={alt} className={className} loading={eager ? 'eager' : 'lazy'} {...rest} />
}

function useArchivo() {
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
    document.body.style.background = '#1e2427'
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

function Scene() {
  const [active, setActive] = useState(0)
  const markers = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.step))
        }
      },
      { threshold: 0.5 }
    )
    markers.current.querySelectorAll('[data-step]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="pz-scene" aria-labelledby="pz-benefits">
      <div className="pz-scene-stage">
        <Img name="pour" eager />
        <div className="pz-scene-scrim" />
        <ul className="pz-statements">
          <li>
            <h2 id="pz-benefits" className={active === 0 ? 'pz-on' : ''}>What builders get from us</h2>
          </li>
          {STATEMENTS.map(([text], index) => (
            <li key={text} className={active === index + 1 ? 'pz-on' : ''}>{text}</li>
          ))}
        </ul>
        {STATEMENTS.map(([text, left, right], index) => (
          <div key={text} className={`pz-pair ${active === index + 1 ? 'pz-on' : ''}`} aria-hidden="true">
            <Img name={left} alt="" />
            <Img name={right} alt="" />
          </div>
        ))}
      </div>
      <div ref={markers} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true">
        {[0, ...STATEMENTS.map((_, i) => i + 1)].map((step) => (
          <div key={step} data-step={step} className="pz-marker" />
        ))}
      </div>
    </section>
  )
}

function Moments() {
  const row = useRef(null)
  const [progress, setProgress] = useState(0)

  function onScroll() {
    const el = row.current
    const max = el.scrollWidth - el.clientWidth
    setProgress(max > 0 ? el.scrollLeft / max : 1)
  }

  function step(direction) {
    row.current.scrollBy({ left: direction * 312, behavior: 'smooth' })
  }

  return (
    <section className="pz-section" aria-labelledby="pz-process" id="process">
      <div className="pz-row-top">
        <h2 id="pz-process" data-rise>From PO to invoice</h2>
        <div className="pz-row-buttons">
          <button type="button" onClick={() => step(-1)} aria-label="Previous step">←</button>
          <button type="button" onClick={() => step(1)} aria-label="Next step">→</button>
        </div>
      </div>
      <div className="pz-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${Math.max(0.12, progress)})` }} />
      </div>
      <ol ref={row} className="pz-row" onScroll={onScroll} tabIndex={0} aria-label="Our six steps">
        {MOMENTS.map(([title, text, image, space], index) => (
          <li key={title} data-rise style={{ '--d': index, '--space': `${space}px` }}>
            <h3>{title}</h3>
            <p>{text}</p>
            <Img name={image} />
          </li>
        ))}
      </ol>
    </section>
  )
}

function Capacity() {
  const [houses, setHouses] = useState(24)
  const days = Math.ceil(houses / HOUSES_PER_DAY)

  return (
    <section className="pz-section" aria-labelledby="pz-capacity">
      <div className="pz-capacity">
        <div data-rise>
          <h2 id="pz-capacity">How fast we can pour</h2>
          <p className="pz-muted" style={{ marginTop: 24 }}>
            Two pour crews, each pouring up to three houses a day. Move the slider to your month.
          </p>
          <label htmlFor="pz-houses">Houses to pour: {houses}</label>
          <input
            id="pz-houses"
            type="range"
            min="1"
            max="60"
            value={houses}
            onChange={(event) => setHouses(Number(event.target.value))}
          />
          <dl className="pz-stats">
            {[
              [businessInfo.stats.yearYards, 'cubic yards placed in 2026'],
              [businessInfo.stats.jobs, 'jobs in the last 12 months'],
              [businessInfo.stats.peakYards, 'cubic yards in our peak month'],
            ].map(([value, label]) => (
              <div key={label}>
                <dd>{value}</dd>
                <dt>{label}</dt>
              </div>
            ))}
          </dl>
        </div>
        <div className="pz-result" data-rise style={{ '--d': 1 }} aria-live="polite">
          <p className="pz-result-number">
            {days} {days === 1 ? 'day' : 'days'}
          </p>
          <p>
            of pouring for {houses} {houses === 1 ? 'house' : 'houses'}, at our full pace.
          </p>
        </div>
      </div>
    </section>
  )
}

function Crews() {
  return (
    <section className="pz-section" aria-labelledby="pz-crews" id="crews">
      <div className="pz-crews">
        <div data-rise>
          <h2 id="pz-crews">Our crews</h2>
          <p>
            A family team that runs like a system. {businessInfo.owner} owns the company, founded in {businessInfo.founded} on 15+ years of concrete work.
          </p>
        </div>
        <ul className="pz-crews-list">
          {CREWS.map(([name, role, text, image], index) => (
            <li key={name} data-rise style={{ '--d': index }}>
              <Img name={image} />
              <h3>{name}</h3>
              <p className="pz-role">{role}</p>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Builders() {
  const [lit, setLit] = useState(0)
  const names = businessInfo.builders

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = setInterval(() => setLit((current) => (current + 1) % names.length), 2000)
    return () => clearInterval(timer)
  }, [names.length])

  if (!businessInfo.showBuilderNames) return null

  return (
    <section className="pz-section" aria-labelledby="pz-builders">
      <div className="pz-names" data-rise>
        <h2 id="pz-builders">Builders who keep calling us:</h2>{' '}
        {names.map((name, index) => (
          <span key={name} className={lit === index ? 'pz-on' : ''}>
            {name}
            {index < names.length - 1 ? ', ' : '.'}
          </span>
        ))}
      </div>
    </section>
  )
}

function Contact({ company }) {
  const { address } = businessInfo
  return (
    <>
      <section className="pz-visit" aria-labelledby="pz-visit">
        <video
          src="/media/videos/obra-2026-10-finishing.mp4"
          poster="/media/videos/obra-2026-10-finishing-poster.webp"
          autoPlay
          muted
          loop
          playsInline
          aria-label="Crew finishing a slab"
        />
        <div className="pz-card">
          <h2 id="pz-visit">Talk to Christian</h2>
          <p>
            {address.street}
            <br />
            {address.city}, {address.state} {address.zip}
          </p>
          <p>
            <a href={businessInfo.phoneHref} className="pz-link">{businessInfo.phone}</a>
            <br />
            <a href={businessInfo.emailHref} className="pz-link">{businessInfo.email}</a>
          </p>
          <p>Quotes within 48 hours, the same day when urgent. One-year warranty on our work.</p>
          <a href="#quote" className="pz-action">Request a quote</a>
        </div>
      </section>
      <section className="pz-section" aria-labelledby="pz-quote" id="quote">
        <div className="pz-quote">
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
        </div>
      </section>
    </>
  )
}

function Presentation() {
  const [params] = useSearchParams()
  const company = (params.get('for') || '').trim().slice(0, 60)
  const root = useRef(null)
  useArchivo()
  useRise(root)

  useEffect(() => {
    document.title = company ? `New Era Construction · for ${company}` : 'New Era Construction · Concrete for builders'
  }, [company])

  return (
    <div ref={root} className="pz">
      <header className="pz-header">
        <Link to="/" className="pz-wordmark">
          <img src={businessInfo.logo} alt="" />
          {businessInfo.name}
        </Link>
        <nav aria-label="Presentation">
          <a href="#process" className="pz-link">Process</a>
          <a href="#crews" className="pz-link">Crews</a>
          <a href="#quote" className="pz-link">Quote</a>
        </nav>
      </header>

      <section className="pz-hero" aria-labelledby="pz-title">
        <div className="pz-ring">
          {ring.map(({ key, style, wideOnly }, index) => (
            <Img key={index} name={key} eager={index < 8} style={style} className={wideOnly ? 'pz-wide-only' : ''} />
          ))}
        </div>
        <div className="pz-core">
          <h1 id="pz-title" className="pz-lines">
            <span className="pz-line"><span data-line style={{ '--i': 0 }}>Concrete poured</span></span>
            <span className="pz-line"><span data-line style={{ '--i': 1 }}>on your date</span></span>
          </h1>
          <p className="pz-after-lines">
            {company ? `For ${company}: ` : ''}
            New Era Construction pours basements, garages, driveways and flatwork for builders across Greater Des Moines.
          </p>
          <a href="#quote" className="pz-action pz-after-lines">Request a quote</a>
        </div>
      </section>

      <Scene />
      <Moments />
      <Capacity />
      <Crews />
      <Builders />
      <Contact company={company} />

      <footer className="pz-footer">
        <p>{businessInfo.name}</p>
        <p>
          Family-owned since {businessInfo.founded} · {businessInfo.serviceArea.join(', ')} · Se habla español ·{' '}
          <Link to="/" className="pz-link">neconstructioniowa.com</Link>
        </p>
      </footer>
    </div>
  )
}

export default Presentation

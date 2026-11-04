import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ContactForm from '../components/ContactForm.jsx'
import { businessInfo } from '../data/businessInfo.js'
import { findTeamMember } from '../data/team.js'
import './presentation.css'

// Company presentation sent as a link to builders and general contractors
// (/presentation, optionally ?for=<Company>). Direction "The contact sheet":
// the page is a photographer's contact sheet of a pour day. Every run of small
// frames is one stage of the work, in the order it happens; the facts sit in
// the sheet as cells of their own. Only New Era's own job photos, clips and
// stills pulled from those clips: the A0x photos and new-era-construction.mp4
// from the old site are stock. English only, no menu, footer or call bar.

// WhatsApp goes to the sales rep: the office line may not have WhatsApp.
const sales = findTeamMember('bernardo')

const photo = (name) => `/media/photos/${name}`
const still = (clip, n) => `/media/frames/obra-2026-10-${clip}-frame-${n}.webp`

// Ratios are width / height, so each frame keeps its natural shape.
const WIDE = 4 / 3
const TALL = 3 / 4
const CLIP = 480 / 861

const P = {
  pour: [photo('obra-2026-10-pour-640w.webp'), WIDE, 'Ready-mix truck pouring at a new home'],
  pourWide: [photo('obra-2026-10-pour-wide-640w.webp'), WIDE, 'Crew placing a driveway beside the truck'],
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

// The hero sheet: six columns of frames. Strips carry the stage of the work or
// one of the facts. Columns 3 and 4 hold the text cell instead.
function heroColumns(stats) {
  return [
    [
      [...P.pourWide, 'Placing'],
      [...S('finishing', 2, 'Screed pulled across a fresh slab'), 'Screed'],
      { fact: `${stats.yearYards}`, unit: 'yd³ this year', strip: 'Placed for builders' },
    ],
    [
      { video: 'edging', strip: 'Edging, today' },
      [...P.driveway, 'Driveway'],
      { fact: '48 h', unit: 'to your quote', strip: 'Plans in, price out' },
    ],
    null,
    null,
    null,
    [
      [...P.placing, 'Chute'],
      { video: 'finishing', strip: 'Bull float, today' },
      { fact: '2 × 7', unit: 'two crews of seven', strip: '3 houses a day each' },
    ],
  ]
}

const HERO_MIDDLE = {
  top: [
    [...P.pour, 'Truck on time'],
    [...S('finishing', 7, 'Crew finishing the far end of a slab'), 'Float'],
    [...P.finishing, 'Hand finish'],
  ],
  bottom: [
    [...P.lakeWalk, 'Walk, 2021'],
    [...S('edging', 6, 'Edger run along the form'), 'Edge'],
    [...P.patio, 'Patio, 2021'],
  ],
}

// The work: one run of frames per stage of a pour day, in order.
const RUNS = [
  {
    id: 'placing',
    kind: 'pour',
    name: 'Placing',
    note: 'From truck to forms',
    year: 2026,
    frames: [P.pour, P.pourWide, P.placing, S('finishing', 1, 'Screed set on the forms'), P.driveway],
  },
  {
    id: 'screed',
    kind: 'pour',
    name: 'Screed and float',
    note: 'Flat, then smooth',
    year: 2026,
    frames: [
      P.screed,
      S('finishing', 3, 'Two finishers on a fresh slab'),
      S('finishing', 4, 'Bull float across the slab'),
      S('finishing', 5, 'Crew working the slab from both sides'),
      P.finishing,
      S('finishing', 8, 'Finished slab with the crew at the far end'),
    ],
  },
  {
    id: 'edging',
    kind: 'pour',
    name: 'Edges and finish',
    note: 'Tooled by hand',
    year: 2026,
    feature: true,
    frames: [
      S('edging', 1, 'Edger set against the form'),
      S('edging', 2, 'Edger pulled along the slab'),
      S('edging', 4, 'Edger near the end of the run'),
      P.edge,
      S('edging', 5, 'Fresh edge in the sun'),
    ],
    more: [
      S('edging', 3, 'Edge line beside the form'),
      S('edging', 6, 'Hand edger working the corner'),
      S('edging', 7, 'Hand edger on the fresh edge'),
      S('edging', 8, 'Finished edge beside the form'),
      S('finishing', 6, 'Crew finishing the slab from both sides'),
    ],
  },
  {
    id: 'finished',
    kind: 'finished',
    name: 'Walks, steps and patios',
    note: 'Poured in 2021',
    year: 2021,
    frames: [P.walk, P.steps, P.blockWall, P.lakeWalk, P.patio, P.broom],
  },
]

// Small pictures for the planner: one per house.
const HOUSE_FRAMES = [P.driveway, P.pourWide, P.finishing, P.screed, P.pour, P.patio]

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function usePageSetup() {
  useEffect(() => {
    const links = [
      ['preconnect', 'https://api.fontshare.com'],
      ['preconnect', 'https://cdn.fontshare.com'],
      ['stylesheet', 'https://api.fontshare.com/v2/css?f[]=switzer@400,500&display=swap'],
    ].map(([rel, href]) => {
      const link = document.createElement('link')
      link.rel = rel
      link.href = href
      if (rel === 'preconnect') link.crossOrigin = ''
      document.head.appendChild(link)
      return link
    })
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.appendChild(robots)
    document.documentElement.classList.add('js')
    const ground = document.body.style.background
    document.body.style.background = '#ebe5e3'
    return () => {
      document.body.style.background = ground
      links.forEach((link) => link.remove())
      robots.remove()
      document.documentElement.classList.remove('js')
    }
  }, [])
}

// Parts marked data-rise rise once as they enter the screen; parts marked
// data-shutter open from the bottom edge. A jump down the page (the quote link)
// also reveals everything it passed over.
function useRise(root) {
  useEffect(() => {
    const parts = [...root.current.querySelectorAll('[data-rise], [data-shutter]')]
    const reveal = (el) => {
      el.classList.add('cs-in')
      observer.unobserve(el)
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        for (const entry of entries) if (entry.isIntersecting) reveal(entry.target)
        for (const el of parts) if (!el.classList.contains('cs-in') && el.getBoundingClientRect().top < 0) reveal(el)
      },
      { threshold: 0.15 }
    )
    parts.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [root])
}

function Clip({ name, label, eager = false }) {
  const [play] = useState(() => !reducedMotion())
  return (
    <video
      src={`/media/videos/obra-2026-10-${name}.mp4`}
      poster={`/media/videos/obra-2026-10-${name}-poster.webp`}
      autoPlay={play}
      muted
      loop
      playsInline
      preload={eager ? 'auto' : 'metadata'}
      aria-label={label}
    />
  )
}

function Frame({ item, index }) {
  if (item.fact) {
    return (
      <figure className="cs-frame cs-fact" style={{ '--i': index }}>
        <div>
          <p>{item.fact}</p>
          <p className="cs-fact-unit">{item.unit}</p>
        </div>
        <figcaption className="cs-strip">{item.strip}</figcaption>
      </figure>
    )
  }
  if (item.video) {
    return (
      <figure className="cs-frame" style={{ '--i': index, '--r': CLIP }}>
        <Clip name={item.video} label={`New Era crew, ${item.strip.toLowerCase()}`} eager />
        <figcaption className="cs-strip">{item.strip}</figcaption>
      </figure>
    )
  }
  const [src, ratio, alt, strip] = item
  return (
    <figure className="cs-frame" style={{ '--i': index, '--r': ratio }}>
      <img src={src} alt={alt} />
      <figcaption className="cs-strip">{strip}</figcaption>
    </figure>
  )
}

function Hero({ company, whatsappHref, heroRef }) {
  const columns = heroColumns(businessInfo.stats)
  return (
    <section ref={heroRef} className="cs-hero" aria-labelledby="cs-title">
      {columns.map((column, c) =>
        column ? (
          <div key={c} className={`cs-col cs-col-${c + 1}`}>
            {column.map((item, i) => (
              <Frame key={i} item={item} index={c + i} />
            ))}
          </div>
        ) : null
      )}
      <div className="cs-col-mid">
        {HERO_MIDDLE.top.map((item, i) => (
          <Frame key={`t${i}`} item={item} index={i + 1} />
        ))}
        <div className="cs-cell">
          <h1 id="cs-title">Your pour date doesn't move.</h1>
          <p>
            {company ? `For ${company}: concrete` : 'Concrete'} for Greater Des Moines builders, poured on the date we book.
          </p>
          <a href="#quote" className="cs-action">Request a quote</a>
          <Link to="/" className="cs-wordmark">
            <img src={businessInfo.logo} alt="" width="36" height="36" />
            {businessInfo.name}
          </Link>
          <p className="cs-cell-links">
            <a href={businessInfo.phoneHref} className="cs-link">Call</a>
            <a href={whatsappHref} className="cs-link" target="_blank" rel="noreferrer">WhatsApp</a>
            <a href={businessInfo.emailHref} className="cs-link">Email</a>
          </p>
        </div>
        {HERO_MIDDLE.bottom.map((item, i) => (
          <Frame key={`b${i}`} item={item} index={i + 4} />
        ))}
      </div>
    </section>
  )
}

function Numbers() {
  const { stats, founded } = businessInfo
  const rows = [
    ['3', 'houses a day for each pour crew: basements, garages, driveways.'],
    ['2 × 7', 'two pour crews of seven people each.'],
    ['48 h', 'from your plans to our quote, the same day when it is urgent.'],
    [stats.yearYards, 'cubic yards placed for builders in Greater Des Moines this year.'],
    [String(founded), 'the year the family started New Era. Se habla español.'],
  ]
  return (
    <section className="cs-numbers" aria-labelledby="cs-numbers">
      <h2 id="cs-numbers" data-rise>Why the date holds</h2>
      <dl>
          {rows.map(([figure, line], i) => (
            <div key={figure} data-rise style={{ '--d': i + 1 }}>
              <dt>{figure}</dt>
              <dd>{line}</dd>
            </div>
          ))}
      </dl>
      <figure className="cs-numbers-photo" data-shutter>
        <img src={photo('obra-2026-10-crew-screed-640w.webp')} alt="Pour crew screeding a slab at a new home" loading="lazy" width="640" height="480" />
      </figure>
    </section>
  )
}

function addDays(date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

// The live thing: set how many houses the next phase has and read how many pour
// days that is with both crews, as a contact sheet with one row per day.
function Planner() {
  const [houses, setHouses] = useState(12)
  const perDay = 6
  const days = Math.ceil(houses / perDay)
  const quoteBy = useMemo(
    () => addDays(new Date(), 2).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
    []
  )
  const rows = Array.from({ length: days }, (_, d) =>
    Array.from({ length: Math.min(perDay, houses - d * perDay) }, (_, h) => d * perDay + h)
  )

  return (
    <section className="cs-plan" aria-labelledby="cs-plan">
      <div className="cs-plan-head">
        <h2 id="cs-plan" data-rise>Plan your next phase</h2>
        <div className="cs-plan-control" data-rise style={{ '--d': 1 }}>
          <label htmlFor="cs-houses">Houses to pour</label>
          <div className="cs-stepper">
            <button type="button" onClick={() => setHouses((n) => Math.max(1, n - 1))} aria-label="One house fewer">−</button>
            <input
              id="cs-houses"
              type="range"
              min="1"
              max="36"
              value={houses}
              onChange={(event) => setHouses(Number(event.target.value))}
            />
            <button type="button" onClick={() => setHouses((n) => Math.min(36, n + 1))} aria-label="One house more">+</button>
          </div>
        </div>
        <p className="cs-plan-answer" aria-live="polite" data-rise style={{ '--d': 2 }}>
          {houses} {houses === 1 ? 'house is' : 'houses are'} {days} {days === 1 ? 'pour day' : 'pour days'} with both crews.
          Send the plans today and the quote is yours by {quoteBy}.
        </p>
      </div>
      <ol className="cs-days">
        {rows.map((row, d) => (
          <li key={d}>
            <span className="cs-day-name">Day {d + 1}</span>
            <span className="cs-day-crews">
              {[row.slice(0, 3), row.slice(3)].map((crew, c) =>
                crew.length ? (
                  <span key={c} className="cs-crew">
                    {crew.map((n) => {
                      const [src] = HOUSE_FRAMES[n % HOUSE_FRAMES.length]
                      return (
                        <span key={n} className="cs-house">
                          <img src={src} alt="" loading="lazy" />
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
      <p className="cs-plan-note">Three houses a day for each crew, at full pace. We confirm every date when your PO lands.</p>
    </section>
  )
}

function Work() {
  const [filter, setFilter] = useState('all')
  const [active, setActive] = useState(null)
  const [inView, setInView] = useState('placing')
  const list = useRef(null)

  // The run in the middle of the screen develops into colour; the rest stay
  // printed in grey, like a contact sheet.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setInView(entry.target.dataset.run)
      },
      { rootMargin: '-45% 0px -45% 0px' }
    )
    list.current.querySelectorAll('[data-run]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const filters = [
    ['all', 'All'],
    ['pour', 'Pour day'],
    ['finished', 'Finished'],
  ]
  const lit = active || inView

  return (
    <section className="cs-work" aria-labelledby="cs-work">
      <div className="cs-rail">
        <h2 id="cs-work">The work</h2>
        <div className="cs-filters" role="group" aria-label="Show runs">
          {filters.map(([id, label]) => (
            <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <ul ref={list} className={`cs-runs ${active ? 'cs-runs-hover' : ''}`}>
        {RUNS.map((run) => (
          <li
            key={run.id}
            data-run={run.id}
            hidden={filter !== 'all' && filter !== run.kind}
            className={`cs-run ${lit === run.id ? 'cs-lit' : ''}`}
            onMouseEnter={() => setActive(run.id)}
            onMouseLeave={() => setActive(null)}
          >
            <div className={`cs-run-frames ${run.feature ? 'cs-run-feature' : ''}`} tabIndex={0} aria-label={`${run.name}, ${run.year}`}>
              {run.feature ? (
                <>
                  <figure className="cs-enlarged" data-shutter>
                    <Clip name="edging" label="New Era finisher tooling an edge" />
                  </figure>
                  <span className="cs-run-rows">
                    {[run.frames, run.more].map((row, r) => (
                      <span key={r} className="cs-run-row">
                        {row.map(([src, ratio, alt]) => (
                          <img key={src} src={src} alt={alt} loading="lazy" style={{ '--r': ratio }} />
                        ))}
                      </span>
                    ))}
                  </span>
                </>
              ) : (
                run.frames.map(([src, ratio, alt]) => (
                  <img key={src} src={src} alt={alt} loading="lazy" style={{ '--r': ratio }} />
                ))
              )}
            </div>
            <p className="cs-run-line">
              <h3>{run.name}</h3>
              <span className="cs-run-note">{run.note}</span>
              <span>{run.year}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Builders() {
  const lists = [
    ...(businessInfo.showBuilderNames ? [['Builders', [...businessInfo.builders, 'and more']]] : []),
    ['Where we pour', businessInfo.serviceArea],
    ['What we pour', ['Basements', 'Garage slabs', 'Driveways', 'Sidewalks', 'Stoops and steps', 'Patios', 'Streets']],
  ]
  return (
    <section className="cs-names" aria-labelledby="cs-names">
      <h2 id="cs-names" data-rise>Who we pour for</h2>
      <div className="cs-names-cols" data-rise style={{ '--d': 1 }}>
        {lists.map(([kind, names]) => (
          <ul key={kind}>
            <li className="cs-kind">{kind}</li>
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
      <section className="cs-contact" aria-labelledby="cs-contact">
        <p className="cs-contact-line" data-rise>
          Send the address and the plans for your next phase. We quote in 48 hours and hold the date.
        </p>
        <img
          className="cs-contact-photo"
          src={photo('obra-2026-10-placing-640w.webp')}
          alt="New Era crew placing concrete from the chute"
          loading="lazy"
          width="640"
          height="853"
          data-rise
          style={{ '--d': 1 }}
        />
        <div className="cs-contact-links" data-rise style={{ '--d': 2 }}>
          <h2 id="cs-contact" className="cs-contact-ask">Rather talk to a person?</h2>
          <a href={businessInfo.phoneHref} className="cs-link cs-under">Call {businessInfo.owner.split(' ')[0]}, {businessInfo.phone}</a>
          <a href={whatsappHref} className="cs-link cs-under" target="_blank" rel="noreferrer">WhatsApp {sales.firstName}, sales</a>
          <a href={businessInfo.emailHref} className="cs-link cs-under">{businessInfo.email}</a>
          <p className="cs-contact-where">
            {address.street}, {address.city}. One-year warranty on our work. Se habla español.
          </p>
        </div>
      </section>
      <section className="cs-quote" aria-labelledby="cs-quote" id="quote">
        <div data-rise>
          <h2 id="cs-quote">Request a quote</h2>
          <p>
            {company ? `Send us the next job for ${company}: ` : 'Send us your next job: '}
            the address, the plan or the PO. We answer within 48 hours.
          </p>
        </div>
        <div className="cs-form" data-rise style={{ '--d': 1 }}>
          <ContactForm />
        </div>
      </section>
    </>
  )
}

function ActionBar({ visible, whatsappHref }) {
  return (
    <div className={`cs-bar ${visible ? 'cs-on' : ''}`} aria-hidden={!visible}>
      <p>Ready to book a pour?</p>
      <a href={businessInfo.phoneHref} className="cs-action cs-action-quiet" tabIndex={visible ? 0 : -1}>Call</a>
      <a href={whatsappHref} className="cs-action cs-action-quiet" target="_blank" rel="noreferrer" tabIndex={visible ? 0 : -1}>WhatsApp</a>
      <a href="#quote" className="cs-action" tabIndex={visible ? 0 : -1}>Get a quote</a>
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
  // again at the contact band and the form, which carry their own actions.
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
    <div ref={root} className="cs">
      <Hero company={company} whatsappHref={whatsappHref} heroRef={hero} />
      <Numbers />
      <Planner />
      <Work />
      <Builders />
      <div ref={contact}>
        <Contact company={company} whatsappHref={whatsappHref} />
      </div>

      <footer className="cs-footer">
        <p className="cs-footer-name">{businessInfo.name}</p>
        <div className="cs-footer-row">
          <p>
            Family-owned since {businessInfo.founded}. {businessInfo.serviceArea.join(', ')}. Se habla español.{' '}
            <Link to="/" className="cs-link cs-under">neconstructioniowa.com</Link>
          </p>
          <a href="#quote" className="cs-action">Book a pour date</a>
        </div>
      </footer>

      <ActionBar visible={pastHero && !atContact} whatsappHref={whatsappHref} />
    </div>
  )
}

export default Presentation

import { Link } from 'react-router-dom'
import { businessInfo } from '../data/businessInfo.js'

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-zinc-950 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
      <img
        src="/media/photos/A9-1920w.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full scale-105 object-cover opacity-20 blur-sm"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(9,9,11,0.98)_0%,rgba(9,9,11,0.9)_42%,rgba(9,9,11,0.62)_100%)]" />
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="mb-5 text-xs font-black uppercase tracking-[0.24em] text-orange-300">
            {businessInfo.location}
          </p>
          <h1 className="max-w-4xl text-4xl font-black leading-[0.96] tracking-tight sm:text-6xl lg:text-7xl">
            Concrete Contractors Serving the Greater Des Moines Metro Area
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
            Reliable concrete work for homes and businesses across Central Iowa.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/contact"
              className="rounded-full bg-white px-7 py-4 text-center text-base font-black text-zinc-950 transition hover:bg-orange-500 hover:text-white focus-visible:bg-orange-500 focus-visible:text-white"
            >
              Request a Free Estimate
            </Link>
            <Link
              to="/gallery"
              className="rounded-full border border-white/20 bg-white/5 px-7 py-4 text-center text-base font-black text-white backdrop-blur transition hover:border-white/60 hover:bg-white/10 focus-visible:border-white/60"
            >
              View Our Work
            </Link>
          </div>
          <dl className="mt-11 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
            {businessInfo.highlights.slice(0, 3).map((item) => (
              <div key={item} className="bg-zinc-950/55 p-5 backdrop-blur">
                <dt className="text-sm font-black text-white">{item}</dt>
                <dd className="mt-1 text-xs text-zinc-400">Built into every estimate</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative min-h-[23rem] overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900/70 shadow-2xl shadow-black/40">
          <img
            src="/media/photos/A9-1920w.webp"
            alt="New Era Construction crew finishing a concrete driveway"
            className="h-full min-h-[23rem] w-full object-cover"
          />
          <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 p-5 text-zinc-950 shadow-xl backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">
              Family-owned
            </p>
            <p className="mt-1 text-xl font-black tracking-tight">Over 15 years of concrete experience</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

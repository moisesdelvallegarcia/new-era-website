import { Link } from 'react-router-dom'
import { businessInfo } from '../data/businessInfo.js'

function Hero() {
  return (
    <section className="bg-zinc-950 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-orange-400">
            {businessInfo.location}
          </p>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Concrete Contractors Serving the Greater Des Moines Metro Area
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Reliable concrete work for homes and businesses across Central Iowa.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/contact"
              className="rounded bg-orange-600 px-6 py-4 text-center text-base font-black text-white transition hover:bg-orange-700 focus-visible:bg-orange-700"
            >
              Request a Free Estimate
            </Link>
            <Link
              to="/gallery"
              className="rounded border border-white/25 px-6 py-4 text-center text-base font-black text-white transition hover:border-orange-400 hover:text-orange-300 focus-visible:border-orange-400"
            >
              View Our Work
            </Link>
          </div>
          <dl className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {businessInfo.highlights.slice(0, 3).map((item) => (
              <div key={item} className="rounded border border-white/10 bg-white/5 p-4">
                <dt className="text-sm font-bold text-orange-300">{item}</dt>
                <dd className="mt-1 text-xs text-zinc-400">Built into every estimate</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative min-h-[23rem] overflow-hidden rounded-lg border border-white/10 bg-zinc-900 shadow-2xl">
          <img
            src="/media/photos/A9-1920w.webp"
            alt="New Era Construction crew finishing a concrete driveway"
            className="h-full min-h-[23rem] w-full object-cover"
          />
          <div className="absolute bottom-4 left-4 right-4 rounded bg-white/95 p-4 text-zinc-950 shadow-xl">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-orange-700">
              Family-owned
            </p>
            <p className="mt-1 text-lg font-black">Over 15 years of concrete experience</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

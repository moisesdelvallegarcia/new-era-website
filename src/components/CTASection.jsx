import { Link } from 'react-router-dom'
import { businessInfo } from '../data/businessInfo.js'

function CTASection() {
  return (
    <section className="bg-orange-600 px-4 py-14 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-100">
            Free estimates
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Ready to price your next concrete project?
          </h2>
          <p className="mt-3 max-w-2xl text-orange-50">
            Talk with a local crew that understands Central Iowa homes, weather, and jobsite needs.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/contact"
            className="rounded bg-white px-6 py-4 text-center font-black text-orange-700 transition hover:bg-zinc-100 focus-visible:bg-zinc-100"
          >
            Request a Free Estimate
          </Link>
          <a
            href={businessInfo.phoneHref}
            className="rounded border border-white/50 px-6 py-4 text-center font-black text-white transition hover:bg-white/10 focus-visible:bg-white/10"
          >
            Call {businessInfo.phone}
          </a>
        </div>
      </div>
    </section>
  )
}

export default CTASection

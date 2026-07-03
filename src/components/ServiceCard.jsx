import { Link } from 'react-router-dom'

function ServiceCard({ service }) {
  return (
    <article className="flex min-h-52 flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white/85 p-6 shadow-sm shadow-zinc-200/70 transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-zinc-200">
      <div>
        <h3 className="text-xl font-black tracking-tight text-zinc-950">{service.title}</h3>
        <p className="mt-3 leading-7 text-zinc-600">{service.summary}</p>
      </div>
      <Link
        to="/contact"
        className="mt-6 inline-flex font-bold text-zinc-950 transition hover:text-orange-700 focus-visible:text-orange-700"
      >
        Request pricing
      </Link>
    </article>
  )
}

export default ServiceCard

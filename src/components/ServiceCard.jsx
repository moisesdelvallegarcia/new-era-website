import { Link } from 'react-router-dom'

function ServiceCard({ service }) {
  return (
    <article className="flex min-h-52 flex-col justify-between rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg">
      <div>
        <h3 className="text-xl font-black text-zinc-950">{service.title}</h3>
        <p className="mt-3 leading-7 text-zinc-600">{service.summary}</p>
      </div>
      <Link
        to="/contact"
        className="mt-6 inline-flex font-bold text-orange-700 transition hover:text-orange-800 focus-visible:text-orange-800"
      >
        Request pricing
      </Link>
    </article>
  )
}

export default ServiceCard

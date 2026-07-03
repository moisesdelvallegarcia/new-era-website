import housecallPublicData from '../data/housecallPublicData.json'

const fallbackStats = [
  { label: '15+ years', detail: 'Concrete experience' },
  { label: 'Free', detail: 'Project estimates' },
  { label: 'English / Español', detail: 'Bilingual service' },
]

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(Number(value || 0))
}

function buildStats(data) {
  const overview = data.overview || {}
  const stats = []

  if (overview.completed_projects > 0) {
    stats.push({
      label: `${formatNumber(overview.completed_projects)}+`,
      detail: 'completed projects tracked'
    })
  }

  if (overview.cities_served > 0) {
    stats.push({
      label: `${formatNumber(overview.cities_served)}+`,
      detail: 'Central Iowa cities served'
    })
  }

  if (overview.driveway_projects > 0) {
    stats.push({
      label: `${formatNumber(overview.driveway_projects)}+`,
      detail: 'driveway projects completed'
    })
  }

  return stats.length ? stats.slice(0, 3) : fallbackStats
}

function HousecallProof() {
  const stats = buildStats(housecallPublicData)
  const topCities = (housecallPublicData.cityStats || []).slice(0, 6)
  const topServices = (housecallPublicData.serviceStats || []).slice(0, 4)
  const hasLiveData = housecallPublicData.source !== 'fallback'

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-700">
            Real work history
          </p>
          <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-zinc-950 sm:text-5xl">
            Built from actual Housecall Pro project records
          </h2>
          <p className="mt-5 text-lg leading-8 text-zinc-600">
            The public site can show real project momentum while keeping customer names, phone
            numbers, emails, invoices, and street addresses private.
          </p>
          <p className="mt-4 text-sm font-bold text-zinc-500">
            {hasLiveData
              ? `Last refreshed ${new Date(housecallPublicData.generatedAt).toLocaleDateString('en-US')}`
              : 'Ready for the first Housecall Pro export'}
          </p>
        </div>

        <div className="grid gap-5">
          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.detail} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <p className="text-3xl font-black tracking-tight text-zinc-950">{stat.label}</p>
                <p className="mt-2 text-sm font-semibold text-zinc-600">{stat.detail}</p>
              </div>
            ))}
          </div>

          {(topServices.length > 0 || topCities.length > 0) && (
            <div className="grid gap-5 md:grid-cols-2">
              {topServices.length > 0 && (
                <div className="rounded-2xl border border-zinc-200 p-5">
                  <h3 className="font-black tracking-tight text-zinc-950">Most common work</h3>
                  <ul className="mt-4 grid gap-3">
                    {topServices.map((service) => (
                      <li key={service.service_label} className="flex justify-between gap-4 text-sm">
                        <span className="font-semibold text-zinc-700">{service.service_label}</span>
                        <span className="font-black text-zinc-950">
                          {formatNumber(service.completed_projects)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {topCities.length > 0 && (
                <div className="rounded-2xl border border-zinc-200 p-5">
                  <h3 className="font-black tracking-tight text-zinc-950">Areas served</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {topCities.map((city) => (
                      <span
                        key={`${city.city}-${city.state}`}
                        className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm font-bold text-zinc-700"
                      >
                        {city.city}, {city.state}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default HousecallProof

import housecallPublicData from '../data/housecallPublicData.json'

function normalizeCityName(city) {
  if (!city) return 'Central Iowa'
  if (city.toLowerCase() === 'cuming') return 'Cumming'
  return city
}

function normalizeStateName(state) {
  if (!state) return 'IA'
  return state.toUpperCase() === 'IOWA' ? 'IA' : state.toUpperCase()
}

function mergeCities(cities) {
  const cityMap = new Map()

  for (const city of cities) {
    const cityName = normalizeCityName(city.city)
    const stateName = normalizeStateName(city.state)
    const key = `${cityName}-${stateName}`.toLowerCase()
    const current = cityMap.get(key) || {
      city: cityName,
      state: stateName,
      completed_projects: 0,
      service_types: 0,
    }

    current.completed_projects += Number(city.completed_projects || 0)
    current.service_types = Math.max(current.service_types, Number(city.service_types || 0))
    cityMap.set(key, current)
  }

  return Array.from(cityMap.values()).sort(
    (a, b) => b.completed_projects - a.completed_projects
  )
}

function AreasServed() {
  const cities = mergeCities(housecallPublicData.cityStats || []).slice(0, 12)

  if (!cities.length) return null

  const featuredCities = cities.slice(0, 4)
  const supportingCities = cities.slice(4)

  return (
    <section className="bg-zinc-950 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-300">
              Areas served
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              Concrete work across Central Iowa
            </h2>
          </div>
          <p className="text-lg leading-8 text-zinc-300">
            Historic Housecall Pro records show where New Era Construction has completed work,
            without exposing customer names or full street addresses.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {featuredCities.map((city) => (
            <article
              key={`${city.city}-${city.state}`}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            >
              <p className="text-3xl font-black tracking-tight text-white">
                {city.completed_projects}
              </p>
              <h3 className="mt-2 font-black tracking-tight">
                {city.city}, {city.state}
              </h3>
              <p className="mt-1 text-sm text-zinc-400">
                {city.service_types} service types tracked
              </p>
            </article>
          ))}
        </div>

        {supportingCities.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {supportingCities.map((city) => (
              <span
                key={`${city.city}-${city.state}`}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-zinc-200"
              >
                {city.city}, {city.state}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default AreasServed

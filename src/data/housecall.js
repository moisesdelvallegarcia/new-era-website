// Named imports so only these fields ship in the bundle (the JSON also holds revenue totals).
import { cityStats, generatedAt, serviceStats, source } from './housecallPublicData.json'

// Regenerate the JSON from nova-expense-ai:
//   WEBSITE_PUBLIC_DATA_PATH=<this repo>/src/data/housecallPublicData.json npm run housecall:export:website

function normalizeCityName(city) {
  return city.toLowerCase() === 'cuming' ? 'Cumming' : city
}

function normalizeStateName(state) {
  if (!state) return 'IA'
  return state.toUpperCase() === 'IOWA' ? 'IA' : state.toUpperCase()
}

// Housecall has the same city under different spellings; merge them and sort by job count.
function mergeCities(cities) {
  const cityMap = new Map()

  for (const row of cities) {
    if (!row.city) continue
    const city = normalizeCityName(row.city)
    const state = normalizeStateName(row.state)
    const key = `${city}-${state}`.toLowerCase()
    const current = cityMap.get(key) || { city, state, completed_projects: 0 }
    current.completed_projects += Number(row.completed_projects || 0)
    cityMap.set(key, current)
  }

  return Array.from(cityMap.values()).sort((a, b) => b.completed_projects - a.completed_projects)
}

export const housecallCities = mergeCities(cityStats || [])

export const housecallServices = (serviceStats || [])
  .filter((service) => Number(service.completed_projects) > 0)
  .sort((a, b) => b.completed_projects - a.completed_projects)

export const housecallGeneratedAt =
  source === 'fallback' ? null : generatedAt

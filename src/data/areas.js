import { businessInfo } from './businessInfo.js'

// One landing page per city in the service area (/areas/ankeny, /es/areas/ankeny).
// No Housecall import here: scripts/page-heads.js loads this file in plain Node.
export const areas = businessInfo.serviceArea.map((city) => ({
  city,
  slug: city.toLowerCase().replaceAll(' ', '-'),
}))

export function findArea(slug) {
  return areas.find((area) => area.slug === slug)
}

export function fill(text, values) {
  return text.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match)
}

export function areaMeta(t, city) {
  return {
    title: fill(t.area.metaTitle, { city }),
    description: fill(t.area.metaDescription, { city }),
  }
}

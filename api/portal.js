// Vercel function: concrete schedule for one builder's private portal (/portal/<token>).
// Reads new_era.portal_hubbell_rows() (nova-expense-ai migrations 20261014_portal_hubbell.sql
// and 20261015_portal_hubbell_fn.sql):
// Hubbell's ECI calendar joined with our Housecall jobs. No prices or payments.
// Env (Vercel → Settings → Environment Variables):
//   PORTAL_DATABASE_URL   Supabase pooler URL for the read-only role web_portal
//   PORTAL_HUBBELL_TOKEN  secret part of the link we send to Hubbell

import { timingSafeEqual } from 'node:crypto'
import pg from 'pg'

const BUILDERS = [{ name: 'Hubbell Homes', tokenEnv: 'PORTAL_HUBBELL_TOKEN', view: 'new_era.portal_hubbell_rows()' }]

// Last 30 days for "poured", everything ahead for "upcoming". Past work that never
// got a crew is left out: it means the link to Housecall is missing, not that we
// skipped the house, and the builder should not see it as "not scheduled".
const sqlFor = (view) => `
  SELECT po_number, desarrollo, direccion, lote, tarea, fecha_hubbell, fecha_anterior,
         fecha_new_era, estado, completed_at, actualizado_at
  FROM ${view}
  WHERE estado <> 'cancelado'
    AND (fecha_hubbell >= current_date OR (estado = 'colado' AND fecha_hubbell >= current_date - 30))
  ORDER BY fecha_hubbell, direccion`

// The view takes ~6 s, so keep each builder's rows for a few minutes per instance.
const CACHE_MS = 5 * 60 * 1000
const cache = new Map()

let pool

function getPool() {
  pool ??= new pg.Pool({
    connectionString: process.env.PORTAL_DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 1,
  })
  return pool
}

function findBuilder(token) {
  const given = Buffer.from(String(token ?? ''))
  return BUILDERS.find(({ tokenEnv }) => {
    const expected = Buffer.from(process.env[tokenEnv] ?? '')
    return expected.length >= 16 && given.length === expected.length && timingSafeEqual(given, expected)
  })
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Robots-Tag', 'noindex, nofollow')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false })
  }

  if (!process.env.PORTAL_DATABASE_URL) {
    console.error('portal: PORTAL_DATABASE_URL is not set')
    return res.status(503).json({ success: false })
  }

  const body = typeof req.body === 'object' && req.body ? req.body : {}
  const builder = findBuilder(body.token)
  if (!builder) return res.status(401).json({ success: false })

  try {
    let entry = cache.get(builder.name)
    if (!entry || Date.now() - entry.at > CACHE_MS) {
      const { rows } = await getPool().query(sqlFor(builder.view))
      entry = { at: Date.now(), rows }
      cache.set(builder.name, entry)
    }
    const { rows } = entry
    return res.status(200).json({ success: true, builder: builder.name, rows })
  } catch (error) {
    console.error('portal: query failed', error)
    return res.status(502).json({ success: false })
  }
}

// Vercel function: bids from ConstructConnect for the private /licitaciones page.
// Reads the same view Nexus uses (new_era.licitaciones), loaded weekly from NOVA.
// Env (Vercel → Settings → Environment Variables):
//   LICITACIONES_DATABASE_URL  Supabase pooler URL for the read-only role web_licitaciones
//   LICITACIONES_PASSWORD      password the team types on the page

import { timingSafeEqual } from 'node:crypto'
import pg from 'pg'

const BIDS_SQL = `
  SELECT project_id, titulo, descripcion, ciudad, condado, direccion, distancia_mi,
         fecha_licitacion, hora_licitacion, dias_para_licitar, fecha_junta_previa,
         junta_obligatoria, fecha_inicio, etapa, valor, tipos_obra, licitar_a,
         pies_cuadrados, calificacion, recomendacion, decision, decision_nota,
         contratista_general, en_ultima_carga, actualizado_at
  FROM new_era.licitaciones
  WHERE dias_para_licitar IS NULL OR dias_para_licitar >= -7
  ORDER BY (recomendacion = 'vencida'), calificacion DESC, fecha_licitacion NULLS LAST`

const CONTACTS_SQL = `
  SELECT project_id, rol, nombre, empresa, telefono, correo
  FROM new_era.licitaciones_contactos
  WHERE project_id = ANY($1)`

let pool

function getPool() {
  pool ??= new pg.Pool({
    connectionString: process.env.LICITACIONES_DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 1,
  })
  return pool
}

function passwordMatches(given) {
  const expected = Buffer.from(process.env.LICITACIONES_PASSWORD)
  const actual = Buffer.from(String(given ?? ''))
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Robots-Tag', 'noindex, nofollow')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false })
  }

  if (!process.env.LICITACIONES_DATABASE_URL || !process.env.LICITACIONES_PASSWORD) {
    console.error('licitaciones: LICITACIONES_DATABASE_URL or LICITACIONES_PASSWORD is not set')
    return res.status(503).json({ success: false })
  }

  const body = typeof req.body === 'object' && req.body ? req.body : {}
  if (!passwordMatches(body.password)) {
    return res.status(401).json({ success: false })
  }

  try {
    const db = getPool()
    const { rows: bids } = await db.query(BIDS_SQL)
    const { rows: contacts } = await db.query(CONTACTS_SQL, [bids.map((bid) => bid.project_id)])
    const byProject = Object.groupBy(contacts, (contact) => contact.project_id)
    return res.status(200).json({
      success: true,
      bids: bids.map((bid) => ({ ...bid, contactos: byProject[bid.project_id] ?? [] })),
    })
  } catch (error) {
    console.error('licitaciones: query failed', error)
    return res.status(502).json({ success: false })
  }
}

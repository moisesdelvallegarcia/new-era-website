import { useEffect, useMemo, useState } from 'react'

// Private team page (Spanish only, not in the menu, noindex). The password is
// checked by api/licitaciones.js; here it only lives in sessionStorage.
const STORAGE_KEY = 'licitaciones-password'

const RECOMENDACION = {
  conviene: ['Conviene', 'bg-emerald-100 text-emerald-800'],
  revisar: ['Revisar', 'bg-amber-100 text-amber-800'],
  'no conviene': ['No conviene', 'bg-zinc-100 text-zinc-600'],
  vencida: ['Vencida', 'bg-zinc-100 text-zinc-400'],
}

const FILTROS = [
  ['activas', 'Abiertas'],
  ['conviene', 'Conviene'],
  ['revisar', 'Revisar'],
  ['todas', 'Todas'],
]

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', timeZone: 'UTC' })
}

function readStoredPassword() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

function storePassword(value) {
  try {
    if (value) sessionStorage.setItem(STORAGE_KEY, value)
    else sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Private windows can block storage; the page still works for this visit.
  }
}

function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    document.title = 'Licitaciones — New Era'
    return () => meta.remove()
  }, [])
}

function Login({ onSubmit, error, loading }) {
  const [value, setValue] = useState('')
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(value)
      }}
      className="mx-auto max-w-sm rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <h1 className="text-2xl font-black">Licitaciones</h1>
      <p className="mt-2 text-sm text-zinc-600">Solo para el equipo de New Era.</p>
      <label className="mt-6 block text-sm font-bold" htmlFor="licitaciones-password">
        Contraseña
      </label>
      <input
        id="licitaciones-password"
        type="password"
        autoComplete="current-password"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2"
      />
      {error && <p className="mt-3 text-sm font-bold text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={loading || !value}
        className="mt-5 w-full rounded-md bg-orange-600 px-4 py-2 font-black text-white hover:bg-orange-700 disabled:opacity-50"
      >
        {loading ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}

function Bid({ bid }) {
  const [label, tone] = RECOMENDACION[bid.recomendacion] ?? [bid.recomendacion, 'bg-zinc-100 text-zinc-600']
  const dias = bid.dias_para_licitar
  return (
    <details className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm open:shadow-md">
      <summary className="flex cursor-pointer list-none flex-wrap items-start gap-x-4 gap-y-2">
        <span className="min-w-0 flex-1 basis-64">
          <span className="block font-black leading-snug text-zinc-950">{bid.titulo}</span>
          <span className="mt-1 block text-sm text-zinc-600">
            {[bid.ciudad, bid.distancia_mi != null && `${bid.distancia_mi} mi`, bid.contratista_general]
              .filter(Boolean)
              .join(' · ')}
          </span>
        </span>
        <span className="flex flex-wrap items-center gap-2 text-sm">
          <span className={`rounded-full px-2.5 py-0.5 font-bold ${tone}`}>{label}</span>
          <span className="font-bold tabular-nums">{bid.calificacion}/100</span>
        </span>
        <span className="w-full text-sm text-zinc-700 sm:w-auto sm:text-right">
          <span className="font-bold">Licita {formatDate(bid.fecha_licitacion)}</span>
          {dias != null && dias >= 0 && <span className="text-zinc-500"> · faltan {dias} días</span>}
          <span className="block text-zinc-500">{bid.valor ? money.format(bid.valor) : 'Sin monto'}</span>
        </span>
      </summary>

      <div className="mt-4 grid gap-4 border-t border-zinc-100 pt-4 text-sm text-zinc-700 md:grid-cols-2">
        <div className="space-y-1">
          {bid.decision && (
            <p>
              <b>Decisión:</b> {bid.decision}
              {bid.decision_nota && ` — ${bid.decision_nota}`}
            </p>
          )}
          {bid.etapa && <p><b>Etapa:</b> {bid.etapa}</p>}
          {bid.tipos_obra && <p><b>Tipo:</b> {bid.tipos_obra}</p>}
          {bid.licitar_a && <p><b>Se licita a:</b> {bid.licitar_a}</p>}
          {bid.direccion && <p><b>Dirección:</b> {bid.direccion}</p>}
          {bid.fecha_junta_previa && (
            <p>
              <b>Junta previa:</b> {formatDate(bid.fecha_junta_previa)}
              {bid.junta_obligatoria && ' (obligatoria)'}
            </p>
          )}
          {bid.fecha_inicio && <p><b>Inicio:</b> {formatDate(bid.fecha_inicio)}</p>}
          {bid.descripcion && <p className="pt-2 whitespace-pre-line text-zinc-600">{bid.descripcion}</p>}
        </div>
        {bid.contactos.length > 0 && (
          <ul className="space-y-2">
            {bid.contactos.map((c, index) => (
              <li key={index} className="rounded-md bg-zinc-50 p-2">
                <span className="block text-xs font-bold uppercase tracking-wide text-orange-700">{c.rol}</span>
                <span className="block font-bold">{c.empresa}</span>
                {c.nombre && <span className="block">{c.nombre}</span>}
                {c.telefono && <a className="block underline" href={`tel:${c.telefono}`}>{c.telefono}</a>}
                {c.correo && <a className="block underline" href={`mailto:${c.correo}`}>{c.correo}</a>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </details>
  )
}

function Licitaciones() {
  useNoIndex()
  const [password, setPassword] = useState(readStoredPassword)
  const [bids, setBids] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [filtro, setFiltro] = useState('activas')

  async function load(value) {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/licitaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: value }),
      })
      if (response.status === 401) {
        storePassword('')
        setPassword('')
        setError('Contraseña incorrecta.')
        return
      }
      const data = await response.json()
      if (!data.success) throw new Error('bad response')
      storePassword(value)
      setPassword(value)
      setBids(data.bids)
    } catch {
      setError('No se pudieron cargar las licitaciones. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (password) load(password)
    // Only on first visit with a saved password.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const visibles = useMemo(() => {
    if (!bids) return []
    if (filtro === 'todas') return bids
    if (filtro === 'activas') return bids.filter((b) => b.recomendacion !== 'vencida')
    return bids.filter((b) => b.recomendacion === filtro)
  }, [bids, filtro])

  if (!bids) {
    return (
      <section className="px-4 py-24">
        {password && loading ? (
          <p className="text-center text-zinc-600">Cargando…</p>
        ) : (
          <Login onSubmit={load} error={error} loading={loading} />
        )}
      </section>
    )
  }

  const ultima = bids.reduce((max, b) => (b.actualizado_at > max ? b.actualizado_at : max), '')

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-700">ConstructConnect</p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Licitaciones</h1>
            {ultima && <p className="mt-1 text-sm text-zinc-500">Última carga: {formatDate(ultima)}</p>}
          </div>
          <button
            type="button"
            onClick={() => {
              storePassword('')
              setPassword('')
              setBids(null)
            }}
            className="text-sm font-bold text-zinc-500 underline"
          >
            Salir
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {FILTROS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFiltro(key)}
              className={`rounded-full px-4 py-1.5 text-sm font-bold ${
                filtro === key ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-3">
          {visibles.length === 0 && <p className="text-zinc-600">No hay licitaciones en este filtro.</p>}
          {visibles.map((bid) => (
            <Bid key={bid.project_id} bid={bid} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Licitaciones

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { businessInfo } from '../data/businessInfo.js'

// Private schedule for one builder (English only, not in the menu, noindex).
// The token in the URL is checked by api/portal.js.

const TASKS = {
  'Basement Slab Install': 'Basement slab',
  'Garage Slab Install': 'Garage slab',
  'Driveway Install': 'Driveway',
  'Approach Install': 'Approach',
  'Public Sidewalks Install': 'Public sidewalk',
  'Private Sidewalk Install': 'Private sidewalk',
  'Install Front Stoop': 'Front stoop',
  'Concrete Patio - Install': 'Patio',
}

const STATUS = {
  colado: ['Poured', 'bg-emerald-100 text-emerald-800'],
  programado: ['Crew booked', 'bg-orange-100 text-orange-800'],
  por_programar: ['On our calendar', 'bg-zinc-100 text-zinc-700'],
}

const day = (value) => String(value ?? '').slice(0, 10)

function formatDay(value, options = { weekday: 'short', month: 'short', day: 'numeric' }) {
  if (!value) return ''
  return new Date(`${day(value)}T12:00:00`).toLocaleDateString('en-US', options)
}

function todayIso() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' })
}

function addDays(iso, days) {
  const date = new Date(`${iso}T12:00:00`)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])
}

// One card per house and date, with every task we pour there that day.
function groupHouses(rows) {
  const houses = new Map()
  for (const row of rows) {
    const key = `${day(row.fecha_hubbell)}|${row.direccion}`
    const house = houses.get(key) ?? { ...row, fecha: day(row.fecha_hubbell), tareas: [], estados: new Set() }
    house.tareas.push(TASKS[row.tarea] ?? row.tarea)
    house.estados.add(row.estado)
    houses.set(key, house)
  }
  return [...houses.values()].map((house) => ({
    ...house,
    // A house is only "poured" when every task is; "crew booked" if any is.
    estado: house.estados.has('programado')
      ? 'programado'
      : house.estados.has('por_programar')
        ? 'por_programar'
        : 'colado',
  }))
}

function HouseCard({ house }) {
  const [label, tone] = STATUS[house.estado] ?? STATUS.por_programar
  const crewDay = day(house.fecha_new_era)
  return (
    <li className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-black leading-snug text-zinc-950">{house.direccion}</p>
          <p className="text-sm text-zinc-500">
            {[house.desarrollo, house.lote && `Lot ${house.lote}`].filter(Boolean).join(' · ')}
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${tone}`}>{label}</span>
      </div>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {house.tareas.map((task, index) => (
          <li key={index} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-700">
            {task}
          </li>
        ))}
      </ul>
      {(house.fecha_anterior || (crewDay && crewDay !== house.fecha && house.estado !== 'colado')) && (
        <div className="mt-3 space-y-0.5 text-xs text-zinc-500">
          {house.fecha_anterior && <p>Moved from {formatDay(house.fecha_anterior)}</p>}
          {crewDay && crewDay !== house.fecha && house.estado !== 'colado' && (
            <p className="font-bold text-orange-700">Our crew is set for {formatDay(crewDay)}</p>
          )}
        </div>
      )}
    </li>
  )
}

function DayGroup({ date, houses, today }) {
  const label = date === today ? 'Today' : date === addDays(today, 1) ? 'Tomorrow' : formatDay(date)
  return (
    <section>
      <h3 className="sticky top-0 z-10 -mx-4 bg-zinc-50/95 px-4 py-2 text-sm font-black uppercase tracking-[0.14em] text-zinc-500 backdrop-blur">
        {label} <span className="font-bold normal-case tracking-normal text-zinc-400">· {houses.length} {houses.length === 1 ? 'house' : 'houses'}</span>
      </h3>
      <ul className="mt-2 grid gap-3 md:grid-cols-2">
        {houses.map((house) => (
          <HouseCard key={`${house.fecha}${house.direccion}`} house={house} />
        ))}
      </ul>
    </section>
  )
}

function Portal() {
  useNoIndex()
  const { token } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('upcoming')
  const [search, setSearch] = useState('')

  useEffect(() => {
    document.title = 'Concrete schedule — New Era Construction'
    fetch('/api/portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (response) => {
        if (response.status === 401) throw new Error('This link is not valid. Please ask New Era for a new one.')
        const json = await response.json()
        if (!json.success) throw new Error('bad response')
        setData(json)
      })
      .catch((err) =>
        setError(err.message.startsWith('This link') ? err.message : 'We could not load the schedule. Please try again.')
      )
  }, [token])

  const today = todayIso()
  const houses = useMemo(() => (data ? groupHouses(data.rows) : []), [data])

  const view = useMemo(() => {
    const term = search.trim().toLowerCase()
    const match = (h) => !term || `${h.direccion} ${h.desarrollo} ${h.lote}`.toLowerCase().includes(term)
    const list =
      tab === 'upcoming'
        ? houses.filter((h) => h.fecha >= today && h.estado !== 'colado')
        : houses.filter((h) => h.estado === 'colado').reverse()
    return Object.entries(Object.groupBy(list.filter(match), (h) => h.fecha))
  }, [houses, tab, search, today])

  if (error || !data) {
    return (
      <section className="px-4 py-24 text-center">
        <p className={error ? 'font-bold text-red-700' : 'text-zinc-600'}>{error || 'Loading…'}</p>
        {error && (
          <a href={businessInfo.phoneHref} className="mt-4 inline-block font-black underline">
            {businessInfo.phone}
          </a>
        )}
      </section>
    )
  }

  const weekEnd = addDays(today, 7)
  const stats = [
    [houses.filter((h) => h.fecha >= today && h.fecha < weekEnd && h.estado !== 'colado').length, 'houses in the next 7 days'],
    [houses.filter((h) => h.fecha >= today && h.estado !== 'colado').length, 'houses on the schedule'],
    [houses.filter((h) => h.estado === 'colado').length, 'houses poured in the last 30 days'],
  ]
  const updated = data.rows.reduce((max, row) => (row.actualizado_at > max ? row.actualizado_at : max), '')

  return (
    <>
      <section className="bg-zinc-950 px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-300">{data.builder}</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">Your concrete schedule</h1>
          <p className="mt-3 max-w-2xl text-zinc-300">
            Every house from your calendar, with our crew date and what is already poured.
            {updated && ` Updated ${new Date(updated).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}.`}
          </p>
          <dl className="mt-7 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
            {stats.map(([value, label]) => (
              <div key={label} className="flex flex-col-reverse bg-zinc-950 p-4">
                <dt className="mt-1 text-xs leading-5 text-zinc-400">{label}</dt>
                <dd className="text-3xl font-black">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="min-h-[60vh] bg-zinc-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              {[
                ['upcoming', 'Upcoming'],
                ['poured', 'Poured'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={`rounded-full px-5 py-2 text-sm font-black ${
                    tab === key ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-700 ring-1 ring-zinc-200 hover:ring-zinc-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search address or community"
              aria-label="Search address or community"
              className="w-full rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm sm:w-72"
            />
          </div>

          <div className="mt-6 space-y-6">
            {view.length === 0 && <p className="text-zinc-600">No houses here.</p>}
            {view.map(([date, list]) => (
              <DayGroup key={date} date={date} houses={list} today={today} />
            ))}
          </div>

          <p className="mt-10 text-sm text-zinc-500">
            Questions about a house? Call or text {' '}
            <a href={businessInfo.phoneHref} className="font-bold text-zinc-900 underline">
              {businessInfo.phone}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  )
}

export default Portal

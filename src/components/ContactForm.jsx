import { useState } from 'react'
import { businessInfo } from '../data/businessInfo.js'
import { housecallCities } from '../data/housecall.js'
import { services } from '../data/services.js'
import es from '../i18n/es.js'
import { useLanguage } from '../i18n/useLanguage.js'

// The team reads requests in Spanish, whatever language the visitor used.
const team = es.services
const teamForm = es.contact.form

const initialForm = {
  name: '',
  phone: '',
  email: '',
  clientType: '',
  company: '',
  service: '',
  city: '',
  preferredLanguage: '',
  timeline: '',
  message: '',
}

const cityOptions = housecallCities
  .slice(0, 16)
  .map((city) => city.city)
  .sort((a, b) => a.localeCompare(b))

const fieldClass =
  'rounded-xl border border-zinc-300 px-4 py-3 font-normal text-zinc-950 transition focus:border-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100'
const labelClass = 'grid gap-2 text-sm font-bold text-zinc-800'

function ContactForm() {
  const { lang, t } = useLanguage()
  const f = t.contact.form
  const [form, setForm] = useState(initialForm)
  const [botcheck, setBotcheck] = useState(false)
  const [status, setStatus] = useState('idle')

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function teamLabel(group, value) {
    return teamForm[group]?.[value] || value
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (status === 'sending') return
    setStatus('sending')

    try {
      // api/lead.js forwards the request to the team's Telegram chat.
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          botcheck,
          clientType: teamLabel('clientTypes', form.clientType),
          service: form.service === 'other' ? team.other : team.items[form.service]?.title,
          preferredLanguage: teamLabel('languages', form.preferredLanguage || lang),
          timeline: teamLabel('timelines', form.timeline),
        }),
      })
      const result = await response.json().catch(() => ({}))

      if (!response.ok || !result.success) throw new Error(`HTTP ${response.status}`)

      setStatus('sent')
      setForm(initialForm)
    } catch (error) {
      console.error('Contact form failed:', error)
      setStatus('error')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-200/70 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={labelClass}>
          {f.name}
          <input required name="name" value={form.name} onChange={updateField} className={fieldClass} autoComplete="name" />
        </label>
        <label className={labelClass}>
          {f.phone}
          <input required type="tel" name="phone" value={form.phone} onChange={updateField} className={fieldClass} autoComplete="tel" />
        </label>
        <label className={labelClass}>
          {f.email}
          <input type="email" name="email" value={form.email} onChange={updateField} className={fieldClass} autoComplete="email" />
        </label>
        <label className={labelClass}>
          {f.clientType}
          <select required name="clientType" value={form.clientType} onChange={updateField} className={fieldClass}>
            <option value="">{f.select}</option>
            {Object.entries(f.clientTypes).map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          {f.company}
          <input name="company" value={form.company} onChange={updateField} className={fieldClass} autoComplete="organization" />
        </label>
        <label className={labelClass}>
          {f.service}
          <select required name="service" value={form.service} onChange={updateField} className={fieldClass}>
            <option value="">{f.select}</option>
            {services.map((slug) => (
              <option key={slug} value={slug}>
                {t.services.items[slug].title}
              </option>
            ))}
            <option value="other">{t.services.other}</option>
          </select>
        </label>
        <label className={labelClass}>
          {f.city}
          <input
            name="city"
            value={form.city}
            onChange={updateField}
            className={fieldClass}
            list="project-city-options"
            autoComplete="address-level2"
            placeholder={f.cityPlaceholder}
          />
          <datalist id="project-city-options">
            {cityOptions.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
        </label>
        <label className={labelClass}>
          {f.language}
          <select name="preferredLanguage" value={form.preferredLanguage || lang} onChange={updateField} className={fieldClass}>
            {Object.entries(f.languages).map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          {f.timeline}
          <select name="timeline" value={form.timeline} onChange={updateField} className={fieldClass}>
            <option value="">{f.select}</option>
            {Object.entries(f.timelines).map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          {f.message}
          <textarea
            required
            name="message"
            value={form.message}
            onChange={updateField}
            rows="5"
            className={fieldClass}
            placeholder={f.messagePlaceholder}
          />
        </label>
        {/* Honeypot: hidden from people, bots fill it and api/lead.js drops the request. */}
        <input
          type="checkbox"
          name="botcheck"
          checked={botcheck}
          onChange={(event) => setBotcheck(event.target.checked)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-6 w-full rounded-xl bg-orange-600 px-6 py-4 font-black text-white transition hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-200 focus-visible:bg-orange-700 disabled:opacity-60 sm:w-auto"
      >
        {status === 'sending' ? f.sending : f.submit}
      </button>
      <div aria-live="polite">
        {status === 'sent' && (
          <p className="mt-5 rounded border border-green-200 bg-green-50 px-4 py-3 font-semibold text-green-800">
            {f.sent}
          </p>
        )}
        {status === 'error' && (
          <p className="mt-5 rounded border border-orange-200 bg-orange-50 px-4 py-3 font-semibold text-orange-900">
            {f.error}{' '}
            <a href={businessInfo.phoneHref} className="font-black underline">
              {businessInfo.phone}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  )
}

export default ContactForm

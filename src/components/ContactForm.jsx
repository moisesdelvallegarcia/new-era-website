import { useState } from 'react'
import housecallPublicData from '../data/housecallPublicData.json'
import { services } from '../data/services.js'

const initialForm = {
  name: '',
  phone: '',
  email: '',
  service: '',
  city: '',
  preferredLanguage: '',
  timeline: '',
  message: '',
}

const cityOptions = Array.from(
  new Set(
    (housecallPublicData.cityStats || [])
      .map((city) => city.city)
      .filter(Boolean)
      .map((city) => (city.toLowerCase() === 'cuming' ? 'Cumming' : city))
  )
)
  .slice(0, 12)
  .sort((a, b) => a.localeCompare(b))

function ContactForm() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    console.log('New Era contact form payload:', form)
    setSubmitted(true)
    setForm(initialForm)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-200/70 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-zinc-800">
          Name
          <input
            required
            name="name"
            value={form.name}
            onChange={updateField}
            className="rounded-xl border border-zinc-300 px-4 py-3 font-normal text-zinc-950 transition focus:border-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100"
            autoComplete="name"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-zinc-800">
          Phone
          <input
            required
            name="phone"
            value={form.phone}
            onChange={updateField}
            className="rounded-xl border border-zinc-300 px-4 py-3 font-normal text-zinc-950 transition focus:border-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100"
            autoComplete="tel"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-zinc-800">
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            className="rounded-xl border border-zinc-300 px-4 py-3 font-normal text-zinc-950 transition focus:border-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100"
            autoComplete="email"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-zinc-800">
          Service
          <select
            required
            name="service"
            value={form.service}
            onChange={updateField}
            className="rounded-xl border border-zinc-300 px-4 py-3 font-normal text-zinc-950 transition focus:border-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100"
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.slug} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-zinc-800">
          Project city
          <input
            name="city"
            value={form.city}
            onChange={updateField}
            className="rounded-xl border border-zinc-300 px-4 py-3 font-normal text-zinc-950 transition focus:border-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100"
            list="project-city-options"
            autoComplete="address-level2"
            placeholder="Des Moines, Waukee, Ankeny..."
          />
          <datalist id="project-city-options">
            {cityOptions.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
        </label>
        <label className="grid gap-2 text-sm font-bold text-zinc-800">
          Preferred language
          <select
            required
            name="preferredLanguage"
            value={form.preferredLanguage}
            onChange={updateField}
            className="rounded-xl border border-zinc-300 px-4 py-3 font-normal text-zinc-950 transition focus:border-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100"
          >
            <option value="">Select one</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="No preference">No preference</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-zinc-800 sm:col-span-2">
          Timeline
          <select
            name="timeline"
            value={form.timeline}
            onChange={updateField}
            className="rounded-xl border border-zinc-300 px-4 py-3 font-normal text-zinc-950 transition focus:border-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100"
          >
            <option value="">Select a rough timeline</option>
            <option value="ASAP">ASAP</option>
            <option value="Next 30 days">Next 30 days</option>
            <option value="1-3 months">1-3 months</option>
            <option value="Planning ahead">Planning ahead</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-zinc-800 sm:col-span-2">
          Message
          <textarea
            required
            name="message"
            value={form.message}
            onChange={updateField}
            rows="5"
            className="rounded-xl border border-zinc-300 px-4 py-3 font-normal text-zinc-950 transition focus:border-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100"
            placeholder="Tell us about the concrete work, approximate size, access, or any photos you can share later."
          />
        </label>
      </div>
      <button
        type="submit"
        className="mt-6 w-full rounded-xl bg-orange-600 px-6 py-4 font-black text-white transition hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-200 focus-visible:bg-orange-700 sm:w-auto"
      >
        Send Request
      </button>
      {submitted && (
        <p className="mt-5 rounded border border-green-200 bg-green-50 px-4 py-3 font-semibold text-green-800">
          Thanks for reaching out. Our team will contact you soon.
        </p>
      )}
    </form>
  )
}

export default ContactForm

import { useState } from 'react'
import { services } from '../data/services.js'

const initialForm = {
  name: '',
  phone: '',
  email: '',
  service: '',
  message: '',
}

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
    <form onSubmit={handleSubmit} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-zinc-800">
          Name
          <input
            required
            name="name"
            value={form.name}
            onChange={updateField}
            className="rounded border border-zinc-300 px-4 py-3 font-normal text-zinc-950 transition focus:border-orange-600"
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
            className="rounded border border-zinc-300 px-4 py-3 font-normal text-zinc-950 transition focus:border-orange-600"
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
            className="rounded border border-zinc-300 px-4 py-3 font-normal text-zinc-950 transition focus:border-orange-600"
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
            className="rounded border border-zinc-300 px-4 py-3 font-normal text-zinc-950 transition focus:border-orange-600"
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.slug} value={service.title}>
                {service.title}
              </option>
            ))}
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
            className="rounded border border-zinc-300 px-4 py-3 font-normal text-zinc-950 transition focus:border-orange-600"
          />
        </label>
      </div>
      <button
        type="submit"
        className="mt-6 w-full rounded bg-orange-600 px-6 py-4 font-black text-white transition hover:bg-orange-700 focus-visible:bg-orange-700 sm:w-auto"
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

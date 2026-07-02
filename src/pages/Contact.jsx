import ContactForm from '../components/ContactForm.jsx'
import Section from '../components/Section.jsx'
import { businessInfo } from '../data/businessInfo.js'

function Contact() {
  return (
    <Section
      eyebrow="Contact"
      title="Request a free estimate"
      description="Send your project details and the New Era Construction team will follow up soon."
    >
      <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="rounded-lg bg-zinc-950 p-6 text-white">
          <h2 className="text-2xl font-black">Talk with the team</h2>
          <p className="mt-4 leading-7 text-zinc-300">
            Share the service, location, and rough timeline. Photos and measurements can be added later when the project moves forward.
          </p>
          <dl className="mt-6 grid gap-4">
            <div>
              <dt className="text-sm font-bold uppercase tracking-[0.16em] text-orange-300">Phone</dt>
              <dd className="mt-1">
                <a href={businessInfo.phoneHref} className="text-lg font-black hover:text-orange-300">
                  {businessInfo.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-bold uppercase tracking-[0.16em] text-orange-300">Area</dt>
              <dd className="mt-1 text-zinc-300">{businessInfo.location}</dd>
            </div>
          </dl>
        </aside>
        <ContactForm />
      </div>
    </Section>
  )
}

export default Contact

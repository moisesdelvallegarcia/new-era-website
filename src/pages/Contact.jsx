import ContactForm from '../components/ContactForm.jsx'
import Section from '../components/Section.jsx'
import { businessInfo, formatAddress } from '../data/businessInfo.js'
import { useLanguage } from '../i18n/useLanguage.js'

function Contact() {
  const { t } = useLanguage()

  return (
    <Section eyebrow={t.contact.eyebrow} title={t.contact.title} description={t.contact.description}>
      <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="rounded-lg bg-zinc-950 p-6 text-white">
          <h2 className="text-2xl font-black">{t.contact.asideTitle}</h2>
          <p className="mt-4 leading-7 text-zinc-300">{t.contact.asideText}</p>
          <p className="mt-3 font-bold leading-7 text-white">{t.contact.response}</p>
          <dl className="mt-6 grid gap-4">
            <div>
              <dt className="text-sm font-bold uppercase tracking-[0.16em] text-orange-300">{t.contact.phone}</dt>
              <dd className="mt-1">
                <a href={businessInfo.phoneHref} className="text-lg font-black hover:text-orange-300">
                  {businessInfo.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-bold uppercase tracking-[0.16em] text-orange-300">{t.contact.email}</dt>
              <dd className="mt-1">
                <a href={businessInfo.emailHref} className="font-black hover:text-orange-300">
                  {businessInfo.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-bold uppercase tracking-[0.16em] text-orange-300">{t.contact.owner}</dt>
              <dd className="mt-1 text-zinc-300">{businessInfo.owner}</dd>
            </div>
            <div>
              <dt className="text-sm font-bold uppercase tracking-[0.16em] text-orange-300">{t.contact.office}</dt>
              <dd className="mt-1 text-zinc-300">{formatAddress(businessInfo.address)}</dd>
            </div>
          </dl>
          <p className="mt-6 text-sm font-bold text-orange-300">{t.nav.spanish}</p>
        </aside>
        <ContactForm />
      </div>
    </Section>
  )
}

export default Contact

import { useLanguage } from '../i18n/useLanguage.js'
import Section from './Section.jsx'

function BuilderBenefits() {
  const { t } = useLanguage()

  return (
    <Section eyebrow={t.benefits.eyebrow} title={t.benefits.title}>
      <div className="grid gap-5 md:grid-cols-3">
        {t.benefits.items.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-zinc-200 border-t-4 border-t-orange-600 bg-white p-6 shadow-sm shadow-zinc-200/70"
          >
            <h3 className="text-xl font-black tracking-tight text-zinc-950">{item.title}</h3>
            <p className="mt-3 leading-7 text-zinc-600">{item.text}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}

export default BuilderBenefits

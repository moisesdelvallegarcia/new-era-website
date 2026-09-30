import { useLanguage } from '../i18n/useLanguage.js'
import Section from './Section.jsx'

function ProcessSteps() {
  const { t } = useLanguage()

  return (
    <Section className="bg-zinc-100" eyebrow={t.process.eyebrow} title={t.process.title}>
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
        {t.process.steps.map((step, index) => (
          <li key={step.title} className="border-t-4 border-orange-600 pt-4">
            <p className="text-3xl font-black tracking-tight text-orange-700">
              {String(index + 1).padStart(2, '0')}
            </p>
            <h3 className="mt-2 text-lg font-black uppercase tracking-tight text-zinc-950">
              {step.title}
            </h3>
            <p className="mt-1 text-sm leading-6 text-zinc-600">{step.text}</p>
          </li>
        ))}
      </ol>
      <p className="mt-10 rounded-2xl bg-zinc-950 px-6 py-5 leading-7 text-zinc-200">
        {t.process.note}
      </p>
    </Section>
  )
}

export default ProcessSteps

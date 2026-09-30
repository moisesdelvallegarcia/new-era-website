import { businessInfo } from '../data/businessInfo.js'
import { useLanguage } from '../i18n/useLanguage.js'
import Section from './Section.jsx'

function BuildersList() {
  const { t } = useLanguage()

  if (!businessInfo.showBuilderNames) return null

  return (
    <Section eyebrow={t.builders.eyebrow} title={t.builders.title}>
      <ul className="flex flex-wrap gap-3">
        {businessInfo.builders.map((builder) => (
          <li
            key={builder}
            className="rounded-full border border-zinc-200 bg-zinc-50 px-5 py-3 font-black text-zinc-800"
          >
            {builder}
          </li>
        ))}
        <li className="px-2 py-3 font-bold text-zinc-500">{t.builders.more}</li>
      </ul>
    </Section>
  )
}

export default BuildersList

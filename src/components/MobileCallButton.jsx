import { businessInfo } from '../data/businessInfo.js'
import { useLanguage } from '../i18n/useLanguage.js'

function MobileCallButton() {
  const { t } = useLanguage()

  return (
    <a
      href={businessInfo.phoneHref}
      className="fixed bottom-4 left-4 right-4 z-50 rounded bg-zinc-950 px-5 py-4 text-center text-base font-black text-white shadow-2xl transition hover:bg-orange-700 focus-visible:bg-orange-700 sm:hidden"
    >
      {t.mobileCall}: {businessInfo.phone}
    </a>
  )
}

export default MobileCallButton

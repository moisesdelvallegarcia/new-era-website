import { businessInfo } from '../data/businessInfo.js'

function MobileCallButton() {
  return (
    <a
      href={businessInfo.phoneHref}
      className="fixed bottom-4 left-4 right-4 z-50 rounded bg-zinc-950 px-5 py-4 text-center text-base font-black text-white shadow-2xl transition hover:bg-orange-700 focus-visible:bg-orange-700 sm:hidden"
    >
      Call Now: {businessInfo.phone}
    </a>
  )
}

export default MobileCallButton

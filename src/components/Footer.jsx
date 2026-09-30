import { Link } from 'react-router-dom'
import { businessInfo } from '../data/businessInfo.js'
import { useLanguage } from '../i18n/useLanguage.js'

const links = [
  ['services', '/services'],
  ['gallery', '/gallery'],
  ['about', '/about'],
  ['contact', '/contact'],
]

function Footer() {
  const { t, to } = useLanguage()
  const { address } = businessInfo

  return (
    <footer className="bg-zinc-950 px-4 pb-24 pt-12 text-white sm:px-6 sm:pb-12 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.2fr_0.8fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={businessInfo.logo}
              alt="New Era Construction logo"
              className="h-14 w-14 rounded bg-white object-contain"
            />
            <h2 className="text-2xl font-black">New Era Construction</h2>
          </div>
          <p className="mt-3 max-w-md leading-7 text-zinc-400">{t.footer.about}</p>
          <p className="mt-3 text-sm font-bold text-orange-300">{t.nav.spanish}</p>
        </div>
        <div>
          <h3 className="font-black">{t.footer.navigation}</h3>
          <ul className="mt-4 grid gap-2">
            {links.map(([key, href]) => (
              <li key={href}>
                <Link className="text-zinc-400 transition hover:text-orange-300" to={to(href)}>
                  {t.nav[key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-black">{t.footer.contact}</h3>
          <address className="mt-4 not-italic leading-7 text-zinc-400">
            {businessInfo.owner}, {t.footer.owner}
            <br />
            <a className="font-bold text-white transition hover:text-orange-300" href={businessInfo.phoneHref}>
              {businessInfo.phone}
            </a>
            <br />
            {address.street}
            <br />
            {address.city}, {address.state} {address.zip}
          </address>
          <p className="mt-4 text-sm text-zinc-500">
            © {new Date().getFullYear()} New Era Construction. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

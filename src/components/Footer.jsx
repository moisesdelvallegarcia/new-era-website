import { Link } from 'react-router-dom'
import { businessInfo } from '../data/businessInfo.js'

const links = [
  ['Services', '/services'],
  ['Gallery', '/gallery'],
  ['Reviews', '/reviews'],
  ['About', '/about'],
  ['Contact', '/contact'],
]

function Footer() {
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
          <p className="mt-3 max-w-md leading-7 text-zinc-400">
            Concrete construction services for homes and businesses throughout the Greater Des Moines Metro Area.
          </p>
        </div>
        <div>
          <h3 className="font-black">Navigation</h3>
          <ul className="mt-4 grid gap-2">
            {links.map(([label, href]) => (
              <li key={href}>
                <Link className="text-zinc-400 transition hover:text-orange-300" to={href}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-black">Contact</h3>
          <address className="mt-4 not-italic leading-7 text-zinc-400">
            {businessInfo.location}
            <br />
            <a className="transition hover:text-orange-300" href={businessInfo.phoneHref}>
              {businessInfo.phone}
            </a>
          </address>
          <p className="mt-4 text-sm text-zinc-500">
            © {new Date().getFullYear()} New Era Construction. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

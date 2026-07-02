import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { businessInfo } from '../data/businessInfo.js'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

function navClass({ isActive }) {
  return `rounded px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? 'bg-orange-600 text-white'
      : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 focus-visible:bg-zinc-100'
  }`
}

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src={businessInfo.logo}
            alt="New Era Construction logo"
            className="h-12 w-12 rounded bg-white object-contain ring-1 ring-zinc-200"
          />
          <span>
            <span className="block text-base font-black leading-tight text-zinc-950">
              New Era Construction
            </span>
            <span className="block text-xs font-semibold text-zinc-500">
              Concrete Contractors
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.href} to={item.href} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={businessInfo.phoneHref}
            className="rounded border border-zinc-300 px-4 py-2 text-sm font-bold text-zinc-900 transition hover:border-orange-600 hover:text-orange-700 focus-visible:border-orange-600"
          >
            {businessInfo.phone}
          </a>
          <Link
            to="/contact"
            className="rounded bg-orange-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-700 focus-visible:bg-orange-700"
          >
            Free Estimate
          </Link>
        </div>

        <button
          type="button"
          className="rounded border border-zinc-300 px-3 py-2 text-sm font-bold text-zinc-900 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          Menu
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-zinc-200 bg-white px-4 py-4 lg:hidden">
          <div className="mx-auto grid max-w-6xl gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={navClass}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <a
              href={businessInfo.phoneHref}
              className="mt-2 rounded bg-zinc-950 px-4 py-3 text-center text-sm font-bold text-white"
            >
              Call {businessInfo.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar

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
  return `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? 'bg-zinc-950 text-white shadow-sm'
      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 focus-visible:bg-zinc-100'
  }`
}

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-[3.25rem] w-[3.25rem] place-items-center rounded-full bg-zinc-100/70 p-1.5 ring-1 ring-zinc-200/70">
            <img
              src={businessInfo.logo}
              alt="New Era Construction logo"
              className="h-full w-full rounded-full object-contain opacity-85 mix-blend-multiply"
            />
          </span>
          <span>
            <span className="block text-base font-black leading-tight tracking-tight text-zinc-950">
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
          <span className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-black text-orange-800">
            Se Habla Español
          </span>
          <a
            href={businessInfo.phoneHref}
            className="rounded-full border border-zinc-200 bg-white/70 px-5 py-2.5 text-sm font-bold text-zinc-900 transition hover:border-zinc-400 hover:bg-white focus-visible:border-zinc-400"
          >
            {businessInfo.phone}
          </a>
          <Link
            to="/contact"
            className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600 focus-visible:bg-orange-600"
          >
            Free Estimate
          </Link>
        </div>

        <button
          type="button"
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-bold text-zinc-900 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          Menu
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-zinc-200 bg-white/95 px-4 py-4 backdrop-blur lg:hidden">
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
              className="mt-2 rounded-full bg-zinc-950 px-4 py-3 text-center text-sm font-bold text-white"
            >
              Call {businessInfo.phone}
            </a>
            <span className="rounded-full border border-orange-200 bg-orange-50 px-4 py-3 text-center text-sm font-black text-orange-800">
              Se Habla Español
            </span>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar

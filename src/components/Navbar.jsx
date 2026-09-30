import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { businessInfo } from '../data/businessInfo.js'
import { useLanguage } from '../i18n/useLanguage.js'

const navItems = [
  ['home', '/'],
  ['services', '/services'],
  ['gallery', '/gallery'],
  ['about', '/about'],
  ['contact', '/contact'],
]

function navClass({ isActive }) {
  return `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? 'bg-zinc-950 text-white shadow-sm'
      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 focus-visible:bg-zinc-100'
  }`
}

function LanguageSwitch({ onClick, className = '' }) {
  const { lang, t, otherLangPath } = useLanguage()

  return (
    <Link
      to={otherLangPath}
      hrefLang={lang === 'es' ? 'en' : 'es'}
      aria-label={t.nav.switchLabel}
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-black text-orange-800 transition hover:border-orange-400 focus-visible:border-orange-400 ${className}`}
    >
      {t.nav.switchTo}
    </Link>
  )
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const { t, to } = useLanguage()
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link to={to('/')} className="flex items-center gap-3" onClick={close}>
          <span className="grid h-[3.25rem] w-[3.25rem] shrink-0 place-items-center rounded-full bg-zinc-100/70 p-1.5 ring-1 ring-zinc-200/70">
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
            <span className="block text-xs font-semibold text-zinc-500">{t.nav.tagline}</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map(([key, href]) => (
            <NavLink key={href} to={to(href)} end className={navClass}>
              {t.nav[key]}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitch />
          <a
            href={businessInfo.phoneHref}
            className="hidden whitespace-nowrap rounded-full border border-zinc-200 bg-white/70 px-5 py-2.5 text-sm font-bold xl:inline-flex text-zinc-900 transition hover:border-zinc-400 hover:bg-white focus-visible:border-zinc-400"
          >
            {businessInfo.phone}
          </a>
          <Link
            to={to('/contact')}
            className="whitespace-nowrap rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600 focus-visible:bg-orange-600"
          >
            {t.nav.estimate}
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitch onClick={close} className="px-3" />
          <button
            type="button"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-bold text-zinc-900"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {t.nav.menu}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-zinc-200 bg-white/95 px-4 py-4 backdrop-blur lg:hidden">
          <div className="mx-auto grid max-w-6xl gap-2">
            {navItems.map(([key, href]) => (
              <NavLink key={href} to={to(href)} end className={navClass} onClick={close}>
                {t.nav[key]}
              </NavLink>
            ))}
            <a
              href={businessInfo.phoneHref}
              className="mt-2 rounded-full bg-zinc-950 px-4 py-3 text-center text-sm font-bold text-white"
            >
              {businessInfo.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar

import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import MobileCallButton from './components/MobileCallButton.jsx'
import Navbar from './components/Navbar.jsx'
import { businessInfo } from './data/businessInfo.js'
import { localizePath, splitPath, useLanguage } from './i18n/useLanguage.js'
import { areaMeta, findArea } from './data/areas.js'
import About from './pages/About.jsx'
import Area from './pages/Area.jsx'
import Builders from './pages/Builders.jsx'
import Card from './pages/Card.jsx'
import Contact from './pages/Contact.jsx'
import Gallery from './pages/Gallery.jsx'
import Home from './pages/Home.jsx'
import Licitaciones from './pages/Licitaciones.jsx'
import Portal from './pages/Portal.jsx'
import Services from './pages/Services.jsx'

const pages = [
  ['/', Home],
  ['/services', Services],
  ['/gallery', Gallery],
  ['/about', About],
  ['/builders', Builders],
  ['/contact', Contact],
]

// Canonical and hreflang always point at the public domain, so Vercel preview
// URLs never compete with it in search results.
function setHeadLink(rel, href, hreflang) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`
  let link = document.head.querySelector(selector)
  if (!link) {
    link = document.createElement('link')
    link.rel = rel
    if (hreflang) link.hreflang = hreflang
    document.head.appendChild(link)
  }
  link.href = new URL(href, businessInfo.siteUrl).href
}

function DocumentHead() {
  const { pathname } = useLocation()
  const { lang, t } = useLanguage()

  useEffect(() => {
    const { basePath } = splitPath(pathname)
    const area = basePath.startsWith('/areas/') && findArea(basePath.slice('/areas/'.length))
    const meta = area ? areaMeta(t, area.city) : (t.meta.pages[basePath] ?? t.meta)
    document.documentElement.lang = lang
    document.title = meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
    setHeadLink('canonical', pathname)
    setHeadLink('alternate', localizePath(basePath, 'en'), 'en')
    setHeadLink('alternate', localizePath(basePath, 'es'), 'es')
    window.scrollTo(0, 0)
  }, [pathname, lang, t])

  return null
}

function App() {
  // Business cards are opened on a phone from a QR or a link: no menu, footer or call bar.
  const isCard = useLocation().pathname.startsWith('/card/')

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <DocumentHead />
      {!isCard && <Navbar />}
      <main>
        <Routes>
          {['en', 'es'].flatMap((lang) =>
            pages.map(([path, Page]) => (
              <Route key={`${lang}${path}`} path={localizePath(path, lang)} element={<Page />} />
            ))
          )}
          {['en', 'es'].map((lang) => (
            <Route key={`${lang}-area`} path={localizePath('/areas/:slug', lang)} element={<Area />} />
          ))}
          <Route path="/licitaciones" element={<Licitaciones />} />
          <Route path="/portal/:token" element={<Portal />} />
          <Route path="/card/:slug" element={<Card />} />
          <Route path="/es/*" element={<Navigate to="/es" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isCard && <Footer />}
      {!isCard && <MobileCallButton />}
    </div>
  )
}

export default App

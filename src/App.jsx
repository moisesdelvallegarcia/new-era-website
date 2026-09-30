import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import MobileCallButton from './components/MobileCallButton.jsx'
import Navbar from './components/Navbar.jsx'
import { localizePath, splitPath, useLanguage } from './i18n/useLanguage.js'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Gallery from './pages/Gallery.jsx'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'

const pages = [
  ['/', Home],
  ['/services', Services],
  ['/gallery', Gallery],
  ['/about', About],
  ['/contact', Contact],
]

function setAlternateLink(hreflang, href) {
  let link = document.head.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`)
  if (!link) {
    link = document.createElement('link')
    link.rel = 'alternate'
    link.hreflang = hreflang
    document.head.appendChild(link)
  }
  link.href = new URL(href, window.location.origin).href
}

function DocumentHead() {
  const { pathname } = useLocation()
  const { lang, t } = useLanguage()

  useEffect(() => {
    const { basePath } = splitPath(pathname)
    document.documentElement.lang = lang
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
    setAlternateLink('en', localizePath(basePath, 'en'))
    setAlternateLink('es', localizePath(basePath, 'es'))
    window.scrollTo(0, 0)
  }, [pathname, lang, t])

  return null
}

function App() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <DocumentHead />
      <Navbar />
      <main>
        <Routes>
          {['en', 'es'].flatMap((lang) =>
            pages.map(([path, Page]) => (
              <Route key={`${lang}${path}`} path={localizePath(path, lang)} element={<Page />} />
            ))
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <MobileCallButton />
    </div>
  )
}

export default App

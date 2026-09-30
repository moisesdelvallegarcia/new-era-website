import { useLocation } from 'react-router-dom'
import en from './en.js'
import es from './es.js'

const dictionaries = { en, es }

// English lives at the root, Spanish under /es (e.g. /services ↔ /es/services).
export function splitPath(pathname) {
  if (pathname === '/es' || pathname.startsWith('/es/')) {
    return { lang: 'es', basePath: pathname.slice(3) || '/' }
  }
  return { lang: 'en', basePath: pathname }
}

export function localizePath(path, lang) {
  if (lang !== 'es') return path
  return path === '/' ? '/es' : `/es${path}`
}

export function useLanguage() {
  const { pathname } = useLocation()
  const { lang, basePath } = splitPath(pathname)
  const otherLang = lang === 'es' ? 'en' : 'es'

  return {
    lang,
    t: dictionaries[lang],
    to: (path) => localizePath(path, lang),
    otherLangPath: localizePath(basePath, otherLang),
  }
}

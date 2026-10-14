// After `vite build`: writes one HTML file per page and language with its own
// title, description, lang and share tags, so WhatsApp, Facebook and Google see
// the right text without running JavaScript. The app itself is unchanged.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { businessInfo } from '../src/data/businessInfo.js'
import en from '../src/i18n/en.js'
import es from '../src/i18n/es.js'
import { localizePath } from '../src/i18n/useLanguage.js'

const dictionaries = { en, es }
const pages = ['/', '/services', '/gallery', '/about', '/builders', '/contact']
const template = readFileSync('dist/index.html', 'utf8')

const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
const url = (path) => new URL(path, businessInfo.siteUrl).href

function render(page, lang) {
  const t = dictionaries[lang]
  const meta = t.meta.pages[page] ?? t.meta
  const path = localizePath(page, lang)
  const title = escape(meta.title)
  const description = escape(meta.description)
  const alternates = ['en', 'es']
    .map((l) => `<link rel="alternate" hreflang="${l}" href="${url(localizePath(page, l))}" />`)
    .join('\n    ')

  return template
    .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url(path)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url(path)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${description}$2`)
    .replace('</head>', `  <meta property="og:locale" content="${lang === 'es' ? 'es_US' : 'en_US'}" />\n    ${alternates}\n  </head>`)
}

for (const lang of ['en', 'es']) {
  for (const page of pages) {
    const path = localizePath(page, lang)
    const dir = `dist${path === '/' ? '' : path}`
    mkdirSync(dir, { recursive: true })
    writeFileSync(`${dir}/index.html`, render(page, lang))
  }
}
console.log('page-heads: 12 pages written')

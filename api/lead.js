// Vercel function: receives the contact form and posts it to Telegram.
// Env (Vercel → Settings → Environment Variables):
//   TELEGRAM_BOT_TOKEN      the NOVA bot token
//   TELEGRAM_LEADS_CHAT_ID  chat that receives website requests

const FIELDS = [
  ['name', 'Nombre'],
  ['phone', 'Teléfono'],
  ['email', 'Correo'],
  ['clientType', 'Cliente'],
  ['company', 'Empresa'],
  ['service', 'Trabajo'],
  ['city', 'Ciudad'],
  ['preferredLanguage', 'Idioma'],
  ['timeline', 'Para cuándo'],
]

const MAX_LENGTH = 2000

// Spam is only labeled, never dropped, so a real customer is never lost.
// Phrases seen in sales pitches and "send me your email for the plans" scams.
const SPAM_PHRASES = [
  'seo',
  'traffic',
  'google ranking',
  'first page of google',
  'web design',
  'website design',
  'marketing',
  'leads for your',
  'best email',
  'email address to send',
  'send you the',
  'send over the',
  'plans and documents',
  'documents for review',
  'recommended your company',
  'recommended you',
  'my friend recommended',
]

// Towns we work in or near (Housecall + service area). A city outside this list
// that doesn't mention Iowa is a strong hint the lead is not local.
const LOCAL_CITIES = [
  'adel', 'altoona', 'ames', 'ankeny', 'bondurant', 'boone', 'carlisle', 'clive', 'cumming',
  'dallas center', 'des moines', 'granger', 'grimes', 'indianola', 'johnston', 'manson',
  'mitchellville', 'norwalk', 'pleasant hill', 'polk city', 'urbandale', 'van meter',
  'waukee', 'wdm', 'west des moines', 'windsor heights',
]

function spamReasons(data, message) {
  const text = ` ${message} ${data.company} `.toLowerCase()
  const reasons = SPAM_PHRASES.filter((phrase) => new RegExp(`\\b${phrase}\\b`).test(text))
  const city = data.city.toLowerCase()
  if (city && !/\b(iowa|ia)\b/.test(city) && !LOCAL_CITIES.some((name) => city.includes(name))) {
    reasons.push(`ciudad fuera de Iowa (${data.city})`)
  }
  return reasons
}

function clean(value) {
  return String(value ?? '').trim().slice(0, MAX_LENGTH)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false })
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_LEADS_CHAT_ID
  if (!token || !chatId) {
    console.error('lead: TELEGRAM_BOT_TOKEN or TELEGRAM_LEADS_CHAT_ID is not set')
    return res.status(503).json({ success: false })
  }

  const body = typeof req.body === 'object' && req.body ? req.body : {}

  // Honeypot: people never see this field; answer "ok" so bots don't retry.
  if (body.botcheck) return res.status(200).json({ success: true })

  const data = Object.fromEntries(FIELDS.map(([key]) => [key, clean(body[key])]))
  const message = clean(body.message)
  if (!data.name || !data.phone || !message) {
    return res.status(400).json({ success: false })
  }

  const reasons = spamReasons(data, message)
  const lines = [
    reasons.length ? '⚪ PROBABLE SPAM DESDE LA PÁGINA WEB' : '🟠 NUEVO CLIENTE DESDE LA PÁGINA WEB',
    ...(reasons.length ? [`Por: ${reasons.join(', ')}`] : []),
    '',
    ...FIELDS.filter(([key]) => data[key]).map(([key, label]) => `${label}: ${data[key]}`),
    '',
    message,
  ]

  // Plain text (no parse_mode) so nothing the visitor types is read as formatting.
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: lines.join('\n').slice(0, 4000) }),
  }).catch((error) => {
    console.error('lead: Telegram request failed', error)
    return null
  })

  if (!response?.ok) {
    console.error('lead: Telegram answered', response?.status, await response?.text())
    return res.status(502).json({ success: false })
  }

  return res.status(200).json({ success: true })
}

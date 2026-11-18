// Límite de intentos en memoria, para las funciones de Vercel.
//
// Auditoría 17-nov: /api/licitaciones aceptaba claves sin límite y /api/lead
// dejaba mandar avisos al chat de Telegram sin tope. Esto no es perfecto: cada
// instancia de Vercel tiene su propia memoria y se reinicia sola. Pero mientras
// una instancia está caliente frena a quien prueba claves o llena el chat en
// ráfaga, que es el ataque barato. Si un día hace falta un tope exacto, va en
// el Firewall de Vercel o en la base.
//
// La IP sale de x-real-ip, que pone Vercel y el visitante no puede inventar. Aun
// así hay un tope global por si alguien rota IPs.
//
// Archivo con guion bajo: Vercel no lo publica como ruta.

export function crearLimite({ porIp, global, ventanaMs }) {
  const cuentas = new Map() // ip -> { n, desde }
  const todos = { n: 0, desde: Date.now() }

  function vigente(registro) {
    return Date.now() - registro.desde <= ventanaMs
  }

  return {
    bloqueada(ip) {
      if (!vigente(todos)) Object.assign(todos, { n: 0, desde: Date.now() })
      if (todos.n >= global) return true
      const registro = cuentas.get(ip)
      if (!registro) return false
      if (!vigente(registro)) {
        cuentas.delete(ip)
        return false
      }
      return registro.n >= porIp
    },
    anotar(ip) {
      todos.n++
      const registro = cuentas.get(ip)
      if (!registro || !vigente(registro)) cuentas.set(ip, { n: 1, desde: Date.now() })
      else registro.n++
      if (cuentas.size > 5000) cuentas.clear() // tope de memoria
    },
    olvidar(ip) {
      cuentas.delete(ip)
    },
  }
}

export function ipDe(req) {
  return (
    String(req.headers['x-real-ip'] || '').trim() ||
    String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'desconocida'
  )
}

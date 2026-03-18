import { dbInsert } from './db.js'

export function logEvent(eventType, params = null) {
  const raw = localStorage.getItem('shk_auth')
  const email = raw ? JSON.parse(raw).email : 'anonymous'
  dbInsert('events', { user_email: email, event_type: eventType, params: params ?? null })
}

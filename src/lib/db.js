const BASE = import.meta.env.VITE_API_URL + '/rest/v1'
const TOKEN = import.meta.env.VITE_API_TOKEN

function headers() {
  return {
    'apikey': TOKEN,
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  }
}

export async function dbSelect(table, { select, eq, gte, lte, ilike, order, limit, offset } = {}) {
  const url = new URL(`${BASE}/${table}`)
  if (select) url.searchParams.set('select', select)
  if (eq) {
    for (const [k, v] of Object.entries(eq)) url.searchParams.set(k, `eq.${v}`)
  }
  if (gte) {
    for (const [k, v] of Object.entries(gte)) url.searchParams.set(k, `gte.${v}`)
  }
  if (lte) {
    for (const [k, v] of Object.entries(lte)) url.searchParams.set(k, `lte.${v}`)
  }
  if (ilike) {
    for (const [k, v] of Object.entries(ilike)) url.searchParams.set(k, `ilike.*${v}*`)
  }
  if (order) url.searchParams.set('order', order)
  if (limit !== undefined) url.searchParams.set('limit', limit)
  if (offset !== undefined) url.searchParams.set('offset', offset)

  const res = await fetch(url.toString(), { headers: headers() })
  return res.ok ? res.json() : []
}

export async function dbCount(table, { eq, gte, lte, ilike } = {}) {
  const url = new URL(`${BASE}/${table}`)
  url.searchParams.set('select', 'id')
  if (eq) {
    for (const [k, v] of Object.entries(eq)) url.searchParams.set(k, `eq.${v}`)
  }
  if (gte) {
    for (const [k, v] of Object.entries(gte)) url.searchParams.set(k, `gte.${v}`)
  }
  if (lte) {
    for (const [k, v] of Object.entries(lte)) url.searchParams.set(k, `lte.${v}`)
  }
  if (ilike) {
    for (const [k, v] of Object.entries(ilike)) url.searchParams.set(k, `ilike.*${v}*`)
  }
  url.searchParams.set('limit', '1')
  const res = await fetch(url.toString(), {
    headers: { ...headers(), 'Prefer': 'count=exact' }
  })
  if (!res.ok) return 0
  const range = res.headers.get('Content-Range')
  if (range) {
    const total = range.split('/')[1]
    return total === '*' ? 0 : parseInt(total, 10)
  }
  return 0
}

export async function dbInsert(table, data) {
  await fetch(`${BASE}/${table}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data)
  })
}

export async function dbUpdate(table, data, eq) {
  const url = new URL(`${BASE}/${table}`)
  for (const [k, v] of Object.entries(eq)) url.searchParams.set(k, `eq.${v}`)
  await fetch(url.toString(), {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify(data)
  })
}

export async function dbDelete(table, eq) {
  const url = new URL(`${BASE}/${table}`)
  for (const [k, v] of Object.entries(eq)) url.searchParams.set(k, `eq.${v}`)
  await fetch(url.toString(), {
    method: 'DELETE',
    headers: headers()
  })
}

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

async function get(path) {
  const res = await fetch(`${BASE}${path}`)
  const text = await res.text()
  let data = null

  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    const message = typeof data === 'object' && data !== null && 'error' in data
      ? data.error
      : `API error ${res.status}`
    throw new Error(message)
  }

  return data
}

async function put(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  let data = null

  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    const message = typeof data === 'object' && data !== null && 'error' in data
      ? data.error
      : `API error ${res.status}`
    throw new Error(message)
  }

  return data
}

// ── Inventory ─────────────────────────────────────────────────────────────────

/** GET /api/inventory-status */
export function fetchInventoryStatus() {
  return get('/api/inventory-status')
}

/** PUT /api/inventory-status/:id  { availableQuantity } */
export function updateInventory(id, availableQuantity) {
  return put(`/api/inventory-status/${id}`, { availableQuantity })
}

// ── Products / Finished Goods ─────────────────────────────────────────────────

/** GET /api/products?type=FINISHED_GOOD  (used by MRP Explosion dropdown) */
export function fetchFinishedGoods() {
  return get('/api/products?type=FINISHED_GOOD')
}

// ── MRP Explosion ─────────────────────────────────────────────────────────────

/** GET /api/mrp/explode/:itemId?quantity=N */
export function explodeMRP(itemId, quantity) {
  return get(`/api/mrp/explode/${itemId}?quantity=${quantity}`)
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

/** GET /api/dashboard/summary */
export function fetchDashboardSummary() {
  return get('/api/dashboard/summary')
}

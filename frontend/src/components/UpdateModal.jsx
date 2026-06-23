import { useState } from 'react'

export default function UpdateModal({ item, onConfirm, onClose, loading }) {
  const [qty, setQty] = useState(item?.available ?? 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (qty < 0) return
    onConfirm(item.id, Number(qty))
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 100,
    }}>
      <div style={{
        background: 'white', borderRadius: 12,
        padding: 28, width: '100%', maxWidth: 420,
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Update Stock</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#64748b' }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Item info */}
        <div style={{ marginBottom: 16, padding: '10px 14px', background: '#f8fafc', borderRadius: 8 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{item?.name}</div>
          {item?.sku && <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>SKU: {item.sku}</div>}
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
            Current stock: <strong>{item?.available}</strong> | Min: <strong>{item?.minStock}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
            New Available Quantity
          </label>
          <input
            type="number"
            min="0"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px', borderRadius: 6,
              border: '1px solid #e2e8f0', fontSize: 15,
              outline: 'none', boxSizing: 'border-box',
            }}
            autoFocus
          />

          <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 20px', borderRadius: 6,
                border: '1px solid #e2e8f0', background: 'white',
                cursor: 'pointer', fontSize: 14, fontWeight: 500,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || qty < 0}
              style={{
                padding: '8px 20px', borderRadius: 6,
                border: 'none', background: '#2563eb',
                color: 'white', cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 14, fontWeight: 500,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Saving…' : 'Update Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

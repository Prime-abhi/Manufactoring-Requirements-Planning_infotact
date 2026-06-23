import { useState, useEffect, useCallback } from 'react'
import SummaryCard from '../components/SummaryCard'
import UpdateModal from '../components/UpdateModal'
import { fetchInventoryStatus, updateInventory } from '../api/mrp'

const styles = `
  .inv-page { padding: 24px; max-width: 1200px; }
  .inv-page-header { margin-bottom: 24px; }
  .inv-page-title { font-size: 22px; font-weight: 700; margin: 0 0 4px; color: #0f172a; }
  .inv-page-subtitle { font-size: 14px; color: #64748b; margin: 0; }

  .inv-cards-row { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }

  .inv-card { background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 20px; }
  .inv-card-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .inv-section-title { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0; }

  .inv-critical-alert { background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 16px; margin-bottom: 20px; }
  .inv-critical-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; font-size: 14px; color: #dc2626; }
  .inv-critical-count { margin-left: auto; font-size: 12px; background: #fee2e2; padding: 2px 8px; border-radius: 20px; }
  .inv-critical-items { display: flex; flex-direction: column; gap: 6px; }
  .inv-critical-item { display: flex; align-items: center; justify-content: space-between; font-size: 13px; }
  .inv-critical-item-name { font-weight: 600; color: #b91c1c; }
  .inv-critical-item-detail { color: #64748b; }

  .inv-table-wrapper { overflow-x: auto; }
  .inv-table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .inv-table thead tr { background: #f8fafc; }
  .inv-table th { padding: 10px 14px; text-align: left; font-size: 12px; font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0; }
  .inv-table td { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #1e293b; }
  .inv-table tbody tr:last-child td { border-bottom: none; }
  .inv-table tbody tr:hover { background: #f8fafc; }
  .inv-text-right { text-align: right; }
  .inv-text-mono { font-family: monospace; font-size: 12px; color: #64748b; }
  .inv-font-semibold { font-weight: 600; }
  .inv-item-name { font-weight: 500; }
  .inv-empty-row { text-align: center; color: #94a3b8; padding: 32px !important; }

  .inv-badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .inv-badge-green  { background: #dcfce7; color: #16a34a; }
  .inv-badge-orange { background: #fef3c7; color: #d97706; }
  .inv-badge-red    { background: #fee2e2; color: #dc2626; }

  .inv-btn-update { background: #eff6ff; color: #2563eb; border: none; padding: 4px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500; }
  .inv-btn-update:hover { background: #dbeafe; }

  .inv-btn-refresh { display: flex; align-items: center; gap: 6px; background: white; border: 1px solid #e2e8f0; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; color: #475569; }
  .inv-btn-refresh:hover { background: #f8fafc; }
  .inv-btn-refresh:disabled { opacity: 0.6; cursor: not-allowed; }

  .inv-spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(0,0,0,0.15); border-top-color: #475569; border-radius: 50%; animation: inv-spin 0.7s linear infinite; }
  .inv-spinner-lg { width: 24px; height: 24px; border-width: 3px; }
  @keyframes inv-spin { to { transform: rotate(360deg); } }

  .inv-loading-state { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 40px; color: #64748b; font-size: 14px; }
  .inv-error-banner { background: #fee2e2; color: #dc2626; padding: 10px 14px; border-radius: 6px; margin-bottom: 16px; font-size: 14px; }

  .inv-toast { position: fixed; bottom: 24px; right: 24px; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; z-index: 200; box-shadow: 0 4px 20px rgba(0,0,0,0.15); animation: inv-slideUp 0.25s ease; }
  .inv-toast-success { background: #16a34a; color: white; }
  .inv-toast-error   { background: #dc2626; color: white; }
  @keyframes inv-slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
`

function getStatus(available, minStock) {
  if (available < minStock * 0.5) return 'CRITICAL'
  if (available < minStock) return 'LOW'
  return 'OK'
}

export default function InventoryStatus() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalItem, setModalItem] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [toast, setToast] = useState(null)

  const loadData = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchInventoryStatus()
      .then((data) => {
        const enriched = data.map((item) => ({
          ...item,
          status: getStatus(item.available, item.minStock),
        }))
        setItems(enriched)
      })
      .catch(() => setError('Failed to load inventory data.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const totalItems    = items.length
  const lowCount      = items.filter((i) => i.status === 'LOW').length
  const criticalCount = items.filter((i) => i.status === 'CRITICAL').length
  const criticalItems = items.filter((i) => i.status === 'CRITICAL')

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleUpdate = async (itemId, newQty) => {
    setUpdating(true)
    try {
      await updateInventory(itemId, newQty)
      showToast('Inventory updated successfully.')
      setModalItem(null)
      loadData()
    } catch {
      showToast('Update failed. Please try again.', 'error')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <>
      <style>{styles}</style>

      <div className="inv-page">
        {/* Toast */}
        {toast && (
          <div className={`inv-toast ${toast.type === 'success' ? 'inv-toast-success' : 'inv-toast-error'}`} role="alert">
            {toast.type === 'success' ? '✓' : '✗'} {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="inv-page-header">
          <h1 className="inv-page-title">Inventory Status</h1>
          <p className="inv-page-subtitle">Real-time stock levels and reorder alerts</p>
        </div>

        {/* Summary Cards */}
        <div className="inv-cards-row">
          <SummaryCard label="Total Items"  value={loading ? '—' : totalItems}    color="blue"   icon="📦" />
          <SummaryCard label="Low Stock"    value={loading ? '—' : lowCount}       color="orange" icon="⚠️" />
          <SummaryCard label="Critical"     value={loading ? '—' : criticalCount}  color="red"    icon="🚨" />
        </div>

        {/* Critical Alert */}
        {!loading && criticalItems.length > 0 && (
          <div className="inv-critical-alert">
            <div className="inv-critical-header">
              <span>🚨</span>
              <strong>Critical Stock Alert</strong>
              <span className="inv-critical-count">
                {criticalItems.length} item{criticalItems.length !== 1 ? 's' : ''} critically low
              </span>
            </div>
            <div className="inv-critical-items">
              {criticalItems.map((item) => (
                <div key={item.id} className="inv-critical-item">
                  <span className="inv-critical-item-name">{item.name}</span>
                  <span className="inv-critical-item-detail">
                    {item.available} / {item.minStock} min — only {Math.round((item.available / item.minStock) * 100)}% of minimum
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Table */}
        <div className="inv-card">
          <div className="inv-card-header-row">
            <h2 className="inv-section-title">Stock Levels</h2>
            <button className="inv-btn-refresh" onClick={loadData} disabled={loading} aria-label="Refresh">
              {loading ? <span className="inv-spinner" /> : '↻'} Refresh
            </button>
          </div>

          {error && <div className="inv-error-banner">{error}</div>}

          {loading ? (
            <div className="inv-loading-state">
              <span className="inv-spinner inv-spinner-lg" />
              <p>Loading inventory…</p>
            </div>
          ) : (
            <div className="inv-table-wrapper">
              <table className="inv-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>SKU</th>
                    <th className="inv-text-right">Available</th>
                    <th className="inv-text-right">Min Stock</th>
                    <th className="inv-text-right">Unit Price</th>
                    <th className="inv-text-right">Total Value</th>
                    <th>Status</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 && (
                    <tr><td colSpan={8} className="inv-empty-row">No inventory items found.</td></tr>
                  )}
                  {items.map((item) => {
                    const totalValue = (item.available ?? 0) * (item.unitPrice ?? 0)
                    return (
                      <tr key={item.id}>
                        <td><span className="inv-item-name">{item.name}</span></td>
                        <td className="inv-text-mono">{item.sku ?? '—'}</td>
                        <td className="inv-text-right">{item.available?.toLocaleString()}</td>
                        <td className="inv-text-right">{item.minStock?.toLocaleString()}</td>
                        <td className="inv-text-right">
                          {item.unitPrice != null ? `$${Number(item.unitPrice).toFixed(2)}` : '—'}
                        </td>
                        <td className="inv-text-right inv-font-semibold">
                          ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td><StatusBadge status={item.status} /></td>
                        <td>
                          <button className="inv-btn-update" onClick={() => setModalItem(item)} aria-label={`Update ${item.name}`}>
                            Update
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Update Modal */}
        {modalItem && (
          <UpdateModal
            item={modalItem}
            onConfirm={handleUpdate}
            onClose={() => setModalItem(null)}
            loading={updating}
          />
        )}
      </div>
    </>
  )
}

function StatusBadge({ status }) {
  const map = {
    OK:       { cls: 'inv-badge-green',  label: '✓ OK' },
    LOW:      { cls: 'inv-badge-orange', label: '⚠ LOW' },
    CRITICAL: { cls: 'inv-badge-red',    label: '🚨 CRITICAL' },
  }
  const { cls, label } = map[status] ?? map['OK']
  return <span className={`inv-badge ${cls}`}>{label}</span>
}

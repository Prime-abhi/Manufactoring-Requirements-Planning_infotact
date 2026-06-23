import { useState, useEffect } from 'react'
import SummaryCard from '../components/SummaryCard'
import { fetchFinishedGoods, explodeMRP } from '../api/mrp'

const styles = `
  .mrp-page { padding: 24px; max-width: 1200px; }
  .mrp-page-header { margin-bottom: 24px; }
  .mrp-page-title { font-size: 22px; font-weight: 700; margin: 0 0 4px; color: #0f172a; }
  .mrp-page-subtitle { font-size: 14px; color: #64748b; margin: 0; }

  .mrp-card { background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 20px; }
  .mrp-section-title { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 16px; }

  .mrp-input-row { display: flex; gap: 16px; align-items: flex-end; flex-wrap: wrap; }
  .mrp-input-group { display: flex; flex-direction: column; flex: 1; min-width: 200px; }
  .mrp-input-group-small { display: flex; flex-direction: column; flex: 0 0 140px; min-width: 120px; }
  .mrp-input-label { font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 6px; }
  .mrp-input-control { padding: 9px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; outline: none; background: white; width: 100%; box-sizing: border-box; }
  .mrp-input-control:focus { border-color: #2563eb; }

  .mrp-btn-calculate { padding: 9px 22px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; white-space: nowrap; align-self: flex-end; }
  .mrp-btn-calculate:hover:not(:disabled) { background: #1d4ed8; }
  .mrp-btn-calculate:disabled { opacity: 0.6; cursor: not-allowed; }

  .mrp-cards-row { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }

  .mrp-table-wrapper { overflow-x: auto; }
  .mrp-table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .mrp-table thead tr { background: #f8fafc; }
  .mrp-table th { padding: 10px 14px; text-align: left; font-size: 12px; font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0; }
  .mrp-table td { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #1e293b; }
  .mrp-table tbody tr:last-child td { border-bottom: none; }
  .mrp-table tbody tr:hover { background: #f8fafc; }
  .mrp-text-right { text-align: right; }
  .mrp-font-semibold { font-weight: 600; }
  .mrp-item-name { font-weight: 500; }
  .mrp-item-sku { font-size: 11px; color: #94a3b8; font-family: monospace; margin-top: 2px; }

  .mrp-badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .mrp-badge-green { background: #dcfce7; color: #16a34a; }
  .mrp-badge-red   { background: #fee2e2; color: #dc2626; }

  .mrp-error-banner { background: #fee2e2; color: #dc2626; padding: 10px 14px; border-radius: 6px; margin-top: 14px; font-size: 14px; }

  .mrp-spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: mrp-spin 0.7s linear infinite; }
  @keyframes mrp-spin { to { transform: rotate(360deg); } }

  .mrp-empty-state { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 48px; text-align: center; color: #64748b; font-size: 15px; }
  .mrp-empty-icon { font-size: 40px; }
`

export default function MrpExplosion() {
  const [products, setProducts] = useState([])
  const [selectedItem, setSelectedItem] = useState('')
  const [quantity, setQuantity] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchFinishedGoods()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false))
  }, [])

  const handleCalculate = async () => {
    if (!selectedItem || !quantity || Number(quantity) <= 0) return
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const data = await explodeMRP(selectedItem, Number(quantity))
      setResults(data)
    } catch {
      setError('Failed to calculate MRP. Please check the API connection.')
    } finally {
      setLoading(false)
    }
  }

  const totalItems = results?.items?.length ?? 0
  const needToBuy  = results?.items?.filter((i) => i.netRequirement > 0).length ?? 0
  const sufficient = results?.items?.filter((i) => i.netRequirement === 0).length ?? 0

  return (
    <>
      <style>{styles}</style>

      <div className="mrp-page">
        {/* Header */}
        <div className="mrp-page-header">
          <h1 className="mrp-page-title">MRP Explosion</h1>
          <p className="mrp-page-subtitle">Calculate material requirements for a finished good</p>
        </div>

        {/* Input Section */}
        <div className="mrp-card">
          <h2 className="mrp-section-title">Configure Explosion</h2>
          <div className="mrp-input-row">
            <div className="mrp-input-group">
              <label className="mrp-input-label" htmlFor="product-select">Select Product</label>
              <select
                id="product-select"
                className="mrp-input-control"
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                disabled={loadingProducts}
              >
                <option value="">
                  {loadingProducts ? 'Loading products…' : '— Select a finished good —'}
                </option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.sku ? `(${p.sku})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="mrp-input-group-small">
              <label className="mrp-input-label" htmlFor="qty-input">Quantity</label>
              <input
                id="qty-input"
                type="number"
                className="mrp-input-control"
                placeholder="e.g. 100"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <button
              className="mrp-btn-calculate"
              onClick={handleCalculate}
              disabled={loading || !selectedItem || !quantity || Number(quantity) <= 0}
            >
              {loading ? (
                <><span className="mrp-spinner" aria-hidden="true" /> Calculating…</>
              ) : (
                <>📊 Calculate</>
              )}
            </button>
          </div>
          {error && <div className="mrp-error-banner">{error}</div>}
        </div>

        {/* Results */}
        {results && (
          <>
            <div className="mrp-cards-row">
              <SummaryCard label="Total Items"     value={totalItems} color="blue"  icon="🗂️" />
              <SummaryCard label="Need to Buy"     value={needToBuy}  color="red"   icon="🛒" />
              <SummaryCard label="Sufficient Stock" value={sufficient} color="green" icon="✅" />
            </div>

            <div className="mrp-card">
              <h2 className="mrp-section-title">Bill of Materials — Requirements</h2>
              <div className="mrp-table-wrapper">
                <table className="mrp-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th className="mrp-text-right">Gross Req</th>
                      <th className="mrp-text-right">On Hand</th>
                      <th className="mrp-text-right">Net Req</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.items.map((item, idx) => (
                      <tr key={item.itemId ?? idx}>
                        <td>
                          <div className="mrp-item-name">{item.itemName}</div>
                          {item.sku && <div className="mrp-item-sku">{item.sku}</div>}
                        </td>
                        <td className="mrp-text-right">{item.grossRequirement?.toLocaleString()}</td>
                        <td className="mrp-text-right">{item.onHand?.toLocaleString()}</td>
                        <td className="mrp-text-right mrp-font-semibold">{item.netRequirement?.toLocaleString()}</td>
                        <td>
                          {item.netRequirement > 0 ? (
                            <span className="mrp-badge mrp-badge-red">🛒 Buy {item.netRequirement?.toLocaleString()} units</span>
                          ) : (
                            <span className="mrp-badge mrp-badge-green">✓ Sufficient</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Empty state */}
        {!results && !loading && (
          <div className="mrp-empty-state">
            <div className="mrp-empty-icon">📊</div>
            <p>Select a product and enter a quantity, then click <strong>Calculate</strong> to see requirements.</p>
          </div>
        )}
      </div>
    </>
  )
}

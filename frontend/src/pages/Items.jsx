   import { useState, useEffect } from "react"

const API = "http://localhost:8080"

const ITEM_TYPES = ["FINISHED_GOOD", "SUB_ASSEMBLY", "RAW_MATERIAL"]
const UNITS = ["PCS", "KG", "LITERS", "METERS", "M2"]

export default function Items() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState("ALL")
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "", sku: "", itemType: "FINISHED_GOOD",
    unit: "PCS", availableQuantity: 0,
    minimumStockLimit: 0, unitPrice: 0, 
    supplierName: "", description: ""
  })

  // Load items
  useEffect(() => { loadItems() }, [])

  const loadItems = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/items`)
      const data = await res.json()
      setItems(data)
    } catch {
      setError("Failed to load items. Is backend running?")
    } finally {
      setLoading(false)
    }
  }

  // Filter items
  const filtered = items.filter(item => {
    const matchType = filter === "ALL" || item.itemType === filter
    const matchSearch = item.name.toLowerCase()
      .includes(search.toLowerCase()) ||
      (item.sku || "").toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  // Open add modal
  const openAdd = () => {
    setForm({
      name: "", sku: "", itemType: "FINISHED_GOOD",
      unit: "PCS", availableQuantity: 0,
      minimumStockLimit: 0, unitPrice: 0,
      supplierName: "", description: ""
    })
    setEditingItem(null)
    setError("")
    setShowModal(true)
  }

  // Open edit modal
  const openEdit = (item) => {
    setForm({
      name: item.name, sku: item.sku || "",
      itemType: item.itemType, unit: item.unit || "PCS",
      availableQuantity: item.availableQuantity || 0,
      minimumStockLimit: item.minimumStockLimit || 0,
      unitPrice: item.unitPrice || 0,
      supplierName: item.supplierName || "",
      description: item.description || ""
    })
    setEditingItem(item)
    setError("")
    setShowModal(true)
  }

  // Save item
  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name || !form.itemType) {
      setError("Name and Type are required")
      return
    }
    setLoading(true)
    try {
      const url = editingItem
        ? `${API}/api/items/${editingItem.id}`
        : `${API}/api/items`
      const method = editingItem ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          availableQuantity: Number(form.availableQuantity),
          minimumStockLimit: Number(form.minimumStockLimit),
          unitPrice: Number(form.unitPrice)
        })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to save")
      }
      setShowModal(false)
      loadItems()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return
    try {
      await fetch(`${API}/api/items/${id}`, { method: "DELETE" })
      loadItems()
    } catch {
      setError("Failed to delete item")
    }
  }

  // Status badge
  const StatusBadge = ({ status, available, minimum }) => {
    const isCritical = available < minimum * 0.5
    if (status === "LOW_STOCK") {
      return (
        <span style={{
          background: isCritical ? "#fee2e2" : "#fef3c7",
          color: isCritical ? "#dc2626" : "#d97706",
          padding: "2px 10px", borderRadius: 20,
          fontSize: 12, fontWeight: 600
        }}>
          {isCritical ? "CRITICAL" : "LOW STOCK"}
        </span>
      )
    }
    return (
      <span style={{
        background: "#dcfce7", color: "#16a34a",
        padding: "2px 10px", borderRadius: 20,
        fontSize: 12, fontWeight: 600
      }}>
        AVAILABLE
      </span>
    )
  }

  // Type badge
  const TypeBadge = ({ type }) => {
    const colors = {
      FINISHED_GOOD: { bg: "#eff6ff", color: "#2563eb" },
      SUB_ASSEMBLY: { bg: "#fffbeb", color: "#d97706" },
      RAW_MATERIAL: { bg: "#f1f5f9", color: "#475569" }
    }
    const c = colors[type] || colors.RAW_MATERIAL
    return (
      <span style={{
        background: c.bg, color: c.color,
        padding: "2px 8px", borderRadius: 4,
        fontSize: 11, fontWeight: 500
      }}>
        {type.replace(/_/g, " ")}
      </span>
    )
  }

  return (
    <div style={{ padding: 24, width:"100%", boxSizing:"border-box" }}>

      {/* Header */}
      <div style={{ 
        display: "flex", justifyContent: "space-between", 
        alignItems: "center", marginBottom: 20 
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
            Items
          </h1>
          <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: 14 }}>
            Manage finished goods, sub-assemblies and raw materials
          </p>
        </div>
        <button onClick={openAdd} style={{
          background: "#2563eb", color: "white",
          border: "none", padding: "8px 18px",
          borderRadius: 6, cursor: "pointer",
          fontSize: 14, fontWeight: 500,
          display: "flex", alignItems: "center", gap: 6
        }}>
          + Add New Item
        </button>
      </div>

      {/* Error */}
      {error && !showModal && (
        <div style={{
          background: "#fee2e2", color: "#dc2626",
          padding: "10px 16px", borderRadius: 6,
          marginBottom: 16, fontSize: 14
        }}>
          {error}
        </div>
      )}

      {/* Filter + Search */}
      <div style={{ 
        display: "flex", gap: 12, marginBottom: 16,
        flexWrap: "wrap"
      }}>
        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 4 }}>
          {["ALL", ...ITEM_TYPES].map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: "6px 14px", borderRadius: 6,
              border: filter === t 
                ? "2px solid #2563eb" 
                : "1px solid #e2e8f0",
              background: filter === t ? "#eff6ff" : "white",
              color: filter === t ? "#2563eb" : "#475569",
              cursor: "pointer", fontSize: 12, fontWeight: 500
            }}>
              {t.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          placeholder="Search by name or SKU..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: "6px 12px", borderRadius: 6,
            border: "1px solid #e2e8f0", fontSize: 14,
            outline: "none", minWidth: 220
          }}
        />
      </div>

      {/* Table */}
      <div style={{
        background: "white", borderRadius: 10,
        border: "1px solid #e2e8f0", overflow: "hidden"
      }}>
        {loading && !showModal ? (
          <div style={{ 
            padding: 40, textAlign: "center", color: "#64748b" 
          }}>
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ 
            padding: 40, textAlign: "center", color: "#64748b" 
          }}>
            No items found. Click "Add New Item" to create one.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Name", "SKU", "Type", "Available", 
                  "Min Stock", "Unit", "Supplier", 
                  "Price", "Status", "Actions"].map(h => (
                  <th key={h} style={{
                    padding: "10px 14px", textAlign: "left",
                    fontSize: 12, fontWeight: 600,
                    color: "#64748b", borderBottom: "1px solid #e2e8f0"
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr key={item.id} style={{
                  background: idx % 2 === 0 ? "white" : "#f8fafc",
                  borderBottom: "1px solid #f1f5f9"
                }}>
                  <td style={{ 
                    padding: "10px 14px", fontSize: 14, 
                    fontWeight: 500 
                  }}>
                    {item.name}
                  </td>
                  <td style={{ 
                    padding: "10px 14px", fontSize: 13, 
                    color: "#64748b", fontFamily: "monospace" 
                  }}>
                    {item.sku || "—"}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <TypeBadge type={item.itemType} />
                  </td>
                  <td style={{ 
                    padding: "10px 14px", fontSize: 14,
                    fontWeight: item.availableQuantity < 
                      item.minimumStockLimit ? 600 : 400,
                    color: item.availableQuantity < 
                      item.minimumStockLimit ? "#dc2626" : "inherit"
                  }}>
                    {item.availableQuantity}
                  </td>
                  <td style={{ 
                    padding: "10px 14px", fontSize: 14, 
                    color: "#64748b" 
                  }}>
                    {item.minimumStockLimit}
                  </td>
                  <td style={{ 
                    padding: "10px 14px", fontSize: 13, 
                    color: "#64748b" 
                  }}>
                    {item.unit || "—"}
                  </td>
                  <td style={{ 
                    padding: "10px 14px", fontSize: 13 
                  }}>
                    {item.supplierName || "—"}
                  </td>
                  <td style={{ 
                    padding: "10px 14px", fontSize: 13 
                  }}>
                    {item.unitPrice 
                      ? `$${item.unitPrice.toFixed(2)}` 
                      : "—"}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <StatusBadge
                      status={item.status}
                      available={item.availableQuantity}
                      minimum={item.minimumStockLimit}
                    />
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => openEdit(item)} style={{
                        background: "#eff6ff", color: "#2563eb",
                        border: "none", padding: "4px 10px",
                        borderRadius: 4, cursor: "pointer",
                        fontSize: 12, fontWeight: 500
                      }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} 
                        style={{
                          background: "#fee2e2", color: "#dc2626",
                          border: "none", padding: "4px 10px",
                          borderRadius: 4, cursor: "pointer",
                          fontSize: 12, fontWeight: 500
                        }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 50
        }}>
          <div style={{
            background: "white", borderRadius: 12,
            padding: 28, width: "100%", maxWidth: 560,
            maxHeight: "90vh", overflowY: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
          }}>
            <div style={{ 
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: 20 
            }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                {editingItem ? "Edit Item" : "Add New Item"}
              </h2>
              <button onClick={() => setShowModal(false)} style={{
                background: "none", border: "none",
                fontSize: 22, cursor: "pointer", color: "#64748b"
              }}>
                ×
              </button>
            </div>

            {error && (
              <div style={{
                background: "#fee2e2", color: "#dc2626",
                padding: "8px 12px", borderRadius: 6,
                marginBottom: 16, fontSize: 13
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr", 
                gap: 14 
              }}>

                {/* Name */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={lblStyle}>
                    Item Name *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    style={inputStyle}
                    placeholder="e.g. Bicycle"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label style={lblStyle}>SKU</label>
                  <input
                    value={form.sku}
                    onChange={e => setForm({...form, sku: e.target.value})}
                    style={inputStyle}
                    placeholder="e.g. FG-BIKE-001"
                  />
                </div>

                {/* Type */}
                <div>
                  <label style={lblStyle}>Item Type *</label>
                  <select
                    value={form.itemType}
                    onChange={e => 
                      setForm({...form, itemType: e.target.value})}
                    style={inputStyle}
                  >
                    {ITEM_TYPES.map(t => (
                      <option key={t} value={t}>
                        {t.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Available Qty */}
                <div>
                  <label style={lblStyle}>Available Quantity</label>
                  <input
                    type="number" min="0" step="0.01"
                    value={form.availableQuantity}
                    onChange={e => setForm({
                      ...form, 
                      availableQuantity: e.target.value
                    })}
                    style={inputStyle}
                  />
                </div>

                {/* Min Stock */}
                <div>
                  <label style={lblStyle}>Minimum Stock Limit</label>
                  <input
                    type="number" min="0" step="0.01"
                    value={form.minimumStockLimit}
                    onChange={e => setForm({
                      ...form, 
                      minimumStockLimit: e.target.value
                    })}
                    style={inputStyle}
                  />
                </div>

                {/* Unit */}
                <div>
                  <label style={lblStyle}>Unit</label>
                  <select
                    value={form.unit}
                    onChange={e => setForm({...form, unit: e.target.value})}
                    style={inputStyle}
                  >
                    {UNITS.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                {/* Unit Price */}
                <div>
                  <label style={lblStyle}>Unit Price ($)</label>
                  <input
                    type="number" min="0" step="0.01"
                    value={form.unitPrice}
                    onChange={e => setForm({
                      ...form, unitPrice: e.target.value
                    })}
                    style={inputStyle}
                  />
                </div>

                {/* Supplier */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={lblStyle}>Supplier Name</label>
                  <input
                    value={form.supplierName}
                    onChange={e => setForm({
                      ...form, supplierName: e.target.value
                    })}
                    style={inputStyle}
                    placeholder="e.g. Bike Parts Co."
                  />
                </div>

                {/* Description */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={lblStyle}>Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({
                      ...form, description: e.target.value
                    })}
                    style={{ ...inputStyle, height: 70, resize: "vertical" }}
                    placeholder="Optional description..."
                  />
                </div>
              </div>

              {/* Buttons */}
              <div style={{ 
                display: "flex", gap: 10, 
                marginTop: 20, justifyContent: "flex-end" 
              }}>
                <button type="button" 
                  onClick={() => setShowModal(false)} style={{
                    padding: "8px 20px", borderRadius: 6,
                    border: "1px solid #e2e8f0",
                    background: "blue", cursor: "pointer",
                    fontSize: 14, fontWeight: 500
                  }}>
                  Cancel
                </button>
                <button type="submit" disabled={loading} style={{
                  padding: "8px 20px", borderRadius: 6,
                  border: "none", background: "#2563eb",
                  color: "white", cursor: "pointer",
                  fontSize: 14, fontWeight: 500
                }}>
                  {loading ? "Saving..." : 
                    editingItem ? "Update Item" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// Shared styles
const inputStyle = {
  width: "100%", padding: "8px 12px",
  borderRadius: 6, border: "1px solid #e2e8f0",
  fontSize: 14, outline: "none",
  boxSizing: "border-box", background: "white",
  color: "#1e293b"
}
const lblStyle = {
  display: "block", fontSize: 12,
  fontWeight: 600, color: "#475569",
  marginBottom: 5
}	
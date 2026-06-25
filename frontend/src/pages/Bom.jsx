import { useState, useEffect } from "react"

const API = "http://localhost:8080"

export default function Bom() {
  const [items, setItems] = useState([])
  const [selectedId, setSelectedId] = useState("")
  const [tree, setTree] = useState(null)
  const [treeLoading, setTreeLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [parentId, setParentId] = useState("")
  const [childId, setChildId] = useState("")
  const [qty, setQty] = useState("1")
  const [saving, setSaving] = useState(false)
  const [pageError, setPageError] = useState("")
  const [formError, setFormError] = useState("")
  const [success, setSuccess] = useState("")

  // Load items from backend
  useEffect(() => {
    fetch(`${API}/api/items`)
      .then(r => {
        if (!r.ok) throw new Error("Failed")
        return r.json()
      })
      .then(setItems)
      .catch(() => setPageError(
        "Cannot connect to backend. " +
        "Make sure Spring Boot is running on port 8080."
      ))
  }, [])

  // Load tree when product selected
  useEffect(() => {
    if (!selectedId) { setTree(null); return }
    setTreeLoading(true)
    setTree(null)
    fetch(`${API}/api/bom-links/tree/${selectedId}`)
      .then(r => {
        if (!r.ok) throw new Error("Failed")
        return r.json()
      })
      .then(data => {
        setTree(data)
        setTreeLoading(false)
      })
      .catch(() => {
        setPageError("Failed to load BOM tree.")
        setTreeLoading(false)
      })
  }, [selectedId])

  // Refresh tree
  const refreshTree = () => {
    if (!selectedId) return
    fetch(`${API}/api/bom-links/tree/${selectedId}`)
      .then(r => r.json())
      .then(setTree)
  }

  // Add BOM link
  const handleAddLink = async (e) => {
    e.preventDefault()
    if (!parentId || !childId || !qty) {
      setFormError("Please fill all fields"); return
    }
    if (parentId === childId) {
      setFormError("Parent and child cannot be same")
      return
    }
    setSaving(true); setFormError("")
    try {
      const res = await fetch(`${API}/api/bom-links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentItemId: Number(parentId),
          childItemId: Number(childId),
          quantityRequired: Number(qty)
        })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to save")
      }
      setSuccess("BOM link added successfully!")
      setParentId(""); setChildId(""); setQty("1")
      setShowForm(false)
      refreshTree()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  // Delete link
  const handleDelete = async (linkId) => {
    if (!window.confirm("Delete this BOM link?")) return
    try {
      const res = await fetch(
        `${API}/api/bom-links/${linkId}`,
        { method: "DELETE" }
      )
      if (!res.ok) throw new Error("Failed to delete")
      setSuccess("Link deleted!")
      refreshTree()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setPageError(err.message)
    }
  }

  const finishedGoods = items.filter(
    i => i.itemType === "FINISHED_GOOD"
  )

  return (
    <div style={{ padding: 28, background: "#f8fafc",
      minHeight: "100vh" }}>

      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: 24
      }}>
        <div>
          <h1 style={{
            fontSize: 24, fontWeight: 700,
            margin: 0, color: "#0f172a"
          }}>
            BOM Builder
          </h1>
          <p style={{
            color: "#64748b", margin: "6px 0 0", fontSize: 14
          }}>
            Define parent-child relationships to build
            multi-level bills of materials.
          </p>
        </div>
        <button onClick={() => {
          setShowForm(!showForm)
          setFormError(""); setSuccess("")
        }} style={{
          background: "#2563eb", color: "white",
          border: "none", padding: "10px 20px",
          borderRadius: 8, cursor: "pointer",
          fontSize: 14, fontWeight: 600
        }}>
          + Add BOM Link
        </button>
      </div>

      {/* Messages */}
      {pageError && (
        <div style={{
          background: "#fee2e2", color: "#dc2626",
          padding: "12px 16px", borderRadius: 8,
          marginBottom: 16, fontSize: 14,
          border: "1px solid #fecaca"
        }}>
          ⚠ {pageError}
        </div>
      )}
      {success && (
        <div style={{
          background: "#f0fdf4", color: "#16a34a",
          padding: "12px 16px", borderRadius: 8,
          marginBottom: 16, fontSize: 14,
          border: "1px solid #bbf7d0"
        }}>
          ✓ {success}
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        gap: 20, alignItems: "start"
      }}>

        {/* ── Left column ───────────────────────── */}
        <div style={{
          display: "flex", flexDirection: "column", gap: 16
        }}>

          {/* Product selector */}
          <div style={card}>
            <div style={cardHeader}>
              <h3 style={cardTitle}>Select Product</h3>
            </div>
            <div style={{ padding: 16 }}>
              <label style={lbl}>Finished Good</label>
              <select
                value={selectedId}
                onChange={e => {
                  setSelectedId(e.target.value)
                  setSuccess("")
                }}
                style={inp}
              >
                <option value="">-- Select product --</option>
                {finishedGoods.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {finishedGoods.length === 0 && !pageError && (
                <p style={{
                  margin: "8px 0 0", fontSize: 12,
                  color: "#f97316"
                }}>
                  No finished goods found. Add items first.
                </p>
              )}
            </div>
          </div>

          {/* Add BOM Link form */}
          {showForm && (
            <div style={card}>
              <div style={cardHeader}>
                <h3 style={cardTitle}>
                  Create BOM Relationship
                </h3>
              </div>
              <form onSubmit={handleAddLink}
                style={{
                  padding: 16,
                  display: "flex",
                  flexDirection: "column", gap: 12
                }}>

                {formError && (
                  <div style={{
                    background: "#fee2e2",
                    color: "#dc2626",
                    padding: "8px 12px", borderRadius: 6,
                    fontSize: 12,
                    border: "1px solid #fecaca"
                  }}>
                    ⚠ {formError}
                  </div>
                )}

                <div>
                  <label style={lbl}>Parent Item</label>
                  <select
                    value={parentId}
                    onChange={e => setParentId(e.target.value)}
                    style={inp}
                  >
                    <option value="">Select parent</option>
                    {items
                      .filter(i => i.itemType !== "RAW_MATERIAL")
                      .map(i => (
                        <option key={i.id} value={i.id}>
                          {i.name} —{" "}
                          {i.itemType.replace(/_/g, " ")}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label style={lbl}>Child Item</label>
                  <select
                    value={childId}
                    onChange={e => setChildId(e.target.value)}
                    style={inp}
                  >
                    <option value="">Select child</option>
                    {items
                      .filter(i =>
                        String(i.id) !== String(parentId))
                      .map(i => (
                        <option key={i.id} value={i.id}>
                          {i.name} —{" "}
                          {i.itemType.replace(/_/g, " ")}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label style={lbl}>Quantity Required</label>
                  <input
                    type="number" min="0.01" step="0.01"
                    value={qty}
                    onChange={e => setQty(e.target.value)}
                    style={inp}
                    placeholder="e.g. 2"
                  />
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button"
                    onClick={() => {
                      setShowForm(false)
                      setFormError("")
                    }}
                    style={{
                      flex: 1, padding: "8px",
                      borderRadius: 6,
                      border: "1.5px solid #e2e8f0",
                      background: "white",
                      cursor: "pointer", fontSize: 13,
                      color: "#475569", fontWeight: 500
                    }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    style={{
                      flex: 1, padding: "8px",
                      borderRadius: 6, border: "none",
                      background: saving
                        ? "#93c5fd" : "#2563eb",
                      color: "white",
                      cursor: "pointer", fontSize: 13,
                      fontWeight: 600
                    }}>
                    {saving ? "Saving..." : "Add To BOM"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Legend */}
          <div style={card}>
            <div style={cardHeader}>
              <h3 style={cardTitle}>Legend</h3>
            </div>
            <div style={{
              padding: 16,
              display: "flex", flexDirection: "column",
              gap: 8
            }}>
              {[
                { label: "FG — Finished Good",
                  bg: "#eff6ff", color: "#2563eb" },
                { label: "SA — Sub Assembly",
                  bg: "#fff7ed", color: "#ea580c" },
                { label: "RM — Raw Material",
                  bg: "#f0fdf4", color: "#16a34a" },
              ].map(item => (
                <span key={item.label} style={{
                  background: item.bg, color: item.color,
                  padding: "4px 10px", borderRadius: 4,
                  fontSize: 12, fontWeight: 600,
                  display: "inline-block"
                }}>
                  {item.label}
                </span>
              ))}
              <p style={{
                fontSize: 12, color: "#94a3b8",
                margin: "4px 0 0"
              }}>
                <b>2x</b> = quantity required per parent unit
              </p>
            </div>
          </div>
        </div>

        {/* ── Right column — BOM Tree ────────────── */}
        <div style={card}>
          <div style={cardHeader}>
            <h3 style={cardTitle}>BOM Structure</h3>
            {tree && (
              <span style={{
                fontSize: 12, color: "#64748b",
                fontWeight: 400
              }}>
                Click ▶ to expand / ▼ to collapse
              </span>
            )}
          </div>
          <div style={{ padding: 20 }}>

            {!selectedId && (
              <div style={emptyState}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>
                  🌳
                </div>
                <p style={{ fontSize: 14, fontWeight: 500 }}>
                  Select a finished good
                </p>
                <p style={{
                  fontSize: 13, marginTop: 4, color: "#94a3b8"
                }}>
                  Choose a product from the left panel
                  to view its BOM tree
                </p>
              </div>
            )}

            {selectedId && treeLoading && (
              <div style={emptyState}>
                <p style={{ fontSize: 14, color: "#94a3b8" }}>
                  Loading BOM tree...
                </p>
              </div>
            )}

            {tree && !treeLoading &&
              tree.children &&
              tree.children.length === 0 && (
              <div style={emptyState}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>
                  📭
                </div>
                <p style={{ fontSize: 14, fontWeight: 500 }}>
                  No components defined yet
                </p>
                <p style={{
                  fontSize: 13, marginTop: 4, color: "#94a3b8"
                }}>
                  Click <b>+ Add BOM Link</b> to add components
                </p>
              </div>
            )}

            {tree && !treeLoading && (
              tree.children && tree.children.length > 0
            ) && (
              <ul style={{
                listStyle: "none", padding: 0, margin: 0
              }}>
                <TreeNode
                  node={tree}
                  depth={0}
                  onDelete={handleDelete}
                />
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Tree Node Component ──────────────────────────────────
function TreeNode({ node, depth, onDelete }) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = node.children &&
    node.children.length > 0

  const typeConfig = {
    FINISHED_GOOD: {
      bg: "#eff6ff", color: "#2563eb",
      border: "#bfdbfe", label: "FG"
    },
    SUB_ASSEMBLY: {
      bg: "#fff7ed", color: "#ea580c",
      border: "#fed7aa", label: "SA"
    },
    RAW_MATERIAL: {
      bg: "#f0fdf4", color: "#16a34a",
      border: "#bbf7d0", label: "RM"
    },
  }
  const c = typeConfig[node.type] || typeConfig.RAW_MATERIAL

  const isLowStock = node.availableQty 
    node.minimumStockLimit

  return (
    <li style={{ marginBottom: 6 }}>
      <div style={{
        display: "flex", alignItems: "center",
        gap: 6, paddingLeft: depth * 28
      }}>

        {/* Expand button */}
        <button
          onClick={() => setExpanded(!expanded)}
          disabled={!hasChildren}
          style={{
            background: "none", border: "none",
            cursor: hasChildren ? "pointer" : "default",
            fontSize: 10, color: "#94a3b8",
            width: 18, flexShrink: 0, padding: 0
          }}
        >
          {hasChildren
            ? (expanded ? "▼" : "▶")
            : "●"}
        </button>

        {/* Item card */}
        <div style={{
          display: "flex", alignItems: "center",
          gap: 8, flex: 1, padding: "8px 12px",
          borderRadius: 8, background: c.bg,
          border: `1.5px solid ${c.border}`,
          transition: "all 0.15s"
        }}>

          {/* Type badge */}
          <span style={{
            background: c.color, color: "white",
            padding: "2px 6px", borderRadius: 4,
            fontSize: 9, fontWeight: 700,
            letterSpacing: 0.5, flexShrink: 0
          }}>
            {c.label}
          </span>

          {/* Name */}
          <span style={{
            fontSize: 13, fontWeight: 600,
            color: "#0f172a", flex: 1
          }}>
            {node.name}
          </span>

          {/* SKU */}
          <span style={{
            fontSize: 11, color: "#94a3b8",
            fontFamily: "monospace", flexShrink: 0
          }}>
            {node.sku}
          </span>

          {/* Quantity badge (not shown on root) */}
          {depth > 0 && (
            <span style={{
              background: "#1e40af", color: "white",
              padding: "2px 8px", borderRadius: 20,
              fontSize: 11, fontWeight: 700, flexShrink: 0
            }}>
              {node.quantity}x
            </span>
          )}

          {/* Stock */}
          <span style={{
            fontSize: 11,
            color: isLowStock ? "#dc2626" : "#64748b",
            background: isLowStock ? "#fee2e2" : "#f1f5f9",
            padding: "2px 7px", borderRadius: 4,
            border: isLowStock
              ? "1px solid #fecaca"
              : "1px solid #e2e8f0",
            fontWeight: isLowStock ? 600 : 400,
            flexShrink: 0
          }}>
            {node.availableQty} {node.unit}
            {isLowStock ? " ⚠" : ""}
          </span>
        </div>
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div style={{
            position: "absolute",
            left: depth * 28 + 8,
            top: 0, bottom: 0,
            width: 2,
            background: "#e2e8f0"
          }} />
          <ul style={{
            listStyle: "none",
            padding: 0, margin: "4px 0"
          }}>
            {node.children.map((child, idx) => (
              <TreeNode
                key={idx}
                node={child}
                depth={depth + 1}
                onDelete={onDelete}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}

// ── Shared styles ────────────────────────────────────────
const card = {
  background: "white", borderRadius: 12,
  border: "1px solid #e2e8f0",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  overflow: "hidden"
}
const cardHeader = {
  padding: "12px 16px",
  borderBottom: "1px solid #f1f5f9",
  display: "flex", justifyContent: "space-between",
  alignItems: "center"
}
const cardTitle = {
  margin: 0, fontSize: 13, fontWeight: 700,
  color: "#0f172a"
}
const emptyState = {
  textAlign: "center", padding: "60px 20px",
  color: "#64748b"
}
const inp = {
  width: "100%", padding: "8px 10px",
  borderRadius: 6, border: "1.5px solid #e2e8f0",
  fontSize: 13, outline: "none",
  color: "#1e293b", background: "white",
  boxSizing: "border-box"
}
const lbl = {
  display: "block", fontSize: 12,
  fontWeight: 600, color: "#475569",
  marginBottom: 5
}
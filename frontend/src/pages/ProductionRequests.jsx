import { useState, useEffect } from "react"

const API = "http://localhost:8080"

// NEW — reads from localStorage after login
const CURRENT_USER = JSON.parse(
  localStorage.getItem("mrp_user")
) || { id: 1, role: "PLANNER" }

export default function ProductionRequests() {
  const [requests, setRequests] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageError, setPageError] = useState("")
  const [success, setSuccess] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectId, setRejectId] = useState(null)
  const [rejectReason, setRejectReason] = useState("")
  const [form, setForm] = useState({
    itemId: "", quantity: "", notes: ""
  })
  const [formError, setFormError] = useState("")
  const [saving, setSaving] = useState(false)

  const isManager =
    CURRENT_USER.role === "PRODUCTION_MANAGER"

  const loadRequests = async (ignore = false) => {
    if (!ignore) setLoading(true)
    try {
      const url = isManager
        ? `${API}/api/production-requests`
        : `${API}/api/production-requests/my/${CURRENT_USER.id}`
      const res = await fetch(url)
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      if (!ignore) {
        setRequests(data)
        setPageError("")
      }
    } catch {
      if (!ignore) {
        setPageError(
          "Cannot connect to backend. " +
          "Make sure Spring Boot is running.")
      }
    } finally {
      if (!ignore) setLoading(false)
    }
  }

  const loadItems = async (ignore = false) => {
    try {
      const res = await fetch(`${API}/api/items`)
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      if (!ignore) {
        setItems(data.filter(
          i => i.itemType === "FINISHED_GOOD"))
      }
    } catch {
      if (!ignore) setPageError("Failed to load items.")
    }
  }

  useEffect(() => {
    let ignore = false

    Promise.resolve().then(() => {
      if (!ignore) loadRequests(ignore)
      if (!ignore) loadItems(ignore)
    })

    return () => { ignore = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.itemId || !form.quantity) {
      setFormError("Product and quantity are required")
      return
    }
    setSaving(true); setFormError("")
    try {
      const res = await fetch(
        `${API}/api/production-requests`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemId: Number(form.itemId),
            quantity: Number(form.quantity),
            requestedById: CURRENT_USER.id,
            notes: form.notes
          })
        }
      )
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed")
      }
      setShowForm(false)
      setForm({ itemId: "", quantity: "", notes: "" })
      setSuccess("Production request created!")
      loadRequests()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this request?")) return
    try {
      const res = await fetch(
        `${API}/api/production-requests/${id}/approve`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ managerId: CURRENT_USER.id })
        }
      )
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed")
      }
      setSuccess("Request approved!")
      loadRequests()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setPageError(err.message)
    }
  }

  const handleReject = async (e) => {
    e.preventDefault()
    if (!rejectReason.trim()) {
      return
    }
    try {
      const res = await fetch(
        `${API}/api/production-requests/${rejectId}/reject`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            managerId: CURRENT_USER.id,
            reason: rejectReason
          })
        }
      )
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed")
      }
      setShowRejectModal(false)
      setRejectReason("")
      setSuccess("Request rejected.")
      loadRequests()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setPageError(err.message)
    }
  }

  const StatusBadge = ({ status }) => {
    const config = {
      PENDING: { bg: "#fff7ed", color: "#ea580c" },
      APPROVED: { bg: "#f0fdf4", color: "#16a34a" },
      REJECTED: { bg: "#fee2e2", color: "#dc2626" },
      COMPLETED: { bg: "#eff6ff", color: "#2563eb" },
    }
    const c = config[status] || config.PENDING
    return (
      <span style={{
        background: c.bg, color: c.color,
        padding: "3px 10px", borderRadius: 20,
        fontSize: 11, fontWeight: 700
      }}>
        {status}
      </span>
    )
  }

  return (
    <div style={{
      padding: 28, background: "#f8fafc",
      minHeight: "100vh"
    }}>

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
            Production Requests
          </h1>
          <p style={{
            color: "#64748b", margin: "6px 0 0",
            fontSize: 14
          }}>
            {isManager
              ? "Review and approve production requests"
              : "Create and track your production requests"}
          </p>
        </div>
        {!isManager && (
          <button onClick={() => {
            setShowForm(!showForm)
            setFormError("")
          }} style={{
            background: "#2563eb", color: "white",
            border: "none", padding: "10px 20px",
            borderRadius: 8, cursor: "pointer",
            fontSize: 14, fontWeight: 600
          }}>
            + Create Request
          </button>
        )}
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

      {/* Create Request Form */}
      {showForm && !isManager && (
        <div style={{
          background: "white", borderRadius: 12,
          border: "1px solid #e2e8f0",
          marginBottom: 20, overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
        }}>
          <div style={{
            padding: "12px 20px",
            borderBottom: "1px solid #f1f5f9"
          }}>
            <h3 style={{
              margin: 0, fontSize: 14, fontWeight: 700
            }}>
              New Production Request
            </h3>
          </div>
          <form onSubmit={handleCreate}
            style={{ padding: 20 }}>
            {formError && (
              <div style={{
                background: "#fee2e2", color: "#dc2626",
                padding: "8px 12px", borderRadius: 6,
                marginBottom: 14, fontSize: 13,
                border: "1px solid #fecaca"
              }}>
                ⚠ {formError}
              </div>
            )}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16, marginBottom: 16
            }}>
              <div>
                <label style={lbl}>
                  Select Product *
                </label>
                <select
                  value={form.itemId}
                  onChange={e => setForm({
                    ...form, itemId: e.target.value
                  })}
                  style={inp}
                >
                  <option value="">
                    -- Select Finished Good --
                  </option>
                  {items.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={lbl}>Quantity *</label>
                <input
                  type="number" min="1"
                  value={form.quantity}
                  onChange={e => setForm({
                    ...form, quantity: e.target.value
                  })}
                  style={inp}
                  placeholder="e.g. 100"
                />
              </div>
              <div>
                <label style={lbl}>Notes</label>
                <input
                  value={form.notes}
                  onChange={e => setForm({
                    ...form, notes: e.target.value
                  })}
                  style={inp}
                  placeholder="Optional notes..."
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: "8px 20px", borderRadius: 8,
                  border: "1.5px solid #e2e8f0",
                  background: "white",
                  cursor: "pointer", fontSize: 14,
                  color: "#475569", fontWeight: 500
                }}>
                Cancel
              </button>
              <button type="submit" disabled={saving}
                style={{
                  padding: "8px 20px", borderRadius: 8,
                  border: "none",
                  background: saving
                    ? "#93c5fd" : "#2563eb",
                  color: "white", cursor: "pointer",
                  fontSize: 14, fontWeight: 600
                }}>
                {saving ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Requests Table */}
      <div style={{
        background: "white", borderRadius: 12,
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
      }}>
        <div style={{
          padding: "14px 20px",
          borderBottom: "1px solid #f1f5f9"
        }}>
          <h3 style={{
            margin: 0, fontSize: 14,
            fontWeight: 700, color: "#0f172a"
          }}>
            {isManager
              ? "All Production Requests"
              : "My Requests"}
          </h3>
        </div>

        {loading ? (
          <div style={{
            padding: 60, textAlign: "center",
            color: "#94a3b8"
          }}>
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div style={{
            padding: 60, textAlign: "center",
            color: "#94a3b8"
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>
              📋
            </div>
            <p style={{ fontSize: 14, fontWeight: 500 }}>
              No requests found
            </p>
            {!isManager && (
              <p style={{ fontSize: 13, marginTop: 6 }}>
                Click "+ Create Request" to raise one
              </p>
            )}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse"
            }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["#", "PRODUCT", "QTY", "STATUS",
                    "REQUESTED BY", "DATE", "NOTES",
                    ...(isManager ? ["ACTIONS"] : [])
                  ].map(h => (
                    <th key={h} style={{
                      padding: "11px 16px",
                      textAlign: "left",
                      fontSize: 11, fontWeight: 700,
                      color: "#64748b",
                      letterSpacing: 0.5,
                      borderBottom: "1px solid #e2e8f0"
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id} style={{
                    borderBottom: "1px solid #f1f5f9"
                  }}
                    onMouseEnter={e =>
                      e.currentTarget.style.background =
                        "#f8fafc"}
                    onMouseLeave={e =>
                      e.currentTarget.style.background =
                        "white"}
                  >
                    <td style={{
                      padding: "13px 16px",
                      fontSize: 13, color: "#94a3b8",
                      fontFamily: "monospace"
                    }}>
                      #{req.id}
                    </td>
                    <td style={{
                      padding: "13px 16px",
                      fontSize: 14, fontWeight: 600,
                      color: "#0f172a"
                    }}>
                      {req.item?.name || "—"}
                    </td>
                    <td style={{
                      padding: "13px 16px",
                      fontSize: 14, fontWeight: 600,
                      color: "#2563eb"
                    }}>
                      {req.requestedQuantity}
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <StatusBadge status={req.status} />
                    </td>
                    <td style={{
                      padding: "13px 16px",
                      fontSize: 13, color: "#475569"
                    }}>
                      {req.requestedBy?.name || "—"}
                    </td>
                    <td style={{
                      padding: "13px 16px",
                      fontSize: 12, color: "#94a3b8"
                    }}>
                      {req.createdAt
                        ? new Date(req.createdAt)
                            .toLocaleDateString()
                        : "—"}
                    </td>
                    <td style={{
                      padding: "13px 16px",
                      fontSize: 13, color: "#64748b",
                      maxWidth: 200
                    }}>
                      {req.notes || "—"}
                    </td>
                    {isManager && (
                      <td style={{ padding: "13px 16px" }}>
                        {req.status === "PENDING" ? (
                          <div style={{
                            display: "flex", gap: 6
                          }}>
                            <button
                              onClick={() =>
                                handleApprove(req.id)}
                              style={{
                                background: "#f0fdf4",
                                color: "#16a34a",
                                border: "1px solid #bbf7d0",
                                borderRadius: 6,
                                padding: "5px 10px",
                                cursor: "pointer",
                                fontSize: 12, fontWeight: 600
                              }}>
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => {
                                setRejectId(req.id)
                                setRejectReason("")
                                setShowRejectModal(true)
                              }}
                              style={{
                                background: "#fee2e2",
                                color: "#dc2626",
                                border: "1px solid #fecaca",
                                borderRadius: 6,
                                padding: "5px 10px",
                                cursor: "pointer",
                                fontSize: 12, fontWeight: 600
                              }}>
                              ✗ Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{
                            fontSize: 12, color: "#94a3b8"
                          }}>
                            {req.approvedBy
                              ? `By ${req.approvedBy.name}`
                              : "—"}
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {requests.length > 0 && (
          <div style={{
            padding: "10px 20px",
            borderTop: "1px solid #f1f5f9",
            fontSize: 12, color: "#94a3b8"
          }}>
            {requests.length} request(s)
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(15,23,42,0.5)",
          display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 50
        }}>
          <div style={{
            background: "white", borderRadius: 14,
            padding: 32, width: 420,
            boxShadow: "0 25px 60px rgba(0,0,0,0.2)"
          }}>
            <h2 style={{
              margin: "0 0 8px", fontSize: 18,
              fontWeight: 700, color: "#0f172a"
            }}>
              Reject Request
            </h2>
            <p style={{
              margin: "0 0 20px", fontSize: 13,
              color: "#64748b"
            }}>
              Please provide a reason for rejection
            </p>
            <form onSubmit={handleReject}>
              <label style={lbl}>
                Rejection Reason *
              </label>
              <textarea
                required
                value={rejectReason}
                onChange={e =>
                  setRejectReason(e.target.value)}
                placeholder="e.g. Insufficient raw materials..."
                style={{
                  ...inp, height: 90,
                  resize: "vertical",
                  marginBottom: 16
                }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button type="button"
                  onClick={() => {
                    setShowRejectModal(false)
                    setRejectReason("")
                  }}
                  style={{
                    flex: 1, padding: "9px",
                    borderRadius: 8,
                    border: "1.5px solid #e2e8f0",
                    background: "white",
                    cursor: "pointer", fontSize: 14,
                    color: "#475569", fontWeight: 500
                  }}>
                  Cancel
                </button>
                <button type="submit" style={{
                  flex: 1, padding: "9px",
                  borderRadius: 8, border: "none",
                  background: "#dc2626",
                  color: "white", cursor: "pointer",
                  fontSize: 14, fontWeight: 600
                }}>
                  Confirm Reject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
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
  fontWeight: 600, color: "#475569", marginBottom: 5
}
import { useState, useEffect } from "react"

const API = "http://localhost:8080"

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageError, setPageError] = useState("")
  const [success, setSuccess] = useState("")
  const [filter, setFilter] = useState("ALL")

  useEffect(() => { loadOrders() }, [filter])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const url = filter === "ALL"
        ? `${API}/api/purchase-orders`
        : `${API}/api/purchase-orders?status=${filter}`
      const res = await fetch(url)
      if (!res.ok) throw new Error("Failed")
      setOrders(await res.json())
      setPageError("")
    } catch {
      setPageError(
        "Cannot connect to backend. " +
        "Make sure Spring Boot is running on port 8080."
      )
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this PO?")) return
    try {
      const res = await fetch(
        `${API}/api/purchase-orders/${id}/approve`,
        { method: "PUT" }
      )
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed")
      }
      setSuccess("Purchase Order approved!")
      loadOrders()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setPageError(err.message)
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this PO?")) return
    try {
      const res = await fetch(
        `${API}/api/purchase-orders/${id}/cancel`,
        { method: "PUT" }
      )
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed")
      }
      setSuccess("Purchase Order cancelled.")
      loadOrders()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setPageError(err.message)
    }
  }

  // Status badge
  const StatusBadge = ({ status }) => {
    const config = {
      CREATED: { bg: "#eff6ff", color: "#2563eb" },
      APPROVED: { bg: "#f0fdf4", color: "#16a34a" },
      CANCELLED: { bg: "#f1f5f9", color: "#64748b" },
    }
    const c = config[status] || config.CREATED
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

  // Reason badge
  const ReasonBadge = ({ reason }) => {
    if (!reason) return <span style={{
      color: "#94a3b8", fontSize: 12
    }}>—</span>
    const config = {
      LOW_STOCK: { bg: "#fff7ed", color: "#ea580c" },
      PRODUCTION_SHORTAGE: {
        bg: "#fee2e2", color: "#dc2626"
      },
    }
    const c = config[reason] || config.LOW_STOCK
    return (
      <span style={{
        background: c.bg, color: c.color,
        padding: "3px 8px", borderRadius: 4,
        fontSize: 10, fontWeight: 700,
        letterSpacing: 0.3
      }}>
        {reason.replace(/_/g, " ")}
      </span>
    )
  }

  // Summary counts
  const created = orders.filter(
    o => o.status === "CREATED").length
  const approved = orders.filter(
    o => o.status === "APPROVED").length
  const cancelled = orders.filter(
    o => o.status === "CANCELLED").length

  return (
    <div style={{
      padding: 28, background: "#f8fafc",
      minHeight: "100vh"
    }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontSize: 24, fontWeight: 700,
          margin: 0, color: "#0f172a"
        }}>
          Purchase Orders
        </h1>
        <p style={{
          color: "#64748b", margin: "6px 0 0",
          fontSize: 14
        }}>
          Auto-generated purchase orders for stock
          replenishment
        </p>
      </div>

      {/* Error */}
      {pageError && (
        <div style={{
          background: "#fee2e2", color: "#dc2626",
          padding: "12px 16px", borderRadius: 8,
          marginBottom: 20, fontSize: 14,
          border: "1px solid #fecaca"
        }}>
          ⚠ {pageError}
        </div>
      )}

      {/* Success */}
      {success && (
        <div style={{
          background: "#f0fdf4", color: "#16a34a",
          padding: "12px 16px", borderRadius: 8,
          marginBottom: 20, fontSize: 14,
          border: "1px solid #bbf7d0"
        }}>
          ✓ {success}
        </div>
      )}

      {/* Summary cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16, marginBottom: 24
      }}>
        {[
          {
            label: "Open Orders",
            value: created,
            icon: "🔵",
            color: "#2563eb",
            bg: "#eff6ff"
          },
          {
            label: "Approved",
            value: approved,
            icon: "✅",
            color: "#16a34a",
            bg: "#f0fdf4"
          },
          {
            label: "Cancelled",
            value: cancelled,
            icon: "❌",
            color: "#64748b",
            bg: "#f1f5f9"
          },
        ].map(card => (
          <div key={card.label} style={{
            background: "white", borderRadius: 12,
            border: "1px solid #e2e8f0",
            padding: "18px 20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <p style={{
                  margin: 0, fontSize: 12,
                  color: "#64748b", fontWeight: 500
                }}>
                  {card.label}
                </p>
                <p style={{
                  margin: "6px 0 0", fontSize: 28,
                  fontWeight: 700, color: card.color
                }}>
                  {card.value}
                </p>
              </div>
              <span style={{ fontSize: 28 }}>
                {card.icon}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div style={{
        background: "white", borderRadius: 12,
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
      }}>

        {/* Filter toolbar */}
        <div style={{
          padding: "14px 20px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex", alignItems: "center",
          gap: 8
        }}>
          {["ALL", "CREATED", "APPROVED",
            "CANCELLED"].map(f => (
            <button key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 14px", borderRadius: 6,
                border: filter === f
                  ? "1.5px solid #2563eb"
                  : "1.5px solid #e2e8f0",
                background: filter === f
                  ? "#eff6ff" : "white",
                color: filter === f
                  ? "#2563eb" : "#64748b",
                cursor: "pointer", fontSize: 12,
                fontWeight: filter === f ? 600 : 500
              }}>
              {f}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div style={{
            padding: 60, textAlign: "center",
            color: "#94a3b8"
          }}>
            Loading purchase orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{
            padding: 60, textAlign: "center",
            color: "#94a3b8"
          }}>
            <div style={{
              fontSize: 40, marginBottom: 12
            }}>
              🛒
            </div>
            <p style={{
              fontSize: 14, fontWeight: 500
            }}>
              No purchase orders found
            </p>
            <p style={{
              fontSize: 13, marginTop: 6
            }}>
              Purchase orders are auto-generated when
              stock is low or production requests
              are approved with insufficient stock
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse"
            }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["PO NUMBER", "ITEM", "QTY",
                    "SUPPLIER", "REASON",
                    "STATUS", "DATE",
                    "ACTIONS"].map(h => (
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
                {orders.map(order => (
                  <tr key={order.id} style={{
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
                      fontSize: 12, fontWeight: 600,
                      color: "#2563eb",
                      fontFamily: "monospace"
                    }}>
                      {order.poNumber}
                    </td>
                    <td style={{
                      padding: "13px 16px",
                      fontSize: 14, fontWeight: 600,
                      color: "#0f172a"
                    }}>
                      {order.item?.name || "—"}
                    </td>
                    <td style={{
                      padding: "13px 16px",
                      fontSize: 14, fontWeight: 700,
                      color: "#0f172a"
                    }}>
                      {order.quantity}
                    </td>
                    <td style={{
                      padding: "13px 16px",
                      fontSize: 13, color: "#475569"
                    }}>
                      {order.supplierName || "—"}
                    </td>
                    <td style={{
                      padding: "13px 16px"
                    }}>
                      <ReasonBadge
                        reason={order.reason}
                      />
                    </td>
                    <td style={{
                      padding: "13px 16px"
                    }}>
                      <StatusBadge
                        status={order.status}
                      />
                    </td>
                    <td style={{
                      padding: "13px 16px",
                      fontSize: 12, color: "#94a3b8"
                    }}>
                      {order.createdAt
                        ? new Date(order.createdAt)
                            .toLocaleDateString()
                        : "—"}
                    </td>
                    <td style={{
                      padding: "13px 16px"
                    }}>
                      {order.status === "CREATED" ? (
                        <div style={{
                          display: "flex", gap: 6
                        }}>
                          <button
                            onClick={() =>
                              handleApprove(order.id)}
                            style={{
                              background: "#f0fdf4",
                              color: "#16a34a",
                              border: "1px solid #bbf7d0",
                              borderRadius: 6,
                              padding: "5px 10px",
                              cursor: "pointer",
                              fontSize: 12,
                              fontWeight: 600
                            }}>
                            ✓ Approve
                          </button>
                          <button
                            onClick={() =>
                              handleCancel(order.id)}
                            style={{
                              background: "#f1f5f9",
                              color: "#64748b",
                              border: "1px solid #e2e8f0",
                              borderRadius: 6,
                              padding: "5px 10px",
                              cursor: "pointer",
                              fontSize: 12,
                              fontWeight: 600
                            }}>
                            ✗ Cancel
                          </button>
                        </div>
                      ) : (
                        <span style={{
                          fontSize: 12, color: "#94a3b8"
                        }}>
                          {order.status === "APPROVED"
                            ? "Approved"
                            : "Cancelled"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {orders.length > 0 && (
          <div style={{
            padding: "10px 20px",
            borderTop: "1px solid #f1f5f9",
            fontSize: 12, color: "#94a3b8"
          }}>
            {orders.length} purchase order(s)
          </div>
        )}
      </div>
    </div>
  )
}
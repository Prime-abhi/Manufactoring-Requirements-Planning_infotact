import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const API = "http://localhost:8080"

export default function Dashboard() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState("")
  const [now, setNow]         = useState(new Date())
  const navigate              = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetch(`${API}/api/items`)
      .then((r) => { if (!r.ok) throw new Error("API error " + r.status); return r.json() })
      .then((data) => { setItems(data); setLoading(false) })
      .catch((e)  => { setError(e.message); setLoading(false) })
  }, [])

  // ── derived stats ──────────────────────────────────────────────────────────
  const total      = items.length
  const finished   = items.filter(i => i.itemType === "FINISHED_GOOD").length
  const raw        = items.filter(i => i.itemType === "RAW_MATERIAL").length
  const sub        = items.filter(i => i.itemType === "SUB_ASSEMBLY").length
  const lowStock   = items.filter(i => i.status   === "LOW_STOCK").length
  const available  = items.filter(i => i.status   === "AVAILABLE").length
  const critical   = items.filter(i =>
    (i.availableQuantity ?? 0) < (i.minimumStockLimit ?? 0) * 0.5 && i.status === "LOW_STOCK"
  ).length

  const healthPct  = total ? Math.round((available / total) * 100) : 0

  const lowStockItems = items
    .filter(i => i.status === "LOW_STOCK")
    .sort((a, b) => (a.availableQuantity ?? 0) - (b.availableQuantity ?? 0))
    .slice(0, 6)

  const dateStr = now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })

  // ── styles ────────────────────────────────────────────────────────────────
  const card = {
    background: "white", borderRadius: 14,
    padding: "20px 22px",
    boxShadow: "0 2px 12px rgba(15,23,42,0.07)",
    border: "1px solid #f1f5f9",
  }

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", flexDirection:"column", gap:12, color:"#64748b" }}>
      <div style={{ width:36, height:36, border:"3px solid #e2e8f0", borderTop:"3px solid #2563eb", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
      <span style={{ fontSize:14 }}>Loading dashboard…</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (error) return (
    <div style={{ padding:32 }}>
      <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10, padding:"16px 20px", color:"#dc2626", fontSize:14 }}>
        ⚠️ Failed to load dashboard: {error}
        <button onClick={() => window.location.reload()} style={{ marginLeft:16, padding:"4px 12px", borderRadius:6, border:"1px solid #dc2626", background:"white", color:"#dc2626", cursor:"pointer", fontSize:13 }}>
          Retry
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ padding:"24px 28px", background:"#f8fafc", minHeight:"100vh" }}>

      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <div style={{ ...card, display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22, padding:"18px 24px" }}>
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:"#2563eb", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>MRP Engine</div>
          <h1 style={{ margin:0, fontSize:24, fontWeight:800, color:"#0f172a" }}>Dashboard</h1>
          <div style={{ color:"#94a3b8", fontSize:13, marginTop:3 }}>{dateStr}</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          {/* Stock Health Pill */}
          <div style={{ textAlign:"center", background: healthPct >= 75 ? "#f0fdf4" : healthPct >= 50 ? "#fffbeb" : "#fef2f2", border:`1px solid ${healthPct >= 75 ? "#bbf7d0" : healthPct >= 50 ? "#fde68a" : "#fecaca"}`, borderRadius:10, padding:"8px 18px" }}>
            <div style={{ fontSize:22, fontWeight:800, color: healthPct >= 75 ? "#16a34a" : healthPct >= 50 ? "#d97706" : "#dc2626" }}>{healthPct}%</div>
            <div style={{ fontSize:11, color:"#64748b", fontWeight:600 }}>Stock Health</div>
          </div>
          <div style={{ width:44, height:44, borderRadius:22, background:"linear-gradient(135deg,#2563eb,#3b82f6)", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:16 }}>PM</div>
        </div>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        <KpiCard label="Total Items"    value={total}     icon="📦" color="#2563eb" bg="#eff6ff" border="#bfdbfe" />
        <KpiCard label="Available"      value={available} icon="✅" color="#16a34a" bg="#f0fdf4" border="#bbf7d0" />
        <KpiCard label="Low Stock"      value={lowStock}  icon="⚠️" color="#d97706" bg="#fffbeb" border="#fde68a" />
        <KpiCard label="Critical"       value={critical}  icon="🚨" color="#dc2626" bg="#fef2f2" border="#fecaca" />
      </div>

      {/* ── Type Breakdown + Health Bar ──────────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>

        {/* Item Type Breakdown */}
        <div style={card}>
          <div style={{ fontSize:14, fontWeight:700, color:"#0f172a", marginBottom:16 }}>📊 Item Type Breakdown</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <TypeBar label="Finished Goods" count={finished} total={total} color="#2563eb" bg="#eff6ff" />
            <TypeBar label="Raw Materials"  count={raw}      total={total} color="#d97706" bg="#fffbeb" />
            <TypeBar label="Sub Assemblies" count={sub}      total={total} color="#7c3aed" bg="#f5f3ff" />
          </div>
        </div>

        {/* Stock Health Overview */}
        <div style={card}>
          <div style={{ fontSize:14, fontWeight:700, color:"#0f172a", marginBottom:16 }}>🏥 Stock Health Overview</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <HealthRow label="Available"   count={available} total={total} color="#16a34a" />
            <HealthRow label="Low Stock"   count={lowStock - critical} total={total} color="#d97706" />
            <HealthRow label="Critical"    count={critical}  total={total} color="#dc2626" />
          </div>
          {/* Combined bar */}
          <div style={{ marginTop:14, height:10, borderRadius:5, overflow:"hidden", background:"#f1f5f9", display:"flex" }}>
            <div style={{ width:`${total ? (available/total)*100 : 0}%`, background:"#16a34a", transition:"width 0.6s" }} />
            <div style={{ width:`${total ? ((lowStock-critical)/total)*100 : 0}%`, background:"#f59e0b", transition:"width 0.6s" }} />
            <div style={{ width:`${total ? (critical/total)*100 : 0}%`, background:"#dc2626", transition:"width 0.6s" }} />
          </div>
        </div>
      </div>

      {/* ── Low Stock Alert Table + Quick Actions ─────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:14 }}>

        {/* Low Stock Table */}
        <div style={card}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#0f172a" }}>🚨 Low Stock Items</div>
            <button onClick={() => navigate("/inventory")} style={{ fontSize:12, color:"#2563eb", background:"#eff6ff", border:"none", padding:"4px 12px", borderRadius:6, cursor:"pointer", fontWeight:600 }}>
              View All →
            </button>
          </div>
          {lowStockItems.length === 0 ? (
            <div style={{ textAlign:"center", padding:"24px 0", color:"#94a3b8", fontSize:14 }}>
              ✅ All items are sufficiently stocked!
            </div>
          ) : (
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ background:"#f8fafc" }}>
                  {["Item","Type","Available","Min Stock","Status"].map(h => (
                    <th key={h} style={{ padding:"8px 12px", textAlign:"left", fontSize:11, fontWeight:700, color:"#64748b", borderBottom:"1px solid #e2e8f0" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item, i) => {
                  const isCrit = (item.availableQuantity ?? 0) < (item.minimumStockLimit ?? 0) * 0.5
                  return (
                    <tr key={item.id ?? i} style={{ borderBottom:"1px solid #f1f5f9" }}>
                      <td style={{ padding:"10px 12px", fontWeight:600, color:"#0f172a" }}>{item.name}</td>
                      <td style={{ padding:"10px 12px" }}>
                        <span style={{ fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:4,
                          background: item.itemType==="FINISHED_GOOD"?"#eff6ff":item.itemType==="SUB_ASSEMBLY"?"#f5f3ff":"#f1f5f9",
                          color:      item.itemType==="FINISHED_GOOD"?"#2563eb":item.itemType==="SUB_ASSEMBLY"?"#7c3aed":"#475569"
                        }}>
                          {(item.itemType ?? "").replace(/_/g," ")}
                        </span>
                      </td>
                      <td style={{ padding:"10px 12px", color: isCrit?"#dc2626":"#d97706", fontWeight:700 }}>{item.availableQuantity ?? 0}</td>
                      <td style={{ padding:"10px 12px", color:"#64748b" }}>{item.minimumStockLimit ?? 0}</td>
                      <td style={{ padding:"10px 12px" }}>
                        <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20,
                          background: isCrit?"#fee2e2":"#fef3c7",
                          color:      isCrit?"#dc2626":"#d97706"
                        }}>
                          {isCrit ? "🚨 CRITICAL" : "⚠ LOW"}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick Actions */}
        <div style={card}>
          <div style={{ fontSize:14, fontWeight:700, color:"#0f172a", marginBottom:14 }}>⚡ Quick Actions</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <QuickAction icon="📦" label="Manage Items"        sub="Add, edit or remove items"          color="#2563eb" bg="#eff6ff" onClick={() => navigate("/items")} />
            <QuickAction icon="🌳" label="BOM Tree"            sub="View bill of materials"             color="#7c3aed" bg="#f5f3ff" onClick={() => navigate("/bom")} />
            <QuickAction icon="🏭" label="Inventory Status"    sub="Check real-time stock levels"       color="#0891b2" bg="#ecfeff" onClick={() => navigate("/inventory")} />
            <QuickAction icon="📊" label="MRP Explosion"       sub="Calculate material requirements"    color="#d97706" bg="#fffbeb" onClick={() => navigate("/mrp")} />
          </div>
        </div>
      </div>

    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function KpiCard({ label, value, icon, color, bg, border }) {
  return (
    <div style={{ background: bg, border:`1px solid ${border}`, borderRadius:12, padding:"18px 20px", display:"flex", alignItems:"center", gap:14 }}>
      <div style={{ width:44, height:44, borderRadius:10, background:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", flexShrink:0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize:28, fontWeight:800, color, lineHeight:1 }}>{value}</div>
        <div style={{ fontSize:12, color:"#64748b", marginTop:4, fontWeight:500 }}>{label}</div>
      </div>
    </div>
  )
}

function TypeBar({ label, count, total, color, bg }) {
  const pct = total ? Math.round((count / total) * 100) : 0
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, fontSize:13 }}>
        <span style={{ fontWeight:500, color:"#334155" }}>{label}</span>
        <span style={{ fontWeight:700, color }}>{count} <span style={{ color:"#94a3b8", fontWeight:400 }}>({pct}%)</span></span>
      </div>
      <div style={{ height:8, borderRadius:4, background:"#f1f5f9", overflow:"hidden" }}>
        <div style={{ width:`${pct}%`, height:"100%", background:color, borderRadius:4, transition:"width 0.6s" }} />
      </div>
    </div>
  )
}

function HealthRow({ label, count, total, color }) {
  const pct = total ? Math.round((count / total) * 100) : 0
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:13 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ width:10, height:10, borderRadius:"50%", background:color, flexShrink:0 }} />
        <span style={{ color:"#334155" }}>{label}</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontWeight:700, color }}>{count}</span>
        <span style={{ fontSize:11, color:"#94a3b8" }}>{pct}%</span>
      </div>
    </div>
  )
}

function QuickAction({ icon, label, sub, color, bg, onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display:"flex", alignItems:"center", gap:12, width:"100%",
        padding:"12px 14px", borderRadius:10, border:`1px solid ${hover ? color+"33" : "#e2e8f0"}`,
        background: hover ? bg : "white", cursor:"pointer", textAlign:"left",
        transition:"all 0.15s",
      }}
    >
      <div style={{ width:38, height:38, borderRadius:8, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize:13, fontWeight:700, color: hover ? color : "#0f172a" }}>{label}</div>
        <div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>{sub}</div>
      </div>
      <div style={{ marginLeft:"auto", color: hover ? color : "#cbd5e1", fontSize:16 }}>→</div>
    </button>
  )
}

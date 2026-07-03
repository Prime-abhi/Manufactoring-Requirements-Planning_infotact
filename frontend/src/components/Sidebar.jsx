import { useNavigate, useLocation } from "react-router-dom"

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  // Get user from localStorage
  const user = JSON.parse(
    localStorage.getItem("mrp_user") || "null")
  const role = user?.role || ""
  const isManager = role === "PRODUCTION_MANAGER"

  // Menu items — Purchase Orders only for Manager
  const menuItems = [
    { label: "Dashboard", path: "/dashboard",
      icon: "📊" },
    { label: "Items", path: "/items",
      icon: "📦" },
    { label: "BOM Tree", path: "/bom",
      icon: "🌳" },
    { label: "MRP Explosion", path: "/mrp-explosion",
      icon: "⚡" },
    { label: "Inventory Status", path: "/inventory",
      icon: "🏭" },
    { label: "Production Requests",
      path: "/production-requests", icon: "📋" },
    // Only show Purchase Orders to Manager
    ...(isManager ? [{
      label: "Purchase Orders",
      path: "/purchase-orders", icon: "🛒"
    }] : []),
  ]

  const handleLogout = () => {
    localStorage.removeItem("mrp_user")
    navigate("/login")
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100vh", color: "white"
    }}>

      {/* Logo */}
      <div style={{
        padding: "20px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.1)"
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10
        }}>
          <div style={{
            background: "#2563eb", borderRadius: 8,
            width: 36, height: 36,
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 18
          }}>
            🏭
          </div>
          <div>
            <div style={{
              fontSize: 15, fontWeight: 700,
              color: "white"
            }}>
              MRP Engine
            </div>
            <div style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.5)"
            }}>
              Manufacturing
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "12px 8px" }}>
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex", alignItems: "center",
                gap: 10, width: "100%",
                padding: "9px 12px", borderRadius: 6,
                border: "none", cursor: "pointer",
                marginBottom: 2, textAlign: "left",
                background: isActive
                  ? "#2563eb" : "transparent",
                color: isActive
                  ? "white"
                  : "rgba(255,255,255,0.7)",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
              }}
              onMouseEnter={e => {
                if (!isActive)
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.08)"
              }}
              onMouseLeave={e => {
                if (!isActive)
                  e.currentTarget.style.background =
                    "transparent"
              }}
            >
              <span style={{ fontSize: 16 }}>
                {item.icon}
              </span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* User info + Logout */}
      <div style={{
        padding: "16px",
        borderTop: "1px solid rgba(255,255,255,0.1)"
      }}>
        <div style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.5)",
          marginBottom: 2
        }}>
          Logged in as
        </div>
        <div style={{
          fontSize: 13, color: "white",
          fontWeight: 600, marginBottom: 4
        }}>
          {user?.name || "User"}
        </div>
        <div style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.5)",
          marginBottom: 12
        }}>
          {user?.email || ""}
        </div>
        <button onClick={handleLogout} style={{
          width: "100%", padding: "8px",
          borderRadius: 6,
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.08)",
          color: "white", cursor: "pointer",
          fontSize: 13, fontWeight: 500,
          display: "flex", alignItems: "center",
          justifyContent: "center", gap: 6
        }}>
          🚪 Logout
        </button>
      </div>
    </div>
  )
}
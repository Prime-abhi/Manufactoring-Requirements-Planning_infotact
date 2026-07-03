import { useState } from "react"
import { useNavigate } from "react-router-dom"

const API = "http://localhost:8080"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Please enter email and password")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch(
        `${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(
          err.error || "Invalid credentials")
      }

      const data = await res.json()

      // Save user to localStorage
      localStorage.setItem(
        "mrp_user", JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role
        })
      )

      // Redirect to dashboard
      navigate("/dashboard")

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#1e2a45",
      display: "flex", alignItems: "center",
      justifyContent: "center", padding: 20
    }}>
      <div style={{
        background: "white", borderRadius: 16,
        padding: "40px 36px", width: "100%",
        maxWidth: 420,
        boxShadow: "0 25px 60px rgba(0,0,0,0.3)"
      }}>

        {/* Logo */}
        <div style={{
          textAlign: "center", marginBottom: 28
        }}>
          <div style={{
            width: 64, height: 64,
            background: "#eff6ff",
            borderRadius: 16, margin: "0 auto 16px",
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 32
          }}>
            🏭
          </div>
          <h1 style={{
            margin: 0, fontSize: 24,
            fontWeight: 700, color: "#0f172a"
          }}>
            MRP Engine
          </h1>
          <p style={{
            margin: "6px 0 0", fontSize: 14,
            color: "#64748b"
          }}>
            Manufacturing Requirements Planning
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            background: "#fee2e2", color: "#dc2626",
            padding: "10px 14px", borderRadius: 8,
            marginBottom: 20, fontSize: 13,
            border: "1px solid #fecaca",
            textAlign: "center"
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. planner@mrp.com"
              style={inp}
              autoFocus
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={lbl}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e =>
                  setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{
                  ...inp, paddingRight: 44
                }}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12, top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none",
                  cursor: "pointer", fontSize: 16,
                  color: "#94a3b8"
                }}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "11px",
              borderRadius: 8, border: "none",
              background: loading
                ? "#93c5fd" : "#2563eb",
              color: "white", cursor: loading
                ? "not-allowed" : "pointer",
              fontSize: 15, fontWeight: 600,
              marginBottom: 20
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Demo credentials */}
        <div style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 10, padding: "14px 16px"
        }}>
          <p style={{
            margin: "0 0 10px", fontSize: 12,
            fontWeight: 700, color: "#475569",
            textTransform: "uppercase",
            letterSpacing: 0.5
          }}>
            Demo Credentials
          </p>
          {[
            {
              role: "Planner",
              email: "planner@mrp.com",
              password: "planner123",
              color: "#2563eb",
              bg: "#eff6ff"
            },
            {
              role: "Manager",
              email: "manager@mrp.com",
              password: "manager123",
              color: "#16a34a",
              bg: "#f0fdf4"
            },
          ].map(cred => (
            <div
              key={cred.role}
              onClick={() => {
                setEmail(cred.email)
                setPassword(cred.password)
                setError("")
              }}
              style={{
                background: cred.bg,
                border: `1px solid ${cred.color}22`,
                borderRadius: 6, padding: "8px 12px",
                marginBottom: 8, cursor: "pointer",
                transition: "opacity 0.15s"
              }}
              title="Click to fill credentials"
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: cred.color
                }}>
                  {cred.role.toUpperCase()}
                </span>
                <span style={{
                  fontSize: 10, color: "#94a3b8"
                }}>
                  click to fill
                </span>
              </div>
              <div style={{
                fontSize: 12, color: "#475569",
                marginTop: 2
              }}>
                {cred.email} / {cred.password}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const inp = {
  width: "100%", padding: "10px 12px",
  borderRadius: 8, border: "1.5px solid #e2e8f0",
  fontSize: 14, outline: "none",
  color: "#1e293b", background: "white",
  boxSizing: "border-box",
  transition: "border-color 0.15s"
}

const lbl = {
  display: "block", fontSize: 12,
  fontWeight: 600, color: "#475569",
  marginBottom: 6
}
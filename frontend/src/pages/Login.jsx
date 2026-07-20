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
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20
    }}>
      <div style={{
        background: "white",
        borderRadius: 16,
        padding: "40px 36px",
        width: "100%",
        maxWidth: 420,
        boxShadow: "0 25px 60px rgba(0,0,0,0.3)"
      }}>

        {/* Logo */}
        <div style={{
          textAlign: "center",
          marginBottom: 32
        }}>
          <div style={{
            width: 64, height: 64,
            background: "#eff6ff",
            borderRadius: 16,
            margin: "0 auto 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32
          }}>
            🏭
          </div>
          <h1 style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 700,
            color: "#0f172a"
          }}>
            MRP Engine
          </h1>
          <p style={{
            margin: "6px 0 0",
            fontSize: 14,
            color: "#64748b"
          }}>
            Manufacturing Requirements Planning
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            background: "#fee2e2",
            color: "#dc2626",
            padding: "10px 14px",
            borderRadius: 8,
            marginBottom: 20,
            fontSize: 13,
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
            <label style={lbl}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={inp}
              autoFocus
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 28 }}>
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
              {/* Show/hide password toggle */}
              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
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
              width: "100%",
              padding: "12px",
              borderRadius: 8,
              border: "none",
              background: loading
                ? "#93c5fd" : "#2563eb",
              color: "white",
              cursor: loading
                ? "not-allowed" : "pointer",
              fontSize: 15,
              fontWeight: 600,
              transition: "background 0.15s"
            }}
          >
            {loading ? "Logging in..." : "Login →"}
          </button>

        </form>

        {/* Footer note */}
        <p style={{
          textAlign: "center",
          fontSize: 12,
          color: "#94a3b8",
          marginTop: 24,
          marginBottom: 0
        }}>
          Contact your administrator if you
          don't have login credentials
        </p>

      </div>
    </div>
  )
}

// Shared styles
const inp = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1.5px solid #e2e8f0",
  fontSize: 14,
  outline: "none",
  color: "#1e293b",
  background: "white",
  boxSizing: "border-box",
  transition: "border-color 0.15s"
}

const lbl = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#475569",
  marginBottom: 6
}
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import Items from "./pages/Items"
import Bom from "./pages/Bom"
import InventoryStatus from "./pages/InventoryStatus"
import ProductionRequests from "./pages/ProductionRequests"
import PurchaseOrders from "./pages/PurchaseOrders"

function Layout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{
        width: 240, background: "#1e2a45",
        flexShrink: 0, position: "fixed",
        top: 0, left: 0, height: "100vh",
        overflowY: "auto"
      }}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div style={{
        marginLeft: 240, flex: 1,
        background: "#f8fafc", minHeight: "100vh"
      }}>
        {children}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={
          <Layout><Dashboard /></Layout>
        } />
        <Route path="/dashboard" element={
          <Layout><Dashboard /></Layout>
        } />
        <Route path="/items" element={
          <Layout><Items /></Layout>
        } />
        <Route path="/bom" element={
          <Layout><Bom /></Layout>
        } />
        <Route path="/inventory" element={
          <Layout><InventoryStatus /></Layout>
        } />
        <Route path="/production-requests" element={
          <Layout><ProductionRequests /></Layout>
        } />
        <Route path="/purchase-orders" element={
          <Layout><PurchaseOrders /></Layout>
        } />
        {/* Catch all → redirect to dashboard */}
        <Route path="*" element={
          <Navigate to="/" replace />
        } />
      </Routes>
    </BrowserRouter>
  )
}
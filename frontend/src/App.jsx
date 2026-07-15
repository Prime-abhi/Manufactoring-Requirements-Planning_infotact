import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Items from "./pages/Items"
import Bom from "./pages/Bom"
import InventoryStatus from "./pages/InventoryStatus"
import ProductionRequests from "./pages/ProductionRequests"
import PurchaseOrders from "./pages/PurchaseOrders"
import MrpExplosion from "./pages/MrpExplosion"  // ← ADD THIS

function Layout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{
        width: 240, background: "#1e2a45",
        flexShrink: 0, position: "fixed",
        top: 0, left: 0, height: "100vh",
        overflowY: "auto"
      }}>
        <Sidebar />
      </div>
      <div style={{
        marginLeft: 240, flex: 1,
        background: "#f8fafc", minHeight: "100vh"
      }}>
        {children}
      </div>
    </div>
  )
}

function Protected({ children }) {
  const user = JSON.parse(
    localStorage.getItem("mrp_user") || "null")
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <Protected>
            <Layout><Dashboard /></Layout>
          </Protected>
        } />
        <Route path="/dashboard" element={
          <Protected>
            <Layout><Dashboard /></Layout>
          </Protected>
        } />
        <Route path="/items" element={
          <Protected>
            <Layout><Items /></Layout>
          </Protected>
        } />
        <Route path="/bom" element={
          <Protected>
            <Layout><Bom /></Layout>
          </Protected>
        } />
        <Route path="/inventory" element={
          <Protected>
            <Layout><InventoryStatus /></Layout>
          </Protected>
        } />

        {/* ← ADD THIS ROUTE */}
        <Route path="/mrp-explosion" element={
          <Protected>
            <Layout><MrpExplosion /></Layout>
          </Protected>
        } />

        <Route path="/production-requests" element={
          <Protected>
            <Layout><ProductionRequests /></Layout>
          </Protected>
        } />
        <Route path="/purchase-orders" element={
          <Protected>
            <Layout><PurchaseOrders /></Layout>
          </Protected>
        } />
        <Route path="*" element={
          <Navigate to="/login" replace />
        } />
      </Routes>
    </BrowserRouter>
  )
}
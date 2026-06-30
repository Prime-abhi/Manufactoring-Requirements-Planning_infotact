import SummaryCard from "../components/SummaryCard"
import RecentRunsTable from "../components/RecentRunsTable"
import LowStockTable from "../components/LowStockTable"

export default function Dashboard() {
  return (
    <div style={{ padding: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <div style={{ color: '#64748b', marginTop: 6 }}>Overview of production planning, inventory health, and recent activity.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 14, color: '#64748b' }}>Production Manager</div>
          <div style={{ width: 36, height: 36, borderRadius: 18, background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>PM</div>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 22 }}>
        <SummaryCard label="Total Items" value={25} icon={(<span style={{fontSize:18}}>📦</span>)} color="blue" />
        <SummaryCard label="Finished Goods" value={4} icon={(<span style={{fontSize:18}}>✅</span>)} color="green" />
        <SummaryCard label="Raw Materials" value={16} icon={(<span style={{fontSize:18}}>🧰</span>)} color="orange" />
        <SummaryCard label="Low Stock Items" value={5} icon={(<span style={{fontSize:18}}>⚠️</span>)} color="red" />
      </div>

      {/* Main panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 18 }}>
        <div style={{ background: 'white', borderRadius: 10, padding: 16, boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)' }}>
          <RecentRunsTable />
        </div>

        <div style={{ background: 'white', borderRadius: 10, padding: 16, boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)' }}>
          <LowStockTable />
        </div>
      </div>
    </div>
  )
}
export default function SummaryCard({ label, value, color = 'blue', icon }) {
  const colorMap = {
    blue:   { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', iconBg: '#dbeafe' },
    red:    { bg: '#fef2f2', border: '#fecaca', text: '#dc2626', iconBg: '#fee2e2' },
    orange: { bg: '#fff7ed', border: '#fed7aa', text: '#ea580c', iconBg: '#ffedd5' },
    green:  { bg: '#f0fdf4', border: '#bbf7d0', text: '#16a34a', iconBg: '#dcfce7' },
  }
  const c = colorMap[color] ?? colorMap.blue

  return (
    <div style={{
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: 14,
      padding: '18px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      minWidth: 180,
      flex: 1,
      boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)',
    }}>
      {icon && (
        <div style={{
          background: c.iconBg,
          borderRadius: 12,
          width: 44, height: 44,
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 20,
          flexShrink: 0,
        }}>
          {icon}
        </div>
      )}
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, color: c.text, lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: 13, color: '#475569', marginTop: 4, fontWeight: 600 }}>
          {label}
        </div>
      </div>
    </div>
  )
}

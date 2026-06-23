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
      borderRadius: 10,
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      minWidth: 160,
      flex: 1,
    }}>
      {icon && (
        <div style={{
          background: c.iconBg,
          borderRadius: 8,
          width: 40, height: 40,
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 20,
          flexShrink: 0,
        }}>
          {icon}
        </div>
      )}
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, color: c.text, lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
          {label}
        </div>
      </div>
    </div>
  )
}

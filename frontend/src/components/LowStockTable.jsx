export default function LowStockTable({ items = [] }) {
	return (
		<div>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
				<h2 style={{ margin: 0, fontSize: 18 }}>Low Stock Materials</h2>
				<span style={{ fontSize: 12, color: '#dc2626' }}>Needs attention</span>
			</div>
			<table style={{ width: '100%', borderCollapse: 'collapse' }}>
				<thead style={{ textAlign: 'left', color: '#94a3b8', fontSize: 12, letterSpacing: '0.04em' }}>
					<tr>
						<th style={{ padding: '12px 10px', fontWeight: 700 }}>MATERIAL</th>
						<th style={{ padding: '12px 10px', fontWeight: 700 }}>AVAILABLE QTY</th>
						<th style={{ padding: '12px 10px', fontWeight: 700 }}>REORDER LEVEL</th>
						<th style={{ padding: '12px 10px', fontWeight: 700 }}>STATUS</th>
					</tr>
				</thead>
				<tbody>
					{items.length === 0 ? (
						<tr>
							<td colSpan="4" style={{ padding: '16px 10px', color: '#64748b' }}>No low stock items.</td>
						</tr>
					) : items.map((it, i) => (
						<tr key={i} style={{ borderTop: '1px solid #fee2e2', background: '#fff5f5' }}>
							<td style={{ padding: '14px 10px', fontWeight: 700 }}>{it.material}</td>
							<td style={{ padding: '14px 10px', color: '#334155' }}>{it.available}</td>
							<td style={{ padding: '14px 10px', color: '#334155' }}>{it.reorder}</td>
							<td style={{ padding: '14px 10px' }}>
								<span style={{ display: 'inline-block', background: '#fee2e2', color: '#dc2626', padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>● {it.status}</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

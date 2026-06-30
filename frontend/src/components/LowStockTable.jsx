export default function LowStockTable() {
	const items = [
		{ material: 'Tyre', available: 50, reorder: 100 },
		{ material: 'Spoke', available: 1000, reorder: 2000 },
		{ material: 'Frame', available: 20, reorder: 50 },
	]

	return (
		<div>
			<h2 style={{ marginTop: 0, marginBottom: 12 }}>Low Stock Materials</h2>
			<table style={{ width: '100%', borderCollapse: 'collapse' }}>
				<thead style={{ textAlign: 'left', color: '#94a3b8', fontSize: 13 }}>
					<tr>
						<th style={{ padding: '12px 10px' }}>MATERIAL</th>
						<th style={{ padding: '12px 10px' }}>AVAILABLE QTY</th>
						<th style={{ padding: '12px 10px' }}>REORDER LEVEL</th>
						<th style={{ padding: '12px 10px' }}>STATUS</th>
					</tr>
				</thead>
				<tbody>
					{items.map((it, i) => (
						<tr key={i} style={{ borderTop: '1px solid #fee2e2', background: '#fff5f5' }}>
							<td style={{ padding: '14px 10px', fontWeight: 700 }}>{it.material}</td>
							<td style={{ padding: '14px 10px' }}>{it.available}</td>
							<td style={{ padding: '14px 10px' }}>{it.reorder}</td>
							<td style={{ padding: '14px 10px' }}>
								<span style={{ display: 'inline-block', background: '#fee2e2', color: '#dc2626', padding: '6px 12px', borderRadius: 20, fontSize: 13 }}>● Low Stock</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default function RecentRunsTable({ runs = [] }) {
	return (
		<div>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
				<h2 style={{ margin: 0, fontSize: 18 }}>Recent MRP Runs</h2>
				<span style={{ fontSize: 12, color: '#64748b' }}>Latest production activity</span>
			</div>
			<table style={{ width: '100%', borderCollapse: 'collapse' }}>
				<thead style={{ textAlign: 'left', color: '#94a3b8', fontSize: 12, letterSpacing: '0.04em' }}>
					<tr>
						<th style={{ padding: '12px 10px', fontWeight: 700 }}>PRODUCT</th>
						<th style={{ padding: '12px 10px', width: 120, fontWeight: 700 }}>QUANTITY</th>
						<th style={{ padding: '12px 10px', width: 140, fontWeight: 700 }}>RESULT</th>
						<th style={{ padding: '12px 10px', width: 120, fontWeight: 700 }}>DATE</th>
					</tr>
				</thead>
				<tbody>
					{runs.length === 0 ? (
						<tr>
							<td colSpan="4" style={{ padding: '16px 10px', color: '#64748b' }}>No recent runs available.</td>
						</tr>
					) : runs.map((r, i) => (
						<tr key={i} style={{ borderTop: '1px solid #eef2f7' }}>
							<td style={{ padding: '14px 10px', fontWeight: 700 }}>{r.product}</td>
							<td style={{ padding: '14px 10px', color: '#334155' }}>{r.qty}</td>
							<td style={{ padding: '14px 10px' }}>
								<span style={{ display: 'inline-block', background: '#ecfdf5', color: '#16a34a', padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>● {r.result}</span>
							</td>
							<td style={{ padding: '14px 10px', color: '#64748b' }}>{r.date}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

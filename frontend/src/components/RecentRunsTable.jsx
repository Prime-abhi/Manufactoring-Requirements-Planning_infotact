export default function RecentRunsTable() {
	const runs = [
		{ product: 'Bicycle', qty: 100, result: 'Completed', date: '06-06-2026' },
		{ product: 'Office Chair', qty: 50, result: 'Completed', date: '06-06-2026' },
		{ product: 'Standing Desk', qty: 30, result: 'Completed', date: '05-06-2026' },
	]

	return (
		<div>
			<h2 style={{ marginTop: 0, marginBottom: 12 }}>Recent MRP Runs</h2>
			<table style={{ width: '100%', borderCollapse: 'collapse' }}>
				<thead style={{ textAlign: 'left', color: '#94a3b8', fontSize: 13 }}>
					<tr>
						<th style={{ padding: '12px 10px' }}>PRODUCT</th>
						<th style={{ padding: '12px 10px', width: 120 }}>QUANTITY</th>
						<th style={{ padding: '12px 10px', width: 140 }}>RESULT</th>
						<th style={{ padding: '12px 10px', width: 120 }}>DATE</th>
					</tr>
				</thead>
				<tbody>
					{runs.map((r, i) => (
						<tr key={i} style={{ borderTop: '1px solid #eef2f7' }}>
							<td style={{ padding: '14px 10px', fontWeight: 600 }}>{r.product}</td>
							<td style={{ padding: '14px 10px' }}>{r.qty}</td>
							<td style={{ padding: '14px 10px' }}>
								<span style={{ display: 'inline-block', background: '#ecfdf5', color: '#16a34a', padding: '6px 12px', borderRadius: 20, fontSize: 13 }}>● {r.result}</span>
							</td>
							<td style={{ padding: '14px 10px', color: '#64748b' }}>{r.date}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

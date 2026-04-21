import React, { useState } from 'react';
import { BUSINESS_TYPES } from '../utils/constants';

const HistoryPage = ({ history }) => {
    const [filter, setFilter] = useState('');
    const filtered = history.filter(h =>
        BUSINESS_TYPES[h.business_type]?.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="flex-col gap-6" style={{padding: '32px'}}>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <span className="section-label" style={{ marginBottom: 0 }}>Audit History</span>
                    <input
                        placeholder="Filter by business type..."
                        style={{ width: '240px' }}
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                    />
                </div>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                        <tr>
                            <th style={{textAlign: 'left', padding: '12px', borderBottom: '1px solid #eee', fontSize: '12px', color: '#64748b'}}>#</th>
                            <th style={{textAlign: 'left', padding: '12px', borderBottom: '1px solid #eee', fontSize: '12px', color: '#64748b'}}>Business Type</th>
                            <th style={{textAlign: 'left', padding: '12px', borderBottom: '1px solid #eee', fontSize: '12px', color: '#64748b'}}>Requested</th>
                            <th style={{textAlign: 'left', padding: '12px', borderBottom: '1px solid #eee', fontSize: '12px', color: '#64748b'}}>Score</th>
                            <th style={{textAlign: 'left', padding: '12px', borderBottom: '1px solid #eee', fontSize: '12px', color: '#64748b'}}>Grade</th>
                            <th style={{textAlign: 'left', padding: '12px', borderBottom: '1px solid #eee', fontSize: '12px', color: '#64748b'}}>Risk</th>
                            <th style={{textAlign: 'left', padding: '12px', borderBottom: '1px solid #eee', fontSize: '12px', color: '#64748b'}}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map((h, i) => (
                            <tr key={i}>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{history.length - i}</td>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee', fontWeight: 500}}>{BUSINESS_TYPES[h.business_type]}</td>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>₹{(h.loan_amount_inr / 1000).toFixed(0)}k</td>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{h.score}</td>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee'}}><span className="badge" style={{ background: `${h.color}11`, color: h.color, border: `0.5px solid ${h.color}` }}>{h.grade}</span></td>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee', color: h.color, fontWeight: 500}}>{h.risk}</td>
                                <td style={{padding: '12px', borderBottom: '1px solid #eee', color: '#64748b'}}>{h.date}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" style={{textAlign: 'center', padding: '40px', color: '#999'}}>No history found matching filters.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoryPage;

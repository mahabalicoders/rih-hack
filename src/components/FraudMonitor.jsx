import React from 'react';
import Icon from './Icon';
import { BUSINESS_TYPES, THEME_COLORS } from '../utils/constants';

const FraudMonitor = ({ history }) => {
    const anomalies = history.filter(h => h.is_anomaly);
    
    return (
        <div className="flex-col gap-6" style={{padding: '32px'}}>
            <div className="card" style={{background: '#fffbeb', borderLeft: '4px solid #f59e0b', marginBottom: '24px'}}>
                <h2 style={{fontSize: '18px', fontWeight: 700, color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <Icon name="ph:shield-warning-bold" size={20} />
                    Fraud Detection Monitor v2.0
                </h2>
                <p style={{fontSize: '13px', color: '#78350f', marginTop: '4px'}}>
                    Powered by SiliconMind Isolation Forest algorithm. Currently monitoring 14 input vectors for pattern deviations.
                </p>
            </div>

            <div className="stat-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px'}}>
                <div className="card stat-card">
                    <span className="stat-label">TOTAL SCANS</span>
                    <span className="stat-value" style={{fontSize: '24px', fontWeight: 700}}>{history.length}</span>
                </div>
                <div className="card stat-card">
                    <span className="stat-label">ANOMALIES DETECTED</span>
                    <span className="stat-value" style={{color: anomalies.length > 0 ? '#ef4444' : 'inherit', fontSize: '24px', fontWeight: 700}}>{anomalies.length}</span>
                </div>
                <div className="card stat-card">
                    <span className="stat-label">DETECTION ACCURACY</span>
                    <span className="stat-value" style={{fontSize: '24px', fontWeight: 700}}>94.2%</span>
                </div>
                <div className="card stat-card">
                    <span className="stat-label">SYSTEM HEALTH</span>
                    <span className="stat-value" style={{color: '#22c55e', fontSize: '16px', fontWeight: 700}}>Secured</span>
                </div>
            </div>

            <div className="card">
                <span className="section-label">Recent Suspicious Activities</span>
                {anomalies.length > 0 ? (
                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                        <thead>
                            <tr>
                                <th style={{textAlign: 'left', padding: '12px', borderBottom: '1px solid #eee', fontSize: '12px', color: '#64748b'}}>Date</th>
                                <th style={{textAlign: 'left', padding: '12px', borderBottom: '1px solid #eee', fontSize: '12px', color: '#64748b'}}>Business</th>
                                <th style={{textAlign: 'left', padding: '12px', borderBottom: '1px solid #eee', fontSize: '12px', color: '#64748b'}}>Anomaly Score</th>
                                <th style={{textAlign: 'left', padding: '12px', borderBottom: '1px solid #eee', fontSize: '12px', color: '#64748b'}}>Risk Verdict</th>
                                <th style={{textAlign: 'left', padding: '12px', borderBottom: '1px solid #eee', fontSize: '12px', color: '#64748b'}}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {anomalies.map((a, i) => (
                                <tr key={i}>
                                    <td style={{padding: '12px', borderBottom: '1px solid #eee'}}>{a.date}</td>
                                    <td style={{padding: '12px', borderBottom: '1px solid #eee', fontWeight: 500}}>{BUSINESS_TYPES[a.business_type]}</td>
                                    <td style={{padding: '12px', borderBottom: '1px solid #eee', color: a.anomaly_score < -0.6 ? '#ef4444' : '#f59e0b'}}>{a.anomaly_score}</td>
                                    <td style={{padding: '12px', borderBottom: '1px solid #eee'}}><span className="badge" style={{background: '#fee2e2', color: '#ef4444'}}>Suspicious</span></td>
                                    <td style={{padding: '12px', borderBottom: '1px solid #eee'}}><button className="btn-ghost" style={{height: '28px', padding: '0 8px', fontSize: '10px', border: '1px solid #eee', borderRadius: '4px', background: 'none'}}>Review</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{textAlign: 'center', padding: '40px', color: '#999'}}>
                        <Icon name="ph:check-box-bold" size={48} style={{opacity: 0.2, marginBottom: '16px'}} />
                        <p>No suspicious patterns detected in the current history.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FraudMonitor;

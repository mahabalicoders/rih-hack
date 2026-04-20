import React, { useState } from 'react';
import WhatIfSimulator from './WhatIfSimulator';

// ─────────────────────────────────────────────────────────────────────────────
//  AnomalyBanner — renders above the score card when is_anomaly === true.
//  Uses .anomaly-banner CSS class (index.css) which inherits --warning-color
//  (amber) and --error-color (red) from the existing design token system.
//  The "critical" modifier triggers red styling for the most severe scores.
// ─────────────────────────────────────────────────────────────────────────────
const AnomalyBanner = ({ anomalyScore, anomalyMessage }) => {
    const isCritical = anomalyScore < -0.6;
    return (
        <div className={`anomaly-banner${isCritical ? ' critical' : ''}`}>
            <span className="anomaly-banner__icon">{isCritical ? '🚨' : '⚠️'}</span>
            <div className="anomaly-banner__body">
                <span className="anomaly-banner__title">
                    System Alert: Unusual Data Pattern Detected. Manual Review Recommended.
                </span>
                <span className="anomaly-banner__message">
                    {anomalyMessage || 'Suspicious input pattern detected. Review required.'}
                </span>
                <span className="anomaly-banner__score">
                    Anomaly Score: {anomalyScore} (threshold: −0.05)
                </span>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
//  BACKEND URL — change this if your Flask server runs on a different port
// ─────────────────────────────────────────────────────────────────────────────
const BACKEND_URL = 'http://localhost:5000';

const Dashboard = ({ user, onLogout }) => {
    // ── Form state maps directly to the 14-feature backend schema ──────────
    const [formData, setFormData] = useState({
        // Core loan details
        term:              12,
        loan_amount_inr:   500000,
        employees:         5,
        business_type:     1,
        is_urban:          1,
        is_existing:       0,
        // Digital / compliance signals
        upi_monthly_txn:   150,
        gst_registered:    1,
        gst_filing_score:  7,
        whatsapp_business: 1,
        has_website:       1,
        social_score:      6,
        mobile_banking_score: 7,
        aadhaar_linked:    1
    });

    const [result,      setResult]      = useState(null);
    const [anomalyData, setAnomalyData] = useState(null);
    const [history,     setHistory]     = useState([]);
    const [isAssessing, setIsAssessing] = useState(false);
    const [apiError,    setApiError]    = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
    };

    // ── Assess — calls Flask /score endpoint ─────────────────────────────
    const assess = async () => {
        setIsAssessing(true);
        setApiError(null);
        setAnomalyData(null);

        try {
            const response = await fetch(`${BACKEND_URL}/score`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(formData)
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || `Server error ${response.status}`);
            }

            const data = await response.json();

            if (data.status !== 'success') {
                throw new Error(data.message || 'Unknown error from server');
            }

            // ── Extract anomaly data (V2.0) ────────────────────────────
            setAnomalyData({
                is_anomaly:      data.is_anomaly,
                anomaly_score:   data.anomaly_score,
                anomaly_message: data.anomaly_message
            });

            // ── Map score to local grade display ─────────────────────────
            const colorMap = { A: '#52c41a', B: '#faad14', C: '#faad14', D: '#ff4d4f', F: '#ff4d4f' };
            const recMap = {
                A: 'Highly eligible for priority financing and lower interest rates.',
                B: 'Eligible for most standard business loans. Focus on consistency.',
                C: 'Moderate eligibility. Consider reducing external debt or improving cash flow.',
                D: 'Limited financing options. Focus on digital presence and consistent revenue.',
                F: 'High risk profile. Strengthening financial documentation and tenure is advised.'
            };

            const newResult = {
                score:     data.score,
                grade:     data.grade,
                risk:      data.risk,
                color:     colorMap[data.grade] || '#999',
                rec:       recMap[data.grade]   || '',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setResult(newResult);
            setHistory(prev => [newResult, ...prev].slice(0, 3));

        } catch (err) {
            setApiError(err.message);
        } finally {
            setIsAssessing(false);
        }
    };

    return (
        <div className="flex-col">
            <nav>
                <div className="logo">CreditIQ</div>
                <div className="flex items-center gap-4">
                    <span style={{ fontSize: '13px', color: '#666' }}>{user}</span>
                    <button onClick={onLogout} style={{ background: 'none', border: 'none', fontSize: '13px', color: '#111', fontWeight: 500 }}>Logout</button>
                </div>
            </nav>

            <div className="dashboard-container">
                {/* ── LEFT COLUMN: Input Form ── */}
                <div className="card">

                    {/* Section 1: Loan Details */}
                    <div className="form-section">
                        <span className="section-label">Loan Details</span>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Loan Amount (₹)</label>
                                <input id="loan_amount_inr" name="loan_amount_inr" type="number" value={formData.loan_amount_inr} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>Loan Term (months)</label>
                                <input id="term" name="term" type="number" min="0" value={formData.term} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>Number of Employees</label>
                                <input id="employees" name="employees" type="number" min="1" value={formData.employees} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>Business Type</label>
                                <select id="business_type" name="business_type" value={formData.business_type} onChange={handleInputChange}>
                                    <option value={0}>Retail</option>
                                    <option value={1}>Services</option>
                                    <option value={2}>Manufacturing</option>
                                    <option value={3}>Food & Beverage</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <select id="is_urban" name="is_urban" value={formData.is_urban} onChange={handleInputChange}>
                                    <option value={1}>Urban</option>
                                    <option value={0}>Rural</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Existing Customer</label>
                                <select id="is_existing" name="is_existing" value={formData.is_existing} onChange={handleInputChange}>
                                    <option value={1}>Yes</option>
                                    <option value={0}>No</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Digital & Compliance Signals */}
                    <div className="form-section">
                        <span className="section-label">Digital &amp; Compliance</span>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>UPI Monthly Transactions (₹)</label>
                                <input id="upi_monthly_txn" name="upi_monthly_txn" type="number" min="0" value={formData.upi_monthly_txn} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>GST Filing Score (0–10)</label>
                                <input id="gst_filing_score" name="gst_filing_score" type="number" min="0" max="10" value={formData.gst_filing_score} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>GST Registered</label>
                                <select id="gst_registered" name="gst_registered" value={formData.gst_registered} onChange={handleInputChange}>
                                    <option value={1}>Yes</option>
                                    <option value={0}>No</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Aadhaar Linked</label>
                                <select id="aadhaar_linked" name="aadhaar_linked" value={formData.aadhaar_linked} onChange={handleInputChange}>
                                    <option value={1}>Yes</option>
                                    <option value={0}>No</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>WhatsApp Business</label>
                                <select id="whatsapp_business" name="whatsapp_business" value={formData.whatsapp_business} onChange={handleInputChange}>
                                    <option value={1}>Active</option>
                                    <option value={0}>None</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Has Website</label>
                                <select id="has_website" name="has_website" value={formData.has_website} onChange={handleInputChange}>
                                    <option value={1}>Yes</option>
                                    <option value={0}>No</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Social Score (1–10)</label>
                                <input id="social_score" name="social_score" type="number" min="1" max="10" value={formData.social_score} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>Mobile Banking Score (1–10)</label>
                                <input id="mobile_banking_score" name="mobile_banking_score" type="number" min="1" max="10" value={formData.mobile_banking_score} onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>

                    <button id="assess-btn" onClick={assess} disabled={isAssessing} className="btn-primary w-full" style={{ marginTop: '8px' }}>
                        {isAssessing ? '⏳  Analysing with SiliconMind V2.0...' : 'Assess Creditworthiness'}
                    </button>

                    {/* API error display */}
                    {apiError && (
                        <div style={{ marginTop: '16px', padding: '12px 16px', background: '#fff1f0', border: '1px solid #ff4d4f', borderRadius: '8px', fontSize: '13px', color: '#991b1b' }}>
                            ⚠️ {apiError}. Make sure the Flask backend is running at {BACKEND_URL}.
                        </div>
                    )}
                </div>

                {/* ── RIGHT COLUMN: Results ── */}
                <div className="flex-col gap-6">

                    {/* ── Anomaly Banner (V2.0) — shown above score card ── */}
                    {anomalyData?.is_anomaly && (
                        <AnomalyBanner
                            anomalyScore={anomalyData.anomaly_score}
                            anomalyMessage={anomalyData.anomaly_message}
                        />
                    )}

                    {/* ── Score Card ── */}
                    {result && (
                        <div className="card">
                            <div className="result-header">
                                <div className="score-circle" style={{ borderColor: result.color }}>
                                    {result.score}
                                </div>
                                <div className="badge" style={{ backgroundColor: `${result.color}22`, color: result.color, border: `0.5px solid ${result.color}` }}>
                                    Grade {result.grade}
                                </div>
                                <div className="risk-tag" style={{ color: result.color }}>{result.risk} Risk</div>
                            </div>

                            <div className="progress-container" style={{ width: '100%', height: '6px', marginBottom: '24px' }}>
                                <div className="progress-bar" style={{ width: `${result.score}%`, backgroundColor: result.color }}></div>
                            </div>

                            <div style={{ padding: '16px', background: '#f9f9f9', borderRadius: '8px', border: '0.5px solid #eee' }}>
                                <span style={{ fontSize: '11px', fontWeight: 600, color: '#999', display: 'block', marginBottom: '4px' }}>AI RECOMMENDATION</span>
                                <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#444' }}>{result.rec}</p>
                            </div>
                        </div>
                    )}

                    {/* ── Empty state ── */}
                    {!result && !apiError && (
                        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', textAlign: 'center', opacity: 0.6 }}>
                            <p style={{ fontSize: '14px', color: '#999' }}>Complete the form to generate<br />AI credit risk assessment</p>
                        </div>
                    )}

                    {/* ── Assessment History ── */}
                    {history.length > 0 && (
                        <div className="card">
                            <span className="section-label">Recent Assessments</span>
                            <div className="history-list">
                                {history.map((h, i) => (
                                    <div key={i} className="history-item">
                                        <div className="flex-col">
                                            <span style={{ fontSize: '14px', fontWeight: 500 }}>Score: {h.score}</span>
                                            <span style={{ fontSize: '12px', color: '#999' }}>{h.timestamp}</span>
                                        </div>
                                        <div className="badge" style={{ fontSize: '10px', backgroundColor: '#f5f5f5', color: '#666', border: '0.5px solid #eee' }}>
                                            {h.risk}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── What-If Simulator (SiliconMind V2.0) ── */}
                    <WhatIfSimulator />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

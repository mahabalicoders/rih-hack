import React, { useState } from 'react';
import Icon from './Icon';
import { BUSINESS_TYPES, THEME_COLORS } from '../utils/constants';

const AssessmentForm = ({ user, onSave }) => {
    const [formData, setFormData] = useState({
        term: 12, employees: 5, loan_amount_inr: 50000, business_type: 0,
        is_urban: 1, is_existing: 1, upi_monthly_txn: 45, gst_registered: 1,
        gst_filing_score: 8, whatsapp_business: 1, has_website: 1,
        social_score: 7, mobile_banking_score: 8, aadhaar_linked: 1
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fraudActive, setFraudActive] = useState(false);
    const [googleSearch, setGoogleSearch] = useState('');
    const [googleResults, setGoogleResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [googleData, setGoogleData] = useState({ verified: false, rating: null, reviews: null, rep_score: 0.5 });

    const handleInp = (e) => {
        const { name, value } = e.target;
        const finalValue = name === 'business_type' ? parseInt(value) : parseFloat(value);
        setFormData(p => ({ ...p, [name]: finalValue }));
        if (fraudActive) setFraudActive(false);
    };

    const handleGoogleSearch = async () => {
        if (!googleSearch) return;
        setIsSearching(true);
        try {
            const response = await fetch('http://localhost:5000/api/places/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: googleSearch })
            });
            const data = await response.json();
            if (data.status === 'OK') {
                setGoogleResults(data.results);
            } else {
                alert(data.message || "No results found");
            }
        } catch (err) {
            console.error("Search Error:", err);
        } finally {
            setIsSearching(false);
        }
    };

    const selectPlace = (place) => {
        setGoogleData({
            verified: true,
            rating: place.rating,
            reviews: place.user_ratings_total,
            rep_score: place.reputation_score,
            business_name: place.name
        });
        setGoogleResults([]);
    };

    const runInference = async () => {
        setLoading(true);
        try {
            const API_URL = 'http://localhost:5000/score'; 
            const body = { 
                ...formData, 
                google_reputation_score: googleData.rep_score 
            };
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (data.status === 'success') {
                if (data.is_anomaly) {
                    setFraudActive(true);
                    setResult(null);
                    setLoading(false);
                    return;
                }

                const scoreColor = data.score >= 80 ? THEME_COLORS.success : data.score >= 50 ? THEME_COLORS.warning : THEME_COLORS.danger;

                // Simple driver extraction
                const reasons = data.reasons || ['Stable financial outlook', 'Risk mitigation recommended'];

                const assessmentResult = {
                    ...data,
                    color: scoreColor,
                    date: new Date().toLocaleDateString(),
                    timestamp: Date.now(),
                    reasons: reasons
                };

                setResult(assessmentResult);
            }
        } catch (err) {
            console.error("Inference Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-6" style={{padding: '32px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px'}}>
            <div className="card">
                <span className="section-label">Target MSME Parameters</span>
                
                <div className="form-section">
                    <span style={{fontSize: '11px', color: '#999', marginBottom: '16px', display: 'block'}}>CORE FINANCIALS</span>
                    <div className="form-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                        <div className="form-group"><label>Business Sector</label><select name="business_type" value={formData.business_type} onChange={handleInp}>{BUSINESS_TYPES.map((t,i)=><option key={i} value={i}>{t}</option>)}</select></div>
                        <div className="form-group"><label>Requested Loan (₹)</label><input name="loan_amount_inr" type="number" value={formData.loan_amount_inr} onChange={handleInp} /></div>
                        <div className="form-group"><label>Tenure (Months)</label><input name="term" type="number" value={formData.term} onChange={handleInp} /></div>
                        <div className="form-group"><label>Employees</label><input name="employees" type="number" value={formData.employees} onChange={handleInp} /></div>
                        <div className="form-group"><label>UPI Monthly Txn</label><input name="upi_monthly_txn" type="number" value={formData.upi_monthly_txn} onChange={handleInp} /></div>
                        <div className="form-group"><label>GST Filing Score (1-10)</label><input name="gst_filing_score" type="number" value={formData.gst_filing_score} onChange={handleInp} /></div>
                    </div>
                </div>

                <div className="form-section">
                    <span style={{fontSize: '11px', color: '#999', marginBottom: '16px', display: 'block'}}>GOOGLE REPUTATION INTELLIGENCE</span>
                    <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <div className="flex gap-3">
                            <div className="flex items-center gap-2" style={{flex: 1, background: '#fff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0 12px', display: 'flex'}}>
                                <Icon name="Search" size={16} color="#94a3b8" />
                                <input 
                                    placeholder="Search Business on Google Maps..." 
                                    style={{ border: 'none', background: 'none', height: '42px', fontSize: '13px', width: '100%' }}
                                    value={googleSearch}
                                    onChange={e => setGoogleSearch(e.target.value)}
                                />
                            </div>
                            <button onClick={handleGoogleSearch} disabled={isSearching} className="btn-primary" style={{ height: '42px', padding: '0 20px', borderRadius: '100px', fontSize: '12px' }}>
                                {isSearching ? 'SEARCHING...' : 'FETCH STORE'}
                            </button>
                        </div>

                        {googleResults.length > 0 && (
                            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {googleResults.map((p, i) => (
                                    <div key={i} style={{ padding: '14px', border: '1.5px solid #f1f5f9', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: 700 }}>{p.name}</div>
                                            <div style={{ fontSize: '11px', color: '#64748b' }}>{p.address}</div>
                                        </div>
                                        <button onClick={() => selectPlace(p)} className="btn-primary" style={{ padding: '8px 14px', fontSize: '10px', height: 'auto', background: '#22c55e' }}>SELECT</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {googleData.verified && (
                            <div style={{ marginTop: '20px', padding: '14px', background: '#f0fdf4', border: '1.5px solid #22c55e', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#14532d' }}>Verified: {googleData.business_name}</div>
                                    <div style={{ fontSize: '11px', color: '#15803d' }}>Reputation Strength: {(googleData.rep_score * 100).toFixed(0)}%</div>
                                </div>
                                <button onClick={() => setGoogleData({verified:false, rating:null, reviews:null, rep_score:0.5})} className="btn-ghost" style={{ fontSize: '11px', color: '#ef4444', background: 'none', border: 'none' }}>UNLINK</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-section">
                    <span style={{fontSize: '11px', color: '#999', marginBottom: '16px', display: 'block'}}>IDENTITY & DIGITAL FOOTPRINT</span>
                    <div className="form-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px'}}>
                        <div className="form-group"><label>Urban?</label><select name="is_urban" value={formData.is_urban} onChange={handleInp}><option value={1}>Yes</option><option value={0}>No</option></select></div>
                        <div className="form-group"><label>Existing?</label><select name="is_existing" value={formData.is_existing} onChange={handleInp}><option value={1}>Yes</option><option value={0}>No</option></select></div>
                        <div className="form-group"><label>WhatsApp Biz?</label><select name="whatsapp_business" value={formData.whatsapp_business} onChange={handleInp}><option value={1}>Yes</option><option value={0}>No</option></select></div>
                    </div>
                </div>

                <button onClick={runInference} disabled={loading} className="btn-primary w-full" style={{ marginTop: '12px' }}>
                    {loading ? "Analyzing SiliconMind Patterns..." : "Calculate Risk Score"}
                </button>
            </div>

            <div>
                {fraudActive && (
                    <div className="card" style={{background: '#fff1f0', border: '1px solid #ef4444', marginBottom: '24px'}}>
                         <h3 style={{color: '#991b1b', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <Icon name="ph:shield-warning-bold" size={20} />
                            Fraud Pattern Detected
                         </h3>
                         <p style={{fontSize: '13px', color: '#991b1b', marginTop: '8px'}}>
                            Input data matches known synthetic or fraudulent patterns. Assessment halted for manual review.
                         </p>
                    </div>
                )}

                {result ? (
                    <div className="card">
                        <span className="section-label">SiliconMind Prediction</span>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{ fontSize: '80px', fontWeight: 800, color: result.color, lineHeight: 1 }}>{result.score}</div>
                            <div className="badge" style={{ background: `${result.color}11`, color: result.color, border: `0.5px solid ${result.color}`, padding: '6px 16px', fontSize: '13px', marginTop: '12px' }}>
                                GRADE {result.grade}
                            </div>
                            <div style={{ marginTop: '12px', fontWeight: 700, color: result.color, fontSize: '18px' }}>{result.risk} Risk</div>
                        </div>

                        <div className="form-section">
                            <span className="section-label">Risk Drivers</span>
                            <ul style={{listStyle: 'none', padding: 0}}>
                                {result.reasons.map((r, i) => (
                                    <li key={i} style={{fontSize: '13px', color: '#64748b', marginBottom: '8px', display: 'flex', gap: '8px'}}>
                                        <Icon name="PlusCircle" size={14} color={result.color} />
                                        {r}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button onClick={() => { onSave(result); setResult(null); }} className="btn-primary w-full">Save Assessment</button>
                    </div>
                ) : !fraudActive && (
                    <div className="card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5, borderStyle: 'dashed' }}>
                        <div style={{ textAlign: 'center' }}>
                            <Icon name="Search" size={32} style={{ marginBottom: '16px', opacity: 0.3 }} />
                            <p style={{ fontSize: '14px' }}>Awaiting Input Signals...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssessmentForm;

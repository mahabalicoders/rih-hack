import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { MAX_VALS } from '../utils/ml';

const Dashboard = ({ user, model, onLogout }) => {
    const [formData, setFormData] = useState({
        revenue: 50000,
        txn_count: 50,
        consistency: 7,
        has_website: 1,
        social_score: 5,
        years_in_business: 2,
        expense_ratio: 0.5,
        loan_history: 0,
        business_type: 0
    });
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [isAssessing, setIsAssessing] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
    };

    const assess = async () => {
        setIsAssessing(true);
        await new Promise(r => setTimeout(r, 600));

        const normalized = [
            formData.revenue / MAX_VALS.revenue,
            formData.txn_count / MAX_VALS.txn_count,
            formData.consistency / MAX_VALS.consistency,
            formData.has_website,
            formData.social_score / MAX_VALS.social_score,
            formData.years_in_business / MAX_VALS.years_in_business,
            formData.expense_ratio,
            formData.loan_history / MAX_VALS.loan_history,
            formData.business_type / MAX_VALS.business_type
        ];

        const inputTensor = tf.tensor2d([normalized]);
        const prediction = model.predict(inputTensor);
        const score = (await prediction.data())[0] * 100;
        
        const finalScore = Math.round(score);
        
        const reasons = [];
        if (formData.consistency < 5) reasons.push("Low payment consistency detected");
        if (formData.expense_ratio > 0.7) reasons.push("High expense ratio is a concern");
        if (formData.years_in_business < 2) reasons.push("Limited business history");
        if (formData.has_website === 1) reasons.push("Established digital presence");
        if (formData.loan_history === 1) reasons.push("Positive loan repayment history");
        if (formData.social_score > 7) reasons.push("Strong social proof and community trust");
        if (formData.revenue > 300000) reasons.push("High revenue volume suggests stability");

        const topReasons = reasons.slice(0, 3);
        
        const getGrade = (s) => {
            if (s >= 80) return { grade: 'A', color: '#52c41a', risk: 'Low', rec: 'Highly eligible for priority financing and lower interest rates.' };
            if (s >= 65) return { grade: 'B', color: '#faad14', risk: 'Medium-Low', rec: 'Eligible for most standard business loans. Focus on consistency.' };
            if (s >= 50) return { grade: 'C', color: '#faad14', risk: 'Medium', rec: 'Moderate eligibility. Consider reducing external debt or improving cash flow.' };
            if (s >= 35) return { grade: 'D', color: '#ff4d4f', risk: 'High', rec: 'Limited financing options. Focus on digital presence and consistent revenue.' };
            return { grade: 'F', color: '#ff4d4f', risk: 'Very High', rec: 'High risk profile. Strengthening financial documentation and tenure is advised.' };
        };

        const meta = getGrade(finalScore);
        
        const newResult = {
            score: finalScore,
            ...meta,
            reasons: topReasons,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setResult(newResult);
        setHistory(prev => [newResult, ...prev].slice(0, 3));
        setIsAssessing(false);
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
                <div className="card">
                    <div className="form-section">
                        <span className="section-label">Transaction Data</span>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Avg monthly revenue (₹)</label>
                                <input name="revenue" type="number" value={formData.revenue} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>Transactions per month</label>
                                <input name="txn_count" type="number" value={formData.txn_count} onChange={handleInputChange} />
                            </div>
                            <div className="form-group full-width">
                                <label>Payment consistency (1-10)</label>
                                <input name="consistency" type="range" min="1" max="10" step="1" value={formData.consistency} onChange={handleInputChange} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#999' }}>
                                    <span>Variable</span><span>Very Stable</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <span className="section-label">Digital Presence</span>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Has website</label>
                                <select name="has_website" value={formData.has_website} onChange={handleInputChange}>
                                    <option value={1}>Yes</option>
                                    <option value={0}>No</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Social media score (1-10)</label>
                                <input name="social_score" type="number" min="1" max="10" value={formData.social_score} onChange={handleInputChange} />
                            </div>
                            <div className="form-group full-width">
                                <label>Years in business</label>
                                <input name="years_in_business" type="number" value={formData.years_in_business} onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>

                    <div className="form-section" style={{ marginBottom: '0' }}>
                        <span className="section-label">Financials</span>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Expense ratio (0.0-1.0)</label>
                                <input name="expense_ratio" type="number" step="0.1" min="0" max="1" value={formData.expense_ratio} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>Loan history</label>
                                <select name="loan_history" value={formData.loan_history} onChange={handleInputChange}>
                                    <option value={0}>None</option>
                                    <option value={1}>Good</option>
                                    <option value={2}>Bad</option>
                                </select>
                            </div>
                            <div className="form-group full-width">
                                <label>Business type</label>
                                <select name="business_type" value={formData.business_type} onChange={handleInputChange}>
                                    <option value={0}>Retail</option>
                                    <option value={1}>Services</option>
                                    <option value={2}>Manufacturing</option>
                                    <option value={3}>Food</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button onClick={assess} disabled={isAssessing} className="btn-primary w-full" style={{ marginTop: '32px' }}>
                        {isAssessing ? 'Processing AI Prediction...' : 'Assess Creditworthiness'}
                    </button>
                </div>

                <div className="flex-col gap-6">
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

                            <div style={{ marginBottom: '24px' }}>
                                <span className="section-label">Key Factors</span>
                                <ul className="factor-list">
                                    {result.reasons.map((r, i) => (
                                        <li key={i} className="factor-item">{r}</li>
                                    ))}
                                </ul>
                            </div>

                            <div style={{ padding: '16px', background: '#f9f9f9', borderRadius: '8px', border: '0.5px solid #eee' }}>
                                <span style={{ fontSize: '11px', fontWeight: 600, color: '#999', display: 'block', marginBottom: '4px' }}>AI RECOMMENDATION</span>
                                <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#444' }}>{result.rec}</p>
                            </div>
                        </div>
                    )}

                    {!result && (
                        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', textAlign: 'center', opacity: 0.6 }}>
                            <p style={{ fontSize: '14px', color: '#999' }}>Complete the form to generate<br/> AI credit risk assessment</p>
                        </div>
                    )}

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
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

import React, { useState, useEffect, useCallback } from 'react';

const BACKEND_URL = 'http://localhost:5000';

const WhatIfSimulator = () => {
    const [params, setParams] = useState({
        monthlyUpiVolume: 1500000,
        gstFilingConsistency: 85,
        businessAge: 36,
        digitalBanking: 7,
        employeeCount: 12
    });

    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    // Simulator input configuration
    const simulationParams = [
        { id: 'monthlyUpiVolume', label: 'Monthly UPI Volume', min: 0, max: 10000000, step: 100000, unit: '₹' },
        { id: 'gstFilingConsistency', label: 'GST Filing Consistency', min: 0, max: 100, step: 1, unit: '%' },
        { id: 'businessAge', label: 'Business Age (Months)', min: 0, max: 120, step: 1, unit: ' months' },
        { id: 'digitalBanking', label: 'Digital Maturity (1-10)', min: 1, max: 10, step: 1, unit: ' pts' },
        { id: 'employeeCount', label: 'Employee Count', min: 1, max: 50, step: 1, unit: ' pax' }
    ];

    const fetchSimulation = useCallback(async (currentParams) => {
        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_URL}/simulate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentParams)
            });
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error("Simulation failed:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounce: Recalculate after 400ms of inactivity
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchSimulation(params);
        }, 400);
        return () => clearTimeout(handler);
    }, [params, fetchSimulation]);

    const handleSliderChange = (id, val) => {
        setParams(prev => ({ ...prev, [id]: parseFloat(val) }));
    };

    const getGradeColor = (grade) => {
        const colors = { A: '#52c41a', B: '#faad14', C: '#faad14', D: '#ff4d4f', F: '#ff4d4f' };
        return colors[grade] || '#999';
    };

    return (
        <div className="card" style={{ marginTop: '24px', borderStyle: 'dashed', borderColor: '#d9d9d9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>What-If Simulator</h2>
                    <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>Experiment with business variables to optimize your probability of financing and discover ideal interest rates.</p>
                </div>
                {loading && <span style={{ fontSize: '11px', color: '#999', background: '#f5f5f5', padding: '4px 12px', borderRadius: '100px' }}>Recalculating...</span>}
            </div>
            
            {/* Controls Section */}
            <div className="flex-col gap-6" style={{ marginBottom: '32px' }}>
                {simulationParams.map(p => (
                    <div key={p.id} className="form-group">
                        <div className="flex justify-between items-center" style={{ marginBottom: '4px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{p.label}</label>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#111' }}>
                                {p.unit === '₹' ? `₹${(params[p.id]/100000).toFixed(1)}L` : `${params[p.id]}${p.unit}`}
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min={p.min} 
                            max={p.max} 
                            step={p.step} 
                            value={params[p.id]} 
                            onChange={(e) => handleSliderChange(p.id, e.target.value)}
                            style={{ 
                                accentColor: '#111', 
                                height: '5px', 
                                background: '#f5f5f5', 
                                borderRadius: '10px', 
                                appearance: 'none',
                                cursor: 'pointer',
                                width: '100%'
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Results Section */}
            {results && (
                <div style={{ 
                    borderTop: '0.5px solid var(--border-color)', 
                    paddingTop: '24px', 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    opacity: loading ? 0.6 : 1,
                    transition: 'opacity 0.2s ease',
                    textAlign: 'center'
                }}>
                    <div className="score-circle" style={{ 
                        borderColor: getGradeColor(results.grade), 
                        width: '100px', 
                        height: '100px', 
                        fontSize: '32px',
                        marginBottom: '16px',
                        boxShadow: `0 8px 16px ${getGradeColor(results.grade)}22`
                    }}>
                        {results.score}
                    </div>
                    
                    <div className="badge" style={{ 
                        backgroundColor: `${getGradeColor(results.grade)}22`, 
                        color: getGradeColor(results.grade), 
                        border: `0.5px solid ${getGradeColor(results.grade)}`,
                        marginBottom: '12px',
                        fontSize: '12px',
                        padding: '6px 16px'
                    }}>
                        Grade {results.grade} • {results.risk} Risk
                    </div>
                    
                    <p style={{ 
                        fontSize: '13px', 
                        color: '#444', 
                        lineHeight: '1.6',
                        maxWidth: '320px',
                        margin: '0 auto'
                    }}>
                        {results.message}
                    </p>

                    <style>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                        input[type=range]::-webkit-slider-thumb {
                            appearance: none;
                            width: 14px;
                            height: 14px;
                            background: #111;
                            border-radius: 50%;
                            cursor: pointer;
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
};

export default WhatIfSimulator;

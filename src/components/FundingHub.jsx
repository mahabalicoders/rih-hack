import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import { db } from '../utils/firebase';
import { BUSINESS_TYPES, getMetaFromScore } from '../utils/constants';

const FundingHub = () => {
    const [deals, setDeals] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedDeal, setSelectedDeal] = useState(null);
    
    useEffect(() => {
        if (!db) {
            setLoading(false);
            return;
        }
        const unsubscribe = db.collection('assessments')
            .limit(50)
            .onSnapshot(snap => {
                const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Sort by score desc for marketplace feel
                data.sort((a,b) => b.score - a.score);
                setDeals(data);
                setLoading(false);
            }, err => {
                console.error("Firestore Fetch Error:", err);
                setLoading(false);
            });
        return () => unsubscribe();
    }, []);

    const filteredDeals = deals.filter(deal => {
        const matchesSearch = BUSINESS_TYPES[deal.business_type]?.toLowerCase().includes(search.toLowerCase()) || 
                            deal.user?.toLowerCase().includes(search.toLowerCase());
        return matchesSearch && ['C', 'D', 'E', 'F'].includes(deal.grade);
    });

    return (
        <div className="flex-col gap-6" style={{padding: '32px'}}>
            <div className="welcome-banner">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 style={{fontSize: '24px', fontWeight: 800}}>Recovery & Opportunity Marketplace</h1>
                        <p style={{color: '#64748b', fontSize: '14px'}}>High-yield deal-flow from MSMEs needing strategic capital intervention.</p>
                    </div>
                    <div className="flex gap-2 items-center" style={{background: '#fff', padding: '8px 16px', borderRadius: '12px', border: '1px solid #eee', width: '320px'}}>
                        <Icon name="Search" size={16} color="#999" />
                        <input 
                            placeholder="Search by business or owner..." 
                            style={{border: 'none', padding: '0', height: 'auto', fontSize: '13px', width: '100%', outline: 'none'}}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center" style={{padding: '60px'}}>
                    <div className="spinner">Connecting into secure vault...</div>
                </div>
            ) : (
                <div className="flex-col gap-4">
                    {filteredDeals.length > 0 ? filteredDeals.map(deal => (
                        <div key={deal.id} className="card flex-col gap-4" style={{borderTop: `4px solid ${getMetaFromScore(deal.score).color}`, cursor: 'pointer', marginBottom: '16px'}} onClick={() => setSelectedDeal(deal)}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 style={{fontSize: '18px', fontWeight: 700}}>{BUSINESS_TYPES[deal.business_type] || 'Unnamed Entity'}</h3>
                                    <div className="flex gap-2" style={{marginTop: '4px'}}>
                                        <span className="badge" style={{background: '#f8fafc', color: '#64748b', fontSize: '10px'}}>{deal.user || 'Anonymous'}</span>
                                        <span className="badge" style={{background: `${getMetaFromScore(deal.score).color}11`, color: getMetaFromScore(deal.score).color}}>GRADE {deal.grade}</span>
                                    </div>
                                </div>
                                <div style={{textAlign: 'right'}}>
                                    <span style={{fontSize: '24px', fontWeight: 800, color: getMetaFromScore(deal.score).color}}>{deal.score}</span>
                                    <span style={{display: 'block', fontSize: '10px', color: '#999'}}>AI SCORE</span>
                                </div>
                            </div>

                            <div className="flex gap-4" style={{padding: '12px 0', borderTop: '0.5px solid #f1f5f9', borderBottom: '0.5px solid #f1f5f9'}}>
                                <div style={{flex: 1}}>
                                    <span style={{fontSize: '11px', color: '#999', display: 'block'}}>LOAN REQUIRED</span>
                                    <div style={{fontWeight: 600, fontSize: '15px'}}>₹{Math.round(deal.loan_amount_inr / 1000).toLocaleString('en-IN')}K</div>
                                </div>
                                <div style={{flex: 1}}>
                                    <span style={{fontSize: '11px', color: '#999', display: 'block'}}>REPAYMENT TERM</span>
                                    <div style={{fontWeight: 600, fontSize: '15px'}}>{deal.term || 12} Months</div>
                                </div>
                            </div>

                            <div className="flex gap-2" style={{marginTop: '4px'}}>
                                <button className="btn-primary" style={{flex: 1, height: '40px', fontSize: '12px', padding: '0 12px'}}>
                                    RECOVERY ANALYSIS
                                </button>
                                <button className="btn-ghost" style={{width: '40px', height: '40px', padding: 0, border: '1px solid #eee', borderRadius: '8px', background: 'none'}} title="Contact Owner">
                                    <Icon name="User" size={16} />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="card" style={{textAlign: 'center', padding: '80px', borderStyle: 'dashed'}}>
                            <Icon name="Search" size={48} style={{opacity: 0.1, marginBottom: '16px'}} />
                            <h4 style={{fontSize: '18px', color: '#666'}}>No active pitches found</h4>
                            <p style={{color: '#999', fontSize: '14px', maxWidth: '300px', margin: '8px auto'}}>There are currently no credit-ready MSMEs matching this criteria or search term.</p>
                        </div>
                    )}
                </div>
            )}

            {selectedDeal && (
                <div className="modal-overlay" onClick={() => setSelectedDeal(null)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()}>
                        <div className="modal-close" onClick={() => setSelectedDeal(null)}>
                            <Icon name="Plus" style={{transform: 'rotate(45deg)'}} />
                        </div>
                        
                        <div style={{padding: '32px'}}>
                            <div className="flex justify-between items-start" style={{marginBottom: '24px'}}>
                                <div>
                                    <span className="badge" style={{background: `${getMetaFromScore(selectedDeal.score).color}11`, color: getMetaFromScore(selectedDeal.score).color, marginBottom: '8px'}}>GRADE {selectedDeal.grade}</span>
                                    <h2 style={{fontSize: '24px', fontWeight: 800}}>{BUSINESS_TYPES[selectedDeal.business_type]}</h2>
                                    <p style={{color: '#999'}}>{selectedDeal.user || 'Anonymous Merchant'}</p>
                                </div>
                                <div style={{textAlign: 'right'}}>
                                    <div style={{fontSize: '32px', fontWeight: 800, color: getMetaFromScore(selectedDeal.score).color}}>{selectedDeal.score}</div>
                                    <div style={{fontSize: '11px', color: '#999'}}>SILICONMIND SCORE</div>
                                </div>
                            </div>

                            <div className="analytics-grid" style={{marginBottom: '32px', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px'}}>
                                <div className="card" style={{padding: '16px'}}>
                                    <span style={{fontSize: '11px', color: '#999', display: 'block'}}>LOAN AMOUNT</span>
                                    <div style={{fontSize: '18px', fontWeight: 700}}>₹{selectedDeal.loan_amount_inr?.toLocaleString('en-IN')}</div>
                                </div>
                                <div className="card" style={{padding: '16px'}}>
                                    <span style={{fontSize: '11px', color: '#999', display: 'block'}}>TERM</span>
                                    <div style={{fontSize: '18px', fontWeight: 700}}>{selectedDeal.term} Months</div>
                                </div>
                                <div className="card" style={{padding: '16px'}}>
                                    <span style={{fontSize: '11px', color: '#999', display: 'block'}}>EMPLOYEES</span>
                                    <div style={{fontSize: '18px', fontWeight: 700}}>{selectedDeal.employees} Staff</div>
                                </div>
                                <div className="card" style={{padding: '16px'}}>
                                    <span style={{fontSize: '11px', color: '#999', display: 'block'}}>GST SCORE</span>
                                    <div style={{fontSize: '18px', fontWeight: 700}}>{selectedDeal.gst_filing_score}/10</div>
                                </div>
                            </div>

                            <div className="card" style={{background: '#f8fafc', border: 'none', padding: '24px', marginBottom: '24px'}}>
                                <h3 style={{fontSize: '14px', fontWeight: 700, marginBottom: '12px'}}>Risk Intelligence Summary</h3>
                                <div className="flex-col gap-3" style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                                    <div className="flex justify-between items-center" style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <span style={{fontSize: '13px', color: '#64748b'}}>UPI Digital Trace</span>
                                        <span style={{fontWeight: 600}}>{selectedDeal.upi_monthly_txn} Txns/mo</span>
                                    </div>
                                    <div className="flex justify-between items-center" style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <span style={{fontSize: '13px', color: '#64748b'}}>Digital Infrastructure</span>
                                        <span style={{fontWeight: 600}}>{selectedDeal.has_website ? 'Has Website' : 'Offline only'}</span>
                                    </div>
                                    <div className="flex justify-between items-center" style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <span style={{fontSize: '13px', color: '#64748b'}}>Market Segment</span>
                                        <span style={{fontWeight: 600}}>{selectedDeal.is_urban ? 'Urban' : 'Rural'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4" style={{display: 'flex', gap: '16px'}}>
                                <button className="btn-primary" style={{flex: 1, height: '48px'}}>INITIATE RECOVERY PLAN</button>
                                <button className="btn-ghost" style={{height: '48px', padding: '0 24px', border: '1px solid #eee', borderRadius: '8px', background: 'none'}}>DOWNLOAD DATA</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FundingHub;

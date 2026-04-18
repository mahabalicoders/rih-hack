import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ width: '100%', maxWidth: '360px', textAlign: 'center' }}>
                <div className="logo" style={{ fontSize: '28px', marginBottom: '8px' }}>CreditIQ</div>
                <p style={{ color: '#999', fontSize: '13px', marginBottom: '32px' }}>Smart credit scoring for small businesses</p>
                
                <form onSubmit={(e) => { e.preventDefault(); onLogin(email); }} className="flex-col gap-4">
                    <div className="form-group" style={{ textAlign: 'left' }}>
                        <label>Email address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" required />
                    </div>
                    <div className="form-group" style={{ textAlign: 'left' }}>
                        <label>Password</label>
                        <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" required />
                    </div>
                    <button type="submit" className="btn-primary w-full" style={{ marginTop: '12px' }}>Sign in</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;

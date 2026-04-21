import React from 'react';

const Icon = ({ name, size = 18, color = 'currentColor', className = '' }) => {
    const iconMap = {
        'LayoutGrid': 'ph:layout-bold',
        'PlusCircle': 'ph:plus-circle-bold',
        'Clock': 'ph:clock-bold',
        'BarChart3': 'ph:chart-bar-bold',
        'Handshake': 'ph:handshake-bold',
        'User': 'ph:user-bold',
        'Brain': 'ph:brain-bold'
    };
    const iconId = iconMap[name] || name;
    return <span className={`iconify ${className}`} data-icon={iconId} style={{ fontSize: size, color: color, display: 'inline-block', verticalAlign: 'middle' }}></span>;
};

const Sidebar = ({ activePage, setPage, user, onLogout }) => {
    return (
        <div className="sidebar">
            <div className="logo-container">
                <Icon name="Brain" size={28} />
                <span className="logo-text">Arthashakti</span>
            </div>
            
            <nav className="nav-list">
                <div className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => setPage('dashboard')}>
                    <Icon name="LayoutGrid" /> <span className="nav-text">Dashboard</span>
                </div>
                <div className={`nav-item ${activePage === 'assessment' ? 'active' : ''}`} onClick={() => setPage('assessment')}>
                    <Icon name="PlusCircle" /> <span className="nav-text">New Assessment</span>
                </div>
                <div className={`nav-item ${activePage === 'history' ? 'active' : ''}`} onClick={() => setPage('history')}>
                    <Icon name="Clock" /> <span className="nav-text">History</span>
                </div>
                <div className={`nav-item ${activePage === 'analytics' ? 'active' : ''}`} onClick={() => setPage('analytics')}>
                    <Icon name="BarChart3" /> <span className="nav-text">Analytics</span>
                </div>
                <div className={`nav-item ${activePage === 'funding' ? 'active' : ''}`} onClick={() => setPage('funding')}>
                    <Icon name="Handshake" /> <span className="nav-text">Funding Hub</span>
                </div>
                <div className={`nav-item ${activePage === 'fraud' ? 'active' : ''}`} onClick={() => setPage('fraud')}>
                    <Icon name="ph:shield-warning-bold" /> <span className="nav-text">Fraud Monitor</span>
                </div>
                <div className={`nav-item ${activePage === 'simulator' ? 'active' : ''}`} onClick={() => setPage('simulator')}>
                    <Icon name="ph:magic-wand-bold" /> <span className="nav-text">What-If Simulator</span>
                </div>
                <div className={`nav-item ${activePage === 'profile' ? 'active' : ''}`} onClick={() => setPage('profile')}>
                    <Icon name="User" /> <span className="nav-text">Profile</span>
                </div>
            </nav>
            
            <div className="sidebar-bottom" onClick={onLogout} style={{ cursor: 'pointer' }}>
                <div className="avatar">{user ? user.charAt(0).toUpperCase() : 'U'}</div>
                <div className="user-info">
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{user || 'User'}</span>
                    <span className="user-email">Risk Analyst</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

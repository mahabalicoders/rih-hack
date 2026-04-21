import React from 'react';

const Icon = ({ name, size = 18, color = 'currentColor', className = '' }) => {
    const iconMap = {
        'LayoutGrid': 'ph:layout-bold',
        'PlusCircle': 'ph:plus-circle-bold',
        'Clock': 'ph:clock-bold',
        'BarChart3': 'ph:chart-bar-bold',
        'Handshake': 'ph:handshake-bold',
        'User': 'ph:user-bold',
        'Brain': 'ph:brain-bold',
        'Search': 'ph:magnifying-glass-bold',
        'Plus': 'ph:plus-bold',
        'Zap': 'ph:zap-bold'
    };
    const iconId = iconMap[name] || name;
    return <span className={`iconify ${className}`} data-icon={iconId} style={{ fontSize: size, color: color, display: 'inline-block', verticalAlign: 'middle' }}></span>;
};

export default Icon;

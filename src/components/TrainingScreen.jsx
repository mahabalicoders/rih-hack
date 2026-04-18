import React from 'react';

const TrainingScreen = ({ progress, isReady }) => (
    <div id="training-screen">
        <div className="logo" style={{ fontSize: '32px', marginBottom: '8px' }}>CreditIQ</div>
        <div style={{ color: '#666', fontSize: '15px' }}>
            {isReady ? 'Model ready!' : 'Training AI model...'}
        </div>
        <div className="progress-container">
            <div className="progress-bar" style={{ width: `${(progress / 50) * 100}%` }}></div>
        </div>
        <div style={{ fontSize: '12px', color: '#999' }}>Epoch {progress} / 50</div>
    </div>
);

export default TrainingScreen;

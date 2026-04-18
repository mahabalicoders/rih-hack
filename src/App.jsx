import React, { useState, useEffect } from 'react';
import TrainingScreen from './components/TrainingScreen';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { trainModel } from './utils/ml';
import './index.css';

function App() {
  const [page, setPage] = useState('training');
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [model, setModel] = useState(null);
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const m = await trainModel(setTrainingProgress);
        setModel(m);
        setIsReady(true);
        setTimeout(() => setPage('login'), 1200);
      } catch (err) {
        console.error("Failed to train model:", err);
      }
    }
    init();
  }, []);

  const handleLogin = (email) => {
    setUser(email);
    setPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setPage('login');
  };

  if (page === 'training') {
    return <TrainingScreen progress={trainingProgress} isReady={isReady} />;
  }

  if (page === 'login') {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (page === 'dashboard') {
    return <Dashboard user={user} model={model} onLogout={handleLogout} />;
  }

  return null;
}

export default App;

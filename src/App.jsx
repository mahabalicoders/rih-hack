import React, { useState, useEffect } from 'react';
import TrainingScreen from './components/TrainingScreen';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { trainModel } from './utils/ml';
import { signIn, signInWithGoogle } from './utils/firebase';
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

  const handleLogin = async (email, password) => {
    try {
      if (signIn) {
        await signIn(email, password);
      }
      setUser(email);
      setPage('dashboard');
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid credentials. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      if (signInWithGoogle) {
        const res = await signInWithGoogle();
        if (res && res.user) {
          setUser(res.user.displayName || res.user.email);
          setPage('dashboard');
        }
      }
    } catch (err) {
      console.error("Google login failed:", err);
      alert("Google login failed. Please try again.");
    }
  };

  if (page === 'training') {
    return <TrainingScreen progress={trainingProgress} isReady={isReady} />;
  }

  if (page === 'login') {
    return <LoginPage onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} />;
  }

  if (page === 'dashboard') {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return null;
}

export default App;

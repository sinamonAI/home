
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './services/firebase.config';
import { getUserTier, getUserTheme, UserTier, ConsoleTheme } from './services/userService';
import Navbar from './components/Navbar';
import MatrixBackground from './components/MatrixBackground';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import Support from './pages/Support';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tier, setTier] = useState<UserTier>(null);
  const [consoleTheme, setConsoleTheme] = useState<ConsoleTheme>('dark');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setUser(firebaseUser);
      if (firebaseUser) {
        const t = await getUserTier(firebaseUser.uid);
        const theme = await getUserTheme(firebaseUser.uid);
        setTier(t);
        setConsoleTheme(theme);
      } else {
        setTier(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleTierChange = (newTier: 'starter' | 'pro') => {
    setTier(newTier);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-gray-500 mono tracking-widest uppercase">Loading SnapQuant...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen selection:bg-indigo-500/30 selection:text-white">
        <Navbar isLoggedIn={!!user} userName={user?.displayName || undefined} userPhoto={user?.photoURL || undefined} tier={tier} />
        <MatrixBackground />

        <main className="relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={
              user ? <Navigate to={tier ? "/dashboard" : "/pricing"} replace /> : <Login />
            } />
            <Route path="/dashboard" element={
              !user ? <Navigate to="/login" replace /> :
                !tier ? <Navigate to="/pricing" replace /> :
                  <Dashboard tier={tier} theme={consoleTheme} uid={user.uid} onThemeChange={setConsoleTheme} />
            } />
            <Route path="/pricing" element={
              <Pricing
                isLoggedIn={!!user}
                currentTier={tier}
                uid={user?.uid}
                onTierChange={handleTierChange}
              />
            } />
            <Route path="/support" element={<Support />} />
          </Routes>
        </main>

        <footer className="py-8 border-t border-white/[0.06] bg-[#0A0A0F] px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="text-lg font-extrabold mono bg-gradient-to-r from-indigo-400 to-amber-400 bg-clip-text text-transparent">
                SNAPQUANT
              </div>
              <div className="text-gray-600 text-[10px] mono uppercase tracking-widest">
                © 2025 SNAPQUANT. ALL RIGHTS RESERVED.
              </div>
            </div>
            <div className="flex gap-8 text-gray-500 text-[10px] font-semibold uppercase tracking-[0.15em]">
              <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Legal</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Status</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;

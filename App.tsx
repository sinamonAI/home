
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './services/firebase.config';
import { getUserTier, UserTier } from './services/userService';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setUser(firebaseUser);
      if (firebaseUser) {
        const t = await getUserTier(firebaseUser.uid);
        setTier(t);
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00FF41] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen selection:bg-[#00FF41] selection:text-black">
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
                  <Dashboard tier={tier} />
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

        <footer className="py-16 border-t border-white/15 bg-black px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="text-xl font-black mono text-white">QUANTDRIVE</div>
              <div className="text-gray-500 text-[10px] mono uppercase tracking-widest">
                © 2025 QUANTDRIVE. ALL RIGHTS RESERVED.
              </div>
            </div>
            <div className="flex gap-8 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-[#00FF41] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#00FF41] transition-colors">Terms</a>
              <a href="#" className="hover:text-[#00FF41] transition-colors">Legal</a>
              <a href="#" className="hover:text-[#00FF41] transition-colors">Status</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;

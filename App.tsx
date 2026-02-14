
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import MatrixBackground from './components/MatrixBackground';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import Support from './pages/Support';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="min-h-screen selection:bg-[#00FF41] selection:text-black">
        <Navbar isLoggedIn={isLoggedIn} />
        <MatrixBackground />

        <main className="relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
            <Route path="/dashboard" element={
              isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />
            } />
            <Route path="/pricing" element={<Pricing />} />
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

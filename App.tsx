
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './services/firebase.config';
import { getUserTier, getUserTheme, saveSubscription, UserTier, ConsoleTheme } from './services/userService';
import Navbar from './components/Navbar';
import MatrixBackground from './components/MatrixBackground';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import Support from './pages/Support';

// 결제 성공 페이지 컴포넌트
const CheckoutSuccess: React.FC<{ user: User | null; onTierChange: (tier: 'starter' | 'pro') => void }> = ({ user, onTierChange }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const processCheckout = async () => {
      const checkoutId = searchParams.get('checkout_id');

      if (!user) {
        // 로그인 안 된 경우 로그인 페이지로
        navigate('/login');
        return;
      }

      if (checkoutId) {
        try {
          // Pro 구독 정보 Firebase에 저장
          await saveSubscription(user.uid, {
            checkoutId,
            tier: 'pro',
          });
          onTierChange('pro');
          setStatus('success');

          // 2초 후 대시보드로 이동
          setTimeout(() => navigate('/dashboard'), 2000);
        } catch (e) {
          console.error('결제 처리 오류:', e);
          setStatus('error');
        }
      } else {
        // checkout_id가 없으면 대시보드로
        navigate('/dashboard');
      }
    };

    processCheckout();
  }, [user, searchParams, navigate, onTierChange]);

  return (
    <div className="pt-32 pb-20 px-6 bg-[#0A0A0F] min-h-screen flex items-center justify-center">
      <div className="text-center">
        {status === 'processing' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-lg text-gray-400 font-medium">결제를 처리하고 있습니다...</p>
          </div>
        )}
        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full flex items-center justify-center text-white text-3xl">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-white">Pro 업그레이드 완료! 🎉</h2>
            <p className="text-gray-400">잠시 후 대시보드로 이동합니다...</p>
          </div>
        )}
        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 text-3xl">
              ✗
            </div>
            <h2 className="text-2xl font-bold text-white">처리 중 오류 발생</h2>
            <p className="text-gray-400">support@snapquant.io로 문의해주세요.</p>
            <button
              onClick={() => navigate('/pricing')}
              className="mt-4 px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

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
                userEmail={user?.email || undefined}
                onTierChange={handleTierChange}
              />
            } />
            <Route path="/support" element={<Support />} />
            {/* Polar 결제 성공 콜백 */}
            <Route path="/checkout/success" element={
              <CheckoutSuccess user={user} onTierChange={handleTierChange} />
            } />
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

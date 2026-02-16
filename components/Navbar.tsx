
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase.config';
import { BRAND_LOGO, BRAND_NAME } from '../constants';
import { Menu, X, LogOut, Zap } from 'lucide-react';
import { UserTier } from '../services/userService';

interface NavbarProps {
  isLoggedIn?: boolean;
  userName?: string;
  userPhoto?: string;
  tier?: UserTier;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, userName, userPhoto, tier }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // 로그아웃 처리
  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300 bg-[#0A0A0F]/70 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          {BRAND_LOGO}
          <span className="text-lg font-extrabold tracking-tight mono bg-gradient-to-r from-indigo-400 to-amber-400 bg-clip-text text-transparent">
            {BRAND_NAME}
          </span>
        </Link>

        {/* 데스크톱 메뉴 */}
        <div className="hidden md:flex items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link to="/support" className="hover:text-white transition-colors">Support</Link>
          <Link to="/dashboard" className="text-indigo-400 hover:text-indigo-300 transition-all">Console</Link>
        </div>

        {/* 데스크톱 우측 */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {userPhoto && (
                <img src={userPhoto} alt="" className="w-8 h-8 rounded-full border border-indigo-500/30" />
              )}
              <span className="text-xs text-gray-400 font-medium max-w-[100px] truncate">{userName}</span>
              {tier && (
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${tier === 'pro' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-white/5 text-gray-500 border border-white/[0.06]'
                  }`}>
                  {tier === 'pro' ? 'PRO' : 'FREE'}
                </span>
              )}
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-full text-xs font-bold transition-all uppercase tracking-widest hover:shadow-lg hover:shadow-indigo-500/20"
            >
              Enter
            </Link>
          )}
        </div>

        {/* 모바일 햄버거 버튼 */}
        <button
          className="md:hidden text-white hover:text-indigo-400 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 모바일 메뉴 오버레이 */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#0A0A0F]/95 backdrop-blur-xl border-b border-white/[0.06] p-8 flex flex-col gap-8">
          <div className="flex flex-col gap-6 text-lg font-bold uppercase tracking-[0.15em] text-gray-400 items-center">
            <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Home</Link>
            <Link to="/pricing" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/support" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Support</Link>
            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-indigo-400">Console</Link>
          </div>

          <div className="flex justify-center">
            {isLoggedIn ? (
              <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                <div className="flex items-center gap-3">
                  {userPhoto && <img src={userPhoto} alt="" className="w-8 h-8 rounded-full border border-indigo-500/30" />}
                  <span className="text-sm text-gray-300">{userName}</span>
                </div>
                <button
                  onClick={() => { handleSignOut(); setIsOpen(false); }}
                  className="w-full text-center px-6 py-4 bg-white/5 text-red-400 border border-red-500/20 rounded-xl text-sm font-bold uppercase tracking-widest"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full max-w-xs text-center px-6 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-indigo-500/20"
              >
                Enter
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

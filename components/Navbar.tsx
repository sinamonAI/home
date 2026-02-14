
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase.config';
import { BRAND_LOGO, BRAND_NAME } from '../constants';
import { Menu, X, LogOut } from 'lucide-react';

interface NavbarProps {
  isLoggedIn?: boolean;
  userName?: string;
  userPhoto?: string;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, userName, userPhoto }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300 bg-black/50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          {BRAND_LOGO}
          <span className="text-xl font-black tracking-tighter mono uppercase text-white">{BRAND_NAME}</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link to="/support" className="hover:text-white transition-colors">Support</Link>
          <Link to="/dashboard" className="text-[#00FF41] hover:brightness-125 transition-all">Console</Link>
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {userPhoto && (
                <img src={userPhoto} alt="" className="w-8 h-8 rounded-full border border-[#00FF41]/30" />
              )}
              <span className="text-xs text-gray-400 font-medium max-w-[100px] truncate">{userName}</span>
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
              className="px-6 py-2 bg-[#00FF41] text-black rounded-full text-xs font-black glow-green transition-all uppercase tracking-widest"
            >
              Enter
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-white hover:text-[#00FF41] transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 p-8 flex flex-col gap-8">
          <div className="flex flex-col gap-6 text-lg font-black uppercase tracking-[0.2em] text-gray-400 items-center">
            <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Home</Link>
            <Link to="/pricing" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/support" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Support</Link>
            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-[#00FF41]">Console</Link>
          </div>

          <div className="flex justify-center">
            {isLoggedIn ? (
              <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                <div className="flex items-center gap-3">
                  {userPhoto && <img src={userPhoto} alt="" className="w-8 h-8 rounded-full border border-[#00FF41]/30" />}
                  <span className="text-sm text-gray-300">{userName}</span>
                </div>
                <button
                  onClick={() => { handleSignOut(); setIsOpen(false); }}
                  className="w-full text-center px-6 py-4 bg-white/5 text-red-400 border border-red-500/20 rounded-xl text-sm font-black uppercase tracking-widest"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full max-w-xs text-center px-6 py-4 bg-[#00FF41] text-black rounded-xl text-sm font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,255,65,0.3)]"
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

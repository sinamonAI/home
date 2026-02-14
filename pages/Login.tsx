
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase.config';
import { BRAND_LOGO } from '../constants';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      // App.tsx의 onAuthStateChanged가 tier 로딩 후 자동 라우팅
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('로그인 팝업이 닫혔습니다. 다시 시도해주세요.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('이 도메인은 Firebase에서 허용되지 않았습니다. Firebase Console에서 도메인을 추가해주세요.');
      } else {
        setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-black px-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-[#050A14] border border-white/15 text-center">
        <div className="flex justify-center mb-8">
          {BRAND_LOGO}
        </div>
        <h1 className="text-3xl font-bold mb-2 tracking-tight">Welcome to QuantDrive</h1>
        <p className="text-gray-400 mb-8">트레이딩의 미래에 오신 것을 환영합니다.</p>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-4 px-6 bg-white text-black font-bold rounded-full flex items-center justify-center gap-3 hover:bg-gray-200 transition-all mb-6 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          )}
          Sign in with Google
        </button>

        <p className="text-sm text-gray-500 leading-relaxed">
          이 서비스는 Google Apps Script 환경을 사용하므로 구글 계정이 필수입니다.
          귀하의 모든 API 정보는 개인 스크립트의 UserProperties에만 저장됩니다.
        </p>
      </div>
    </div>
  );
};

export default Login;

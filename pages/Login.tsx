
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase.config';
import { BRAND_LOGO } from '../constants';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 구글 로그인 처리
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      // App.tsx의 onAuthStateChanged가 tier 로딩 후 자동 라우팅
    } catch (err: any) {
      console.error('로그인 오류:', err);
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
    <div className="flex-1 flex items-center justify-center bg-[#0A0A0F] px-4 min-h-screen">
      {/* 배경 글로우 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-indigo-600/15 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-md w-full p-10 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl text-center shadow-2xl shadow-indigo-500/5">
        <div className="flex justify-center mb-8">
          {BRAND_LOGO}
        </div>
        <h1 className="text-3xl font-bold mb-2 tracking-tight text-white">Welcome to SnapQuant</h1>
        <p className="text-gray-400 mb-8">스마트 퀀트 트레이딩의 세계에 오신 것을 환영합니다.</p>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-4 px-6 bg-white text-gray-900 font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all mb-6 disabled:opacity-50 shadow-lg"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
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

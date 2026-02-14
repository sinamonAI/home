
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BRAND_LOGO } from '../constants';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // Simulate login
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-[#050A14] border border-gray-800 text-center">
        <div className="flex justify-center mb-8">
          {/* Changed ROBINHOOD_STYLE_SVG to BRAND_LOGO which is correctly exported from constants.tsx */}
          {BRAND_LOGO}
        </div>
        <h1 className="text-3xl font-bold mb-2 tracking-tight">Welcome to AlgoCloud</h1>
        <p className="text-gray-400 mb-8">트레이딩의 미래에 오신 것을 환영합니다.</p>
        
        <button 
          onClick={handleGoogleLogin}
          className="w-full py-4 px-6 bg-white text-black font-bold rounded-full flex items-center justify-center gap-3 hover:bg-gray-200 transition-all mb-6"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
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

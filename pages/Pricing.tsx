
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Zap, Cpu, ArrowRight, ExternalLink } from 'lucide-react';
import { setUserTier, saveSubscription, UserTier } from '../services/userService';

interface PricingProps {
  isLoggedIn?: boolean;
  currentTier?: UserTier;
  uid?: string;
  userEmail?: string;
  onTierChange?: (tier: 'starter' | 'pro') => void;
}

// Polar 결제 링크
const POLAR_LINKS = {
  starter: 'https://buy.polar.sh/polar_cl_FyqxqCMsri1r8sNCNIeeWAPxoneGY5tBSG5E624HxkH',
  pro: 'https://buy.polar.sh/polar_cl_1gNNt29GVLjoJarg8y7MWoMEBHSCwi5MlZU7W2z9PlL',
};

const plans = [
  {
    id: 'starter' as const,
    title: 'Starter',
    price: 'Free',
    desc: '개인 투자자를 위한 자동매매 기초 패키지',
    features: [
      'Basic Library ID 제공',
      '기초 알고리즘 템플릿 지원',
      '일 1회 에러 알림 (Email)',
      '주 1회 AI 전략 코드 생성'
    ],
    buttonText: 'Start Free',
    color: '#3B82F6',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    id: 'pro' as const,
    title: 'Quant Pro',
    price: '$29.99',
    desc: '전문가급 시스템 트레이딩을 위한 프리미엄 솔루션',
    features: [
      'Premium Library ID (속도 최적화)',
      '실시간 텔레그램/슬랙 알림 봇 연동',
      'AI 전략 코드 생성 무제한',
      '고급 알고리즘 (변동성 돌파 등) 지원',
      '주식 성과 분석 대시보드 제공'
    ],
    buttonText: 'Upgrade to Pro',
    color: '#6366F1',
    gradient: 'from-indigo-500 to-indigo-600',
  }
];

const Pricing: React.FC<PricingProps> = ({ isLoggedIn, currentTier, uid, userEmail, onTierChange }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<'starter' | 'pro'>(currentTier === 'starter' ? 'starter' : 'pro');
  const [saving, setSaving] = useState(false);

  // 플랜 선택 처리
  const handleSelect = async (planId: 'starter' | 'pro') => {
    setSelected(planId);

    if (planId === 'starter') {
      // Starter(Free)는 즉시 적용
      if (isLoggedIn && uid) {
        setSaving(true);
        await setUserTier(uid, 'starter');
        onTierChange?.('starter');
        setSaving(false);
        navigate('/dashboard');
      } else {
        // 비로그인 시 Polar Starter 링크로 이동
        window.open(POLAR_LINKS.starter, '_blank');
      }
    } else {
      // Pro는 Polar 결제 페이지로 리다이렉트
      let checkoutUrl = POLAR_LINKS.pro;

      // 로그인된 사용자 이메일을 URL 파라미터로 전달
      if (userEmail) {
        checkoutUrl += `?customer_email=${encodeURIComponent(userEmail)}`;
      }

      // 결제 페이지로 이동 (새 탭)
      window.open(checkoutUrl, '_blank');
    }
  };

  return (
    <div className="pt-20 pb-4 px-6 bg-[#0A0A0F] relative overflow-hidden flex-1 flex flex-col">
      <div className="max-w-7xl mx-auto text-center mb-6 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black mb-2 tracking-tighter"
        >
          Select Your <br />
          <span className="bg-gradient-to-r from-indigo-400 to-amber-400 bg-clip-text text-transparent">Tier.</span>
        </motion.h1>
        <p className="text-base text-gray-500 font-medium max-w-2xl mx-auto">
          서버 유지비 $0. 오직 당신의 전략에만 집중하세요.
        </p>
        {isLoggedIn && !currentTier && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-indigo-400 text-sm font-bold"
          >
            ✦ 플랜을 선택하면 콘솔에 바로 접속할 수 있습니다
          </motion.p>
        )}
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 relative z-10 flex-1">
        {plans.map((plan) => {
          const isCurrentTier = currentTier === plan.id;
          const isSelected = selected === plan.id;
          const isPro = plan.id === 'pro';

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => setSelected(plan.id)}
              className={`p-6 md:p-8 rounded-3xl flex flex-col relative overflow-hidden transition-all duration-500 cursor-pointer ${isSelected
                ? 'bg-white/[0.04] shadow-2xl'
                : 'bg-white/[0.02] hover:bg-white/[0.03]'
                }`}
              style={{
                border: isSelected ? `2px solid ${plan.color}` : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {isCurrentTier && (
                <div className="absolute top-6 right-6 px-3 py-1 bg-white/10 text-white text-[10px] font-bold rounded-full uppercase tracking-widest border border-white/20">
                  Current Plan
                </div>
              )}
              {isSelected && !isCurrentTier && (
                <div
                  className="absolute top-6 right-6 px-3 py-1 text-white text-[10px] font-bold rounded-full uppercase tracking-widest"
                  style={{ backgroundColor: plan.color }}
                >
                  {isPro ? 'Popular' : 'Selected'}
                </div>
              )}
              <h2 className="text-3xl font-bold mb-2 tracking-tight">{plan.title}</h2>
              <div className="text-4xl font-black mb-2 tracking-tighter" style={{ color: isSelected ? plan.color : 'white' }}>
                {plan.price}
                {plan.price !== 'Free' && <span className="text-lg text-gray-500 font-normal ml-2">/ month</span>}
              </div>
              <p className="text-gray-400 mb-4 text-sm font-medium">{plan.desc}</p>

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-300 font-medium">
                    <Check size={18} style={{ color: plan.color }} className="flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={(e) => { e.stopPropagation(); handleSelect(plan.id); }}
                disabled={saving || isCurrentTier}
                className={`w-full py-5 rounded-2xl font-bold text-sm uppercase tracking-[0.15em] transition-all duration-500 flex items-center justify-center gap-3 ${isSelected
                  ? `bg-gradient-to-r ${plan.gradient} text-white shadow-lg hover:scale-105`
                  : 'bg-white/5 text-white border border-white/[0.08] hover:bg-white/10'
                  } ${isCurrentTier ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {isCurrentTier ? 'Current Plan' : plan.buttonText}
                    {!isCurrentTier && (isPro ? <ExternalLink size={16} /> : <ArrowRight size={16} />)}
                  </>
                )}
              </button>

              {/* Polar 결제 보안 표시 (Pro만) */}
              {isPro && (
                <p className="text-center text-gray-600 text-[10px] mt-3 font-medium">
                  🔒 Polar.sh 통한 안전한 결제 · 언제든 취소 가능
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 장식 Orb */}
      <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full" />
    </div>
  );
};

export default Pricing;

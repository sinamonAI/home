
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, ExternalLink, Shield, Zap, Star } from 'lucide-react';
import { setUserTier, UserTier } from '../services/userService';

interface PricingProps {
  isLoggedIn: boolean;
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
    period: '',
    desc: '개인 투자자를 위한 자동매매 기초 패키지',
    features: [
      'Basic Library ID 제공',
      '기초 알고리즘 템플릿 지원',
      '일 1회 에러 알림 (Email)',
      '주 1회 AI 전략 코드 생성'
    ],
    buttonText: 'Start Free',
    color: '#818CF8',
    accentColor: '#6366F1',
    gradientFrom: 'from-indigo-400/10',
    gradientBorder: 'border-indigo-500/20',
  },
  {
    id: 'pro' as const,
    title: 'Quant Pro',
    price: '$29.99',
    period: '/ month',
    desc: '전문가급 시스템 트레이딩을 위한 프리미엄 솔루션',
    features: [
      'Premium Library ID (속도 최적화)',
      '실시간 텔레그램/슬랙 알림 봇 연동',
      'AI 전략 코드 생성 무제한',
      '고급 알고리즘 (변동성 돌파 등) 지원',
      '주식 성과 분석 대시보드 제공'
    ],
    buttonText: 'Upgrade to Pro',
    color: '#F59E0B',
    accentColor: '#D97706',
    gradientFrom: 'from-amber-400/10',
    gradientBorder: 'border-amber-500/20',
  }
];

const Pricing: React.FC<PricingProps> = ({ isLoggedIn, currentTier, uid, userEmail, onTierChange }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<'starter' | 'pro'>('pro');
  const [saving, setSaving] = useState(false);

  // 플랜 선택 처리
  const handleSelect = async (planId: 'starter' | 'pro') => {
    // 비로그인 → 로그인 페이지로 이동
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    setSelected(planId);

    if (planId === 'starter') {
      if (uid) {
        setSaving(true);
        await setUserTier(uid, 'starter');
        onTierChange?.('starter');
        setSaving(false);
        navigate('/dashboard');
      }
    } else {
      let checkoutUrl = POLAR_LINKS.pro;
      if (userEmail) {
        checkoutUrl += `?customer_email=${encodeURIComponent(userEmail)}`;
      }
      window.open(checkoutUrl, '_blank');
    }
  };

  return (
    <div className="pt-24 pb-16 px-6 bg-[#0A0A0F] relative overflow-hidden min-h-screen">
      {/* 헤더 */}
      <div className="max-w-5xl mx-auto text-center mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-6"
        >
          <Zap size={12} /> Simple Pricing
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black tracking-tighter mb-4"
        >
          전략에만{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
            집중하세요.
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base text-gray-500 font-medium max-w-xl mx-auto"
        >
          서버 유지비 $0. 당신의 구글 드라이브가 곧 퀀트 서버입니다.
        </motion.p>

        {/* 로그인 상태 표시 */}
        {isLoggedIn && userEmail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-5 flex items-center justify-center gap-2 text-sm">
            <Shield size={14} className="text-green-400" />
            <span className="text-gray-400">
              <span className="text-indigo-400 font-semibold">{userEmail}</span> 계정으로 결제됩니다
            </span>
          </motion.div>
        )}

        {!isLoggedIn && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-5 text-amber-400/80 text-sm font-medium">
            🔒 플랜을 선택하면 로그인 페이지로 이동합니다
          </motion.p>
        )}
      </div>

      {/* 플랜 카드 */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 relative z-10">
        {plans.map((plan, idx) => {
          const isCurrentTier = currentTier === plan.id;
          const isSelected = selected === plan.id;
          const isPro = plan.id === 'pro';

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 + 0.3 }}
              onClick={() => setSelected(plan.id)}
              className={`relative p-7 md:p-8 rounded-3xl flex flex-col transition-all duration-500 cursor-pointer group
                ${isSelected
                  ? `bg-gradient-to-b ${plan.gradientFrom} to-transparent shadow-2xl`
                  : 'bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
              style={{
                border: isSelected
                  ? `2px solid ${plan.color}40`
                  : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* 배지 */}
              {isPro && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg shadow-amber-500/20 flex items-center gap-1.5">
                  <Star size={10} fill="white" /> Most Popular
                </div>
              )}
              {isCurrentTier && (
                <div className="absolute top-6 right-6 px-3 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold rounded-full uppercase tracking-widest border border-green-500/30">
                  ✓ Current
                </div>
              )}

              {/* 플랜 정보 */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1 tracking-tight">{plan.title}</h2>
                <p className="text-gray-500 text-sm font-medium">{plan.desc}</p>
              </div>

              {/* 가격 */}
              <div className="mb-6">
                <span className="text-4xl font-black tracking-tighter" style={{ color: isSelected ? plan.color : '#fff' }}>
                  {plan.price}
                </span>
                {plan.period && <span className="text-sm text-gray-500 ml-2">{plan.period}</span>}
              </div>

              {/* 기능 목록 */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300 font-medium">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: plan.color + '20' }}>
                      <Check size={12} style={{ color: plan.color }} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA 버튼 */}
              <button
                onClick={(e) => { e.stopPropagation(); handleSelect(plan.id); }}
                disabled={saving || isCurrentTier}
                className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-3
                  ${isCurrentTier ? 'opacity-40 cursor-not-allowed bg-white/5 text-gray-500' : ''}
                  ${!isCurrentTier && isSelected
                    ? 'text-white shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                    : !isCurrentTier ? 'bg-white/5 text-white border border-white/[0.08] hover:bg-white/10' : ''
                  }`}
                style={{
                  ...(!isCurrentTier && isSelected
                    ? { background: `linear-gradient(135deg, ${plan.accentColor}, ${plan.color})`, boxShadow: `0 10px 30px ${plan.color}30` }
                    : {})
                }}
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {isCurrentTier ? '✓ Current Plan' : plan.buttonText}
                    {!isCurrentTier && (isPro ? <ExternalLink size={14} /> : <ArrowRight size={14} />)}
                  </>
                )}
              </button>

              {isPro && (
                <p className="text-center text-gray-600 text-[10px] mt-4 font-medium">
                  🔒 Polar.sh 안전 결제 · 언제든 취소 · 실시간 동기화
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 장식 */}
      <div className="absolute top-[15%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-amber-600/5 blur-[150px] rounded-full" />
    </div>
  );
};

export default Pricing;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Zap, Cpu, ArrowRight } from 'lucide-react';
import { setUserTier, UserTier } from '../services/userService';

interface PricingProps {
  isLoggedIn?: boolean;
  currentTier?: UserTier;
  uid?: string;
  onTierChange?: (tier: 'starter' | 'pro') => void;
}

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
    color: '#00D1FF',
  },
  {
    id: 'pro' as const,
    title: 'Quant Pro',
    price: '$29',
    desc: '전문가급 시스템 트레이딩을 위한 프리미엄 솔루션',
    features: [
      'Premium Library ID (속도 최적화)',
      '실시간 텔레그램/슬랙 알림 봇 연동',
      'AI 전략 코드 생성 무제한',
      '고급 알고리즘 (변동성 돌파 등) 지원',
      '주식 성과 분석 대시보드 제공'
    ],
    buttonText: 'Upgrade to Pro',
    color: '#00FF41',
  }
];

const Pricing: React.FC<PricingProps> = ({ isLoggedIn, currentTier, uid, onTierChange }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<'starter' | 'pro'>(currentTier === 'starter' ? 'starter' : 'pro');
  const [saving, setSaving] = useState(false);

  const handleSelect = async (planId: 'starter' | 'pro') => {
    setSelected(planId);

    if (isLoggedIn && uid) {
      setSaving(true);
      await setUserTier(uid, planId);
      onTierChange?.(planId);
      setSaving(false);
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="pt-20 pb-4 px-6 bg-black relative overflow-hidden flex-1">
      <div className="max-w-7xl mx-auto text-center mb-6 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black mb-2 tracking-tighter uppercase italic"
        >
          SELECT YOUR <br /><span className="text-[#00FF41]">TIER.</span>
        </motion.h1>
        <p className="text-base text-gray-500 font-medium max-w-2xl mx-auto">
          서버 유지비 $0. 오직 당신의 전략에만 집중하세요.
        </p>
        {isLoggedIn && !currentTier && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-[#00FF41] text-sm font-bold"
          >
            ✦ 플랜을 선택하면 콘솔에 바로 접속할 수 있습니다
          </motion.p>
        )}
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 relative z-10">
        {plans.map((plan) => {
          const isCurrentTier = currentTier === plan.id;
          const isSelected = selected === plan.id;
          const accentColor = plan.color;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => setSelected(plan.id)}
              className={`p-6 md:p-8 rounded-[2rem] flex flex-col relative overflow-hidden transition-all duration-500 cursor-pointer ${isSelected
                ? 'bg-gradient-to-br from-[#050A14] to-black shadow-[0_0_50px_rgba(0,255,65,0.15)]'
                : 'bg-white/5 hover:bg-white/[0.07]'
                }`}
              style={{
                border: isSelected ? `2px solid ${accentColor}` : '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {isCurrentTier && (
                <div className="absolute top-6 right-6 px-3 py-1 bg-white/10 text-white text-[10px] font-black rounded-full uppercase tracking-widest border border-white/20">
                  Current Plan
                </div>
              )}
              {isSelected && !isCurrentTier && (
                <div
                  className="absolute top-6 right-6 px-3 py-1 text-black text-[10px] font-black rounded-full uppercase tracking-widest"
                  style={{ backgroundColor: accentColor }}
                >
                  Selected
                </div>
              )}
              <h2 className="text-3xl font-black mb-2 uppercase italic tracking-tight">{plan.title}</h2>
              <div className="text-4xl font-black mb-2 tracking-tighter" style={{ color: isSelected ? accentColor : 'white' }}>
                {plan.price}
                {plan.price !== 'Free' && <span className="text-lg text-gray-500 font-normal ml-2">/ month</span>}
              </div>
              <p className="text-gray-400 mb-4 text-sm font-medium">{plan.desc}</p>

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-300 font-medium">
                    <Check size={18} style={{ color: accentColor }} className="flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={(e) => { e.stopPropagation(); handleSelect(plan.id); }}
                disabled={saving}
                className={`w-full py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 ${isSelected
                  ? 'text-black hover:scale-105'
                  : 'bg-white/5 text-white border border-white/20 hover:bg-white/10'
                  }`}
                style={isSelected ? {
                  backgroundColor: accentColor,
                  boxShadow: `0 0 30px ${accentColor}40`
                } : {}}
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {isCurrentTier ? 'Current Plan' : plan.buttonText}
                    {!isCurrentTier && <ArrowRight size={16} />}
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-[#00FF41]/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-[#00D1FF]/5 blur-[150px] rounded-full" />
    </div>
  );
};

export default Pricing;


import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Cpu } from 'lucide-react';

const plans = [
  {
    id: 'starter',
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
    id: 'pro',
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

const Pricing: React.FC = () => {
  const [selected, setSelected] = useState('pro');

  return (
    <div className="pt-32 pb-24 px-6 bg-black min-h-screen relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-center mb-16 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-8xl font-black mb-4 tracking-tighter uppercase italic"
        >
          SELECT YOUR <br /><span className="text-[#00FF41]">TIER.</span>
        </motion.h1>
        <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
          서버 유지비 $0. 오직 당신의 전략에만 집중하세요.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 relative z-10">
        {plans.map((plan) => {
          const isSelected = selected === plan.id;
          const accentColor = plan.color;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => setSelected(plan.id)}
              className={`p-10 md:p-12 rounded-[3rem] flex flex-col relative overflow-hidden transition-all duration-500 cursor-pointer ${isSelected
                  ? 'bg-gradient-to-br from-[#050A14] to-black shadow-[0_0_50px_rgba(0,255,65,0.15)]'
                  : 'bg-white/5 hover:bg-white/[0.07]'
                }`}
              style={{
                border: isSelected ? `2px solid ${accentColor}` : '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {isSelected && (
                <div
                  className="absolute top-8 right-8 px-4 py-1 text-black text-[10px] font-black rounded-full uppercase tracking-widest"
                  style={{ backgroundColor: accentColor }}
                >
                  Selected
                </div>
              )}
              <h2 className="text-3xl font-black mb-2 uppercase italic tracking-tight">{plan.title}</h2>
              <div className="text-5xl font-black mb-4 tracking-tighter" style={{ color: isSelected ? accentColor : 'white' }}>
                {plan.price}
                {plan.price !== 'Free' && <span className="text-lg text-gray-500 font-normal ml-2">/ month</span>}
              </div>
              <p className="text-gray-400 mb-8 text-sm font-medium">{plan.desc}</p>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-medium">
                    <Check size={18} style={{ color: accentColor }} className="flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 ${isSelected
                    ? 'text-black hover:scale-105'
                    : 'bg-white/5 text-white border border-white/20 hover:bg-white/10'
                  }`}
                style={isSelected ? {
                  backgroundColor: accentColor,
                  boxShadow: `0 0 30px ${accentColor}40`
                } : {}}
              >
                {plan.buttonText}
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

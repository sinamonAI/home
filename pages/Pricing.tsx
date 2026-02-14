
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Cpu } from 'lucide-react';

const PricingCard = ({ title, price, desc, features, primary, buttonText }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`p-10 md:p-14 rounded-[3rem] flex flex-col relative overflow-hidden transition-all duration-500 ${
      primary 
      ? 'bg-gradient-to-br from-[#050A14] to-black border-2 border-[#00FF41] shadow-[0_0_50px_rgba(0,255,65,0.1)]' 
      : 'bg-white/5 border border-white/10 hover:border-white/20'
    }`}
  >
    {primary && (
      <div className="absolute top-8 right-8 px-4 py-1 bg-[#00FF41] text-black text-[10px] font-black rounded-full uppercase tracking-widest">
        Best Protocol
      </div>
    )}
    <h2 className="text-3xl font-black mb-2 uppercase italic tracking-tight">{title}</h2>
    <div className="text-5xl font-black mb-6 tracking-tighter">
      {price}
      {price !== 'Free' && <span className="text-lg text-gray-500 font-normal ml-2">/ month</span>}
    </div>
    <p className="text-gray-400 mb-10 text-sm font-medium">{desc}</p>
    
    <ul className="space-y-5 mb-12 flex-1">
      {features.map((f: string, i: number) => (
        <li key={i} className="flex items-start gap-4 text-sm text-gray-300 font-medium">
          <Check size={20} className="text-[#00FF41] flex-shrink-0" /> {f}
        </li>
      ))}
    </ul>
    
    <button className={`w-full py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 ${
      primary ? 'bg-[#00FF41] text-black hover:scale-105 glow-green' : 'bg-white/5 text-white border border-white/20 hover:bg-white/10'
    }`}>
      {buttonText}
    </button>
  </motion.div>
);

const Pricing: React.FC = () => {
  return (
    <div className="pt-40 pb-32 px-6 bg-black min-h-screen relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-center mb-24 relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic"
        >
          SELECT YOUR <br /><span className="text-[#00FF41]">TIER.</span>
        </motion.h1>
        <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
          서버 유지비 $0. 오직 당신의 전략에만 집중하세요.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 relative z-10">
        <PricingCard 
          title="Starter"
          price="Free"
          desc="개인 투자자를 위한 자동매매 기초 패키지"
          features={[
            "Basic Library ID 제공",
            "기초 알고리즘 템플릿 지원",
            "일 1회 에러 알림 (Email)",
            "주 1회 AI 전략 코드 생성"
          ]}
          buttonText="Start Free"
        />

        <PricingCard 
          title="Quant Pro"
          price="$29"
          desc="전문가급 시스템 트레이딩을 위한 프리미엄 솔루션"
          primary
          features={[
            "Premium Library ID (속도 최적화)",
            "실시간 텔레그램/슬랙 알림 봇 연동",
            "일 1회 AI 전략 코드 생성 무제한",
            "고급 알고리즘 (변동성 돌파 등) 지원",
            "주식 성과 분석 대시보드 제공"
          ]}
          buttonText="Upgrade to Pro"
        />
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-[#00FF41]/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-[#00D1FF]/5 blur-[150px] rounded-full" />
    </div>
  );
};

export default Pricing;

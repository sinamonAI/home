
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { ArrowRight, Layers, Zap, ShieldCheck, Cpu, Terminal, Activity, Lock, Globe, MousePointer2, ChevronDown } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc, color }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    className="p-8 glass-panel rounded-[2rem] flex flex-col items-center text-center group hover:bg-white/5 transition-all duration-500 border border-white/15"
  >
    <div style={{ color }} className="mb-6 p-5 bg-black/50 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
      <Icon size={36} />
    </div>
    <h3 className="text-xl font-black mb-3 uppercase italic tracking-tight">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed max-w-[250px]">{desc}</p>
  </motion.div>
);

const TerminalMockup = () => {
  const codeLines = [
    "const bot = new QuantDrive();",
    "bot.setStrategy('TQQQ_RSI_SWING');",
    "bot.on('RSI < 30', (price) => {",
    "  bot.buy(10);",
    "  bot.notify('Target acquired.');",
    "});",
    "bot.launch(); // Success"
  ];

  return (
    <motion.div
      className="w-full max-w-2xl bg-[#050A14] border border-white/15 rounded-2xl overflow-hidden shadow-2xl"
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
    >
      <div className="bg-white/5 px-4 py-3 flex items-center gap-2 border-b border-white/10">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        <span className="ml-2 text-[9px] mono uppercase tracking-widest text-gray-500">QuantDrive_Console.sh</span>
      </div>
      <div className="p-6 mono text-[11px] space-y-2 text-left">
        {codeLines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 + (i * 0.1) }}
            className="flex gap-4"
          >
            <span className="text-gray-700 w-4">{i + 1}</span>
            <span className={line.includes('bot') ? 'text-[#00FF41]' : 'text-[#00D1FF]'}>{line}</span>
          </motion.div>
        ))}
        <motion.div
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-1.5 h-4 bg-[#00FF41] inline-block align-middle ml-8"
        />
      </div>
    </motion.div>
  );
};

const Home: React.FC = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Hero Section Transformations
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

  const springScale = useSpring(heroScale, { stiffness: 100, damping: 30 });

  return (
    <div ref={containerRef} className="bg-black text-white selection:bg-[#00FF41] selection:text-black min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center pt-28 md:pt-40 overflow-hidden z-20">
        {/* Immediate Background Visuals */}
        <div className="absolute inset-0 -z-10 bg-black">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#00FF41]/15 blur-[120px] rounded-full opacity-60" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        </div>

        <motion.div
          style={{ scale: springScale, opacity: heroOpacity, y: heroY }}
          className="text-center px-6 max-w-6xl w-full flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00FF41]/30 bg-[#00FF41]/10 text-[#00FF41] text-[10px] font-black uppercase tracking-[0.3em] mb-8"
          >
            <Cpu size={14} className="animate-pulse" /> Console v4.0 Online
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl xl:text-[9rem] font-black leading-[0.85] tracking-tighter uppercase italic mb-6"
          >
            No Server.<br />
            <span className="text-[#00FF41] drop-shadow-[0_0_40px_rgba(0,255,65,0.4)]">Just Drive.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-base md:text-xl text-gray-400 max-w-3xl mx-auto font-medium mb-8 leading-tight"
          >
            AWS 구축도, 24시간 PC 가동도 필요 없습니다.<br />
            당신의 구글 드라이브가 전 세계 거래소와 직결된 퀀트 머신이 됩니다.<br />
            <span className="text-[#00D1FF]">우리는 최적의 API 라이브러리를 제공하고, 코드는 당신의 드라이브에서 실행됩니다.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center gap-8 w-full"
          >
            <div className="flex gap-6">
              <Link
                to="/login"
                className="px-10 py-5 bg-white text-black font-black text-lg rounded-full hover:bg-[#00FF41] hover:scale-105 transition-all group shadow-[0_0_50px_rgba(255,255,255,0.15)]"
              >
                콘솔 시작하기
              </Link>
            </div>

            {/* Moving Visual Element - Terminal Mockup */}
            <TerminalMockup />

            <div className="flex flex-col items-center gap-2 mt-4 opacity-40 animate-bounce">
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Scroll Down</span>
              <ChevronDown size={20} />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Animation Section */}
      <section className="py-10 md:py-20 bg-black relative z-30 border-t border-white/15">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter mb-4">
              3 STEPS TO<br /> <span className="text-[#00D1FF] drop-shadow-[0_0_20px_rgba(0,209,255,0.3)]">AUTONOMOUS.</span>
            </h2>
            <div className="h-1.5 w-24 bg-[#00FF41] mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Zap}
              title="AI Architect"
              desc="전략을 말만 하세요. AI가 QuantDrive 라이브러리 함수를 조합해 최적의 코드를 작성합니다."
              color="#00FF41"
            />
            <FeatureCard
              icon={Layers}
              title="Bridge Connect"
              desc="라이브러리 ID만 붙여넣으세요. 복잡한 API 연동과 엔진 업데이트는 저희가 책임집니다."
              color="#00D1FF"
            />
            <FeatureCard
              icon={Activity}
              title="Sleep & Profit"
              desc="구글 클라우드 인프라 위에서 24시간 안전하게. 당신이 잠든 사이에도 시스템은 멈추지 않습니다."
              color="#00FF41"
            />
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 md:py-24 border-t border-white/15 bg-gradient-to-b from-black to-[#050A14] overflow-hidden relative z-30">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="z-10"
          >
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-8 leading-none">
              ZERO<br /><span className="text-[#00FF41]">INFRA TRUST.</span>
            </h2>
            <div className="space-y-8">
              <div className="flex gap-5 group">
                <div className="flex-shrink-0 w-12 h-12 bg-[#00FF41]/10 rounded-2xl flex items-center justify-center text-[#00FF41] border border-[#00FF41]/30 group-hover:scale-110 transition-transform">
                  <Lock size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1 uppercase tracking-tight">Decentralized Execution</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">모든 주문은 당신의 구글 계정 내부 IP에서 실행됩니다. 우리는 당신의 API Key를 저장하거나 볼 수 없습니다.</p>
                </div>
              </div>
              <div className="flex gap-5 group">
                <div className="flex-shrink-0 w-12 h-12 bg-[#00D1FF]/10 rounded-2xl flex items-center justify-center text-[#00D1FF] border border-[#00D1FF]/30 group-hover:scale-110 transition-transform">
                  <Globe size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1 uppercase tracking-tight">Global Patching</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">증권사 API 규격이 변경되어도 라이브러리가 자동 업데이트됩니다. 당신은 전략에만 집중하세요.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-full border border-white/15 flex items-center justify-center animate-[spin_120s_linear_infinite]">
              <div className="w-[85%] h-[85%] rounded-full border border-[#00FF41]/20 animate-[spin_80s_linear_infinite_reverse]" />
              <div className="absolute w-[60%] h-[60%] rounded-full border border-[#00D1FF]/30 animate-[pulse_10s_ease-in-out_infinite]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ShieldCheck size={140} className="text-[#00FF41] drop-shadow-[0_0_60px_rgba(0,255,65,0.4)]" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 text-center px-6 overflow-hidden relative z-30">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <h2 className="text-5xl md:text-[8rem] font-black uppercase italic tracking-tighter mb-8 leading-[0.8]">
            GET THE<br /><span className="text-[#00FF41]">ALPHA.</span>
          </h2>
          <Link
            to="/login"
            className="inline-block px-16 py-8 bg-white text-black font-black text-xl rounded-full hover:bg-[#00FF41] hover:scale-110 transition-all duration-500 shadow-[0_0_80px_rgba(0,255,65,0.3)]"
          >
            지금 접속하기
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;

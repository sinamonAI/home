
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Layers, Zap, ShieldCheck, Cpu, Terminal, Activity, Lock, Globe, ChevronDown, Sparkles, BarChart3, CloudCog } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc, gradient }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 overflow-hidden"
  >
    {/* 호버 시 배경 글로우 */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br ${gradient} blur-3xl -z-10`} />
    <div className={`mb-6 p-4 rounded-2xl bg-gradient-to-br ${gradient} w-fit`}>
      <Icon size={28} className="text-white" />
    </div>
    <h3 className="text-lg font-bold mb-3 tracking-tight text-white">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

// 터미널 모킹업 컴포넌트
const TerminalMockup = () => {
  const codeLines = [
    "const bot = new SnapQuant();",
    "bot.setStrategy('TQQQ_RSI_SWING');",
    "bot.on('RSI < 30', (price) => {",
    "  bot.buy(10);",
    "  bot.notify('매수 신호 감지.');",
    "});",
    "bot.launch(); // ✅ 실행 완료"
  ];

  return (
    <motion.div
      className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10 border border-white/[0.08]"
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
    >
      <div className="bg-white/[0.04] px-4 py-3 flex items-center gap-2 border-b border-white/[0.06]">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
        <span className="ml-3 text-[9px] mono uppercase tracking-widest text-gray-500">SnapQuant_Console.gs</span>
      </div>
      <div className="p-6 mono text-[11px] space-y-1.5 text-left bg-[#0D0D1A]">
        {codeLines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 + (i * 0.1) }}
            className="flex gap-4"
          >
            <span className="text-gray-700 w-4 select-none">{i + 1}</span>
            <span className={line.includes('bot') ? 'text-indigo-400' : line.includes('//') ? 'text-emerald-400' : 'text-amber-300'}>{line}</span>
          </motion.div>
        ))}
        <motion.div
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-1.5 h-4 bg-indigo-400 inline-block align-middle ml-8 rounded-sm"
        />
      </div>
    </motion.div>
  );
};

const Home: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -80]);

  return (
    <div className="bg-[#0A0A0F] text-white min-h-screen">
      {/* 히어로 섹션 */}
      <section className="relative min-h-screen flex flex-col items-center pt-28 md:pt-40 overflow-hidden z-20">
        {/* 배경 글로우 */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-[40%] h-[40%] bg-amber-500/10 blur-[100px] rounded-full" />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="text-center px-6 max-w-6xl w-full flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[10px] font-semibold uppercase tracking-[0.3em] mb-8"
          >
            <Sparkles size={14} className="animate-pulse" /> Serverless Quant v1.0
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl xl:text-[8rem] font-black leading-[0.9] tracking-tighter mb-6"
          >
            Snap. Quant.<br />
            <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(99,102,241,0.3)]">
              Profit.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto font-medium mb-10 leading-relaxed"
          >
            AWS 구축도, 24시간 PC 가동도 필요 없습니다.<br />
            당신의 구글 드라이브가 전 세계 거래소와 직결된 퀀트 머신이 됩니다.<br />
            <span className="text-blue-400">우리는 최적의 API 라이브러리를 제공하고, 코드는 당신의 드라이브에서 실행됩니다.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center gap-8 w-full"
          >
            <Link
              to="/login"
              className="px-10 py-5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold text-lg rounded-2xl hover:from-indigo-400 hover:to-indigo-500 hover:scale-105 transition-all shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)]"
            >
              콘솔 시작하기 →
            </Link>

            <TerminalMockup />

            <div className="flex flex-col items-center gap-2 mt-4 opacity-30 animate-bounce">
              <span className="text-[10px] font-medium uppercase tracking-[0.3em]">Scroll Down</span>
              <ChevronDown size={20} />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 기능 섹션 */}
      <section className="py-16 md:py-28 bg-[#0A0A0F] relative z-30 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
              3 Steps to<br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Autonomous.
              </span>
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-amber-500 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Sparkles}
              title="AI Architect"
              desc="전략을 말만 하세요. AI가 SnapQuant 라이브러리 함수를 조합해 최적의 코드를 작성합니다."
              gradient="from-indigo-600/20 to-indigo-800/5"
            />
            <FeatureCard
              icon={CloudCog}
              title="Bridge Connect"
              desc="라이브러리 ID만 붙여넣으세요. 복잡한 API 연동과 엔진 업데이트는 저희가 책임집니다."
              gradient="from-blue-600/20 to-blue-800/5"
            />
            <FeatureCard
              icon={BarChart3}
              title="Sleep & Profit"
              desc="구글 클라우드 인프라 위에서 24시간 안전하게. 당신이 잠든 사이에도 시스템은 멈추지 않습니다."
              gradient="from-amber-600/20 to-amber-800/5"
            />
          </div>
        </div>
      </section>

      {/* 보안 섹션 */}
      <section className="py-16 md:py-28 border-t border-white/[0.06] bg-gradient-to-b from-[#0A0A0F] to-[#0D0D1A] overflow-hidden relative z-30">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="z-10"
          >
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-8 leading-none">
              Zero<br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Infra Trust.
              </span>
            </h2>
            <div className="space-y-8">
              <div className="flex gap-5 group">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Lock size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1 tracking-tight">Decentralized Execution</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">모든 주문은 당신의 구글 계정 내부 IP에서 실행됩니다. 우리는 당신의 API Key를 저장하거나 볼 수 없습니다.</p>
                </div>
              </div>
              <div className="flex gap-5 group">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <Globe size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1 tracking-tight">Global Patching</h4>
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
            <div className="aspect-square rounded-full border border-white/[0.06] flex items-center justify-center animate-[spin_120s_linear_infinite]">
              <div className="w-[85%] h-[85%] rounded-full border border-indigo-500/20 animate-[spin_80s_linear_infinite_reverse]" />
              <div className="absolute w-[60%] h-[60%] rounded-full border border-blue-500/20 animate-[pulse_10s_ease-in-out_infinite]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ShieldCheck size={120} className="text-indigo-400 drop-shadow-[0_0_60px_rgba(99,102,241,0.4)]" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 md:py-32 text-center px-6 overflow-hidden relative z-30">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <h2 className="text-5xl md:text-[7rem] font-black tracking-tighter mb-8 leading-[0.85]">
            Get the<br />
            <span className="bg-gradient-to-r from-amber-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
              Alpha.
            </span>
          </h2>
          <Link
            to="/login"
            className="inline-block px-16 py-7 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold text-xl rounded-2xl hover:from-indigo-400 hover:to-indigo-500 hover:scale-110 transition-all duration-500 shadow-[0_0_60px_rgba(99,102,241,0.3)]"
          >
            지금 접속하기
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;

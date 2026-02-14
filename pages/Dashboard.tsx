
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Code, Link as LinkIcon, BookOpen, Copy, Check, Zap, Terminal, Shield, TrendingUp, Cpu, Play, AlertTriangle } from 'lucide-react';
import { SCRIPT_ID, BRAND_NAME } from '../constants';
import { generateTradingCode } from '../services/geminiService';

// 검증된 전략 템플릿
const STRATEGY_TEMPLATES = [
  {
    id: 'rsi_swing',
    name: 'RSI Swing',
    desc: 'RSI 과매도 구간 진입, 과매수 구간 청산',
    color: '#00FF41',
    code: `function runTradingStrategy() {
  const rsi = AlgoCloud.getRSI("TQQQ", 14);
  if (rsi < 30) {
    AlgoCloud.placeOrder("TQQQ", "BUY", 5);
    AlgoCloud.notify("RSI " + rsi + " - 매수 실행");
  } else if (rsi > 70) {
    AlgoCloud.placeOrder("TQQQ", "SELL", 5);
    AlgoCloud.notify("RSI " + rsi + " - 매도 실행");
  }
}`
  },
  {
    id: 'volatility_breakout',
    name: '변동성 돌파',
    desc: '전일 고가-저가 Range 기반 돌파 전략',
    color: '#00D1FF',
    code: `function runTradingStrategy() {
  const price = AlgoCloud.getCurrentPrice("SPY");
  const ma20 = AlgoCloud.getMovingAverage("SPY", 20);
  const range = price * 0.02; // 2% range
  if (price > ma20 + range) {
    AlgoCloud.placeOrder("SPY", "BUY", 10);
    AlgoCloud.notify("돌파 매수: $" + price);
  }
}`
  },
  {
    id: 'ma_crossover',
    name: 'MA Crossover',
    desc: '단기/장기 이동평균 교차 시그널',
    color: '#FF6B35',
    code: `function runTradingStrategy() {
  const ma5 = AlgoCloud.getMovingAverage("QQQ", 5);
  const ma20 = AlgoCloud.getMovingAverage("QQQ", 20);
  if (ma5 > ma20) {
    AlgoCloud.placeOrder("QQQ", "BUY", 3);
    AlgoCloud.notify("골든크로스 감지 - 매수");
  } else if (ma5 < ma20) {
    AlgoCloud.placeOrder("QQQ", "SELL", 3);
    AlgoCloud.notify("데드크로스 감지 - 매도");
  }
}`
  }
];

const Dashboard: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'templates'>('ai');

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    const code = await generateTradingCode(prompt);
    setGeneratedCode(code);
    setIsGenerating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectTemplate = (template: typeof STRATEGY_TEMPLATES[0]) => {
    setGeneratedCode(template.code);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row pt-20 relative overflow-hidden selection:bg-[#00FF41] selection:text-black">
      {/* Sidebar */}
      <aside className="w-full md:w-72 border-r border-white/15 p-6 space-y-6 flex-shrink-0 bg-black/50 backdrop-blur-3xl z-20">
        <div className="px-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2.5 h-2.5 bg-[#00FF41] rounded-full animate-pulse shadow-[0_0_15px_#00FF41]" />
            <h2 className="text-[10px] font-black text-[#00FF41] uppercase tracking-[0.3em] mono">Connection Active</h2>
          </div>
          <p className="text-[9px] text-gray-600 mono uppercase tracking-widest">Console: QD-ENGINE-X</p>
        </div>

        <nav className="space-y-2">
          {[
            { icon: <Terminal size={18} />, label: "Console", active: true },
            { icon: <Code size={18} />, label: "AI Vibe Coder" },
            { icon: <LinkIcon size={18} />, label: "Bridge Config" },
            { icon: <Shield size={18} />, label: "Security Keys" },
            { icon: <BookOpen size={18} />, label: "Docs" },
          ].map((item, idx) => (
            <button
              key={idx}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-black transition-all text-[11px] uppercase tracking-widest border
                ${item.active ? 'bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]/30' : 'text-gray-500 border-transparent hover:text-white hover:bg-white/5'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/15">
          <div className="p-5 bg-white/5 rounded-2xl border border-white/15">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Account</h4>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase italic">Quant Pro</span>
              <Zap size={14} className="text-[#00FF41]" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl overflow-y-auto relative z-10">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic flex items-center gap-3">
              <Terminal className="text-[#00FF41]" />
              VIBE_CONSOLE
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">전략을 바이브하고, 코드를 받으세요. 당신의 구글 드라이브에서 실행됩니다.</p>
          </div>
          <div className="flex gap-3">
            <div className="px-5 py-2.5 bg-[#050A14] border border-white/15 rounded-2xl text-[10px] mono text-gray-500 uppercase tracking-widest">
              Latency: <span className="text-[#00FF41]">0.2ms</span>
            </div>
          </div>
        </header>

        {/* Tab Switcher */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${activeTab === 'ai'
                ? 'bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]/30'
                : 'text-gray-500 border-white/10 hover:bg-white/5'
              }`}
          >
            <span className="flex items-center gap-2"><Cpu size={14} /> AI Vibe Coder</span>
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${activeTab === 'templates'
                ? 'bg-[#00D1FF]/10 text-[#00D1FF] border-[#00D1FF]/30'
                : 'text-gray-500 border-white/10 hover:bg-white/5'
              }`}
          >
            <span className="flex items-center gap-2"><TrendingUp size={14} /> 검증된 전략</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            {activeTab === 'ai' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 glass-panel rounded-[2.5rem] shadow-2xl relative border border-white/15"
              >
                <h3 className="text-lg font-black mb-6 flex items-center gap-3 uppercase italic tracking-tight">
                  <Cpu className="text-[#00FF41]" size={20} /> AI VIBE CODER
                </h3>

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-40 bg-black/40 border border-white/15 rounded-2xl p-6 text-white placeholder-gray-700 focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] outline-none transition-all mb-6 font-mono text-sm leading-relaxed"
                  placeholder="전략을 자연어로 입력하세요. (예: RSI가 30 이하일 때 TQQQ 5주 매수...)"
                />

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt}
                  className="w-full py-5 bg-[#00FF41] text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all uppercase tracking-[0.2em] text-xs"
                >
                  {isGenerating ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Code size={18} />}
                  Generate Code
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-black flex items-center gap-3 uppercase italic tracking-tight mb-4">
                  <TrendingUp className="text-[#00D1FF]" size={20} /> 검증된 전략 선택
                </h3>
                {STRATEGY_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => selectTemplate(t)}
                    className="w-full p-5 rounded-2xl border border-white/15 bg-[#050A14] hover:bg-white/5 transition-all text-left group flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: t.color + '20', color: t.color }}>
                      <Play size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-black uppercase tracking-tight" style={{ color: t.color }}>{t.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{t.desc}</div>
                    </div>
                    <Code size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                  </button>
                ))}

                {/* 면책 조항 */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 mt-4">
                  <AlertTriangle size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-yellow-500/70 leading-relaxed">
                    모든 알고리즘의 선택과 활용은 사용자 본인의 판단이며, QuantDrive와 무관합니다. 투자 손실에 대한 책임은 사용자에게 있습니다.
                  </p>
                </div>
              </motion.div>
            )}

            <div className="p-8 bg-[#050A14] border border-white/15 rounded-[2.5rem]">
              <h3 className="text-lg font-black mb-5 flex items-center gap-3 uppercase italic tracking-tight">
                <LinkIcon className="text-[#00D1FF]" size={18} /> BRIDGE_ID
              </h3>
              <div className="p-5 bg-black rounded-xl border border-dashed border-[#00D1FF]/30 mb-4 flex items-center justify-between gap-2">
                <code className="mono text-xs text-[#00D1FF] break-all">{SCRIPT_ID}</code>
                <button onClick={() => copyToClipboard(SCRIPT_ID)} className="p-3 bg-[#00D1FF]/10 text-[#00D1FF] rounded-xl hover:bg-[#00D1FF]/20 transition-all flex-shrink-0">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-widest font-bold">
                [NOTICE]: 이 ID를 당신의 Google Apps Script 라이브러리에 추가하세요.
              </p>
            </div>
          </div>

          <div className="flex flex-col h-full min-h-[500px]">
            <div className="bg-[#050A14] border border-white/15 rounded-[2.5rem] flex flex-col h-full overflow-hidden shadow-2xl">
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
                <span className="text-[10px] font-black text-gray-500 uppercase mono italic tracking-widest">GENERATED_CODE.gs</span>
                <button
                  onClick={() => copyToClipboard(generatedCode)}
                  disabled={!generatedCode}
                  className="px-4 py-2 text-[10px] font-black text-[#00FF41] flex items-center gap-2 border border-[#00FF41]/20 rounded-xl hover:bg-[#00FF41]/10 transition-all uppercase tracking-widest"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  Copy
                </button>
              </div>

              <div className="flex-1 p-8 bg-black/80 font-mono text-xs overflow-auto">
                {generatedCode ? (
                  <pre className="text-[#00FF41] leading-relaxed whitespace-pre-wrap">
                    {generatedCode}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-800">
                    <Terminal size={48} className="mb-4 opacity-20" />
                    <p className="mono uppercase tracking-[0.4em] text-center text-[10px]">Awaiting Instructions...</p>
                    <p className="mono text-[9px] text-gray-900 mt-2">AI로 생성하거나 검증된 전략을 선택하세요</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative */}
      <div className="absolute top-0 right-0 w-[60%] h-full -z-10 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_top_right,#00FF41_0%,transparent_70%)] blur-[100px]" />
      </div>
    </div>
  );
};

export default Dashboard;

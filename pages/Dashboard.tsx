
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Code, Link as LinkIcon, BookOpen, Copy, Check, Zap, Terminal, Shield, TrendingUp, Cpu, Play, AlertTriangle, Lock, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { SCRIPT_ID, BRAND_NAME } from '../constants';
import { generateTradingCode } from '../services/geminiService';
import { UserTier, ConsoleTheme, setUserTheme } from '../services/userService';

interface DashboardProps {
  tier: UserTier;
  theme: ConsoleTheme;
  uid: string;
  onThemeChange: (t: ConsoleTheme) => void;
}

// 검증된 전략 템플릿
const STRATEGY_TEMPLATES = [
  {
    id: 'rsi_swing',
    name: 'RSI Swing',
    desc: 'RSI 과매도 구간 진입, 과매수 구간 청산',
    color: '#6366F1',
    code: `function runTradingStrategy() {
  const rsi = SnapQuant.getRSI("TQQQ", 14);
  if (rsi < 30) {
    SnapQuant.placeOrder("TQQQ", "BUY", 5);
    SnapQuant.notify("RSI " + rsi + " - 매수 실행");
  } else if (rsi > 70) {
    SnapQuant.placeOrder("TQQQ", "SELL", 5);
    SnapQuant.notify("RSI " + rsi + " - 매도 실행");
  }
}`
  },
  {
    id: 'volatility_breakout',
    name: '변동성 돌파',
    desc: '전일 고가-저가 Range 기반 돌파 전략',
    color: '#3B82F6',
    code: `function runTradingStrategy() {
  const price = SnapQuant.getCurrentPrice("SPY");
  const ma20 = SnapQuant.getMovingAverage("SPY", 20);
  const range = price * 0.02; // 2% range
  if (price > ma20 + range) {
    SnapQuant.placeOrder("SPY", "BUY", 10);
    SnapQuant.notify("돌파 매수: $" + price);
  }
}`
  },
  {
    id: 'ma_crossover',
    name: 'MA Crossover',
    desc: '단기/장기 이동평균 교차 시그널',
    color: '#F59E0B',
    code: `function runTradingStrategy() {
  const ma5 = SnapQuant.getMovingAverage("QQQ", 5);
  const ma20 = SnapQuant.getMovingAverage("QQQ", 20);
  if (ma5 > ma20) {
    SnapQuant.placeOrder("QQQ", "BUY", 3);
    SnapQuant.notify("골든크로스 감지 - 매수");
  } else if (ma5 < ma20) {
    SnapQuant.placeOrder("QQQ", "SELL", 3);
    SnapQuant.notify("데드크로스 감지 - 매도");
  }
}`
  }
];

const Dashboard: React.FC<DashboardProps> = ({ tier, theme, uid, onThemeChange }) => {
  const isPro = tier === 'pro';
  const isLight = theme === 'light';
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'templates'>('ai');

  // AI 코드 생성
  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    const code = await generateTradingCode(prompt);
    setGeneratedCode(code);
    setIsGenerating(false);
  };

  // 클립보드 복사
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 템플릿 선택
  const selectTemplate = (template: typeof STRATEGY_TEMPLATES[0]) => {
    setGeneratedCode(template.code);
  };

  // 테마 전환
  const toggleTheme = async () => {
    const next = isLight ? 'dark' : 'light';
    onThemeChange(next);
    await setUserTheme(uid, next);
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row pt-20 relative overflow-hidden ${isLight ? 'bg-[#f0f2f5] text-gray-900 selection:bg-indigo-300' : 'bg-[#0A0A0F] selection:bg-indigo-500/30'}`}>
      {/* 사이드바 */}
      <aside className={`w-full md:w-72 border-r p-6 space-y-6 flex-shrink-0 backdrop-blur-3xl z-20 ${isLight ? 'border-gray-200 bg-white/80' : 'border-white/[0.06] bg-[#0D0D1A]/80'}`}>
        <div className="px-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
            <h2 className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em] mono">Connection Active</h2>
          </div>
          <p className={`text-[9px] mono uppercase tracking-widest ${isLight ? 'text-gray-400' : 'text-gray-600'}`}>Console: SQ-ENGINE-X</p>
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
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-semibold transition-all text-[11px] uppercase tracking-widest border
                ${item.active
                  ? (isLight ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20')
                  : (isLight ? 'text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-100' : 'text-gray-500 border-transparent hover:text-white hover:bg-white/5')
                }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className={`pt-6 border-t ${isLight ? 'border-gray-200' : 'border-white/[0.06]'}`}>
          <div className={`p-5 rounded-2xl border ${isPro
            ? (isLight ? 'bg-indigo-50 border-indigo-200' : 'bg-indigo-500/5 border-indigo-500/20')
            : (isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/[0.02] border-white/[0.06]')
            }`}>
            <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isLight ? 'text-gray-400' : 'text-gray-500'}`}>Account</h4>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase ${isPro ? 'text-indigo-400' : 'text-blue-400'}`}>
                {isPro ? 'Quant Pro' : 'Starter'}
              </span>
              {isPro ? <Zap size={14} className="text-amber-400" /> : <span className="text-[9px] text-gray-600">FREE</span>}
            </div>
            {!isPro && (
              <Link to="/pricing" className="mt-3 flex items-center gap-1 text-[9px] text-indigo-400 font-bold uppercase tracking-widest hover:underline">
                Upgrade to Pro <ArrowUpRight size={10} />
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl overflow-y-auto relative z-10">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Terminal className="text-indigo-400" />
              VIBE_CONSOLE
            </h1>
            <p className={`text-sm mt-1 font-medium ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>전략을 바이브하고, 코드를 받으세요. 당신의 구글 드라이브에서 실행됩니다.</p>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all ${isLight ? 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200' : 'bg-white/[0.03] border-white/[0.06] text-gray-400 hover:text-white'}`}
              title={isLight ? 'Dark Mode' : 'Light Mode'}
            >
              {isLight ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <div className={`px-5 py-2.5 border rounded-2xl text-[10px] mono uppercase tracking-widest ${isLight ? 'bg-white border-gray-200 text-gray-500' : 'bg-white/[0.03] border-white/[0.06] text-gray-500'}`}>
              Latency: <span className="text-emerald-400">0.2ms</span>
            </div>
          </div>
        </header>

        {/* 탭 전환 */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border ${activeTab === 'ai'
              ? (isLight ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20')
              : (isLight ? 'text-gray-400 border-gray-200 hover:bg-gray-50' : 'text-gray-500 border-white/[0.06] hover:bg-white/5')
              }`}
          >
            <span className="flex items-center gap-2"><Cpu size={14} /> AI Vibe Coder</span>
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border ${activeTab === 'templates'
              ? (isLight ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-blue-500/10 text-blue-400 border-blue-500/20')
              : (isLight ? 'text-gray-400 border-gray-200 hover:bg-gray-50' : 'text-gray-500 border-white/[0.06] hover:bg-white/5')
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
                className={`p-8 rounded-3xl shadow-2xl relative border ${isLight ? 'bg-white border-gray-200' : 'bg-white/[0.02] border-white/[0.06] backdrop-blur-xl'}`}
              >
                <h3 className="text-lg font-bold mb-6 flex items-center gap-3 tracking-tight">
                  <Cpu className="text-indigo-400" size={20} /> AI VIBE CODER
                </h3>

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className={`w-full h-40 border rounded-2xl p-6 placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all mb-6 font-mono text-sm leading-relaxed ${isLight ? 'bg-gray-50 border-gray-200 text-gray-800' : 'bg-black/40 border-white/[0.08] text-white'}`}
                  placeholder="전략을 자연어로 입력하세요. (예: RSI가 30 이하일 때 TQQQ 5주 매수...)"
                />

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt}
                  className="w-full py-5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all uppercase tracking-[0.15em] text-xs shadow-lg shadow-indigo-500/20"
                >
                  {isGenerating ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Code size={18} />}
                  Generate Code
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold flex items-center gap-3 tracking-tight mb-4">
                  <TrendingUp className="text-blue-400" size={20} /> 검증된 전략 선택
                </h3>
                {STRATEGY_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => selectTemplate(t)}
                    className={`w-full p-5 rounded-2xl border transition-all text-left group flex items-center gap-4 ${isLight ? 'border-gray-200 bg-white hover:bg-gray-50' : 'border-white/[0.06] bg-[#0D0D1A] hover:bg-white/5'}`}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: t.color + '20', color: t.color }}>
                      <Play size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold tracking-tight" style={{ color: t.color }}>{t.name}</div>
                      <div className={`text-xs mt-0.5 ${isLight ? 'text-gray-400' : 'text-gray-500'}`}>{t.desc}</div>
                    </div>
                    <Code size={16} className={`${isLight ? 'text-gray-300 group-hover:text-gray-600' : 'text-gray-600 group-hover:text-white'} transition-colors`} />
                  </button>
                ))}

                {/* 면책 조항 */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 mt-4">
                  <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-500/70 leading-relaxed">
                    모든 알고리즘의 선택과 활용은 사용자 본인의 판단이며, SnapQuant와 무관합니다. 투자 손실에 대한 책임은 사용자에게 있습니다.
                  </p>
                </div>
              </motion.div>
            )}

            <div className={`p-8 border rounded-3xl ${isLight ? 'bg-white border-gray-200' : 'bg-[#0D0D1A] border-white/[0.06]'}`}>
              <h3 className="text-lg font-bold mb-5 flex items-center gap-3 tracking-tight">
                <LinkIcon className="text-blue-400" size={18} /> BRIDGE_ID
              </h3>
              <div className={`p-5 rounded-xl border border-dashed mb-4 flex items-center justify-between gap-2 ${isLight ? 'bg-gray-50 border-blue-200' : 'bg-black/40 border-blue-500/20'}`}>
                <code className="mono text-xs text-blue-400 break-all">{SCRIPT_ID}</code>
                <button onClick={() => copyToClipboard(SCRIPT_ID)} className="p-3 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-all flex-shrink-0">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <p className={`text-[10px] leading-relaxed uppercase tracking-widest font-bold ${isLight ? 'text-gray-400' : 'text-gray-500'}`}>
                [NOTICE]: 이 ID를 당신의 Google Apps Script 라이브러리에 추가하세요.
              </p>
            </div>
          </div>

          <div className="flex flex-col h-full min-h-[500px]">
            <div className={`border rounded-3xl flex flex-col h-full overflow-hidden shadow-2xl ${isLight ? 'bg-white border-gray-200' : 'bg-[#0D0D1A] border-white/[0.06]'}`}>
              <div className={`p-5 border-b flex items-center justify-between ${isLight ? 'border-gray-200 bg-gray-50' : 'border-white/[0.06] bg-black/40'}`}>
                <span className={`text-[10px] font-bold uppercase mono tracking-widest ${isLight ? 'text-gray-400' : 'text-gray-500'}`}>GENERATED_CODE.gs</span>
                <button
                  onClick={() => copyToClipboard(generatedCode)}
                  disabled={!generatedCode}
                  className="px-4 py-2 text-[10px] font-bold text-indigo-400 flex items-center gap-2 border border-indigo-500/20 rounded-xl hover:bg-indigo-500/10 transition-all uppercase tracking-widest"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  Copy
                </button>
              </div>

              <div className={`flex-1 p-8 font-mono text-xs overflow-auto ${isLight ? 'bg-gray-50' : 'bg-black/60'}`}>
                {generatedCode ? (
                  <pre className={`leading-relaxed whitespace-pre-wrap ${isLight ? 'text-indigo-700' : 'text-indigo-300'}`}>
                    {generatedCode}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center">
                    <Terminal size={48} className={`mb-4 ${isLight ? 'text-gray-200' : 'text-gray-800'}`} />
                    <p className={`mono uppercase tracking-[0.4em] text-center text-[10px] ${isLight ? 'text-gray-300' : 'text-gray-700'}`}>Awaiting Instructions...</p>
                    <p className={`mono text-[9px] mt-2 ${isLight ? 'text-gray-300' : 'text-gray-800'}`}>AI로 생성하거나 검증된 전략을 선택하세요</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 장식 요소 */}
      <div className="absolute top-0 right-0 w-[60%] h-full -z-10 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_top_right,#6366F1_0%,transparent_70%)] blur-[100px]" />
      </div>
    </div>
  );
};

export default Dashboard;

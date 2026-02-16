
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase.config';
import { motion } from 'framer-motion';
import { Terminal, Code, BookOpen, Copy, Check, Cpu, Play, AlertTriangle, TrendingUp, User, LogOut, HelpCircle, ChevronLeft, ChevronRight, Zap, ArrowUpRight, ExternalLink, Trash2, AlertOctagon } from 'lucide-react';
import { SCRIPT_ID, BRAND_LOGO, BRAND_NAME } from '../constants';
import { generateTradingCode } from '../services/geminiService';
import { UserTier, deleteUserAccount } from '../services/userService';

interface DashboardProps {
  tier: UserTier;
  uid: string;
  userName: string;
  userPhoto: string;
  userEmail: string;
}

// 검증된 전략 템플릿
const STRATEGY_TEMPLATES = [
  {
    id: 'rsi_swing',
    name: 'RSI Swing',
    desc: 'RSI 과매도 구간 진입, 과매수 구간 청산',
    color: '#6366F1',
    code: `function runTradingStrategy() {
  const price = SnapQuant.getPrice("TQQQ");
  const rsi = SnapQuant.getRSI("TQQQ", 14);
  if (rsi < 30) {
    SnapQuant.placeOrder("TQQQ", "BUY", 5);
    SnapQuant.notify("RSI 과매도 진입: " + rsi);
  } else if (rsi > 70) {
    SnapQuant.placeOrder("TQQQ", "SELL", 5);
    SnapQuant.notify("RSI 과매수 청산: " + rsi);
  }
}`
  },
  {
    id: 'breakout',
    name: 'Breakout',
    desc: '이동평균 돌파 시 매수',
    color: '#10B981',
    code: `function runTradingStrategy() {
  const price = SnapQuant.getPrice("SPY");
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

const Dashboard: React.FC<DashboardProps> = ({ tier, uid, userName, userPhoto, userEmail }) => {
  const navigate = useNavigate();
  const isPro = tier === 'pro';
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'templates'>('ai');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState<'console' | 'docs' | 'account' | 'support'>('console');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

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

  // 로그아웃
  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  // 회원 탈퇴 처리
  const handleDeleteAccount = async () => {
    if (deleteInput !== '탈퇴합니다') return;
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setIsDeleting(true);
    setDeleteError('');

    const result = await deleteUserAccount(currentUser);

    if (result.success) {
      navigate('/');
    } else {
      setDeleteError(result.error || '알 수 없는 오류');
      setIsDeleting(false);
    }
  };

  // 사이드바 메뉴 항목
  const menuItems = [
    { id: 'console' as const, icon: <Terminal size={18} />, label: 'Console' },
    { id: 'docs' as const, icon: <BookOpen size={18} />, label: 'Docs' },
    { id: 'account' as const, icon: <User size={18} />, label: '계정 정보' },
    { id: 'support' as const, icon: <HelpCircle size={18} />, label: 'Support' },
  ];

  return (
    <div className="h-screen flex bg-[#0A0A0F] text-white overflow-hidden">
      {/* 사이드바 */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 border-r border-white/[0.06] bg-[#0D0D1A] flex flex-col flex-shrink-0 relative`}>
        {/* 로고 & 토글 */}
        <div className={`p-4 border-b border-white/[0.06] flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              {BRAND_LOGO}
              <span className="text-sm font-extrabold mono bg-gradient-to-r from-indigo-400 to-amber-400 bg-clip-text text-transparent">{BRAND_NAME}</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-all">
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* 연결 상태 */}
        {sidebarOpen && (
          <div className="px-5 py-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-[0.2em] mono">Active</span>
            </div>
            <p className="text-[9px] mono text-gray-600 uppercase tracking-widest">SQ-ENGINE-X</p>
          </div>
        )}

        {/* 메뉴 */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              title={!sidebarOpen ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all text-[11px] uppercase tracking-widest
                ${activeMenu === item.id
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-gray-600 border border-transparent bg-transparent hover:text-gray-300 hover:bg-white/[0.03]'
                } ${!sidebarOpen ? 'justify-center' : ''}`}
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* 하단: 계정 + 로그아웃 */}
        <div className={`border-t border-white/[0.06] ${sidebarOpen ? 'p-4' : 'p-2'}`}>
          {sidebarOpen && (
            <div className={`mb-3 p-3 rounded-xl border ${isPro ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-white/[0.02] border-white/[0.06]'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-bold uppercase ${isPro ? 'text-indigo-400' : 'text-blue-400'}`}>
                  {isPro ? 'Quant Pro' : 'Starter'}
                </span>
                {isPro ? <Zap size={12} className="text-amber-400" /> : <span className="text-[9px] text-gray-600">FREE</span>}
              </div>
              {!isPro && (
                <Link to="/pricing" className="flex items-center gap-1 text-[9px] text-indigo-400 font-bold uppercase tracking-widest hover:underline">
                  Upgrade to Pro <ArrowUpRight size={9} />
                </Link>
              )}
            </div>
          )}

          {sidebarOpen && (
            <div className="flex items-center gap-2 mb-3 px-1">
              {userPhoto && <img src={userPhoto} alt="" className="w-7 h-7 rounded-full border border-indigo-500/30" />}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-300 font-medium truncate">{userName}</p>
                <p className="text-[9px] text-gray-600 truncate">{userEmail}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleSignOut}
            title="로그아웃"
            className={`${sidebarOpen ? 'w-full px-3 py-2' : 'w-full p-2 justify-center'} flex items-center gap-2 rounded-xl text-[10px] font-bold text-gray-600 bg-transparent hover:text-red-400 hover:bg-red-500/5 transition-all uppercase tracking-widest`}
          >
            <LogOut size={14} />
            {sidebarOpen && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 상단 바 */}
        <header className="h-14 border-b border-white/[0.06] bg-[#0D0D1A]/50 backdrop-blur-xl flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Terminal className="text-indigo-400" size={18} />
            <h1 className="text-sm font-bold tracking-tight uppercase mono">VIBE_CONSOLE</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-1.5 border border-white/[0.06] rounded-xl bg-white/[0.02] text-[9px] mono uppercase tracking-widest text-gray-500">
              Latency: <span className="text-emerald-400">0.2ms</span>
            </div>
          </div>
        </header>

        {/* 작업 영역 */}
        {activeMenu === 'console' && (
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {/* 탭 전환 */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setActiveTab('ai')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${activeTab === 'ai'
                  ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  : 'text-gray-600 bg-transparent border-white/[0.04] hover:text-gray-400 hover:bg-white/[0.03]'
                  }`}
              >
                <span className="flex items-center gap-2"><Cpu size={14} /> AI Vibe Coder</span>
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${activeTab === 'templates'
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  : 'text-gray-600 bg-transparent border-white/[0.04] hover:text-gray-400 hover:bg-white/[0.03]'
                  }`}
              >
                <span className="flex items-center gap-2"><TrendingUp size={14} /> 검증된 전략</span>
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                {activeTab === 'ai' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl"
                  >
                    <h3 className="text-base font-bold mb-4 flex items-center gap-3 tracking-tight">
                      <Cpu className="text-indigo-400" size={18} /> AI VIBE CODER
                    </h3>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full h-36 border border-white/[0.08] rounded-xl p-5 bg-black/40 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all mb-4 font-mono text-sm leading-relaxed"
                      placeholder="전략을 자연어로 입력하세요. (예: RSI가 30 이하일 때 TQQQ 5주 매수...)"
                    />
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt}
                      className="w-full py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all uppercase tracking-[0.15em] text-xs shadow-lg shadow-indigo-500/20"
                    >
                      {isGenerating ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Code size={16} />}
                      Generate Code
                    </button>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
                    <h3 className="text-base font-bold flex items-center gap-3 tracking-tight mb-3">
                      <TrendingUp className="text-blue-400" size={18} /> 검증된 전략 선택
                    </h3>
                    {STRATEGY_TEMPLATES.map((t) => (
                      <button key={t.id} onClick={() => selectTemplate(t)} className="w-full p-4 rounded-xl border border-white/[0.06] bg-[#0D0D1A] hover:bg-white/5 transition-all text-left group flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: t.color + '20', color: t.color }}>
                          <Play size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-bold tracking-tight" style={{ color: t.color }}>{t.name}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">{t.desc}</div>
                        </div>
                        <Code size={14} className="text-gray-600 group-hover:text-white transition-colors" />
                      </button>
                    ))}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 mt-3">
                      <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-[9px] text-amber-500/70 leading-relaxed">
                        모든 알고리즘의 선택과 활용은 사용자 본인의 판단이며, SnapQuant와 무관합니다.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Bridge ID */}
                <div className="p-6 border border-white/[0.06] rounded-2xl bg-[#0D0D1A]">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-3 tracking-tight">
                    <ExternalLink className="text-blue-400" size={16} /> BRIDGE_ID
                  </h3>
                  <div className="p-4 rounded-lg border border-dashed border-blue-500/20 bg-black/40 flex items-center justify-between gap-2 mb-3">
                    <code className="mono text-xs text-blue-400 break-all">{SCRIPT_ID}</code>
                    <button onClick={() => copyToClipboard(SCRIPT_ID)} className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all flex-shrink-0">
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                  <p className="text-[9px] text-gray-500 leading-relaxed uppercase tracking-widest font-bold mono">
                    이 ID를 Google Apps Script 라이브러리에 추가하세요.
                  </p>
                </div>
              </div>

              {/* 코드 출력 패널 */}
              <div className="flex flex-col min-h-[450px]">
                <div className="border border-white/[0.06] rounded-2xl flex flex-col h-full overflow-hidden bg-[#0D0D1A]">
                  <div className="p-4 border-b border-white/[0.06] bg-black/40 flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase mono tracking-widest text-gray-500">GENERATED_CODE.gs</span>
                    <button
                      onClick={() => copyToClipboard(generatedCode)}
                      disabled={!generatedCode}
                      className="px-3 py-1.5 text-[9px] font-bold text-indigo-400 flex items-center gap-2 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/10 transition-all uppercase tracking-widest disabled:opacity-30"
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />} Copy
                    </button>
                  </div>
                  <div className="flex-1 p-6 font-mono text-xs overflow-auto bg-black/60">
                    {generatedCode ? (
                      <pre className="leading-relaxed whitespace-pre-wrap text-indigo-300">{generatedCode}</pre>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center">
                        <Terminal size={40} className="text-gray-800 mb-3" />
                        <p className="mono uppercase tracking-[0.3em] text-[9px] text-gray-700">Awaiting Instructions...</p>
                        <p className="mono text-[9px] mt-1.5 text-gray-800">AI로 생성하거나 검증된 전략을 선택하세요</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Docs 패널 */}
        {activeMenu === 'docs' && (
          <div className="flex-1 overflow-y-auto p-8">
            <h2 className="text-2xl font-bold mb-6">📖 Documentation</h2>
            <div className="space-y-4 max-w-3xl">
              <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <h3 className="text-sm font-bold text-indigo-400 mb-3">시작하기</h3>
                <ol className="space-y-2 text-sm text-gray-400 list-decimal list-inside">
                  <li>Google Apps Script에서 새 프로젝트를 생성합니다</li>
                  <li>BRIDGE_ID를 라이브러리에 추가합니다</li>
                  <li>AI Vibe Coder로 전략 코드를 생성합니다</li>
                  <li>생성된 코드를 GAS에 붙여넣고 실행합니다</li>
                </ol>
              </div>
              <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <h3 className="text-sm font-bold text-indigo-400 mb-3">API Reference</h3>
                <div className="space-y-2 text-sm text-gray-400 font-mono">
                  <p><span className="text-emerald-400">SnapQuant.getPrice</span>(symbol) — 현재가 조회</p>
                  <p><span className="text-emerald-400">SnapQuant.getRSI</span>(symbol, period) — RSI 지표</p>
                  <p><span className="text-emerald-400">SnapQuant.getMovingAverage</span>(symbol, period) — 이동평균</p>
                  <p><span className="text-emerald-400">SnapQuant.placeOrder</span>(symbol, side, qty) — 주문</p>
                  <p><span className="text-emerald-400">SnapQuant.notify</span>(message) — 알림 전송</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 계정 정보 패널 */}
        {activeMenu === 'account' && (
          <div className="flex-1 overflow-y-auto p-8">
            <h2 className="text-2xl font-bold mb-6">👤 계정 정보</h2>
            <div className="max-w-lg space-y-4">
              <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center gap-4 mb-4">
                  {userPhoto && <img src={userPhoto} alt="" className="w-14 h-14 rounded-full border-2 border-indigo-500/30" />}
                  <div>
                    <p className="text-base font-bold">{userName}</p>
                    <p className="text-sm text-gray-500">{userEmail}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/[0.06]">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">현재 플랜</p>
                    <p className={`text-lg font-bold ${isPro ? 'text-indigo-400' : 'text-blue-400'}`}>
                      {isPro ? 'Quant Pro' : 'Starter (Free)'}
                    </p>
                  </div>
                  {isPro ? (
                    <Zap size={24} className="text-amber-400" />
                  ) : (
                    <Link to="/pricing" className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-xs font-bold rounded-xl uppercase tracking-widest hover:scale-105 transition-all">
                      Pro 업그레이드
                    </Link>
                  )}
                </div>
              </div>

              {/* 회원 탈퇴 — 숨겨진 섹션 */}
              <div className="mt-8 p-6 rounded-2xl border border-white/[0.04] bg-white/[0.01]">
                <button
                  onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                  className="flex items-center gap-2 text-[11px] text-gray-600 hover:text-red-400 transition-colors uppercase tracking-widest font-medium"
                >
                  <Trash2 size={13} /> 회원 탈퇴
                </button>

                {showDeleteConfirm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-5 p-5 rounded-xl border border-red-500/20 bg-red-500/5"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <AlertOctagon size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-red-400 mb-1">정말 탈퇴하시겠습니까?</p>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          탈퇴하면 <span className="text-red-400 font-semibold">모든 계정 데이터가 영구 삭제</span>됩니다.
                          {isPro && ' Pro 정기결제도 자동으로 해지됩니다.'}
                        </p>
                        {isPro && (
                          <p className="text-[10px] text-amber-500/80 mt-2 p-2 rounded bg-amber-500/5 border border-amber-500/10">
                            ⚠️ Polar 정기결제가 있다면, <a href="https://polar.sh" target="_blank" rel="noreferrer" className="underline">Polar.sh 대시보드</a>에서 구독도 확인/취소해 주세요.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-[10px] text-gray-500 block mb-2 uppercase tracking-widest font-bold">
                        확인을 위해 <span className="text-red-400 font-bold">'탈퇴합니다'</span>를 입력해주세요
                      </label>
                      <input
                        type="text"
                        value={deleteInput}
                        onChange={(e) => setDeleteInput(e.target.value)}
                        placeholder="탈퇴합니다"
                        className="w-full px-4 py-3 rounded-xl border border-red-500/20 bg-black/40 text-white text-sm placeholder-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                      />
                    </div>

                    {deleteError && (
                      <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                        {deleteError}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleteInput !== '탈퇴합니다' || isDeleting}
                        className="flex-1 py-3 bg-red-500/20 text-red-400 font-bold text-xs rounded-xl border border-red-500/30 hover:bg-red-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        {isDeleting ? (
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <><Trash2 size={13} /> 탈퇴 확인</>
                        )}
                      </button>
                      <button
                        onClick={() => { setShowDeleteConfirm(false); setDeleteInput(''); setDeleteError(''); }}
                        className="px-5 py-3 text-gray-500 text-xs font-bold rounded-xl border border-white/[0.06] hover:bg-white/5 transition-all uppercase tracking-widest"
                      >
                        취소
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Support 패널 */}
        {activeMenu === 'support' && (
          <div className="flex-1 overflow-y-auto p-8">
            <h2 className="text-2xl font-bold mb-6">💬 Support</h2>
            <div className="max-w-lg space-y-4">
              <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <h3 className="text-sm font-bold text-indigo-400 mb-3">문의하기</h3>
                <p className="text-sm text-gray-400 mb-4">기술적인 문의나 결제 관련 질문은 아래로 연락주세요.</p>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-400">📧 <span className="text-indigo-400">support@snapquant.io</span></p>
                  <p className="text-gray-400">💬 <span className="text-indigo-400">Discord Community</span></p>
                </div>
              </div>
              <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <h3 className="text-sm font-bold text-indigo-400 mb-3">FAQ</h3>
                <div className="space-y-3 text-sm text-gray-400">
                  <div>
                    <p className="font-bold text-gray-300 mb-1">Pro 결제 후 반영이 안됩니다</p>
                    <p>결제 후 최대 1분 이내 자동 반영됩니다. 반영이 안 될 경우 페이지를 새로고침 해주세요.</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-300 mb-1">구독 취소는 어떻게 하나요?</p>
                    <p>Polar.sh 대시보드에서 직접 취소할 수 있으며, 즉시 Starter로 전환됩니다.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 배경 장식 */}
      <div className="fixed top-0 right-0 w-[40%] h-full -z-10 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_top_right,#6366F1_0%,transparent_70%)] blur-[100px]" />
      </div>
    </div>
  );
};

export default Dashboard;

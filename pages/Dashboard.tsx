
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Code, Link as LinkIcon, BookOpen, Copy, Check, Zap, Terminal, Shield, TrendingUp, Cpu } from 'lucide-react';
import { SCRIPT_ID, BRAND_NAME } from '../constants';
import { generateTradingCode } from '../services/geminiService';

const Dashboard: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row pt-20 relative overflow-hidden selection:bg-[#00FF41] selection:text-black">
      {/* Sidebar */}
      <aside className="w-full md:w-80 border-r border-white/5 p-8 space-y-8 flex-shrink-0 bg-black/50 backdrop-blur-3xl z-20">
        <div className="px-2">
           <div className="flex items-center gap-3 mb-2">
              <div className="w-2.5 h-2.5 bg-[#00FF41] rounded-full animate-pulse shadow-[0_0_15px_#00FF41]" />
              <h2 className="text-[10px] font-black text-[#00FF41] uppercase tracking-[0.3em] mono">Connection Active</h2>
           </div>
           <p className="text-[9px] text-gray-600 mono uppercase tracking-widest">Protocol: QD-SERVER-X</p>
        </div>

        <nav className="space-y-2">
          {[
            { icon: <LayoutDashboard size={18} />, label: "Mission Control", active: true },
            { icon: <Code size={18} />, label: "AI Architect" },
            { icon: <LinkIcon size={18} />, label: "Bridge Config" },
            { icon: <Shield size={18} />, label: "Security Keys" },
            { icon: <BookOpen size={18} />, label: "Manual" },
          ].map((item, idx) => (
            <button 
              key={idx} 
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black transition-all text-[11px] uppercase tracking-widest border
                ${item.active ? 'bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]/20' : 'text-gray-500 border-transparent hover:text-white hover:bg-white/5'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        
        <div className="pt-10 border-t border-white/5">
           <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Account Status</h4>
              <div className="flex items-center justify-between">
                 <span className="text-xs font-bold text-white uppercase italic">Quant Pro</span>
                 <Zap size={14} className="text-[#00FF41]" />
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-16 max-w-7xl overflow-y-auto relative z-10">
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic flex items-center gap-4">
              <Terminal className="text-[#00FF41]" /> 
              COMMAND_BRIEFING
            </h1>
            <p className="text-gray-500 text-sm mt-2 font-medium">당신의 구글 드라이브 트레이딩 엔진을 제어하세요.</p>
          </div>
          <div className="flex gap-4">
             <div className="px-6 py-3 bg-[#050A14] border border-white/10 rounded-2xl text-[10px] mono text-gray-500 uppercase tracking-widest">
                Latency: <span className="text-[#00FF41]">0.2ms</span>
             </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 glass-panel rounded-[3rem] shadow-2xl relative"
            >
              <h3 className="text-xl font-black mb-8 flex items-center gap-3 uppercase italic tracking-tight">
                 <Cpu className="text-[#00FF41]" size={20} /> AI ARCHITECT
              </h3>
              
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-48 bg-black/40 border border-white/10 rounded-3xl p-8 text-white placeholder-gray-700 focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] outline-none transition-all mb-8 font-mono text-sm leading-relaxed"
                placeholder="전략을 자연어로 입력하세요. (예: RSI가 30 이하일 때 TQQQ 5주 매수...)"
              />
              
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className="w-full py-6 bg-[#00FF41] text-black font-black rounded-3xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all uppercase tracking-[0.2em] text-xs"
              >
                {isGenerating ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Code size={20} />}
                Generate Protocol
              </button>
            </motion.div>

            <div className="p-10 bg-[#050A14] border border-white/10 rounded-[3rem]">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3 uppercase italic tracking-tight">
                 <LinkIcon className="text-[#00D1FF]" size={20} /> BRIDGE_ID
              </h3>
              <div className="p-6 bg-black rounded-2xl border border-dashed border-[#00D1FF]/30 mb-6 flex items-center justify-between">
                 <code className="mono text-xs text-[#00D1FF] break-all">{SCRIPT_ID}</code>
                 <button onClick={() => copyToClipboard(SCRIPT_ID)} className="p-4 bg-[#00D1FF]/10 text-[#00D1FF] rounded-2xl hover:bg-[#00D1FF]/20 transition-all">
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                 </button>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-widest font-bold">
                [NOTICE]: 이 ID를 당신의 Google Apps Script 라이브러리에 추가하세요.
              </p>
            </div>
          </div>

          <div className="flex flex-col h-full min-h-[600px]">
            <div className="bg-[#050A14] border border-white/10 rounded-[3rem] flex flex-col h-full overflow-hidden shadow-2xl">
               <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40">
                  <span className="text-[10px] font-black text-gray-500 uppercase mono italic tracking-widest">MISSION_SCRIPT.gs</span>
                  <button 
                    onClick={() => copyToClipboard(generatedCode)}
                    disabled={!generatedCode}
                    className="px-5 py-2.5 text-[10px] font-black text-[#00FF41] flex items-center gap-2 border border-[#00FF41]/20 rounded-xl hover:bg-[#00FF41]/10 transition-all uppercase tracking-widest"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    Copy Code
                  </button>
               </div>
               
               <div className="flex-1 p-10 bg-black/80 font-mono text-xs overflow-auto">
                  {generatedCode ? (
                    <pre className="text-[#00FF41] leading-relaxed">
                      {generatedCode}
                    </pre>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-800">
                       <p className="mono uppercase tracking-[0.4em] text-center text-[10px]">Awaiting Instructions...</p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative Matrix Background for Dashboard */}
      <div className="absolute top-0 right-0 w-[60%] h-full -z-10 opacity-10 pointer-events-none">
         <div className="w-full h-full bg-[radial-gradient(circle_at_top_right,#00FF41_0%,transparent_70%)] blur-[100px]" />
      </div>
    </div>
  );
};

export default Dashboard;

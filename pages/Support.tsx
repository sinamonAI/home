
import React, { useState } from 'react';
import { Mail, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_DATA = [
  {
    question: "IP 차단 문제는 없나요?",
    answer: "SnapQuant는 스윙 트레이딩 및 일 단위 전략에 최적화되어 있습니다. 구글 서버의 IP를 통해 통신하므로 개인 IP 노출 걱정이 없으며, 표준 API 가이드를 준수하여 IP 차단 가능성을 최소화했습니다."
  },
  {
    question: "내 API Key는 안전한가요?",
    answer: "SnapQuant 웹사이트는 당신의 API Key를 묻지도 저장하지도 않습니다. 당신이 생성한 코드는 오직 당신의 구글 드라이브 내 'UserProperties'라는 암호화된 내부 저장소에만 저장됩니다."
  },
  {
    question: "코딩을 아예 몰라도 되나요?",
    answer: "네. AI Strategy Generator가 자연어를 분석하여 실행 가능한 코드로 변환해줍니다. 당신은 전략적 직관만 준비하세요."
  }
];

const Support: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="pt-20 pb-2 px-4 bg-[#0A0A0F] flex-1 flex flex-col">
      <div className="max-w-4xl mx-auto flex-1 flex flex-col w-full">
        <h1 className="text-3xl font-bold mb-6 text-center tracking-tight">Help Center</h1>

        <div className="grid md:grid-cols-2 gap-4 mb-6 flex-1">
          <div className="p-8 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex flex-col justify-center hover:bg-white/[0.04] transition-colors">
            <Mail className="text-blue-400 mb-4" size={36} />
            <h3 className="text-xl font-bold mb-2">Email Support</h3>
            <p className="text-gray-400 mb-6">sinamon.inc@gmail.com</p>
            <button className="w-full py-3 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-xl transition-all font-semibold text-sm">Contact Us</button>
          </div>
          <div className="p-8 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex flex-col justify-center hover:bg-white/[0.04] transition-colors">
            <MessageSquare className="text-indigo-400 mb-4" size={36} />
            <h3 className="text-xl font-bold mb-2">Community</h3>
            <p className="text-gray-400 mb-6">Join our Discord</p>
            <button className="w-full py-3 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-xl transition-all font-semibold text-sm">Join Channel</button>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-gradient-to-b from-indigo-400 to-amber-400 rounded-full" /> 자주 묻는 질문
          </h2>
          <div className="space-y-3">
            {FAQ_DATA.map((faq, idx) => (
              <div key={idx} className="border border-white/[0.06] rounded-xl bg-white/[0.02] overflow-hidden hover:border-white/[0.1] transition-colors">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full p-4 text-left flex justify-between items-center text-sm"
                >
                  <span className="font-semibold">{faq.question}</span>
                  {openIndex === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openIndex === idx && (
                  <div className="px-4 pb-4 text-gray-400 text-sm leading-relaxed border-t border-white/[0.06] pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Support;

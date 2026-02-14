
import React, { useState } from 'react';
import { Mail, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_DATA = [
  {
    question: "IP 차단 문제는 없나요?",
    answer: "AlgoCloud는 스윙 트레이딩 및 일 단위 전략에 최적화되어 있습니다. 구글 서버의 IP를 통해 통신하므로 개인 IP 노출 걱정이 없으며, 표준 API 가이드를 준수하여 IP 차단 가능성을 최소화했습니다."
  },
  {
    question: "내 API Key는 안전한가요?",
    answer: "AlgoCloud 웹사이트는 당신의 API Key를 묻지도 저장하지도 않습니다. 당신이 생성한 코드는 오직 당신의 구글 드라이브 내 'UserProperties'라는 암호화된 내부 저장소에만 저장됩니다."
  },
  {
    question: "코딩을 아예 몰라도 되나요?",
    answer: "네. AI Strategy Generator가 자연어를 분석하여 실행 가능한 코드로 변환해줍니다. 당신은 전략적 직관만 준비하세요."
  }
];

const Support: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="pt-32 pb-24 px-4 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center">Help Center</h1>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 bg-[#050A14] border border-gray-800 rounded-3xl">
             <Mail className="text-[#00D1FF] mb-4" size={32} />
             <h3 className="text-xl font-bold mb-2">Email Support</h3>
             <p className="text-gray-400 mb-6">sinamon.inc@gmail.com</p>
             <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all">Contact Us</button>
          </div>
          <div className="p-8 bg-[#050A14] border border-gray-800 rounded-3xl">
             <MessageSquare className="text-[#00FF41] mb-4" size={32} />
             <h3 className="text-xl font-bold mb-2">Community</h3>
             <p className="text-gray-400 mb-6">Join our Discord</p>
             <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all">Join Channel</button>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <span className="w-2 h-8 bg-[#00FF41] rounded-full" /> 자주 묻는 질문
          </h2>
          <div className="space-y-4">
            {FAQ_DATA.map((faq, idx) => (
              <div key={idx} className="border border-gray-800 rounded-2xl bg-[#050A14]/50 overflow-hidden">
                <button 
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center"
                >
                  <span className="font-semibold">{faq.question}</span>
                  {openIndex === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {openIndex === idx && (
                  <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-gray-800 pt-4">
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


import { GoogleGenAI } from "@google/genai";

// 안전한 초기화 - 환경변수에서 API 키 로드
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
let ai: any = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (e) {
    console.error("Gemini AI 초기화 실패:", e);
  }
}

const SYSTEM_INSTRUCTION = `
You are an AI coding expert for SnapQuant, a Google Apps Script (GAS) based trading platform.
Your task is to convert user's natural language trading strategy into a "Consumer Script" that uses the 'SnapQuantLibrary'.

The 'SnapQuantLibrary' provides the following global functions:
1. SnapQuant.placeOrder(symbol, side, quantity) - side is 'BUY' or 'SELL'
2. SnapQuant.getCurrentPrice(symbol) - returns a number
3. SnapQuant.getRSI(symbol, period) - returns RSI value
4. SnapQuant.getMovingAverage(symbol, period) - returns MA value
5. SnapQuant.notify(message) - sends notification to Slack/Telegram

Rules:
- Generate ONLY the JavaScript code block for Google Apps Script.
- The user script must have a function named 'runTradingStrategy()'.
- Do not explain the code unless asked, just provide the valid JS code.
- Ensure the code is robust and follows the library's pattern.
`;

// AI 코드 생성 함수 (최대 3회 재시도)
export const generateTradingCode = async (prompt: string, retryCount = 0): Promise<string> => {
  const MAX_RETRIES = 3;

  if (!ai) {
    console.warn("Gemini AI 미설정 (API Key 없음)");
    return "// 오류: AI 서비스가 설정되지 않았습니다. API Key를 확인해주세요.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text;
  } catch (error: any) {
    console.error(`코드 생성 오류 (시도 ${retryCount + 1}/${MAX_RETRIES}):`, error);

    // 재시도 로직 (지수 백오프)
    if (retryCount < MAX_RETRIES - 1) {
      const delay = Math.pow(2, retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return generateTradingCode(prompt, retryCount + 1);
    }

    return "// 오류: 코드 생성에 실패했습니다. 잠시 후 다시 시도해주세요.";
  }
};


// import { GoogleGenAI } from "@google/genai"; // Fetch API 사용으로 변경됨

// 안전한 초기화 - 환경 변수 사용
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = 'gemini-2.0-flash';

const SYSTEM_INSTRUCTION = {
  parts: [{
    text: `You are an AI coding expert for SnapQuant, a Google Apps Script (GAS) based trading platform.
Your task is to convert user's natural language trading strategy into a "Consumer Script" that uses the 'SnapQuantLibrary'.

The 'SnapQuantLibrary' provides the following global functions:
1. SnapQuant.placeOrder(symbol, side, quantity) - side is 'BUY' or 'SELL'
2. SnapQuant.getCurrentPrice(symbol) - returns a number
3. SnapQuant.getRSI(symbol, period) - returns RSI value
4. SnapQuant.getMovingAverage(symbol, period) - returns MA value
5. SnapQuant.notify(message) - sends notification to Slack/Telegram

Rules:
- Provide a helpful response with a brief explanation of the strategy.
- Always include the Google Apps Script code in a markdown code block (e.g., \`\`\`javascript ... \`\`\`).
- The user script must have a function named 'runTradingStrategy()'.
- Ensure the code is robust and follows the library's pattern.`
  }]
};

// AI 코드 생성 함수 (fetch 사용)
export const generateTradingCode = async (prompt: string, retryCount = 0): Promise<string> => {
  const MAX_RETRIES = 3;

  if (!API_KEY) {
    return "// 오류: API Key가 설정되지 않았습니다.";
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        systemInstruction: SYSTEM_INSTRUCTION,
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API Error:', response.status, errorData);

      if (response.status === 429) {
        throw new Error("너무 많은 요청입니다. 잠시 후 다시 시도해주세요. (Rate Limit)");
      }
      throw new Error(`API 오류 (${response.status}): ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("AI가 응답을 생성하지 못했습니다.");
    }

    return data.candidates[0].content.parts[0].text;

  } catch (error: any) {
    console.error(`코드 생성 오류 (시도 ${retryCount + 1}/${MAX_RETRIES}):`, error);

    // 재시도 로직 (지수 백오프) - 429 에러나 네트워크 에러 시
    if (retryCount < MAX_RETRIES - 1) {
      const delay = Math.pow(2, retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return generateTradingCode(prompt, retryCount + 1);
    }

    // 사용자에게 보여줄 에러 메시지 반환
    return `// 오류: ${error.message}`;
  }
};

// AI 응답에서 코드 블록만 추출하는 헬퍼 함수
export const extractGasCode = (response: string): string => {
  const codeBlockRegex = /```(?:javascript|js)?\s*([\s\S]*?)```/;
  const match = response.match(codeBlockRegex);
  return match ? match[1].trim() : '';
};


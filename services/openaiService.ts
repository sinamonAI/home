
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const MODEL_NAME = 'gpt-4o'; // 최신 모델 사용

const SYSTEM_INSTRUCTION = `You are an AI coding expert for SnapQuant, a Google Apps Script (GAS) based trading platform.
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
- Ensure the code is robust and follows the library's pattern.`;

export const generateTradingCode = async (prompt: string, retryCount = 0): Promise<string> => {
    const MAX_RETRIES = 3;

    if (!API_KEY) {
        return "// 오류: OpenAI API Key가 설정되지 않았습니다. .env.local 파일을 확인해주세요.";
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: [
                    { role: 'system', content: SYSTEM_INSTRUCTION },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                top_p: 0.95
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('OpenAI API Error:', response.status, errorData);

            if (response.status === 429) {
                throw new Error("너무 많은 요청입니다. 잠시 후 다시 시도해주세요. (Rate Limit)");
            }
            if (response.status === 401) {
                throw new Error("API 인증 실패. 키를 확인해주세요.");
            }
            throw new Error(`API 오류 (${response.status}): ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();

        if (!data.choices || data.choices.length === 0) {
            throw new Error("AI가 응답을 생성하지 못했습니다.");
        }

        return data.choices[0].message.content;

    } catch (error: any) {
        console.error(`코드 생성 오류 (시도 ${retryCount + 1}/${MAX_RETRIES}):`, error);

        // 재시도 로직
        if (retryCount < MAX_RETRIES - 1) {
            const delay = Math.pow(2, retryCount) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            return generateTradingCode(prompt, retryCount + 1);
        }

        return `// 오류: ${error.message}`;
    }
};

// AI 응답에서 코드 블록만 추출하는 헬퍼 함수
export const extractGasCode = (response: string): string => {
    const codeBlockRegex = /```(?:javascript|js)?\s*([\s\S]*?)```/;
    const match = response.match(codeBlockRegex);
    return match ? match[1].trim() : '';
};


// API Key via Proxy

const MODEL_NAME = 'gpt-5-mini'; // 최신 미니 모델 사용

const SYSTEM_INSTRUCTION = `You are a conversational stock buying strategy assistant.

Your role is to:
1. Collect required information through natural conversation
2. Never generate code until all required information is collected
3. Ask only about missing information
4. Ask one question at a time
5. Once all information is collected, generate ONLY executable Google Apps Script code
6. Do NOT explain the code
7. Do NOT output anything except the final code when generating code

Required inputs:
- Daily Buy Quantity (param: qty)
- Ticker (ONLY one of the following):
  - TQQQ
  - QLD
  - QQQ
- Order type (ONLY one of the following):
  - 종가매수 (maps to LOC)
  - 시작가매수 (maps to LOO)

Assumptions:
- Strategy is BUY ONLY
- The user provides the exact daily quantity to buy.

Code rules:
- use the provided buyStock pattern.
- Orders must be placed using api('placeOrder', ...)
- Use isDry = true
- No sell logic
- No loops that place multiple orders in one day.
- MUST include the "TradingEngine Bridge Code" at the very end of the file.
- MUST include a function to set up a daily trigger at 9 PM.

Instructions for code generation:
1. Generate the 'buyStock' function with the collected parameters.
2. Generate a 'setDailyTrigger' function that sets a timeBased trigger at 21:00 (9 PM).
3. Append the exact 'TradingEngine Bridge Code' provided below.
4. Output ONLY the final executable code.

✅ Buy Stock Function Pattern:
/**
 * 주식 매수 주문
 * @param {string} user
 * @param {string} ticker
 * @param {number} qty
 * @param {number} price
 * @param {string} type
 * @param {boolean} isDry
 */
function buyStock() {
  const user = "Joy";
  const ticker = "{{TICKER}}"; // e.g., TQQQ
  const qty = {{DAILY_QTY}};
  const price = 0; // Market/LOC/LOO orders usually don't need a specific limit price, or use current price if needed. For LOC/LOO, 0 is often safe if the API handles it, otherwise use estimated price.
  const type = "{{ORDER_TYPE_CODE}}"; // LOC or LOO (mapped from 종가매수/시작가매수)
  const isDry = true;

  try {
    const success = api('placeOrder', user, ticker, qty, price, type, isDry);
    if (!success) {
      console.error("Order failed");
    }
  } catch (e) {
    console.error(e.message);
  }
}

function setDailyTrigger() {
  // Delete existing triggers to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  
  ScriptApp.newTrigger('buyStock')
    .timeBased()
    .atHour(21)
    .everyDays(1)
    .create();
    
  console.log("Daily trigger set for 9 PM.");
}

// ============================================
// 🧱 TradingEngine Bridge Code (MUST INCLUDE)
// ============================================

/**
 * -----------------------------------------------------------
 * [SnapQuant Client SDK]
 * 
 * 역할: TradingEngine 라이브러리를 연결하는 브릿지 및 전략 작성 공간
 * 사용법: TradingEngine 라이브러리를 추가한 후, 아래 [Strategy Area]에 코드를 작성하세요.
 * -----------------------------------------------------------
 */

// ============================================
// 웹앱 진입점 (기본 설정)
// ============================================

function doGet() {
  return TradingEngine.renderDashboard();
}

/** 
 * 서버 라이브러리 함수를 호출하는 범용 API 프록시
 * 대시보드(HTML)에서 google.script.run.api('함수명', 인자...) 형태로 호출합니다.
 */
function api(funcName, ...args) {
  if (typeof TradingEngine[funcName] !== 'function') {
    throw new Error('Library function not found: ' + funcName);
  }
  return TradingEngine[funcName].apply(null, args);
}

/**
 * 라이브러리 유틸리티 래퍼 (기존 코드 호환용)
 */
function writeLog(scenario, msg) { return api('writeLog', scenario, msg); }
function updateOhlcData(ticker, data) { return api('updateOhlcData', ticker, data); }
function getRegisteredUsers() { return api('getRegisteredUsers'); }
`;


export const generateTradingCode = async (messages: { role: 'user' | 'assistant' | 'system'; content: string }[], retryCount = 0): Promise<string> => {
  const MAX_RETRIES = 3;
  const PROXY_URL = import.meta.env.VITE_OPENAI_PROXY_URL;

  if (!PROXY_URL) {
    return "// 오류: OpenAI Proxy URL이 설정되지 않았습니다. .env 파일을 확인해주세요.";
  }

  try {
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // GAS doPost 특성상 text/plain 권장 (CORS 이슈 방지)
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: 'system', content: SYSTEM_INSTRUCTION },
          ...messages
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Proxy network error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`Proxy API Error: ${data.error.message}`);
    }

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
      return generateTradingCode(messages, retryCount + 1);
    }

    return `// 오류: ${error.message}`;
  }
};


// AI 응답에서 코드 블록만 추출하는 헬퍼 함수
export const extractGasCode = (response: string): string => {
  const codeBlockRegex = /```(?:javascript|js)?\s*([\s\S]*?)```/;
  const match = response.match(codeBlockRegex);
  if (match) {
    return match[1].trim();
  }
  // 백틱이 없는 경우, 전체 응답을 코드로 간주 (시스템 프롬프트가 코드만 출력하도록 지시함)
  return response.trim();
};

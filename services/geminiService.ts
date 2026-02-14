
import { GoogleGenAI } from "@google/genai";

// Safe initialization
const apiKey = process.env.API_KEY || '';
let ai: any = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (e) {
    console.error("Failed to initialize Gemini AI:", e);
  }
}

const SYSTEM_INSTRUCTION = `
You are an AI coding expert for AlgoCloud, a Google Apps Script (GAS) based trading platform.
Your task is to convert user's natural language trading strategy into a "Consumer Script" that uses the 'AlgoCloudLibrary'.

The 'AlgoCloudLibrary' provides the following global functions:
1. AlgoCloud.placeOrder(symbol, side, quantity) - side is 'BUY' or 'SELL'
2. AlgoCloud.getCurrentPrice(symbol) - returns a number
3. AlgoCloud.getRSI(symbol, period) - returns RSI value
4. AlgoCloud.getMovingAverage(symbol, period) - returns MA value
5. AlgoCloud.notify(message) - sends notification to Slack/Telegram

Rules:
- Generate ONLY the JavaScript code block for Google Apps Script.
- The user script must have a function named 'runTradingStrategy()'.
- Do not explain the code unless asked, just provide the valid JS code.
- Ensure the code is robust and follows the library's pattern.
`;

export const generateTradingCode = async (prompt: string) => {
  if (!ai) {
    console.warn("Gemini AI not initialized (Missing API Key)");
    return "// Error: AI Service not configured. Please check API Key.";
  }

  try {
    // Using gemini-3-pro-preview for complex coding tasks as per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    // Access the text property directly from the GenerateContentResponse object
    return response.text;
  } catch (error) {
    console.error("Error generating code:", error);
    return "// Error generating code. Please try again later.";
  }
};

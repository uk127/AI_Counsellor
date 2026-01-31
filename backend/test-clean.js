import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({});

async function main() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Say 'Hello User'",
    });
    console.log('START_RESPONSE');
    console.log(response.text);
    console.log('END_RESPONSE');
  } catch (error) {
    console.error(error);
  }
}

main();

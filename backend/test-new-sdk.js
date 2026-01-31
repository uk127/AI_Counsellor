import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

// Ensure GEMINI_API_KEY is in process.env
if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment");
  process.exit(1);
}

const ai = new GoogleGenAI({});

async function main() {
  try {
    console.log("Testing @google/genai with gemini-3-flash-preview...");
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: "Explain how AI works in a few words" }] }],
    });
    console.log("Full response object:", JSON.stringify(response, null, 2));
    // Based on user snippet, it might be response.text or similar
    // Let's see what the structure actually is
    console.log("Response text:", response.text);
  } catch (error) {
    console.error("Error with @google/genai:", error);
  }
}

main();

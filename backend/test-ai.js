import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './.env' });

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.AI_MODEL || 'gemini-1.5-flash';
console.log('API Key length:', apiKey ? apiKey.length : 0);
console.log('Model Name:', modelName);

if (!apiKey) {
  console.error('GEMINI_API_KEY is missing');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: process.env.AI_MODEL || 'gemini-1.5-flash' });

async function test() {
  try {
    const result = await model.generateContent('Hi, say "Gemini is working"');
    console.log('Response:', result.response.text());
  } catch (error) {
    console.error('Gemini API Error:', error);
  }
}

test();

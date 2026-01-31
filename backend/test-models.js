import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
  console.log(`Testing model: ${modelName}`);
  const model = genAI.getGenerativeModel({ model: modelName });
  try {
    const result = await model.generateContent('Hi');
    console.log(`  Success! Response length: ${result.response.text().length}`);
  } catch (error) {
    console.log(`  Failed: ${error.message}`);
  }
}

async function run() {
  const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
  for (const m of models) {
    await testModel(m);
  }
}

run();

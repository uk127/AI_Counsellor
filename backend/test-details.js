import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
  try {
    // There is no direct listModels in the SDK for regular API keys often, 
    // but we can try to see if we can get a model info
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('Model name from SDK:', model.model);
    
    // Try a simple call
    const result = await model.generateContent('test');
    console.log('Result:', result.response.text());
  } catch (error) {
    console.error('Error details:', JSON.stringify(error, null, 2));
    if (error.message) console.error('Error message:', error.message);
  }
}

run();

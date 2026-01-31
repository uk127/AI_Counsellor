import express from 'express'
import { auth } from '../middleware/auth.js'
import { Profile, University, Application } from '../models/index.js'
import { GoogleGenAI } from '@google/genai'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

// Initialize Gemini API lazily to ensure environment variables are loaded
let ai;
const getAI = () => {
  if (!ai) {
    ai = new GoogleGenAI({})
  }
  return ai
}

const getModelName = () => (process.env.AI_MODEL || 'gemini-3-flash-preview').trim()

// @route   POST /api/ai/chat
// @desc    Get AI response for user query
// @access  Private
router.post('/chat', auth, async (req, res) => {
  try {
    const { message } = req.body
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      })
    }

    // Get user profile and context for personalized responses
    const profile = await Profile.findOne({ where: { userId: req.userId } })
    
    let applications = []
    if (profile) {
      applications = await Application.findAll({ 
        where: { profileId: profile.id },
        include: [{ model: University, as: 'university' }]
      })
    }
    
    // Get top universities for recommendation possibilities
    const topUnis = await University.findAll({ limit: 5 })

    const context = {
      profile: profile ? profile.toJSON() : null,
      applications: applications.map(app => app.toJSON()),
      stage: profile?.stage || 'Building Profile',
      topUniversities: topUnis.map(u => ({ id: u.id, name: u.name, country: u.country }))
    }

    const aiResponse = await generateGeminiResponse(message, context)

    res.json({
      success: true,
      ...aiResponse,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI chat error:', error)
    res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
})

// Helper function to generate Gemini response
async function generateGeminiResponse(userMessage, context) {
  const { profile, applications, stage, topUniversities } = context
  
  const systemPrompt = `
    You are an expert AI Counsellor specializing in international study-abroad admissions.
    Your goal is to guide students meticulously through their journey, moving from profile building to university selection and application.

    STUDENT CONTEXT:
    - Current Stage: ${stage}
    - Profile: ${profile ? JSON.stringify(profile) : 'Not completed'}
    - Shortlisted/Locked Universities: ${applications.length > 0 ? applications.map(a => a.university.name).join(', ') : 'None'}
    - Available Top Universities (for recommendation): ${JSON.stringify(topUniversities)}

    YOUR ROLE:
    1. **Be Extremely Concise**: Your response MUST be only 1 or 2 sentences maximum.
    2. **Stay Professional**: Use a friendly yet expert tone.
    3. **Action-Oriented**: Provide exactly 3 relevant suggestions at the end.
    4. **Plain Text Only**: Do NOT use markdown characters like asterisks (**) for bolding or hashes (#) for headers. Use only plain text.

    OUTPUT FORMAT:
    You must respond in a valid JSON format with the following structure:
    {
      "message": "Your markdown-formatted response text here...",
      "suggestions": [
        { "text": "Label for button", "type": "chat|navigate|action", "payload": "Value depends on type" }
      ]
    }

    SUGGESTION TYPES:
    - "chat": The payload is a message string that the user will 'send' to you.
    - "navigate": The payload is a route like "/universities" or "/dashboard".
    - "action": The payload is a description like "shortlist:{uniId}" or "lock:{uniId}".

    USER MESSAGE: "${userMessage}"
  `

  try {
    const ai = getAI()
    const result = await ai.models.generateContent({
      model: getModelName(),
      contents: systemPrompt
    })
    const responseText = result.text
    
    // Attempt to parse JSON from the response
    try {
      // Find JSON if AI wrapped it in markdown or added text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      const jsonResponse = JSON.parse(jsonMatch ? jsonMatch[0] : responseText)
      
      return {
        response: {
          message: jsonResponse.message,
          suggestions: jsonResponse.suggestions
        }
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON:', parseError, responseText)
      // Fallback to unstructured if parsing fails
      return {
        response: {
          message: responseText,
          suggestions: [
            { text: "View Recommendations", type: "navigate", payload: "/universities" },
            { text: "Check my dashboard", type: "navigate", payload: "/dashboard" }
          ]
        }
      }
    }
  } catch (error) {
    console.error('Gemini API Error:', error)
    return {
      response: {
        message: "I'm currently having trouble with my reasoning engine. Please try again in a moment.",
        suggestions: [{ text: "Retry", type: "chat", payload: "Try again" }]
      }
    }
  }
}

// @route   POST /api/ai/analyze-profile
router.post('/analyze-profile', auth, async (req, res) => {
  try {
    const ai = getAI()
    const profileData = req.body
    const prompt = `Analyze this student profile and give a brief 3-bullet assessment: ${JSON.stringify(profileData)}`
    const result = await ai.models.generateContent({
      model: getModelName(),
      contents: prompt
    })
    res.json({ success: true, analysis: result.text })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

export default router
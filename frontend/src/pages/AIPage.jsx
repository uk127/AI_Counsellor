import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useProfile } from '../contexts/ProfileContext'
import { useUniversity } from '../contexts/UniversityContext'
import { aiAPI } from '../services/api'
import {
  Bot,
  Send,
  Mic,
  StopCircle,
  Sparkles,
  Target,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
  Lock,
  Users,
  GraduationCap,
  IndianRupee
} from 'lucide-react'

const AIPage = () => {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { universities, getRecommendations, shortlistUniversity, lockUniversity } = useUniversity()
  const { calculateProfileStrength, getCurrentStage } = useProfile()

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI Counsellor. I can help you with your study-abroad journey. How can I assist you today?",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [profileStrength, setProfileStrength] = useState(null)
  const [currentStage, setCurrentStage] = useState('Building Profile')
  const messagesEndRef = useRef(null)

  // Mock speech recognition for demo
  const [speechRecognition, setSpeechRecognition] = useState(null)

  useEffect(() => {
    if (profile) {
      setProfileStrength(calculateProfileStrength(profile))
      setCurrentStage(getCurrentStage(profile))
    }
  }, [profile, calculateProfileStrength, getCurrentStage])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    try {
      const res = await aiAPI.chat({ message: inputMessage })
      if (res.data.success) {
        const aiResponse = {
          id: Date.now(),
          type: 'ai',
          content: res.data.response.message,
          timestamp: new Date(),
          suggestions: (res.data.response.suggestions || []).map(s => ({
            text: s.text,
            action: async () => {
              if (s.type === 'chat') {
                setInputMessage(s.payload)
                // Optionally auto-send if desired
              } else if (s.type === 'navigate') {
                navigate(s.payload)
              } else if (s.type === 'action') {
                if (s.payload.startsWith('shortlist:')) {
                  const uniId = s.payload.split(':')[1]
                  await shortlistUniversity(uniId)
                  setMessages(prev => [...prev, {
                    id: Date.now(),
                    type: 'ai',
                    content: `Success! I've shortlisted that university for you.`,
                    timestamp: new Date()
                  }])
                } else if (s.payload.startsWith('lock:')) {
                  const uniId = s.payload.split(':')[1]
                  await lockUniversity(uniId)
                  setMessages(prev => [...prev, {
                    id: Date.now(),
                    type: 'ai',
                    content: `Decision locked! We're now moving into the application preparation stage.`,
                    timestamp: new Date()
                  }])
                }
              }
            }
          }))
        }
        setMessages(prev => [...prev, aiResponse])
      }
    } catch (error) {

      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'ai',
        content: "Sorry, I'm having trouble connecting to my brain. Please try again later.",
        timestamp: new Date()
      }])
    } finally {
      setIsTyping(false)
    }
  }


  const handleVoiceInput = () => {
    if (isListening) {
      setIsListening(false)
      // Stop listening
    } else {
      setIsListening(true)
      // Start listening (mock implementation)
      setTimeout(() => {
        const mockTranscript = "I want to know about universities in the US for computer science"
        setInputMessage(mockTranscript)
        setIsListening(false)
      }, 3000)
    }
  }

  // Removed generateAIResponse and getActionSuggestions as per instruction.
  // The AI responses will now come from the backend via aiAPI.chat.

  const handleGetRecommendations = async () => {
    if (!profile) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'ai',
        content: "I need your profile information to provide personalized university recommendations. Please complete your profile first.",
        timestamp: new Date()
      }])
      return
    }

    setIsTyping(true)
    try {
      await getRecommendations(profile)
      const aiResponse = {
        id: Date.now(),
        type: 'ai',
        content: "Great! I've analyzed your profile and generated personalized university recommendations. You can now explore universities that match your academic background, budget, and preferences. Would you like me to show you the recommendations?",
        timestamp: new Date(),
        suggestions: [
          {
            text: 'Show me the recommendations',
            action: () => navigate('/universities')
          }
        ]
      }
      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'ai',
        content: "Sorry, I couldn't fetch recommendations at this time. Please try again later.",
        timestamp: new Date()
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickAction = (action) => {
    switch (action) {
      case 'profile':
        navigate('/onboarding')
        break
      case 'universities':
        navigate('/universities')
        break
      case 'applications':
        navigate('/applications')
        break
      case 'recommendations':
        handleGetRecommendations()
        break
    }
  }

  const getQuickActions = () => {
    const actions = []
    
    if (!profile || !profile.isCompleted) {
      actions.push({ text: 'Complete Profile', icon: GraduationCap, action: 'profile' })
    }
    
    if (profile && profile.isCompleted) {
      actions.push({ text: 'Get Recommendations', icon: Sparkles, action: 'recommendations' })
      actions.push({ text: 'Explore Universities', icon: Target, action: 'universities' })
    }
    
    if (universities && universities.some(u => u.isLocked)) {
      actions.push({ text: 'Manage Applications', icon: Users, action: 'applications' })
    }

    return actions
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">AI Counsellor</h1>
                <p className="text-gray-600 dark:text-gray-400">Your personal guide for study-abroad success</p>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">
              {currentStage}
            </span>
            {profileStrength && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                Profile Strength: {profileStrength.overall}%
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column - Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {getQuickActions().map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.action)}
                  className="w-full flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <action.icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">{action.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Profile Summary */}
          {profile && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Your Profile</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Education:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{profile.educationLevel}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Field:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{profile.fieldOfStudy}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">₹{profile.budget?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Target:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{profile.targetIntake}</span>
                </div>
              </div>
            </div>
          )}

          {/* University Stats */}
          {universities && universities.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">University Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Recommended:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{universities.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shortlisted:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{universities.filter(u => u.isShortlisted).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Locked:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{universities.filter(u => u.isLocked).length}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Chat Interface */}
        <div className="lg:col-span-3">
          {/* Chat Container */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">AI Counsellor</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Always here to help</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {isTyping && (
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  )}
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">Online</span>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}>
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs opacity-75 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                    
                    {/* Action Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={suggestion.action}
                            className="inline-block bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-xs hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors border border-purple-200 dark:border-purple-800"
                          >
                            {suggestion.text}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder="Type your message... (e.g., 'Help me find universities in the US for computer science')"
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 text-gray-900 dark:text-gray-100 resize-none"
                    rows="2"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-gray-500">
                      Tip: Ask about profile analysis, university recommendations, application guidance, or exam preparation
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleVoiceInput}
                        className={`p-2 rounded-lg ${
                          isListening 
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {isListening ? (
                          <StopCircle className="h-4 w-4" />
                        ) : (
                          <Mic className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <h3 className="font-medium text-purple-900 dark:text-purple-300 mb-2">Getting the Best from Your AI Counsellor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-purple-800 dark:text-purple-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Be specific about your goals</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Share your complete profile</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Ask follow-up questions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Request action items</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIPage
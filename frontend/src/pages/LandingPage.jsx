import React from 'react'
import { Link } from 'react-router-dom'
import { 
  GraduationCap, 
  Target, 
  ShieldCheck, 
  Users,
  ArrowRight
} from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">AI Counsellor</h1>
              </div>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link to="/login" className="text-gray-700 hover:text-gray-900 transition-colors">
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  Plan your study-abroad journey with a guided{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AI counsellor
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
                  Get personalized guidance from profile building to university shortlisting 
                  and application preparation. Make confident and informed study-abroad decisions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link 
                    to="/signup" 
                    className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link 
                    to="/login" 
                    className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </Link>
                </div>
              </div>
              <div className="mt-12 lg:mt-0">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                        <Target className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Personalized Guidance</h3>
                        <p className="text-gray-600 text-sm">Tailored recommendations based on your profile</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl flex items-center justify-center">
                        <ShieldCheck className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Risk Assessment</h3>
                        <p className="text-gray-600 text-sm">Clear understanding of acceptance chances</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                        <Users className="h-8 w-8 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Step-by-Step Process</h3>
                        <p className="text-gray-600 text-sm">Guided journey from confusion to clarity</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything you need in one place
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                From profile assessment to application submission, we guide you through every step 
                of your study-abroad journey.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-xl p-8">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Profile Building</h3>
                <p className="text-gray-600 mb-6">
                  Complete your academic profile, set your goals, and understand your strengths 
                  and areas for improvement.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Academic background assessment</li>
                  <li>• Exam preparation tracking</li>
                  <li>• Budget and funding planning</li>
                  <li>• Goal setting and target countries</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-8">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">University Discovery</h3>
                <p className="text-gray-600 mb-6">
                  Discover universities that match your profile, budget, and preferences. 
                  Get detailed insights and recommendations.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• AI-powered recommendations</li>
                  <li>• Dream, Target, and Safe categories</li>
                  <li>• Detailed university information</li>
                  <li>• Risk assessment and acceptance rates</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-8">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <ShieldCheck className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Application Guidance</h3>
                <p className="text-gray-600 mb-6">
                  Get step-by-step guidance for your applications. Track deadlines, 
                  required documents, and progress.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Document checklist and tracking</li>
                  <li>• Deadline management</li>
                  <li>• Application status updates</li>
                  <li>• Progress monitoring</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to start your journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students who have successfully planned their study-abroad journey 
              with our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/signup" 
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start for Free
              </Link>
              <Link 
                to="/login" 
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Login to Continue
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LandingPage
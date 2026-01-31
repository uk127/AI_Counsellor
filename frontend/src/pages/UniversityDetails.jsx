import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUniversity } from '../contexts/UniversityContext'
import { useProfile } from '../contexts/ProfileContext'
import { 
  Building2, 
  MapPin, 
  Globe, 
  Star, 
  IndianRupee, 
  Target, 
  ChevronLeft,
  CheckCircle,
  ExternalLink,
  Lock,
  Plus
} from 'lucide-react'

const UniversityDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { universities, shortlistUniversity, lockUniversity, calculateFitScore, getUniversities } = useUniversity()
  const { profile } = useProfile()
  const [university, setUniversity] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (universities.length === 0) {
        await getUniversities()
      }
      const found = universities.find(u => u.id === id)
      if (found) {
        setUniversity(found)
      }
      setLoading(false)
    }
    loadData()
  }, [id, universities, getUniversities])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!university) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">University not found</h2>
        <button 
          onClick={() => navigate('/universities')}
          className="mt-4 text-primary-600 hover:underline flex items-center justify-center mx-auto"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to list
        </button>
      </div>
    )
  }

  const fitScore = calculateFitScore(university, profile)
  const isShortlisted = university.isShortlisted
  const isLocked = university.isLocked

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate('/universities')}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to Universities
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header Section */}
        <div className="p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Building2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{university.name}</h1>
                <div className="flex items-center mt-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{university.city}, {university.country}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {!isLocked && (
                <>
                  {!isShortlisted ? (
                    <button
                      onClick={() => shortlistUniversity(university.id)}
                      className="px-6 py-2 border border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors font-medium flex items-center"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Shortlist
                    </button>
                  ) : (
                    <div className="px-6 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg font-medium flex items-center border border-purple-200 dark:border-purple-800">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Shortlisted
                    </div>
                  )}
                  <button
                    onClick={() => {
                      lockUniversity(university.id)
                      navigate('/applications')
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
                  >
                    <Lock className="h-5 w-5 mr-2" />
                    Lock & Apply
                  </button>
                </>
              )}
              {isLocked && (
                <div className="px-6 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-lg font-medium flex items-center border border-green-200 dark:border-green-800">
                  <Lock className="h-5 w-5 mr-2" />
                  Application Locked
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
          <div className="p-6 flex flex-col items-center text-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Global Ranking</span>
            <div className="flex items-center text-2xl font-bold text-gray-900 dark:text-gray-100">
              <Star className="h-6 w-6 text-yellow-500 mr-2 fill-current" />
              #{university.ranking || 'N/A'}
            </div>
          </div>
          <div className="p-6 flex flex-col items-center text-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Annual Cost</span>
            <div className="flex items-center text-2xl font-bold text-gray-900 dark:text-gray-100">
              <IndianRupee className="h-6 w-6 text-green-500 mr-1" />
              ₹{university.cost?.toLocaleString() || 'N/A'}
            </div>
          </div>
          <div className="p-6 flex flex-col items-center text-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Acceptance Rate</span>
            <div className="flex items-center text-2xl font-bold text-gray-900 dark:text-gray-100">
              <Target className="h-6 w-6 text-red-500 mr-2" />
              {university.acceptanceRate}%
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">About the University</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  {university.description}
                </p>
              </section>

              <section className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-2xl border border-purple-100 dark:border-purple-800">
                <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300 mb-4 flex items-center">
                  <Star className="h-6 w-6 mr-2 text-purple-600 dark:text-purple-400" />
                  Your Profile Fit Analysis
                </h3>
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0 relative">
                    <svg className="h-24 w-24">
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-purple-200 dark:text-purple-900" />
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={`${(fitScore / 100) * 251.2} 251.2`} className="text-purple-600 dark:text-purple-400" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-purple-900 dark:text-purple-100">
                      {fitScore}%
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-2">
                      {fitScore >= 80 ? 'Excellent Match!' : fitScore >= 60 ? 'Strong Candidate' : 'Reach School'}
                    </h4>
                    <p className="text-purple-800 dark:text-purple-300">
                      Based on your {profile?.gpa} GPA and academic background, this university presents a 
                      {fitScore >= 80 ? ' very high' : fitScore >= 60 ? ' solid' : ' competitive'} opportunity for your success.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column - Requirements & Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Admission Requirements</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-gray-600 dark:text-gray-400">Minimum GPA</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{university.requirements?.gpa}+</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-gray-600 dark:text-gray-400">IELTS Score</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{university.requirements?.ielts}+</span>
                  </div>
                  {university.requirements?.toefl && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-gray-600 dark:text-gray-400">TOEFL Score</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">{university.requirements.toefl}+</span>
                    </div>
                  )}
                  {university.requirements?.gre && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-gray-600 dark:text-gray-400">GRE Score</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">{university.requirements.gre}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-900 text-white p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-4">Visit Website</h3>
                <p className="text-sm text-gray-400 mb-4">Get the latest information directly from the official university portal.</p>
                <a 
                  href={university.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-white text-black rounded-lg font-bold flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  Go to Portal
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UniversityDetails

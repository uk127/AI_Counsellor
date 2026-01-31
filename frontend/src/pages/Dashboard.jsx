import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useProfile } from '../contexts/ProfileContext'
import { useUniversity } from '../contexts/UniversityContext'
import {
  User,
  GraduationCap,
  Target,
  IndianRupee,
  BookOpen,
  Building2,
  FileText,
  Bot,
  ArrowRight,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { profile, calculateProfileStrength, getCurrentStage } = useProfile()
  const { universities, getRecommendations } = useUniversity()

  useEffect(() => {
    if (profile) {
      getRecommendations(profile)
    }
  }, [profile])


  const profileStrength = profile ? calculateProfileStrength(profile) : null
  const currentStage = profile ? getCurrentStage(profile) : 'Building Profile'

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Building Profile': return 'bg-blue-100 text-blue-800'
      case 'Discovering Universities': return 'bg-purple-100 text-purple-800'
      case 'Finalizing Universities': return 'bg-orange-100 text-orange-800'
      case 'Preparing Applications': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStageIcon = (stage) => {
    switch (stage) {
      case 'Building Profile': return <GraduationCap className="h-5 w-5" />
      case 'Discovering Universities': return <Target className="h-5 w-5" />
      case 'Finalizing Universities': return <Building2 className="h-5 w-5" />
      case 'Preparing Applications': return <FileText className="h-5 w-5" />
      default: return <GraduationCap className="h-5 w-5" />
    }
  }

  const getStageAction = (stage) => {
    switch (stage) {
      case 'Building Profile': return { text: 'Complete Onboarding', action: () => navigate('/onboarding') }
      case 'Discovering Universities': return { text: 'Discover Universities', action: () => navigate('/universities') }
      case 'Finalizing Universities': return { text: 'Finalize Universities', action: () => navigate('/universities') }
      case 'Preparing Applications': return { text: 'Manage Applications', action: () => navigate('/applications') }
      default: return { text: 'Get Started', action: () => navigate('/onboarding') }
    }
  }

  const lockedUniversities = universities?.filter(u => u.isLocked) || []
  const shortlistedUniversities = universities?.filter(u => u.isShortlisted) || []

  const tasks = [
    {
      id: 1,
      title: 'Complete Profile',
      description: 'Fill in your academic background and goals',
      status: profile?.isCompleted ? 'completed' : 'pending',
      dueDate: null
    },
    {
      id: 2,
      title: 'Take IELTS/TOEFL',
      description: 'Prepare for and take your English proficiency test',
      status: profile?.ielts || profile?.toefl ? 'completed' : 'in-progress',
      dueDate: '2024-12-31'
    },
    {
      id: 3,
      title: 'Take GRE/GMAT',
      description: 'Prepare for and take your entrance exam',
      status: profile?.gre || profile?.gmat ? 'completed' : 'pending',
      dueDate: '2024-12-31'
    },
    {
      id: 4,
      title: 'Shortlist Universities',
      description: 'Discover and shortlist universities that match your profile',
      status: shortlistedUniversities.length > 0 ? 'completed' : 'pending',
      dueDate: '2024-11-30'
    },
    {
      id: 5,
      title: 'Lock University',
      description: 'Commit to your preferred university',
      status: lockedUniversities.length > 0 ? 'completed' : 'pending',
      dueDate: '2024-12-15'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      action: 'Profile updated',
      description: 'Academic information completed',
      time: '2 hours ago'
    },
    {
      id: 2,
      action: 'University shortlisted',
      description: 'MIT - Master of Computer Science',
      time: '1 day ago'
    },
    {
      id: 3,
      action: 'Task completed',
      description: 'IELTS preparation started',
      time: '2 days ago'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Let's continue your study-abroad journey</p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <span className={`stage-badge ${getStageColor(currentStage)}`}>
              {getStageIcon(currentStage)}
              <span className="ml-1">{currentStage}</span>
            </span>
            <button
              onClick={getStageAction(currentStage).action}
              className="btn-primary flex items-center"
            >
              {getStageAction(currentStage).text}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Stage Action */}
      <div className="md:hidden mb-6">
        <div className="flex items-center justify-between">
          <span className={`stage-badge ${getStageColor(currentStage)}`}>
            {getStageIcon(currentStage)}
            <span className="ml-1">{currentStage}</span>
          </span>
          <button
            onClick={getStageAction(currentStage).action}
            className="btn-primary text-sm px-4 py-2"
          >
            {getStageAction(currentStage).text}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Profile Summary</h2>
              <button
                onClick={() => navigate('/onboarding')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Edit Profile
              </button>
            </div>
            
            {profile ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 dark:text-blue-400">Education Level</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{profile.educationLevel}</p>
                      </div>
                      <GraduationCap className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                    </div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600 dark:text-green-400">Intended Degree</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{profile.intendedDegree}</p>
                      </div>
                      <Target className="h-8 w-8 text-green-500 dark:text-green-400" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Degree</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100 mt-1">{profile.degree}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Major</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100 mt-1">{profile.major}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Graduation Year</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100 mt-1">{profile.graduationYear}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">GPA</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100 mt-1">{profile.gpa || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600 dark:text-purple-400">Field of Study</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{profile.fieldOfStudy}</p>
                      </div>
                      <BookOpen className="h-8 w-8 text-purple-500 dark:text-purple-400" />
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-600 dark:text-orange-400">Budget</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">₹{profile.budget?.toLocaleString()}</p>
                      </div>
                      <IndianRupee className="h-8 w-8 text-orange-500 dark:text-orange-400" />
                    </div>
                  </div>
                  
                  <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-pink-600 dark:text-pink-400">Target Intake</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{profile.targetIntake}</p>
                      </div>
                      <Clock className="h-8 w-8 text-pink-500 dark:text-pink-400" />
                    </div>
                  </div>
                </div>

                {/* Profile Strength */}
                {profileStrength && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Strength</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{profileStrength.overall}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${profileStrength.overall}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                      <div className="text-center">
                        <div className="text-gray-500">Academics</div>
                        <div className="font-medium">{profileStrength.academics}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">Exams</div>
                        <div className="font-medium">{profileStrength.exams}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">SOP</div>
                        <div className="font-medium">{profileStrength.sop}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Complete your profile to get personalized recommendations</p>
                <button
                  onClick={() => navigate('/onboarding')}
                  className="mt-4 btn-primary"
                >
                  Complete Profile
                </button>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{activity.action}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/universities')}
                className="w-full flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">Discover Universities</span>
                </div>
                <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </button>

              <button
                onClick={() => navigate('/applications')}
                className="w-full flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">Manage Applications</span>
                </div>
                <ArrowRight className="h-4 w-4 text-green-600 dark:text-green-400" />
              </button>

              <button
                onClick={() => navigate('/ai')}
                className="w-full flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
              >
                <div className="flex items-center">
                  <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">AI Counsellor</span>
                </div>
                <ArrowRight className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </button>
            </div>
          </div>

          {/* University Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">University Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Shortlisted</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{shortlistedUniversities.length}</p>
                </div>
                <Target className="h-8 w-8 text-purple-500 dark:text-purple-400" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Locked</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{lockedUniversities.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500 dark:text-green-400" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Recommendations</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{universities?.length || 0}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* To-Do List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">To-Do List</h2>
            <div className="space-y-3">
              {tasks.slice(0, 4).map((task) => (
                <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className={`flex-shrink-0 h-4 w-4 rounded-full ${
                    task.status === 'completed' ? 'bg-green-500' : 
                    task.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{task.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                  </div>
                  {task.dueDate && (
                    <div className="text-sm text-gray-500">{task.dueDate}</div>
                  )}
                </div>
              ))}
              <button
                onClick={() => navigate('/applications')}
                className="w-full mt-2 text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View All Tasks
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUniversity } from '../contexts/UniversityContext'
import { useProfile } from '../contexts/ProfileContext'
import { useAuth } from '../contexts/AuthContext'
import {
  Building2,
  Star,
  IndianRupee,
  Target,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  CheckCircle,
  Lock,
  Plus,
  Eye,
  ChevronDown,
  ChevronUp,
  Bot
} from 'lucide-react'

const UniversityDiscovery = () => {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { 
    universities, 
    getUniversities, 
    getRecommendations, 
    shortlistUniversity, 
    lockUniversity, 
    calculateFitScore, 
    categorizeUniversity 
  } = useUniversity()

  const [filters, setFilters] = useState({
    country: '',
    budget: '',
    ranking: '',
    acceptanceRate: '',
    search: ''
  })
  const [sortBy, setSortBy] = useState('fitScore')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedCategories, setSelectedCategories] = useState(['Dream', 'Target', 'Safe'])
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(false)

  // Load universities on mount
  useEffect(() => {
    const loadUniversities = async () => {
      setLoading(true)
      try {
        if (profile) {
          await getRecommendations(profile)
        } else {
          await getUniversities()
        }
      } catch (error) {
        console.error('Error loading universities:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUniversities()
  }, [profile, getUniversities, getRecommendations])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const filteredUniversities = universities?.filter(university => {
    // Category filter
    const category = categorizeUniversity(university, profile)
    if (!selectedCategories.includes(category)) return false

    // Country filter
    if (filters.country && university.country !== filters.country) return false

    // Budget filter
    if (filters.budget) {
      const budget = parseInt(filters.budget)
      if (university.cost > budget) return false
    }

    // Ranking filter
    if (filters.ranking) {
      const ranking = parseInt(filters.ranking)
      if (university.ranking > ranking) return false
    }

    // Acceptance rate filter
    if (filters.acceptanceRate) {
      const rate = parseInt(filters.acceptanceRate)
      if (university.acceptanceRate > rate) return false
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      return university.name.toLowerCase().includes(searchLower) ||
             university.country.toLowerCase().includes(searchLower) ||
             university.city.toLowerCase().includes(searchLower)
    }

    return true
  }) || []

  const sortedUniversities = [...filteredUniversities].sort((a, b) => {
    let aValue, bValue

    switch (sortBy) {
      case 'name':
        aValue = a.name
        bValue = b.name
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      case 'country':
        aValue = a.country
        bValue = b.country
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      case 'cost':
        aValue = a.cost
        bValue = b.cost
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      case 'ranking':
        aValue = a.ranking || Infinity
        bValue = b.ranking || Infinity
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      case 'acceptanceRate':
        aValue = a.acceptanceRate || 0
        bValue = b.acceptanceRate || 0
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      case 'fitScore':
      default:
        aValue = calculateFitScore(a, profile)
        bValue = calculateFitScore(b, profile)
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    }
  })

  const handleShortlist = async (universityId) => {
    try {
      await shortlistUniversity(universityId)
      // Show success toast would go here
    } catch (error) {
      console.error('Error shortlisting university:', error)
    }
  }

  const handleLock = async (universityId) => {
    try {
      await lockUniversity(universityId)
      // Show success toast would go here
      // Navigate to applications page
      navigate('/applications')
    } catch (error) {
      console.error('Error locking university:', error)
    }
  }

  const getUniversityCategory = (university) => {
    return categorizeUniversity(university, profile)
  }

  const getUniversityCategoryColor = (category) => {
    switch (category) {
      case 'Dream': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'Target': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'Safe': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getFitScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const countries = [...new Set((universities || []).map(u => u.country).filter(Boolean))].sort()
  
  const costs = (universities || []).map(u => parseFloat(u.cost)).filter(c => !isNaN(c))
  const maxBudget = costs.length > 0 ? Math.max(...costs) : 100000

  const ranks = (universities || []).map(u => parseInt(u.ranking)).filter(r => !isNaN(r))
  const maxRanking = ranks.length > 0 ? Math.max(...ranks) : 1000

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">University Discovery</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">Find universities that match your profile and goals</p>
          </div>
          <div className="w-full sm:w-auto">
            <button
              onClick={() => navigate('/ai')}
              className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center sm:justify-start"
            >
              <Bot className="mr-2 h-5 w-5" />
              Get AI Recommendations
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg active:bg-gray-200 dark:active:bg-gray-600 transition-colors"
          >
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
              <span className="font-medium text-gray-900 dark:text-gray-100">Filters</span>
            </div>
            {showFilters ? (
              <ChevronUp className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 ${showFilters || 'hidden md:grid'}`}>
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, country, or city..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pr-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
            <select
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Budget</label>
            <select
              value={filters.budget}
              onChange={(e) => handleFilterChange('budget', e.target.value)}
              className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            >
              <option value="">No Limit</option>
              <option value="10000">₹10,000</option>
              <option value="20000">₹20,000</option>
              <option value="30000">₹30,000</option>
              <option value="40000">₹40,000</option>
              <option value="50000">₹50,000</option>
              <option value={maxBudget}>₹{maxBudget.toLocaleString()}</option>
            </select>
          </div>

          {/* Ranking */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Ranking</label>
            <select
              value={filters.ranking}
              onChange={(e) => handleFilterChange('ranking', e.target.value)}
              className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            >
              <option value="">No Limit</option>
              <option value="50">Top 50</option>
              <option value="100">Top 100</option>
              <option value="200">Top 200</option>
              <option value="500">Top 500</option>
              <option value={maxRanking}>Top {maxRanking}</option>
            </select>
          </div>

          {/* Acceptance Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Acceptance Rate</label>
            <select
              value={filters.acceptanceRate}
              onChange={(e) => handleFilterChange('acceptanceRate', e.target.value)}
              className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            >
              <option value="">No Limit</option>
              <option value="20">20%</option>
              <option value="40">40%</option>
              <option value="60">60%</option>
              <option value="80">80%</option>
              <option value="100">100%</option>
            </select>
          </div>
        </div>

        {/* Mobile Filter Actions */}
        <div className="md:hidden mt-4 flex space-x-2">
          <button
            onClick={() => {
              setFilters({ country: '', budget: '', ranking: '', acceptanceRate: '', search: '' })
              setSelectedCategories(['Dream', 'Target', 'Safe'])
            }}
            className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Clear All
          </button>
          <button
            onClick={() => setShowFilters(false)}
            className="flex-1 px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Apply Filters
          </button>
        </div>

        {/* Category Filters */}
        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Categories:</span>
            {['Dream', 'Target', 'Safe'].map(category => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUniversityCategoryColor(category)}`}>
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {sortedUniversities.length} Universities Found
              </h2>
              {profile && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Based on your profile
                </span>
              )}
            </div>
            
            {/* Sort */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="input-field text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              >
                <option value="fitScore">Fit Score</option>
                <option value="name">Name</option>
                <option value="country">Country</option>
                <option value="cost">Cost</option>
                <option value="ranking">Ranking</option>
                <option value="acceptanceRate">Acceptance Rate</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 hover:bg-gray-100 rounded"
              >
                {sortOrder === 'asc' ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading universities...</p>
          </div>
        )}

        {/* University List */}
        <div className="divide-y divide-gray-200">
          {sortedUniversities.map((university) => {
            const category = getUniversityCategory(university)
            const fitScore = calculateFitScore(university, profile)
            const isShortlisted = university.isShortlisted
            const isLocked = university.isLocked

            return (
              <div key={university.id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Left Side */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 break-words">
                        {university.name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUniversityCategoryColor(category)}`}>
                          {category}
                        </span>
                        {isLocked && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 flex items-center">
                            <Lock className="h-3 w-3 mr-1" />
                            Locked
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 mb-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Building2 className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{university.city}, {university.country}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <IndianRupee className="h-4 w-4 flex-shrink-0" />
                        <span>₹{university.cost?.toLocaleString()}/year</span>
                      </div>
                      {university.ranking && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Star className="h-4 w-4 flex-shrink-0" />
                          <span>#{university.ranking}</span>
                        </div>
                      )}
                      {university.acceptanceRate && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Target className="h-4 w-4 flex-shrink-0" />
                          <span>{university.acceptanceRate}% acceptance</span>
                        </div>
                      )}
                    </div>

                    {university.description && (
                      <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm line-clamp-2">{university.description}</p>
                    )}

                    {/* Requirements */}
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className={`font-medium ${getFitScoreColor(fitScore)}`}>
                        {fitScore}% Fit Score
                      </span>
                      {university.requirements?.gpa && (
                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                          GPA: {university.requirements.gpa}+
                        </span>
                      )}
                      {university.requirements?.ielts && (
                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                          IELTS: {university.requirements.ielts}+
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="lg:ml-4 lg:self-center">
                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 mb-3">
                      {!isLocked && (
                        <>
                          {!isShortlisted ? (
                            <button
                              onClick={() => handleShortlist(university.id)}
                              className="flex items-center justify-center px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors min-w-[120px]"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Shortlist
                            </button>
                          ) : (
                            <button className="flex items-center justify-center px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed min-w-[120px]">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Shortlisted
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleLock(university.id)}
                            disabled={isLocked}
                            className={`flex items-center justify-center px-3 py-2 text-sm text-white rounded-lg transition-colors min-w-[140px] ${
                              isLocked 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {isLocked ? 'Locked' : 'Lock University'}
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => navigate(`/universities/${university.id}`)}
                        className="flex items-center justify-center px-3 py-2 text-sm bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors min-w-[120px]"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </button>
                    </div>

                    {/* Fit Analysis */}
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-left">
                      {fitScore >= 80 ? (
                        <div className="flex items-center justify-center sm:justify-start space-x-1 text-green-600 dark:text-green-400">
                          <TrendingUp className="h-3 w-3" />
                          <span>Excellent fit</span>
                        </div>
                      ) : fitScore >= 60 ? (
                        <div className="flex items-center justify-center sm:justify-start space-x-1 text-yellow-600 dark:text-yellow-400">
                          <TrendingUp className="h-3 w-3" />
                          <span>Good fit</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center sm:justify-start space-x-1 text-red-600 dark:text-red-400">
                          <TrendingDown className="h-3 w-3" />
                          <span>Risky fit</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {sortedUniversities.length === 0 && !loading && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No universities found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your filters or search criteria to find more options.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setFilters({ country: '', budget: '', ranking: '', acceptanceRate: '', search: '' })
                  setSelectedCategories(['Dream', 'Target', 'Safe'])
                }}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Clear Filters
              </button>
              <button
                onClick={() => navigate('/ai')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get AI Recommendations
              </button>
            </div>
            {/* Mobile hint */}
            <div className="mt-6 text-xs text-gray-400 dark:text-gray-500 hidden md:block">
              💡 Tip: Use the filters above to narrow down your search or try our AI recommendations for personalized suggestions!
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UniversityDiscovery
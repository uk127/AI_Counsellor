import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { universityAPI } from '../services/api'

const UniversityContext = createContext()

export const useUniversity = () => {
  const context = useContext(UniversityContext)
  if (!context) {
    throw new Error('useUniversity must be used within a UniversityProvider')
  }
  return context
}

export const UniversityProvider = ({ children }) => {
  const [universities, setUniversities] = useState([])
  const [recommendedUniversities, setRecommendedUniversities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getUniversities = useCallback(async (filters = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await universityAPI.getUniversities(filters)
      setUniversities(response.data.universities)
      
      return { success: true, universities: response.data.universities }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch universities'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const getRecommendations = useCallback(async (profileData) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await universityAPI.getRecommendations(profileData)
      setRecommendedUniversities(response.data.universities)
      setUniversities(response.data.universities)
      
      return { success: true, universities: response.data.universities }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to get recommendations'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const shortlistUniversity = async (universityId) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await universityAPI.shortlist(universityId)
      
      // Update local state
      setUniversities(prev => prev.map(u => 
        u.id === universityId 
          ? { ...u, isShortlisted: true }
          : u
      ))
      
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to shortlist university'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const lockUniversity = async (universityId) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await universityAPI.lock(universityId)
      
      // Update local state
      setUniversities(prev => prev.map(u => 
        u.id === universityId 
          ? { ...u, isLocked: true, isShortlisted: true }
          : u
      ))
      
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to lock university'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const unlockUniversity = async (universityId) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await universityAPI.unlock(universityId)
      
      // Update local state
      setUniversities(prev => prev.map(u => 
        u.id === universityId 
          ? { ...u, isLocked: false }
          : u
      ))
      
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to unlock university'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const calculateFitScore = useCallback((university, profile) => {
    if (!profile || !university) return 0
    
    let score = 0
    let maxScore = 0
    
    // Academic fit
    if (profile.gpa && university.requirements?.gpa) {
      maxScore += 40
      const userGpa = parseFloat(profile.gpa)
      const reqGpa = parseFloat(university.requirements.gpa)
      if (userGpa >= reqGpa) score += 40
      else if (userGpa >= reqGpa - 0.5) score += 20
    }
    
    // Exam fit
    if (profile.ielts && university.requirements?.ielts) {
      maxScore += 30
      const userIelts = parseFloat(profile.ielts)
      const reqIelts = parseFloat(university.requirements.ielts)
      if (userIelts >= reqIelts) score += 30
      else if (userIelts >= reqIelts - 0.5) score += 15
    } else if (profile.toefl && university.requirements?.toefl) {
      maxScore += 30
      if (profile.toefl >= university.requirements.toefl) score += 30
      else if (profile.toefl >= university.requirements.toefl - 10) score += 15
    }
    
    // GRE/GMAT fit
    if (profile.gre && university.requirements?.gre) {
      maxScore += 20
      if (profile.gre >= university.requirements.gre) score += 20
      else if (profile.gre >= university.requirements.gre - 20) score += 10
    } else if (profile.gmat && university.requirements?.gmat) {
      maxScore += 20
      if (profile.gmat >= university.requirements.gmat) score += 20
      else if (profile.gmat >= university.requirements.gmat - 50) score += 10
    }
    
    // Budget fit
    if (profile.budget && university.cost) {
      maxScore += 10
      const budget = parseFloat(profile.budget)
      const cost = parseFloat(university.cost)
      if (cost <= budget) score += 10
      else if (cost <= budget * 1.2) score += 5
    }
    
    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
  }, [])


  const categorizeUniversity = useCallback((university, profile) => {
    const fitScore = calculateFitScore(university, profile)
    
    if (fitScore >= 80) return 'Safe'
    if (fitScore >= 60) return 'Target'
    return 'Dream'
  }, [calculateFitScore])

  const getApplications = async () => {
    try {
      setLoading(true)
      const response = await universityAPI.getApplications()
      if (response.data.success) {
        // Map applications back to universities state if needed, 
        // or just return them for the component to use
        return { success: true, applications: response.data.applications }
      }
      return { success: false, error: 'Failed to fetch applications' }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    universities,
    recommendedUniversities,
    loading,
    error,
    getUniversities,
    getRecommendations,
    shortlistUniversity,
    lockUniversity,
    unlockUniversity,
    getApplications,
    calculateFitScore,
    categorizeUniversity
  }


  return (
    <UniversityContext.Provider value={value}>
      {children}
    </UniversityContext.Provider>
  )
}
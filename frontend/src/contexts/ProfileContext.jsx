import React, { createContext, useContext, useState, useEffect } from 'react'
import { profileAPI } from '../services/api'
import { useAuth } from './AuthContext'

const ProfileContext = createContext()

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}

export const ProfileProvider = ({ children }) => {
  const { profile: authProfile, updateProfile: updateAuthProfile } = useAuth()
  const [profile, setProfile] = useState(authProfile || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Keep local profile in sync with AuthContext profile
  useEffect(() => {
    if (authProfile) {
      setProfile(authProfile)
    }
  }, [authProfile])


  const createProfile = async (profileData) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await profileAPI.create(profileData)
      setProfile(response.data.profile)
      updateAuthProfile(response.data.profile)
      
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create profile'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }


  const updateProfile = async (profileData) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await profileAPI.update(profileData)
      setProfile(response.data.profile)
      updateAuthProfile(response.data.profile)
      
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }


  const calculateProfileStrength = (profileData) => {
    if (!profileData) return { overall: 0, academics: 'Not specified', exams: 'Not started', sop: 'Not started' }

    let score = 0
    let maxScore = 0
    
    // Academic strength
    if (profileData.gpa) {
      maxScore += 40
      const gpa = parseFloat(profileData.gpa)
      if (gpa >= 3.5) score += 40
      else if (gpa >= 3.0) score += 30
      else if (gpa >= 2.5) score += 20
      else score += 10
    }
    
    // Exam strength
    if (profileData.ielts || profileData.toefl) {
      maxScore += 30
      if ((profileData.ielts && profileData.ielts >= 7.0) || (profileData.toefl && profileData.toefl >= 100)) score += 30
      else if ((profileData.ielts && profileData.ielts >= 6.5) || (profileData.toefl && profileData.toefl >= 90)) score += 20
      else score += 10
    }
    
    // GRE/GMAT strength
    if (profileData.gre || profileData.gmat) {
      maxScore += 20
      if ((profileData.gre && profileData.gre >= 320) || (profileData.gmat && profileData.gmat >= 650)) score += 20
      else if ((profileData.gre && profileData.gre >= 300) || (profileData.gmat && profileData.gmat >= 600)) score += 10
    }
    
    // SOP strength
    if (profileData.sopStatus) {
      maxScore += 10
      if (profileData.sopStatus.toLowerCase() === 'ready' || profileData.sopStatus.toLowerCase() === 'completed') score += 10
      else if (profileData.sopStatus.toLowerCase() === 'draft') score += 5
    }
    
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
    
    return {
      overall: percentage,
      academics: profileData.gpa ? (parseFloat(profileData.gpa) >= 3.5 ? 'Strong' : parseFloat(profileData.gpa) >= 3.0 ? 'Average' : 'Weak') : 'Not specified',
      exams: (profileData.ielts || profileData.toefl) ? ((profileData.ielts >= 7.0 || profileData.toefl >= 100) ? 'Strong' : (profileData.ielts >= 6.5 || profileData.toefl >= 90) ? 'Average' : 'Weak') : 'Not started',
      sop: profileData.sopStatus ? (profileData.sopStatus.toLowerCase() === 'ready' || profileData.sopStatus.toLowerCase() === 'completed' ? 'Ready' : profileData.sopStatus.toLowerCase() === 'draft' ? 'Draft' : 'Not started') : 'Not started'
    }
  }

  const getCurrentStage = (profileData) => {
    if (!profileData) return 'Building Profile'
    if (!profileData.isCompleted) return 'Building Profile'
    
    return profileData.stage || 'Discovering Universities'
  }


  const value = {
    profile,
    loading,
    error,
    createProfile,
    updateProfile,
    calculateProfileStrength,
    getCurrentStage
  }

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}
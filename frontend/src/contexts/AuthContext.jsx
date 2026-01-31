import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (token) {
        const response = await authAPI.me()
        setUser(response.data.user)
        setProfile(response.data.profile)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await authAPI.login({ email, password })
      const { token, user: userData, profile: profileData } = response.data
      
      localStorage.setItem('token', token)
      setUser(userData)
      setProfile(profileData)
      
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const signup = useCallback(async (name, email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await authAPI.signup({ name, email, password })
      const { token, user: userData } = response.data
      
      localStorage.setItem('token', token)
      setUser(userData)
      setProfile(null) // Profile will be created during onboarding
      
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setProfile(null)
    setError(null)
  }

  const updateProfile = (newProfile) => {
    setProfile(newProfile)
  }

  const value = useMemo(() => ({
    user,
    profile,
    loading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    checkAuth
  }), [user, profile, loading, error, login, signup, logout, updateProfile, checkAuth])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
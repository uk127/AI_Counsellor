import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  me: () => api.get('/auth/me'),
}

// Profile API endpoints
export const profileAPI = {
  create: (profileData) => api.post('/profile', profileData),
  update: (profileData) => api.put('/profile', profileData),
  get: () => api.get('/profile'),
}

// University API endpoints
export const universityAPI = {
  getUniversities: (filters) => api.get('/universities', { params: filters }),
  getRecommendations: (profileData) => api.post('/universities/recommend', profileData),
  shortlist: (universityId) => api.post(`/universities/${universityId}/shortlist`),
  lock: (universityId) => api.post(`/universities/${universityId}/lock`),
  unlock: (universityId) => api.post(`/universities/${universityId}/unlock`),
  getApplications: () => api.get('/applications'),
}


// AI API endpoints
export const aiAPI = {
  analyzeProfile: (profileData) => api.post('/ai/analyze-profile', profileData),
  recommendUniversities: (profileData) => api.post('/ai/recommend-universities', profileData),
  generateTasks: (universityId, profileData) => api.post('/ai/generate-tasks', { universityId, profileData }),
  chat: (message) => api.post('/ai/chat', message),
}

// Application API endpoints
export const applicationAPI = {
  getApplications: () => api.get('/applications'),
  update: (id, data) => api.put(`/applications/${id}`, data),
}

export default api
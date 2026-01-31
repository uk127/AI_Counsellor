import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Context Providers
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProfileProvider } from './contexts/ProfileContext'
import { UniversityProvider } from './contexts/UniversityContext'
import { ThemeProvider } from './contexts/ThemeContext'

// Layout
import Layout from './components/Layout'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Dashboard from './pages/Dashboard'
import Onboarding from './pages/Onboarding'
import UniversityDiscovery from './pages/UniversityDiscovery'
import ApplicationGuidance from './pages/ApplicationGuidance'
import AIPage from './pages/AIPage'
import UniversityDetails from './pages/UniversityDetails'
import Settings from './pages/Settings'

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Onboarding Guard Component
function OnboardingGuard({ children }) {
  const { user, profile } = useAuth()

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // If profile is not found or not completed, redirect to onboarding
  if (!profile || !profile.isCompleted) {
    return <Navigate to="/onboarding" replace />
  }

  return children
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <ProfileProvider>
        <UniversityProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <OnboardingGuard>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </OnboardingGuard>
                  </ProtectedRoute>
                } />
                
                <Route path="/onboarding" element={
                  <ProtectedRoute>
                    <Layout>
                      <Onboarding />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/universities" element={
                  <ProtectedRoute>
                    <OnboardingGuard>
                      <Layout>
                        <UniversityDiscovery />
                      </Layout>
                    </OnboardingGuard>
                  </ProtectedRoute>
                } />

                <Route path="/universities/:id" element={
                  <ProtectedRoute>
                    <OnboardingGuard>
                      <Layout>
                        <UniversityDetails />
                      </Layout>
                    </OnboardingGuard>
                  </ProtectedRoute>
                } />
                
                <Route path="/applications" element={
                  <ProtectedRoute>
                    <OnboardingGuard>
                      <Layout>
                        <ApplicationGuidance />
                      </Layout>
                    </OnboardingGuard>
                  </ProtectedRoute>
                } />
                
                <Route path="/ai" element={
                  <ProtectedRoute>
                    <OnboardingGuard>
                      <Layout>
                        <AIPage />
                      </Layout>
                    </OnboardingGuard>
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                } />
              </Routes>
              
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
            </div>
          </Router>
        </UniversityProvider>
      </ProfileProvider>
    </AuthProvider>
    </ThemeProvider>
  )
}

export default App
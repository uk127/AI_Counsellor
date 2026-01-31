import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Context providers
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ProfileProvider } from './contexts/ProfileContext.jsx'
import { UniversityProvider } from './contexts/UniversityContext.jsx'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ProfileProvider>
        <UniversityProvider>
          <App />
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
        </UniversityProvider>
      </ProfileProvider>
    </AuthProvider>
  </React.StrictMode>,
)
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useProfile } from '../contexts/ProfileContext'
import { useTheme } from '../contexts/ThemeContext'
import {
  User,
  Mail,
  Shield,
  Bell,
  Globe,
  Moon,
  Sun,
  Save,
  Edit2,
  LogOut
} from 'lucide-react'

const Settings = () => {
  const { user, logout } = useAuth()
  const { profile, updateProfile: updateProfileBackend } = useProfile()
  const { updateProfile: updateLocalProfile } = useAuth()
  const { darkMode, setDarkMode } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    notifications: true,
    language: 'en'
  })

  const handleSave = async () => {
    try {
      const result = await updateProfileBackend(formData)
      if (result.success) {
        updateLocalProfile(result.profile)
        setIsEditing(false)
        alert('Settings saved successfully!')
      } else {
        alert('Failed to save settings: ' + result.error)
      }
    } catch (error) {
      alert('An error occurred while saving settings.')
    }
  }



  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Account Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Account Settings</h2>
            <User className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                disabled={!isEditing}
                className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:disabled:bg-gray-800"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={!isEditing}
                className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:disabled:bg-gray-800"
              />
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="btn-primary flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary flex items-center"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              )}
              
              <button
                onClick={handleLogout}
                className="flex items-center text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Application Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Application Settings</h2>
            <Shield className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </div>
          
          <div className="space-y-6">
            {/* Notifications */}
            <div className="flex items-center justify-between">
              {/* <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates about your applications</p>
              </div> */}
              {/* <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifications}
                  onChange={(e) => setFormData({...formData, notifications: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label> */}
            </div>

            {/* Theme */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Theme</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred theme</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setDarkMode(false)}
                  className={`p-2 rounded-lg border transition-colors ${!darkMode ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-300 dark:border-gray-600'}`}
                >
                  <Sun className={`h-5 w-5 ${!darkMode ? 'text-blue-600' : 'text-gray-500'}`} />
                </button>
                <button
                  onClick={() => setDarkMode(true)}
                  className={`p-2 rounded-lg border transition-colors ${darkMode ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-300 dark:border-gray-600'}`}
                >
                  <Moon className={`h-5 w-5 ${darkMode ? 'text-blue-600' : 'text-gray-500'}`} />
                </button>
              </div>
            </div>

            {/* Language */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({...formData, language: e.target.value})}
                className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div> */}
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Profile Information</h2>
            <Globe className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </div>
          
          {profile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="text-sm text-blue-600 dark:text-blue-400">Education Level</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{profile.educationLevel}</div>
              </div>
              
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">Degree</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{profile.degree}</div>
              </div>

              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">Major</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{profile.major}</div>
              </div>

              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">Graduation Year</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{profile.graduationYear}</div>
              </div>

              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">GPA</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{profile.gpa || 'N/A'}</div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="text-sm text-green-600 dark:text-green-400">Intended Degree</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{profile.intendedDegree}</div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <div className="text-sm text-purple-600 dark:text-purple-400">Field of Study</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{profile.fieldOfStudy}</div>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <div className="text-sm text-orange-600 dark:text-orange-400">Budget</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">₹{profile.budget?.toLocaleString()}</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Complete your profile to see your information here</p>
              <button className="mt-4 btn-primary">
                Complete Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
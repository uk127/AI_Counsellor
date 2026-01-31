import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useProfile } from '../contexts/ProfileContext'
import {
  Home,
  Users,
  Building2,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bot,
  ChevronRight
} from 'lucide-react'

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const { profile } = useProfile()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Onboarding', href: '/onboarding', icon: Users },
    { name: 'Universities', href: '/universities', icon: Building2 },
    { name: 'Applications', href: '/applications', icon: FileText },
    { name: 'AI Counsellor', href: '/ai', icon: Bot },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Building Profile': return 'bg-blue-100 text-blue-800'
      case 'Discovering Universities': return 'bg-purple-100 text-purple-800'
      case 'Finalizing Universities': return 'bg-orange-100 text-orange-800'
      case 'Preparing Applications': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const currentStage = profile ? profile.stage : 'Building Profile'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-between px-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">AI Counsellor</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    location.pathname === item.href
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <item.icon className="mr-4 h-6 w-6" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t border-gray-200 pt-4 pb-3">
            <div className="px-4 flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800 dark:text-gray-200">{user?.name}</div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{user?.email}</div>
              </div>
            </div>
            <div className="mt-3 px-4 space-y-1">
              <button
                onClick={logout}
                className="w-full flex items-center px-2 py-2 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                <LogOut className="mr-4 h-6 w-6" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-center px-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI Counsellor</h1>
            </div>
            
            {/* Current Stage Indicator */}
            <div className="mt-6 px-4">
              <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Current Stage</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStageColor(currentStage)}`}>
                  {currentStage}
                </span>
              </div>
            </div>

            <nav className="mt-6 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                    location.pathname === item.href
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <item.icon className="mr-3 h-6 w-6" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user?.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</div>
              </div>
              <button
                onClick={logout}
                className="ml-auto p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout

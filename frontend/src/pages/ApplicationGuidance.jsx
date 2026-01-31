import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useUniversity } from '../contexts/UniversityContext'
import { applicationAPI } from '../services/api'
import {
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Users,
  Mail,
  GraduationCap,
  ArrowRight,
  Bot
} from 'lucide-react'

const ApplicationGuidance = () => {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { getApplications: getAppsFromContext } = useUniversity()

  const [applications, setApplications] = useState([])
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: 'academic'
  })
  const [newDocument, setNewDocument] = useState({
    name: '',
    type: 'required',
    status: 'not-started',
    dueDate: ''
  })

  // Load data on mount
  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      setLoading(true)
      const res = await applicationAPI.getApplications()
      if (res.data.success) {
        const lockedApps = res.data.applications.filter(app => app.isLocked)
        setApplications(lockedApps)
        if (lockedApps.length > 0 && !selectedApplication) {
          setSelectedApplication(lockedApps[0])
        }
      }
    } catch (error) {
      console.error('Failed to load applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateApplication = async (updatedData) => {
    if (!selectedApplication) return
    try {
      const res = await applicationAPI.update(selectedApplication.id, updatedData)
      if (res.data.success) {
        setSelectedApplication(res.data.application)
        setApplications(prev => prev.map(app => 
          app.id === res.data.application.id ? res.data.application : app
        ))
      }
    } catch (error) {
      console.error('Failed to update application:', error)
    }
  }

  const handleTaskToggle = async (taskIndex) => {
    const updatedTasks = [...selectedApplication.tasks]
    updatedTasks[taskIndex].completed = !updatedTasks[taskIndex].completed
    await handleUpdateApplication({ tasks: updatedTasks })
  }

  const handleAddTask = async () => {
    const task = {
      ...newTask,
      completed: false,
      id: Date.now()
    }
    const updatedTasks = [...(selectedApplication.tasks || []), task]
    await handleUpdateApplication({ tasks: updatedTasks })
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      category: 'academic'
    })
    setShowTaskModal(false)
  }

  const handleDeleteTask = async (taskIndex) => {
    const updatedTasks = selectedApplication.tasks.filter((_, i) => i !== taskIndex)
    await handleUpdateApplication({ tasks: updatedTasks })
  }

  const handleAddDocument = async () => {
    const doc = {
      ...newDocument,
      uploaded: false,
      id: Date.now()
    }
    const updatedDocs = [...(selectedApplication.documents || []), doc]
    await handleUpdateApplication({ documents: updatedDocs })
    setNewDocument({
      name: '',
      type: 'required',
      status: 'not-started',
      dueDate: ''
    })
    setShowDocumentModal(false)
  }

  const handleDocumentToggle = async (docIndex) => {
    const updatedDocs = [...selectedApplication.documents]
    updatedDocs[docIndex].uploaded = !updatedDocs[docIndex].uploaded
    await handleUpdateApplication({ documents: updatedDocs })
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'academic': return <GraduationCap className="h-4 w-4" />
      case 'exams': return <Users className="h-4 w-4" />
      case 'documents': return <FileText className="h-4 w-4" />
      case 'application': return <Mail className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getTaskProgress = () => {
    if (!selectedApplication?.tasks) return 0
    const total = selectedApplication.tasks.length
    const completed = selectedApplication.tasks.filter(t => t.completed).length
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  const getDocumentProgress = () => {
    if (!selectedApplication?.documents) return 0
    const total = selectedApplication.documents.length
    const uploaded = selectedApplication.documents.filter(d => d.uploaded).length
    return total > 0 ? Math.round((uploaded / total) * 100) : 0
  }

  if (loading) return <div className="p-8 text-center text-gray-600">Loading your applications...</div>

  if (!selectedApplication) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Locked Universities</h2>
          <p className="text-gray-600 mb-6">
            Lock a university to start managing your application process
          </p>
          <div className="space-x-4">
            <button onClick={() => navigate('/universities')} className="btn-primary">
              Discover Universities
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Selection Header */}
      <div className="mb-6 flex items-center space-x-4">
        <span className="text-gray-700 font-medium">Select University:</span>
        <select 
          value={selectedApplication.id}
          onChange={(e) => setSelectedApplication(applications.find(a => a.id === e.target.value))}
          className="p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          {applications.map(app => (
            <option key={app.id} value={app.id}>{app.university?.name || 'Unknown University'}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{selectedApplication.university?.name}</h2>
              <p className="text-gray-600">{selectedApplication.university?.city}, {selectedApplication.university?.country}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <span>Status: {selectedApplication.applicationStatus}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {getTaskProgress()}% Complete
            </div>
            <div className="text-sm text-gray-500">Application Progress</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">To-Do List</h2>
              <button onClick={() => setShowTaskModal(true)} className="btn-primary flex items-center">
                <Plus className="h-4 w-4 mr-2" /> Add Task
              </button>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: `${getTaskProgress()}%` }}></div>
            </div>
            <div className="space-y-3">
              {(selectedApplication.tasks || []).map((task, index) => (
                <div key={index} className={`p-4 border rounded-lg ${task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <button onClick={() => handleTaskToggle(index)} className={`h-5 w-5 rounded border-2 flex items-center justify-center ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                        {task.completed && <CheckCircle className="h-3 w-3 text-white" />}
                      </button>
                      <div>
                        <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>{task.title}</h3>
                        <p className="text-sm text-gray-600">{task.description}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteTask(index)} className="text-red-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Required Documents</h2>
              <button onClick={() => setShowDocumentModal(true)} className="btn-primary flex items-center">
                <Plus className="h-4 w-4 mr-2" /> Add Doc
              </button>
            </div>
            <div className="space-y-3">
              {(selectedApplication.documents || []).map((doc, index) => (
                <div key={index} className={`p-4 border rounded-lg ${doc.uploaded ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <button onClick={() => handleDocumentToggle(index)} className={`h-5 w-5 rounded border-2 flex items-center justify-center ${doc.uploaded ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                        {doc.uploaded && <CheckCircle className="h-3 w-3 text-white" />}
                      </button>
                      <h3 className={`font-medium ${doc.uploaded ? 'line-through text-gray-500' : 'text-gray-900'}`}>{doc.name}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                <span>View Application Portal</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 text-center">
            <Bot className="h-10 w-10 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <button onClick={() => navigate('/ai')} className="btn-secondary w-full">Chat with AI Counsellor</button>
          </div>
        </div>
      </div>

      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Task title" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} className="input-field" />
              <textarea placeholder="Task description" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} className="input-field" />
              <div className="flex justify-end space-x-2">
                <button onClick={() => setShowTaskModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={handleAddTask} className="btn-primary">Add Task</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDocumentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Document</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Document name" value={newDocument.name} onChange={(e) => setNewDocument({...newDocument, name: e.target.value})} className="input-field" />
              <div className="flex justify-end space-x-2">
                <button onClick={() => setShowDocumentModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={handleAddDocument} className="btn-primary">Add Document</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApplicationGuidance

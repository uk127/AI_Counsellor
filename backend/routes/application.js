import express from 'express'
import { body, validationResult } from 'express-validator'
import { Op } from 'sequelize'
import { auth } from '../middleware/auth.js'
import { Application } from '../models/Application.js'
import { University } from '../models/University.js'
import { Profile } from '../models/Profile.js'

const router = express.Router()

// Helper to get profileId from userId
const getProfileId = async (userId) => {
  const profile = await Profile.findOne({ where: { userId } })
  return profile ? profile.id : null
}

// @route   GET /api/applications
// @desc    Get user applications
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const profileId = await getProfileId(req.userId)
    if (!profileId) return res.status(404).json({ success: false, error: 'Profile not found' })
    
    const applications = await Application.findAll({
      where: { profileId },
      include: [{
        model: University,
        as: 'university'
      }],
      order: [['createdAt', 'DESC']]
    })

    res.json({
      success: true,
      applications
    })

  } catch (error) {
    console.error('Get applications error:', error)
    res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
})

// @route   PUT /api/applications/:id
// @desc    Update application (status, tasks, documents)
// @access  Private
router.put('/:id', [
  auth,
  [
    body('applicationStatus').optional().isIn(['Not Started', 'In Progress', 'Submitted', 'Accepted', 'Rejected', 'Waitlisted']),
    body('deadline').optional().isISO8601(),
    body('tasks').optional().isArray(),
    body('documents').optional().isArray()
  ]
], async (req, res) => {
  try {
    const { id } = req.params
    const profileId = await getProfileId(req.userId)
    const { applicationStatus, deadline, tasks, documents } = req.body

    const application = await Application.findOne({
      where: { id, profileId }
    })

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      })
    }

    const updates = {}
    if (applicationStatus) updates.applicationStatus = applicationStatus
    if (deadline) updates.deadline = deadline
    if (tasks) updates.tasks = tasks
    if (documents) updates.documents = documents

    await application.update(updates)

    res.json({
      success: true,
      message: 'Application updated successfully',
      application
    })

  } catch (error) {
    console.error('Update application error:', error)
    res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
})

// @route   GET /api/applications/tasks
// @desc    Get all tasks for user's locked applications
// @access  Private
router.get('/tasks', auth, async (req, res) => {
  try {
    const profileId = await getProfileId(req.userId)
    const applications = await Application.findAll({
      where: { profileId, isLocked: true }
    })
    
    const allTasks = applications.flatMap(app => 
      app.tasks.map(task => ({ ...task, universityId: app.universityId, applicationId: app.id }))
    )

    res.json({
      success: true,
      tasks: allTasks
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

// @route   GET /api/applications/documents
// @desc    Get all documents for user's locked applications
// @access  Private
router.get('/documents', auth, async (req, res) => {
  try {
    const profileId = await getProfileId(req.userId)
    const applications = await Application.findAll({
      where: { profileId, isLocked: true }
    })
    
    const allDocs = applications.flatMap(app => 
      app.documents.map(doc => ({ ...doc, universityId: app.universityId, applicationId: app.id }))
    )

    res.json({
      success: true,
      documents: allDocs
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

export default router

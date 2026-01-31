import express from 'express'
import { body, validationResult } from 'express-validator'
import { Profile } from '../models/Profile.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

// @route   POST /api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', [
  auth,
  [
    body('educationLevel').notEmpty().withMessage('Education level is required'),
    body('degree').notEmpty().withMessage('Degree is required'),
    body('major').notEmpty().withMessage('Major is required'),
    body('graduationYear').isInt({ min: 2000, max: 2030 }).withMessage('Graduation year must be valid'),
    body('intendedDegree').notEmpty().withMessage('Intended degree is required'),
    body('fieldOfStudy').notEmpty().withMessage('Field of study is required'),
    body('targetIntake').notEmpty().withMessage('Target intake is required'),
    body('preferredCountries').isArray({ min: 1 }).withMessage('At least one preferred country is required'),
    body('budget').isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
    body('fundingPlan').notEmpty().withMessage('Funding plan is required'),
    body('sopStatus').notEmpty().withMessage('SOP status is required'),
    body('gpa').optional().isFloat({ min: 0, max: 4.0 }),
    body('ielts').optional().isFloat({ min: 0, max: 9.0 }),
    body('toefl').optional().isInt({ min: 0, max: 120 }),
    body('gre').optional().isInt({ min: 260, max: 340 }),
    body('gmat').optional().isInt({ min: 200, max: 800 })
  ]
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const userId = req.userId
    const profileData = req.body

    // Check if profile already exists
    let profile = await Profile.findOne({ where: { userId } })

    if (profile) {
      // Update existing profile
      await profile.update(profileData)
      return res.json({
        success: true,
        message: 'Profile updated successfully',
        profile
      })
    } else {
      // Create new profile
      profileData.userId = userId
      profile = await Profile.create(profileData)
      
      return res.status(201).json({
        success: true,
        message: 'Profile created successfully',
        profile
      })
    }

  } catch (error) {
    console.error('Profile error:', error)
    res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
})

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.userId
    const profile = await Profile.findOne({ where: { userId } })

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      })
    }

    res.json({
      success: true,
      profile
    })

  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
})

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put('/', [
  auth,
  [
    body('educationLevel').optional(),
    body('degree').optional(),
    body('major').optional(),
    body('graduationYear').optional().isInt({ min: 2000, max: 2030 }),
    body('gpa').optional().isFloat({ min: 0, max: 4.0 }),
    body('intendedDegree').optional(),
    body('fieldOfStudy').optional(),
    body('targetIntake').optional(),
    body('preferredCountries').optional().isArray(),
    body('budget').optional().isFloat({ min: 0 }),
    body('fundingPlan').optional(),
    body('ielts').optional().isFloat({ min: 0, max: 9.0 }),
    body('toefl').optional().isInt({ min: 0, max: 120 }),
    body('gre').optional().isInt({ min: 260, max: 340 }),
    body('gmat').optional().isInt({ min: 200, max: 800 }),
    body('sopStatus').optional()
  ]
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const userId = req.userId
    const profileData = req.body

    let profile = await Profile.findOne({ where: { userId } })

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      })
    }

    await profile.update(profileData)

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile
    })

  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
})

// @route   DELETE /api/profile
// @desc    Delete user profile
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    const userId = req.userId

    const profile = await Profile.findOne({ where: { userId } })

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      })
    }

    await profile.destroy()

    res.json({
      success: true,
      message: 'Profile deleted successfully'
    })

  } catch (error) {
    console.error('Delete profile error:', error)
    res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
})

export default router
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import { User } from '../models/User.js'
import { Profile } from '../models/Profile.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input data',
        errors: errors.array()
      })
    }

    const { name, email, password } = req.body

    // Check if user already exists
    let user = await User.findOne({ where: { email } })
    if (user) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      })
    }

    // Create new user
    user = new User({
      name,
      email,
      password
    })

    await user.save()

    // Generate JWT token
    const token = generateToken(user.id)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: user.toJSON()
    })

  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({
      success: false,
      error: 'Server error during registration'
    })
  }
})

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input data',
        errors: errors.array()
      })
    }

    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credentials'
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        error: 'Account is deactivated'
      })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credentials'
      })
    }

    // Update last login
    await user.update({ lastLogin: new Date() })

    // Get user profile
    const profile = await Profile.findOne({ where: { userId: user.id } })

    // Generate JWT token
    const token = generateToken(user.id)

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toJSON(),
      profile
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      error: 'Server error during login'
    })
  }
})

// @route   GET /api/auth/me
// @desc    Get current user data
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // Get user ID from JWT middleware (assumed to be added)
    const userId = req.userId
    
    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    const profile = await Profile.findOne({ where: { userId: user.id } })

    res.json({
      success: true,
      user: user.toJSON(),
      profile
    })

  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
})

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', async (req, res) => {
  try {
    const userId = req.userId
    
    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    const token = generateToken(user.id)

    res.json({
      success: true,
      token
    })

  } catch (error) {
    console.error('Token refresh error:', error)
    res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
})

export default router
import express from 'express'
import { University } from '../models/University.js'
import { Profile } from '../models/Profile.js'
import { Application } from '../models/Application.js'
import { auth } from '../middleware/auth.js'
import { Op } from 'sequelize'

const router = express.Router()

// @route   GET /api/universities
// @desc    Get all universities with optional filtering
// @access  Public/Private
router.get('/', async (req, res) => {
  try {
    const { country, budget, ranking, acceptanceRate, search } = req.query
    
    const whereClause = {}

    if (country) {
      whereClause.country = country
    }

    if (budget) {
      whereClause.cost = { [Op.lte]: parseFloat(budget) }
    }

    if (ranking) {
      whereClause.ranking = { [Op.lte]: parseInt(ranking) }
    }

    if (acceptanceRate) {
      whereClause.acceptanceRate = { [Op.lte]: parseFloat(acceptanceRate) }
    }

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { country: { [Op.iLike]: `%${search}%` } },
        { city: { [Op.iLike]: `%${search}%` } }
      ]
    }

    const universities = await University.findAll({ where: whereClause })

    res.json({
      success: true,
      universities,
      count: universities.length
    })

  } catch (error) {
    console.error('Get universities error:', error)
    res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
})


// @route   GET /api/universities/:id
// @desc    Get university by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const university = await University.findByPk(id)

    if (!university) {
      return res.status(404).json({
        success: false,
        error: 'University not found'
      })
    }

    res.json({
      success: true,
      university
    })

  } catch (error) {
    console.error('Get university error:', error)
    res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
})

// @route   POST /api/universities/recommend
// @desc    Get university recommendations based on profile
// @access  Private
router.post('/recommend', auth, async (req, res) => {
  try {
    const userId = req.userId
    console.log(`Getting recommendations for user: ${userId}`)
    
    const profile = await Profile.findOne({ where: { userId } })

    if (!profile) {
      console.log('Profile not found for recommendations')
      return res.status(404).json({
        success: false,
        error: 'Profile not found. Please complete onboarding first.'
      })
    }

    console.log('Fetching universities and applications...')
    const universities = await University.findAll()
    const applications = await Application.findAll({ where: { profileId: profile.id } })
    console.log(`Found ${universities.length} universities and ${applications.length} applications`)
    
    const profileJson = profile.toJSON()
    
    // Calculate fit scores for each university
    const universitiesWithScores = universities.map(university => {
      try {
        const uniJson = university.toJSON()
        const fitScore = calculateFitScore(uniJson, profileJson)
        const category = categorizeUniversity(fitScore)
        const app = applications.find(a => a.universityId === university.id)
        
        return {
          ...uniJson,
          fitScore,
          category,
          isShortlisted: !!app,
          isLocked: !!app?.isLocked
        }
      } catch (err) {
        console.error(`Error calculating score for ${university.name}:`, err)
        return university.toJSON()
      }
    })

    console.log('Sorting and sending recommendations...')
    // Sort by fit score descending
    universitiesWithScores.sort((a, b) => (b.fitScore || 0) - (a.fitScore || 0))

    res.json({
      success: true,
      universities: universitiesWithScores,
      message: 'Here are your personalized university recommendations'
    })

  } catch (error) {
    console.error('University recommendations error:', error)
    res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
})

// @route   POST /api/universities/:id/shortlist
// @desc    Shortlist a university
// @access  Private
router.post('/:id/shortlist', auth, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId
    
    const profile = await Profile.findOne({ where: { userId } })
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' })

    const [application, created] = await Application.findOrCreate({
      where: { profileId: profile.id, universityId: id },
      defaults: { applicationStatus: 'Not Started' }
    })

    res.json({
      success: true,
      message: created ? 'University shortlisted successfully' : 'University already in your list',
      application
    })

  } catch (error) {
    console.error('Shortlist university error:', error)
    res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
})

// @route   POST /api/universities/:id/lock
// @desc    Lock a university
// @access  Private
router.post('/:id/lock', auth, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId
    
    const profile = await Profile.findOne({ where: { userId } })
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' })

    let application = await Application.findOne({
      where: { profileId: profile.id, universityId: id }
    })

    if (application) {
      await application.update({ isLocked: true })
    } else {
      application = await Application.create({
        profileId: profile.id,
        universityId: id,
        isLocked: true,
        applicationStatus: 'Not Started'
      })
    }

    // Update profile stage
    await profile.update({ stage: 'Preparing Applications' })

    res.json({
      success: true,
      message: 'University locked successfully. You can now manage your application guidance.',
      application
    })

  } catch (error) {
    console.error('Lock university error:', error)
    res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
})

// @route   POST /api/universities/:id/unlock
// @desc    Unlock a university
// @access  Private
router.post('/:id/unlock', auth, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId
    
    const profile = await Profile.findOne({ where: { userId } })
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' })

    const application = await Application.findOne({
      where: { profileId: profile.id, universityId: id }
    })

    if (application) {
      await application.update({ isLocked: false })
    }

    res.json({
      success: true,
      message: 'University unlocked successfully'
    })

  } catch (error) {
    console.error('Unlock university error:', error)
    res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
})

// Helper function to calculate fit score
function calculateFitScore(university, profile) {
  if (!profile || !university) return 0
  
  let score = 0
  let maxScore = 0
  
  // Academic fit
  if (profile.gpa && university.requirements?.gpa) {
    maxScore += 40
    const userGpa = parseFloat(profile.gpa)
    const reqGpa = parseFloat(university.requirements.gpa)
    if (userGpa >= reqGpa) score += 40
    else if (userGpa >= reqGpa - 0.5) score += 20
  }
  
  // Exam fit
  if (profile.ielts && university.requirements?.ielts) {
    maxScore += 30
    const userIelts = parseFloat(profile.ielts)
    const reqIelts = parseFloat(university.requirements.ielts)
    if (userIelts >= reqIelts) score += 30
    else if (userIelts >= reqIelts - 0.5) score += 15
  } else if (profile.toefl && university.requirements?.toefl) {
    maxScore += 30
    if (profile.toefl >= university.requirements.toefl) score += 30
    else if (profile.toefl >= university.requirements.toefl - 10) score += 15
  }
  
  // GRE/GMAT fit
  if (profile.gre && university.requirements?.gre) {
    maxScore += 20
    if (profile.gre >= university.requirements.gre) score += 20
    else if (profile.gre >= university.requirements.gre - 20) score += 10
  } else if (profile.gmat && university.requirements?.gmat) {
    maxScore += 20
    if (profile.gmat >= university.requirements.gmat) score += 20
    else if (profile.gmat >= university.requirements.gmat - 50) score += 10
  }
  
  // Budget fit
  if (profile.budget && university.cost) {
    maxScore += 10
    const budget = parseFloat(profile.budget)
    const cost = parseFloat(university.cost)
    if (cost <= budget) score += 10
    else if (cost <= budget * 1.2) score += 5
  }
  
  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
}

// Helper function to categorize university
function categorizeUniversity(fitScore) {
  if (fitScore >= 80) return 'Safe'
  if (fitScore >= 60) return 'Target'
  return 'Dream'
}

export default router

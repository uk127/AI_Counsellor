import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables immediately
dotenv.config()

// Import routes
import authRoutes from './routes/auth.js'
import profileRoutes from './routes/profile.js'
import universityRoutes from './routes/university.js'
import aiRoutes from './routes/ai.js'
import applicationRoutes from './routes/application.js'

// Import database and models (initializes associations)
import { sequelize } from './models/index.js'

// Import middleware
import errorHandler from './middleware/errorHandler.js'
import notFound from './middleware/notFound.js'

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
})

app.use('/api', limiter)

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Serve static files (for future uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/universities', universityRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/applications', applicationRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI Counsellor Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      profile: '/api/profile',
      universities: '/api/universities',
      ai: '/api/ai',
      applications: '/api/applications'
    }
  })
})

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Database connection and server start
async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate()
    console.log('Database connected successfully')

    // Sync database models (safer for production)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true })
      console.log('Database synchronized (development mode with alter)')
    } else {
      await sequelize.sync()
      console.log('Database synchronized (production mode)')
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`Environment: ${process.env.NODE_ENV}`)
    })

  } catch (error) {
    console.error('Unable to connect to database:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  process.exit(0)
})

// Start the server
startServer()
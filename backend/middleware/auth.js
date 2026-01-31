import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      })
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7)

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      })
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET)
    
    // Add user ID to request object
    req.userId = decoded.userId
    
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(401).json({
      success: false,
      error: 'Token is not valid'
    })
  }
}

// Optional auth middleware (doesn't throw error if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization')
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      
      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.userId = decoded.userId
      }
    }
    
    next()
  } catch (error) {
    // For optional auth, we don't throw error, just continue without user ID
    next()
  }
}

export { auth, optionalAuth }
#!/usr/bin/env node

/**
 * Script to install missing dependencies and verify setup
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'

console.log('🔧 AI Counsellor - Dependency Installation\n')

// Check if node_modules exists in both directories
const checkNodeModules = (dir, description) => {
  const path = `./${dir}/node_modules`
  if (existsSync(path)) {
    console.log(`✅ ${description} - node_modules exists`)
    return true
  } else {
    console.log(`❌ ${description} - node_modules missing`)
    return false
  }
}

// Install dependencies
const installDeps = (dir, description) => {
  try {
    console.log(`📦 Installing ${description} dependencies...`)
    execSync('npm install', { cwd: dir, stdio: 'inherit' })
    console.log(`✅ ${description} dependencies installed successfully`)
    return true
  } catch (error) {
    console.log(`❌ Failed to install ${description} dependencies`)
    return false
  }
}

// Verify specific packages
const verifyPackage = (dir, pkg, description) => {
  try {
    execSync(`npm list ${pkg}`, { cwd: dir, stdio: 'pipe' })
    console.log(`✅ ${description} - ${pkg} is installed`)
    return true
  } catch (error) {
    console.log(`❌ ${description} - ${pkg} is missing`)
    return false
  }
}

// Main execution
console.log('1. Checking existing installations...')
const backendHasDeps = checkNodeModules('backend', 'Backend')
const frontendHasDeps = checkNodeModules('frontend', 'Frontend')

console.log('\n2. Installing missing dependencies...')

if (!backendHasDeps) {
  installDeps('backend', 'Backend')
} else {
  console.log('✅ Backend dependencies already installed')
}

if (!frontendHasDeps) {
  installDeps('frontend', 'Frontend')
} else {
  console.log('✅ Frontend dependencies already installed')
}

console.log('\n3. Verifying critical packages...')

const backendChecks = [
  verifyPackage('backend', 'express', 'Backend'),
  verifyPackage('backend', 'sequelize', 'Backend'),
  verifyPackage('backend', 'pg', 'Backend'),
  verifyPackage('backend', 'bcryptjs', 'Backend'),
  verifyPackage('backend', 'jsonwebtoken', 'Backend')
]

const frontendChecks = [
  verifyPackage('frontend', 'react', 'Frontend'),
  verifyPackage('frontend', 'react-dom', 'Frontend'),
  verifyPackage('frontend', 'react-router-dom', 'Frontend'),
  verifyPackage('frontend', 'react-hook-form', 'Frontend'),
  verifyPackage('frontend', 'react-hot-toast', 'Frontend'),
  verifyPackage('frontend', 'lucide-react', 'Frontend')
]

const backendSuccess = backendChecks.every(Boolean)
const frontendSuccess = frontendChecks.every(Boolean)

console.log('\n📊 Installation Summary:')
console.log(`Backend: ${backendSuccess ? '✅ Complete' : '❌ Issues detected'}`)
console.log(`Frontend: ${frontendSuccess ? '✅ Complete' : '❌ Issues detected'}`)

if (backendSuccess && frontendSuccess) {
  console.log('\n🎉 All dependencies installed successfully!')
  console.log('\n🚀 Next steps:')
  console.log('1. Set up your PostgreSQL database')
  console.log('2. Configure environment variables in backend/.env')
  console.log('3. Run "cd backend && npm start" to start the backend server')
  console.log('4. Run "cd frontend && npm run dev" to start the frontend')
  console.log('5. Open http://localhost:5173 in your browser')
} else {
  console.log('\n⚠️  Some dependencies are still missing.')
  console.log('Try running the following commands manually:')
  console.log('cd backend && npm install')
  console.log('cd frontend && npm install')
}

console.log('\n📖 For detailed setup instructions, see README.md')
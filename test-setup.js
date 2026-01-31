#!/usr/bin/env node

/**
 * Simple test script to verify the application setup
 * Run this script to check if all components are properly configured
 */

import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

console.log('🧪 AI Counsellor - Setup Verification\n')

const checkFile = (path, description) => {
  if (existsSync(path)) {
    console.log(`✅ ${description}`)
    return true
  } else {
    console.log(`❌ ${description}`)
    return false
  }
}

const checkPackageJson = (path, description) => {
  if (existsSync(path)) {
    try {
      const content = readFileSync(path, 'utf8')
      const packageJson = JSON.parse(content)
      console.log(`✅ ${description} - ${packageJson.name}@${packageJson.version}`)
      return true
    } catch (error) {
      console.log(`❌ ${description} - Invalid JSON`)
      return false
    }
  } else {
    console.log(`❌ ${description} - File not found`)
    return false
  }
}

const runCommand = (command, description) => {
  try {
    execSync(command, { stdio: 'pipe' })
    console.log(`✅ ${description}`)
    return true
  } catch (error) {
    console.log(`❌ ${description} - ${error.message.split('\n')[0]}`)
    return false
  }
}

// Check project structure
console.log('📁 Project Structure:')
const checks = [
  checkFile('backend/', 'Backend directory exists'),
  checkFile('frontend/', 'Frontend directory exists'),
  checkFile('backend/server.js', 'Backend server file'),
  checkFile('frontend/src/main.jsx', 'Frontend entry point'),
  checkFile('README.md', 'Documentation')
]

// Check package.json files
console.log('\n📦 Package Configuration:')
const packageChecks = [
  checkPackageJson('backend/package.json', 'Backend package.json'),
  checkPackageJson('frontend/package.json', 'Frontend package.json')
]

// Check key files
console.log('\n🔑 Key Files:')
const keyFiles = [
  checkFile('backend/.env.example', 'Environment variables template'),
  checkFile('backend/config/database.js', 'Database configuration'),
  checkFile('backend/models/User.js', 'User model'),
  checkFile('backend/routes/auth.js', 'Authentication routes'),
  checkFile('frontend/src/App.jsx', 'Main application component'),
  checkFile('frontend/src/contexts/AuthContext.jsx', 'Authentication context'),
  checkFile('frontend/src/pages/Dashboard.jsx', 'Dashboard page'),
  checkFile('frontend/src/pages/AIPage.jsx', 'AI Counsellor page')
]

// Check dependencies (basic verification)
console.log('\n🔧 Dependencies:')
const depChecks = [
  runCommand('cd backend && npm list express', 'Express.js installed'),
  runCommand('cd frontend && npm list react', 'React installed'),
  runCommand('cd frontend && npm list tailwindcss', 'Tailwind CSS installed')
]

// Summary
const totalChecks = checks.length + packageChecks.length + keyFiles.length + depChecks.length
const passedChecks = [...checks, ...packageChecks, ...keyFiles, ...depChecks].filter(Boolean).length
const successRate = Math.round((passedChecks / totalChecks) * 100)

console.log(`\n📊 Summary:`)
console.log(`Total checks: ${totalChecks}`)
console.log(`Passed: ${passedChecks}`)
console.log(`Failed: ${totalChecks - passedChecks}`)
console.log(`Success rate: ${successRate}%`)

if (successRate === 100) {
  console.log('\n🎉 All checks passed! Your AI Counsellor application is ready to use.')
  console.log('\n🚀 Next steps:')
  console.log('1. Set up your PostgreSQL database')
  console.log('2. Configure environment variables in backend/.env')
  console.log('3. Run "cd backend && npm start" to start the backend server')
  console.log('4. Run "cd frontend && npm run dev" to start the frontend')
  console.log('5. Open http://localhost:5173 in your browser')
} else {
  console.log('\n⚠️  Some checks failed. Please review the issues above.')
  console.log('Refer to the README.md for detailed setup instructions.')
}

console.log('\n📖 For detailed documentation, see README.md')
console.log('🆘 For support, check the GitHub repository or create an issue.')
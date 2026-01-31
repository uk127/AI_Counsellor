# 🚀 Quick Start Guide

Get your AI Counsellor application up and running in minutes!

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies

Run the automated installation script:

```bash
node install-dependencies.js
```

Or manually install dependencies:

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies  
cd ../frontend
npm install
```

### 2. Set Up Database

1. **Create PostgreSQL database:**
   ```bash
   createdb ai_counsellor
   ```

2. **Configure environment variables:**
   ```bash
   cd backend
   cp .env.example .env
   ```

3. **Edit `.env` file** with your database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ai_counsellor
   DB_USER=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret_key_here
   ```

### 3. Start the Application

```bash
# Start backend server
cd backend
npm start

# In a new terminal, start frontend
cd ../frontend
npm run dev
```

### 4. Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## 🎯 First Steps

1. **Complete Onboarding:** Sign up and complete your profile
2. **Discover Universities:** Use the university discovery page
3. **Get AI Recommendations:** Chat with the AI counsellor
4. **Manage Applications:** Track your application progress

## 🔧 Troubleshooting

### Common Issues

**"react-hot-toast" not found:**
```bash
cd frontend
npm install react-hot-toast
```

**Database connection errors:**
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database name matches `DB_NAME`

**Port already in use:**
- Change `PORT` in `backend/.env`
- Change port in `frontend/vite.config.js`

### Verification

Run the setup verification script:
```bash
node test-setup.js
```

## 📞 Support

- **Documentation:** See `README.md` for detailed instructions
- **Issues:** Create an issue in the GitHub repository
- **Email:** support@aicounsellor.com

---

**🎉 You're all set! Start your study-abroad journey with AI Counsellor!**
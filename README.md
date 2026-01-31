# AI Counsellor - Study Abroad Platform

A comprehensive web application that helps students navigate their study-abroad journey with AI-powered guidance, university discovery, and application management.

## 🚀 Features

### 🤖 AI-Powered Counsellor
- **Smart Profile Analysis**: Analyzes academic background and provides personalized recommendations
- **University Recommendations**: AI-driven suggestions based on profile, budget, and preferences
- **Application Guidance**: Step-by-step guidance through the application process
- **Exam Preparation**: Personalized study plans for IELTS, TOEFL, GRE, and GMAT
- **Budget Planning**: Cost analysis and funding options for different destinations

### 🎓 University Discovery
- **Advanced Filtering**: Filter universities by country, budget, ranking, and acceptance rate
- **Fit Score Analysis**: AI-powered compatibility scoring for each university
- **University Categories**: Safe, Target, and Dream university categorization
- **Detailed Profiles**: Comprehensive information about each university

### 📋 Application Management
- **To-Do Lists**: Personalized task lists with deadlines and priorities
- **Document Tracking**: Track required and submitted documents
- **Application Status**: Monitor application progress and deadlines
- **University Locking**: Commit to preferred universities

### 👤 User Management
- **Complete Onboarding**: Comprehensive profile setup with academic and personal information
- **Progress Tracking**: Visual progress indicators for each stage of the journey
- **Secure Authentication**: JWT-based authentication with email verification

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Form management and validation
- **Zod** - Schema validation
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Sequelize** - ORM for PostgreSQL
- **PostgreSQL** - Relational database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing
- **helmet** - Security middleware
- **express-rate-limit** - Rate limiting

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **dotenv** - Environment variable management

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI_counsellor2
   ```

2. **Navigate to backend directory**
   ```bash
   cd backend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ai_counsellor
   DB_USER=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret
   ```

5. **Set up database**
   ```bash
   # Create database
   createdb ai_counsellor
   
   # Run migrations (if using migrations)
   npm run migrate
   ```

6. **Start the backend server**
   ```bash
   npm start
   ```
   
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Frontend will run on `http://localhost:5173`

## 🗂️ Project Structure

```
AI_counsellor2/
├── backend/                    # Backend API server
│   ├── config/
│   │   └── database.js         # Database configuration
│   ├── models/                 # Database models
│   │   ├── User.js
│   │   ├── Profile.js
│   │   ├── University.js
│   │   └── Application.js
│   ├── routes/                 # API routes
│   │   ├── auth.js
│   │   ├── profile.js
│   │   ├── university.js
│   │   ├── ai.js
│   │   └── application.js
│   ├── middleware/             # Custom middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── server.js               # Main server file
│   └── package.json
├── frontend/                   # React frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── contexts/          # React contexts
│   │   ├── services/          # API services
│   │   ├── styles/            # Global styles
│   │   ├── utils/             # Utility functions
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # App entry point
│   ├── package.json
│   └── vite.config.js
├── README.md                   # This file
└── package.json               # Root package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Profile Management
- `POST /api/profile` - Create or update profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `DELETE /api/profile` - Delete profile

### University Discovery
- `GET /api/universities` - Get all universities (with filtering)
- `GET /api/universities/:id` - Get university by ID
- `POST /api/universities/recommend` - Get personalized recommendations
- `POST /api/universities/:id/shortlist` - Shortlist university
- `POST /api/universities/:id/lock` - Lock university

### AI Services
- `POST /api/ai/chat` - Chat with AI counsellor
- `GET /api/ai/profile-analysis` - Get profile analysis
- `GET /api/ai/university-recommendations` - Get AI recommendations
- `GET /api/ai/application-guidance` - Get application guidance
- `GET /api/ai/exam-preparation` - Get exam preparation advice

### Application Management
- `GET /api/applications` - Get user applications
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application
- `GET /api/applications/summary` - Get application summary

## 🎯 Usage

1. **Start with Onboarding**: Complete your profile with academic background, goals, and preferences
2. **Discover Universities**: Use the university discovery page to find and filter universities
3. **Get AI Recommendations**: Let the AI counsellor analyze your profile and suggest universities
4. **Shortlist and Lock**: Shortlist interesting universities and lock your preferred choice
5. **Manage Applications**: Use the application guidance page to track tasks and deadlines
6. **Chat with AI**: Get personalized advice and guidance throughout your journey

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting
- Helmet security headers
- Environment variable management

## 🚀 Deployment

### Backend Deployment
1. Set up a PostgreSQL database on your hosting provider
2. Configure environment variables
3. Build and deploy the Node.js application
4. Set up a reverse proxy (nginx) if needed

### Frontend Deployment
1. Build the React application: `npm run build`
2. Serve the static files using a web server (nginx, Apache)
3. Configure environment variables for the production environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request

## 🙏 Acknowledgments

- React and Node.js communities
- PostgreSQL for reliable database management
- All the amazing open-source packages used in this project

---

**AI Counsellor** - Making study-abroad dreams a reality, one student at a time. 🎓✨
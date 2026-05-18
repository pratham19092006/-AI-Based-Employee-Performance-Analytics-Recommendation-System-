# AI-Based Employee Performance Analytics & Recommendation System

A complete MERN stack production-quality application designed for a university semester practical exam. It features advanced UI, an integrated AI suggestion system, and robust authentication.

## Tech Stack
**Frontend:** React, Vite, Tailwind CSS, Recharts, Context API, Axios, React Router v6.
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, OpenRouter API.

## Features
- Secure JWT Authentication (Login/Signup).
- AI Executive Summary and Analytics.
- AI Employee Analysis via OpenRouter API (Promotions, Training, Strengths).
- Advanced Dashboard with visually appealing Recharts.
- Complete CRUD operations for Employees.
- Search, Filter, and Pagination Support.
- Responsive, Glassmorphism-inspired UI with smooth animations.
- Production-ready error handling and API structure.

## Setup Instructions

### 1. Database Setup
Create a cluster on MongoDB Atlas and get your connection string.

### 2. OpenRouter Setup
Get your API Key from [OpenRouter](https://openrouter.ai/).

### 3. Backend Setup
1. `cd backend`
2. `npm install`
3. Add your environment variables in `.env` (refer to the existing one).
4. `npm run dev` (Ensure you add `"dev": "nodemon server.js"` in package.json or just run `node server.js`).

### 4. Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create `.env` file with `VITE_API_URL=http://localhost:5000/api`
4. `npm run dev`

## Deployment (Render)
- **Backend**: Deploy as a Web Service. Ensure env variables are set (MONGODB_URI, JWT_SECRET, OPENROUTER_API_KEY).
- **Frontend**: Deploy as a Static Site. Set Build Command to `npm run build` and Publish Directory to `dist`. Add `VITE_API_URL` to point to the live backend URL.

## API Documentation

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate user & get token
- `GET /api/auth/profile` - Get logged-in user profile

### Employees
- `GET /api/employees` - Get all employees (Supports ?search, ?department, ?page, ?limit)
- `GET /api/employees/:id` - Get single employee
- `POST /api/employees` - Add new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/employees/analytics/dashboard` - Get analytics data

### AI Integration
- `POST /api/ai/recommend` - Generate AI recommendations for a specific employee
- `GET /api/ai/summary` - Generate overall team summary

## Folder Structure

\`\`\`
/
├── backend/                  # Express server
│   ├── config/               # Database connection
│   ├── controllers/          # Route logic
│   ├── middleware/           # Auth and error handling
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API endpoints
│   ├── services/             # External services (OpenRouter)
│   ├── utils/                # Helper functions (AI Prompts)
│   ├── app.js                # App configuration
│   └── server.js             # Entry point
└── frontend/                 # React application
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── context/          # State management (Auth)
    │   ├── layouts/          # Page wrappers
    │   ├── pages/            # Core views
    │   ├── services/         # Axios API configuration
    │   ├── App.jsx           # Main routing
    │   └── main.jsx          # Entry point
\`\`\`

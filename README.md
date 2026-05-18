# AI-Based Employee Performance Analytics & Recommendation System

> MERN Stack | OpenRouter AI | JWT Auth | MongoDB Atlas | Deployed on Render + Vercel

---

## 🚀 Live Demo
- **Frontend (Vercel):** *(Add your Vercel URL here)*
- **Backend (Render):** *(Add your Render URL here)*

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS v4, Recharts, Axios |
| Backend | Node.js, Express.js, Mongoose, JWT, bcryptjs |
| Database | MongoDB Atlas |
| AI | OpenRouter API (GPT-3.5-Turbo) |
| Deployment | Vercel (Frontend) + Render (Backend) |

---

## 📁 Project Structure

```
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Route logic (auth, employee, AI)
│   ├── middleware/      # JWT auth + error handling
│   ├── models/          # Mongoose schemas (User, Employee)
│   ├── routes/          # API route definitions
│   ├── services/        # OpenRouter AI service
│   ├── utils/           # AI prompt generators
│   ├── app.js           # Express app setup
│   └── server.js        # Entry point
│
└── frontend/
    └── src/
        ├── components/  # Navbar, Sidebar
        ├── context/     # Auth Context (JWT state)
        ├── layouts/     # Main layout wrapper
        ├── pages/       # Login, Signup, Dashboard, Employees, AI Hub, Analytics
        ├── services/    # Axios API service
        ├── App.jsx      # Router setup
        └── main.jsx     # Entry point
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login + get JWT |
| GET | `/api/auth/profile` | Get logged-in user |

### Employees
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/employees` | Add employee (validated) |
| GET | `/api/employees` | List all (paginated, searchable) |
| GET | `/api/employees/:id` | Single employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |
| GET | `/api/employees/search` | Filter: `?department=Engineering&skills=React&minScore=70` |
| GET | `/api/employees/analytics/dashboard` | Dashboard stats (MongoDB aggregation) |

### AI (OpenRouter GPT-3.5-Turbo)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/recommend` | Promotion analysis + skill gap |
| POST | `/api/ai/feedback` | Performance feedback + SMART goals |
| POST | `/api/ai/ranking` | AI-powered employee ranking |
| POST | `/api/ai/training` | Personalized training plan |
| GET | `/api/ai/summary` | Executive team summary |

---

## ⚙️ Local Setup

### 1. Clone the repo
```bash
git clone https://github.com/pratham19092006/-AI-Based-Employee-Performance-Analytics-Recommendation-System-.git
cd "AI-Based-Employee-Performance-Analytics-Recommendation-System"
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create `backend/.env`:
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=your_openrouter_key
NODE_ENV=development
```
Run:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000/api
```
Run:
```bash
npm run dev
```

---

## 🌐 Deployment

### Backend → Render (Web Service)
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `OPENROUTER_API_KEY`, `NODE_ENV=production`

### Frontend → Vercel (Static Site)
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_URL=https://your-render-backend.onrender.com/api`

---

## ✨ Features

- 🔐 JWT Authentication (Signup/Login/Protected Routes)
- 👤 Employee CRUD with express-validator
- 🔍 Search & Filter by department, skills, performance score
- 🤖 4 AI Features powered by GPT-3.5 via OpenRouter
- 📊 Analytics with Recharts charts
- 🏆 AI Employee Ranking with badges
- 📚 AI Training Plans (individual + team-wide)
- 💬 AI Performance Feedback with SMART goals
- 🌙 Modern glassmorphism UI with Tailwind CSS

---

## 👨‍💻 Author

**Pratham Mishra** | B.Tech 4th Semester | AI308B Exam Project

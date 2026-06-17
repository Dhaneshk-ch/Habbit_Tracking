# FlowZen — Full Stack Habit Tracker

AI-powered habit tracker. **One terminal, one command, full app.**

---

## ⚡ Quick Start (3 steps)

### Step 1 — Install everything

**Windows:**
```
Double-click setup.bat
```

**Mac / Linux:**
```bash
chmod +x setup.sh && ./setup.sh
```

**Or manually:**
```bash
npm install
npm run install:all
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

---

### Step 2 — Configure backend `.env`

Open `backend/.env` and fill in:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/flowzen
JWT_SECRET=any_long_random_string_here_change_this
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_key_here
CLIENT_URL=http://localhost:5173
```

**Get MongoDB free:** https://www.mongodb.com/try/download/community
**Get Gemini key free:** https://aistudio.google.com/

---

### Step 3 — Run everything (ONE terminal)

```bash
npm run dev
```

This starts BOTH servers at once:
- 🟢 Backend  → http://localhost:5000
- 🟣 Frontend → http://localhost:5173

Open your browser at **http://localhost:5173**

---

## Project Structure

```
flowzen_full/
│
├── package.json        ← ROOT — runs both servers together
├── setup.bat           ← Windows one-click setup
├── setup.sh            ← Mac/Linux one-click setup
│
├── frontend/           ← React + Vite + Tailwind CSS v4
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          ← Real API client with JWT
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   ← Login/register/logout
│   │   │   └── ThemeContext.jsx  ← Dark/light mode
│   │   ├── components/           ← 22 UI components
│   │   │   ├── AIChat.jsx
│   │   │   ├── AIWeeklyReport.jsx
│   │   │   ├── AppLayout.jsx
│   │   │   ├── HabitForm.jsx
│   │   │   ├── HabitStatsCard.jsx
│   │   │   ├── HabitSuggestionModal.jsx
│   │   │   ├── HeatmapChart.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Markdown.jsx
│   │   │   ├── MobileNav.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── MonthlyBarChart.jsx
│   │   │   ├── MorningMotivation.jsx
│   │   │   ├── OrbitingHabits.jsx
│   │   │   ├── ProgressRing.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StreakRecoveryCard.jsx
│   │   │   ├── SummaryCards.jsx
│   │   │   ├── TodayHabitCard.jsx
│   │   │   ├── WeeklyBarChart.jsx
│   │   │   └── WeeklyGrid.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx       ← Marketing page
│   │   │   ├── Login.jsx         ← Sign in
│   │   │   ├── Register.jsx      ← Sign up
│   │   │   ├── Dashboard.jsx     ← Today's habits + progress
│   │   │   ├── Habits.jsx        ← Manage all habits
│   │   │   ├── Weekly.jsx        ← Weekly grid view
│   │   │   ├── Insights.jsx      ← Charts + AI weekly report
│   │   │   └── Stats.jsx         ← Deep stats + AI chat
│   │   └── utils/
│   │       ├── constants.js
│   │       ├── dateHelpers.js
│   │       ├── mockData.js
│   │       └── confetti.js
│   ├── .env.example
│   └── package.json
│
└── backend/            ← Node.js + Express + MongoDB + Gemini
    ├── server.js       ← Express entry point
    ├── config/
    │   └── db.js       ← MongoDB connection
    ├── models/
    │   ├── User.js     ← name, email, password, avatar
    │   ├── Habit.js    ← name, icon, color, category, streak
    │   └── Log.js      ← one document per habit per day
    ├── middleware/
    │   └── auth.js     ← JWT verify on all protected routes
    ├── routes/
    │   ├── auth.js
    │   ├── habits.js
    │   ├── logs.js
    │   └── ai.js
    ├── controllers/
    │   ├── authController.js    ← register, login, me, profile
    │   ├── habitController.js   ← CRUD + archive + reorder
    │   ├── logController.js     ← completions, streaks, heatmap, stats
    │   └── aiController.js      ← Gemini: report, chat, suggest, recovery
    ├── .env.example
    └── package.json
```

---

## All API Endpoints

### Auth (no token needed)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |

### Auth (token required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/profile | Update name / settings |

### Habits
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/habits | List all habits |
| POST | /api/habits | Create habit |
| PUT | /api/habits/:id | Update habit |
| DELETE | /api/habits/:id | Delete habit |
| PUT | /api/habits/:id/archive | Toggle archive |
| PUT | /api/habits/reorder | Reorder habits |

### Logs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/logs | Mark habit complete |
| DELETE | /api/logs | Unmark habit |
| GET | /api/logs/today | Today's completions |
| GET | /api/logs/range?start=&end= | Date range logs |
| GET | /api/logs/heatmap | 90-day heatmap data |
| GET | /api/logs/stats | All habits stats (30d) |
| GET | /api/logs/stats/:habitId | Single habit detail |

### AI (Gemini)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/ai/weekly-report | AI weekly summary |
| POST | /api/ai/suggest-habits | Suggest new habits |
| POST | /api/ai/recovery-plan | Streak recovery plan |
| POST | /api/ai/chat | Chat with habit coach |
| GET | /api/ai/morning | Morning motivation |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v4 |
| Charts | Recharts |
| HTTP Client | Axios (with JWT interceptor) |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| AI | Google Gemini 1.5 Flash |
| Dev | concurrently (run both servers together) |


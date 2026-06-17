# FlowZen Backend

Express + MongoDB + JWT + Gemini AI backend for FlowZen Habit Tracker.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env — add your MONGO_URI and GEMINI_API_KEY

# 3. Start development server
npm run dev

# 4. Verify it works
curl http://localhost:5000/api/health
```

## Environment Variables (.env)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/flowzen
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```

> Get a free Gemini API key at: https://aistudio.google.com/

## API Endpoints

### Auth
| Method | Endpoint            | Description           | Auth |
|--------|--------------------|-----------------------|------|
| POST   | /api/auth/register | Register new user     | No   |
| POST   | /api/auth/login    | Login                 | No   |
| GET    | /api/auth/me       | Get current user      | Yes  |
| PUT    | /api/auth/profile  | Update name/settings  | Yes  |

### Habits
| Method | Endpoint                  | Description         | Auth |
|--------|--------------------------|---------------------|------|
| GET    | /api/habits               | Get all habits      | Yes  |
| POST   | /api/habits               | Create habit        | Yes  |
| PUT    | /api/habits/:id           | Update habit        | Yes  |
| DELETE | /api/habits/:id           | Delete habit        | Yes  |
| PUT    | /api/habits/:id/archive   | Toggle archive      | Yes  |
| PUT    | /api/habits/reorder       | Reorder habits      | Yes  |

### Logs
| Method | Endpoint                   | Description              | Auth |
|--------|---------------------------|--------------------------|------|
| POST   | /api/logs                  | Mark habit complete      | Yes  |
| DELETE | /api/logs                  | Unmark habit             | Yes  |
| GET    | /api/logs/today            | Today's completions      | Yes  |
| GET    | /api/logs/range            | Date range logs          | Yes  |
| GET    | /api/logs/heatmap          | 90-day heatmap           | Yes  |
| GET    | /api/logs/stats            | All habits stats (30d)   | Yes  |
| GET    | /api/logs/stats/:habitId   | Single habit stats       | Yes  |

### AI (Gemini)
| Method | Endpoint                | Description              | Auth |
|--------|------------------------|--------------------------|------|
| POST   | /api/ai/weekly-report  | AI weekly summary        | Yes  |
| POST   | /api/ai/suggest-habits | Suggest new habits       | Yes  |
| POST   | /api/ai/recovery-plan  | Streak recovery plan     | Yes  |
| POST   | /api/ai/chat           | Chat with habit coach    | Yes  |
| GET    | /api/ai/morning        | Morning motivation       | Yes  |

## Project Structure

```
backend/
├── server.js              # Entry point
├── .env.example           # Environment template
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   ├── User.js            # User schema
│   ├── Habit.js           # Habit schema
│   └── Log.js             # Completion log schema
├── middleware/
│   └── auth.js            # JWT verify middleware
├── routes/
│   ├── auth.js
│   ├── habits.js
│   ├── logs.js
│   └── ai.js
└── controllers/
    ├── authController.js
    ├── habitController.js
    ├── logController.js
    └── aiController.js
```

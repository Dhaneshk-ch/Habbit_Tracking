@echo off
echo ========================================
echo   FlowZen Setup Script (Windows)
echo ========================================

echo.
echo [1/4] Installing root dependencies...
call npm install

echo.
echo [2/4] Installing backend dependencies...
cd backend
call npm install
cd ..

echo.
echo [3/4] Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo [4/4] Setting up .env files...
if not exist backend\.env (
  copy backend\.env.example backend\.env
  echo Created backend\.env — please edit it with your MongoDB URI and Gemini API key
) else (
  echo backend\.env already exists
)

if not exist frontend\.env (
  copy frontend\.env.example frontend\.env
  echo Created frontend\.env
) else (
  echo frontend\.env already exists
)

echo.
echo ========================================
echo   Setup complete!
echo.
echo   1. Edit backend\.env with your values
echo   2. Run:  npm run dev
echo   3. Open: http://localhost:5173
echo ========================================
pause

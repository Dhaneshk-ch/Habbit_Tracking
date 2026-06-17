#!/bin/bash
echo "========================================"
echo "  FlowZen Setup Script (Mac/Linux)"
echo "========================================"

echo ""
echo "[1/4] Installing root dependencies..."
npm install

echo ""
echo "[2/4] Installing backend dependencies..."
cd backend && npm install && cd ..

echo ""
echo "[3/4] Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo ""
echo "[4/4] Setting up .env files..."
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "Created backend/.env — please edit it with your MongoDB URI and Gemini API key"
else
  echo "backend/.env already exists"
fi

if [ ! -f frontend/.env ]; then
  cp frontend/.env.example frontend/.env
  echo "Created frontend/.env"
else
  echo "frontend/.env already exists"
fi

echo ""
echo "========================================"
echo "  Setup complete!"
echo ""
echo "  1. Edit backend/.env with your values"
echo "  2. Run:  npm run dev"
echo "  3. Open: http://localhost:5173"
echo "========================================"

@echo off
echo Starting Private Practice Trading App...

start cmd /k "cd backend && uvicorn main:app --reload"
start cmd /k "cd frontend && npm run dev"

echo Backend running on http://localhost:8000
echo Frontend running on http://localhost:5173
echo Done.

@echo off
echo ===================================================
echo Starting ShopSphere Full-Stack Development Servers
echo ===================================================
echo Backend API : http://127.0.0.1:8000/api/
echo Django Admin: http://127.0.0.1:8000/admin/
echo Frontend UI : http://localhost:3000
echo ===================================================

start "ShopSphere Backend (Django)" cmd /k "cd backend && ..\venv\Scripts\python manage.py runserver 127.0.0.1:8000"
start "ShopSphere Frontend (Next.js)" cmd /k "cd frontend && npm run dev"

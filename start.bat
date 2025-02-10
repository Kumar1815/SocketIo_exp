@echo off
cd backend

:: Activate the virtual environment (adjust the path if necessary)
call venv\Scripts\activate.bat

:: Start Flask app in a new command prompt
start cmd /k python app.py

:: Start React app
cd ../frontend
npm run dev

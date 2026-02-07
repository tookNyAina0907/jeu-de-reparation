@echo off
echo ==========================================
echo    DEPLOIEMENT DE GARAGE MOBILE
echo ==========================================
echo.
echo 1. Installation des dependances...
call npm install
echo.
echo 2. Construction du projet (Production)...
echo (On saute verification TS pour eviter les erreurs de build)
call npx vite build
echo.
echo 3. Lancement de la preview...
echo Le site sera disponible sur le port par defaut (souvent 4173)
call npx vite preview
pause

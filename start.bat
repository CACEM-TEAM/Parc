@echo off
echo ========================================
echo    DEMARRAGE APPLICATION PARCAUTO
echo ========================================
echo.

echo 1. Arret des services existants...
docker-compose down

echo.
echo 2. Demarrage des services...
docker-compose up -d

echo.
echo 3. Attente du demarrage des services...
timeout /t 10 /nobreak > nul

echo.
echo 4. Verification des services...
docker-compose ps

echo.
echo ========================================
echo    APPLICATION PARCAUTO DEMARREE
echo ========================================
echo.
echo URLs disponibles :
echo - Frontend : http://localhost:3000
echo - Backend  : http://localhost:4500
echo - phpMyAdmin : http://localhost:8080
echo.
echo Appuyez sur une touche pour fermer...
pause > nul 
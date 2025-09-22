# ========================================
# Script de déploiement ParcAuto - Production (PowerShell)
# ========================================

Write-Host "🚀 Déploiement de ParcAuto en production..." -ForegroundColor Green

# Vérifier que Docker est installé
try {
    docker --version | Out-Null
    Write-Host "✅ Docker détecté" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker n'est pas installé. Veuillez installer Docker d'abord." -ForegroundColor Red
    exit 1
}

try {
    docker-compose --version | Out-Null
    Write-Host "✅ Docker Compose détecté" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose n'est pas installé. Veuillez installer Docker Compose d'abord." -ForegroundColor Red
    exit 1
}

# Vérifier que le fichier .env.prod existe
if (-not (Test-Path ".env.prod")) {
    Write-Host "❌ Le fichier .env.prod n'existe pas. Veuillez le créer d'abord." -ForegroundColor Red
    exit 1
}

# Copier le fichier .env.prod vers .env
Write-Host "📋 Configuration de l'environnement..." -ForegroundColor Yellow
Copy-Item ".env.prod" ".env" -Force

# Arrêter les conteneurs existants
Write-Host "🛑 Arrêt des conteneurs existants..." -ForegroundColor Yellow
docker-compose down

# Supprimer les anciennes images (optionnel)
Write-Host "🗑️ Nettoyage des anciennes images..." -ForegroundColor Yellow
docker system prune -f

# Construire et démarrer les services
Write-Host "🔨 Construction et démarrage des services..." -ForegroundColor Yellow
docker-compose up --build -d

# Attendre que les services soient prêts
Write-Host "⏳ Attente du démarrage des services..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Vérifier le statut des services
Write-Host "📊 Vérification du statut des services..." -ForegroundColor Yellow
docker-compose ps

# Tester la connectivité
Write-Host "🔍 Test de connectivité..." -ForegroundColor Yellow

# Test du backend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4501/api/health" -TimeoutSec 5
    Write-Host "✅ Backend API accessible sur le port 4501" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend API non accessible sur le port 4501" -ForegroundColor Red
}

# Test du frontend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001" -TimeoutSec 5
    Write-Host "✅ Frontend accessible sur le port 3001" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend non accessible sur le port 3001" -ForegroundColor Red
}

# Test de phpMyAdmin
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8083" -TimeoutSec 5
    Write-Host "✅ phpMyAdmin accessible sur le port 8083" -ForegroundColor Green
} catch {
    Write-Host "❌ phpMyAdmin non accessible sur le port 8083" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Déploiement terminé !" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Accès aux services :" -ForegroundColor Cyan
Write-Host "   Frontend:    http://localhost:3001" -ForegroundColor White
Write-Host "   Backend API: http://localhost:4501" -ForegroundColor White
Write-Host "   phpMyAdmin:  http://localhost:8083" -ForegroundColor White
Write-Host ""
Write-Host "📋 Commandes utiles :" -ForegroundColor Cyan
Write-Host "   Voir les logs:     docker-compose logs -f" -ForegroundColor White
Write-Host "   Arrêter:          docker-compose down" -ForegroundColor White
Write-Host "   Redémarrer:       docker-compose restart" -ForegroundColor White
Write-Host "   Statut:           docker-compose ps" -ForegroundColor White

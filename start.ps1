# Script PowerShell pour démarrer l'application ParcAuto

param(
    [switch]$Production,
    [switch]$Development,
    [switch]$Help
)

# Configuration par défaut
$EnvFile = ".env"
$ComposeFile = "docker-compose.yml"

# Fonction d'aide
function Show-Help {
    Write-Host "🚗 ParcAuto - Script de démarrage" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\start.ps1 [OPTIONS]" -ForegroundColor White
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "  -Production     Démarrer en mode production" -ForegroundColor White
    Write-Host "  -Development    Démarrer en mode développement (défaut)" -ForegroundColor White
    Write-Host "  -Help           Afficher cette aide" -ForegroundColor White
    Write-Host ""
    Write-Host "Exemples:" -ForegroundColor Yellow
    Write-Host "  .\start.ps1              # Démarrage développement" -ForegroundColor White
    Write-Host "  .\start.ps1 -Production  # Démarrage production" -ForegroundColor White
}

# Traitement des paramètres
if ($Help) {
    Show-Help
    exit 0
}

if ($Production) {
    $EnvFile = ".env.production"
    $ComposeFile = "docker-compose.prod.yml"
}

if ($Development) {
    $EnvFile = ".env"
    $ComposeFile = "docker-compose.yml"
}

Write-Host "🚀 Démarrage de l'application ParcAuto avec Docker Compose..." -ForegroundColor Green
Write-Host "📁 Fichier d'environnement: $EnvFile" -ForegroundColor Cyan
Write-Host "📄 Fichier compose: $ComposeFile" -ForegroundColor Cyan

# Vérifier si le fichier .env existe
if (-not (Test-Path $EnvFile)) {
    Write-Host "❌ Fichier $EnvFile non trouvé. Veuillez le créer d'abord." -ForegroundColor Red
    exit 1
}

# Vérifier si Docker est installé
try {
    docker --version | Out-Null
} catch {
    Write-Host "❌ Docker n'est pas installé. Veuillez installer Docker d'abord." -ForegroundColor Red
    exit 1
}

# Vérifier si Docker Compose est installé
try {
    docker-compose --version | Out-Null
} catch {
    Write-Host "❌ Docker Compose n'est pas installé. Veuillez installer Docker Compose d'abord." -ForegroundColor Red
    exit 1
}

# Charger les variables d'environnement
Get-Content $EnvFile | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.*)$') {
        [Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
    }
}

# Arrêter les conteneurs existants
Write-Host "🛑 Arrêt des conteneurs existants..." -ForegroundColor Yellow
docker-compose -f $ComposeFile down

# Construire et démarrer les conteneurs
Write-Host "🔨 Construction et démarrage des conteneurs..." -ForegroundColor Yellow
docker-compose -f $ComposeFile --env-file $EnvFile up --build -d

# Attendre que les services soient prêts
Write-Host "⏳ Attente du démarrage des services..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Vérifier le statut des conteneurs
Write-Host "📊 Statut des conteneurs :" -ForegroundColor Cyan
docker-compose -f $ComposeFile ps

Write-Host ""
Write-Host "✅ Application ParcAuto démarrée avec succès !" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Accès aux services :" -ForegroundColor Cyan
Write-Host "   Frontend (Vue.js) : http://localhost:$env:FRONTEND_PORT" -ForegroundColor White
Write-Host "   Backend (API)     : http://localhost:$env:BACKEND_PORT" -ForegroundColor White
Write-Host "   phpMyAdmin        : http://localhost:$env:PHPMYADMIN_PORT" -ForegroundColor White
Write-Host "   MySQL             : localhost:$env:MYSQL_PORT" -ForegroundColor White
Write-Host ""
Write-Host "📋 Informations de connexion :" -ForegroundColor Cyan
Write-Host "   MySQL - Utilisateur: root, Mot de passe: $env:MYSQL_ROOT_PASSWORD" -ForegroundColor White
Write-Host "   MySQL - Base de données: $env:MYSQL_DATABASE" -ForegroundColor White
Write-Host "   phpMyAdmin - Utilisateur: $env:PMA_USER, Mot de passe: $env:PMA_PASSWORD" -ForegroundColor White
Write-Host ""
Write-Host "🛑 Pour arrêter l'application : docker-compose -f $ComposeFile down" -ForegroundColor Yellow
Write-Host "📝 Pour voir les logs : docker-compose -f $ComposeFile logs -f" -ForegroundColor Yellow 
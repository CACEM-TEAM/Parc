#!/bin/bash

# ========================================
# Script de déploiement ParcAuto - Production
# ========================================

echo "🚀 Déploiement de ParcAuto en production..."

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker d'abord."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez installer Docker Compose d'abord."
    exit 1
fi

# Vérifier que le fichier .env.prod existe
if [ ! -f ".env.prod" ]; then
    echo "❌ Le fichier .env.prod n'existe pas. Veuillez le créer d'abord."
    exit 1
fi

# Copier le fichier .env.prod vers .env
echo "📋 Configuration de l'environnement..."
cp .env.prod .env

# Arrêter les conteneurs existants
echo "🛑 Arrêt des conteneurs existants..."
docker-compose down

# Supprimer les anciennes images (optionnel)
echo "🗑️ Nettoyage des anciennes images..."
docker system prune -f

# Construire et démarrer les services
echo "🔨 Construction et démarrage des services..."
docker-compose up --build -d

# Attendre que les services soient prêts
echo "⏳ Attente du démarrage des services..."
sleep 30

# Vérifier le statut des services
echo "📊 Vérification du statut des services..."
docker-compose ps

# Tester la connectivité
echo "🔍 Test de connectivité..."

# Test du backend
if curl -f http://localhost:4501/api/health > /dev/null 2>&1; then
    echo "✅ Backend API accessible sur le port 4501"
else
    echo "❌ Backend API non accessible sur le port 4501"
fi

# Test du frontend
if curl -f http://localhost:3001 > /dev/null 2>&1; then
    echo "✅ Frontend accessible sur le port 3001"
else
    echo "❌ Frontend non accessible sur le port 3001"
fi

# Test de phpMyAdmin
if curl -f http://localhost:8083 > /dev/null 2>&1; then
    echo "✅ phpMyAdmin accessible sur le port 8083"
else
    echo "❌ phpMyAdmin non accessible sur le port 8083"
fi

echo ""
echo "🎉 Déploiement terminé !"
echo ""
echo "📱 Accès aux services :"
echo "   Frontend:    http://localhost:3001"
echo "   Backend API: http://localhost:4501"
echo "   phpMyAdmin:  http://localhost:8083"
echo ""
echo "📋 Commandes utiles :"
echo "   Voir les logs:     docker-compose logs -f"
echo "   Arrêter:          docker-compose down"
echo "   Redémarrer:       docker-compose restart"
echo "   Statut:           docker-compose ps"

#!/bin/bash

# Configuration par défaut
ENV_FILE=".env"
COMPOSE_FILE="docker-compose.yml"

# Fonction d'aide
show_help() {
    echo "🚗 ParcAuto - Script de démarrage"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -p, --production    Démarrer en mode production"
    echo "  -d, --development   Démarrer en mode développement (défaut)"
    echo "  -h, --help          Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0                  # Démarrage développement"
    echo "  $0 -p              # Démarrage production"
    echo "  $0 --production    # Démarrage production"
}

# Parser les arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--production)
            ENV_FILE=".env.production"
            COMPOSE_FILE="docker-compose.prod.yml"
            shift
            ;;
        -d|--development)
            ENV_FILE=".env"
            COMPOSE_FILE="docker-compose.yml"
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo "❌ Option inconnue: $1"
            show_help
            exit 1
            ;;
    esac
done

echo "🚀 Démarrage de l'application ParcAuto avec Docker Compose..."
echo "📁 Fichier d'environnement: $ENV_FILE"
echo "📄 Fichier compose: $COMPOSE_FILE"

# Vérifier si le fichier .env existe
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Fichier $ENV_FILE non trouvé. Veuillez le créer d'abord."
    exit 1
fi

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker d'abord."
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez installer Docker Compose d'abord."
    exit 1
fi

# Charger les variables d'environnement
export $(cat $ENV_FILE | grep -v '^#' | xargs)

# Arrêter les conteneurs existants
echo "🛑 Arrêt des conteneurs existants..."
docker-compose -f $COMPOSE_FILE down

# Construire et démarrer les conteneurs
echo "🔨 Construction et démarrage des conteneurs..."
docker-compose -f $COMPOSE_FILE --env-file $ENV_FILE up --build -d

# Attendre que les services soient prêts
echo "⏳ Attente du démarrage des services..."
sleep 30

# Vérifier le statut des conteneurs
echo "📊 Statut des conteneurs :"
docker-compose -f $COMPOSE_FILE ps

echo ""
echo "✅ Application ParcAuto démarrée avec succès !"
echo ""
echo "🌐 Accès aux services :"
echo "   Frontend (Vue.js) : http://localhost:${FRONTEND_PORT}"
echo "   Backend (API)     : http://localhost:${BACKEND_PORT}"
echo "   phpMyAdmin        : http://localhost:${PHPMYADMIN_PORT}"
echo "   MySQL             : localhost:${MYSQL_PORT}"
echo ""
echo "📋 Informations de connexion :"
echo "   MySQL - Utilisateur: root, Mot de passe: ${MYSQL_ROOT_PASSWORD}"
echo "   MySQL - Base de données: ${MYSQL_DATABASE}"
echo "   phpMyAdmin - Utilisateur: ${PMA_USER}, Mot de passe: ${PMA_PASSWORD}"
echo ""
echo "🛑 Pour arrêter l'application : docker-compose -f $COMPOSE_FILE down"
echo "📝 Pour voir les logs : docker-compose -f $COMPOSE_FILE logs -f" 
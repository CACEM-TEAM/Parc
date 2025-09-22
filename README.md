# 🚗 ParcAuto - Gestion de Parc Automobile

Application web complète pour la gestion d'un parc automobile avec système de contrôle des véhicules.

## ✨ Fonctionnalités

### 🚗 Gestion des Véhicules
- **Ajout/Modification/Suppression** de véhicules
- **Recherche** par immatriculation, marque, type
- **Informations complètes** : marque, type, immatriculation, remisage

### 📋 Système de Contrôle
- **Contrôle complet** par véhicule
- **Nom du contrôleur** obligatoire
- **Date/heure automatique** d'enregistrement
- **Points de contrôle** :
  - Pneus (usure, enjoliveurs)
  - Huiles et liquides
  - Freins (plaquettes, disques)
  - Éclairage (feux, clignotants)
  - Équipements (extincteur, roue de secours, etc.)

### 📊 Tableau de Bord
- **Statistiques** des contrôles
- **Problèmes fréquents** identifiés
- **Vue d'ensemble** du parc

### 👥 Gestion des Utilisateurs
- **Authentification** sécurisée
- **Rôles** : admin, utilisateur
- **Interface** moderne et intuitive

## 🛠️ Technologies

### Frontend
- **Vue.js 3** - Framework JavaScript
- **Lucide Icons** - Icônes modernes
- **CSS personnalisé** - Design iOS-like
- **Axios** - Client HTTP

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Base de données
- **Docker** - Containerisation

## 🚀 Installation et Démarrage

### Prérequis
- Docker et Docker Compose
- Node.js (pour développement)

### Démarrage rapide
```bash
# Cloner le projet
git clone [url-du-repo]
cd parcauto

# Démarrer avec Docker
docker-compose up -d

# Ou utiliser le script Windows
start.bat
```

### URLs d'accès
- **Application** : http://localhost:3000
- **API Backend** : http://localhost:4500
- **phpMyAdmin** : http://localhost:8080

## 📁 Structure du Projet

```
parcauto/
├── Front/                 # Frontend Vue.js
│   ├── src/
│   │   ├── views/        # Pages de l'application
│   │   ├── services/     # Services API
│   │   └── components/   # Composants réutilisables
├── Back/                  # Backend Node.js
│   ├── routes/           # Routes API
│   ├── config/           # Configuration
│   └── server.js         # Serveur principal
├── dbappparcauto.sql     # Structure de la base de données
├── docker-compose.yml    # Configuration Docker
└── README.md            # Documentation
```

## 🔧 Configuration

### Base de Données
La base de données est automatiquement créée avec :
- **Tables** : vehicules, controles, conducteurs, users
- **Données de test** : véhicules et conducteurs d'exemple
- **Contraintes** : clés étrangères et intégrité référentielle

### Variables d'Environnement
```env
# Backend
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=password
DB_NAME=parcauto
PORT=4500

# Frontend
VUE_APP_API_URL=http://localhost:4500/api
```

## 📱 Utilisation

### 1. Contrôle d'un Véhicule
1. **Accéder** à la page "Contrôle"
2. **Rechercher** un véhicule par immatriculation
3. **Sélectionner** le véhicule dans la liste
4. **Saisir** votre nom (contrôleur)
5. **Remplir** tous les points de contrôle
6. **Enregistrer** le contrôle

### 2. Gestion des Véhicules
1. **Accéder** à la page "Véhicules"
2. **Ajouter** un nouveau véhicule
3. **Modifier** les informations existantes
4. **Consulter** l'historique des contrôles

### 3. Tableau de Bord
1. **Accéder** à la page "Dashboard"
2. **Consulter** les statistiques
3. **Identifier** les problèmes fréquents
4. **Suivre** l'état du parc

## 🔒 Sécurité

- **Authentification** requise pour toutes les opérations
- **Validation** des données côté client et serveur
- **Protection** contre les injections SQL
- **Gestion** des erreurs sécurisée

## 🐛 Dépannage

### Problèmes courants

**Docker ne démarre pas :**
```bash
# Vérifier que Docker est démarré
docker --version

# Nettoyer les conteneurs
docker-compose down
docker system prune -f
```

**Base de données inaccessible :**
```bash
# Redémarrer MySQL
docker-compose restart mysql

# Vérifier les logs
docker-compose logs mysql
```

**Frontend ne se charge pas :**
```bash
# Reconstruire le frontend
docker-compose build frontend
docker-compose up -d frontend
```

## 📞 Support

Pour toute question ou problème :
1. Vérifier la documentation
2. Consulter les logs Docker
3. Tester les endpoints API
4. Contacter l'équipe de développement

---

**ParcAuto** - Gestion intelligente de votre parc automobile 🚗✨ 
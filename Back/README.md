# API ParcAuto - Backend

API REST pour la gestion de parc automobile développée avec Node.js et Express.

## 🚀 Installation

1. **Installer les dépendances :**
```bash
npm install
```

2. **Configuration :**
   - Copiez le fichier `config.env` vers `.env`
   - Modifiez les variables d'environnement selon votre configuration

3. **Démarrer le serveur :**
```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

## 📡 Endpoints

### Base URL
```
http://localhost:4500
```

### Routes principales

#### 🔐 Authentification (`/api/auth`)
- `POST /api/auth/register` - Inscription d'un nouvel utilisateur
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/verify` - Vérification du token JWT

#### 🚗 Véhicules (`/api/vehicules`)
- `GET /api/vehicules` - Récupérer tous les véhicules
- `GET /api/vehicules/:id` - Récupérer un véhicule par ID
- `POST /api/vehicules` - Créer un nouveau véhicule
- `PUT /api/vehicules/:id` - Mettre à jour un véhicule
- `DELETE /api/vehicules/:id` - Supprimer un véhicule
- `GET /api/vehicules/search` - Rechercher des véhicules

#### 👥 Utilisateurs (`/api/users`)
- `GET /api/users` - Récupérer tous les utilisateurs
- `GET /api/users/:id` - Récupérer un utilisateur par ID
- `PUT /api/users/:id` - Mettre à jour un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur
- `GET /api/users/profile/me` - Profil de l'utilisateur connecté
- `PUT /api/users/profile/me` - Mettre à jour le profil

#### 🏥 Santé (`/api/health`)
- `GET /api/health` - Statut de l'API

## 📋 Exemples d'utilisation

### Inscription d'un utilisateur
```bash
curl -X POST http://localhost:4500/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Connexion
```bash
curl -X POST http://localhost:4500/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Créer un véhicule
```bash
curl -X POST http://localhost:4500/api/vehicules \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "marque": "Renault",
    "type": "Clio",
    "immatriculation": "AB-123-CD",
    "remisage_domicile": false
  }'
```

### Récupérer tous les véhicules
```bash
curl -X GET http://localhost:4500/api/vehicules \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` avec les variables suivantes :

```env
# Configuration du serveur
PORT=4500
NODE_ENV=development

# Configuration de la base de données
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=parcauto
DB_PORT=3306

# Configuration JWT
JWT_SECRET=votre_secret_jwt_tres_securise
JWT_EXPIRES_IN=24h

# Configuration CORS
CORS_ORIGIN=http://localhost:3000
```

## 🛠️ Structure du projet

```
Back/
├── server.js          # Point d'entrée de l'application
├── package.json       # Dépendances et scripts
├── config.env         # Configuration des variables d'environnement
├── routes/            # Routes de l'API
│   ├── index.js       # Routeur principal
│   ├── auth.js        # Routes d'authentification
│   ├── vehicules.js   # Routes des véhicules
│   └── users.js       # Routes des utilisateurs
└── README.md          # Documentation
```

## 🔒 Sécurité

- **Helmet** : Sécurité des en-têtes HTTP
- **CORS** : Configuration des origines autorisées
- **JWT** : Authentification par token
- **bcryptjs** : Hashage des mots de passe
- **Morgan** : Logging des requêtes

## 📝 Notes de développement

### Base de données
L'API est prête à être connectée à une base de données MySQL. Les requêtes sont commentées dans le code et prêtes à être implémentées.

### Middleware d'authentification
Le middleware d'authentification est en place mais nécessite l'implémentation de la vérification JWT.

### Validation des données
La validation de base est implémentée. Pour une validation plus robuste, considérez l'utilisation de `joi` ou `express-validator`.

## 🚀 Déploiement

### Production
1. Configurez les variables d'environnement pour la production
2. Installez les dépendances : `npm install --production`
3. Démarrez le serveur : `npm start`

### Docker (optionnel)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 4500
CMD ["npm", "start"]
```

## 📞 Support

Pour toute question ou problème, consultez la documentation ou contactez l'équipe de développement. 
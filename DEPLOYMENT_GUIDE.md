# 🚗 ParcAuto - Guide de Déploiement Production

## 📋 Résumé des Changements de Ports

Votre application ParcAuto a été configurée pour éviter les conflits de ports avec votre serveur de production.

### 🔄 Nouveaux Ports (Production)

| Service | Ancien Port | Nouveau Port | Description |
|---------|-------------|--------------|-------------|
| **Frontend** | 3000 | **3001** | Interface utilisateur Vue.js |
| **Backend API** | 4500 | **4501** | API Node.js/Express |
| **MySQL** | 3306 | **3307** | Base de données |
| **phpMyAdmin** | 8080 | **8083** | Interface d'administration MySQL |

### 🚫 Ports Évités

Les ports suivants sont déjà utilisés sur votre serveur et ont été évités :
- 3030, 8082, 27077, 3333, 8880, 8081, 443, 44380, 808080, 8080

## 🚀 Déploiement Rapide

### ⚠️ Important : Fichiers Docker Compose

Votre projet utilise **deux fichiers Docker Compose** :

- **`docker-compose.yml`** : Configuration de développement
- **`docker-compose.prod.yml`** : Configuration de production (avec optimisations)

**Pour la production, utilisez TOUJOURS** `docker-compose.prod.yml` avec le flag `-f` :

```bash
docker-compose -f docker-compose.prod.yml [commande]
```

### Option 1 : Script Automatique (Recommandé)

**Sur Windows :**
```powershell
.\deploy-prod.ps1
```

**Sur Linux/Mac :**
```bash
./deploy-prod.sh
```

### Option 2 : Déploiement Manuel

1. **Configurer l'environnement :**
   ```bash
   cp .env.prod .env
   ```

2. **Démarrer les services :**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

3. **Vérifier le statut :**
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   ```

## 🌐 Accès aux Services

Une fois déployé, vos services seront accessibles sur :

- **Frontend** : http://localhost:3001
- **Backend API** : http://localhost:4501
- **phpMyAdmin** : http://localhost:8083

## 🔧 Configuration

### Variables d'Environnement Principales

Les fichiers `.env.prod` (racine) et `Front/.env.prod` contiennent toutes les configurations nécessaires :

**Racine du projet (`.env.prod`) :**

```env
# Ports de production
FRONTEND_PORT=3001
BACKEND_PORT=4501
MYSQL_PORT=3307
PHPMYADMIN_PORT=8083

# Configuration de base
NODE_ENV=production
CORS_ORIGIN=http://localhost:3001
VITE_API_URL=http://localhost:4501
```

**Frontend (`Front/.env.prod`) :**
```env
# Configuration Frontend
VITE_API_URL=http://localhost:4501/api
```

### 🔐 Sécurité

⚠️ **Important** : Changez les mots de passe par défaut avant le déploiement :

```env
MYSQL_ROOT_PASSWORD=votre_mot_de_passe_securise
MYSQL_PASSWORD=votre_mot_de_passe_securise
JWT_SECRET=votre_secret_jwt_tres_securise
```

## 📊 Monitoring

### Vérifier le Statut des Services

```bash
# Voir tous les conteneurs
docker-compose -f docker-compose.prod.yml ps

# Voir les logs en temps réel
docker-compose -f docker-compose.prod.yml logs -f

# Voir les logs d'un service spécifique
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f mysql
```

### Tests de Connectivité

```bash
# Test du backend
curl http://localhost:4501/api/health

# Test du frontend
curl http://localhost:3001

# Test de phpMyAdmin
curl http://localhost:8083
```

## 🛠️ Commandes Utiles

### Gestion des Services

```bash
# Démarrer tous les services
docker-compose -f docker-compose.prod.yml up -d

# Arrêter tous les services
docker-compose -f docker-compose.prod.yml down

# Redémarrer un service spécifique
docker-compose -f docker-compose.prod.yml restart backend

# Reconstruire et redémarrer
docker-compose -f docker-compose.prod.yml up --build -d
```

### Maintenance

```bash
# Nettoyer les images inutilisées
docker system prune -f

# Voir l'utilisation des ressources
docker stats

# Sauvegarder la base de données
docker-compose -f docker-compose.prod.yml exec mysql mysqldump -u root -p parcauto > backup.sql
```

## 🔍 Dépannage

### Problèmes Courants

1. **Port déjà utilisé :**
   ```bash
   # Vérifier les ports utilisés
   netstat -tulpn | grep :3001
   netstat -tulpn | grep :4501
   ```

2. **Service ne démarre pas :**
   ```bash
   # Voir les logs détaillés
   docker-compose -f docker-compose.prod.yml logs backend
   ```

3. **Problème de connexion à la base :**
   ```bash
   # Vérifier le statut MySQL
   docker-compose -f docker-compose.prod.yml exec mysql mysqladmin ping
   ```

### Logs Importants

- **Backend** : `docker-compose -f docker-compose.prod.yml logs backend`
- **Frontend** : `docker-compose -f docker-compose.prod.yml logs frontend`
- **MySQL** : `docker-compose -f docker-compose.prod.yml logs mysql`

## 🔧 Configuration phpMyAdmin

### Démarrage de phpMyAdmin

phpMyAdmin utilise un profil Docker spécifique. Pour le démarrer :

```bash
# Démarrer avec phpMyAdmin
docker-compose -f docker-compose.prod.yml --profile admin up -d

# Vérifier le statut
docker-compose -f docker-compose.prod.yml ps
```

### Accès à phpMyAdmin

- **URL** : http://localhost:8083
- **Utilisateur** : `root`
- **Mot de passe** : `rootpassword_secure_prod`

### Configuration des Fonctions Relationnelles

Si vous voyez l'erreur "Configuration de pmadb… en erreur", vous devez :

1. **Créer la base de données phpmyadmin** :
   - Connectez-vous à phpMyAdmin
   - Créez une nouvelle base de données nommée `phpmyadmin`
   - Importez le script `init_phpmyadmin.sql` (disponible à la racine du projet)

2. **Ou utilisez phpMyAdmin sans les fonctions relationnelles** :
   - Les fonctions de base (gestion des bases, tables, requêtes) fonctionnent sans cette configuration

## 📞 Support

En cas de problème :

1. Vérifiez les logs : `docker-compose -f docker-compose.prod.yml logs -f`
2. Vérifiez le statut : `docker-compose -f docker-compose.prod.yml ps`
3. Testez la connectivité : `curl http://localhost:4501/api/health`
4. Pour phpMyAdmin : `curl http://localhost:8083`

---

🎉 **Votre application ParcAuto est maintenant prête pour la production !**

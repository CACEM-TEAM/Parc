# Utiliser l'image Node.js 24 officielle
FROM node:24-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 3001

# Commande de démarrage pour le développement
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3001"] 
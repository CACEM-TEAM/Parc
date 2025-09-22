const express = require('express');
const cors = require('cors');
const { testConnection, initializeDatabase } = require('./config/database');

// Import des routes
const authRoutes = require('./routes/auth');
const vehiculesRoutes = require('./routes/vehicules');
const conducteursRoutes = require('./routes/conducteurs');
const controlesRoutes = require('./routes/controles');

const app = express();
const PORT = process.env.PORT || 4501;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes de base
app.get('/', (req, res) => {
  res.json({
    message: '🚗 API ParcAuto - Système de contrôle de parc automobile',
    version: '1.0.0',
    endpoints: {
      vehicules: '/api/vehicules',
      conducteurs: '/api/conducteurs',
      controles: '/api/controles'
    }
  });
});

// Route de test
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API ParcAuto fonctionnelle',
    timestamp: new Date().toISOString()
  });
});

// Route de santé
app.get('/api/health', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    res.json({
      success: true,
      status: 'OK',
      database: dbConnected ? 'Connected' : 'Disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'ERROR',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/vehicules', vehiculesRoutes);
app.use('/api/conducteurs', conducteursRoutes);
app.use('/api/controles', controlesRoutes);

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route non trouvée',
    path: req.originalUrl
  });
});

// Gestionnaire d'erreurs global
app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  res.status(500).json({
    success: false,
    error: 'Erreur interne du serveur',
    message: error.message
  });
});

// Démarrage du serveur
async function startServer() {
  try {
    // Tester la connexion à la base de données
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ Impossible de se connecter à la base de données');
      process.exit(1);
    }

    // Initialiser la base de données
    await initializeDatabase();

    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log('🚀 Serveur API ParcAuto démarré sur le port', PORT);
      console.log('📡 URL:', `http://localhost:${PORT}`);
      console.log('🔗 Test:', `http://localhost:${PORT}/api/test`);
      console.log('🏥 Health:', `http://localhost:${PORT}/api/health`);
      console.log('🚗 Véhicules:', `http://localhost:${PORT}/api/vehicules`);
      console.log('👥 Conducteurs:', `http://localhost:${PORT}/api/conducteurs`);
      console.log('📋 Contrôles:', `http://localhost:${PORT}/api/controles`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

startServer(); 
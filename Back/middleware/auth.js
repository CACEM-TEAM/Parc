const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// Middleware d'authentification
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token d\'authentification requis'
      });
    }
    
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Vérifier que l'utilisateur existe toujours
    const [users] = await query(
      'SELECT id, username, email, role FROM users WHERE id = ?',
      [decoded.userId]
    );
    
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }
    
    // Ajouter les informations utilisateur à la requête
    req.user = users[0];
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token invalide'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expiré'
      });
    }
    
    console.error('Erreur d\'authentification:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur d\'authentification'
    });
  }
};

// Middleware pour vérifier les rôles
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentification requise'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Permissions insuffisantes'
      });
    }
    
    next();
  };
};

// Middleware pour admin uniquement
const requireAdmin = requireRole(['admin']);

// Middleware pour utilisateur ou admin
const requireUser = requireRole(['user', 'admin']);

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireUser
}; 
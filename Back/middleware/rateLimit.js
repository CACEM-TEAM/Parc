const rateLimit = require('express-rate-limit');

// Limiteur pour les tentatives de connexion
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives maximum
  message: {
    success: false,
    error: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

// Limiteur général pour l'API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes maximum par IP
  message: {
    success: false,
    error: 'Trop de requêtes. Veuillez réessayer plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Limiteur pour les opérations sensibles
const sensitiveOperationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 10, // 10 opérations maximum
  message: {
    success: false,
    error: 'Trop d\'opérations sensibles. Veuillez réessayer dans 1 heure.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  loginLimiter,
  apiLimiter,
  sensitiveOperationLimiter
}; 
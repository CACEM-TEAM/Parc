const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

const router = express.Router();

// Middleware de validation
const validateUser = (req, res, next) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Tous les champs sont requis'
    });
  }
  
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'Le mot de passe doit contenir au moins 6 caractères'
    });
  }
  
  if (!email.includes('@')) {
    return res.status(400).json({
      success: false,
      error: 'Email invalide'
    });
  }
  
  next();
};

// Route d'inscription
router.post('/register', validateUser, async (req, res) => {
  try {
    const { username, email, password, role = 'user' } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const [existingUsers] = await query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà'
      });
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Créer l'utilisateur
    const [result] = await query(
      'INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())',
      [username, email, hashedPassword, role]
    );
    
    // Générer le token JWT
    const token = jwt.sign(
      { userId: result.insertId, username, email, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      token,
      user: {
        id: result.insertId,
        username,
        email,
        role
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création de l\'utilisateur'
    });
  }
});

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email et mot de passe requis'
      });
    }
    
    // Récupérer l'utilisateur
    const [users] = await query(
      'SELECT id, username, email, password, role FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect'
      });
    }
    
    const user = users[0];
    
    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect'
      });
    }
    
    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la connexion'
    });
  }
});

// Route de vérification du token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token manquant'
      });
    }
    
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
    
    res.json({
      success: true,
      user: users[0]
    });
    
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
    
    console.error('Erreur lors de la vérification du token:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la vérification'
    });
  }
});

module.exports = router; 
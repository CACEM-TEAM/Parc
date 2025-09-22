const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/conducteurs - Récupérer tous les conducteurs
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        c.*
      FROM conducteurs c
      ORDER BY c.nom, c.prenom
    `);

    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des conducteurs:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des conducteurs',
      message: error.message
    });
  }
});

// GET /api/conducteurs/:id - Récupérer un conducteur par ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute(`
      SELECT 
        c.*
      FROM conducteurs c
      WHERE c.id_conducteur = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Conducteur non trouvé'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du conducteur:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du conducteur',
      message: error.message
    });
  }
});

// POST /api/conducteurs - Créer un nouveau conducteur
router.post('/', async (req, res) => {
  try {
    const { 
      nom, 
      prenom, 
      telephone, 
      email,
      permis_conduire,
      date_naissance
    } = req.body;

    // Validation des données
    if (!nom || !prenom) {
      return res.status(400).json({
        success: false,
        error: 'Nom et prénom sont obligatoires'
      });
    }

    // Insérer le nouveau conducteur
    const [result] = await pool.execute(
      'INSERT INTO conducteurs (nom, prenom, telephone, email, permis_conduire, date_naissance) VALUES (?, ?, ?, ?, ?, ?)',
      [nom, prenom, telephone, email, permis_conduire, date_naissance]
    );

    // Récupérer le conducteur créé
    const [newConducteur] = await pool.execute(
      'SELECT * FROM conducteurs WHERE id_conducteur = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Conducteur créé avec succès',
      data: newConducteur[0]
    });
  } catch (error) {
    console.error('Erreur lors de la création du conducteur:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création du conducteur',
      message: error.message
    });
  }
});

// PUT /api/conducteurs/:id - Mettre à jour un conducteur
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nom, 
      prenom, 
      telephone, 
      email,
      permis_conduire,
      date_naissance
    } = req.body;

    // Validation des données
    if (!nom || !prenom) {
      return res.status(400).json({
        success: false,
        error: 'Nom et prénom sont obligatoires'
      });
    }

    // Vérifier si le conducteur existe
    const [existing] = await pool.execute(
      'SELECT id_conducteur FROM conducteurs WHERE id_conducteur = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Conducteur non trouvé'
      });
    }

    // Mettre à jour le conducteur
    await pool.execute(
      'UPDATE conducteurs SET nom = ?, prenom = ?, telephone = ?, email = ?, permis_conduire = ?, date_naissance = ? WHERE id_conducteur = ?',
      [nom, prenom, telephone, email, permis_conduire, date_naissance, id]
    );

    // Récupérer le conducteur mis à jour
    const [updatedConducteur] = await pool.execute(
      'SELECT * FROM conducteurs WHERE id_conducteur = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Conducteur mis à jour avec succès',
      data: updatedConducteur[0]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du conducteur:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour du conducteur',
      message: error.message
    });
  }
});

// DELETE /api/conducteurs/:id - Supprimer un conducteur
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si le conducteur existe
    const [existing] = await pool.execute(
      'SELECT id_conducteur FROM conducteurs WHERE id_conducteur = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Conducteur non trouvé'
      });
    }

    // Supprimer le conducteur
    await pool.execute('DELETE FROM conducteurs WHERE id_conducteur = ?', [id]);

    res.json({
      success: true,
      message: 'Conducteur supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du conducteur:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression du conducteur',
      message: error.message
    });
  }
});

// GET /api/conducteurs/disponibles - Récupérer les conducteurs sans véhicule assigné
router.get('/disponibles/liste', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        c.id_conducteur,
        c.nom,
        c.prenom,
        c.telephone,
        c.email,
        c.permis_conduire,
        c.date_naissance
      FROM conducteurs c
      ORDER BY c.nom, c.prenom
    `);

    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des conducteurs disponibles:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des conducteurs disponibles',
      message: error.message
    });
  }
});

module.exports = router; 
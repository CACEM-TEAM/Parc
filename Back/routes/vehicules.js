const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/vehicules - Récupérer tous les véhicules
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        v.id_vehicule,
        v.immatriculation,
        v.marque,
        v.type,
        v.remisage_domicile,
        (SELECT COUNT(*) FROM controles WHERE vehicule_id = v.id_vehicule) as nb_controles,
        (SELECT MAX(date_controle) FROM controles WHERE vehicule_id = v.id_vehicule) as dernier_controle
      FROM vehicules v
      ORDER BY v.marque, v.type
    `);

    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des véhicules:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des véhicules',
      message: error.message
    });
  }
});

// GET /api/vehicules/search - Rechercher des véhicules
router.get('/search', async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;

    if (!query || query.trim().length < 1) {
      return res.status(400).json({
        success: false,
        error: 'La requête de recherche doit contenir au moins 1 caractère'
      });
    }

    const searchQuery = `%${query.trim()}%`;
    
    const [rows] = await pool.query(`
      SELECT 
        v.*,
        (SELECT COUNT(*) FROM controles WHERE vehicule_id = v.id_vehicule) as nb_controles,
        (SELECT MAX(date_controle) FROM controles WHERE vehicule_id = v.id_vehicule) as dernier_controle
      FROM vehicules v
      WHERE v.immatriculation LIKE ? 
         OR v.marque LIKE ? 
         OR v.type LIKE ?
      ORDER BY v.immatriculation
      LIMIT ?
    `, [searchQuery, searchQuery, searchQuery, parseInt(limit)]);

    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Erreur lors de la recherche de véhicules:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la recherche de véhicules',
      message: error.message
    });
  }
});



// GET /api/vehicules/:id - Récupérer un véhicule par ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute(`
      SELECT 
        v.*
      FROM vehicules v
      WHERE v.id_vehicule = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Véhicule non trouvé'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du véhicule:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du véhicule',
      message: error.message
    });
  }
});

// POST /api/vehicules - Créer un nouveau véhicule
router.post('/', async (req, res) => {
  try {
    const { immatriculation, marque, type, remisage_domicile = false } = req.body;

    // Validation des données
    if (!immatriculation || !marque || !type) {
      return res.status(400).json({
        success: false,
        error: 'Immatriculation, marque et type sont obligatoires'
      });
    }

    // Vérifier si l'immatriculation existe déjà
    const [existing] = await pool.execute(
      'SELECT id_vehicule FROM vehicules WHERE immatriculation = ?',
      [immatriculation]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Un véhicule avec cette immatriculation existe déjà'
      });
    }

    // Insérer le nouveau véhicule
    const [result] = await pool.execute(
      'INSERT INTO vehicules (immatriculation, marque, type, remisage_domicile) VALUES (?, ?, ?, ?)',
      [immatriculation, marque, type, remisage_domicile]
    );

    // Récupérer le véhicule créé
    const [newVehicule] = await pool.execute(
      'SELECT * FROM vehicules WHERE id_vehicule = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Véhicule créé avec succès',
      data: newVehicule[0]
    });
  } catch (error) {
    console.error('Erreur lors de la création du véhicule:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création du véhicule',
      message: error.message
    });
  }
});

// PUT /api/vehicules/:id - Mettre à jour un véhicule
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { immatriculation, marque, type, remisage_domicile } = req.body;

    // Validation des données
    if (!immatriculation || !marque || !type) {
      return res.status(400).json({
        success: false,
        error: 'Immatriculation, marque et type sont obligatoires'
      });
    }

    // Vérifier si le véhicule existe
    const [existing] = await pool.execute(
      'SELECT id_vehicule FROM vehicules WHERE id_vehicule = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Véhicule non trouvé'
      });
    }

    // Vérifier si l'immatriculation existe déjà (sauf pour ce véhicule)
    const [duplicate] = await pool.execute(
      'SELECT id_vehicule FROM vehicules WHERE immatriculation = ? AND id_vehicule != ?',
      [immatriculation, id]
    );

    if (duplicate.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Un véhicule avec cette immatriculation existe déjà'
      });
    }

    // Mettre à jour le véhicule
    await pool.execute(
      'UPDATE vehicules SET immatriculation = ?, marque = ?, type = ?, remisage_domicile = ? WHERE id_vehicule = ?',
      [immatriculation, marque, type, remisage_domicile, id]
    );

    // Récupérer le véhicule mis à jour
    const [updatedVehicule] = await pool.execute(
      'SELECT * FROM vehicules WHERE id_vehicule = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Véhicule mis à jour avec succès',
      data: updatedVehicule[0]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du véhicule:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour du véhicule',
      message: error.message
    });
  }
});

// DELETE /api/vehicules/:id - Supprimer un véhicule
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si le véhicule existe
    const [existing] = await pool.execute(
      'SELECT id_vehicule FROM vehicules WHERE id_vehicule = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Véhicule non trouvé'
      });
    }

    // Supprimer le véhicule (les contrôles seront supprimés automatiquement grâce à CASCADE)
    await pool.execute('DELETE FROM vehicules WHERE id_vehicule = ?', [id]);

    res.json({
      success: true,
      message: 'Véhicule supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du véhicule:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression du véhicule',
      message: error.message
    });
  }
});

// GET /api/vehicules/:id/controles - Récupérer les contrôles d'un véhicule
router.get('/:id/controles', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute(`
      SELECT 
        c.*
      FROM controles c
      WHERE c.vehicule_id = ?
      ORDER BY c.date_controle DESC
    `, [id]);

    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des contrôles:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des contrôles',
      message: error.message
    });
  }
});

module.exports = router; 
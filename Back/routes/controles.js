const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/controles - Récupérer tous les contrôles
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        c.*,
        v.immatriculation,
        v.marque,
        v.type
      FROM controles c
      LEFT JOIN vehicules v ON c.vehicule_id = v.id_vehicule
      ORDER BY c.date_controle DESC
    `);

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

// GET /api/controles/:id - Récupérer un contrôle par ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute(`
      SELECT 
        c.*,
        v.immatriculation,
        v.marque,
        v.type
      FROM controles c
      LEFT JOIN vehicules v ON c.vehicule_id = v.id_vehicule
      WHERE c.id_controle = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Contrôle non trouvé'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du contrôle:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du contrôle',
      message: error.message
    });
  }
});

// POST /api/controles - Créer un nouveau contrôle
router.post('/', async (req, res) => {
  try {
    const {
      vehicule_id,
      nom_controleur,
      etat_salissure,
      // PNEUMATIQUES
      usure_pneus_avd,
      usure_pneus_avg,
      usure_pneus_ard,
      usure_pneus_arg,
      // Enjoliveurs
      presence_enjoliveur_avd,
      presence_enjoliveur_avg,
      presence_enjoliveur_ard,
      presence_enjoliveur_arg,
      // HUILES & LIQUIDES
      huile_moteur,
      liquide_refroidissement,
      lave_glace,
      plaquette_frein_av,
      plaquette_frein_ar,
      disque_frein_av,
      disque_frein_ar,
      // ECLAIRAGE
      feux_position_av,
      feux_position_ar,
      feux_croisement_droite,
      feux_croisement_gauche,
      feux_route_av_droite,
      feux_route_av_gauche,
      clignotant_av,
      clignotant_ar,
      clignotant_lateraux_droite,
      clignotant_lateraux_gauche,
      feux_stop_ar,
      feux_stop_av,
      feux_stop_centrale,
      feux_plaque,
      // EQUIPEMENTS
      balais_essuie_glace,
      plaque_immatriculation,
      antenne,
      repose_tete,
      Tapis_avd,
      Tapis_avg,
      Tapis_ard,
      Tapis_arg,
      extincteur,
      carte_carburant,
      roue_secours,
      cric_manivelle,
      kit_securite,
      TAG,
      Photocopie_carte_grise,
      constat_amiable_vierge,
      rapport_dincident,
      attestation_assurance
    } = req.body;

    // Validation des données obligatoires
    if (!vehicule_id) {
      return res.status(400).json({
        success: false,
        error: 'ID du véhicule est obligatoire'
      });
    }

    if (!nom_controleur || nom_controleur.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Le nom du contrôleur est obligatoire'
      });
    }

    // Validation des valeurs ENUM
    const enumValidations = {
      etat_salissure: ['correcte', 'prévoir lavage'],
      usure_pneus_avd: ['correcte', 'moyenne', 'mauvaise'],
      usure_pneus_avg: ['correcte', 'moyenne', 'mauvaise'],
      usure_pneus_ard: ['correcte', 'moyenne', 'mauvaise'],
      usure_pneus_arg: ['correcte', 'moyenne', 'mauvaise'],
      presence_enjoliveur_avd: ['ok', 'non'],
      presence_enjoliveur_avg: ['ok', 'non'],
      presence_enjoliveur_ard: ['ok', 'non'],
      presence_enjoliveur_arg: ['ok', 'non'],
      huile_moteur: ['correcte', 'mauvais'],
      liquide_refroidissement: ['correcte', 'mauvais'],
      lave_glace: ['correcte', 'mauvais'],
      plaquette_frein_av: ['correcte', 'mauvais'],
      plaquette_frein_ar: ['correcte', 'mauvais'],
      disque_frein_av: ['correcte', 'mauvais'],
      disque_frein_ar: ['correcte', 'mauvais'],
      feux_position_av: ['ok', 'non'],
      feux_position_ar: ['ok', 'non'],
      feux_croisement_droite: ['ok', 'non'],
      feux_croisement_gauche: ['ok', 'non'],
      feux_route_av_droite: ['ok', 'non'],
      feux_route_av_gauche: ['ok', 'non'],
      clignotant_av: ['ok', 'non'],
      clignotant_ar: ['ok', 'non'],
      clignotant_lateraux_droite: ['ok', 'non'],
      clignotant_lateraux_gauche: ['ok', 'non'],
      feux_stop_ar: ['ok', 'non'],
      feux_stop_av: ['ok', 'non'],
      feux_stop_centrale: ['ok', 'non'],
      feux_plaque: ['ok', 'non'],
      balais_essuie_glace: ['correcte', 'à remplacer'],
      plaque_immatriculation: ['correcte', 'à remplacer'],
      antenne: ['correcte', 'à remplacer', 'non concernée'],
      repose_tete: ['correcte', 'à remplacer'],
      Tapis_avd: ['correcte', 'à remplacer', 'absent'],
      Tapis_avg: ['correcte', 'à remplacer', 'absent'],
      Tapis_ard: ['correcte', 'à remplacer', 'absent'],
      Tapis_arg: ['correcte', 'à remplacer', 'absent'],
      extincteur: ['présent', 'absent'],
      carte_carburant: ['présente', 'absente'],
      roue_secours: ['présent', 'absent'],
      cric_manivelle: ['présent', 'absent'],
      kit_securite: ['présent', 'absent'],
      TAG: ['correcte', 'à remplacer'],
      Photocopie_carte_grise: ['présent', 'absent'],
      constat_amiable_vierge: ['présent', 'absent'],
      rapport_dincident: ['présent', 'absent'],
      attestation_assurance: ['présent', 'absent']
    };

    // Nettoyer et valider les données
    const cleanedData = {};
    for (const [field, validValues] of Object.entries(enumValidations)) {
      let value = req.body[field];
      
      // Si la valeur est vide ou null, utiliser la première valeur par défaut
      if (!value || value === '') {
        value = validValues[0];
      }
      
      // Vérifier que la valeur est valide
      if (!validValues.includes(value)) {
        return res.status(400).json({
          success: false,
          error: `Valeur invalide pour ${field}: ${value}. Valeurs autorisées: ${validValues.join(', ')}`
        });
      }
      
      cleanedData[field] = value;
    }

    // Vérifier si le véhicule existe
    const [vehicule] = await pool.execute(
      'SELECT id_vehicule FROM vehicules WHERE id_vehicule = ?',
      [vehicule_id]
    );

    if (vehicule.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Véhicule non trouvé'
      });
    }

    // Insérer le nouveau contrôle avec les données nettoyées
    const [result] = await pool.execute(
      `INSERT INTO controles (
        vehicule_id, nom_controleur, etat_salissure,
        usure_pneus_avd, usure_pneus_avg, usure_pneus_ard, usure_pneus_arg,
        presence_enjoliveur_avd, presence_enjoliveur_avg, presence_enjoliveur_ard, presence_enjoliveur_arg,
        huile_moteur, liquide_refroidissement, lave_glace,
        plaquette_frein_av, plaquette_frein_ar, disque_frein_av, disque_frein_ar,
        feux_position_av, feux_position_ar, feux_croisement_droite, feux_croisement_gauche,
        feux_route_av_droite, feux_route_av_gauche, clignotant_av, clignotant_ar,
        clignotant_lateraux_droite, clignotant_lateraux_gauche, feux_stop_ar, feux_stop_av,
        feux_stop_centrale, feux_plaque, balais_essuie_glace, plaque_immatriculation,
        antenne, repose_tete, Tapis_avd, Tapis_avg, Tapis_ard, Tapis_arg,
        extincteur, carte_carburant, roue_secours, cric_manivelle, kit_securite,
        TAG, Photocopie_carte_grise, constat_amiable_vierge, rapport_dincident, attestation_assurance
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )`,
      [
        vehicule_id, 
        nom_controleur, 
        cleanedData.etat_salissure,
        cleanedData.usure_pneus_avd, 
        cleanedData.usure_pneus_avg, 
        cleanedData.usure_pneus_ard, 
        cleanedData.usure_pneus_arg,
        cleanedData.presence_enjoliveur_avd, 
        cleanedData.presence_enjoliveur_avg, 
        cleanedData.presence_enjoliveur_ard, 
        cleanedData.presence_enjoliveur_arg,
        cleanedData.huile_moteur, 
        cleanedData.liquide_refroidissement, 
        cleanedData.lave_glace,
        cleanedData.plaquette_frein_av, 
        cleanedData.plaquette_frein_ar, 
        cleanedData.disque_frein_av, 
        cleanedData.disque_frein_ar,
        cleanedData.feux_position_av, 
        cleanedData.feux_position_ar, 
        cleanedData.feux_croisement_droite, 
        cleanedData.feux_croisement_gauche,
        cleanedData.feux_route_av_droite, 
        cleanedData.feux_route_av_gauche, 
        cleanedData.clignotant_av, 
        cleanedData.clignotant_ar,
        cleanedData.clignotant_lateraux_droite, 
        cleanedData.clignotant_lateraux_gauche, 
        cleanedData.feux_stop_ar, 
        cleanedData.feux_stop_av,
        cleanedData.feux_stop_centrale, 
        cleanedData.feux_plaque, 
        cleanedData.balais_essuie_glace, 
        cleanedData.plaque_immatriculation,
        cleanedData.antenne, 
        cleanedData.repose_tete, 
        cleanedData.Tapis_avd, 
        cleanedData.Tapis_avg, 
        cleanedData.Tapis_ard, 
        cleanedData.Tapis_arg,
        cleanedData.extincteur, 
        cleanedData.carte_carburant, 
        cleanedData.roue_secours, 
        cleanedData.cric_manivelle, 
        cleanedData.kit_securite,
        cleanedData.TAG, 
        cleanedData.Photocopie_carte_grise, 
        cleanedData.constat_amiable_vierge, 
        cleanedData.rapport_dincident, 
        cleanedData.attestation_assurance
      ]
    );

    // Récupérer le contrôle créé
    const [newControle] = await pool.execute(`
      SELECT 
        c.*,
        v.immatriculation,
        v.marque,
        v.type
      FROM controles c
      LEFT JOIN vehicules v ON c.vehicule_id = v.id_vehicule
      WHERE c.id_controle = ?
    `, [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Contrôle enregistré avec succès',
      data: newControle[0]
    });
  } catch (error) {
    console.error('Erreur lors de la création du contrôle:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création du contrôle',
      message: error.message,
      sql: error.sqlMessage || error.sql || error // Ajout du détail SQL
    });
  }
});

// PUT /api/controles/:id - Mettre à jour un contrôle
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      vehicule_id,
      nom_controleur,
      etat_salissure,
      // PNEUMATIQUES
      usure_pneus_avd,
      usure_pneus_avg,
      usure_pneus_ard,
      usure_pneus_arg,
      // Enjoliveurs
      presence_enjoliveur_avd,
      presence_enjoliveur_avg,
      presence_enjoliveur_ard,
      presence_enjoliveur_arg,
      // HUILES & LIQUIDES
      huile_moteur,
      liquide_refroidissement,
      lave_glace,
      plaquette_frein_av,
      plaquette_frein_ar,
      disque_frein_av,
      disque_frein_ar,
      // ECLAIRAGE
      feux_position_av,
      feux_position_ar,
      feux_croisement_droite,
      feux_croisement_gauche,
      feux_route_av_droite,
      feux_route_av_gauche,
      clignotant_av,
      clignotant_ar,
      clignotant_lateraux_droite,
      clignotant_lateraux_gauche,
      feux_stop_ar,
      feux_stop_av,
      feux_stop_centrale,
      feux_plaque,
      // EQUIPEMENTS
      balais_essuie_glace,
      plaque_immatriculation,
      antenne,
      repose_tete,
      Tapis_avd,
      Tapis_avg,
      Tapis_ard,
      Tapis_arg,
      extincteur,
      carte_carburant,
      roue_secours,
      cric_manivelle,
      kit_securite,
      TAG,
      Photocopie_carte_grise,
      constat_amiable_vierge,
      rapport_dincident,
      attestation_assurance
    } = req.body;

    // Vérifier si le contrôle existe
    const [existing] = await pool.execute(
      'SELECT id_controle FROM controles WHERE id_controle = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Contrôle non trouvé'
      });
    }

    // Vérifier si le véhicule existe
    if (vehicule_id) {
      const [vehicule] = await pool.execute(
        'SELECT id_vehicule FROM vehicules WHERE id_vehicule = ?',
        [vehicule_id]
      );

      if (vehicule.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Véhicule non trouvé'
        });
      }
    }

    // Vérifier si le nom du contrôleur est fourni
    if (!nom_controleur || nom_controleur.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Le nom du contrôleur est obligatoire'
      });
    }

    // Mettre à jour le contrôle
    await pool.execute(`
      UPDATE controles SET 
        vehicule_id = ?, nom_controleur = ?, etat_salissure = ?,
        usure_pneus_avd = ?, usure_pneus_avg = ?, usure_pneus_ard = ?, usure_pneus_arg = ?,
        presence_enjoliveur_avd = ?, presence_enjoliveur_avg = ?, presence_enjoliveur_ard = ?, presence_enjoliveur_arg = ?,
        huile_moteur = ?, liquide_refroidissement = ?, lave_glace = ?,
        plaquette_frein_av = ?, plaquette_frein_ar = ?, disque_frein_av = ?, disque_frein_ar = ?,
        feux_position_av = ?, feux_position_ar = ?, feux_croisement_droite = ?, feux_croisement_gauche = ?,
        feux_route_av_droite = ?, feux_route_av_gauche = ?, clignotant_av = ?, clignotant_ar = ?,
        clignotant_lateraux_droite = ?, clignotant_lateraux_gauche = ?, feux_stop_ar = ?, feux_stop_av = ?,
        feux_stop_centrale = ?, feux_plaque = ?, balais_essuie_glace = ?, plaque_immatriculation = ?,
        antenne = ?, repose_tete = ?, Tapis_avd = ?, Tapis_avg = ?, Tapis_ard = ?, Tapis_arg = ?,
        extincteur = ?, carte_carburant = ?, roue_secours = ?, cric_manivelle = ?, kit_securite = ?,
        TAG = ?, Photocopie_carte_grise = ?, constat_amiable_vierge = ?, rapport_dincident = ?, attestation_assurance = ?
      WHERE id_controle = ?
    `, [
      vehicule_id, nom_controleur.trim(), etat_salissure,
      usure_pneus_avd, usure_pneus_avg, usure_pneus_ard, usure_pneus_arg,
      presence_enjoliveur_avd, presence_enjoliveur_avg, presence_enjoliveur_ard, presence_enjoliveur_arg,
      huile_moteur, liquide_refroidissement, lave_glace,
      plaquette_frein_av, plaquette_frein_ar, disque_frein_av, disque_frein_ar,
      feux_position_av, feux_position_ar, feux_croisement_droite, feux_croisement_gauche,
      feux_route_av_droite, feux_route_av_gauche, clignotant_av, clignotant_ar,
      clignotant_lateraux_droite, clignotant_lateraux_gauche, feux_stop_ar, feux_stop_av,
      feux_stop_centrale, feux_plaque, balais_essuie_glace, plaque_immatriculation,
      antenne, repose_tete, Tapis_avd, Tapis_avg, Tapis_ard, Tapis_arg,
      extincteur, carte_carburant, roue_secours, cric_manivelle, kit_securite,
      TAG, Photocopie_carte_grise, constat_amiable_vierge, rapport_dincident, attestation_assurance,
      id
    ]);

    // Récupérer le contrôle mis à jour
    const [updatedControle] = await pool.execute(`
      SELECT 
        c.*,
        v.immatriculation,
        v.marque,
        v.type
      FROM controles c
      LEFT JOIN vehicules v ON c.vehicule_id = v.id_vehicule
      WHERE c.id_controle = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Contrôle mis à jour avec succès',
      data: updatedControle[0]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du contrôle:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour du contrôle',
      message: error.message
    });
  }
});

// DELETE /api/controles/:id - Supprimer un contrôle
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si le contrôle existe
    const [existing] = await pool.execute(
      'SELECT id_controle FROM controles WHERE id_controle = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Contrôle non trouvé'
      });
    }

    // Supprimer le contrôle
    await pool.execute('DELETE FROM controles WHERE id_controle = ?', [id]);

    res.json({
      success: true,
      message: 'Contrôle supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du contrôle:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression du contrôle',
      message: error.message
    });
  }
});

// GET /api/controles/vehicule/:vehiculeId - Récupérer tous les contrôles d'un véhicule
router.get('/vehicule/:vehiculeId', async (req, res) => {
  try {
    const { vehiculeId } = req.params;
    
    const [rows] = await pool.execute(`
      SELECT 
        c.*
      FROM controles c
      WHERE c.vehicule_id = ?
      ORDER BY c.date_controle DESC
    `, [vehiculeId]);

    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des contrôles du véhicule:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des contrôles du véhicule',
      message: error.message
    });
  }
});

// GET /api/controles/stats - Statistiques des contrôles
router.get('/stats/globales', async (req, res) => {
  try {
    // Statistiques générales
    const [totalControles] = await pool.execute('SELECT COUNT(*) as total FROM controles');
    const [controlesAujourdhui] = await pool.execute('SELECT COUNT(*) as aujourdhui FROM controles WHERE DATE(date_controle) = CURDATE()');
    const [totalVehicules] = await pool.execute('SELECT COUNT(*) as total FROM vehicules');
    const [vehiculesAvecControle] = await pool.execute('SELECT COUNT(DISTINCT vehicule_id) as avec_controle FROM controles');

    // Problèmes les plus fréquents avec plus de détails
    const [problemesFrequents] = await pool.execute(`
      SELECT 
        'Pneus usés' as probleme,
        COUNT(*) as nombre,
        'Sécurité critique - Usure excessive des pneumatiques' as description,
        'Remplacer immédiatement les pneus usés et programmer une rotation' as action
      FROM controles 
      WHERE usure_pneus_avd = 'mauvaise' OR usure_pneus_avg = 'mauvaise' OR usure_pneus_ard = 'mauvaise' OR usure_pneus_arg = 'mauvaise'
      UNION ALL
      SELECT 
        'Freins à vérifier' as probleme,
        COUNT(*) as nombre,
        'Sécurité critique - Système de freinage défaillant' as description,
        'Contrôler et réparer le système de freinage en atelier' as action
      FROM controles 
      WHERE plaquette_frein_av = 'mauvais' OR plaquette_frein_ar = 'mauvais' OR disque_frein_av = 'mauvais' OR disque_frein_ar = 'mauvais'
      UNION ALL
      SELECT 
        'Éclairage défaillant' as probleme,
        COUNT(*) as nombre,
        'Visibilité compromise - Problèmes d''éclairage' as description,
        'Remplacer les ampoules défaillantes et vérifier les connexions' as action
      FROM controles 
      WHERE feux_position_av = 'non' OR feux_position_ar = 'non' OR feux_croisement_droite = 'non' OR feux_croisement_gauche = 'non' OR feux_route_av_droite = 'non' OR feux_route_av_gauche = 'non'
      UNION ALL
      SELECT 
        'Huile moteur' as probleme,
        COUNT(*) as nombre,
        'Maintenance préventive - Niveau d''huile insuffisant' as description,
        'Faire l''appoint d''huile ou effectuer une vidange complète' as action
      FROM controles 
      WHERE huile_moteur = 'mauvais'
      UNION ALL
      SELECT 
        'Liquide refroidissement' as probleme,
        COUNT(*) as nombre,
        'Maintenance préventive - Niveau de liquide bas' as description,
        'Compléter le liquide et vérifier l''absence de fuite' as action
      FROM controles 
      WHERE liquide_refroidissement = 'mauvais'
      UNION ALL
      SELECT 
        'Lave-glace' as probleme,
        COUNT(*) as nombre,
        'Confort de conduite - Réservoir vide' as description,
        'Remplir le réservoir de lave-glace' as action
      FROM controles 
      WHERE lave_glace = 'mauvais'
      UNION ALL
      SELECT 
        'Balais essuie-glace' as probleme,
        COUNT(*) as nombre,
        'Visibilité - Balais usés ou défaillants' as description,
        'Remplacer les balais d''essuie-glace' as action
      FROM controles 
      WHERE balais_essuie_glace = 'à remplacer'
      UNION ALL
      SELECT 
        'Extincteur' as probleme,
        COUNT(*) as nombre,
        'Sécurité - Extincteur manquant ou périmé' as description,
        'Remplacer l''extincteur manquant ou périmé' as action
      FROM controles 
      WHERE extincteur = 'absent'
      UNION ALL
      SELECT 
        'Roue de secours' as probleme,
        COUNT(*) as nombre,
        'Sécurité - Roue de secours manquante' as description,
        'Remplacer la roue de secours manquante' as action
      FROM controles 
      WHERE roue_secours = 'absent'
      UNION ALL
      SELECT 
        'Kit sécurité' as probleme,
        COUNT(*) as nombre,
        'Sécurité - Kit de sécurité incomplet' as description,
        'Compléter le kit de sécurité' as action
      FROM controles 
      WHERE kit_securite = 'absent'
      ORDER BY nombre DESC
      LIMIT 10
    `);

    // Statistiques supplémentaires
    const [vehiculesSansControle] = await pool.execute(`
      SELECT COUNT(*) as sans_controle 
      FROM vehicules v 
      WHERE NOT EXISTS (SELECT 1 FROM controles c WHERE c.vehicule_id = v.id_vehicule)
    `);

    const [controlesRecents] = await pool.execute(`
      SELECT COUNT(*) as recents 
      FROM controles 
      WHERE date_controle >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);

    res.json({
      success: true,
      data: {
        totalControles: totalControles[0].total,
        controlesAujourdhui: controlesAujourdhui[0].aujourdhui,
        totalVehicules: totalVehicules[0].total,
        vehiculesAvecControle: vehiculesAvecControle[0].avec_controle,
        vehiculesSansControle: vehiculesSansControle[0].sans_controle,
        controlesRecents: controlesRecents[0].recents,
        problemesFrequents
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques',
      message: error.message
    });
  }
});

module.exports = router; 
const mysql = require('mysql2/promise');

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'parcauto',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Créer le pool de connexions
const pool = mysql.createPool(dbConfig);

// Fonction pour tester la connexion
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connexion à la base de données MySQL établie');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error.message);
    return false;
  }
}

// Fonction pour initialiser la base de données
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Créer la table vehicules
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS vehicules (
        id_vehicule INT AUTO_INCREMENT PRIMARY KEY,
        immatriculation VARCHAR(20) NOT NULL UNIQUE,
        marque VARCHAR(50) NOT NULL,
        type VARCHAR(50) NOT NULL,
        remisage_domicile BOOLEAN DEFAULT 0
      )
    `);

    // Créer la table conducteurs
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS conducteurs (
        id_conducteur INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(50) NOT NULL,
        prenom VARCHAR(50) NOT NULL,
        telephone VARCHAR(20),
        direction_service VARCHAR(100),
        fonction_service VARCHAR(100),
        vehicule_id INT,
        FOREIGN KEY (vehicule_id) REFERENCES vehicules(id_vehicule) ON DELETE SET NULL
      )
    `);

    // Créer la table controles
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS controles (
        id_controle INT AUTO_INCREMENT PRIMARY KEY,
        vehicule_id INT NOT NULL,
        conducteur_id INT,
        date_controle DATETIME DEFAULT CURRENT_TIMESTAMP,

        etat_salissure ENUM('correcte','prévoir lavage') DEFAULT 'correcte',

        -- PNEUMATIQUES
        usure_pneus_avd ENUM('correcte','moyenne','mauvaise') DEFAULT 'correcte',
        usure_pneus_avg ENUM('correcte','moyenne','mauvaise') DEFAULT 'correcte',
        usure_pneus_ard ENUM('correcte','moyenne','mauvaise') DEFAULT 'correcte',
        usure_pneus_arg ENUM('correcte','moyenne','mauvaise') DEFAULT 'correcte',

        -- Enjoliveurs 
        presence_enjoliveur_avd ENUM('ok','non') DEFAULT 'ok',
        presence_enjoliveur_avg ENUM('ok','non') DEFAULT 'ok',
        presence_enjoliveur_ard ENUM('ok','non') DEFAULT 'ok',
        presence_enjoliveur_arg ENUM('ok','non') DEFAULT 'ok',

        -- HUILES & LIQUIDES
        huile_moteur ENUM('correcte','mauvais') DEFAULT 'correcte',
        liquide_refroidissement ENUM('correcte','mauvais') DEFAULT 'correcte',
        lave_glace ENUM('correcte','mauvais') DEFAULT 'correcte',

        plaquette_frein_av ENUM('correcte','mauvais') DEFAULT 'correcte',
        plaquette_frein_ar ENUM('correcte','mauvais') DEFAULT 'correcte',
        disque_frein_av ENUM('correcte','mauvais') DEFAULT 'correcte',
        disque_frein_ar ENUM('correcte','mauvais') DEFAULT 'correcte',

        -- ECLAIRAGE
        feux_position_av ENUM('ok','non') DEFAULT 'ok',
        feux_position_ar ENUM('ok','non') DEFAULT 'ok',
        feux_croisement_droite ENUM('ok','non') DEFAULT 'ok',
        feux_croisement_gauche ENUM('ok','non') DEFAULT 'ok',
        feux_route_av_droite ENUM('ok','non') DEFAULT 'ok',
        feux_route_av_gauche ENUM('ok','non') DEFAULT 'ok',
        clignotant_av ENUM('ok','non') DEFAULT 'ok',
        clignotant_ar ENUM('ok','non') DEFAULT 'ok',
        clignotant_lateraux_droite ENUM('ok','non') DEFAULT 'ok',
        clignotant_lateraux_gauche ENUM('ok','non') DEFAULT 'ok',
        feux_stop_ar ENUM('ok','non') DEFAULT 'ok',
        feux_stop_av ENUM('ok','non') DEFAULT 'ok',
        feux_stop_centrale ENUM('ok','non') DEFAULT 'ok',
        feux_plaque ENUM('ok','non') DEFAULT 'ok',

        -- EQUIPEMENTS
        balais_essuie_glace ENUM('correcte','à remplacer') DEFAULT 'correcte',
        plaque_immatriculation ENUM('correcte','à remplacer') DEFAULT 'correcte',
        antenne ENUM('correcte','à remplacer','non concernée') DEFAULT 'correcte',
        repose_tete ENUM('correcte','à remplacer') DEFAULT 'correcte',
        Tapis_avd ENUM('correcte','à remplacer','absent') DEFAULT 'correcte',
        Tapis_avg ENUM('correcte','à remplacer','absent') DEFAULT 'correcte',
        Tapis_ard ENUM('correcte','à remplacer','absent') DEFAULT 'correcte',
        Tapis_arg ENUM('correcte','à remplacer','absent') DEFAULT 'correcte',
        extincteur ENUM('présent','absent') DEFAULT 'présent',
        carte_carburant ENUM('présente','absente') DEFAULT 'présente',
        roue_secours ENUM('présent','absent') DEFAULT 'présent',
        cric_manivelle ENUM('présent','absent') DEFAULT 'présent',
        kit_securite ENUM('présent','absent') DEFAULT 'présent',
        TAG ENUM('correcte','à remplacer') DEFAULT 'correcte',
        Photocopie_carte_grise ENUM('présent','absent') DEFAULT 'présent',
        constat_amiable_vierge ENUM('présent','absent') DEFAULT 'présent',
        rapport_dincident ENUM('présent','absent') DEFAULT 'présent',
        attestation_assurance ENUM('présent','absent') DEFAULT 'présent',

        FOREIGN KEY (vehicule_id) REFERENCES vehicules(id_vehicule) ON DELETE CASCADE,
        FOREIGN KEY (conducteur_id) REFERENCES conducteurs(id_conducteur) ON DELETE SET NULL
      )
    `);

    // Insérer quelques véhicules de test si la table est vide
    const [vehicules] = await connection.execute('SELECT COUNT(*) as count FROM vehicules');
    if (vehicules[0].count === 0) {
      await connection.execute(`
        INSERT INTO vehicules (immatriculation, marque, type) VALUES 
        ('AB-123-CD', 'Renault', 'Clio'),
        ('EF-456-GH', 'Peugeot', '208'),
        ('IJ-789-KL', 'Tesla', 'Model 3'),
        ('MN-012-OP', 'Toyota', 'Yaris'),
        ('QR-345-ST', 'Volkswagen', 'Golf')
      `);
      console.log('🚗 Véhicules de test créés');
    }

    // Insérer quelques conducteurs de test si la table est vide
    const [conducteurs] = await connection.execute('SELECT COUNT(*) as count FROM conducteurs');
    if (conducteurs[0].count === 0) {
      await connection.execute(`
        INSERT INTO conducteurs (nom, prenom, telephone, direction_service, fonction_service) VALUES 
        ('Dupont', 'Jean', '0123456789', 'Direction Générale', 'Chef de service'),
        ('Martin', 'Marie', '0987654321', 'Ressources Humaines', 'Responsable RH'),
        ('Durand', 'Pierre', '0555666777', 'Informatique', 'Développeur'),
        ('Leroy', 'Sophie', '0444333222', 'Finance', 'Comptable'),
        ('Moreau', 'Paul', '0333222111', 'Marketing', 'Chargé de communication')
      `);
      console.log('👥 Conducteurs de test créés');
    }

    connection.release();
    console.log('✅ Base de données initialisée avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
  }
}

module.exports = {
  pool,
  testConnection,
  initializeDatabase
}; 
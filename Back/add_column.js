const mysql = require('mysql2/promise');

async function addNomControleurColumn() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'parcauto'
  });

  try {
    console.log('🔄 Ajout de la colonne nom_controleur...');
    
    // Vérifier si la colonne existe
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'parcauto' 
      AND TABLE_NAME = 'controles' 
      AND COLUMN_NAME = 'nom_controleur'
    `);
    
    if (columns.length === 0) {
      // Ajouter la colonne
      await connection.execute(`
        ALTER TABLE controles 
        ADD COLUMN nom_controleur VARCHAR(100) NOT NULL DEFAULT 'Contrôleur par défaut' 
        AFTER conducteur_id
      `);
      console.log('✅ Colonne nom_controleur ajoutée');
    } else {
      console.log('ℹ️ La colonne nom_controleur existe déjà');
    }
    
    // Vérifier la structure
    const [structure] = await connection.execute('DESCRIBE controles');
    console.log('📋 Structure de la table controles:');
    structure.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await connection.end();
  }
}

addNomControleurColumn(); 
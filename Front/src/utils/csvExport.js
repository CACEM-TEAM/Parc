/**
 * Utilitaire pour exporter des données en format CSV
 * @param {Array} data - Tableau d'objets à exporter
 * @param {string} filename - Nom du fichier (sans extension)
 */
export function exportToCSV(data, filename) {
  if (!data || data.length === 0) {
    console.warn('Aucune donnée à exporter')
    return
  }

  try {
    // Obtenir les en-têtes (clés du premier objet)
    const headers = Object.keys(data[0])
    
    // Créer la ligne d'en-tête
    const headerRow = headers.map(header => `"${header}"`).join(',')
    
    // Créer les lignes de données
    const dataRows = data.map(row => {
      return headers.map(header => {
        const value = row[header]
        // Échapper les guillemets et entourer de guillemets si nécessaire
        const escapedValue = String(value).replace(/"/g, '""')
        return `"${escapedValue}"`
      }).join(',')
    })
    
    // Combiner en-tête et données
    const csvContent = [headerRow, ...dataRows].join('\n')
    
    // Créer le blob avec l'encodage UTF-8 BOM pour Excel
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    })
    
    // Créer le lien de téléchargement
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    
    // Ajouter au DOM, cliquer et nettoyer
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Libérer l'URL
    URL.revokeObjectURL(url)
    
    console.log(`Export CSV réussi: ${filename}.csv`)
    
  } catch (error) {
    console.error('Erreur lors de l\'export CSV:', error)
    throw new Error('Erreur lors de l\'export CSV')
  }
}

/**
 * Export spécifique pour les véhicules
 * @param {Array} vehicules - Liste des véhicules
 */
export function exportVehiculesToCSV(vehicules) {
  const exportData = vehicules.map(vehicule => ({
    'Marque': vehicule.marque || '',
    'Type': vehicule.type || '',
    'Immatriculation': vehicule.immatriculation || '',
    'Remisage': vehicule.remisage_domicile ? 'Domicile' : 'Site',
    'Conducteur': vehicule.conducteur_nom ? `${vehicule.conducteur_nom} ${vehicule.conducteur_prenom}` : 'Aucun',
    'Nombre de contrôles': vehicule.nb_controles || 0,
    'Dernier contrôle': vehicule.dernier_controle ? new Date(vehicule.dernier_controle).toLocaleDateString('fr-FR') : 'Aucun'
  }))
  
  const filename = `parcauto_vehicules_${new Date().toISOString().split('T')[0]}`
  exportToCSV(exportData, filename)
}

/**
 * Export spécifique pour les contrôles
 * @param {Array} controles - Liste des contrôles
 */
export function exportControlesToCSV(controles) {
  const exportData = controles.map(controle => ({
    'Date': new Date(controle.date_controle).toLocaleDateString('fr-FR'),
    'Véhicule': controle.immatriculation || '',
    'Marque': controle.marque || '',
    'Type': controle.type || '',
    'Conducteur': controle.conducteur_nom ? `${controle.conducteur_nom} ${controle.conducteur_prenom}` : 'Aucun',
    'État salissure': controle.etat_salissure || '',
    'Pneus AVD': controle.usure_pneus_avd || '',
    'Pneus AVG': controle.usure_pneus_avg || '',
    'Pneus ARD': controle.usure_pneus_ard || '',
    'Pneus ARG': controle.usure_pneus_arg || '',
    'Huile moteur': controle.huile_moteur || '',
    'Liquide refroidissement': controle.liquide_refroidissement || '',
    'Lave-glace': controle.lave_glace || '',
    'Plaquettes AV': controle.plaquette_frein_av || '',
    'Plaquettes AR': controle.plaquette_frein_ar || '',
    'Disques AV': controle.disque_frein_av || '',
    'Disques AR': controle.disque_frein_ar || '',
    'Feux position AV': controle.feux_position_av || '',
    'Feux position AR': controle.feux_position_ar || '',
    'Feux croisement': `${controle.feux_croisement_droite || ''}/${controle.feux_croisement_gauche || ''}`,
    'Clignotants': `${controle.clignotant_av || ''}/${controle.clignotant_ar || ''}`,
    'Feux stop': controle.feux_stop_ar || '',
    'Balais essuie-glace': controle.balais_essuie_glace || '',
    'Extincteur': controle.extincteur || '',
    'Carte carburant': controle.carte_carburant || '',
    'Roue de secours': controle.roue_secours || '',
    'TAG': controle.TAG || '',
    'Carte grise': controle.Photocopie_carte_grise || '',
    'Constat amiable': controle.constat_amiable_vierge || '',
    'Rapport incident': controle.rapport_dincident || '',
    'Attestation assurance': controle.attestation_assurance || ''
  }))
  
  const filename = `parcauto_controles_${new Date().toISOString().split('T')[0]}`
  exportToCSV(exportData, filename)
}

/**
 * Export des statistiques
 * @param {Object} stats - Objet contenant les statistiques
 */
export function exportStatsToCSV(stats) {
  const exportData = [
    {
      'Métrique': 'Total véhicules',
      'Valeur': stats.totalVehicules || 0
    },
    {
      'Métrique': 'Véhicules contrôlés',
      'Valeur': stats.vehiculesAvecControle || 0
    },
    {
      'Métrique': 'Total contrôles',
      'Valeur': stats.totalControles || 0
    },
    {
      'Métrique': 'Contrôles aujourd\'hui',
      'Valeur': stats.controlesAujourdhui || 0
    }
  ]
  
  // Ajouter les problèmes fréquents
  if (stats.problemesFrequents && stats.problemesFrequents.length > 0) {
    stats.problemesFrequents.forEach(probleme => {
      exportData.push({
        'Métrique': `Problème: ${probleme.probleme}`,
        'Valeur': probleme.nombre
      })
    })
  }
  
  const filename = `parcauto_statistiques_${new Date().toISOString().split('T')[0]}`
  exportToCSV(exportData, filename)
} 
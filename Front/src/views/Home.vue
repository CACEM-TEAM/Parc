<template>
  <div class="ios-fade-in">
    <!-- En-tête -->
    <div class="ios-section">
      <h1 class="ios-section-title">Tableau de bord ParcAuto</h1>
      <p class="ios-section-subtitle">Gestion intelligente de votre flotte de véhicules</p>
    </div>

    <!-- Statistiques rapides -->
    <div class="ios-section">
      <div class="ios-grid ios-grid-4">
        <div class="ios-stat-card">
          <div class="ios-stat-icon">
          
          </div>
          <div class="ios-stat-number">{{ stats.totalVehicules || 0 }}</div>
          <div class="ios-stat-label">Véhicules</div>
        </div>
        <div class="ios-stat-card">
          <div class="ios-stat-icon">
          
          </div>
          <div class="ios-stat-number">{{ stats.totalControles || 0 }}</div>
          <div class="ios-stat-label">Contrôles</div>
        </div>
        <div class="ios-stat-card">
          <div class="ios-stat-icon">
     
          </div>
          <div class="ios-stat-number">{{ stats.controlesAujourdhui || 0 }}</div>
          <div class="ios-stat-label">Aujourd'hui</div>
        </div>
        <div class="ios-stat-card">
          <div class="ios-stat-icon">
   
          </div>
          <div class="ios-stat-number">{{ stats.vehiculesAvecControle || 0 }}</div>
          <div class="ios-stat-label">Contrôlés</div>
        </div>
      </div>
    </div>

    <!-- Actions rapides -->
    <div class="ios-section">
      <h2 class="ios-section-title">Actions rapides</h2>
      <div class="ios-grid ios-grid-2">
        <div class="ios-card">
          <h3 class="ios-mb-md">
            <ClipboardList class="action-icon" />
            Effectuer un contrôle
          </h3>
          <p class="ios-mb-lg">Enregistrer un nouveau contrôle de véhicule avec tous les points de vérification.</p>
          <router-link to="/controle" class="ios-button">
            Commencer un contrôle
          </router-link>
        </div>
        <div class="ios-card">
          <h3 class="ios-mb-md">
            <BarChart3 class="action-icon" />
            Consulter le dashboard
          </h3>
          <p class="ios-mb-lg">Voir l'état du parc et les statistiques détaillées des contrôles.</p>
          <router-link to="/dashboard" class="ios-button secondary">
            Voir le dashboard
          </router-link>
        </div>
      </div>
    </div>

    <!-- Problèmes détectés -->
    <div v-if="stats.problemesFrequents && getProblemesAvecVehicules().length > 0" class="ios-section">
      <h2 class="ios-section-title">  
        Problèmes détectés
      </h2>
      <div class="ios-card">
        <div class="ios-grid ios-grid-1">
          <div v-for="probleme in getProblemesAvecVehicules()" :key="probleme.probleme" class="probleme-item">
            <div class="probleme-header">
              <div class="probleme-icon">
                <component :is="getProblemeIcon(probleme.probleme)" class="probleme-icon-svg" />
              </div>
              <div class="probleme-info">
                <h4 class="probleme-title">{{ probleme.probleme }}</h4>
                <p class="probleme-description">{{ getProblemeDescription(probleme.probleme) }}</p>
              </div>
              <div class="probleme-stats">
                <div class="probleme-count">{{ probleme.nombre }}</div>
                <div class="probleme-label">véhicules affectés</div>
                <div class="probleme-percentage">
                  {{ getPercentage(probleme.nombre) }}% du parc
                </div>
                <div class="probleme-priority" :class="getPriorityClass(probleme.nombre)">
                  {{ getPriorityLabel(probleme.nombre) }}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Aucun problème détecté -->
    <div v-else-if="stats.totalControles > 0 && (!stats.problemesFrequents || getProblemesAvecVehicules().length === 0)" class="ios-section">
      <div class="ios-card ios-card-success">
        <div class="d-flex align-items-center">
          <div class="success-icon">
            <CheckCircle class="success-icon-svg" />
          </div>
          <div class="success-content">
            <h3 class="success-title">Aucun problème majeur détecté</h3>
            <p class="success-description">
              Tous les véhicules contrôlés sont en bon état. Continuez à effectuer des contrôles réguliers pour maintenir la qualité de votre flotte.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- État de l'API -->
    <div class="ios-section">
      <div class="ios-card ios-card-compact">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h3 class="ios-mb-sm">
              <Activity class="status-icon" />
              État du système
            </h3>
            <p class="ios-mb-0" :class="apiStatus.color">
              {{ apiStatus.message }}
            </p>
          </div>
          <div class="ios-badge" :class="apiStatus.badgeClass">
            {{ apiStatus.status }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { controlesService, healthService } from '../services/api'
import { Car, ClipboardList, Calendar, CheckCircle, BarChart3, AlertTriangle, Activity, Eye, Wrench, Zap, Droplets, Gauge } from 'lucide-vue-next'

export default {
  name: 'Home',
  components: {
    Car,
    ClipboardList,
    Calendar,
    CheckCircle,
    BarChart3,
    AlertTriangle,
    Activity,
    Eye,
    Wrench,
    Zap,
    Droplets,
    Gauge
  },
  data() {
    return {
      stats: {},
      apiStatus: {
        status: 'Vérification...',
        message: 'Connexion en cours...',
        color: 'text-tertiary',
        badgeClass: 'info'
      }
    }
  },
  async mounted() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      try {
        // Charger les statistiques
        const statsResponse = await controlesService.getStats()
        if (statsResponse.success) {
          this.stats = statsResponse.data
        }

        // Vérifier l'état de l'API
        const healthResponse = await healthService.check()
        if (healthResponse.success) {
          this.apiStatus = {
            status: 'Opérationnel',
            message: 'Tous les services fonctionnent correctement',
            color: 'text-success',
            badgeClass: 'success'
          }
        } else {
          this.apiStatus = {
            status: 'Problème',
            message: 'Certains services ne répondent pas',
            color: 'text-warning',
            badgeClass: 'warning'
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        this.apiStatus = {
          status: 'Erreur',
          message: 'Impossible de se connecter au serveur',
          color: 'text-danger',
          badgeClass: 'danger'
        }
      }
    },

    getProblemeIcon(probleme) {
      const icons = {
        'Pneus usés': Wrench,
        'Freins à vérifier': Zap,
        'Éclairage défaillant': Zap,
        'Huile moteur': Droplets,
        'Liquide refroidissement': Droplets,
        'Lave-glace': Droplets,
        'Plaquettes de frein': Wrench,
        'Disques de frein': Wrench,
        'Balais essuie-glace': Wrench,
        'Plaque immatriculation': Wrench,
        'Antenne': Wrench,
        'Repose-tête': Wrench,
        'Tapis': Wrench,
        'Extincteur': Wrench,
        'Carte carburant': Wrench,
        'Roue de secours': Wrench,
        'Cric manivelle': Wrench,
        'Kit sécurité': Wrench,
        'TAG': Wrench,
        'Photocopie carte grise': Wrench,
        'Constat amiable': Wrench,
        'Rapport d\'incident': Wrench,
        'Attestation assurance': Wrench
      }
      return icons[probleme] || AlertTriangle
    },

    getProblemeDescription(probleme) {
      // Utiliser la description de l'API si disponible
      if (this.stats.problemesFrequents) {
        const problemeData = this.stats.problemesFrequents.find(p => p.probleme === probleme)
        if (problemeData && problemeData.description) {
          return problemeData.description
        }
      }
      
      // Fallback vers les descriptions statiques
      const descriptions = {
        'Pneus usés': 'Sécurité critique - Usure excessive des pneumatiques nécessitant un remplacement urgent.',
        'Freins à vérifier': 'Sécurité critique - Système de freinage défaillant nécessitant une intervention immédiate.',
        'Éclairage défaillant': 'Visibilité compromise - Problèmes d\'éclairage compromettant la sécurité.',
        'Huile moteur': 'Maintenance préventive - Niveau ou qualité d\'huile moteur insuffisant.',
        'Liquide refroidissement': 'Maintenance préventive - Niveau de liquide de refroidissement bas ou fuite détectée.',
        'Lave-glace': 'Confort de conduite - Réservoir de lave-glace vide ou système défaillant.',
        'Balais essuie-glace': 'Visibilité - Balais d\'essuie-glace usés ou défaillants.',
        'Extincteur': 'Sécurité - Extincteur manquant ou périmé.',
        'Roue de secours': 'Sécurité - Roue de secours manquante ou défaillante.',
        'Kit sécurité': 'Sécurité - Kit de sécurité incomplet ou manquant.'
      }
      return descriptions[probleme] || 'Problème détecté nécessitant une attention particulière.'
    },



    getPercentage(nombre) {
      if (this.stats.totalVehicules > 0) {
        return ((nombre / this.stats.totalVehicules) * 100).toFixed(1)
      }
      return 0
    },

    getPriorityClass(nombre) {
      if (nombre >= 5) return 'priority-high'
      if (nombre >= 3) return 'priority-medium'
      return 'priority-low'
    },

    getPriorityLabel(nombre) {
      if (nombre >= 5) return 'URGENT'
      if (nombre >= 3) return 'ÉLEVÉE'
      return 'ATTENTION'
    },





    getProblemesAvecVehicules() {
      if (!this.stats.problemesFrequents) {
        return []
      }
      return this.stats.problemesFrequents.filter(probleme => probleme.nombre > 0)
    }
  }
}
</script>

<style scoped>
/* Styles pour la lisibilité avec le nouveau dégradé */
.text-success {
  color: #34C759 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8) !important;
}

.text-warning {
  color: #FF9500 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8) !important;
}

.text-danger {
  color: #FF3B30 !important;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8) !important;
}

.text-tertiary {
  color: #666666 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8) !important;
}

/* Icônes */
.title-icon {
  width: 32px !important;
  height: 32px !important;
  margin-right: 12px !important;
  color: #ffffff !important;
  vertical-align: middle !important;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8)) !important;
}

.stat-icon {
  width: 24px !important;
  height: 24px !important;
  color: #ffffff !important;
  margin-bottom: 8px !important;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8)) !important;
}

.action-icon {
  width: 20px !important;
  height: 20px !important;
  margin-right: 8px !important;
  color: #ffffff !important;
  vertical-align: middle !important;
}

.button-icon {
  width: 16px !important;
  height: 16px !important;
  margin-right: 6px !important;
  color: white !important;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3)) !important;
}

.status-icon {
  width: 18px !important;
  height: 18px !important;
  margin-right: 8px !important;
  color: #000000 !important;
  vertical-align: middle !important;
  filter: drop-shadow(0 1px 2px rgba(255, 255, 255, 0.8)) !important;
}

/* Styles pour les problèmes détectés */
.probleme-item {
  background: rgba(255, 255, 255, 0.05) !important;
  border-radius: 12px !important;
  padding: 20px !important;
  margin-bottom: 16px !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative !important;
  overflow: hidden !important;
}

.probleme-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 149, 0, 0.1), transparent);
  transition: left 0.8s ease;
  z-index: 0;
}

.probleme-item:hover::before {
  left: 100%;
}

.probleme-item:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  transform: translateY(-3px) scale(1.02) !important;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3) !important;
  border-color: rgba(255, 149, 0, 0.3) !important;
}

.probleme-header {
  display: flex !important;
  align-items: center !important;
  margin-bottom: 16px !important;
  position: relative !important;
  z-index: 1 !important;
}

.probleme-icon {
  width: 48px !important;
  height: 48px !important;
  background: rgba(255, 149, 0, 0.2) !important;
  border-radius: 12px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin-right: 16px !important;
  flex-shrink: 0 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.probleme-item:hover .probleme-icon {
  background: rgba(255, 149, 0, 0.3) !important;
  transform: scale(1.1) rotate(5deg) !important;
  box-shadow: 0 4px 15px rgba(255, 149, 0, 0.4) !important;
}

.probleme-icon-svg {
  width: 24px !important;
  height: 24px !important;
  color: #FF9500 !important;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3)) !important;
  transition: all 0.3s ease !important;
}

.probleme-item:hover .probleme-icon-svg {
  transform: scale(1.2) !important;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5)) !important;
}

.probleme-info {
  flex: 1 !important;
  position: relative !important;
  z-index: 1 !important;
}

.probleme-title {
  font-size: 18px !important;
  font-weight: 600 !important;
  color: #FFFFFF !important;
  margin-bottom: 4px !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
  transition: all 0.3s ease !important;
}

.probleme-item:hover .probleme-title {
  color: #FF9500 !important;
  transform: translateX(5px) !important;
}

.probleme-description {
  font-size: 14px !important;
  color: #E0E0E0 !important;
  line-height: 1.4 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
  transition: all 0.3s ease !important;
}

.probleme-item:hover .probleme-description {
  color: #FFFFFF !important;
  transform: translateX(5px) !important;
}

/* Carte de succès */
.ios-card-success {
  background: rgba(52, 199, 89, 0.1) !important;
  border: 1px solid rgba(52, 199, 89, 0.3) !important;
  border-radius: 12px !important;
  padding: 24px !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative !important;
  overflow: hidden !important;
}

.ios-card-success::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(52, 199, 89, 0.1), transparent);
  transition: left 1s ease;
  z-index: 0;
}

.ios-card-success:hover::before {
  left: 100%;
}

.ios-card-success:hover {
  transform: translateY(-2px) scale(1.01) !important;
  box-shadow: 0 12px 40px rgba(52, 199, 89, 0.2) !important;
  border-color: rgba(52, 199, 89, 0.5) !important;
}

.success-icon {
  width: 64px !important;
  height: 64px !important;
  background: rgba(52, 199, 89, 0.2) !important;
  border-radius: 16px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin-right: 20px !important;
  flex-shrink: 0 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative !important;
  z-index: 1 !important;
}

.ios-card-success:hover .success-icon {
  background: rgba(52, 199, 89, 0.3) !important;
  transform: scale(1.1) rotate(-5deg) !important;
  box-shadow: 0 6px 20px rgba(52, 199, 89, 0.4) !important;
}

.success-icon-svg {
  width: 32px !important;
  height: 32px !important;
  color: #34C759 !important;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3)) !important;
  transition: all 0.3s ease !important;
}

.ios-card-success:hover .success-icon-svg {
  transform: scale(1.2) !important;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5)) !important;
}

.success-content {
  flex: 1 !important;
  position: relative !important;
  z-index: 1 !important;
}

.success-title {
  font-size: 20px !important;
  font-weight: 600 !important;
  color: #34C759 !important;
  margin-bottom: 8px !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
  transition: all 0.3s ease !important;
}

.ios-card-success:hover .success-title {
  transform: translateX(5px) !important;
}

.success-description {
  font-size: 16px !important;
  color: #E0E0E0 !important;
  line-height: 1.5 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
  margin: 0 !important;
  transition: all 0.3s ease !important;
}

.ios-card-success:hover .success-description {
  color: #FFFFFF !important;
  transform: translateX(5px) !important;
}

.probleme-stats {
  text-align: center !important;
  margin-left: 16px !important;
  flex-shrink: 0 !important;
  position: relative !important;
  z-index: 1 !important;
  transition: all 0.3s ease !important;
}

.probleme-item:hover .probleme-stats {
  transform: scale(1.05) !important;
}

.probleme-count {
  font-size: 32px !important;
  font-weight: 700 !important;
  color: #FF9500 !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5) !important;
  transition: all 0.3s ease !important;
}

.probleme-item:hover .probleme-count {
  color: #FFB366 !important;
  transform: scale(1.1) !important;
}

.probleme-label {
  font-size: 14px !important;
  color: #ffffff !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  margin-bottom: 4px !important;
  transition: all 0.3s ease !important;
}

.probleme-item:hover .probleme-label {
  color: #FF9500 !important;
}

.probleme-percentage {
  font-size: 12px !important;
  color: #ffffff !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  margin-bottom: 4px !important;
  transition: all 0.3s ease !important;
}

.probleme-item:hover .probleme-percentage {
  color: #FFB366 !important;
}

.probleme-priority {
  display: inline-block !important;
  padding: 4px 8px !important;
  border-radius: 6px !important;
  font-size: 10px !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  transition: all 0.3s ease !important;
}

.probleme-item:hover .probleme-priority {
  transform: scale(1.1) !important;
}

.priority-high {
  background: rgba(255, 59, 48, 0.2) !important;
  color: #FF3B30 !important;
  border: 1px solid rgba(255, 59, 48, 0.3) !important;
}

.priority-medium {
  background: rgba(255, 149, 0, 0.2) !important;
  color: #FF9500 !important;
  border: 1px solid rgba(255, 149, 0, 0.3) !important;
}

.priority-low {
  background: rgba(255, 149, 0, 0.2) !important;
  color: #FF9500 !important;
  border: 1px solid rgba(255, 149, 0, 0.3) !important;
}

/* Amélioration des cartes de statistiques */
.ios-stat-card {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border-radius: 12px !important;
  padding: 24px !important;
  text-align: center !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative !important;
  overflow: hidden !important;
}

.ios-stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(68, 160, 141, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
}

.ios-stat-card:hover::before {
  opacity: 1;
}

.ios-stat-card:hover {
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.2) !important;
  transform: translateY(-4px) scale(1.02) !important;
  border-color: rgba(68, 160, 141, 0.4) !important;
}

.ios-stat-icon {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  position: relative !important;
  z-index: 1 !important;
  transition: all 0.3s ease !important;
}

.ios-stat-card:hover .ios-stat-icon {
  transform: scale(1.1) rotate(5deg) !important;
}

.ios-stat-number {
  font-size: 41px !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8) !important;
  position: relative !important;
  z-index: 1 !important;
  transition: all 0.3s ease !important;
}

.ios-stat-card:hover .ios-stat-number {
  transform: scale(1.05) !important;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.9) !important;
}

.ios-stat-label {
  font-size: 28px !important;
  color: #ffffff !important;
  font-weight: 500 !important;
  text-shadow: 0 1px 2px rgba(23, 23, 23, 0.625) !important;
  position: relative !important;
  z-index: 1 !important;
  transition: all 0.3s ease !important;
}

.ios-stat-card:hover .ios-stat-label {
  transform: scale(1.05) !important;
  color: #E0E0E0 !important;
}

/* Badges améliorés */
.ios-badge {
  display: inline-block !important;
  padding: 4px 8px !important;
  border-radius: 12px !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
  transition: all 0.3s ease !important;
}

.ios-badge:hover {
  transform: scale(1.05) !important;
}

.ios-badge.warning {
  background: rgba(255, 149, 0, 0.1) !important;
  color: #000000 !important;
  border: 1px solid rgba(255, 149, 0, 0.3) !important;
}

.ios-badge.success {
  background: rgba(52, 199, 89, 0.1) !important;
  color: #000000 !important;
  border: 1px solid rgba(52, 199, 89, 0.3) !important;
}

.ios-badge.info {
  background: rgba(90, 200, 250, 0.1) !important;
  color: #000000 !important;
  border: 1px solid rgba(90, 200, 250, 0.3) !important;
}

.ios-badge.danger {
  background: rgba(255, 59, 48, 0.1) !important;
  color: #000000 !important;
  border: 1px solid rgba(255, 59, 48, 0.3) !important;
}

/* Utilitaires */
.ios-mb-0 {
  margin-bottom: 0 !important;
}

.ios-mb-sm {
  margin-bottom: 8px !important;
}

.ios-mb-md {
  margin-bottom: 16px !important;
}

.ios-mb-lg {
  margin-bottom: 24px !important;
}

.d-flex {
  display: flex !important;
}

.align-items-center {
  align-items: center !important;
}

.justify-content-between {
  justify-content: space-between !important;
}

/* Responsive */
@media (max-width: 768px) {
  .probleme-header {
    flex-direction: column !important;
    text-align: center !important;
  }
  
  .probleme-icon {
    margin-right: 0 !important;
    margin-bottom: 12px !important;
  }
  
  .probleme-stats {
    margin-left: 0 !important;
    margin-top: 12px !important;
  }
  
  .probleme-actions {
    flex-direction: column !important;
    gap: 12px !important;
  }
  
  .probleme-recommendation {
    text-align: center !important;
  }
}
</style> 
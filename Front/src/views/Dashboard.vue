<template>
  <div class="ios-fade-in">
    <!-- En-tête -->
    <div class="ios-section">
      <div class="d-flex justify-content-between align-items-center" style="margin-bottom: 5%!important;">
        <div>
          <p class="ios-section-subtitle">Vue d'ensemble et gestion des véhicules</p>
        </div>
        <div>
          <button 
            class="ios-button success me-2"
            @click="addVehicle"
          >
            <Plus class="button-icon" />
            Ajouter véhicule
          </button>
          <button 
            class="ios-button success"
            @click="exportToCSV"
            :disabled="exporting"
          >
            <Download class="button-icon" />
            {{ exporting ? 'Export...' : 'Exporter CSV' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Statistiques -->
    <div class="ios-section">
      <div class="ios-grid ios-grid-4">
        <div class="ios-stat-card">
          <div class="ios-stat-icon">
      
          </div>
          <div class="ios-stat-number">{{ stats.totalVehicules || 0 }}</div>
          <div class="ios-stat-label">Total véhicules</div>
          <Car class="stat-icon" />
        </div>
        <div class="ios-stat-card">
          <div class="ios-stat-icon">
           
          </div>
          <div class="ios-stat-number">{{ stats.vehiculesAvecControle || 0 }}</div>
          <div class="ios-stat-label">Contrôlés</div>
          <CheckCircle class="stat-icon" />
        </div>
        <div class="ios-stat-card">
          <div class="ios-stat-icon">
            
          </div>
          <div class="ios-stat-number">{{ stats.totalControles || 0 }}</div>
          <div class="ios-stat-label">Total contrôles</div>
          <ClipboardList class="stat-icon" />
        </div>
        <div class="ios-stat-card">
          <div class="ios-stat-icon">
          </div>
          <div class="ios-stat-number">{{ stats.controlesAujourdhui || 0 }}</div>
          <div class="ios-stat-label">Aujourd'hui</div>
          <Calendar class="stat-icon" />
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="ios-section">
      <div class="ios-card">

        
        <div class="ios-grid ios-grid-4">
          <div class="ios-form-group">
            <div class="input-with-icon">
              <Search class="input-icon" />
              <input 
                v-model="searchQuery" 
                type="text"
                placeholder="Rechercher un véhicule..."
                class="ios-form-input"
              />
            </div>
          </div>
          <div class="ios-form-group">
            <div class="input-with-icon">
              <Filter class="input-icon" />
              <select v-model="statusFilter" class="ios-form-select">
                <option value="">Tous les véhicules</option>
                <option value="controles_aujourdhui">Contrôlés aujourd'hui</option>
                <option value="controles_semaine">Contrôlés cette semaine</option>
                <option value="controles_mois">Contrôlés ce mois</option>
                <option value="controles_3mois">Contrôlés 3 derniers mois</option>
                <option value="controles_6mois">Contrôlés 6 derniers mois</option>
                <option value="controles_annee">Contrôlés cette année</option>
                <option value="sans_controle">Sans contrôle</option>
                <option value="controle_ancien">Contrôle ancien (> 6 mois)</option>
              </select>
            </div>
          </div>
          <div class="ios-form-group">
            <div class="input-with-icon">
              <Tag class="input-icon" />
              <select v-model="marqueFilter" class="ios-form-select">
                <option value="">Toutes les marques</option>
                <option v-for="marque in marques" :key="marque" :value="marque">
                  {{ marque }}
                </option>
              </select>
            </div>
          </div>
          <div class="ios-form-group">
            <button @click="resetFilters" class="ios-button secondary">
              <RotateCcw class="button-icon" />
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste des véhicules -->
    <div class="ios-section">
      <div class="ios-card">
        <div class="d-flex justify-content-between align-items-center ios-mb-lg">
          <h2 class="ios-section-title ios-mb-0">
            <Car class="title-icon" />
            Liste des véhicules
          </h2>
          <div class="ios-badge info">
            {{ filteredVehicules.length }} véhicule(s)
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="ios-loading">
          <div class="ios-spinner"></div>
        </div>

        <!-- Tableau -->
        <div v-else>
          <div class="table-responsive">
            <table class="ios-table">
              <thead>
                <tr>
                  <th>Véhicule</th>
                  <th>Immatriculation</th>
                  <th>Type</th>
                  <th>Conducteur</th>
                  <th>Contrôles</th>
                  <th>Dernier contrôle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="vehicule in paginatedVehicules" :key="vehicule.id_vehicule">
                  <td>
                    <div>
                      <div class="fw-bold">{{ vehicule.marque }} {{ vehicule.type }}</div>
                      <div class="text-tertiary">{{ vehicule.remisage_domicile ? 'Remisage domicile' : 'Remisage site' }}</div>
                    </div>
                  </td>
                  <td>
                    <div class="ios-badge primary">{{ vehicule.immatriculation }}</div>
                  </td>
                  <td>{{ vehicule.type }}</td>
                  <td>
                    <div v-if="vehicule.conducteur_nom">
                      {{ vehicule.conducteur_nom }} {{ vehicule.conducteur_prenom }}
                    </div>
                    <div v-else class="text-tertiary">Aucun conducteur</div>
                  </td>
                  <td>
                    <div class="ios-badge info">{{ vehicule.nb_controles || 0 }}</div>
                  </td>
                  <td>
                    <div v-if="vehicule.dernier_controle">
                      {{ formatDate(vehicule.dernier_controle) }}
                    </div>
                    <div v-else class="text-tertiary">Aucun contrôle</div>
                  </td>
                  <td>
                    <div class="d-flex gap-2">
                      <button 
                        class="ios-button ios-button-small"
                        @click="viewVehicule(vehicule.id_vehicule)"
                      >
                        <Eye class="button-icon" />
                        Voir
                      </button>
                      <button 
                        class="ios-button ios-button-small secondary"
                        @click="editVehicule(vehicule.id_vehicule)"
                      >
                        <Edit class="button-icon" />
                        Modifier
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="d-flex justify-content-between align-items-center ios-mt-lg">
            <div>
              Affichage {{ startIndex + 1 }}-{{ endIndex }} sur {{ filteredVehicules.length }} véhicules
            </div>
            <div class="d-flex gap-2">
              <button 
                class="ios-button ios-button-small secondary"
                @click="previousPage"
                :disabled="currentPage === 1"
              >
                <ChevronLeft class="button-icon" />
                Précédent
              </button>
              <span class="d-flex align-items-center ios-p-sm">
                Page {{ currentPage }} sur {{ totalPages }}
              </span>
              <button 
                class="ios-button ios-button-small secondary"
                @click="nextPage"
                :disabled="currentPage === totalPages"
              >
                Suivant
                <ChevronRight class="button-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { vehiculesService, controlesService } from '../services/api'
import { exportToCSV } from '../utils/csvExport.js'
import { 
  Car, CheckCircle, ClipboardList, Calendar, Download, Search, Filter, Tag, 
  RotateCcw, Eye, Edit, ChevronLeft, ChevronRight, Plus 
} from 'lucide-vue-next'

export default {
  name: 'Dashboard',
  components: {
    Car,
    CheckCircle,
    ClipboardList,
    Calendar,
    Download,
    Search,
    Filter,
    Tag,
    RotateCcw,
    Eye,
    Edit,
    ChevronLeft,
    ChevronRight,
    Plus
  },
  data() {
    return {
      loading: true,
      exporting: false,
      vehicules: [],
      stats: {},
      searchQuery: '',
      statusFilter: '',
      marqueFilter: '',
      currentPage: 1,
      pageSize: 10
    }
  },
  computed: {
    filteredVehicules() {
      let filtered = this.vehicules

      // Filtre par recherche
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(vehicule => 
          vehicule.marque.toLowerCase().includes(query) ||
          vehicule.type.toLowerCase().includes(query) ||
          vehicule.immatriculation.toLowerCase().includes(query)
        )
      }

      // Filtre par marque
      if (this.marqueFilter) {
        filtered = filtered.filter(vehicule => vehicule.marque === this.marqueFilter)
      }

      // Filtre par période de contrôle
      if (this.statusFilter) {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfYear = new Date(now.getFullYear(), 0, 1)
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())

        filtered = filtered.filter(vehicule => {
          if (!vehicule.dernier_controle) {
            return this.statusFilter === 'sans_controle'
          }

          const controleDate = new Date(vehicule.dernier_controle)

          switch (this.statusFilter) {
            case 'controles_aujourdhui':
              return controleDate >= today
            case 'controles_semaine':
              return controleDate >= startOfWeek
            case 'controles_mois':
              return controleDate >= startOfMonth
            case 'controles_3mois':
              return controleDate >= threeMonthsAgo
            case 'controles_6mois':
              return controleDate >= sixMonthsAgo
            case 'controles_annee':
              return controleDate >= startOfYear
            case 'controle_ancien':
              return controleDate < sixMonthsAgo
            case 'sans_controle':
              return false // Déjà géré plus haut
            default:
              return true
          }
        })
      }

      return filtered
    },
    paginatedVehicules() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredVehicules.slice(start, end)
    },
    startIndex() {
      return (this.currentPage - 1) * this.pageSize
    },
    endIndex() {
      return Math.min(this.startIndex + this.pageSize, this.filteredVehicules.length)
    },
    totalPages() {
      return Math.ceil(this.filteredVehicules.length / this.pageSize)
    },
    marques() {
      return [...new Set(this.vehicules.map(v => v.marque))].sort()
    }
  },
  async mounted() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      try {
        this.loading = true
        
        // Charger tous les véhicules
        const vehiculesResponse = await vehiculesService.getAll()
        if (vehiculesResponse.success) {
          this.vehicules = vehiculesResponse.data
        }

        // Charger les statistiques
        const statsResponse = await controlesService.getStats()
        if (statsResponse.success) {
          this.stats = statsResponse.data
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        this.$message.error('Erreur lors du chargement des données')
      } finally {
        this.loading = false
      }
    },

    formatDate(dateString) {
      if (!dateString) return 'Aucune date'
      return new Date(dateString).toLocaleDateString('fr-FR')
    },

    resetFilters() {
      this.searchQuery = ''
      this.statusFilter = ''
      this.marqueFilter = ''
      this.currentPage = 1
    },

    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },

    viewVehicule(id) {
      this.$router.push(`/vehicle/${id}`)
    },

    editVehicule(id) {
      this.$router.push(`/vehicle/edit/${id}`)
    },

    addVehicle() {
      this.$router.push('/vehicle/add')
    },

    async exportToCSV() {
      try {
        this.exporting = true

        // Préparer les données pour l'export
        const exportData = this.vehicules.map(vehicule => ({
          'Marque': vehicule.marque,
          'Type': vehicule.type,
          'Immatriculation': vehicule.immatriculation,
          'Remisage': vehicule.remisage_domicile ? 'Domicile' : 'Site',
          'Conducteur': vehicule.conducteur_nom ? `${vehicule.conducteur_nom} ${vehicule.conducteur_prenom}` : 'Aucun',
          'Nombre de contrôles': vehicule.nb_controles || 0,
          'Dernier contrôle': vehicule.dernier_controle ? this.formatDate(vehicule.dernier_controle) : 'Aucun'
        }))

        // Exporter en CSV
        exportToCSV(exportData, `parcauto_vehicules_${new Date().toISOString().split('T')[0]}`)

        this.$message.success('Export CSV réussi !')
      } catch (error) {
        console.error('Erreur lors de l\'export:', error)
        this.$message.error('Erreur lors de l\'export CSV')
      } finally {
        this.exporting = false
      }
    }
  }
}
</script>

<style scoped>
.ios-button {
    background: #1e534d !important;
    color: white !important;
}
/* Styles pour la lisibilité avec le nouveau dégradé */
.fw-bold {
  font-weight: 600 !important;
}
.text-tertiary {
  color: #666666 !important;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8) !important;
}
/* Icônes */
.title-icon {
  width: 24px !important;
  height: 24px !important;
  margin-right: 8px !important;
  color: #000000 !important;
  vertical-align: middle !important;
}
.stat-icon {
  width: 20px !important;
  height: 20px !important;
  color: #ffffff !important;
 
}

.button-icon {
  width: 16px !important;
  height: 16px !important;
  margin-right: 6px !important;
  color: white !important;
}

/* Icône spécifique pour les boutons avec fond clair */
.ios-button .button-icon {
  color: white !important;
}

.ios-form-select{
  color: #ffffff !important;
}


.ios-button.secondary{
  background: #2c7166 !important;
  border: 2px solid #2e8b5a !important;
}

.ios-button.secondary .button-icon {
  color: #ffffff !important;
}

.input-icon {
  width: 18px !important;
  height: 18px !important;
  color: #ffffff !important;
  position: absolute !important;
  left: 12px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  z-index: 2 !important;
}

/* Input avec icône */
.input-with-icon {
  position: relative !important;
}

.input-with-icon .ios-form-input,
.input-with-icon .ios-form-select {
  padding-left: 40px !important;
}

/* Icônes de statistiques */
.ios-stat-icon {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  margin-bottom: -12px !important;
}

.table-responsive {
  overflow-x: auto !important;
}

/* Amélioration du tableau */
.ios-table {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border-radius: 12px !important;
  overflow: hidden !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.ios-table th {
  background: rgb(255 255 255 / 81%) !important;
  color: #000000 !important;
  font-weight: 600 !important;
  padding: 16px !important;
  text-align: left !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8) !important;
}

.ios-table td {
  padding: 16px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
  color: #333333 !important;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8) !important;
}

.ios-table tr:hover {
  background: rgba(0, 122, 255, 0.05) !important;
}

.ios-table tr:last-child td {
  border-bottom: none !important;
}

/* Utilitaires */
.ios-mt-lg {
  margin-top: 24px !important;
}

.ios-p-sm {
  padding: 8px !important;
}

.d-flex {
  display: flex !important;
}

.justify-content-between {
  justify-content: space-between !important;
}

.align-items-center {
  align-items: center !important;
}

.gap-2 {
  gap: 8px !important;
}

/* Boutons petits */
.ios-button-small {
  padding: 6px 12px !important;
  font-size: 14px !important;
  min-height: 36px !important;
}

.ios-button.success {
    background: #00000005 !important;
    box-shadow: 0 4px 12px rgb(39 39 39 / 23%) !important;
}

select option
 {
    background: #42847a!important;
    color: #ffffff !important;
    padding: 8px !important;
    font-size: 16px !important;
    border: none;
    border-radius: 12px; 
}

.ios-stat-card {
    text-align: center;
}

</style> 
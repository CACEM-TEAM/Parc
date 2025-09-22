<template>
  <div class="ios-fade-in">
    <div class="ios-section">
      <button @click="$router.go(-1)" class="ios-button secondary" style="margin-bottom: 30px;">
        Retour
      </button>


      <h1 class="ios-section-title ios-mb-lg">Détail du contrôle</h1>
    </div>
    <div v-if="loading" class="ios-section">
      <div class="ios-card">
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Chargement...</span>
          </div>
          <p class="mt-3">Chargement du contrôle...</p>
        </div>
      </div>
    </div>
    <div v-else class="ios-section">
      <div class="ios-card">
        <h2 class="ios-section-title">{{ categories[currentStep].title }}</h2>
        <div class="info-grid">
          <template v-for="item in categories[currentStep].fields" :key="item.key">
            <div class="info-item">
              <label>{{ item.label }}</label>
              <span v-if="item.key === 'problemes'">
                <div class="problemes-list">
                  <span v-for="probleme in getProblemesControle(controle)" :key="probleme" class="badge badge-danger probleme-badge">
                    {{ probleme }}
                  </span>
                </div>
              </span>
              <span v-else :class="getBadgeClass(item.format ? item.format(controle[item.key]) : controle[item.key])">
                {{ item.format ? item.format(controle[item.key]) : controle[item.key] }}
              </span>
            </div>
          </template>
        </div>
        <div class="d-flex gap-3 justify-content-end" style="margin-top: 2rem;">
          <button v-if="currentStep > 0" class="ios-button secondary" @click="prevStep">Précédent</button>
          <button v-if="currentStep < categories.length - 1" class="ios-button success" @click="nextStep">Suivant</button>
          <button v-if="currentStep === categories.length - 1" class="ios-button success" @click="goToVehicle">Retour à la fiche véhicule</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { controlesService } from '../services/api'
export default {
  name: 'ControleDetail',
  data() {
    return {
      loading: true,
      controle: {},
      currentStep: 0,
      categories: [
        {
          title: 'Informations générales',
          fields: [
            { key: 'date_controle', label: 'Date', format: d => new Date(d).toLocaleDateString('fr-FR') },
            { key: 'nom_controleur', label: 'Contrôleur' },
            { key: 'etat_salissure', label: 'État de salissure', format: v => {
              const labels = { 'correcte': 'Correcte', 'prévoir lavage': 'Prévoir lavage' }; return labels[v] || v }
            }
          ]
        },
        {
          title: 'Pneumatiques',
          fields: [
            { key: 'usure_pneus_avd', label: 'AVD', format: v => { const l = { 'correcte': 'Correcte', 'moyenne': 'Moyenne', 'mauvaise': 'Mauvaise' }; return l[v] || v } },
            { key: 'usure_pneus_avg', label: 'AVG', format: v => { const l = { 'correcte': 'Correcte', 'moyenne': 'Moyenne', 'mauvaise': 'Mauvaise' }; return l[v] || v } },
            { key: 'usure_pneus_ard', label: 'ARD', format: v => { const l = { 'correcte': 'Correcte', 'moyenne': 'Moyenne', 'mauvaise': 'Mauvaise' }; return l[v] || v } },
            { key: 'usure_pneus_arg', label: 'ARG', format: v => { const l = { 'correcte': 'Correcte', 'moyenne': 'Moyenne', 'mauvaise': 'Mauvaise' }; return l[v] || v } }
          ]
        },
        {
          title: 'Enjoliveurs',
          fields: [
            { key: 'presence_enjoliveur_avd', label: 'AVD' },
            { key: 'presence_enjoliveur_avg', label: 'AVG' },
            { key: 'presence_enjoliveur_ard', label: 'ARD' },
            { key: 'presence_enjoliveur_arg', label: 'ARG' }
          ]
        },
        {
          title: 'Huiles & liquides',
          fields: [
            { key: 'huile_moteur', label: 'Huile moteur' },
            { key: 'liquide_refroidissement', label: 'Liquide refroidissement' },
            { key: 'lave_glace', label: 'Lave-glace' }
          ]
        },
        {
          title: 'Freins',
          fields: [
            { key: 'plaquette_frein_av', label: 'Plaquettes AV' },
            { key: 'plaquette_frein_ar', label: 'Plaquettes AR' },
            { key: 'disque_frein_av', label: 'Disques AV' },
            { key: 'disque_frein_ar', label: 'Disques AR' }
          ]
        },
        {
          title: 'Éclairage',
          fields: [
            { key: 'feux_position_av', label: 'Feux position AV' },
            { key: 'feux_position_ar', label: 'Feux position AR' },
            { key: 'feux_croisement_droite', label: 'Croisement droite' },
            { key: 'feux_croisement_gauche', label: 'Croisement gauche' },
            { key: 'feux_route_av_droite', label: 'Route AV droite' },
            { key: 'feux_route_av_gauche', label: 'Route AV gauche' },
            { key: 'clignotant_av', label: 'Clignotant AV' },
            { key: 'clignotant_ar', label: 'Clignotant AR' },
            { key: 'clignotant_lateraux_droite', label: 'Clignotant latéraux droite' },
            { key: 'clignotant_lateraux_gauche', label: 'Clignotant latéraux gauche' },
            { key: 'feux_stop_ar', label: 'Feux stop AR' },
            { key: 'feux_stop_av', label: 'Feux stop AV' },
            { key: 'feux_stop_centrale', label: 'Feux stop centrale' },
            { key: 'feux_plaque', label: 'Feux plaque' }
          ]
        },
        {
          title: 'Équipements',
          fields: [
            { key: 'balais_essuie_glace', label: 'Balais essuie-glace' },
            { key: 'plaque_immatriculation', label: 'Plaque immatriculation' },
            { key: 'antenne', label: 'Antenne' },
            { key: 'repose_tete', label: 'Repose-tête' },
            { key: 'Tapis_avd', label: 'Tapis AVD' },
            { key: 'Tapis_avg', label: 'Tapis AVG' },
            { key: 'Tapis_ard', label: 'Tapis ARD' },
            { key: 'Tapis_arg', label: 'Tapis ARG' }
          ]
        },
        {
          title: 'Sécurité & documents',
          fields: [
            { key: 'extincteur', label: 'Extincteur' },
            { key: 'carte_carburant', label: 'Carte carburant' },
            { key: 'roue_secours', label: 'Roue de secours' },
            { key: 'cric_manivelle', label: 'Cric et manivelle' },
            { key: 'kit_securite', label: 'Kit de sécurité' },
            { key: 'TAG', label: 'TAG' },
            { key: 'Photocopie_carte_grise', label: 'Photocopie carte grise' },
            { key: 'constat_amiable_vierge', label: 'Constat amiable vierge' },
            { key: 'rapport_dincident', label: 'Rapport d\'incident' },
            { key: 'attestation_assurance', label: 'Attestation d\'assurance' }
          ]
        },
        {
          title: 'Problèmes détectés',
          fields: [
            { key: 'problemes', label: 'Problèmes', format: null }
          ]
        }
      ]
    }
  },
  async mounted() {
    await this.loadControle()
  },
  methods: {
    async loadControle() {
      try {
        this.loading = true
        const controleId = this.$route.params.id
        const response = await controlesService.getById(controleId)
        if (response.success) {
          this.controle = response.data
        }
      } catch (error) {
        this.$message && this.$message.error('Erreur lors du chargement du contrôle')
      } finally {
        this.loading = false
      }
    },
    nextStep() {
      if (this.currentStep < this.categories.length - 1) this.currentStep++
    },
    prevStep() {
      if (this.currentStep > 0) this.currentStep--
    },
    getProblemesControle(controle) {
      const problemes = []
      
      // 1. ÉTAT DE SALISSURE
      if (controle.etat_salissure === 'prévoir lavage') {
        problemes.push('Lavage nécessaire')
      }
      
      // 2. PNEUMATIQUES - Vérification de tous les pneus
      const pneusProblemes = []
      if (controle.usure_pneus_avd === 'mauvaise') pneusProblemes.push('AVD')
      if (controle.usure_pneus_avg === 'mauvaise') pneusProblemes.push('AVG')
      if (controle.usure_pneus_ard === 'mauvaise') pneusProblemes.push('ARD')
      if (controle.usure_pneus_arg === 'mauvaise') pneusProblemes.push('ARG')
      if (pneusProblemes.length > 0) {
        problemes.push(`Pneus usés: ${pneusProblemes.join(', ')}`)
      }
      
      // 3. ENJOLIVEURS - Vérification de tous les enjoliveurs
      const enjoliveursProblemes = []
      if (controle.presence_enjoliveur_avd === 'non') enjoliveursProblemes.push('AVD')
      if (controle.presence_enjoliveur_avg === 'non') enjoliveursProblemes.push('AVG')
      if (controle.presence_enjoliveur_ard === 'non') enjoliveursProblemes.push('ARD')
      if (controle.presence_enjoliveur_arg === 'non') enjoliveursProblemes.push('ARG')
      if (enjoliveursProblemes.length > 0) {
        problemes.push(`Enjoliveurs manquants: ${enjoliveursProblemes.join(', ')}`)
      }
      
      // 4. HUILES & LIQUIDES - Vérification de tous les liquides
      const liquidesProblemes = []
      if (controle.huile_moteur === 'mauvais') liquidesProblemes.push('Huile moteur')
      if (controle.liquide_refroidissement === 'mauvais') liquidesProblemes.push('Liquide refroidissement')
      if (controle.lave_glace === 'mauvais') liquidesProblemes.push('Lave-glace')
      if (liquidesProblemes.length > 0) {
        problemes.push(`Liquides à remplacer: ${liquidesProblemes.join(', ')}`)
      }
      
      // 5. FREINS - Vérification de tous les éléments de freinage
      const freinsProblemes = []
      if (controle.plaquette_frein_av === 'mauvais') freinsProblemes.push('Plaquettes AV')
      if (controle.plaquette_frein_ar === 'mauvais') freinsProblemes.push('Plaquettes AR')
      if (controle.disque_frein_av === 'mauvais') freinsProblemes.push('Disques AV')
      if (controle.disque_frein_ar === 'mauvais') freinsProblemes.push('Disques AR')
      if (freinsProblemes.length > 0) {
        problemes.push(`Problèmes de freinage: ${freinsProblemes.join(', ')}`)
      }
      
      // 6. ÉCLAIRAGE - Vérification de tous les feux
      const feuxProblemes = []
      if (controle.feux_position_av === 'non') feuxProblemes.push('Position AV')
      if (controle.feux_position_ar === 'non') feuxProblemes.push('Position AR')
      if (controle.feux_croisement_droite === 'non') feuxProblemes.push('Croisement droite')
      if (controle.feux_croisement_gauche === 'non') feuxProblemes.push('Croisement gauche')
      if (controle.feux_route_av_droite === 'non') feuxProblemes.push('Route AV droite')
      if (controle.feux_route_av_gauche === 'non') feuxProblemes.push('Route AV gauche')
      if (controle.clignotant_av === 'non') feuxProblemes.push('Clignotant AV')
      if (controle.clignotant_ar === 'non') feuxProblemes.push('Clignotant AR')
      if (controle.clignotant_lateraux_droite === 'non') feuxProblemes.push('Clignotant latéraux droite')
      if (controle.clignotant_lateraux_gauche === 'non') feuxProblemes.push('Clignotant latéraux gauche')
      if (controle.feux_stop_ar === 'non') feuxProblemes.push('Stop AR')
      if (controle.feux_stop_av === 'non') feuxProblemes.push('Stop AV')
      if (controle.feux_stop_centrale === 'non') feuxProblemes.push('Stop centrale')
      if (controle.feux_plaque === 'non') feuxProblemes.push('Plaque')
      if (feuxProblemes.length > 0) {
        problemes.push(`Problèmes d'éclairage: ${feuxProblemes.join(', ')}`)
      }
      
      // 7. ÉQUIPEMENTS - Vérification de tous les équipements
      const equipementsProblemes = []
      if (controle.balais_essuie_glace === 'à remplacer') equipementsProblemes.push('Balais essuie-glace')
      if (controle.plaque_immatriculation === 'à remplacer') equipementsProblemes.push('Plaque immatriculation')
      if (controle.antenne === 'à remplacer') equipementsProblemes.push('Antenne')
      if (controle.repose_tete === 'à remplacer') equipementsProblemes.push('Repose-tête')
      if (equipementsProblemes.length > 0) {
        problemes.push(`Équipements à remplacer: ${equipementsProblemes.join(', ')}`)
      }
      
      // 8. TAPIS - Vérification de tous les tapis
      const tapisProblemes = []
      if (controle.Tapis_avd === 'absent') tapisProblemes.push('AVD')
      if (controle.Tapis_avg === 'absent') tapisProblemes.push('AVG')
      if (controle.Tapis_ard === 'absent') tapisProblemes.push('ARD')
      if (controle.Tapis_arg === 'absent') tapisProblemes.push('ARG')
      if (tapisProblemes.length > 0) {
        problemes.push(`Tapis manquants: ${tapisProblemes.join(', ')}`)
      }
      
      // 9. SÉCURITÉ - Vérification de tous les équipements de sécurité
      const securiteProblemes = []
      if (controle.extincteur === 'absent') securiteProblemes.push('Extincteur')
      if (controle.roue_secours === 'absent') securiteProblemes.push('Roue de secours')
      if (controle.cric_manivelle === 'absent') securiteProblemes.push('Cric et manivelle')
      if (controle.kit_securite === 'absent') securiteProblemes.push('Kit de sécurité')
      if (securiteProblemes.length > 0) {
        problemes.push(`Équipements de sécurité manquants: ${securiteProblemes.join(', ')}`)
      }
      
      // 10. DOCUMENTS - Vérification de tous les documents
      const documentsProblemes = []
      if (controle.carte_carburant === 'absente') documentsProblemes.push('Carte carburant')
      if (controle.Photocopie_carte_grise === 'absent') documentsProblemes.push('Photocopie carte grise')
      if (controle.constat_amiable_vierge === 'absent') documentsProblemes.push('Constat amiable')
      if (controle.rapport_dincident === 'absent') documentsProblemes.push('Rapport d\'incident')
      if (controle.attestation_assurance === 'absent') documentsProblemes.push('Attestation assurance')
      if (documentsProblemes.length > 0) {
        problemes.push(`Documents manquants: ${documentsProblemes.join(', ')}`)
      }
      
      // 11. AUTRES - Vérification des autres éléments
      if (controle.TAG === 'à remplacer') {
        problemes.push('TAG à remplacer')
      }
      
      return problemes.length > 0 ? problemes : ['Aucun problème détecté']
    },
    getBadgeClass(val) {
      if (!val) return 'badge badge-default';
      const v = val.toString().toLowerCase();
      if (["ok", "correcte", "présent", "présente"].includes(v)) return "badge badge-success";
      if (["moyenne"].includes(v)) return "badge badge-warning";
      if (["mauvaise", "mauvais", "absent", "absente", "à remplacer", "non"].includes(v)) return "badge badge-danger";
      return "badge badge-default";
    },
    goToVehicle() {
      if (this.controle.vehicule_id) {
        this.$router.push(`/vehicle/${this.controle.vehicule_id}`)
      } else {
        this.$router.push('/');
      }
    }
  }
}
</script>

<style scoped>
.ios-section { margin-bottom: 24px; }

.info-grid {
  display: grid;
  gap: 1rem;
}
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.info-item:last-child { border-bottom: none; }
.info-item label {
  font-weight: 600;
  color: #fff;
}
.info-item span {
  color: #fff;
  font-weight: 500;
}
.ios-section-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #fff;
}
.ios-section-subtitle {
  font-size: 1.1rem;
  color: #90cdf4;
  margin-bottom: 0.5rem;
  font-weight: 600;
}
.d-flex { display: flex; }
.gap-3 { gap: 1rem; }
.justify-content-end { justify-content: flex-end; }
.badge {
  display: inline-block;
  padding: 0.2em 0.8em;
  border-radius: 12px;
  font-size: 0.95em;
  font-weight: 600;
  margin-left: 0.5em;
  vertical-align: middle;
}
.badge-success {
  background: #34C759;
  color: #fff;
}
.badge-warning {
  background: #FF9500;
  color: #fff;
}
.badge-danger {
  background: #FF3B30;
  color: #fff;
}
.badge-default {
  background: #888;
  color: #fff;
}
.problemes-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
}
.probleme-badge {
  background: #FF3B30;
  color: #fff;
  font-size: 0.85em;
  padding: 0.3em 0.6em;
  border-radius: 8px;
  white-space: nowrap;
}
</style> 
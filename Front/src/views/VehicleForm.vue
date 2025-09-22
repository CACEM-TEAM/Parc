<template>
  <div class="ios-fade-in">
    <!-- En-tête -->
    <div class="ios-section">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <button @click="$router.go(-1)" class="ios-button secondary">
            <ChevronLeft class="button-icon" />
            Retour
          </button>
          <h1 class="ios-section-title">
            {{ isEditing ? 'Modifier le véhicule' : 'Ajouter un véhicule' }}
          </h1>
          <p class="ios-section-subtitle">
            {{ isEditing ? 'Modifier les informations du véhicule' : 'Créer un nouveau véhicule dans le parc' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Formulaire -->
    <div class="ios-section">
      <div class="ios-card">
        <form @submit.prevent="submitForm">
          <div class="ios-grid ios-grid-2">
            <!-- Immatriculation -->
            <div class="form-group">
              <label for="immatriculation" class="form-label">
                <Hash class="form-icon" />
                Immatriculation *
              </label>
              <input
                id="immatriculation"
                v-model="formData.immatriculation"
                type="text"
                class="ios-input"
                :class="{ 'error': errors.immatriculation }"
                placeholder="AB-123-CD"
                required
                maxlength="20"
              />
              <div v-if="errors.immatriculation" class="error-message">
                {{ errors.immatriculation }}
              </div>
            </div>

            <!-- Marque -->
            <div class="form-group">
              <label for="marque" class="form-label">
                <Car class="form-icon" />
                Marque *
              </label>
              <input
                id="marque"
                v-model="formData.marque"
                type="text"
                class="ios-input"
                :class="{ 'error': errors.marque }"
                placeholder="Renault"
                required
                maxlength="50"
              />
              <div v-if="errors.marque" class="error-message">
                {{ errors.marque }}
              </div>
            </div>

            <!-- Type -->
            <div class="form-group">
              <label for="type" class="form-label">
                <Tag class="form-icon" />
                Type/Modèle *
              </label>
              <input
                id="type"
                v-model="formData.type"
                type="text"
                class="ios-input"
                :class="{ 'error': errors.type }"
                placeholder="Clio"
                required
                maxlength="50"
              />
              <div v-if="errors.type" class="error-message">
                {{ errors.type }}
              </div>
            </div>

            <!-- Remisage domicile -->
            <div class="form-group">
              <label class="form-label">
                <Home class="form-icon" />
                Remisage domicile
              </label>
              <div class="checkbox-group">
                <label class="ios-checkbox">
                  <input
                    v-model="formData.remisage_domicile"
                    type="checkbox"
                    class="ios-checkbox-input"
                  />
                  <span class="ios-checkbox-mark"></span>
                  <span class="ios-checkbox-label">Autoriser le remisage au domicile</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <button type="button" @click="$router.go(-1)" class="ios-button secondary">
              <X class="button-icon" />
              Annuler
            </button>
            <button type="submit" :disabled="submitting" class="ios-button success">
              <component :is="submitting ? 'Loader2' : (isEditing ? 'Save' : 'Plus')" class="button-icon" />
              {{ submitting ? 'Enregistrement...' : (isEditing ? 'Modifier' : 'Ajouter') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Marques populaires -->
    <div class="ios-section">
      <div class="ios-card">
        <h3 class="ios-mb-md">
          <User class="action-icon" />
          Marques populaires
        </h3>
        <div class="marques-populaires">
          <button
            v-for="marque in marquesPopulaires"
            :key="marque"
            @click="selectMarque(marque)"
            class="marque-tag"
            :class="{ 'selected': formData.marque === marque }"
          >
            {{ marque }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { vehiculesService } from '../services/api'
import { 
  ChevronLeft, Hash, Car, Tag, Home, X, Plus, Save, Loader2, User 
} from 'lucide-vue-next'

export default {
  name: 'VehicleForm',
  components: {
    ChevronLeft,
    Hash,
    Car,
    Tag,
    Home,
    X,
    Plus,
    Save,
    Loader2,
    User
  },
  data() {
    return {
      submitting: false,
      formData: {
        immatriculation: '',
        marque: '',
        type: '',
        remisage_domicile: false
      },
      errors: {},
      marquesPopulaires: [
        'Renault', 'Peugeot', 'Citroën', 'Volkswagen', 'BMW', 'Mercedes', 
        'Audi', 'Toyota', 'Honda', 'Ford', 'Opel', 'Fiat', 'Tesla', 'Hyundai'
      ]
    }
  },
  computed: {
    isEditing() {
      return this.$route.params.id !== undefined
    },
    vehicleId() {
      return this.$route.params.id
    }
  },
  async mounted() {
    if (this.isEditing) {
      await this.loadVehicle()
    }
  },
  methods: {
    async loadVehicle() {
      try {
        const response = await vehiculesService.getById(this.vehicleId)
        if (response.success) {
          this.formData = {
            immatriculation: response.data.immatriculation,
            marque: response.data.marque,
            type: response.data.type,
            remisage_domicile: response.data.remisage_domicile === 1
          }
        } else {
          this.$message.error('Erreur lors du chargement du véhicule')
          this.$router.push('/dashboard')
        }
      } catch (error) {
        console.error('Erreur lors du chargement du véhicule:', error)
        this.$message.error('Erreur lors du chargement du véhicule')
        this.$router.push('/dashboard')
      }
    },

    validateForm() {
      this.errors = {}

      // Validation immatriculation
      if (!this.formData.immatriculation.trim()) {
        this.errors.immatriculation = 'L\'immatriculation est obligatoire'
      } else if (!/^[A-Z0-9-]{5,20}$/.test(this.formData.immatriculation.toUpperCase())) {
        this.errors.immatriculation = 'Format d\'immatriculation invalide'
      }

      // Validation marque
      if (!this.formData.marque.trim()) {
        this.errors.marque = 'La marque est obligatoire'
      }

      // Validation type
      if (!this.formData.type.trim()) {
        this.errors.type = 'Le type/modèle est obligatoire'
      }

      return Object.keys(this.errors).length === 0
    },

    async submitForm() {
      if (!this.validateForm()) {
        return
      }

      try {
        this.submitting = true

        // Normaliser l'immatriculation
        const normalizedData = {
          ...this.formData,
          immatriculation: this.formData.immatriculation.toUpperCase().trim(),
          marque: this.formData.marque.trim(),
          type: this.formData.type.trim()
        }

        let response
        if (this.isEditing) {
          response = await vehiculesService.update(this.vehicleId, normalizedData)
        } else {
          response = await vehiculesService.create(normalizedData)
        }

        if (response.success) {
          this.$message.success(
            this.isEditing 
              ? 'Véhicule modifié avec succès !' 
              : 'Véhicule ajouté avec succès !'
          )
          this.$router.push('/dashboard')
        } else {
          this.$message.error(response.error || 'Erreur lors de l\'enregistrement')
        }
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error)
        this.$message.error('Erreur lors de l\'enregistrement du véhicule')
      } finally {
        this.submitting = false
      }
    },

    selectMarque(marque) {
      this.formData.marque = marque
    }
  }
}
</script>

<style scoped>
/* Styles pour la lisibilité avec le nouveau dégradé */
.form-group {
  margin-bottom: 1.5rem !important;
}

.form-label {
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  font-weight: 600 !important;
  color: #FFFFFF !important;
  margin-bottom: 0.5rem !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
}

.form-icon {
  width: 18px !important;
  height: 18px !important;
  color: #44A08D !important;
}

.ios-input {
  width: 100% !important;
  padding: 0.75rem 1rem !important;
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 8px !important;
  color: #FFFFFF !important;
  font-size: 1rem !important;
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
  transition: all 0.3s ease !important;
}

.ios-input::placeholder {
  color: rgba(255, 255, 255, 0.6) !important;
}

.ios-input:focus {
  outline: none !important;
  border-color: #44A08D !important;
  box-shadow: 0 0 0 3px rgba(68, 160, 141, 0.2) !important;
}

.ios-input.error {
  border-color: #FF3B30 !important;
  box-shadow: 0 0 0 3px rgba(255, 59, 48, 0.2) !important;
}

.error-message {
  color: #FF3B30 !important;
  font-size: 0.875rem !important;
  margin-top: 0.25rem !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
}

.checkbox-group {
  margin-top: 0.5rem !important;
}

.ios-checkbox {
  display: flex !important;
  align-items: center !important;
  gap: 0.75rem !important;
  cursor: pointer !important;
  padding: 0.5rem 0 !important;
}

.ios-checkbox-input {
  display: none !important;
}

.ios-checkbox-mark {
  width: 20px !important;
  height: 20px !important;
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  border-radius: 4px !important;
  background: rgba(255, 255, 255, 0.1) !important;
  position: relative !important;
  transition: all 0.3s ease !important;
}

.ios-checkbox-input:checked + .ios-checkbox-mark {
  background: #44A08D !important;
  border-color: #44A08D !important;
}

.ios-checkbox-input:checked + .ios-checkbox-mark::after {
  content: '✓' !important;
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  color: white !important;
  font-size: 12px !important;
  font-weight: bold !important;
}

.ios-checkbox-label {
  color: #FFFFFF !important;
  font-weight: 500 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
}

.form-actions {
  display: flex !important;
  justify-content: flex-end !important;
  gap: 1rem !important;
  margin-top: 2rem !important;
  padding-top: 1.5rem !important;
  border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.marques-populaires {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 0.5rem !important;
}

.marque-tag {
  padding: 0.5rem 1rem !important;
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 20px !important;
  color: #FFFFFF !important;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
}

.marque-tag:hover {
  background: rgba(68, 160, 141, 0.2) !important;
  border-color: #44A08D !important;
  transform: translateY(-1px) !important;
}

.marque-tag.selected {
  background: #44A08D !important;
  border-color: #44A08D !important;
  color: white !important;
}

/* Icônes */
.title-icon {
  width: 32px !important;
  height: 32px !important;
  margin-right: 12px !important;
  color: #44A08D !important;
  vertical-align: middle !important;
}

.action-icon {
  width: 20px !important;
  height: 20px !important;
  margin-right: 8px !important;
  color: #44A08D !important;
  vertical-align: middle !important;
}

.button-icon {
  width: 16px !important;
  height: 16px !important;
  margin-right: 6px !important;
  color: white !important;
}

/* Responsive */
@media (max-width: 768px) {
  .ios-grid-2 {
    grid-template-columns: 1fr !important;
  }
  
  .form-actions {
    flex-direction: column !important;
  }
  
  .form-actions .ios-button {
    width: 100% !important;
  }
}
</style> 
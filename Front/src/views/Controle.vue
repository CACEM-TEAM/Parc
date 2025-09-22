<template>
  <div class="ios-fade-in">
    <!-- En-tête -->
    <div class="ios-section">
    </div>

    <!-- Loading -->
    <div v-if="loading" class="ios-loading">
      <div class="ios-spinner"></div>
    </div>

    <!-- Formulaire progressif -->
    <div v-else class="ios-section">
      <!-- Indicateur de progression -->
      <div class="ios-card progress-card">
        <div class="progress-steps">
          <div 
            v-for="(step, index) in steps" 
            :key="index"
            class="progress-step"
            :class="{ 
              'active': currentStep === index,
              'completed': currentStep > index,
              'disabled': currentStep < index
            }"
            @click="goToStep(index)"
          >
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-label">{{ step.label }}</div>
          </div>
        </div>
      </div>

      <!-- Contenu de l'étape actuelle -->
      <div class="ios-card step-content">
        <h2 class="ios-section-title">{{ steps[currentStep].label }}</h2>
        
        <!-- Étape 1: Informations du véhicule -->
        <div v-if="currentStep === 0">
          <div class="ios-grid ios-grid-3">
            <div class="ios-form-group">
              <label class="ios-form-label">
                Véhicule <span class="text-danger">*</span>
              </label>
              <div class="search-container">
                <template v-if="!selectedVehicule">
                  <div class="input-with-icon">
                    <Search class="input-icon" />
                    <input
                      v-model="searchQuery"
                      type="text"
                      class="ios-form-input"
                      placeholder="Rechercher par immatriculation..."
                      @input="searchVehicules"
                      @keydown.enter="handleSearchEnter"
                      @focus="showSearchResults = true"
                      required
                    />
                  </div>
                  <!-- Résultats de recherche -->
                  <div v-if="showSearchResults && searchResults.length > 0" class="search-results">
                    <div class="search-results-header">
                      <span>{{ searchResults.length }} véhicule(s) trouvé(s)</span>
                    </div>
                    <div class="vehicule-list">
                      <div
                        v-for="vehicule in searchResults"
                        :key="vehicule.id_vehicule"
                        class="vehicule-item"
                        @click="selectVehicule(vehicule)"
                      >
                        <div class="vehicule-info">
                          <div class="vehicule-main">
                            <strong>{{ vehicule.marque }} {{ vehicule.type }}</strong>
                            <span class="immatriculation">{{ vehicule.immatriculation }}</span>
                          </div>
                          <div class="vehicule-details">
                            <span class="remisage">{{ vehicule.remisage_domicile ? 'Remisage domicile' : 'Remisage site' }}</span>
                            <span class="controles">{{ vehicule.nb_controles || 0 }} contrôle(s)</span>
                          </div>
                        </div>
                        <ChevronRight class="chevron-icon" />
                      </div>
                    </div>
                  </div>
                  <!-- Aucun résultat -->
                  <div v-else-if="showSearchResults && searchQuery && !searching" class="no-results">
                    <div class="no-results-content">
                      <Car class="no-results-icon" />
                      <h4>Aucun véhicule trouvé</h4>
                      <p>Aucun véhicule ne correspond à votre recherche.</p>
                      <button @click="createNewVehicule" class="ios-button success">
                        <Plus class="button-icon" />
                        Ajouter ce véhicule
                      </button>
                    </div>
                  </div>
                  <!-- Chargement -->
                  <div v-if="searching" class="search-loading">
                    <Loader2 class="loading-icon" />
                    <span>Recherche en cours...</span>
                  </div>
                </template>
              </div>
              
              <!-- Véhicule sélectionné -->
              <div v-if="selectedVehicule" class="selected-vehicule">
                <div class="selected-vehicule-info">
                  <div class="vehicule-main">
                    <strong>{{ selectedVehicule.marque }} {{ selectedVehicule.type }}</strong>
                    <span class="immatriculation">{{ selectedVehicule.immatriculation }}</span>
                  </div>
                  <div class="vehicule-details">
                    <span class="remisage">{{ selectedVehicule.remisage_domicile ? 'Remisage domicile' : 'Remisage site' }}</span>
                    <span class="controles">{{ selectedVehicule.nb_controles || 0 }} contrôle(s)</span>
                  </div>
                </div>
                <button @click="clearVehicule" class="ios-button secondary small"  style="color: #ffffff !important;">
                  <X class="button-icon" style="color: #ffffff !important;"/>
                  Changer
                </button>
              </div>
            </div>

            <div class="ios-form-group">
              <label class="ios-form-label">
                Nom du contrôleur <span class="text-danger">*</span>
              </label>
              <input
                v-model="formData.nom_controleur"
                type="text"
                class="ios-form-input"
                placeholder="Entrez votre nom..."
                required
              />
            </div>

            <div class="ios-form-group">
              <label class="ios-form-label">État de salissure</label>
              <select v-model="formData.etat_salissure" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="correcte">Correcte</option>
                <option value="prévoir lavage">Prévoir lavage</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Étape 2: Pneus -->
        <div v-if="currentStep === 1">
          <div class="ios-grid ios-grid-4">
            <div class="ios-form-group">
              <label class="ios-form-label">AVD</label>
              <select v-model="formData.usure_pneus_avd" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="correcte">Correcte</option>
                <option value="moyenne">Moyenne</option>
                <option value="mauvaise">Mauvaise</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">AVG</label>
              <select v-model="formData.usure_pneus_avg" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="correcte">Correcte</option>
                <option value="moyenne">Moyenne</option>
                <option value="mauvaise">Mauvaise</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">ARD</label>
              <select v-model="formData.usure_pneus_ard" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="correcte">Correcte</option>
                <option value="moyenne">Moyenne</option>
                <option value="mauvaise">Mauvaise</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">ARG</label>
              <select v-model="formData.usure_pneus_arg" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="correcte">Correcte</option>
                <option value="moyenne">Moyenne</option>
                <option value="mauvaise">Mauvaise</option>
              </select>
            </div>
          </div>

          <!-- Enjoliveurs -->
          <h3 class="ios-mb-md">Enjoliveurs</h3>
          <div class="ios-grid ios-grid-4">
            <div class="ios-form-group">
              <label class="ios-form-label">AVD</label>
              <select v-model="formData.presence_enjoliveur_avd" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="ok">OK</option>
                <option value="non">Non</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">AVG</label>
              <select v-model="formData.presence_enjoliveur_avg" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="ok">OK</option>
                <option value="non">Non</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">ARD</label>
              <select v-model="formData.presence_enjoliveur_ard" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="ok">OK</option>
                <option value="non">Non</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">ARG</label>
              <select v-model="formData.presence_enjoliveur_arg" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="ok">OK</option>
                <option value="non">Non</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Étape 3: Huiles et liquides -->
        <div v-if="currentStep === 2">
          <div class="ios-grid ios-grid-4">
            <div class="ios-form-group">
              <label class="ios-form-label">Huile moteur</label>
              <select v-model="formData.huile_moteur" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="correcte">Correcte</option>
                <option value="mauvais">Mauvais</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">Liquide refroidissement</label>
              <select v-model="formData.liquide_refroidissement" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="correcte">Correcte</option>
                <option value="mauvais">Mauvais</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">Lave-glace</label>
              <select v-model="formData.lave_glace" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="correcte">Correcte</option>
                <option value="mauvais">Mauvais</option>
              </select>
            </div>
          </div>

          <!-- Freins -->
          <h3 class="ios-mb-md">Freins</h3>
          <div class="ios-grid ios-grid-4">
            <div class="ios-form-group">
              <label class="ios-form-label">Plaquettes AV</label>
              <select v-model="formData.plaquette_frein_av" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="correcte">Correcte</option>
                <option value="mauvais">Mauvais</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">Plaquettes AR</label>
              <select v-model="formData.plaquette_frein_ar" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="correcte">Correcte</option>
                <option value="mauvais">Mauvais</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">Disques AV</label>
              <select v-model="formData.disque_frein_av" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="correcte">Correcte</option>
                <option value="mauvais">Mauvais</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">Disques AR</label>
              <select v-model="formData.disque_frein_ar" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="correcte">Correcte</option>
                <option value="mauvais">Mauvais</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Étape 4: Éclairage -->
        <div v-if="currentStep === 3">
          <div class="ios-grid ios-grid-4">
            <div class="ios-form-group">
              <label class="ios-form-label">Feux position AV</label>
              <select v-model="formData.feux_position_av" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="ok">OK</option>
                <option value="non">Non</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">Feux position AR</label>
              <select v-model="formData.feux_position_ar" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="ok">OK</option>
                <option value="non">Non</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">Croisement droite</label>
              <select v-model="formData.feux_croisement_droite" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="ok">OK</option>
                <option value="non">Non</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">Croisement gauche</label>
              <select v-model="formData.feux_croisement_gauche" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="ok">OK</option>
                <option value="non">Non</option>
              </select>
            </div>
          </div>

          <div class="ios-grid ios-grid-4">
            <div class="ios-form-group">
              <label class="ios-form-label">Route AV droite</label>
              <select v-model="formData.feux_route_av_droite" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="ok">OK</option>
                <option value="non">Non</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">Route AV gauche</label>
              <select v-model="formData.feux_route_av_gauche" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="ok">OK</option>
                <option value="non">Non</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">Clignotant AV</label>
              <select v-model="formData.clignotant_av" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="ok">OK</option>
                <option value="non">Non</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">Clignotant AR</label>
              <select v-model="formData.clignotant_ar" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="ok">OK</option>
                <option value="non">Non</option>
              </select>
            </div>
          </div>

          <div class="ios-grid ios-grid-4">
            <div class="ios-form-group">
              <label class="ios-form-label">Clignotant latéraux droite</label>
              <select v-model="formData.clignotant_lateraux_droite" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="ok">OK</option>
                <option value="non">Non</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">Clignotant latéraux gauche</label>
              <select v-model="formData.clignotant_lateraux_gauche" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="ok">OK</option>
                <option value="non">Non</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">Feux stop AR</label>
              <select v-model="formData.feux_stop_ar" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="ok">OK</option>
                <option value="non">Non</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">Feux stop AV</label>
              <select v-model="formData.feux_stop_av" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="ok">OK</option>
                <option value="non">Non</option>
              </select>
            </div>
          </div>

          <div class="ios-grid ios-grid-2">
            <div class="ios-form-group">
              <label class="ios-form-label">Feux stop centrale</label>
              <select v-model="formData.feux_stop_centrale" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="ok">OK</option>
                <option value="non">Non</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">Feux plaque</label>
              <select v-model="formData.feux_plaque" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="ok">OK</option>
                <option value="non">Non</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Étape 5: Équipements -->
        <div v-if="currentStep === 4">
          <div class="ios-grid ios-grid-4">
            <div class="ios-form-group">
              <label class="ios-form-label">Balais essuie-glace</label>
              <select v-model="formData.balais_essuie_glace" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="correcte">Correcte</option>
                <option value="à remplacer">À remplacer</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">Plaque immatriculation</label>
              <select v-model="formData.plaque_immatriculation" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="correcte">Correcte</option>
                <option value="à remplacer">À remplacer</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">Antenne</label>
              <select v-model="formData.antenne" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="correcte">Correcte</option>
                <option value="à remplacer">À remplacer</option>
                <option value="non concernée">Non concernée</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">Repose-tête</label>
              <select v-model="formData.repose_tete" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="correcte">Correcte</option>
                <option value="à remplacer">À remplacer</option>
              </select>
            </div>
          </div>

          <!-- Tapis -->
          <h3 class="ios-mb-md">Tapis</h3>
          <div class="ios-grid ios-grid-4">
            <div class="ios-form-group">
              <label class="ios-form-label">AVD</label>
              <select v-model="formData.Tapis_avd" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="correcte">Correcte</option>
                <option value="à remplacer">À remplacer</option>
                <option value="absent">Absent</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">AVG</label>
              <select v-model="formData.Tapis_avg" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="correcte">Correcte</option>
                <option value="à remplacer">À remplacer</option>
                <option value="absent">Absent</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">ARD</label>
              <select v-model="formData.Tapis_ard" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="correcte">Correcte</option>
                <option value="à remplacer">À remplacer</option>
                <option value="absent">Absent</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">ARG</label>
              <select v-model="formData.Tapis_arg" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="correcte">Correcte</option>
                <option value="à remplacer">À remplacer</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </div>

          <!-- Équipements de sécurité -->
          <h3 class="ios-mb-md">Équipements de sécurité</h3>
          <div class="ios-grid ios-grid-4">
            <div class="ios-form-group">
              <label class="ios-form-label">Extincteur</label>
              <select v-model="formData.extincteur" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="présent">Présent</option>
                <option value="absent">Absent</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">Carte carburant</label>
              <select v-model="formData.carte_carburant" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="présente">Présente</option>
                <option value="absente">Absente</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">Roue de secours</label>
              <select v-model="formData.roue_secours" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="présent">Présent</option>
                <option value="absent">Absent</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">Cric et manivelle</label>
              <select v-model="formData.cric_manivelle" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="présent">Présent</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </div>

          <div class="ios-grid ios-grid-4">
            <div class="ios-form-group">
              <label class="ios-form-label">Kit de sécurité</label>
              <select v-model="formData.kit_securite" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="présent">Présent</option>
                <option value="absent">Absent</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">TAG</label>
              <select v-model="formData.TAG" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="correcte">Correcte</option>
                <option value="à remplacer">À remplacer</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">Photocopie carte grise</label>
              <select v-model="formData.Photocopie_carte_grise" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="présent">Présent</option>
                <option value="absent">Absent</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">Constat amiable vierge</label>
              <select v-model="formData.constat_amiable_vierge" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="présent">Présent</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </div>

          <div class="ios-grid ios-grid-2">
            <div class="ios-form-group">
              <label class="ios-form-label">Rapport d'incident</label>
              <select v-model="formData.rapport_dincident" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="présent">Présent</option>
                <option value="absent">Absent</option>
              </select>
            </div>
            <div class="ios-form-group">
              <label class="ios-form-label">Attestation d'assurance</label>
              <select v-model="formData.attestation_assurance" class="ios-form-select">
                <option value="">Sélectionner...</option>
                <option value="présent">Présent</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Étape 6: Récapitulatif -->
        <div v-if="currentStep === 5">
          <div class="recap-section">
            <h3>Récapitulatif du contrôle</h3>
            <div class="recap-grid">
              <div class="recap-item">
                <strong>Véhicule:</strong> 
                <span v-if="selectedVehicule">{{ selectedVehicule.marque }} {{ selectedVehicule.type }} - {{ selectedVehicule.immatriculation }}</span>
                <span v-else class="text-danger">Non sélectionné</span>
              </div>
              <div class="recap-item">
                <strong>Contrôleur:</strong> {{ formData.nom_controleur || 'Non renseigné' }}
              </div>
              <div class="recap-item">
                <strong>État de salissure:</strong> {{ formData.etat_salissure || 'Non renseigné' }}
              </div>
            </div>
            
            <div class="recap-summary">
              <h4>Points vérifiés:</h4>
              <ul>
                <li>✅ Pneus et enjoliveurs</li>
                <li>✅ Huiles et liquides</li>
                <li>✅ Système de freinage</li>
                <li>✅ Éclairage</li>
                <li>✅ Équipements et sécurité</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation entre les étapes -->
      <div class=" navigation-card">
        <div class="d-flex gap-3 justify-content-between">
          <button 
            v-if="currentStep > 0"
            type="button" 
            class="ios-button secondary"
            @click="previousStep"
          >
            ← Précédent
          </button>
          <div v-else></div>
          
          <div class="step-actions">
            <button 
              v-if="currentStep < steps.length - 1"
              type="button" 
              class="ios-button success"
              @click="nextStep"
              :disabled="!canProceed"
            >
              Suivant →
            </button>
            <button 
              v-if="currentStep === steps.length - 1"
              type="button" 
              class="ios-button success"
              @click="submitControle"
              :disabled="submitting"
            >
              💾 {{ submitting ? 'Enregistrement...' : 'Enregistrer le contrôle' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div v-if="message" class="ios-message" :class="message.type">
      {{ message.text }}
    </div>
  </div>
</template>

<script>
import { vehiculesService, controlesService } from '../services/api'
import { 
  Search, Car, ChevronRight, Plus, Loader2, X 
} from 'lucide-vue-next'

export default {
  name: 'Controle',
  components: {
    Search,
    Car,
    ChevronRight,
    Plus,
    Loader2,
    X
  },
  data() {
    return {
      loading: true,
      submitting: false,
      vehicules: [],
      message: null,
      currentStep: 0,
      steps: [
        { label: 'Informations du véhicule', icon: '🚗' },
        { label: 'Pneus', icon: '🛞' },
        { label: 'Huiles & Liquides', icon: '⛽' },
        { label: 'Éclairage', icon: '💡' },
        { label: 'Équipements', icon: '🔧' },
        { label: 'Récapitulatif', icon: '📋' }
      ],
      // Données pour la recherche
      searchQuery: '',
      searchResults: [],
      searching: false,
      showSearchResults: false,
      selectedVehicule: null,
      searchTimeout: null,
      formData: {
        vehicule_id: '',
        nom_controleur: '',
        etat_salissure: '',
        // Pneus
        usure_pneus_avd: '',
        usure_pneus_avg: '',
        usure_pneus_ard: '',
        usure_pneus_arg: '',
        // Enjoliveurs
        presence_enjoliveur_avd: '',
        presence_enjoliveur_avg: '',
        presence_enjoliveur_ard: '',
        presence_enjoliveur_arg: '',
        // Huiles & Liquides
        huile_moteur: '',
        liquide_refroidissement: '',
        lave_glace: '',
        plaquette_frein_av: '',
        plaquette_frein_ar: '',
        disque_frein_av: '',
        disque_frein_ar: '',
        // Éclairage
        feux_position_av: '',
        feux_position_ar: '',
        feux_croisement_droite: '',
        feux_croisement_gauche: '',
        feux_route_av_droite: '',
        feux_route_av_gauche: '',
        clignotant_av: '',
        clignotant_ar: '',
        clignotant_lateraux_droite: '',
        clignotant_lateraux_gauche: '',
        feux_stop_ar: '',
        feux_stop_av: '',
        feux_stop_centrale: '',
        feux_plaque: '',
        // Équipements
        balais_essuie_glace: '',
        plaque_immatriculation: '',
        antenne: '',
        repose_tete: '',
        Tapis_avd: '',
        Tapis_avg: '',
        Tapis_ard: '',
        Tapis_arg: '',
        extincteur: '',
        carte_carburant: '',
        roue_secours: '',
        cric_manivelle: '',
        kit_securite: '',
        TAG: '',
        Photocopie_carte_grise: '',
        constat_amiable_vierge: '',
        rapport_dincident: '',
        attestation_assurance: ''
      },
      currentStep: 0,
      steps: [
        { label: 'Informations du véhicule' },
        { label: 'Pneus et enjoliveurs' },
        { label: 'Huiles et liquides' },
        { label: 'Éclairage' },
        { label: 'Équipements' },
        { label: 'Récapitulatif' }
      ]
    }
  },
  computed: {
    canProceed() {
      // Pour l'étape 0 (Informations du véhicule), seuls le véhicule et le nom du contrôleur sont obligatoires
      if (this.currentStep === 0) {
        return this.selectedVehicule && this.formData.nom_controleur.trim().length > 0;
      }
      // Pour les autres étapes, on peut toujours passer (les champs ne sont pas obligatoires)
      return true;
    }
  },
  async mounted() {
    await this.loadData()
    
    // Ajouter un listener pour fermer la liste déroulante quand on clique en dehors
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    // Nettoyer le listener
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    async loadData() {
      try {
        this.loading = true
        
        // Charger les véhicules
        const vehiculesResponse = await vehiculesService.getAll()
        if (vehiculesResponse.success) {
          this.vehicules = vehiculesResponse.data
        }

        // Si un véhicule est spécifié dans l'URL
        const urlParams = new URLSearchParams(window.location.search)
        const vehiculeId = urlParams.get('vehicule')
        if (vehiculeId) {
          this.formData.vehicule_id = parseInt(vehiculeId)
          // Trouver et présélectionner le véhicule
          const vehicule = this.vehicules.find(v => v.id_vehicule === parseInt(vehiculeId))
          if (vehicule) {
            this.selectedVehicule = vehicule
            this.searchQuery = vehicule.immatriculation
            console.log('✅ Véhicule présélectionné:', vehicule.immatriculation)
          } else {
            console.warn('⚠️ Véhicule non trouvé avec l\'ID:', vehiculeId)
          }
        }

      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        this.showMessage('Erreur lors du chargement des données', 'error')
      } finally {
        this.loading = false
      }
    },

    async submitControle() {
      try {
        this.submitting = true

        // Validation
        if (!this.formData.vehicule_id) {
          this.showMessage('Veuillez sélectionner un véhicule', 'error')
          return
        }

        if (!this.formData.nom_controleur || this.formData.nom_controleur.trim().length === 0) {
          this.showMessage('Veuillez saisir votre nom', 'error')
          return
        }

        // Vérification du payload
        console.log('Payload envoyé à l\'API:', this.formData);

        // Envoyer le contrôle
        const response = await controlesService.create(this.formData)
        
        if (response.success) {
          this.showMessage('Contrôle enregistré avec succès !', 'success')
          this.resetForm()
          // Redirection vers l'accueil après 1 seconde
          setTimeout(() => {
            this.$router.push('/')
          }, 1000)
        } else {
          this.showMessage('Erreur lors de l\'enregistrement du contrôle', 'error')
        }

      } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error)
        this.showMessage(error.message || 'Erreur lors de l\'enregistrement', 'error')
      } finally {
        this.submitting = false
      }
    },

    resetForm() {
      this.formData = {
        vehicule_id: '',
        nom_controleur: '',
        etat_salissure: '',
        // Pneus
        usure_pneus_avd: '',
        usure_pneus_avg: '',
        usure_pneus_ard: '',
        usure_pneus_arg: '',
        // Enjoliveurs
        presence_enjoliveur_avd: '',
        presence_enjoliveur_avg: '',
        presence_enjoliveur_ard: '',
        presence_enjoliveur_arg: '',
        // Huiles & Liquides
        huile_moteur: '',
        liquide_refroidissement: '',
        lave_glace: '',
        plaquette_frein_av: '',
        plaquette_frein_ar: '',
        disque_frein_av: '',
        disque_frein_ar: '',
        // Éclairage
        feux_position_av: '',
        feux_position_ar: '',
        feux_croisement_droite: '',
        feux_croisement_gauche: '',
        feux_route_av_droite: '',
        feux_route_av_gauche: '',
        clignotant_av: '',
        clignotant_ar: '',
        clignotant_lateraux_droite: '',
        clignotant_lateraux_gauche: '',
        feux_stop_ar: '',
        feux_stop_av: '',
        feux_stop_centrale: '',
        feux_plaque: '',
        // Équipements
        balais_essuie_glace: '',
        plaque_immatriculation: '',
        antenne: '',
        repose_tete: '',
        Tapis_avd: '',
        Tapis_avg: '',
        Tapis_ard: '',
        Tapis_arg: '',
        extincteur: '',
        carte_carburant: '',
        roue_secours: '',
        cric_manivelle: '',
        kit_securite: '',
        TAG: '',
        Photocopie_carte_grise: '',
        constat_amiable_vierge: '',
        rapport_dincident: '',
        attestation_assurance: ''
      }
      this.currentStep = 0; // Reset to the first step
      
      // Réinitialiser la présélection du véhicule
      this.selectedVehicule = null;
      this.searchQuery = '';
      this.searchResults = [];
      this.showSearchResults = false;
    },

    // Méthodes pour la recherche de véhicules
    async searchVehicules() {
      console.log('🔍 searchVehicules appelée avec:', this.searchQuery);
      
      // Annuler la recherche précédente
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      // Attendre 300ms avant de lancer la recherche
      this.searchTimeout = setTimeout(async () => {
        const query = this.searchQuery.trim();
        
        console.log('🔍 Exécution de la recherche pour:', query);
        
        // Si la recherche est vide, masquer les résultats
        if (!query) {
          console.log('❌ Recherche vide, masquage des résultats');
          this.searchResults = [];
          this.showSearchResults = false;
          this.searching = false;
          return;
        }

        // Recherche à partir de 1 caractère
        if (query.length < 1) {
          console.log('❌ Recherche trop courte, masquage des résultats');
          this.searchResults = [];
          this.showSearchResults = false;
          this.searching = false;
          return;
        }

        this.searching = true;
        this.searchResults = [];
        this.showSearchResults = true;
        
        console.log('🔍 Recherche de véhicules:', query);
        
        try {
          const response = await vehiculesService.search({
            query: query,
            limit: 10
          });

          console.log('✅ Réponse API:', response);

          if (response.success) {
            this.searchResults = response.data;
            console.log('📋 Résultats trouvés:', this.searchResults.length);
          } else {
            console.error('❌ Erreur API:', response.error);
            this.searchResults = [];
            // Ne pas afficher d'erreur à l'utilisateur pour une recherche vide
            if (response.error !== 'La requête de recherche doit contenir au moins 1 caractère') {
              this.showMessage('Erreur lors de la recherche de véhicules', 'error');
            }
          }
        } catch (error) {
          console.error('❌ Erreur lors de la recherche de véhicules:', error);
          this.searchResults = [];
          // Ne pas afficher d'erreur réseau à l'utilisateur pour une recherche
          // this.showMessage(`Erreur lors de la recherche: ${error.message}`, 'error');
        } finally {
          this.searching = false;
        }
      }, 300); // Délai de 300ms pour éviter trop de requêtes
    },

    selectVehicule(vehicule) {
      if (!vehicule || !vehicule.id_vehicule) {
        console.error('Véhicule invalide:', vehicule);
        return;
      }
      this.selectedVehicule = vehicule;
      this.formData.vehicule_id = vehicule.id_vehicule;
      this.searchQuery = '';
      this.searchResults = [];
      this.showSearchResults = false;
      this.searching = false;

      // Forcer le blur sur l'input de recherche
      this.$nextTick(() => {
        const input = this.$el.querySelector('.ios-form-input');
        if (input) input.blur();
      });

      console.log('✅ Véhicule sélectionné:', vehicule);
      this.showMessage(`Véhicule ${vehicule.marque} ${vehicule.type} sélectionné`, 'success');
    },

    clearVehicule() {
      this.selectedVehicule = null;
      this.formData.vehicule_id = '';
      this.searchQuery = '';
      this.searchResults = [];
      this.showSearchResults = false;
      this.searching = false;
      
      console.log('🔄 Véhicule désélectionné');
    },

    createNewVehicule() {
      // Pré-remplir le formulaire avec la recherche si elle ressemble à une immatriculation
      if (this.searchQuery && /^[A-Z0-9-]{5,20}$/i.test(this.searchQuery.trim())) {
        // Rediriger vers le formulaire d'ajout de véhicule avec l'immatriculation pré-remplie
        this.$router.push(`/vehicle/add?immatriculation=${encodeURIComponent(this.searchQuery.trim().toUpperCase())}`);
      } else {
        this.$router.push('/vehicle/add');
      }
    },

    showMessage(text, type = 'info') {
      this.message = { text, type }
      setTimeout(() => {
        this.message = null
      }, 5000)
    },

    handleClickOutside(event) {
      console.log('🖱️ handleClickOutside appelé sur:', event.target);
      
      // Vérifier si le clic est sur un élément de la recherche
      const searchContainer = document.querySelector('.search-container');
      const searchResults = document.querySelector('.search-results');
      const noResults = document.querySelector('.no-results');
      const searchLoading = document.querySelector('.search-loading');
      const selectedVehicule = document.querySelector('.selected-vehicule');

      console.log('🔍 Éléments trouvés:', {
        searchContainer: !!searchContainer,
        searchResults: !!searchResults,
        noResults: !!noResults,
        searchLoading: !!searchLoading,
        selectedVehicule: !!selectedVehicule
      });

      // Si on clique en dehors de tous les éléments de recherche
      if (searchContainer && 
          !searchContainer.contains(event.target) && 
          searchResults && !searchResults.contains(event.target) &&
          noResults && !noResults.contains(event.target) &&
          searchLoading && !searchLoading.contains(event.target)) {
        
        console.log('🚪 Fermeture des résultats de recherche');
        // Fermer les résultats seulement si on a cliqué vraiment en dehors
        this.showSearchResults = false;
        this.searchQuery = '';
        this.searchResults = [];
      } else {
        console.log('✅ Clic dans la zone de recherche, pas de fermeture');
      }

      // Pour le véhicule sélectionné, on ne le ferme pas automatiquement
      // L'utilisateur doit cliquer sur le bouton "Changer" pour le modifier
    },

    handleSearchEnter() {
      // Si on a des résultats et qu'on appuie sur Entrée, sélectionner le premier
      if (this.searchResults.length > 0) {
        this.selectVehicule(this.searchResults[0]);
      } else {
        // Sinon, forcer une nouvelle recherche
        this.searchVehicules();
      }
    },

    // Méthodes pour la navigation entre les étapes
    nextStep() {
      if (this.canProceed && this.currentStep < this.steps.length - 1) {
        this.currentStep++;
      }
    },

    previousStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },

    goToStep(stepIndex) {
      // Permettre de revenir en arrière ou d'aller à une étape déjà visitée
      if (stepIndex <= this.currentStep || stepIndex === 0) {
        this.currentStep = stepIndex;
      } else if (stepIndex > this.currentStep) {
        // Si on veut aller à une étape supérieure, on vérifie si on peut passer
        if (this.canProceed) {
          this.currentStep = stepIndex;
        } else {
          this.showMessage('Veuillez remplir tous les champs de l\'étape précédente.', 'warning');
        }
      }
    }
  }
}
</script>

<style scoped>
/* FORCER LES STYLES POUR LA LISIBILITÉ AVEC LE NOUVEAU DÉGRADÉ */

/* Reset complet pour les selects */
select {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif !important;
  font-size: 16px !important;
  color: #000000 !important;
  background: rgba(255, 255, 255, 0.95) !important;
  border: 2px solid rgba(0, 0, 0, 0.1) !important;
  border-radius: 8px !important;
  padding: 16px !important;
  width: 100% !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e") !important;
  background-repeat: no-repeat !important;
  background-position: right 12px center !important;
  background-size: 16px !important;
  padding-right: 40px !important;
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
}

select:focus {
  outline: none !important;
  border-color: #007AFF !important;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1) !important;
  background: rgba(255, 255, 255, 1) !important;
  color: #000000 !important;
}

select:hover {
  border-color: #007AFF !important;
  background: rgba(255, 255, 255, 1) !important;
}

/* Options des selects */
select option {
  background: rgba(255, 255, 255, 1) !important;
  color: #000000 !important;
  padding: 8px !important;
  font-size: 16px !important;
}

select option[value=""] {
  color: #999999 !important;
  font-style: italic !important;
}

select option:hover {
  background: rgba(0, 122, 255, 0.1) !important;
}

/* Labels */
.ios-form-label {
  display: block !important;
  font-weight: 600 !important;
  color: #ffffff !important;
  margin-bottom: 8px !important;
  font-size: 16px !important;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8) !important;
}

/* Groupes de formulaires */
.ios-form-group {
  margin-bottom: 24px !important;
}

/* Cartes */
.ios-card {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border-radius: var(--ios-radius-lg) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
  padding: var(--ios-spacing-lg) !important;
  margin-bottom: var(--ios-spacing-lg) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
  color: white !important;
  animation: cardPulse 6s ease-in-out infinite !important;
}


.ios-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-2px) !important;
}

/* Titres */
.ios-section-title {
  font-size: 24px !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  margin-bottom: 24px !important;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8) !important;
}

.ios-section-subtitle {
  font-size: 16px !important;
  color: #ffffff !important;
  margin-bottom: 24px !important;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8) !important;
}

/* Grilles */
.ios-grid {
  display: grid !important;
  gap: 16px !important;
}

.ios-grid-2 {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
}

.ios-grid-3 {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
}

.ios-grid-4 {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
}

/* Boutons */
.ios-button {
  background: #007AFF !important;
  color: white !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 8px 24px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 4px !important;
  text-decoration: none !important;
  min-height: 44px !important;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif !important;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3) !important;
}

.ios-button:hover {
  background: #0056CC !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 6px 20px rgba(0, 122, 255, 0.4) !important;
  color: white !important;
}

.ios-button.secondary {
  background: rgba(255, 255, 255, 0.9) !important;
  color: #007AFF !important;
  border: 2px solid #007bff00 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

.ios-button.secondary:hover {
  background: #007AFF !important;
  color: white !important;
}

.ios-button.success {
  background: #34C759 !important;
  box-shadow: 0 4px 12px rgba(52, 199, 89, 0.3) !important;
}

.ios-button.success:hover {
  background: #28A745 !important;
  box-shadow: 0 6px 20px rgba(52, 199, 89, 0.4) !important;
}

.ios-button:disabled {
  background: #999999 !important;
  cursor: not-allowed !important;
  transform: none !important;
  box-shadow: none !important;
  color: white !important;
}

/* Messages */
.ios-message {
  padding: 16px !important;
  border-radius: 8px !important;
  margin-bottom: 16px !important;
  font-weight: 500 !important;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif !important;
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
}

.ios-message.success {
  background: rgba(52, 199, 89, 0.1) !important;
  color: #ffffff !important;
  border: 1px solid rgba(52, 199, 89, 0.3) !important;
}

.ios-message.error {
  background: rgba(255, 59, 48, 0.1) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 59, 48, 0.3) !important;
}

.ios-message.warning {
  background: rgba(239, 146, 16, 0.388) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 149, 0, 0.3) !important;
}

.ios-message.info {
  background: rgba(90, 200, 250, 0.1) !important;
  color: #f1f1f1 !important;
  border: 1px solid rgba(90, 200, 250, 0.3) !important;
}

/* Loading */
.ios-loading {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 32px !important;
}

.ios-spinner {
  width: 24px !important;
  height: 24px !important;
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  border-top: 2px solid #007AFF !important;
  border-radius: 50% !important;
  animation: spin 1s linear infinite !important;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Utilitaires */
.justify-content-end {
  justify-content: flex-end !important;
}

.d-flex {
  display: flex !important;
}

.gap-3 {
  gap: 1rem !important;
}



.ios-mb-lg {
  margin-bottom: 24px !important;
}

/* Couleurs de texte */
.text-danger {
  color: #FF3B30 !important;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .ios-grid-4 {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
  }
  
  .ios-card {
    padding: 16px !important;
  }
  
  .ios-section-title {
    font-size: 20px !important;
  }
}

/* Styles pour la barre de recherche */
.search-container {
  position: relative !important;
  margin-bottom: 16px !important;
  z-index: 10000 !important;
}

.input-with-icon {
  position: relative !important;
  z-index: 10001 !important;
}

.input-with-icon .ios-form-input {
  padding-left: 40px !important;
  position: relative !important;
  z-index: 10001 !important;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif !important;
  font-size: 16px !important;
  color: #000000 !important;
  background: rgba(255, 255, 255, 0.95) !important;
  border: 2px solid rgba(0, 0, 0, 0.1) !important;
  border-radius: 8px !important;
  padding: 16px !important;
  width: 100% !important;
  transition: all 0.2s ease !important;
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
}

.input-with-icon .ios-form-input:focus {
  outline: none !important;
  border-color: #007AFF !important;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1) !important;
  background: rgba(255, 255, 255, 1) !important;
  color: #000000 !important;
}

.input-with-icon .ios-form-input:hover {
  border-color: #007AFF !important;
  background: rgba(255, 255, 255, 1) !important;
}

.input-icon {
  width: 18px !important;
  height: 18px !important;
  color: #007AFF !important;
  position: absolute !important;
  left: 12px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  z-index: 10002 !important;
}

.search-results {
  position: absolute !important;
  top: 100% !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 20 !important;
  margin-top: 4px !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  border-radius: 8px !important;
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
  max-height: 300px !important;
  overflow-y: auto !important;
  animation: fadeIn 0.2s ease-out !important;
  pointer-events: auto !important;
}

/* S'assurer que les éléments parents n'interfèrent pas */
.ios-card {
  position: relative !important;
  z-index: 1 !important;
}

.ios-section {
  position: relative !important;
  z-index: 1 !important;
}

/* Forcer la liste au-dessus de tout */
.search-results * {
  position: relative !important;
  z-index: inherit !important;
}

@keyframes fadeIn {
  from {
    opacity: 0 !important;
    transform: translateY(-10px) !important;
  }
  to {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
}

.search-results-header {
  padding: 12px 16px !important;
  background: rgba(0, 122, 255, 0.1) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
  color: #000000 !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  position: sticky !important;
  top: 0 !important;
  z-index: 1 !important;
}

.vehicule-list {
  max-height: 250px !important;
  overflow-y: auto !important;
}

.vehicule-item {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 12px 16px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  position: relative !important;
}

.vehicule-item:hover {
  background: rgba(0, 122, 255, 0.05) !important;
  transform: translateX(4px) !important;
}

.vehicule-item:active {
  background: rgba(0, 122, 255, 0.1) !important;
  transform: translateX(2px) !important;
}

.vehicule-item:last-child {
  border-bottom: none !important;
}

.vehicule-info {
  flex: 1 !important;
}

.vehicule-main {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  margin-bottom: 4px !important;
}

.vehicule-main strong {
  color: #000000 !important;
  font-weight: 600 !important;
  font-size: 16px !important;
}

.immatriculation {
  background: rgba(0, 122, 255, 0.1) !important;
  color: #007AFF !important;
  padding: 4px 8px !important;
  border-radius: 4px !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  border: 1px solid rgba(0, 122, 255, 0.2) !important;
  text-transform: uppercase !important;
}

.vehicule-details {
  display: flex !important;
  gap: 12px !important;
  font-size: 12px !important;
  color: #666666 !important;
}

.remisage {
  color: #FF9500 !important;
  font-weight: 500 !important;
}

.controles {
  color: #34C759 !important;
  font-weight: 500 !important;
}

.chevron-icon {
  width: 16px !important;
  height: 16px !important;
  color: #007AFF !important;
  margin-left: 12px !important;
  transition: transform 0.2s ease !important;
}

.vehicule-item:hover .chevron-icon {
  transform: translateX(4px) !important;
}

.no-results {
  padding: 24px 16px !important;
  text-align: center !important;
  animation: fadeIn 0.3s ease-out !important;
}

.no-results-content {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 12px !important;
}

.no-results-icon {
  width: 48px !important;
  height: 48px !important;
  color: #ffffff !important;
  margin-bottom: 8px !important;
}

.no-results h4 {
  color: #ffffff !important;
  font-weight: 600 !important;
  margin: 0 !important;
  font-size: 16px !important;
}

.no-results p {
  color: #b1b0b0 !important;
  margin: 0 !important;
  font-size: 14px !important;
}

.search-loading {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
  padding: 16px !important;
  color: #666666 !important;
  font-size: 14px !important;
  animation: fadeIn 0.2s ease-out !important;
}

.loading-icon {
  width: 20px !important;
  height: 20px !important;
  color: #007AFF !important;
  animation: spin 1s linear infinite !important;
}

@keyframes spin {
  from {
    transform: rotate(0deg) !important;
  }
  to {
    transform: rotate(360deg) !important;
  }
}

.selected-vehicule {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 12px 16px !important;
  background: rgba(52, 199, 89, 0.1) !important;
  border: 1px solid rgba(52, 199, 89, 0.2) !important;
  border-radius: 8px !important;
  margin-top: 8px !important;
  animation: fadeIn 0.3s ease-out !important;
}

.selected-vehicule-info {
  flex: 1 !important;
}

.selected-vehicule .vehicule-main strong {
  color: #f9f9f9 !important;
}

.selected-vehicule .immatriculation {
  background: rgba(52, 199, 89, 0.2) !important;
  color: #34C759 !important;
  border-color: rgba(52, 199, 89, 0.3) !important;
  margin-top: 25px;
}

.ios-button.small {
  padding: 6px 12px !important;
  font-size: 14px !important;
  min-height: 36px !important;
}

.ios-button.secondary {
  background: rgba(0, 0, 0, 0.1) !important;
  color: #000000 !important;
}

.ios-button.secondary:hover {
  background: rgba(0, 0, 0, 0.15) !important;
}

/* Correction pour la carte véhicule afin de contenir la liste déroulante */
.ios-card.vehicule-info-card {
  overflow: visible !important;
  position: relative !important;
  z-index: 10 !important;
}

/* Correction du z-index de la liste déroulante */
.search-results {
  z-index: 20 !important;
}

.input-icon[data-v-552c4a2a] {
    width: 18px !important;
    height: 18px !important;
    color: #007aff00 !important;
    position: absolute !important;
    left: 12px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    z-index: 10002 !important;
}

.ios-mb-md {
    COLOR: rgb(255, 255, 255);
    font-size: 24px !important;
    font-weight: 700 !important;
    margin-bottom: 16px !important;
}

.ios-form-input,.ios-form-select
 {
    color: #ffffff !important;
}

/* Styles pour le formulaire progressif */
.progress-card {
  margin-bottom: 24px !important;
}

.progress-steps {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  gap: 16px !important;
  padding: 0 16px !important;
}

.progress-step {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 8px !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  flex: 1 !important;
  position: relative !important;
}

.progress-step:not(:last-child)::after {
  content: '' !important;
  position: absolute !important;
  top: 20px !important;
  left: 50% !important;
  width: 100% !important;
  height: 2px !important;
  background: rgba(0, 0, 0, 0.1) !important;
  z-index: 1 !important;
}

.progress-step.completed:not(:last-child)::after {
  background: #34C759 !important;
}

.step-number {
  width: 40px !important;
  height: 40px !important;
  border-radius: 50% !important;
  background: rgba(0, 0, 0, 0.1) !important;
  color: #666666 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  transition: all 0.3s ease !important;
  position: relative !important;
  z-index: 2 !important;
}

.progress-step.active .step-number {
  background: #007AFF !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3) !important;
}

.progress-step.completed .step-number {
  background: #34C759 !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(52, 199, 89, 0.3) !important;
}

.step-label {
  font-size: 12px !important;
  font-weight: 500 !important;
  color: #666666 !important;
  text-align: center !important;
  transition: all 0.3s ease !important;
}

.progress-step.active .step-label {
  color: #007AFF !important;
  font-weight: 600 !important;
}

.progress-step.completed .step-label {
  color: #34C759 !important;
  font-weight: 600 !important;
}

.step-content {
  min-height: 400px !important;
}

.navigation-card {
  margin-top: 24px !important;
  
}

.step-actions {
  display: flex !important;
  gap: 12px !important;
}

/* Styles pour le récapitulatif */
.recap-section {
  padding: 24px 0 !important;
}

.recap-section h3 {
  color: #000000 !important;
  font-size: 20px !important;
  font-weight: 600 !important;
  margin-bottom: 24px !important;
}

.recap-grid {
  display: grid !important;
  gap: 16px !important;
  margin-bottom: 32px !important;
}

.recap-item {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 12px 16px !important;
  background: rgba(0, 122, 255, 0.05) !important;
  border-radius: 8px !important;
  border: 1px solid rgba(0, 122, 255, 0.1) !important;
}

.recap-item strong {
  color: #000000 !important;
  font-weight: 600 !important;
}

.recap-summary {
  background: rgba(52, 199, 89, 0.05) !important;
  border: 1px solid rgba(52, 199, 89, 0.1) !important;
  border-radius: 8px !important;
  padding: 20px !important;
}

.recap-summary h4 {
  color: #000000 !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  margin-bottom: 16px !important;
}

.recap-summary ul {
  list-style: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

.recap-summary li {
  padding: 8px 0 !important;
  color: #000000 !important;
  font-size: 14px !important;
}

/* Responsive pour les étapes */
@media (max-width: 768px) {
  .progress-steps {
    flex-direction: column !important;
    gap: 12px !important;
  }
  
  .progress-step:not(:last-child)::after {
    display: none !important;
  }
  
  .step-label {
    font-size: 14px !important;
  }
  
  .step-number {
    width: 36px !important;
    height: 36px !important;
    font-size: 14px !important;
  }
}

/* Styles pour l'indicateur de progression */
.progress-card {
  background: rgb(255 255 255 / 2%) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
  padding: 24px !important;
  margin-bottom: 24px !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.progress-steps {
  display: flex !important;
  justify-content: space-around !important;
  margin-bottom: 24px !important;
}

.progress-step {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
}

.progress-step .step-number {
  width: 40px !important;
  height: 40px !important;
  background: #007AFF !important;
  color: white !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 18px !important;
  font-weight: 700 !important;
  margin-bottom: 8px !important;
  border: 2px solid transparent !important;
  transition: all 0.3s ease !important;
}

.progress-step .step-label {
  font-size: 14px !important;
  color: #ffffff !important;
  font-weight: 500 !important;
  text-align: center !important;
}

.progress-step.active .step-number {
  background: white !important;
  color: #007AFF !important;
  border-color: #007AFF !important;
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1) !important;
}

.progress-step.completed .step-number {
  background: #34C759 !important;
  color: white !important;
  border-color: #34C759 !important;
  box-shadow: 0 0 0 4px rgba(52, 199, 89, 0.1) !important;
}

.progress-step.disabled {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
  pointer-events: none !important;
}

/* Styles pour le contenu des étapes */
.step-content {
  background: rgba(0, 0, 0, 0.014) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
  padding: 24px !important;
  margin-bottom: 24px !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.recap-section {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
  padding: 24px !important;
  margin-top: 24px !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.recap-grid {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
  gap: 16px !important;
  margin-bottom: 24px !important;
}

.recap-item {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  font-size: 16px !important;
  color: #000000 !important;
  font-weight: 500 !important;
}

.recap-item strong {
  color: #007AFF !important;
  font-weight: 600 !important;
}

.recap-summary {
  margin-top: 24px !important;
  padding-top: 24px !important;
  border-top: 1px solid rgba(0, 0, 0, 0.1) !important;
}

.recap-summary h4 {
  font-size: 20px !important;
  color: #000000 !important;
  margin-bottom: 16px !important;
  font-weight: 700 !important;
}

.recap-summary ul {
  list-style: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

.recap-summary li {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  font-size: 15px !important;
  color: #333333 !important;
  margin-bottom: 8px !important;
}

.recap-summary li::before {
  content: "•" !important;
  color: #007AFF !important;
  font-weight: 700 !important;
  margin-right: 8px !important;
}

.navigation-card {
  background: rgb(255 255 255 / 2%) !important; 
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
  padding: 24px !important;
  margin-top: 24px !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.step-actions {
  display: flex !important;
  gap: 16px !important;
  justify-content: flex-end !important;
}

select {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif !important;
  font-size: 16px !important;
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: var(--ios-radius-lg) !important;
  padding: var(--ios-spacing-md) !important;
  width: 100% !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
 
  background-position: right 12px center !important;
  background-size: 16px !important;
  padding-right: 40px !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1) !important;
}

select:hover,
select:focus {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}



 select:hover {
    background: rgba(0, 0, 0, 0.164) !important;
    color: #ffffff !important;
}

select:focus {
    background: rgba(0, 0, 0, 0.623) !important;
    color: #ffffff !important;
}

select option
 {
    background: rgb(52 131 117 / 20%) !important;
    color: #ffffff !important;
    padding: 8px !important;
    font-size: 16px !important;
    border: none;
    /* border-radius: 12px; */
}

select option[value=""] {
    color: #cccccc !important;
    font-style: italic !important;
}

</style> 
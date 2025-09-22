<template>
  <div class="ios-fade-in">
    <!-- En-tête -->
    <div class="ios-section">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <button @click="$router.go(-1)" class="ios-button secondary" style="margin-bottom: 30px;">
            Retour
          </button>
          <h1 class="ios-section-title">{{ vehicle.marque }} {{ vehicle.type }}</h1>
          <p class="ios-section-subtitle">{{ vehicle.immatriculation }}</p>
        </div>
        <div class="d-flex gap-3">
          <button @click="editVehicle" class="ios-button">
            Modifier
          </button>
          <button @click="newControle" class="ios-button success">
            Nouveau contrôle
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="ios-section">
      <div class="ios-card">
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Chargement...</span>
          </div>
          <p class="mt-3">Chargement des données du véhicule...</p>
        </div>
      </div>
    </div>

    <div v-else>
      <!-- Informations du véhicule -->
      <div class="ios-section">
        <h2 class="ios-section-title">
          <Car class="title-icon" />
          Informations du véhicule
        </h2>
        <div class="ios-grid ios-grid-2">
          <div class="ios-card">
            <div class="info-grid">
              <div class="info-item">
                <label>Marque</label>
                <span>{{ vehicle.marque || 'Non renseigné' }}</span>
              </div>
              <div class="info-item">
                <label>Type</label>
                <span>{{ vehicle.type || 'Non renseigné' }}</span>
              </div>
              <div class="info-item">
                <label>Immatriculation</label>
                <span class="immatriculation">{{ vehicle.immatriculation }}</span>
              </div>
              <div class="info-item">
                <label>Remisage domicile</label>
                <span :class="vehicle.remisage_domicile ? 'text-success' : 'text-warning'">
                  {{ vehicle.remisage_domicile ? 'Oui' : 'Non' }}
                </span>
              </div>
            </div>
          </div>


        </div>
      </div>

      <!-- Statistiques -->
      <div class="ios-section">
        <h2 class="ios-section-title">
          <BarChart3 class="title-icon" />
          Statistiques
        </h2>
        <div class="ios-grid ios-grid-4">
          <div class="ios-stat-card">
            <div class="ios-stat-icon">
              <ClipboardList class="stat-icon" />
            </div>
            <div class="ios-stat-number">{{ controles.length }}</div>
            <div class="ios-stat-label">Contrôles</div>
          </div>
          <div class="ios-stat-card">
            <div class="ios-stat-icon">
              <Calendar class="stat-icon" />
            </div>
            <div class="ios-stat-number">{{ getDernierControleDate() }}</div>
            <div class="ios-stat-label">Dernier contrôle</div>
          </div>
          <div class="ios-stat-card">
            <div class="ios-stat-icon">
              <CheckCircle class="stat-icon" />
            </div>
            <div class="ios-stat-number">{{ getControlesRecents() }}</div>
            <div class="ios-stat-label">7 derniers jours</div>
          </div>
          <div class="ios-stat-card">
            <div class="ios-stat-icon">
              <AlertTriangle class="stat-icon" />
            </div>
            <div class="ios-stat-number">{{ getProblemesDetectes() }}</div>
            <div class="ios-stat-label">Problèmes détectés</div>
          </div>
        </div>
      </div>

      <!-- Historique des contrôles -->
      <div class="ios-section">
        <div class="d-flex justify-content-between align-items-center">
          <h2 class="ios-section-title">
            <History class="title-icon" />
            Historique des contrôles
          </h2>
        </div>
      </div>

      <!-- Vue tableau -->
      <div>
        <div v-if="controles.length === 0" class="ios-card">
          <div class="text-center py-5">
            <ClipboardList class="empty-icon" />
            <h3 class="ios-mb-md">Aucun contrôle enregistré</h3>
            <p class="ios-mb-lg">Ce véhicule n'a pas encore de contrôle enregistré.</p>
            <button @click="newControle" class="ios-button success">
              <ClipboardList class="button-icon" />
              Effectuer le premier contrôle
            </button>
          </div>
        </div>

        <div v-else class="ios-card">
          <div class="table-responsive">
            <table class="ios-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Conducteur</th>
                  <th>État salissure</th>
                  <th>Problèmes détectés</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="controle in controles" :key="controle.id_controle" class="controle-row">
                  <td>{{ formatDate(controle.date_controle) }}</td>
                  <td>
                    <span v-if="controle.conducteur_nom">
                      {{ controle.conducteur_prenom }} {{ controle.conducteur_nom }}
                    </span>
                    <span v-else class="text-muted">Non renseigné</span>
                  </td>
                  <td>
                    <span class="ios-badge" :class="getSalissureClass(controle.etat_salissure)">
                      {{ getSalissureLabel(controle.etat_salissure) }}
                    </span>
                  </td>
                  <td>
                    <div class="problemes-list">
                      <span v-if="getProblemesControle(controle).length === 1 && getProblemesControle(controle)[0] === 'Aucun problème'" class="probleme-tag success">
                        Aucun problème
                      </span>
                      <span v-else class="probleme-count">
                        {{ getProblemesControle(controle).length }} problème{{ getProblemesControle(controle).length > 1 ? 's' : '' }}
                      </span>
                    </div>
                  </td>
                  <td>
                    <button @click="viewControle(controle.id_controle)" class="ios-button secondary small">
                      Voir
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Dernier contrôle détaillé -->
      <div v-if="controles.length > 0" class="ios-section">
        <h2 class="ios-section-title">
          <Search class="title-icon" />
          Dernier contrôle détaillé
        </h2>
        <div class="ios-card">
          <div class="controle-detail">
            <div class="controle-header">
              <div class="controle-date">
                <Calendar class="detail-icon" />
                {{ formatDate(controles[0].date_controle) }}
              </div>
              <div class="controle-conducteur" v-if="controles[0].conducteur_nom">
                <User class="detail-icon" />
                {{ controles[0].conducteur_prenom }} {{ controles[0].conducteur_nom }}
              </div>
              <div class="controle-controleur" v-if="controles[0].nom_controleur">
                <User class="detail-icon" />
                Contrôlé par: {{ controles[0].nom_controleur }}
              </div>
            </div>

            <!-- Sections repliables -->
            <div class="accordion-container">
              <!-- Section Pneumatiques & Freins -->
              <div class="accordion-section">
                <div class="accordion-header" @click="toggleAccordion('pneusFreins')">
                  <div class="accordion-title">
                    <Wrench class="section-icon" />
                    Pneumatiques & Freins
                  </div>
                  <ChevronDown class="accordion-icon" :class="{ 'rotated': openSections.pneusFreins }" />
                </div>
                <div class="accordion-content" v-show="openSections.pneusFreins">
                  <div class="ios-grid ios-grid-2">
                    <!-- Pneumatiques -->
                    <div class="controle-section">
                      <h4 class="section-title">Pneumatiques</h4>
                      <div class="controle-items">
                        <div class="controle-item">
                          <span>AVD:</span>
                          <span :class="getPneusClass(controles[0].usure_pneus_avd)">
                            {{ getPneusLabel(controles[0].usure_pneus_avd) }}
                          </span>
                        </div>
                        <div class="controle-item">
                          <span>AVG:</span>
                          <span :class="getPneusClass(controles[0].usure_pneus_avg)">
                            {{ getPneusLabel(controles[0].usure_pneus_avg) }}
                          </span>
                        </div>
                        <div class="controle-item">
                          <span>ARD:</span>
                          <span :class="getPneusClass(controles[0].usure_pneus_ard)">
                            {{ getPneusLabel(controles[0].usure_pneus_ard) }}
                          </span>
                        </div>
                        <div class="controle-item">
                          <span>ARG:</span>
                          <span :class="getPneusClass(controles[0].usure_pneus_arg)">
                            {{ getPneusLabel(controles[0].usure_pneus_arg) }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Freins -->
                    <div class="controle-section">
                      <h4 class="section-title">Freins</h4>
                      <div class="controle-items">
                        <div class="controle-item">
                          <span>Plaquettes AV:</span>
                          <span :class="getFreinsClass(controles[0].plaquette_frein_av)">
                            {{ getFreinsLabel(controles[0].plaquette_frein_av) }}
                          </span>
                        </div>
                        <div class="controle-item">
                          <span>Plaquettes AR:</span>
                          <span :class="getFreinsClass(controles[0].plaquette_frein_ar)">
                            {{ getFreinsLabel(controles[0].plaquette_frein_ar) }}
                          </span>
                        </div>
                        <div class="controle-item">
                          <span>Disques AV:</span>
                          <span :class="getFreinsClass(controles[0].disque_frein_av)">
                            {{ getFreinsLabel(controles[0].disque_frein_av) }}
                          </span>
                        </div>
                        <div class="controle-item">
                          <span>Disques AR:</span>
                          <span :class="getFreinsClass(controles[0].disque_frein_ar)">
                            {{ getFreinsLabel(controles[0].disque_frein_ar) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section Équipements & État général -->
              <div class="accordion-section">
                <div class="accordion-header" @click="toggleAccordion('equipements')">
                  <div class="accordion-title">
                    <Shield class="section-icon" />
                    Équipements & État général
                  </div>
                  <ChevronDown class="accordion-icon" :class="{ 'rotated': openSections.equipements }" />
                </div>
                <div class="accordion-content" v-show="openSections.equipements">
                  <div class="ios-grid ios-grid-2">
                    <!-- Équipements -->
                    <div class="controle-section">
                      <h4 class="section-title">Équipements</h4>
                      <div class="controle-items">
                        <div class="controle-item">
                          <span>Extincteur:</span>
                          <span :class="getEquipementClass(controles[0].extincteur)">
                            {{ getEquipementLabel(controles[0].extincteur) }}
                          </span>
                        </div>
                        <div class="controle-item">
                          <span>Roue secours:</span>
                          <span :class="getEquipementClass(controles[0].roue_secours)">
                            {{ getEquipementLabel(controles[0].roue_secours) }}
                          </span>
                        </div>
                        <div class="controle-item">
                          <span>Kit sécurité:</span>
                          <span :class="getEquipementClass(controles[0].kit_securite)">
                            {{ getEquipementLabel(controles[0].kit_securite) }}
                          </span>
                        </div>
                        <div class="controle-item">
                          <span>Balais:</span>
                          <span :class="getEquipementClass(controles[0].balais_essuie_glace)">
                            {{ getEquipementLabel(controles[0].balais_essuie_glace) }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- État général -->
                    <div class="controle-section">
                      <h4 class="section-title">État général</h4>
                      <div class="controle-items">
                        <div class="controle-item">
                          <span>Salissure:</span>
                          <span :class="getSalissureClass(controles[0].etat_salissure)">
                            {{ getSalissureLabel(controles[0].etat_salissure) }}
                          </span>
                        </div>
                        <div class="controle-item">
                          <span>Plaque immatriculation:</span>
                          <span>{{ controles[0].plaque_immatriculation || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>Antenne:</span>
                          <span>{{ controles[0].antenne || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>Repose-tête:</span>
                          <span>{{ controles[0].repose_tete || 'Non renseigné' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section Huiles & Enjoliveurs -->
              <div class="accordion-section">
                <div class="accordion-header" @click="toggleAccordion('huilesEnjoliveurs')">
                  <div class="accordion-title">
                    <Zap class="section-icon" />
                    Huiles & Enjoliveurs
                  </div>
                  <ChevronDown class="accordion-icon" :class="{ 'rotated': openSections.huilesEnjoliveurs }" />
                </div>
                <div class="accordion-content" v-show="openSections.huilesEnjoliveurs">
                  <div class="ios-grid ios-grid-2">
                    <!-- Huiles & Liquides -->
                    <div class="controle-section">
                      <h4 class="section-title">Huiles & Liquides</h4>
                      <div class="controle-items">
                        <div class="controle-item">
                          <span>Huile moteur:</span>
                          <span :class="getFreinsClass(controles[0].huile_moteur)">
                            {{ getFreinsLabel(controles[0].huile_moteur) }}
                          </span>
                        </div>
                        <div class="controle-item">
                          <span>Liquide refroidissement:</span>
                          <span :class="getFreinsClass(controles[0].liquide_refroidissement)">
                            {{ getFreinsLabel(controles[0].liquide_refroidissement) }}
                          </span>
                        </div>
                        <div class="controle-item">
                          <span>Lave-glace:</span>
                          <span :class="getFreinsClass(controles[0].lave_glace)">
                            {{ getFreinsLabel(controles[0].lave_glace) }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Enjoliveurs -->
                    <div class="controle-section">
                      <h4 class="section-title">Enjoliveurs</h4>
                      <div class="controle-items">
                        <div class="controle-item">
                          <span>AVD:</span>
                          <span>{{ controles[0].presence_enjoliveur_avd || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>AVG:</span>
                          <span>{{ controles[0].presence_enjoliveur_avg || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>ARD:</span>
                          <span>{{ controles[0].presence_enjoliveur_ard || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>ARG:</span>
                          <span>{{ controles[0].presence_enjoliveur_arg || 'Non renseigné' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section Tapis & Documents -->
              <div class="accordion-section">
                <div class="accordion-header" @click="toggleAccordion('tapisDocuments')">
                  <div class="accordion-title">
                    <Shield class="section-icon" />
                    Tapis & Documents
                  </div>
                  <ChevronDown class="accordion-icon" :class="{ 'rotated': openSections.tapisDocuments }" />
                </div>
                <div class="accordion-content" v-show="openSections.tapisDocuments">
                  <div class="ios-grid ios-grid-2">
                    <!-- Tapis -->
                    <div class="controle-section">
                      <h4 class="section-title">Tapis</h4>
                      <div class="controle-items">
                        <div class="controle-item">
                          <span>AVD:</span>
                          <span>{{ controles[0].Tapis_avd || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>AVG:</span>
                          <span>{{ controles[0].Tapis_avg || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>ARD:</span>
                          <span>{{ controles[0].Tapis_ard || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>ARG:</span>
                          <span>{{ controles[0].Tapis_arg || 'Non renseigné' }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Documents & Sécurité -->
                    <div class="controle-section">
                      <h4 class="section-title">Documents & Sécurité</h4>
                      <div class="controle-items">
                        <div class="controle-item">
                          <span>Carte carburant:</span>
                          <span>{{ controles[0].carte_carburant || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>Cric manivelle:</span>
                          <span>{{ controles[0].cric_manivelle || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>TAG:</span>
                          <span>{{ controles[0].TAG || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>Photocopie carte grise:</span>
                          <span>{{ controles[0].Photocopie_carte_grise || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>Constat amiable:</span>
                          <span>{{ controles[0].constat_amiable_vierge || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>Rapport d'incident:</span>
                          <span>{{ controles[0].rapport_dincident || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>Attestation assurance:</span>
                          <span>{{ controles[0].attestation_assurance || 'Non renseigné' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section Éclairage -->
              <div class="accordion-section">
                <div class="accordion-header" @click="toggleAccordion('eclairage')">
                  <div class="accordion-title">
                    <Zap class="section-icon" />
                    Éclairage
                  </div>
                  <ChevronDown class="accordion-icon" :class="{ 'rotated': openSections.eclairage }" />
                </div>
                <div class="accordion-content" v-show="openSections.eclairage">
                  <div class="ios-grid ios-grid-2">
                    <!-- Éclairage principal -->
                    <div class="controle-section">
                      <h4 class="section-title">Éclairage principal</h4>
                      <div class="controle-items">
                        <div class="controle-item">
                          <span>Feux position AV:</span>
                          <span>{{ controles[0].feux_position_av || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>Feux position AR:</span>
                          <span>{{ controles[0].feux_position_ar || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>Croisement droite:</span>
                          <span>{{ controles[0].feux_croisement_droite || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>Croisement gauche:</span>
                          <span>{{ controles[0].feux_croisement_gauche || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>Route AV droite:</span>
                          <span>{{ controles[0].feux_route_av_droite || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>Route AV gauche:</span>
                          <span>{{ controles[0].feux_route_av_gauche || 'Non renseigné' }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Éclairage secondaire -->
                    <div class="controle-section">
                      <h4 class="section-title">Éclairage secondaire</h4>
                      <div class="controle-items">
                        <div class="controle-item">
                          <span>Clignotant AV:</span>
                          <span>{{ controles[0].clignotant_av || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>Clignotant AR:</span>
                          <span>{{ controles[0].clignotant_ar || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>Clignotant latéraux droite:</span>
                          <span>{{ controles[0].clignotant_lateraux_droite || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>Clignotant latéraux gauche:</span>
                          <span>{{ controles[0].clignotant_lateraux_gauche || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>Feux stop AR:</span>
                          <span>{{ controles[0].feux_stop_ar || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>Feux stop AV:</span>
                          <span>{{ controles[0].feux_stop_av || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>Feux stop centrale:</span>
                          <span>{{ controles[0].feux_stop_centrale || 'Non renseigné' }}</span>
                        </div>
                        <div class="controle-item">
                          <span>Feux plaque:</span>
                          <span>{{ controles[0].feux_plaque || 'Non renseigné' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

<!-- Modal de visualisation détaillée d'un contrôle -->
<div v-if="showControleModal" class="modal-overlay">
  <div class="ios-card modal-ios-card">
    <button class="modal-close-ios" @click="showControleModal = false">✕</button>
    <h2 class="ios-section-title ios-mb-md">Détail du contrôle</h2>
    <div class="info-grid">
      <div class="info-item"><label>Date</label><span>{{ formatDate(controleDetail.date_controle) }}</span></div>
      <div class="info-item"><label>Contrôleur</label><span>{{ controleDetail.nom_controleur }}</span></div>
      <div class="info-item"><label>État de salissure</label><span>{{ getSalissureLabel(controleDetail.etat_salissure) }}</span></div>
    </div>
    <h3 class="ios-section-subtitle ios-mb-md">Pneumatiques</h3>
    <div class="info-grid">
      <div class="info-item"><label>AVD</label><span>{{ getPneusLabel(controleDetail.usure_pneus_avd) }}</span></div>
      <div class="info-item"><label>AVG</label><span>{{ getPneusLabel(controleDetail.usure_pneus_avg) }}</span></div>
      <div class="info-item"><label>ARD</label><span>{{ getPneusLabel(controleDetail.usure_pneus_ard) }}</span></div>
      <div class="info-item"><label>ARG</label><span>{{ getPneusLabel(controleDetail.usure_pneus_arg) }}</span></div>
    </div>
    <h3 class="ios-section-subtitle ios-mb-md">Enjoliveurs</h3>
    <div class="info-grid">
      <div class="info-item"><label>AVD</label><span>{{ controleDetail.presence_enjoliveur_avd }}</span></div>
      <div class="info-item"><label>AVG</label><span>{{ controleDetail.presence_enjoliveur_avg }}</span></div>
      <div class="info-item"><label>ARD</label><span>{{ controleDetail.presence_enjoliveur_ard }}</span></div>
      <div class="info-item"><label>ARG</label><span>{{ controleDetail.presence_enjoliveur_arg }}</span></div>
    </div>
    <h3 class="ios-section-subtitle ios-mb-md">Huiles & liquides</h3>
    <div class="info-grid">
      <div class="info-item"><label>Huile moteur</label><span>{{ getFreinsLabel(controleDetail.huile_moteur) }}</span></div>
      <div class="info-item"><label>Liquide refroidissement</label><span>{{ getFreinsLabel(controleDetail.liquide_refroidissement) }}</span></div>
      <div class="info-item"><label>Lave-glace</label><span>{{ getFreinsLabel(controleDetail.lave_glace) }}</span></div>
    </div>
    <h3 class="ios-section-subtitle ios-mb-md">Freins</h3>
    <div class="info-grid">
      <div class="info-item"><label>Plaquettes AV</label><span>{{ getFreinsLabel(controleDetail.plaquette_frein_av) }}</span></div>
      <div class="info-item"><label>Plaquettes AR</label><span>{{ getFreinsLabel(controleDetail.plaquette_frein_ar) }}</span></div>
      <div class="info-item"><label>Disques AV</label><span>{{ getFreinsLabel(controleDetail.disque_frein_av) }}</span></div>
      <div class="info-item"><label>Disques AR</label><span>{{ getFreinsLabel(controleDetail.disque_frein_ar) }}</span></div>
    </div>
    <h3 class="ios-section-subtitle ios-mb-md">Éclairage</h3>
    <div class="info-grid">
      <div class="info-item"><label>Feux position AV</label><span>{{ controleDetail.feux_position_av }}</span></div>
      <div class="info-item"><label>Feux position AR</label><span>{{ controleDetail.feux_position_ar }}</span></div>
      <div class="info-item"><label>Croisement droite</label><span>{{ controleDetail.feux_croisement_droite }}</span></div>
      <div class="info-item"><label>Croisement gauche</label><span>{{ controleDetail.feux_croisement_gauche }}</span></div>
      <div class="info-item"><label>Route AV droite</label><span>{{ controleDetail.feux_route_av_droite }}</span></div>
      <div class="info-item"><label>Route AV gauche</label><span>{{ controleDetail.feux_route_av_gauche }}</span></div>
      <div class="info-item"><label>Clignotant AV</label><span>{{ controleDetail.clignotant_av }}</span></div>
      <div class="info-item"><label>Clignotant AR</label><span>{{ controleDetail.clignotant_ar }}</span></div>
      <div class="info-item"><label>Clignotant latéraux droite</label><span>{{ controleDetail.clignotant_lateraux_droite }}</span></div>
      <div class="info-item"><label>Clignotant latéraux gauche</label><span>{{ controleDetail.clignotant_lateraux_gauche }}</span></div>
      <div class="info-item"><label>Feux stop AR</label><span>{{ controleDetail.feux_stop_ar }}</span></div>
      <div class="info-item"><label>Feux stop AV</label><span>{{ controleDetail.feux_stop_av }}</span></div>
      <div class="info-item"><label>Feux stop centrale</label><span>{{ controleDetail.feux_stop_centrale }}</span></div>
      <div class="info-item"><label>Feux plaque</label><span>{{ controleDetail.feux_plaque }}</span></div>
    </div>
    <h3 class="ios-section-subtitle ios-mb-md">Équipements</h3>
    <div class="info-grid">
      <div class="info-item"><label>Balais essuie-glace</label><span>{{ getEquipementLabel(controleDetail.balais_essuie_glace) }}</span></div>
      <div class="info-item"><label>Plaque immatriculation</label><span>{{ controleDetail.plaque_immatriculation }}</span></div>
      <div class="info-item"><label>Antenne</label><span>{{ controleDetail.antenne }}</span></div>
      <div class="info-item"><label>Repose-tête</label><span>{{ controleDetail.repose_tete }}</span></div>
      <div class="info-item"><label>Tapis AVD</label><span>{{ controleDetail.Tapis_avd }}</span></div>
      <div class="info-item"><label>Tapis AVG</label><span>{{ controleDetail.Tapis_avg }}</span></div>
      <div class="info-item"><label>Tapis ARD</label><span>{{ controleDetail.Tapis_ard }}</span></div>
      <div class="info-item"><label>Tapis ARG</label><span>{{ controleDetail.Tapis_arg }}</span></div>
    </div>
    <h3 class="ios-section-subtitle ios-mb-md">Sécurité & documents</h3>
    <div class="info-grid">
      <div class="info-item"><label>Extincteur</label><span>{{ getEquipementLabel(controleDetail.extincteur) }}</span></div>
      <div class="info-item"><label>Carte carburant</label><span>{{ controleDetail.carte_carburant }}</span></div>
      <div class="info-item"><label>Roue de secours</label><span>{{ getEquipementLabel(controleDetail.roue_secours) }}</span></div>
      <div class="info-item"><label>Cric et manivelle</label><span>{{ controleDetail.cric_manivelle }}</span></div>
      <div class="info-item"><label>Kit de sécurité</label><span>{{ controleDetail.kit_securite }}</span></div>
      <div class="info-item"><label>TAG</label><span>{{ controleDetail.TAG }}</span></div>
      <div class="info-item"><label>Photocopie carte grise</label><span>{{ controleDetail.Photocopie_carte_grise }}</span></div>
      <div class="info-item"><label>Constat amiable vierge</label><span>{{ controleDetail.constat_amiable_vierge }}</span></div>
      <div class="info-item"><label>Rapport d'incident</label><span>{{ controleDetail.rapport_dincident }}</span></div>
      <div class="info-item"><label>Attestation d'assurance</label><span>{{ controleDetail.attestation_assurance }}</span></div>
    </div>
    <h3 class="ios-section-subtitle ios-mb-md">Problèmes détectés</h3>
    <div class="problemes-list" style="margin-bottom: 1rem;">
      <span v-for="p in getProblemesControle(controleDetail)" :key="p" class="probleme-tag">{{ p }}</span>
    </div>
    <div class="d-flex justify-content-end">
      <button class="ios-button secondary" @click="showControleModal = false">Fermer</button>
    </div>
  </div>
</div>

  </div>
</template>

<script>
import { vehiculesService, controlesService } from '../services/api'
import { 
  Car, ClipboardList, CheckCircle, AlertTriangle, History, 
  Eye, Edit, ChevronLeft, BarChart3, Search, Wrench, Zap, Shield, ChevronDown, User 
} from 'lucide-vue-next'

export default {
  name: 'VehicleDetail',
  data() {
    return {
      loading: true,
      vehicle: {},
      controles: [],
      showControleModal: false,
      controleDetail: null,
      openSections: {
        pneusFreins: false,
        equipements: false,
        huilesEnjoliveurs: false,
        tapisDocuments: false,
        eclairage: false
      }
    }
  },
  computed: {
  },
  async mounted() {
    await this.loadVehicleData()
  },
  methods: {
    async loadVehicleData() {
      try {
        this.loading = true
        const vehicleId = this.$route.params.id

        // Charger les données du véhicule
        const vehicleResponse = await vehiculesService.getById(vehicleId)
        if (vehicleResponse.success) {
          this.vehicle = vehicleResponse.data
        }

        // Charger les contrôles du véhicule
        const controlesResponse = await controlesService.getByVehicule(vehicleId)
        if (controlesResponse.success) {
          this.controles = controlesResponse.data
        }

      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        this.$message.error('Erreur lors du chargement des données du véhicule')
      } finally {
        this.loading = false
      }
    },

    formatDate(dateString) {
      if (!dateString) return 'Aucune date'
      return new Date(dateString).toLocaleDateString('fr-FR')
    },

    getDernierControleDate() {
      if (this.controles.length === 0) return 'Aucun contrôle'
      return this.formatDate(this.controles[0].date_controle)
    },

    getControlesRecents() {
      const date7Jours = new Date()
      date7Jours.setDate(date7Jours.getDate() - 7)
      return this.controles.filter(c => new Date(c.date_controle) >= date7Jours).length
    },

    getProblemesDetectes() {
      if (this.controles.length === 0) return 0
      
      const dernierControle = this.controles[0]
      const problemes = this.getProblemesControle(dernierControle)
      
      // Si on a "Aucun problème", retourner 0, sinon retourner le nombre de problèmes
      if (problemes.length === 1 && problemes[0] === 'Aucun problème') {
        return 0
      }
      return problemes.length
    },

    getSalissureClass(etat) {
      const classes = {
        'correcte': 'success',
        'prévoir lavage': 'warning'
      }
      return classes[etat] || 'info'
    },

    getSalissureLabel(etat) {
      const labels = {
        'correcte': 'Correcte',
        'prévoir lavage': 'Prévoir lavage'
      }
      return labels[etat] || 'Non renseigné'
    },

    getProblemesControle(controle) {
      const problemes = []
      
      // Pneus usés
      if (controle.usure_pneus_avd === 'mauvaise' || controle.usure_pneus_avg === 'mauvaise' || 
          controle.usure_pneus_ard === 'mauvaise' || controle.usure_pneus_arg === 'mauvaise') {
        problemes.push('Pneus usés')
      }
      
      // Freins
      if (controle.plaquette_frein_av === 'mauvais' || controle.plaquette_frein_ar === 'mauvais' ||
          controle.disque_frein_av === 'mauvais' || controle.disque_frein_ar === 'mauvais') {
        problemes.push('Freins')
      }
      
      // Éclairage défaillant
      if (controle.feux_position_av === 'non' || controle.feux_position_ar === 'non' ||
          controle.feux_croisement_droite === 'non' || controle.feux_croisement_gauche === 'non' ||
          controle.feux_route_av_droite === 'non' || controle.feux_route_av_gauche === 'non' ||
          controle.clignotant_av === 'non' || controle.clignotant_ar === 'non' ||
          controle.feux_stop_ar === 'non' || controle.feux_stop_av === 'non' ||
          controle.feux_plaque === 'non') {
        problemes.push('Éclairage')
      }
      
      // Huiles et liquides
      if (controle.huile_moteur === 'mauvais') problemes.push('Huile moteur')
      if (controle.liquide_refroidissement === 'mauvais') problemes.push('Liquide refroidissement')
      if (controle.lave_glace === 'mauvais') problemes.push('Lave-glace')
      
      // Équipements
      if (controle.extincteur === 'absent') problemes.push('Extincteur')
      if (controle.roue_secours === 'absent') problemes.push('Roue secours')
      if (controle.kit_securite === 'absent') problemes.push('Kit sécurité')
      if (controle.balais_essuie_glace === 'à remplacer') problemes.push('Balais essuie-glace')
      if (controle.plaque_immatriculation === 'à remplacer') problemes.push('Plaque immatriculation')
      if (controle.antenne === 'à remplacer') problemes.push('Antenne')
      if (controle.repose_tete === 'à remplacer') problemes.push('Repose-tête')
      
      // Tapis
      if (controle.Tapis_avd === 'à remplacer' || controle.Tapis_avd === 'absent' ||
          controle.Tapis_avg === 'à remplacer' || controle.Tapis_avg === 'absent' ||
          controle.Tapis_ard === 'à remplacer' || controle.Tapis_ard === 'absent' ||
          controle.Tapis_arg === 'à remplacer' || controle.Tapis_arg === 'absent') {
        problemes.push('Tapis')
      }
      
      // Documents
      if (controle.carte_carburant === 'absente') problemes.push('Carte carburant')
      if (controle.cric_manivelle === 'absent') problemes.push('Cric manivelle')
      if (controle.TAG === 'à remplacer') problemes.push('TAG')
      if (controle.Photocopie_carte_grise === 'absent') problemes.push('Photocopie carte grise')
      if (controle.constat_amiable_vierge === 'absent') problemes.push('Constat amiable')
      if (controle.rapport_dincident === 'absent') problemes.push('Rapport d\'incident')
      if (controle.attestation_assurance === 'absent') problemes.push('Attestation assurance')
      
      return problemes.length > 0 ? problemes : ['Aucun problème']
    },

    getPneusClass(etat) {
      return etat === 'mauvaise' ? 'text-danger' : etat === 'moyenne' ? 'text-warning' : 'text-success'
    },

    getPneusLabel(etat) {
      const labels = {
        'correcte': 'Correcte',
        'moyenne': 'Moyenne',
        'mauvaise': 'Mauvaise'
      }
      return labels[etat] || 'Non renseigné'
    },

    getFreinsClass(etat) {
      return etat === 'mauvais' ? 'text-danger' : 'text-success'
    },

    getFreinsLabel(etat) {
      const labels = {
        'correcte': 'Correcte',
        'mauvais': 'Mauvais'
      }
      return labels[etat] || 'Non renseigné'
    },

    getEquipementClass(etat) {
      return etat === 'absent' ? 'text-danger' : 'text-success'
    },

    getEquipementLabel(etat) {
      return etat === 'absent' ? 'Absent' : 'Présent'
    },

    editVehicle() {
      this.$router.push(`/vehicle/edit/${this.vehicle.id_vehicule}`)
    },

    newControle() {
      this.$router.push(`/controle?vehicule=${this.vehicle.id_vehicule}`)
    },

    toggleAccordion(section) {
      this.openSections[section] = !this.openSections[section]
    },

    viewControle(controleId) {
      this.$router.push(`/controle/${controleId}`)
    }
  }
}
</script>

<style scoped>
/* Styles pour la lisibilité avec le nouveau dégradé */
.gap-3 {
  gap: 1rem !important;
}

.info-grid {
  display: grid !important;
  gap: 1.25rem !important;
}

.info-item {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 1rem 0 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
  transition: background-color 0.2s ease !important;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.03) !important;
  border-radius: 8px !important;
  padding: 1rem !important;
  margin: 0 -1rem !important;
}

.info-item:last-child {
  border-bottom: none !important;
}

.info-item label {
  font-weight: 600 !important;
  color: #E0E0E0 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
}

.info-item span {
  color: #FFFFFF !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
}

.immatriculation {
  font-weight: 700 !important;
  font-size: 1.1rem !important;
  letter-spacing: 1px !important;
}



/* Table styles */
.ios-table {
  width: 100% !important;
  border-collapse: collapse !important;
  background: rgba(255, 255, 255, 0.05) !important;
  border-radius: 12px !important;
  overflow: hidden !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
}

.ios-table th {
  background: rgba(255, 255, 255, 0.12) !important;
  color: #FFFFFF !important;
  font-weight: 600 !important;
  padding: 1.25rem 1rem !important;
  text-align: left !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.ios-table td {
  padding: 1.25rem 1rem !important;
  color: #E0E0E0 !important;
  border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
  transition: background-color 0.2s ease !important;
}

.controle-row:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

.problemes-list {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 0.25rem !important;
}

.probleme-tag {
  background: rgba(255, 149, 0, 0.2) !important;
  color: #FF9500 !important;
  padding: 0.25rem 0.5rem !important;
  border-radius: 6px !important;
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  border: 1px solid rgba(255, 149, 0, 0.3) !important;
}

.probleme-tag.success {
  background: rgba(52, 199, 89, 0.2) !important;
  color: #34C759 !important;
  border: 1px solid rgba(52, 199, 89, 0.3) !important;
}

.probleme-count {
  background: rgba(255, 59, 48, 0.2) !important;
  color: #FF3B30 !important;
  padding: 0.25rem 0.5rem !important;
  border-radius: 6px !important;
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  border: 1px solid rgba(255, 59, 48, 0.3) !important;
}

/* Contrôle détaillé */
.controle-detail {
  padding: 1rem 0 !important;
}

.controle-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  margin-bottom: 2rem !important;
  padding-bottom: 1rem !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.controle-date, .controle-conducteur, .controle-controleur {
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  color: #FFFFFF !important;
  font-weight: 600 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
}

.detail-icon {
  width: 18px !important;
  height: 18px !important;
  color: #44A08D !important;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3)) !important;
}

.controle-section {
  padding: 1rem !important;
}

.section-title {
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  color: #FFFFFF !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  margin-bottom: 1rem !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
}

.section-icon {
  width: 20px !important;
  height: 20px !important;
  color: #44A08D !important;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3)) !important;
}

.controle-items {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.5rem !important;
}

.controle-item {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 0.5rem 0 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.controle-item:last-child {
  border-bottom: none !important;
}

.controle-item span:first-child {
  color: #E0E0E0 !important;
  font-weight: 500 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
}

.controle-item span:last-child {
  font-weight: 600 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
}

/* Couleurs de statut */
.text-success {
  color: #34C759 !important;
}

.text-warning {
  color: #FF9500 !important;
}

.text-danger {
  color: #FF3B30 !important;
}

.text-muted {
  color: #B0B0B0 !important;
}

/* Icônes */
.title-icon {
  width: 32px !important;
  height: 32px !important;
  margin-right: 12px !important;
  color: #44A08D !important;
  vertical-align: middle !important;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3)) !important;
}

.stat-icon {
  width: 24px !important;
  height: 24px !important;
  color: #44A08D !important;
  margin-bottom: 8px !important;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3)) !important;
}

.action-icon {
  width: 20px !important;
  height: 20px !important;
  margin-right: 8px !important;
  color: #44A08D !important;
  vertical-align: middle !important;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3)) !important;
}

.button-icon {
  width: 16px !important;
  height: 16px !important;
  margin-right: 6px !important;
  color: white !important;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3)) !important;
}

.empty-icon {
  width: 64px !important;
  height: 64px !important;
  color: #B0B0B0 !important;
  margin-bottom: 1rem !important;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3)) !important;
}

/* Modal styles */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;
}
.modal-content {
  background: #fff; color: #222; border-radius: 12px; padding: 2rem; min-width: 320px; max-width: 90vw; max-height: 90vh; overflow-y: auto; position: relative;
}
.modal-close {
  position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;
}
.modal-section { margin-bottom: 1rem; }

/* Styles pour l'accordéon */
.accordion-container {
  margin-top: 1.5rem;
}

.accordion-section {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  margin-bottom: 0.75rem;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.accordion-section:hover {
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.12);
  transition: all 0.3s ease;
}

.accordion-header:hover {
  background: rgba(255, 255, 255, 0.18);
}

.accordion-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #FFFFFF;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  font-size: 1.1rem;
}

.accordion-icon {
  width: 22px;
  height: 22px;
  color: #44A08D;
  transition: transform 0.3s ease;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.accordion-icon.rotated {
  transform: rotate(180deg);
}

.accordion-content {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}



/* Responsive */
@media (max-width: 768px) {
  .controle-header {
    flex-direction: column !important;
    gap: 1rem !important;
    text-align: center !important;
  }
  
  .ios-grid-3 {
    grid-template-columns: 1fr !important;
  }
  
  .info-item {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 0.25rem !important;
  }
  
  .accordion-title {
    font-size: 0.9rem;
  }

  .accordion-header {
    padding: 1rem !important;
  }

  .accordion-content {
    padding: 1.25rem !important;
  }
}
</style> 
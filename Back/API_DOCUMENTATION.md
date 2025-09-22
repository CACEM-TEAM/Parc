# 🚗 API ParcAuto - Documentation

## Vue d'ensemble

L'API ParcAuto est un système de gestion de parc automobile permettant de :
- Gérer les véhicules du parc
- Gérer les conducteurs
- Effectuer des contrôles de véhicules
- Consulter les statistiques

## Base URL

```
http://localhost:4500
```

## Routes principales

### 🏠 Page d'accueil
- **GET** `/` - Informations sur l'API

### 🏥 Santé de l'API
- **GET** `/api/health` - Statut de l'API et de la base de données
- **GET** `/api/test` - Test de fonctionnement de l'API

---

## 🚗 Gestion des véhicules

### Récupérer tous les véhicules
- **GET** `/api/vehicules`
- **Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id_vehicule": 1,
      "immatriculation": "AB-123-CD",
      "marque": "Renault",
      "type": "Clio",
      "remisage_domicile": false,
      "conducteur_nom": "Dupont",
      "conducteur_prenom": "Jean",
      "nb_controles": 3,
      "dernier_controle": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

### Récupérer un véhicule par ID
- **GET** `/api/vehicules/:id`
- **Réponse :**
```json
{
  "success": true,
  "data": {
    "id_vehicule": 1,
    "immatriculation": "AB-123-CD",
    "marque": "Renault",
    "type": "Clio",
    "remisage_domicile": false,
    "id_conducteur": 1,
    "conducteur_nom": "Dupont",
    "conducteur_prenom": "Jean",
    "conducteur_telephone": "0123456789",
    "direction_service": "Direction Générale",
    "fonction_service": "Chef de service"
  }
}
```

### Créer un nouveau véhicule
- **POST** `/api/vehicules`
- **Body :**
```json
{
  "immatriculation": "XY-789-ZW",
  "marque": "Peugeot",
  "type": "208",
  "remisage_domicile": false
}
```

### Mettre à jour un véhicule
- **PUT** `/api/vehicules/:id`
- **Body :** Même structure que POST

### Supprimer un véhicule
- **DELETE** `/api/vehicules/:id`

### Récupérer les contrôles d'un véhicule
- **GET** `/api/vehicules/:id/controles`

---

## 👥 Gestion des conducteurs

### Récupérer tous les conducteurs
- **GET** `/api/conducteurs`
- **Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id_conducteur": 1,
      "nom": "Dupont",
      "prenom": "Jean",
      "telephone": "0123456789",
      "direction_service": "Direction Générale",
      "fonction_service": "Chef de service",
      "vehicule_id": 1,
      "immatriculation": "AB-123-CD",
      "marque": "Renault",
      "type": "Clio"
    }
  ],
  "count": 1
}
```

### Récupérer un conducteur par ID
- **GET** `/api/conducteurs/:id`

### Créer un nouveau conducteur
- **POST** `/api/conducteurs`
- **Body :**
```json
{
  "nom": "Martin",
  "prenom": "Marie",
  "telephone": "0987654321",
  "direction_service": "Ressources Humaines",
  "fonction_service": "Responsable RH",
  "vehicule_id": 2
}
```

### Mettre à jour un conducteur
- **PUT** `/api/conducteurs/:id`

### Supprimer un conducteur
- **DELETE** `/api/conducteurs/:id`

### Récupérer les conducteurs disponibles
- **GET** `/api/conducteurs/disponibles/liste`

---

## 📋 Gestion des contrôles

### Récupérer tous les contrôles
- **GET** `/api/controles`
- **Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id_controle": 1,
      "vehicule_id": 1,
      "conducteur_id": 1,
      "date_controle": "2024-01-15T10:30:00.000Z",
      "etat_salissure": "correcte",
      "usure_pneus_avd": "correcte",
      "usure_pneus_avg": "correcte",
      "usure_pneus_ard": "correcte",
      "usure_pneus_arg": "correcte",
      "presence_enjoliveur_avd": "ok",
      "presence_enjoliveur_avg": "ok",
      "presence_enjoliveur_ard": "ok",
      "presence_enjoliveur_arg": "ok",
      "huile_moteur": "correcte",
      "liquide_refroidissement": "correcte",
      "lave_glace": "correcte",
      "plaquette_frein_av": "correcte",
      "plaquette_frein_ar": "correcte",
      "disque_frein_av": "correcte",
      "disque_frein_ar": "correcte",
      "feux_position_av": "ok",
      "feux_position_ar": "ok",
      "feux_croisement_droite": "ok",
      "feux_croisement_gauche": "ok",
      "feux_route_av_droite": "ok",
      "feux_route_av_gauche": "ok",
      "clignotant_av": "ok",
      "clignotant_ar": "ok",
      "clignotant_lateraux_droite": "ok",
      "clignotant_lateraux_gauche": "ok",
      "feux_stop_ar": "ok",
      "feux_stop_av": "ok",
      "feux_stop_centrale": "ok",
      "feux_plaque": "ok",
      "balais_essuie_glace": "correcte",
      "plaque_immatriculation": "correcte",
      "antenne": "correcte",
      "repose_tete": "correcte",
      "Tapis_avd": "correcte",
      "Tapis_avg": "correcte",
      "Tapis_ard": "correcte",
      "Tapis_arg": "correcte",
      "extincteur": "présent",
      "carte_carburant": "présente",
      "roue_secours": "présent",
      "cric_manivelle": "présent",
      "kit_securite": "présent",
      "TAG": "correcte",
      "Photocopie_carte_grise": "présent",
      "constat_amiable_vierge": "présent",
      "rapport_dincident": "présent",
      "attestation_assurance": "présent",
      "immatriculation": "AB-123-CD",
      "marque": "Renault",
      "type": "Clio",
      "conducteur_nom": "Dupont",
      "conducteur_prenom": "Jean"
    }
  ],
  "count": 1
}
```

### Récupérer un contrôle par ID
- **GET** `/api/controles/:id`

### Créer un nouveau contrôle
- **POST** `/api/controles`
- **Body :** Tous les champs de contrôle (voir structure complète ci-dessus)

### Mettre à jour un contrôle
- **PUT** `/api/controles/:id`

### Supprimer un contrôle
- **DELETE** `/api/controles/:id`

### Récupérer les contrôles d'un véhicule
- **GET** `/api/controles/vehicule/:vehiculeId`

### Statistiques des contrôles
- **GET** `/api/controles/stats/globales`
- **Réponse :**
```json
{
  "success": true,
  "data": {
    "totalControles": 15,
    "controlesAujourdhui": 3,
    "totalVehicules": 25,
    "vehiculesAvecControle": 20,
    "problemesFrequents": [
      {
        "probleme": "Pneus usés",
        "nombre": 5
      },
      {
        "probleme": "Freins à vérifier",
        "nombre": 3
      }
    ]
  }
}
```

---

## 📊 Codes de statut HTTP

- **200** - Succès
- **201** - Créé avec succès
- **400** - Requête invalide
- **404** - Ressource non trouvée
- **500** - Erreur serveur

## 🔧 Structure de réponse

Toutes les réponses suivent cette structure :

```json
{
  "success": true|false,
  "data": {...},
  "message": "Message optionnel",
  "error": "Message d'erreur si success: false",
  "count": 123
}
```

## 🗄️ Structure de la base de données

### Table `vehicules`
- `id_vehicule` (INT, PK, AUTO_INCREMENT)
- `immatriculation` (VARCHAR(20), UNIQUE)
- `marque` (VARCHAR(50))
- `type` (VARCHAR(50))
- `remisage_domicile` (BOOLEAN)

### Table `conducteurs`
- `id_conducteur` (INT, PK, AUTO_INCREMENT)
- `nom` (VARCHAR(50))
- `prenom` (VARCHAR(50))
- `telephone` (VARCHAR(20))
- `direction_service` (VARCHAR(100))
- `fonction_service` (VARCHAR(100))
- `vehicule_id` (INT, FK vers vehicules)

### Table `controles`
- `id_controle` (INT, PK, AUTO_INCREMENT)
- `vehicule_id` (INT, FK vers vehicules)
- `conducteur_id` (INT, FK vers conducteurs)
- `date_controle` (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- Tous les champs de contrôle (pneus, freins, éclairage, équipements, etc.)

## 🚀 Démarrage rapide

1. **Installer les dépendances :**
```bash
npm install
```

2. **Configurer la base de données MySQL :**
- Créer une base de données `parcauto`
- Configurer les variables d'environnement si nécessaire

3. **Démarrer le serveur :**
```bash
npm start
```

4. **Tester l'API :**
```bash
curl http://localhost:4500/api/test
```

## 📝 Exemples d'utilisation

### Créer un contrôle complet
```bash
curl -X POST http://localhost:4500/api/controles \
  -H "Content-Type: application/json" \
  -d '{
    "vehicule_id": 1,
    "conducteur_id": 1,
    "etat_salissure": "correcte",
    "usure_pneus_avd": "correcte",
    "usure_pneus_avg": "correcte",
    "usure_pneus_ard": "correcte",
    "usure_pneus_arg": "correcte",
    "presence_enjoliveur_avd": "ok",
    "presence_enjoliveur_avg": "ok",
    "presence_enjoliveur_ard": "ok",
    "presence_enjoliveur_arg": "ok",
    "huile_moteur": "correcte",
    "liquide_refroidissement": "correcte",
    "lave_glace": "correcte",
    "plaquette_frein_av": "correcte",
    "plaquette_frein_ar": "correcte",
    "disque_frein_av": "correcte",
    "disque_frein_ar": "correcte",
    "feux_position_av": "ok",
    "feux_position_ar": "ok",
    "feux_croisement_droite": "ok",
    "feux_croisement_gauche": "ok",
    "feux_route_av_droite": "ok",
    "feux_route_av_gauche": "ok",
    "clignotant_av": "ok",
    "clignotant_ar": "ok",
    "clignotant_lateraux_droite": "ok",
    "clignotant_lateraux_gauche": "ok",
    "feux_stop_ar": "ok",
    "feux_stop_av": "ok",
    "feux_stop_centrale": "ok",
    "feux_plaque": "ok",
    "balais_essuie_glace": "correcte",
    "plaque_immatriculation": "correcte",
    "antenne": "correcte",
    "repose_tete": "correcte",
    "Tapis_avd": "correcte",
    "Tapis_avg": "correcte",
    "Tapis_ard": "correcte",
    "Tapis_arg": "correcte",
    "extincteur": "présent",
    "carte_carburant": "présente",
    "roue_secours": "présent",
    "cric_manivelle": "présent",
    "kit_securite": "présent",
    "TAG": "correcte",
    "Photocopie_carte_grise": "présent",
    "constat_amiable_vierge": "présent",
    "rapport_dincident": "présent",
    "attestation_assurance": "présent"
  }'
``` 
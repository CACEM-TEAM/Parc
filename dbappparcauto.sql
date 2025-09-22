-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Hôte : mysql:3306
-- Généré le : lun. 21 juil. 2025 à 13:12
-- Version du serveur : 8.0.42
-- Version de PHP : 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `parcauto`
--

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Données pour la table `users`
--

INSERT INTO `users` (`username`, `email`, `password`, `role`) VALUES
('admin', 'admin@parcauto.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqHqKq', 'admin'),
('user', 'user@parcauto.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqHqKq', 'user');

-- --------------------------------------------------------

--
-- Structure de la table `controles`
--

CREATE TABLE `controles` (
  `id_controle` int NOT NULL,
  `vehicule_id` int NOT NULL,
  `nom_controleur` varchar(100) NOT NULL,
  `date_controle` datetime DEFAULT CURRENT_TIMESTAMP,
  `etat_salissure` enum('correcte','prévoir lavage') DEFAULT 'correcte',
  `usure_pneus_avd` enum('correcte','moyenne','mauvaise') DEFAULT 'correcte',
  `usure_pneus_avg` enum('correcte','moyenne','mauvaise') DEFAULT 'correcte',
  `usure_pneus_ard` enum('correcte','moyenne','mauvaise') DEFAULT 'correcte',
  `usure_pneus_arg` enum('correcte','moyenne','mauvaise') DEFAULT 'correcte',
  `presence_enjoliveur_avd` enum('ok','non') DEFAULT 'ok',
  `presence_enjoliveur_avg` enum('ok','non') DEFAULT 'ok',
  `presence_enjoliveur_ard` enum('ok','non') DEFAULT 'ok',
  `presence_enjoliveur_arg` enum('ok','non') DEFAULT 'ok',
  `huile_moteur` enum('correcte','mauvais') DEFAULT 'correcte',
  `liquide_refroidissement` enum('correcte','mauvais') DEFAULT 'correcte',
  `lave_glace` enum('correcte','mauvais') DEFAULT 'correcte',
  `plaquette_frein_av` enum('correcte','mauvais') DEFAULT 'correcte',
  `plaquette_frein_ar` enum('correcte','mauvais') DEFAULT 'correcte',
  `disque_frein_av` enum('correcte','mauvais') DEFAULT 'correcte',
  `disque_frein_ar` enum('correcte','mauvais') DEFAULT 'correcte',
  `feux_position_av` enum('ok','non') DEFAULT 'ok',
  `feux_position_ar` enum('ok','non') DEFAULT 'ok',
  `feux_croisement_droite` enum('ok','non') DEFAULT 'ok',
  `feux_croisement_gauche` enum('ok','non') DEFAULT 'ok',
  `feux_route_av_droite` enum('ok','non') DEFAULT 'ok',
  `feux_route_av_gauche` enum('ok','non') DEFAULT 'ok',
  `clignotant_av` enum('ok','non') DEFAULT 'ok',
  `clignotant_ar` enum('ok','non') DEFAULT 'ok',
  `clignotant_lateraux_droite` enum('ok','non') DEFAULT 'ok',
  `clignotant_lateraux_gauche` enum('ok','non') DEFAULT 'ok',
  `feux_stop_ar` enum('ok','non') DEFAULT 'ok',
  `feux_stop_av` enum('ok','non') DEFAULT 'ok',
  `feux_stop_centrale` enum('ok','non') DEFAULT 'ok',
  `feux_plaque` enum('ok','non') DEFAULT 'ok',
  `balais_essuie_glace` enum('correcte','à remplacer') DEFAULT 'correcte',
  `plaque_immatriculation` enum('correcte','à remplacer') DEFAULT 'correcte',
  `antenne` enum('correcte','à remplacer','non concernée') DEFAULT 'correcte',
  `repose_tete` enum('correcte','à remplacer') DEFAULT 'correcte',
  `Tapis_avd` enum('correcte','à remplacer','absent') DEFAULT 'correcte',
  `Tapis_avg` enum('correcte','à remplacer','absent') DEFAULT 'correcte',
  `Tapis_ard` enum('correcte','à remplacer','absent') DEFAULT 'correcte',
  `Tapis_arg` enum('correcte','à remplacer','absent') DEFAULT 'correcte',
  `extincteur` enum('présent','absent') DEFAULT 'présent',
  `carte_carburant` enum('présente','absente') DEFAULT 'présente',
  `roue_secours` enum('présent','absent') DEFAULT 'présent',
  `cric_manivelle` enum('présent','absent') DEFAULT 'présent',
  `kit_securite` enum('présent','absent') DEFAULT 'présent',
  `TAG` enum('correcte','à remplacer') DEFAULT 'correcte',
  `Photocopie_carte_grise` enum('présent','absent') DEFAULT 'présent',
  `constat_amiable_vierge` enum('présent','absent') DEFAULT 'présent',
  `rapport_dincident` enum('présent','absent') DEFAULT 'présent',
  `attestation_assurance` enum('présent','absent') DEFAULT 'présent'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `vehicules`
--

CREATE TABLE `vehicules` (
  `id_vehicule` int NOT NULL AUTO_INCREMENT,
  `marque` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `immatriculation` varchar(20) NOT NULL,
  `remisage_domicile` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_vehicule`),
  UNIQUE KEY `immatriculation` (`immatriculation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Données pour la table `vehicules`
--

INSERT INTO `vehicules` (`marque`, `type`, `immatriculation`, `remisage_domicile`) VALUES
('Renault', 'Clio', 'AB-123-CD', 0),
('Peugeot', '208', 'EF-456-GH', 1),
('Citroën', 'C3', 'IJ-789-KL', 0),
('Volkswagen', 'Golf', 'MN-012-PQ', 1);

-- --------------------------------------------------------

--
-- Structure de la table `conducteurs`
--

CREATE TABLE `conducteurs` (
  `id_conducteur` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `permis_conduire` varchar(20) DEFAULT NULL,
  `date_naissance` date DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_conducteur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Données pour la table `conducteurs`
--

INSERT INTO `conducteurs` (`nom`, `prenom`, `email`, `telephone`, `permis_conduire`) VALUES
('Dupont', 'Jean', 'jean.dupont@email.com', '0123456789', 'B'),
('Martin', 'Marie', 'marie.martin@email.com', '0987654321', 'B'),
('Bernard', 'Pierre', 'pierre.bernard@email.com', '0555666777', 'B');

-- --------------------------------------------------------

--
-- Index pour les tables
--

ALTER TABLE `controles`
  ADD PRIMARY KEY (`id_controle`),
  ADD KEY `vehicule_id` (`vehicule_id`);

ALTER TABLE `controles`
  MODIFY `id_controle` int NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables
--

ALTER TABLE `controles`
  ADD CONSTRAINT `controles_ibfk_1` FOREIGN KEY (`vehicule_id`) REFERENCES `vehicules` (`id_vehicule`) ON DELETE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

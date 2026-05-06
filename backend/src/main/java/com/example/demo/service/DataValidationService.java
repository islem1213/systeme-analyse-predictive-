package com.example.demo.service;

import com.example.demo.model.DemandeDTO;
import com.example.demo.model.ValidationReport;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class DataValidationService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    public ValidationReport validateAndClean(DemandeDTO dto) {
        ValidationReport report = new ValidationReport();

        // 1. Nettoyage initial et Vérification des champs obligatoires
        String nom = cleanString(dto.getNom());
        if (nom == null || nom.isEmpty()) report.addError("Le champ 'Nom / Raison sociale' est obligatoire.");
        
        String email = cleanString(dto.getEmail());
        if (email == null || email.isEmpty()) {
            report.addError("Le champ 'Email' est obligatoire.");
        } else if (!EMAIL_PATTERN.matcher(email).matches()) {
            report.addError("Le format de l'email est incorrect.");
        }

        Double montant = dto.getMontantSouhaite();
        if (montant == null || montant <= 0) report.addError("Le montant demandé doit être supérieur à 0.");

        Integer duree = dto.getDureeMois();
        if (duree == null || duree <= 0) report.addError("La durée doit être supérieure à 0.");

        Double revenus = dto.getRevenuMensuel();
        if (revenus == null || revenus <= 0) report.addError("Les revenus mensuels sont obligatoires et doivent être supérieurs à 0.");

        // 2. Nettoyage des données optionnelles
        Double charges = dto.getChargesFixes();
        if (charges == null) {
            // 🤖 Complétion intelligente : Estimation des charges à 30% si absentes
            if (revenus != null && revenus > 0) {
                charges = revenus * 0.3;
                report.addWarning("Charges non renseignées : estimation automatique à 30% des revenus (" + String.format("%.2f", charges) + " €).");
            } else {
                charges = 0.0;
            }
        }

        // 3. Détection des incohérences
        if (revenus != null && montant != null && revenus < (montant / 10)) {
            report.addWarning("Incohérence détectée : Le montant demandé est très élevé par rapport à vos revenus.");
        }

        // 4. Stockage des données nettoyées
        report.getCleaned_data().put("nom", nom);
        report.getCleaned_data().put("email", email);
        report.getCleaned_data().put("montant", montant);
        report.getCleaned_data().put("duree", duree);
        report.getCleaned_data().put("revenus", revenus);
        report.getCleaned_data().put("charges", charges);

        // 5. Calculs
        if (report.isValid()) {
            double net = revenus - charges;
            double ratio = (charges / revenus) * 100;

            report.getComputed().put("revenu_net", String.format("%.2f €", net));
            report.getComputed().put("taux_endettement", String.format("%.2f %%", ratio));

            // 6. Recommendation
            if (ratio > 45) {
                report.setRecommendation("Alerte : Taux d'endettement critique. La demande a peu de chances d'être acceptée.");
            } else if (ratio > 33) {
                report.setRecommendation("Attention : Taux d'endettement élevé. Un co-emprunteur ou des garanties solides seront nécessaires.");
            } else {
                report.setRecommendation("Dossier sain : Le profil financier semble équilibré.");
            }
        }

        return report;
    }

    private String cleanString(String s) {
        if (s == null || s.trim().isEmpty() || s.equalsIgnoreCase("N/A") || s.equalsIgnoreCase("null")) {
            return null;
        }
        return s.trim();
    }
}

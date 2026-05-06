package com.example.demo.service;

import com.example.demo.entity.DemandePret;
import com.example.demo.entity.ScoreCredit;
import com.example.demo.entity.Client;
import com.example.demo.enums.StatutDemande;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.DemandePretRepository;
import com.example.demo.repository.ScoreCreditRepository;
import com.example.demo.repository.ClientRepository;
import com.example.demo.model.DemandeDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class ScoreCalculationService {

    private final LlamaIntegrationService llamaService;
    private final DemandePretRepository demandePretRepository;
    private final ScoreCreditRepository scoreCreditRepository;
    private final ClientRepository clientRepository;

    public ScoreCalculationService(LlamaIntegrationService llamaService,
                                   DemandePretRepository demandePretRepository,
                                   ScoreCreditRepository scoreCreditRepository,
                                   ClientRepository clientRepository) {
        this.llamaService = llamaService;
        this.demandePretRepository = demandePretRepository;
        this.scoreCreditRepository = scoreCreditRepository;
        this.clientRepository = clientRepository;
    }

    @Transactional
    public DemandePret createAndEvaluate(DemandeDTO dto) {
        Client client = clientRepository.findByEmail(dto.getEmail())
                .orElseGet(() -> {
                    Client newClient = new Client();
                    newClient.setNom(dto.getNom());
                    newClient.setEmail(dto.getEmail());
                    newClient.setMotDePasse("tmp_pass");
                    newClient.setRole("ROLE_CLIENT");
                    newClient.setRevenuMensuel(dto.getRevenuMensuel() != null ? dto.getRevenuMensuel() : 3000.0);
                    newClient.setChargesFixes(dto.getChargesFixes() != null ? dto.getChargesFixes() : 800.0);
                    newClient.setProfession(dto.getProfession());
                    newClient.setCin(dto.getCin());
                    newClient.setAdresse(dto.getAdresse());
                    newClient.setTelephone(dto.getTelephone());
                    newClient.setActivitePrincipale(dto.getActivitePrincipale());
                    newClient.setAncienneteActivite(dto.getAncienneteActivite());
                    newClient.setAge(dto.getAge());
                    newClient.setNombreEnfants(dto.getNombreEnfants());
                    newClient.setEpargneMensuelle(dto.getEpargneMensuelle());
                    return newClient;
                });

        // Mise à jour des informations du client (qu'il soit nouveau ou existant)
        client.setNom(dto.getNom());
        client.setRevenuMensuel(dto.getRevenuMensuel() != null ? dto.getRevenuMensuel() : 3000.0);
        client.setChargesFixes(dto.getChargesFixes() != null ? dto.getChargesFixes() : 800.0);
        client.setProfession(dto.getProfession());
        client.setCin(dto.getCin());
        client.setAdresse(dto.getAdresse());
        client.setTelephone(dto.getTelephone());
        client.setActivitePrincipale(dto.getActivitePrincipale());
        client.setAncienneteActivite(dto.getAncienneteActivite());
        client.setAge(dto.getAge());
        client.setNombreEnfants(dto.getNombreEnfants());
        client.setEpargneMensuelle(dto.getEpargneMensuelle());
        client = clientRepository.save(client);

        DemandePret demand = new DemandePret();
        demand.setClient(client);
        demand.setMontantDemande(dto.getMontantSouhaite());
        demand.setDureeMois(dto.getDureeMois());
        demand.setTypeCredit(dto.getTypeCredit());
        demand.setObjetFinancement(dto.getObjetFinancement());
        demand.setAutresRevenus(dto.getAutresRevenus());
        demand.setAutresEngagements(dto.getAutresEngagements());
        demand.setDescriptionProjet(dto.getDescriptionProjet());
        demand.setObjectifsProjet(dto.getObjectifsProjet());
        demand.setRentabiliteProjet(dto.getRentabiliteProjet());
        demand.setRisquesProjet(dto.getRisquesProjet());
        demand.setTypeGarantie(dto.getTypeGarantie());
        demand.setValeurGarantie(dto.getValeurGarantie());
        demand.setDetailsGarantie(dto.getDetailsGarantie());
        demand.setApportPersonnel(dto.getApportPersonnel());
        
        demand = demandePretRepository.save(demand);

        return processRequest(demand.getId());
    }

    public String preValidateWithAI(DemandeDTO dto) {
        return llamaService.validateAndAnalyze(dto);
    }

    public String handleFollowUpQuestion(String question, long demandeId) {
        if (demandeId <= 0) {
            return llamaService.respondToQuestion(question, "L'utilisateur pose une question générale sur le crédit ou le système sans dossier spécifique ouvert.");
        }

        DemandePret demande = demandePretRepository.findById(demandeId)
                .orElseThrow(() -> new ResourceNotFoundException("Demande non trouvée"));
        
        ScoreCredit score = demande.getScoreCredit();
        if (score == null) {
            return llamaService.respondToQuestion(question, "L'utilisateur pose une question sur son dossier #" + demandeId + " mais le score n'a pas encore été calculé.");
        }
        
        String context = "Score: " + score.getValeurScore() + ", Analyse IA: " + score.getRecommandationIA();
        return llamaService.respondToQuestion(question, context);
    }

    @Transactional
    public DemandePret processRequest(long requestId) {
        DemandePret demand = demandePretRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Demande non trouvée"));

        Client client = demand.getClient();
        double valIncome = (client.getRevenuMensuel() != null && client.getRevenuMensuel() > 0) ? client.getRevenuMensuel() : 1.0;
        double valCharges = (client.getChargesFixes() != null) ? client.getChargesFixes() : 0.0;
        
        double ratio = valCharges / valIncome;
        double resteAVivre = valIncome - valCharges;
        
        // --- NOUVEAU CALCUL DE SCORE FICO (300 - 850) ---
        int score = 300; // Base
        
        // 1. Taux d'endettement (Max 200 pts)
        if (ratio < 0.20) score += 200;
        else if (ratio <= 0.33) score += 150;
        else if (ratio <= 0.40) score += 100;
        else if (ratio <= 0.50) score += 50;
        
        // 2. Reste à vivre (Max 100 pts)
        if (resteAVivre > 2000) score += 100;
        else if (resteAVivre >= 1000) score += 70;
        else if (resteAVivre >= 500) score += 30;
        
        // 3. Apport personnel (Max 100 pts)
        double montant = demand.getMontantDemande() != null ? demand.getMontantDemande() : 1.0;
        double apport = demand.getApportPersonnel() != null ? demand.getApportPersonnel() : 0.0;
        double apportRatio = apport / montant;
        if (apportRatio > 0.20) score += 100;
        else if (apportRatio >= 0.10) score += 70;
        else if (apportRatio >= 0.05) score += 40;
        
        // 4. Effort d'épargne (Max 50 pts)
        double epargne = client.getEpargneMensuelle() != null ? client.getEpargneMensuelle() : 0.0;
        double epargneRatio = epargne / valIncome;
        if (epargneRatio >= 0.25) score += 50;
        else if (epargneRatio >= 0.10) score += 30;
        
        // 5. Profil professionnel (Max 60 pts)
        int anciennete = client.getAncienneteActivite() != null ? client.getAncienneteActivite() : 0;
        if (anciennete > 5) score += 40;
        else if (anciennete >= 2) score += 20;
        
        String prof = client.getProfession() != null ? client.getProfession().toLowerCase() : "";
        if (prof.contains("fonctionnaire") || prof.contains("cdi")) score += 20;
        
        // 6. Situation personnelle (Max 40 pts)
        int age = client.getAge() != null ? client.getAge() : 30;
        if (age >= 25 && age <= 50) score += 20;
        else score += 10;
        
        int enfants = client.getNombreEnfants() != null ? client.getNombreEnfants() : 0;
        if (enfants == 0) score += 20;
        else if (enfants <= 2) score += 10;
        
        // --- INTERPRÉTATION DU SCORE ---
        String businessStatus;
        if (score >= 750) {
            businessStatus = "EXCELLENT";
            demand.setStatut(StatutDemande.APPROUVE);
        } else if (score >= 650) {
            businessStatus = "BON";
            demand.setStatut(StatutDemande.APPROUVE);
        } else if (score >= 550) {
            businessStatus = "INTERMEDIAIRE";
            demand.setStatut(StatutDemande.EN_ATTENTE);
        } else {
            businessStatus = "FRAGILE";
            demand.setStatut(StatutDemande.REFUSE);
        }

        String recommendation;
        try {
            // Passe le ratio et le score à l'IA pour générer la recommandation textuelle
            recommendation = llamaService.generateRecommendation(
                (double) score, valIncome, ratio, businessStatus
            );
        } catch (Exception e) {
            recommendation = "Analyse IA indisponible. Score de " + score + "/850 basé sur les critères de solvabilité.";
        }

        ScoreCredit scoreEntity = new ScoreCredit();
        scoreEntity.setValeurScore((double) score);
        scoreEntity.setNiveauRisque(businessStatus);
        scoreEntity.setRecommandationIA(recommendation);
        scoreEntity.setDateCalcul(LocalDateTime.now());
        scoreEntity = scoreCreditRepository.save(scoreEntity);

        demand.setScoreCredit(scoreEntity);
        return demandePretRepository.save(demand);
    }
}

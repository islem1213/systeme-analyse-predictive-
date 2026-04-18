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
                    newClient.setRevenuMensuel(dto.getRevenuMensuel());
                    newClient.setChargesFixes(dto.getChargesFixes());
                    newClient.setProfession(dto.getProfession());
                    return clientRepository.save(newClient);
                });

        DemandePret demand = new DemandePret();
        demand.setClient(client);
        demand.setMontantDemande(dto.getMontantSouhaite());
        demand.setDureeMois(dto.getDureeMois());
        demand = demandePretRepository.save(demand);

        return processRequest(demand.getId());
    }

    public String handleFollowUpQuestion(String question, long scoreId) {
        ScoreCredit score = scoreCreditRepository.findById(scoreId)
                .orElseThrow(() -> new ResourceNotFoundException("Score non trouvé"));
        
        String context = "Score: " + score.getValeurScore() + ", Analyse IA: " + score.getRecommandationIA();
        return llamaService.respondToQuestion(question, context);
    }

    @Transactional
    public DemandePret processRequest(long requestId) {
        DemandePret demand = demandePretRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Demande non trouvée"));

        Double income = demand.getClient().getRevenuMensuel();
        Double charges = demand.getClient().getChargesFixes();
        
        // Guard against division by zero
        Double ratio = (income != null && income > 0) ? charges / income : 1.0;
        
        String businessStatus;
        if (ratio < 0.3) {
            businessStatus = "BON";
            demand.setStatut(StatutDemande.APPROUVE);
        } else if (ratio <= 0.6) {
            businessStatus = "MOYEN";
            demand.setStatut(StatutDemande.EN_ATTENTE);
        } else {
            businessStatus = "REFUS";
            demand.setStatut(StatutDemande.REFUSE);
        }

        String recommendation = llamaService.generateRecommendation(
            ratio, income, ratio, businessStatus
        );

        ScoreCredit scoreEntity = new ScoreCredit();
        scoreEntity.setValeurScore(ratio);
        scoreEntity.setNiveauRisque(businessStatus);
        scoreEntity.setRecommandationIA(recommendation);
        scoreEntity.setDateCalcul(LocalDateTime.now());
        scoreEntity = scoreCreditRepository.save(scoreEntity);

        demand.setScoreCredit(scoreEntity);
        return demandePretRepository.save(demand);
    }
}

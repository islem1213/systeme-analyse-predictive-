package com.example.demo.service;

import com.example.demo.enums.StatutDemande;
import com.example.demo.repository.DemandePretRepository;
import com.example.demo.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class StatistiqueService {

    private final DemandePretRepository demandePretRepository;
    private final UtilisateurRepository utilisateurRepository;

    public StatistiqueService(DemandePretRepository demandePretRepository, UtilisateurRepository utilisateurRepository) {
        this.demandePretRepository = demandePretRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    public Map<String, Object> getGlobalStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalDemandes = demandePretRepository.count();
        stats.put("totalDemandes", totalDemandes);
        stats.put("demandesEnAttente", demandePretRepository.countByStatut(StatutDemande.EN_ATTENTE));
        stats.put("demandesApprouvees", demandePretRepository.countByStatut(StatutDemande.APPROUVE));
        stats.put("demandesRefusees", demandePretRepository.countByStatut(StatutDemande.REFUSE));
        stats.put("totalUsers", utilisateurRepository.count());
        
        return stats;
    }

    public Map<String, Object> getBankerStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("pendingTasks", demandePretRepository.countByStatut(StatutDemande.EN_ATTENTE));
        // Add more banker specific stats here
        return stats;
    }
}

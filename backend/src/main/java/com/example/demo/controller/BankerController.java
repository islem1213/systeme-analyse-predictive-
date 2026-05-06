package com.example.demo.controller;

import com.example.demo.entity.DemandePret;
import com.example.demo.enums.StatutDemande;
import com.example.demo.repository.DemandePretRepository;
import com.example.demo.service.StatistiqueService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/banker")
@PreAuthorize("hasRole('BANQUIER')")
public class BankerController {

    private final DemandePretRepository demandePretRepository;
    private final StatistiqueService statistiqueService;

    public BankerController(DemandePretRepository demandePretRepository, StatistiqueService statistiqueService) {
        this.demandePretRepository = demandePretRepository;
        this.statistiqueService = statistiqueService;
    }

    @GetMapping("/demandes/en-attente")
    public List<DemandePret> getPendingDemandes() {
        return demandePretRepository.findByStatut(StatutDemande.EN_ATTENTE);
    }

    @PostMapping("/demandes/{id}/decision")
    public ResponseEntity<?> makeDecision(@PathVariable long id, @RequestParam StatutDemande decision) {
        return demandePretRepository.findById(id)
                .map(demande -> {
                    demande.setStatut(decision);
                    demandePretRepository.save(demande);
                    return ResponseEntity.ok().body(Map.of("message", "Décision enregistrée avec succès"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        return statistiqueService.getBankerStats();
    }
}

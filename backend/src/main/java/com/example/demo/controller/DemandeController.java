package com.example.demo.controller;

import com.example.demo.entity.DemandePret;
import com.example.demo.model.DemandeDTO;
import com.example.demo.model.ValidationReport;
import com.example.demo.repository.DemandePretRepository;
import com.example.demo.security.UserDetailsImpl;
import com.example.demo.service.DataValidationService;
import com.example.demo.service.ScoreCalculationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/demandes")
public class DemandeController {

    private final ScoreCalculationService scoreService;
    private final DemandePretRepository demandePretRepository;
    private final DataValidationService validationService;

    public DemandeController(ScoreCalculationService scoreService, 
                             DemandePretRepository demandePretRepository,
                             DataValidationService validationService) {
        this.scoreService = scoreService;
        this.demandePretRepository = demandePretRepository;
        this.validationService = validationService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('BANQUIER', 'ADMIN')")
    public List<DemandePret> getAllDemandes() {
        return demandePretRepository.findAll();
    }

    @GetMapping("/mes-demandes")
    @PreAuthorize("hasRole('CLIENT')")
    public List<DemandePret> getMyDemandes() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return demandePretRepository.findByClientId(userDetails.getId());
    }

    @PostMapping("/validate")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ValidationReport> validate(@RequestBody DemandeDTO dto) {
        return ResponseEntity.ok(validationService.validateAndClean(dto));
    }

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<DemandePret> submit(@RequestBody DemandeDTO dto) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        dto.setEmail(userDetails.getEmail());
        dto.setNom(userDetails.getNom());
        return ResponseEntity.ok(scoreService.createAndEvaluate(dto));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENT', 'BANQUIER', 'ADMIN')")
    public ResponseEntity<DemandePret> getById(@PathVariable long id) {
        return demandePretRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/statut")
    @PreAuthorize("hasAnyRole('BANQUIER', 'ADMIN')")
    public ResponseEntity<DemandePret> updateStatus(
            @PathVariable long id, 
            @RequestParam com.example.demo.enums.StatutDemande statut,
            @RequestParam(required = false) String observation) {
        return demandePretRepository.findById(id)
                .map(d -> {
                    d.setStatut(statut);
                    // If we had an observation field in DemandePret, we'd set it here
                    return ResponseEntity.ok(demandePretRepository.save(d));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/chat")
    @PreAuthorize("hasAnyRole('CLIENT', 'BANQUIER', 'ADMIN')")
    public ResponseEntity<String> chat(@RequestParam String question, @RequestParam long demandeId) {
        try {
            return ResponseEntity.ok(scoreService.handleFollowUpQuestion(question, demandeId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Désolé, l'IA ne peut pas répondre pour le moment.");
        }
    }
}

package com.example.demo.controller;

import com.example.demo.entity.DemandePret;
import com.example.demo.model.DemandeDTO;
import com.example.demo.service.ScoreCalculationService;
import com.example.demo.repository.DemandePretRepository;
import com.example.demo.exception.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/demandes")
@CrossOrigin(origins = "*")
public class DemandeController {

    private final ScoreCalculationService scoreService;
    private final DemandePretRepository demandePretRepository;

    public DemandeController(ScoreCalculationService scoreService, DemandePretRepository demandePretRepository) {
        this.scoreService = scoreService;
        this.demandePretRepository = demandePretRepository;
    }

    @PostMapping("/soumettre")
    public ResponseEntity<DemandePret> submit(@RequestBody DemandeDTO dto) {
        return ResponseEntity.ok(scoreService.createAndEvaluate(dto));
    }

    @PostMapping("/chat")
    public ResponseEntity<String> chat(@RequestParam String question, @RequestParam long scoreId) {
        return ResponseEntity.ok(scoreService.handleFollowUpQuestion(question, scoreId));
    }

    @GetMapping("/{id}/score")
    public ResponseEntity<Double> getScore(@PathVariable long id) {
        return demandePretRepository.findById(id)
                .map(d -> {
                    if (d.getScoreCredit() == null)
                        throw new ResourceNotFoundException("Score non encore calculé pour la demande " + id);
                    return ResponseEntity.ok(d.getScoreCredit().getValeurScore());
                })
                .orElseThrow(() -> new ResourceNotFoundException("Demande non trouvée"));
    }

    @GetMapping("/{id}/recommandation")
    public ResponseEntity<String> getRecommendation(@PathVariable long id) {
        return demandePretRepository.findById(id)
                .map(d -> {
                    if (d.getScoreCredit() == null)
                        throw new ResourceNotFoundException("Score non encore calculé pour la demande " + id);
                    return ResponseEntity.ok(d.getScoreCredit().getRecommandationIA());
                })
                .orElseThrow(() -> new ResourceNotFoundException("Demande non trouvée"));
    }
}

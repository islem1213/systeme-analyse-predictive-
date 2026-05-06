package com.example.demo.controller;

import com.example.demo.entity.DemandePret;
import com.example.demo.repository.DemandePretRepository;
import com.example.demo.service.ReportService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.Objects;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private final DemandePretRepository demandePretRepository;

    public ReportController(ReportService reportService, DemandePretRepository demandePretRepository) {
        this.reportService = reportService;
        this.demandePretRepository = demandePretRepository;
    }

    @GetMapping(value = "/demande/{id}", produces = MediaType.APPLICATION_PDF_VALUE)
    @PreAuthorize("hasAnyRole('CLIENT', 'BANQUIER', 'ADMIN')")
    public ResponseEntity<InputStreamResource> getReport(@PathVariable Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }

        DemandePret demande = demandePretRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée"));

        ByteArrayInputStream bis = reportService.generateCreditDemandReport(demande);
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=rapport_demande_" + id + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(Objects.requireNonNull(MediaType.APPLICATION_PDF))
                .body(new InputStreamResource(Objects.requireNonNull(bis)));
    }
}

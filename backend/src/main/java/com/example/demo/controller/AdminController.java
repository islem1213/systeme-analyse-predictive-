package com.example.demo.controller;

import com.example.demo.entity.ParametreSysteme;
import com.example.demo.entity.Utilisateur;
import com.example.demo.repository.ParametreSystemeRepository;
import com.example.demo.repository.UtilisateurRepository;
import com.example.demo.service.StatistiqueService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UtilisateurRepository utilisateurRepository;
    private final ParametreSystemeRepository parametreRepository;
    private final StatistiqueService statistiqueService;

    public AdminController(UtilisateurRepository utilisateurRepository, 
                           ParametreSystemeRepository parametreRepository, 
                           StatistiqueService statistiqueService) {
        this.utilisateurRepository = utilisateurRepository;
        this.parametreRepository = parametreRepository;
        this.statistiqueService = statistiqueService;
    }

    @GetMapping("/users")
    public List<Utilisateur> getAllUsers() {
        return utilisateurRepository.findAll();
    }

    @GetMapping("/parametres")
    public List<ParametreSysteme> getParametres() {
        return parametreRepository.findAll();
    }

    @PutMapping("/parametres/{id}")
    public ResponseEntity<?> updateParametre(@PathVariable long id, @RequestBody ParametreSysteme paramDetails) {
        return parametreRepository.findById(id)
                .map(param -> {
                    param.setValeur(paramDetails.getValeur());
                    parametreRepository.save(param);
                    return ResponseEntity.ok().body(Map.of("message", "Paramètre mis à jour"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        return statistiqueService.getGlobalStats();
    }
}

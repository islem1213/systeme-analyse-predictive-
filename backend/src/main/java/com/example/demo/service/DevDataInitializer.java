package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.enums.StatutDemande;
import com.example.demo.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Lazy;

@Component
public class DevDataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final DemandePretRepository demandePretRepository;
    private final ScoreCalculationService scoreService;
    private final ParametreSystemeRepository parametreRepository;
    private final PasswordEncoder passwordEncoder;

    public DevDataInitializer(UtilisateurRepository utilisateurRepository,
                              DemandePretRepository demandePretRepository,
                              @Lazy ScoreCalculationService scoreService,
                              ParametreSystemeRepository parametreRepository,
                              PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.demandePretRepository = demandePretRepository;
        this.scoreService = scoreService;
        this.parametreRepository = parametreRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Initialize System Parameters
        if (parametreRepository.count() == 0) {
            parametreRepository.save(new ParametreSysteme("SCORE_THRESHOLD_LOW", "0.3", "Seuil pour approbation automatique (ratio endettement)"));
            parametreRepository.save(new ParametreSysteme("SCORE_THRESHOLD_HIGH", "0.6", "Seuil pour refus automatique (ratio endettement)"));
        }

        // Check and create Admin
        if (!utilisateurRepository.existsByEmail("admin@scoring.com")) {
            Administrateur admin = new Administrateur();
            admin.setNom("System Admin");
            admin.setEmail("admin@scoring.com");
            admin.setMotDePasse(passwordEncoder.encode("admin123"));
            admin.setRole("ROLE_ADMIN");
            utilisateurRepository.save(admin);
            System.out.println(">>> Admin account created.");
        }

        // Check and create Banker
        if (!utilisateurRepository.existsByEmail("banker@scoring.com")) {
            Banquier banker = new Banquier();
            banker.setNom("Agent Bancaire");
            banker.setEmail("banker@scoring.com");
            banker.setMotDePasse(passwordEncoder.encode("banker123"));
            banker.setRole("ROLE_BANQUIER");
            utilisateurRepository.save(banker);
            System.out.println(">>> Banker account created.");
        }

        // Check and create Client
        if (!utilisateurRepository.existsByEmail("jean.dupont@email.com")) {
            Client client = new Client();
            client.setNom("Jean Dupont");
            client.setEmail("jean.dupont@email.com");
            client.setMotDePasse(passwordEncoder.encode("client123"));
            client.setRole("ROLE_CLIENT");
            client.setRevenuMensuel(3500.0);
            client.setChargesFixes(800.0);
            client.setProfession("Ingénieur");
            client.setSituationFamiliale("Marié");
            client = utilisateurRepository.save(client);
            System.out.println(">>> Client account created.");

            // Demo Request
            if (demandePretRepository.count() == 0) {
                DemandePret demand = new DemandePret();
                demand.setClient(client);
                demand.setMontantDemande(45000.0);
                demand.setDureeMois(60);
                demand.setStatut(StatutDemande.EN_ATTENTE);
                demand = demandePretRepository.save(demand);

                // Run the full scoring pipeline
                try {
                    scoreService.processRequest(demand.getId());
                    System.out.println(">>> Test data initialized successfully!");
                } catch (Exception e) {
                    System.err.println(">>> Error during score calculation: " + e.getMessage());
                }
            }
        }
    }
}

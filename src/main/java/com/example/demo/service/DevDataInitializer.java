package com.example.demo.service;

import com.example.demo.entity.Client;
import com.example.demo.entity.DemandePret;
import com.example.demo.enums.StatutDemande;
import com.example.demo.repository.ClientRepository;
import com.example.demo.repository.DemandePretRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Lazy;

@Component
public class DevDataInitializer implements CommandLineRunner {

    private final ClientRepository clientRepository;
    private final DemandePretRepository demandePretRepository;
    private final ScoreCalculationService scoreService;

    public DevDataInitializer(ClientRepository clientRepository,
                              DemandePretRepository demandePretRepository,
                              @Lazy ScoreCalculationService scoreService) {
        this.clientRepository = clientRepository;
        this.demandePretRepository = demandePretRepository;
        this.scoreService = scoreService;
    }

    @Override
    public void run(String... args) throws Exception {
        if (clientRepository.count() == 0) {
            Client client = new Client();
            client.setNom("Jean Dupont");
            client.setEmail("jean.dupont@email.com");
            client.setMotDePasse("password123");
            client.setRole("ROLE_CLIENT");
            client.setRevenuMensuel(3500.0);
            client.setChargesFixes(800.0);
            client.setProfession("Ingénieur");
            client.setSituationFamiliale("Marié");
            client = clientRepository.save(client);

            DemandePret demand = new DemandePret();
            demand.setClient(client);
            demand.setMontantDemande(45000.0);
            demand.setDureeMois(60);
            demand.setStatut(StatutDemande.EN_ATTENTE);
            demand = demandePretRepository.save(demand);

            // Run the full scoring pipeline so scoreCredit is not null
            demand = scoreService.processRequest(demand.getId());

            System.out.println(">>> Données de test initialisées ! ID Demande : " + demand.getId() + " | Score: " + demand.getScoreCredit().getValeurScore());
        }
    }
}

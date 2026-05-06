package com.example.demo.repository;

import com.example.demo.entity.DemandePret;
import com.example.demo.enums.StatutDemande;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DemandePretRepository extends JpaRepository<DemandePret, Long> {
    List<DemandePret> findByClientId(Long clientId);
    List<DemandePret> findByStatut(StatutDemande statut);
    long countByStatut(StatutDemande statut);
}

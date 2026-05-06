package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entité représentant le score de crédit calculé
 */
@Entity
@Table(name = "score_credits")
public class ScoreCredit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double valeurScore;
    private String niveauRisque;
    
    @Column(columnDefinition = "TEXT")
    private String recommandationIA;
    
    private LocalDateTime dateCalcul;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToOne(mappedBy = "scoreCredit")
    private DemandePret demandePret;

    // Constructeur par défaut
    public ScoreCredit() {}

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getValeurScore() { return valeurScore; }
    public void setValeurScore(Double valeurScore) { this.valeurScore = valeurScore; }

    public String getNiveauRisque() { return niveauRisque; }
    public void setNiveauRisque(String niveauRisque) { this.niveauRisque = niveauRisque; }

    public String getRecommandationIA() { return recommandationIA; }
    public void setRecommandationIA(String recommandationIA) { this.recommandationIA = recommandationIA; }

    public LocalDateTime getDateCalcul() { return dateCalcul; }
    public void setDateCalcul(LocalDateTime dateCalcul) { this.dateCalcul = dateCalcul; }

    public DemandePret getDemandePret() { return demandePret; }
    public void setDemandePret(DemandePret demandePret) { this.demandePret = demandePret; }
}

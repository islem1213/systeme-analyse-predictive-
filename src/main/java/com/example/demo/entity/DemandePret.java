package com.example.demo.entity;

import com.example.demo.enums.StatutDemande;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "demande_prets")
public class DemandePret {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double montantDemande;
    private Integer dureeMois;

    @Enumerated(EnumType.STRING)
    private StatutDemande statut;

    private LocalDateTime dateCreation;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "score_credit_id", referencedColumnName = "id", unique = true)
    private ScoreCredit scoreCredit;

    @OneToMany(mappedBy = "demandePret", cascade = CascadeType.ALL)
    private List<Justificatif> justificatifs;

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Double getMontantDemande() { return montantDemande; }
    public void setMontantDemande(Double montantDemande) { this.montantDemande = montantDemande; }
    public Integer getDureeMois() { return dureeMois; }
    public void setDureeMois(Integer dureeMois) { this.dureeMois = dureeMois; }
    public StatutDemande getStatut() { return statut; }
    public void setStatut(StatutDemande statut) { this.statut = statut; }
    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    public ScoreCredit getScoreCredit() { return scoreCredit; }
    public void setScoreCredit(ScoreCredit scoreCredit) { this.scoreCredit = scoreCredit; }

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
        if (statut == null) statut = StatutDemande.EN_ATTENTE;
    }

    public Double calculerRatioEndettement() {
        if (client == null || client.getRevenuMensuel() == null || client.getRevenuMensuel() == 0) return 1.0;
        return client.getChargesFixes() / client.getRevenuMensuel();
    }
}

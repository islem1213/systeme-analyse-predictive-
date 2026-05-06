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
    private String typeCredit;
    private String objetFinancement;
    private Double autresRevenus;
    private Double autresEngagements;
    private Double apportPersonnel;
    
    @Column(columnDefinition = "TEXT")
    private String descriptionProjet;
    @Column(columnDefinition = "TEXT")
    private String objectifsProjet;
    @Column(columnDefinition = "TEXT")
    private String rentabiliteProjet;
    @Column(columnDefinition = "TEXT")
    private String risquesProjet;

    private String typeGarantie;
    private Double valeurGarantie;
    @Column(columnDefinition = "TEXT")
    private String detailsGarantie;
    @Column(columnDefinition = "TEXT")
    private String observationBanquier;

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
    public String getTypeCredit() { return typeCredit; }
    public void setTypeCredit(String typeCredit) { this.typeCredit = typeCredit; }
    public String getObjetFinancement() { return objetFinancement; }
    public void setObjetFinancement(String objetFinancement) { this.objetFinancement = objetFinancement; }
    public Double getAutresRevenus() { return autresRevenus; }
    public void setAutresRevenus(Double autresRevenus) { this.autresRevenus = autresRevenus; }
    public Double getAutresEngagements() { return autresEngagements; }
    public void setAutresEngagements(Double autresEngagements) { this.autresEngagements = autresEngagements; }
    public Double getApportPersonnel() { return apportPersonnel; }
    public void setApportPersonnel(Double apportPersonnel) { this.apportPersonnel = apportPersonnel; }
    public String getDescriptionProjet() { return descriptionProjet; }
    public void setDescriptionProjet(String descriptionProjet) { this.descriptionProjet = descriptionProjet; }
    public String getObjectifsProjet() { return objectifsProjet; }
    public void setObjectifsProjet(String objectifsProjet) { this.objectifsProjet = objectifsProjet; }
    public String getRentabiliteProjet() { return rentabiliteProjet; }
    public void setRentabiliteProjet(String rentabiliteProjet) { this.rentabiliteProjet = rentabiliteProjet; }
    public String getRisquesProjet() { return risquesProjet; }
    public void setRisquesProjet(String risquesProjet) { this.risquesProjet = risquesProjet; }
    public String getTypeGarantie() { return typeGarantie; }
    public void setTypeGarantie(String typeGarantie) { this.typeGarantie = typeGarantie; }
    public Double getValeurGarantie() { return valeurGarantie; }
    public void setValeurGarantie(Double valeurGarantie) { this.valeurGarantie = valeurGarantie; }
    public String getDetailsGarantie() { return detailsGarantie; }
    public void setDetailsGarantie(String detailsGarantie) { this.detailsGarantie = detailsGarantie; }
    public String getObservationBanquier() { return observationBanquier; }
    public void setObservationBanquier(String observationBanquier) { this.observationBanquier = observationBanquier; }
    public StatutDemande getStatut() { return statut; }
    public void setStatut(StatutDemande statut) { this.statut = statut; }
    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    public ScoreCredit getScoreCredit() { return scoreCredit; }
    public void setScoreCredit(ScoreCredit scoreCredit) { this.scoreCredit = scoreCredit; }
    public List<Justificatif> getJustificatifs() { return justificatifs; }
    public void setJustificatifs(List<Justificatif> justificatifs) { this.justificatifs = justificatifs; }

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
        if (statut == null) statut = StatutDemande.EN_ATTENTE;
    }

    public Double calculerRatioEndettement() {
        if (client == null || client.getRevenuMensuel() == null || client.getRevenuMensuel() <= 0) return 1.0;
        
        double charges = 0.0;
        if (client.getChargesFixes() != null) {
            charges = client.getChargesFixes();
        }
        
        return charges / client.getRevenuMensuel();
    }
}

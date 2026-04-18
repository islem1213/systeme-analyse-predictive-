package com.example.demo.entity;

import com.example.demo.enums.TypeJustificatif;
import jakarta.persistence.*;

@Entity
@Table(name = "justificatifs")
public class Justificatif {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomFichier;

    @Enumerated(EnumType.STRING)
    private TypeJustificatif type;

    private String urlStockage;

    @ManyToOne
    @JoinColumn(name = "demande_pret_id", nullable = false)
    private DemandePret demandePret;

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomFichier() { return nomFichier; }
    public void setNomFichier(String nomFichier) { this.nomFichier = nomFichier; }
    public TypeJustificatif getType() { return type; }
    public void setType(TypeJustificatif type) { this.type = type; }
    public String getUrlStockage() { return urlStockage; }
    public void setUrlStockage(String urlStockage) { this.urlStockage = urlStockage; }
    public DemandePret getDemandePret() { return demandePret; }
    public void setDemandePret(DemandePret demandePret) { this.demandePret = demandePret; }
}

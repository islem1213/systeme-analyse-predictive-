package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "parametres_systeme")
public class ParametreSysteme {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String cle;

    @Column(nullable = false)
    private String valeur;

    private String description;

    public ParametreSysteme() {}

    public ParametreSysteme(String cle, String valeur, String description) {
        this.cle = cle;
        this.valeur = valeur;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCle() { return cle; }
    public void setCle(String cle) { this.cle = cle; }
    public String getValeur() { return valeur; }
    public void setValeur(String valeur) { this.valeur = valeur; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

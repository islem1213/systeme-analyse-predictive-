package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "administrateurs")
@PrimaryKeyJoinColumn(name = "id")
public class Administrateur extends Utilisateur {
    private String niveauAcces;

    // Getters et Setters
    public String getNiveauAcces() { return niveauAcces; }
    public void setNiveauAcces(String niveauAcces) { this.niveauAcces = niveauAcces; }
}

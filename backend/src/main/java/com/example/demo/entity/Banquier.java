package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "banquiers")
@PrimaryKeyJoinColumn(name = "id")
public class Banquier extends Utilisateur {
    private String matricule;
    private String departement;

    // Getters et Setters
    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }
    public String getDepartement() { return departement; }
    public void setDepartement(String departement) { this.departement = departement; }
}

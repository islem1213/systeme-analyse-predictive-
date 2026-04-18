package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "clients")
@PrimaryKeyJoinColumn(name = "id")
public class Client extends Utilisateur {
    private Double revenuMensuel;
    private Double chargesFixes;
    private String profession;
    private String situationFamiliale;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private List<DemandePret> demandes;

    // Getters et Setters
    public Double getRevenuMensuel() {
        return revenuMensuel;
    }

    public void setRevenuMensuel(Double revenuMensuel) {
        this.revenuMensuel = revenuMensuel;
    }

    public Double getChargesFixes() {
        return chargesFixes;
    }

    public void setChargesFixes(Double chargesFixes) {
        this.chargesFixes = chargesFixes;
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

    public String getSituationFamiliale() {
        return situationFamiliale;
    }

    public void setSituationFamiliale(String situationFamiliale) {
        this.situationFamiliale = situationFamiliale;
    }

    public List<DemandePret> getDemandes() {
        return demandes;
    }

    public void setDemandes(List<DemandePret> demandes) {
        this.demandes = demandes;
    }
}

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
    private String cin;
    private String adresse;
    private String telephone;
    private String activitePrincipale;
    private Integer ancienneteActivite;
    private Integer age;
    private Integer nombreEnfants;
    private Double epargneMensuelle;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private List<DemandePret> demandes;

    // Getters et Setters
    public Double getRevenuMensuel() { return revenuMensuel; }
    public void setRevenuMensuel(Double revenuMensuel) { this.revenuMensuel = revenuMensuel; }
    public Double getChargesFixes() { return chargesFixes; }
    public void setChargesFixes(Double chargesFixes) { this.chargesFixes = chargesFixes; }
    public String getProfession() { return profession; }
    public void setProfession(String profession) { this.profession = profession; }
    public String getSituationFamiliale() { return situationFamiliale; }
    public void setSituationFamiliale(String situationFamiliale) { this.situationFamiliale = situationFamiliale; }
    public String getCin() { return cin; }
    public void setCin(String cin) { this.cin = cin; }
    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public String getActivitePrincipale() { return activitePrincipale; }
    public void setActivitePrincipale(String activitePrincipale) { this.activitePrincipale = activitePrincipale; }
    public Integer getAncienneteActivite() { return ancienneteActivite; }
    public void setAncienneteActivite(Integer ancienneteActivite) { this.ancienneteActivite = ancienneteActivite; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public Integer getNombreEnfants() { return nombreEnfants; }
    public void setNombreEnfants(Integer nombreEnfants) { this.nombreEnfants = nombreEnfants; }
    public Double getEpargneMensuelle() { return epargneMensuelle; }
    public void setEpargneMensuelle(Double epargneMensuelle) { this.epargneMensuelle = epargneMensuelle; }
    public List<DemandePret> getDemandes() { return demandes; }
    public void setDemandes(List<DemandePret> demandes) { this.demandes = demandes; }
}

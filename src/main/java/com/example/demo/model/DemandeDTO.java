package com.example.demo.model;

public class DemandeDTO {
    private String nom;
    private String email;
    private Double revenuMensuel;
    private Double chargesFixes;
    private Double montantSouhaite;
    private Integer dureeMois;
    private String profession;

    // Getters et Setters
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Double getRevenuMensuel() { return revenuMensuel; }
    public void setRevenuMensuel(Double revenuMensuel) { this.revenuMensuel = revenuMensuel; }
    public Double getChargesFixes() { return chargesFixes; }
    public void setChargesFixes(Double chargesFixes) { this.chargesFixes = chargesFixes; }
    public Double getMontantSouhaite() { return montantSouhaite; }
    public void setMontantSouhaite(Double montantSouhaite) { this.montantSouhaite = montantSouhaite; }
    public Integer getDureeMois() { return dureeMois; }
    public void setDureeMois(Integer dureeMois) { this.dureeMois = dureeMois; }
    public String getProfession() { return profession; }
    public void setProfession(String profession) { this.profession = profession; }
}

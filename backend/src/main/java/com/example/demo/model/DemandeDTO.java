package com.example.demo.model;

public class DemandeDTO {
    private String nom;
    private String email;
    private Double revenuMensuel;
    private Double chargesFixes;
    private Double montantSouhaite;
    private Integer dureeMois;
    private String profession;
    private String cin;
    private String adresse;
    private String telephone;
    private String activitePrincipale;
    private Integer ancienneteActivite;
    
    // Nouveaux champs pour le scoring
    private Integer age;
    private Integer nombreEnfants;
    private Double epargneMensuelle;
    private Double apportPersonnel;

    private String typeCredit;
    private String objetFinancement;
    private Double autresRevenus;
    private Double autresEngagements;
    private String descriptionProjet;
    private String objectifsProjet;
    private String rentabiliteProjet;
    private String risquesProjet;
    private String typeGarantie;
    private Double valeurGarantie;
    private String detailsGarantie;

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
    public Double getApportPersonnel() { return apportPersonnel; }
    public void setApportPersonnel(Double apportPersonnel) { this.apportPersonnel = apportPersonnel; }

    public String getTypeCredit() { return typeCredit; }
    public void setTypeCredit(String typeCredit) { this.typeCredit = typeCredit; }
    public String getObjetFinancement() { return objetFinancement; }
    public void setObjetFinancement(String objetFinancement) { this.objetFinancement = objetFinancement; }
    public Double getAutresRevenus() { return autresRevenus; }
    public void setAutresRevenus(Double autresRevenus) { this.autresRevenus = autresRevenus; }
    public Double getAutresEngagements() { return autresEngagements; }
    public void setAutresEngagements(Double autresEngagements) { this.autresEngagements = autresEngagements; }
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
}

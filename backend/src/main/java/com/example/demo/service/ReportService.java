package com.example.demo.service;

import com.example.demo.entity.DemandePret;
import com.example.demo.entity.Client;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class ReportService {

    public ByteArrayInputStream generateCreditDemandReport(DemandePret demande) {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.DARK_GRAY);
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, new Color(42, 127, 98));
            Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, Color.BLACK);
            Font textFont = FontFactory.getFont(FontFactory.HELVETICA, 11, Color.BLACK);

            // Title
            Paragraph title = new Paragraph("📄 Rapport de Soumission de Demande de Crédit", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            Client client = demande.getClient();

            // 1. Informations Générales
            addSection(document, "1. Informations Générales du Client", sectionFont);
            addInfo(document, "Nom / Raison sociale : ", client.getNom(), labelFont, textFont);
            addInfo(document, "Numéro d’identification (CIN / RC) : ", client.getCin(), labelFont, textFont);
            addInfo(document, "Adresse : ", client.getAdresse(), labelFont, textFont);
            addInfo(document, "Téléphone : ", client.getTelephone(), labelFont, textFont);
            addInfo(document, "Email : ", client.getEmail(), labelFont, textFont);
            addInfo(document, "Activité principale : ", client.getActivitePrincipale(), labelFont, textFont);
            addInfo(document, "Ancienneté de l’activité : ", client.getAncienneteActivite() != null ? client.getAncienneteActivite() + " ans" : "", labelFont, textFont);

            // 2. Objet de la Demande
            addSection(document, "2. Objet de la Demande de Crédit", sectionFont);
            addInfo(document, "Type de crédit demandé : ", demande.getTypeCredit(), labelFont, textFont);
            addInfo(document, "Montant demandé : ", demande.getMontantDemande() != null ? demande.getMontantDemande() + " €" : "", labelFont, textFont);
            addInfo(document, "Durée souhaitée : ", demande.getDureeMois() != null ? demande.getDureeMois() + " mois" : "", labelFont, textFont);
            addInfo(document, "Objet du financement : ", demande.getObjetFinancement(), labelFont, textFont);

            // 3. Situation Financière
            addSection(document, "3. Situation Financière du Client", sectionFont);
            addSection(document, "   3.1 Revenus", labelFont);
            addInfo(document, "Revenus mensuels : ", client.getRevenuMensuel() != null ? client.getRevenuMensuel() + " €" : "", labelFont, textFont);
            addInfo(document, "Autres sources de revenus : ", demande.getAutresRevenus() != null ? demande.getAutresRevenus() + " €" : "0 €", labelFont, textFont);
            
            addSection(document, "   3.2 Charges", labelFont);
            addInfo(document, "Charges fixes mensuelles : ", client.getChargesFixes() != null ? client.getChargesFixes() + " €" : "", labelFont, textFont);
            addInfo(document, "Crédits en cours / Autres engagements : ", demande.getAutresEngagements() != null ? demande.getAutresEngagements() + " €" : "0 €", labelFont, textFont);

            addSection(document, "   3.3 Capacité de remboursement", labelFont);
            double totalRevenu = (client.getRevenuMensuel() != null ? client.getRevenuMensuel() : 0) + (demande.getAutresRevenus() != null ? demande.getAutresRevenus() : 0);
            double totalCharges = (client.getChargesFixes() != null ? client.getChargesFixes() : 0) + (demande.getAutresEngagements() != null ? demande.getAutresEngagements() : 0);
            double net = totalRevenu - totalCharges;
            double ratio = totalRevenu > 0 ? (totalCharges / totalRevenu) * 100 : 0;
            
            addInfo(document, "Revenu net disponible : ", String.format("%.2f €", net), labelFont, textFont);
            addInfo(document, "Taux d’endettement estimé : ", String.format("%.2f %%", ratio), labelFont, textFont);

            // 4. Analyse du Projet
            addSection(document, "4. Analyse du Projet (si applicable)", sectionFont);
            addInfo(document, "Description : ", demande.getDescriptionProjet(), labelFont, textFont);
            addInfo(document, "Objectifs : ", demande.getObjectifsProjet(), labelFont, textFont);
            addInfo(document, "Rentabilité : ", demande.getRentabiliteProjet(), labelFont, textFont);
            addInfo(document, "Risques : ", demande.getRisquesProjet(), labelFont, textFont);

            // 5. Garanties
            addSection(document, "5. Garanties Proposées", sectionFont);
            addInfo(document, "Type de garantie : ", demande.getTypeGarantie(), labelFont, textFont);
            addInfo(document, "Valeur estimée : ", demande.getValeurGarantie() != null ? demande.getValeurGarantie() + " €" : "", labelFont, textFont);
            addInfo(document, "Détails : ", demande.getDetailsGarantie(), labelFont, textFont);

            // 6. Documents Fournis
            addSection(document, "6. Documents Fournis", sectionFont);
            if (demande.getJustificatifs() != null && !demande.getJustificatifs().isEmpty()) {
                for (var j : demande.getJustificatifs()) {
                    Paragraph p = new Paragraph("- " + j.getType() + " (" + j.getNomFichier() + ")", textFont);
                    document.add(p);
                }
            } else {
                document.add(new Paragraph("Aucun document fourni électroniquement.", textFont));
            }

            // 7. Avis Préliminaire
            addSection(document, "7. Avis Préliminaire (IA / Conseiller)", sectionFont);
            if (demande.getScoreCredit() != null) {
                addInfo(document, "Score IA : ", String.format("%.2f", demande.getScoreCredit().getValeurScore()), labelFont, textFont);
                addInfo(document, "Niveau de Risque : ", demande.getScoreCredit().getNiveauRisque(), labelFont, textFont);
                addInfo(document, "Recommandation IA : ", demande.getScoreCredit().getRecommandationIA(), labelFont, textFont);
            }
            addInfo(document, "Observations Conseiller : ", demande.getObservationBanquier(), labelFont, textFont);

            // 8. Prochaine Étape
            addSection(document, "8. Prochaine Étape", sectionFont);
            document.add(new Paragraph("Étude du dossier par le comité de crédit", textFont));
            document.add(new Paragraph("Délai de réponse estimé : 5 à 10 jours ouvrés", textFont));
            document.add(new Paragraph("Contact pour suivi : service.credit@creditpredict.com", textFont));

            // 9. Signature
            addSection(document, "9. Signature", sectionFont);
            Paragraph signature = new Paragraph("\n\nClient : ____________________      Conseiller : ____________________", textFont);
            document.add(signature);
            Paragraph date = new Paragraph("\nDate : " + (demande.getDateCreation() != null ? demande.getDateCreation().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "N/A"), textFont);
            document.add(date);

            document.close();
        } catch (DocumentException ex) {
            ex.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    private void addSection(Document doc, String title, Font font) throws DocumentException {
        Paragraph p = new Paragraph(title, font);
        p.setSpacingBefore(10);
        p.setSpacingAfter(5);
        doc.add(p);
    }

    private void addInfo(Document doc, String label, String value, Font labelFont, Font textFont) throws DocumentException {
        if (value == null) value = "N/A";
        Paragraph p = new Paragraph();
        p.add(new Chunk(label, labelFont));
        p.add(new Chunk(value, textFont));
        doc.add(p);
    }
}

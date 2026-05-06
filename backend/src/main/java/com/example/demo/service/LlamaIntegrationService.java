package com.example.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

/**
 * Service IA utilisant Spring AI avec Groq (Llama 3).
 * Intègre désormais les dépendances officielles Spring AI.
 */
@Service
public class LlamaIntegrationService {

    private static final Logger logger = LoggerFactory.getLogger(LlamaIntegrationService.class);

    private final ChatModel chatModel;

    public LlamaIntegrationService(@Qualifier("openAiChatModel") ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    /**
     * Génère une recommandation de crédit basée sur le profil du client.
     */
    public String generateRecommendation(Double score, Double income, Double ratio, String status) {
        String prompt = String.format(
            "Tu es un expert en analyse de crédit bancaire. " +
            "Le client a obtenu un score FICO de %.0f/850, un revenu mensuel de %.2f DT, " +
            "un ratio d'endettement de %.2f%% et son dossier est classé '%s'. " +
            "Explique en français, de façon claire et professionnelle, pourquoi cette décision a été prise " +
            "et donne exactement 3 conseils concrets et chiffrés pour améliorer son profil financier.",
            score, income, ratio * 100, status
        );
        return callAI(prompt);
    }

    /**
     * Valide et analyse les données d'une demande de crédit.
     */
    public String validateAndAnalyze(com.example.demo.model.DemandeDTO dto) {
        String inputData = String.format(
            "Nom: %s | Email: %s | Montant: %.2f DT | Durée: %d mois | " +
            "Revenus: %.2f DT | Charges: %.2f DT | Profession: %s | Type crédit: %s",
            dto.getNom(), dto.getEmail(),
            dto.getMontantSouhaite() != null ? dto.getMontantSouhaite() : 0.0,
            dto.getDureeMois() != null ? dto.getDureeMois() : 0,
            dto.getRevenuMensuel() != null ? dto.getRevenuMensuel() : 0.0,
            dto.getChargesFixes() != null ? dto.getChargesFixes() : 0.0,
            dto.getProfession(), dto.getTypeCredit()
        );

        String prompt = "Tu es un assistant intelligent spécialisé dans la validation des demandes de crédit.\n\n" +
            "Analyse les données suivantes et génère un rapport JSON structuré :\n\n" +
            inputData + "\n\n" +
            "Règles :\n" +
            "- Vérifie les champs obligatoires (nom, email, montant>0, durée>0, revenus>0)\n" +
            "- Détecte les incohérences (revenu trop faible vs montant demandé)\n" +
            "- Calcule le revenu net et le taux d'endettement\n" +
            "- Génère une recommandation claire\n\n" +
            "Réponds UNIQUEMENT avec ce JSON (sans markdown) :\n" +
            "{\"valid\":true,\"errors\":[],\"warnings\":[],\"computed\":{\"revenu_net\":\"\",\"taux_endettement\":\"\"},\"recommendation\":\"\"}";

        return callAI(prompt);
    }

    /**
     * Répond à une question de suivi concernant un dossier spécifique.
     */
    public String respondToQuestion(String question, String context) {
        String prompt = String.format(
            "Tu es un conseiller financier expert. Voici le contexte du dossier de crédit :\n%s\n\n" +
            "Question du client : %s\n\n" +
            "Réponds de manière pédagogique, claire et professionnelle en français.",
            context, question
        );
        return callAI(prompt);
    }

    private String callAI(String promptText) {
        try {
            return chatModel.call(promptText);
        } catch (Exception e) {
            logger.error("Erreur lors de l'appel Spring AI: {}", e.getMessage());
            return "L'analyse IA est momentanément indisponible. Veuillez vérifier votre clé API Groq.";
        }
    }
}

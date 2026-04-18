package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

/**
 * Service pour l'intégration de l'IA locale (Llama 3 via Ollama)
 */
@Service
public class LlamaIntegrationService {

    @Value("${ollama.api.url}")
    private String apiUrl;

    @Value("${ollama.model.name}")
    private String modelName;

    private final RestTemplate restTemplate;

    public LlamaIntegrationService() {
        org.springframework.http.client.SimpleClientHttpRequestFactory factory = new org.springframework.http.client.SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000);
        factory.setReadTimeout(10000);
        this.restTemplate = new RestTemplate(factory);
    }

    /**
     * Génère une recommandation de crédit basée sur le profil du client
     */
    public String generateRecommendation(Double ratio, Double income, Double score, String status) {
        String prompt = String.format(
            "Le client a un ratio d'endettement de %.2f, un revenu mensuel de %.2f DT, " +
            "et un score de risque de %.2f. Son dossier est %s. " +
            "Explique en français pourquoi cette décision a été prise et donne 3 conseils " +
            "statistiques concrets pour améliorer son profil financier.",
            ratio, income, score, status
        );

        return callOllama(prompt);
    }

    /**
     * Répond à une question de suivi concernant un dossier spécifique
     */
    public String respondToQuestion(String question, String context) {
        String prompt = String.format(
            "Contexte du dossier de crédit : %s \n\n" +
            "Question du client : %s \n\n" +
            "Réponds de manière pédagogique et professionnelle en français.",
            context, question
        );

        return callOllama(prompt);
    }

    /**
     * Méthode générique pour appeler l'API Ollama
     */
    private String callOllama(String prompt) {
        Map<String, Object> request = new HashMap<>();
        request.put("model", modelName);
        request.put("prompt", prompt);
        request.put("stream", false);

        try {
            Map<?, ?> response = restTemplate.postForObject(apiUrl, request, Map.class);
            return (String) response.get("response");
        } catch (Exception e) {
            return "Désolé, l'analyse IA est momentanément indisponible.";
        }
    }
}

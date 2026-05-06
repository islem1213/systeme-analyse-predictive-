package com.example.demo.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ValidationReport {
    private boolean valid = true;
    private List<String> errors = new ArrayList<>();
    private List<String> warnings = new ArrayList<>();
    private Map<String, Object> cleaned_data = new HashMap<>();
    private Map<String, String> computed = new HashMap<>();
    private String recommendation = "";

    // Getters et Setters
    public boolean isValid() { return valid; }
    public void setValid(boolean valid) { this.valid = valid; }
    public List<String> getErrors() { return errors; }
    public void setErrors(List<String> errors) { this.errors = errors; }
    public List<String> getWarnings() { return warnings; }
    public void setWarnings(List<String> warnings) { this.warnings = warnings; }
    public Map<String, Object> getCleaned_data() { return cleaned_data; }
    public void setCleaned_data(Map<String, Object> cleaned_data) { this.cleaned_data = cleaned_data; }
    public Map<String, String> getComputed() { return computed; }
    public void setComputed(Map<String, String> computed) { this.computed = computed; }
    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public void addError(String error) {
        this.errors.add(error);
        this.valid = false;
    }

    public void addWarning(String warning) {
        this.warnings.add(warning);
    }
}

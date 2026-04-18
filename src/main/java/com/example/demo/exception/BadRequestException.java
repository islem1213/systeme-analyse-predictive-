package com.example.demo.exception;

/**
 * Exception lancée lorsqu'une requête est invalide ou ne respecte pas les règles métier (HTTP 400)
 */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}

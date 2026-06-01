package com.sehat24x7.exception;

import org.springframework.http.HttpStatus;
import java.util.Map;

/**
 * Exception thrown for validation errors
 */
public class ValidationException extends ApiException {
    public ValidationException(String message) {
        super(message, "VALIDATION_ERROR", HttpStatus.BAD_REQUEST.value());
    }

    public ValidationException(String message, Map<String, String> errors) {
        super(message, "VALIDATION_ERROR", HttpStatus.BAD_REQUEST.value(), errors);
    }
}

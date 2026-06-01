package com.sehat24x7.exception;

/**
 * Custom exception for API operations
 * Provides standard error handling across the application
 */
public class ApiException extends RuntimeException {
    private final String errorCode;
    private final int httpStatus;
    private final Object details;

    public ApiException(String message, String errorCode, int httpStatus) {
        this(message, errorCode, httpStatus, null);
    }

    public ApiException(String message, String errorCode, int httpStatus, Object details) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
        this.details = details;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public int getHttpStatus() {
        return httpStatus;
    }

    public Object getDetails() {
        return details;
    }
}

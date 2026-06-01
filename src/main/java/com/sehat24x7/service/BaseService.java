package com.sehat24x7.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Base service class with common functionality
 */
public abstract class BaseService {
    protected final Logger logger = LoggerFactory.getLogger(this.getClass());

    protected void logInfo(String message) {
        logger.info("[{}] {}", this.getClass().getSimpleName(), message);
    }

    protected void logWarn(String message) {
        logger.warn("[{}] {}", this.getClass().getSimpleName(), message);
    }

    protected void logError(String message, Exception e) {
        logger.error("[{}] {} - {}", this.getClass().getSimpleName(), message, e.getMessage());
    }

    protected void logError(String message) {
        logger.error("[{}] {}", this.getClass().getSimpleName(), message);
    }

    protected void logDebug(String message) {
        logger.debug("[{}] {}", this.getClass().getSimpleName(), message);
    }
}

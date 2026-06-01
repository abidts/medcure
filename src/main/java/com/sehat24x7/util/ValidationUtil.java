package com.sehat24x7.util;

import java.util.regex.Pattern;

/**
 * Utility class for validation operations
 */
public class ValidationUtil {
    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    private static final Pattern PHONE_PATTERN = 
        Pattern.compile("^[0-9]{10}$");
    private static final Pattern ALPHANUMERIC_PATTERN = 
        Pattern.compile("^[a-zA-Z0-9\\s]+$");

    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    public static boolean isValidPhoneNumber(String phone) {
        return phone != null && PHONE_PATTERN.matcher(phone).matches();
    }

    public static boolean isValidString(String str, int minLength, int maxLength) {
        return str != null && str.trim().length() >= minLength && str.length() <= maxLength;
    }

    public static boolean isNullOrEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    public static String sanitizeInput(String input) {
        if (input == null) return null;
        return input.trim();
    }

    public static boolean isValidName(String name) {
        return isValidString(name, 2, 100) && name.matches("^[a-zA-Z\\s]+$");
    }

    public static boolean isValidPrice(Double price) {
        return price != null && price > 0;
    }
}

package com.sehat24x7.util;

import java.security.SecureRandom;
import java.util.Random;

/**
 * Utility class for common operations
 */
public class CommonUtil {
    private static final SecureRandom random = new SecureRandom();
    private static final String OTP_CHARS = "0123456789";

    /**
     * Generate a random OTP
     */
    public static String generateOtp(int length) {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < length; i++) {
            otp.append(OTP_CHARS.charAt(random.nextInt(OTP_CHARS.length())));
        }
        return otp.toString();
    }

    /**
     * Generate a unique booking reference
     */
    public static String generateBookingReference() {
        return "BK" + System.currentTimeMillis() + random.nextInt(10000);
    }

    /**
     * Generate a unique consultation reference
     */
    public static String generateConsultationReference() {
        return "CON" + System.currentTimeMillis() + random.nextInt(10000);
    }

    /**
     * Get default avatar URL
     */
    public static String getDefaultAvatarUrl() {
        return "https://via.placeholder.com/150?text=Avatar";
    }

    /**
     * Format phone number
     */
    public static String formatPhoneNumber(String phone) {
        if (phone == null || phone.length() != 10) return phone;
        return phone.replaceAll("(\\d{5})(\\d{5})", "$1-$2");
    }

    /**
     * Get file extension
     */
    public static String getFileExtension(String filename) {
        if (filename == null) return null;
        int lastDot = filename.lastIndexOf('.');
        return lastDot > 0 ? filename.substring(lastDot + 1) : null;
    }

    /**
     * Check if file is image
     */
    public static boolean isImageFile(String filename) {
        String ext = getFileExtension(filename);
        return ext != null && (ext.equalsIgnoreCase("jpg") || 
               ext.equalsIgnoreCase("jpeg") || 
               ext.equalsIgnoreCase("png") || 
               ext.equalsIgnoreCase("gif"));
    }
}

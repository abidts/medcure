package com.sehat24x7.dto;

import jakarta.validation.constraints.*;

public class ConsultationVerificationRequest {
    
    @NotNull(message = "Consultation booking ID is required")
    @Positive(message = "Consultation booking ID must be positive")
    private Long consultationBookingId;
    
    @NotBlank(message = "Verification code is required")
    @Size(min = 4, max = 10, message = "Verification code must be between 4 and 10 characters")
    private String verificationCode;

    // Constructors
    public ConsultationVerificationRequest() {}

    public ConsultationVerificationRequest(Long consultationBookingId, String verificationCode) {
        this.consultationBookingId = consultationBookingId;
        this.verificationCode = verificationCode;
    }

    // Getters and Setters
    public Long getConsultationBookingId() {
        return consultationBookingId;
    }

    public void setConsultationBookingId(Long consultationBookingId) {
        this.consultationBookingId = consultationBookingId;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    @Override
    public String toString() {
        return "ConsultationVerificationRequest{" +
                "consultationBookingId=" + consultationBookingId +
                ", verificationCode='" + verificationCode + '\'' +
                '}';
    }
}

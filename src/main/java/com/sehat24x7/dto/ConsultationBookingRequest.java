package com.sehat24x7.dto;

import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ConsultationBookingRequest {
    
    @NotNull(message = "Specialization ID is required")
    @Positive(message = "Specialization ID must be positive")
    private Long specializationId;

    @NotBlank(message = "Patient name is required")
    @Size(min = 2, max = 100, message = "Patient name must be between 2 and 100 characters")
    private String patientName;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
    private String mobileNumber;

    @Email(message = "Invalid email address")
    private String email;

    @Size(max = 500, message = "Symptoms cannot exceed 500 characters")
    private String symptoms;

    @Size(max = 1000, message = "Additional notes cannot exceed 1000 characters")
    private String additionalNotes;

    // Constructors
    public ConsultationBookingRequest() {}

    public ConsultationBookingRequest(Long specializationId, String patientName, String mobileNumber) {
        this.specializationId = specializationId;
        this.patientName = patientName;
        this.mobileNumber = mobileNumber;
    }

    public ConsultationBookingRequest(Long specializationId, String patientName, String mobileNumber, 
                                     String email, String symptoms, String additionalNotes) {
        this.specializationId = specializationId;
        this.patientName = patientName;
        this.mobileNumber = mobileNumber;
        this.email = email;
        this.symptoms = symptoms;
        this.additionalNotes = additionalNotes;
    }

    // Getters and Setters
    public Long getSpecializationId() {
        return specializationId;
    }

    public void setSpecializationId(Long specializationId) {
        this.specializationId = specializationId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }

    public String getAdditionalNotes() {
        return additionalNotes;
    }

    public void setAdditionalNotes(String additionalNotes) {
        this.additionalNotes = additionalNotes;
    }

    @Override
    public String toString() {
        return "ConsultationBookingRequest{" +
                "specializationId=" + specializationId +
                ", patientName='" + patientName + '\'' +
                ", mobileNumber='" + mobileNumber + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}

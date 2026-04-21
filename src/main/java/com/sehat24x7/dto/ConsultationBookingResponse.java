package com.sehat24x7.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationBookingResponse {
    private Long id;
    private String patientName;
    private String mobileNumber;
    private String email;
    private String specialization;
    private Double consultationFee;
    private String status;
    private Boolean verificationCodeVerified;
    private LocalDateTime createdAt;
    private LocalDateTime bookedAt;
    private String symptoms;
    private String additionalNotes;
    private String assignedDoctorName;
}

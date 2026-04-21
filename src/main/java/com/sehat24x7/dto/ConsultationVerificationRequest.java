package com.sehat24x7.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationVerificationRequest {
    private Long consultationBookingId;
    private String verificationCode;
}

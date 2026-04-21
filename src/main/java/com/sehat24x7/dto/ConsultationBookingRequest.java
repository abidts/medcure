package com.sehat24x7.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationBookingRequest {
    private Long specializationId;
    private String patientName;
    private String mobileNumber;
    private String email;
    private String symptoms;
    private String additionalNotes;
}

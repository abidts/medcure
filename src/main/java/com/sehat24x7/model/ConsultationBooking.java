package com.sehat24x7.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "consultation_bookings")
public class ConsultationBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specialization_id", nullable = false)
    private Specialization specialization;

    @Column(nullable = false)
    private String patientName;

    @Column(nullable = false)
    private String mobileNumber;

    @Column
    private String email;

    @Column
    private Double consultationFee;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;

    @Column
    private String verificationCode;

    @Column
    private Boolean verificationCodeVerified = false;

    @Column
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime verifiedAt;

    @Column
    private LocalDateTime bookedAt;

    @Column(length = 500)
    private String symptoms;

    @Column(length = 1000)
    private String additionalNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_doctor_id")
    private Doctor assignedDoctor;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum BookingStatus {
        PENDING,           // Initial booking created
        VERIFICATION_PENDING,  // Waiting for mobile verification
        VERIFIED,          // Mobile verified
        DOCTOR_ASSIGNED,   // Doctor assigned
        CONFIRMED,         // Appointment confirmed
        COMPLETED,         // Consultation completed
        CANCELLED          // Booking cancelled
    }
}

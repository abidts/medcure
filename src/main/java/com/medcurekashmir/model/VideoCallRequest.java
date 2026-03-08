package com.medcurekashmir.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * Video Call Request from patient to doctor
 * Created when a patient requests an instant video call with an online doctor
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "video_call_request")
public class VideoCallRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(nullable = false)
    private String reason; // Reason for the call

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime requestTime;

    @Column
    private LocalDateTime responseTime;

    @Column
    private String responseMessage;

    @Column
    private String callRoomId; // Unique room ID for the video call

    @Column
    private LocalDateTime callStartTime;

    @Column
    private LocalDateTime callEndTime;

    @Column(length = 500)
    private String callNotes;

    @Column
    private Double callCost; // Cost of the call

    @Column
    private Boolean paymentDeducted = false; // Whether payment was deducted from wallet

    @Column
    private Integer callDurationMinutes; // Actual call duration in minutes

    @PrePersist
    protected void onCreate() {
        requestTime = LocalDateTime.now();
        if (callRoomId == null) {
            callRoomId = "call_" + System.currentTimeMillis() + "_" + (patient != null ? patient.getId() : 0);
        }
    }

    public enum RequestStatus {
        PENDING,    // Waiting for doctor response
        ACCEPTED,   // Doctor accepted the call
        REJECTED,   // Doctor rejected the call
        MISSED,     // Doctor didn't respond
        COMPLETED   // Call completed
    }
}

package com.tabib24x7.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * Doctor's online/offline status
 * Tracks whether a doctor is available for instant video consultations
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "doctor_status")
public class DoctorStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", unique = true, nullable = false)
    private Doctor doctor;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status = Status.OFFLINE;

    @Column(length = 500)
    private String message; // Optional status message (e.g., "Available for consultations", "On break")

    @Column(nullable = false)
    private LocalDateTime lastStatusChange;

    @Column
    private LocalDateTime lastOnlineTime;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        lastStatusChange = LocalDateTime.now();
    }

    public enum Status {
        ONLINE,   // Available for instant video calls
        OFFLINE,  // Not available
        BUSY      // Online but in a call/consultation
    }
}

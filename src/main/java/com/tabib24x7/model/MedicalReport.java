package com.tabib24x7.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "medical_reports")
@Data
@NoArgsConstructor
public class MedicalReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false)
    private String reportName;

    @Column(nullable = false)
    private String fileUrl;

    @Column(nullable = false)
    private String publicId; // Cloudinary public ID for deletion

    @Column(nullable = false)
    private String fileType; // image or pdf

    @Column(nullable = false)
    private LocalDateTime uploadDate;

    @PrePersist
    protected void onCreate() {
        uploadDate = LocalDateTime.now();
    }
}

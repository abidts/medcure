package com.tabib24x7.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "prescription_medicines")
public class PrescriptionMedicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    @Column(nullable = false)
    private String medicineName;

    @Column(nullable = false)
    private String dosage;

    @Column(nullable = false)
    private String frequency;

    @Column(nullable = false)
    private Integer durationDays;

    @Column(length = 500)
    private String instructions;

    @Column
    private String morningDose;

    @Column
    private String afternoonDose;

    @Column
    private String eveningDose;

    @Column
    private String nightDose;

    @Column
    private Boolean beforeFood = true;

    @Column(length = 500)
    private String sideEffects;
}

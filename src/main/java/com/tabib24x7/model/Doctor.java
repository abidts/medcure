package com.tabib24x7.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "doctors")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String qualification;

    @Column(length = 1000)
    private String experience;

    @Column(nullable = false)
    private Integer yearsOfExperience;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specialization_id", nullable = false)
    private Specialization specialization;

    @Column(nullable = false)
    private String clinicAddress;

    @Column
    private String district;

    @Column
    private String state;

    @Column(nullable = false)
    private Double consultationFee;

    @Column(nullable = false)
    private Boolean available = true;

    @Column
    private String image;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @Column
    private String city;

    @Column
    private String area;

    @Column(length = 1000)
    private String specializations;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Appointment> appointments;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Review> reviews;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<DoctorAvailability> availabilities;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<DoctorEducation> educations;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<DoctorService> services;

    @Column(nullable = false)
    private LocalDate joiningDate;
}

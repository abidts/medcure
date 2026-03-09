package com.tabib24x7.service;

import com.tabib24x7.model.Doctor;

import java.util.List;
import java.util.Optional;

public interface DoctorService {
    List<Doctor> getAllDoctors();
    List<Doctor> getAvailableDoctors();
    Optional<Doctor> getDoctorById(Long id);
    List<Doctor> getDoctorsBySpecialization(Long specializationId);
    List<Doctor> searchDoctorsByName(String name);
    List<Doctor> getDoctorsByFeeRange(Double minFee, Double maxFee);
    Doctor createDoctor(Doctor doctor);
    Doctor updateDoctor(Long id, Doctor doctor);
    void deleteDoctor(Long id);
    Double getAverageRating(Long doctorId);
    Long getReviewCount(Long doctorId);

    // New methods for doctor registration with user account
    Doctor registerDoctorWithUser(Doctor doctor, String password);
    Optional<Doctor> getDoctorByUserId(Long userId);
    List<Doctor> getDoctorsByUserIdIn(List<Long> userIds);
}

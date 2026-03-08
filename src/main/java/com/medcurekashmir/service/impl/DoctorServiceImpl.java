package com.medcurekashmir.service.impl;

import com.medcurekashmir.model.Doctor;
import com.medcurekashmir.model.Specialization;
import com.medcurekashmir.model.User;
import com.medcurekashmir.repository.DoctorRepository;
import com.medcurekashmir.repository.SpecializationRepository;
import com.medcurekashmir.repository.UserRepository;
import com.medcurekashmir.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private SpecializationRepository specializationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public List<Doctor> getAvailableDoctors() {
        return doctorRepository.findByAvailableTrue();
    }

    @Override
    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    @Override
    public List<Doctor> getDoctorsBySpecialization(Long specializationId) {
        Specialization specialization = specializationRepository.findById(specializationId)
                .orElseThrow(() -> new RuntimeException("Specialization not found"));
        return doctorRepository.findBySpecializationAndAvailableTrue(specialization);
    }

    @Override
    public List<Doctor> searchDoctorsByName(String name) {
        return doctorRepository.searchByName(name);
    }

    @Override
    public List<Doctor> getDoctorsByFeeRange(Double minFee, Double maxFee) {
        return doctorRepository.findByConsultationFeeBetween(minFee, maxFee);
    }

    @Override
    public Doctor createDoctor(Doctor doctor) {
        if (doctor.getSpecialization() != null && doctor.getSpecialization().getId() != null) {
            Specialization specialization = specializationRepository.findById(doctor.getSpecialization().getId())
                    .orElseThrow(() -> new RuntimeException("Specialization not found"));
            doctor.setSpecialization(specialization);
        }
        return doctorRepository.save(doctor);
    }

    @Override
    public Doctor updateDoctor(Long id, Doctor doctor) {
        if (doctorRepository.existsById(id)) {
            doctor.setId(id);
            if (doctor.getSpecialization() != null && doctor.getSpecialization().getId() != null) {
                Specialization specialization = specializationRepository.findById(doctor.getSpecialization().getId())
                        .orElseThrow(() -> new RuntimeException("Specialization not found"));
                doctor.setSpecialization(specialization);
            }
            return doctorRepository.save(doctor);
        }
        throw new RuntimeException("Doctor not found with id: " + id);
    }

    @Override
    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    @Override
    public Double getAverageRating(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return doctorRepository.findById(doctorId).map(d -> 0.0).orElse(0.0);
    }

    @Override
    public Long getReviewCount(Long doctorId) {
        return 0L;
    }

    @Override
    @Transactional
    public Doctor registerDoctorWithUser(Doctor doctor, String password) {
        // Check if email already exists
        if (userRepository.existsByEmail(doctor.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create user account for doctor
        User user = new User();
        user.setEmail(doctor.getEmail());
        user.setName(doctor.getName());
        user.setPhone(doctor.getPhone());
        user.setPassword("HASH_" + password);
        user.setRole(User.UserRole.DOCTOR);
        user.setIsActive(true);
        user.setCreatedAt(java.time.LocalDateTime.now());
        user.setUpdatedAt(java.time.LocalDateTime.now());
        userRepository.save(user);

        // Set specialization if provided
        if (doctor.getSpecialization() != null && doctor.getSpecialization().getId() != null) {
            Specialization specialization = specializationRepository.findById(doctor.getSpecialization().getId())
                    .orElseThrow(() -> new RuntimeException("Specialization not found"));
            doctor.setSpecialization(specialization);
        }

        // Link doctor to user
        doctor.setUser(user);
        if (doctor.getJoiningDate() == null) {
            doctor.setJoiningDate(LocalDate.now());
        }
        if (doctor.getAvailable() == null) {
            doctor.setAvailable(true);
        }

        return doctorRepository.save(doctor);
    }

    @Override
    public Optional<Doctor> getDoctorByUserId(Long userId) {
        return doctorRepository.findByUserId(userId);
    }

    @Override
    public List<Doctor> getDoctorsByUserIdIn(List<Long> userIds) {
        return doctorRepository.findByUserIdIn(userIds);
    }
}

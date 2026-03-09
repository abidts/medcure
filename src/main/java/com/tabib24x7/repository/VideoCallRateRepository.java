package com.tabib24x7.repository;

import com.tabib24x7.model.Doctor;
import com.tabib24x7.model.VideoCallRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VideoCallRateRepository extends JpaRepository<VideoCallRate, Long> {
    Optional<VideoCallRate> findByDoctorId(Long doctorId);
    Optional<VideoCallRate> findByDoctor(Doctor doctor);
}

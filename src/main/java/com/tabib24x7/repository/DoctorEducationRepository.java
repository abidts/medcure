package com.tabib24x7.repository;

import com.tabib24x7.model.Doctor;
import com.tabib24x7.model.DoctorEducation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorEducationRepository extends JpaRepository<DoctorEducation, Long> {
    List<DoctorEducation> findByDoctorId(Long doctorId);
    void deleteByDoctorId(Long doctorId);
}

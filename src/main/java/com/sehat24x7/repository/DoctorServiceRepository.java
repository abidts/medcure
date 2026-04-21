package com.sehat24x7.repository;

import com.sehat24x7.model.Doctor;
import com.sehat24x7.model.DoctorService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorServiceRepository extends JpaRepository<DoctorService, Long> {
    List<DoctorService> findByDoctorId(Long doctorId);
    void deleteByDoctorId(Long doctorId);
}

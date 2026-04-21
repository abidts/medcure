package com.sehat24x7.repository;

import com.sehat24x7.model.Doctor;
import com.sehat24x7.model.DoctorStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorStatusRepository extends JpaRepository<DoctorStatus, Long> {
    Optional<DoctorStatus> findByDoctor(Doctor doctor);

    Optional<DoctorStatus> findByDoctorId(Long doctorId);

    List<DoctorStatus> findByStatus(DoctorStatus.Status status);

    @Query("SELECT ds FROM DoctorStatus ds WHERE ds.status = 'ONLINE'")
    List<DoctorStatus> findOnlineDoctors();

    @Query("SELECT ds FROM DoctorStatus ds JOIN FETCH ds.doctor d WHERE ds.status = 'ONLINE'")
    List<DoctorStatus> findOnlineDoctorsWithDetails();
}

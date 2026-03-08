package com.medcurekashmir.repository;

import com.medcurekashmir.model.Doctor;
import com.medcurekashmir.model.Patient;
import com.medcurekashmir.model.VideoCallRequest;
import com.medcurekashmir.model.VideoCallRequest.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VideoCallRequestRepository extends JpaRepository<VideoCallRequest, Long> {
    
    List<VideoCallRequest> findByDoctor(Doctor doctor);
    
    List<VideoCallRequest> findByPatient(Patient patient);
    
    List<VideoCallRequest> findByDoctorAndStatus(Doctor doctor, RequestStatus status);
    
    List<VideoCallRequest> findByPatientAndStatus(Patient patient, RequestStatus status);
    
    @Query("SELECT v FROM VideoCallRequest v WHERE v.doctor = :doctor AND v.status = 'PENDING' ORDER BY v.requestTime DESC")
    List<VideoCallRequest> findPendingRequestsByDoctor(@Param("doctor") Doctor doctor);
    
    @Query("SELECT v FROM VideoCallRequest v WHERE v.patient = :patient AND v.status = 'PENDING' ORDER BY v.requestTime DESC")
    List<VideoCallRequest> findPendingRequestsByPatient(@Param("patient") Patient patient);
    
    @Query("SELECT v FROM VideoCallRequest v WHERE v.doctor.id = :doctorId AND v.status = 'PENDING' ORDER BY v.requestTime DESC")
    List<VideoCallRequest> findPendingRequestsByDoctorId(@Param("doctorId") Long doctorId);
    
    Optional<VideoCallRequest> findFirstByDoctorAndStatusOrderByRequestTimeDesc(Doctor doctor, RequestStatus status);
    
    @Query("SELECT v FROM VideoCallRequest v WHERE v.status = 'PENDING' AND v.requestTime < :threshold")
    List<VideoCallRequest> findOldPendingRequests(@Param("threshold") LocalDateTime threshold);
}

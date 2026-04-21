package com.sehat24x7.repository;

import com.sehat24x7.model.InstantConsultationQueue;
import com.sehat24x7.model.InstantConsultationQueue.QueueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InstantConsultationQueueRepository extends JpaRepository<InstantConsultationQueue, Long> {

    List<InstantConsultationQueue> findByDoctorIdOrderByQueuePosition(Long doctorId);

    List<InstantConsultationQueue> findByDoctorIdAndStatusOrderByQueuePosition(Long doctorId, QueueStatus status);

    Optional<InstantConsultationQueue> findByDoctorIdAndPatientIdAndStatus(Long doctorId, Long patientId, QueueStatus status);

    @Query("SELECT COUNT(q) FROM InstantConsultationQueue q WHERE q.doctor.id = :doctorId AND q.status = :status")
    Long countByDoctorIdAndStatus(@Param("doctorId") Long doctorId, @Param("status") QueueStatus status);

    @Query("SELECT MAX(q.queuePosition) FROM InstantConsultationQueue q WHERE q.doctor.id = :doctorId AND q.status = 'WAITING'")
    Integer findMaxQueuePosition(@Param("doctorId") Long doctorId);

    @Query("SELECT q FROM InstantConsultationQueue q WHERE q.doctor.id = :doctorId AND q.status = 'WAITING' ORDER BY q.queuePosition ASC")
    List<InstantConsultationQueue> findWaitingQueue(@Param("doctorId") Long doctorId);

    void deleteByDoctorIdAndPatientId(Long doctorId, Long patientId);
}

package com.sehat24x7.repository;

import com.sehat24x7.model.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;

@Repository
public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {

    List<DoctorAvailability> findByDoctorId(Long doctorId);

    List<DoctorAvailability> findByDoctorIdAndIsActive(Long doctorId, Boolean isActive);

    List<DoctorAvailability> findByDoctorIdAndConsultationType(Long doctorId, DoctorAvailability.ConsultationType consultationType);

    List<DoctorAvailability> findByDoctorIdAndDayOfWeek(Long doctorId, DayOfWeek dayOfWeek);

    @Query("SELECT da FROM DoctorAvailability da WHERE da.doctor.id = :doctorId AND da.isActive = true ORDER BY da.dayOfWeek, da.startTime")
    List<DoctorAvailability> findActiveAvailabilitiesByDoctorId(@Param("doctorId") Long doctorId);

    @Query("SELECT da FROM DoctorAvailability da WHERE da.doctor.id = :doctorId AND da.consultationType = :type AND da.isActive = true")
    List<DoctorAvailability> findByDoctorIdAndConsultationTypeActive(
            @Param("doctorId") Long doctorId,
            @Param("type") DoctorAvailability.ConsultationType type);

    void deleteByDoctorId(Long doctorId);
}

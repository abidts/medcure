package com.medcurekashmir.service;

import com.medcurekashmir.model.DoctorAvailability;
import java.time.DayOfWeek;
import java.util.List;

public interface DoctorAvailabilityService {
    List<DoctorAvailability> getAllAvailabilities(Long doctorId);
    List<DoctorAvailability> getActiveAvailabilities(Long doctorId);
    List<DoctorAvailability> getAvailabilitiesByType(Long doctorId, DoctorAvailability.ConsultationType type);
    DoctorAvailability createAvailability(DoctorAvailability availability);
    DoctorAvailability updateAvailability(Long id, DoctorAvailability availability);
    void deleteAvailability(Long id);
    void deleteAllAvailabilities(Long doctorId);
    boolean isTimeSlotAvailable(Long doctorId, DayOfWeek dayOfWeek, java.time.LocalTime time, DoctorAvailability.ConsultationType type);
}

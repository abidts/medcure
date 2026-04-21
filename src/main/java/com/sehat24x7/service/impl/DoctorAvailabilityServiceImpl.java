package com.sehat24x7.service.impl;

import com.sehat24x7.model.Doctor;
import com.sehat24x7.model.DoctorAvailability;
import com.sehat24x7.repository.DoctorAvailabilityRepository;
import com.sehat24x7.repository.DoctorRepository;
import com.sehat24x7.service.DoctorAvailabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@Service
public class DoctorAvailabilityServiceImpl implements DoctorAvailabilityService {

    @Autowired
    private DoctorAvailabilityRepository availabilityRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public List<DoctorAvailability> getAllAvailabilities(Long doctorId) {
        return availabilityRepository.findByDoctorId(doctorId);
    }

    @Override
    public List<DoctorAvailability> getActiveAvailabilities(Long doctorId) {
        return availabilityRepository.findActiveAvailabilitiesByDoctorId(doctorId);
    }

    @Override
    public List<DoctorAvailability> getAvailabilitiesByType(Long doctorId, DoctorAvailability.ConsultationType type) {
        return availabilityRepository.findByDoctorIdAndConsultationType(doctorId, type);
    }

    @Override
    public DoctorAvailability createAvailability(DoctorAvailability availability) {
        if (availability.getDoctor() != null && availability.getDoctor().getId() != null) {
            Doctor doctor = doctorRepository.findById(availability.getDoctor().getId())
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            availability.setDoctor(doctor);
        }
        if (availability.getSlotDurationMinutes() == null) {
            availability.setSlotDurationMinutes(15);
        }
        if (availability.getIsActive() == null) {
            availability.setIsActive(true);
        }
        return availabilityRepository.save(availability);
    }

    @Override
    public DoctorAvailability updateAvailability(Long id, DoctorAvailability availability) {
        if (availabilityRepository.existsById(id)) {
            availability.setId(id);
            return availabilityRepository.save(availability);
        }
        throw new RuntimeException("Availability not found with id: " + id);
    }

    @Override
    public void deleteAvailability(Long id) {
        availabilityRepository.deleteById(id);
    }

    @Override
    public void deleteAllAvailabilities(Long doctorId) {
        availabilityRepository.deleteByDoctorId(doctorId);
    }

    @Override
    public boolean isTimeSlotAvailable(Long doctorId, DayOfWeek dayOfWeek, LocalTime time, DoctorAvailability.ConsultationType type) {
        List<DoctorAvailability> availabilities = availabilityRepository.findByDoctorIdAndDayOfWeek(doctorId, dayOfWeek);

        for (DoctorAvailability availability : availabilities) {
            if (availability.getIsActive() &&
                availability.getConsultationType() == type &&
                !availability.getStartTime().isAfter(time) &&
                !availability.getEndTime().isBefore(time)) {
                return true;
            }
        }
        return false;
    }
}

package com.sehat24x7.service;

import com.sehat24x7.model.Doctor;
import com.sehat24x7.model.DoctorStatus;
import com.sehat24x7.repository.DoctorStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service for managing doctor online/offline status
 */
@Service
@Transactional
public class DoctorStatusService {

    @Autowired
    private DoctorStatusRepository doctorStatusRepository;

    /**
     * Get or create doctor status
     */
    public DoctorStatus getOrCreateStatus(Doctor doctor) {
        return doctorStatusRepository.findByDoctor(doctor)
                .orElseGet(() -> {
                    DoctorStatus status = new DoctorStatus();
                    status.setDoctor(doctor);
                    status.setStatus(DoctorStatus.Status.OFFLINE);
                    status.setLastOnlineTime(null);
                    return doctorStatusRepository.save(status);
                });
    }

    /**
     * Set doctor status to ONLINE
     */
    public DoctorStatus setOnline(Doctor doctor) {
        DoctorStatus status = getOrCreateStatus(doctor);
        status.setStatus(DoctorStatus.Status.ONLINE);
        status.setLastOnlineTime(LocalDateTime.now());
        status.setMessage("Available for consultations");
        return doctorStatusRepository.save(status);
    }

    /**
     * Set doctor status to OFFLINE
     */
    public DoctorStatus setOffline(Doctor doctor) {
        DoctorStatus status = getOrCreateStatus(doctor);
        status.setStatus(DoctorStatus.Status.OFFLINE);
        status.setMessage(null);
        return doctorStatusRepository.save(status);
    }

    /**
     * Set doctor status to BUSY (in a call)
     */
    public DoctorStatus setBusy(Doctor doctor) {
        DoctorStatus status = getOrCreateStatus(doctor);
        status.setStatus(DoctorStatus.Status.BUSY);
        status.setMessage("Currently in a consultation");
        return doctorStatusRepository.save(status);
    }

    /**
     * Toggle doctor status between ONLINE and OFFLINE
     */
    public DoctorStatus toggleStatus(Doctor doctor) {
        DoctorStatus status = getOrCreateStatus(doctor);
        if (status.getStatus() == DoctorStatus.Status.ONLINE ||
            status.getStatus() == DoctorStatus.Status.BUSY) {
            return setOffline(doctor);
        } else {
            return setOnline(doctor);
        }
    }

    /**
     * Get doctor's current status
     */
    public Optional<DoctorStatus> getStatus(Doctor doctor) {
        return doctorStatusRepository.findByDoctor(doctor);
    }

    /**
     * Get doctor's current status by ID
     */
    public Optional<DoctorStatus> getStatusByDoctorId(Long doctorId) {
        return doctorStatusRepository.findByDoctorId(doctorId);
    }

    /**
     * Check if doctor is online
     */
    public boolean isOnline(Doctor doctor) {
        return getStatus(doctor)
                .map(status -> status.getStatus() == DoctorStatus.Status.ONLINE)
                .orElse(false);
    }

    /**
     * Get all online doctors
     */
    public List<DoctorStatus> getOnlineDoctors() {
        return doctorStatusRepository.findOnlineDoctorsWithDetails();
    }

    /**
     * Update status message
     */
    public DoctorStatus updateMessage(Doctor doctor, String message) {
        DoctorStatus status = getOrCreateStatus(doctor);
        status.setMessage(message);
        return doctorStatusRepository.save(status);
    }
}

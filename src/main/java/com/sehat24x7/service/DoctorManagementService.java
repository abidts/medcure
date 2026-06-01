package com.sehat24x7.service;

import com.sehat24x7.dto.PagedResponse;
import com.sehat24x7.exception.ResourceNotFoundException;
import com.sehat24x7.model.Doctor;
import com.sehat24x7.model.Specialization;
import com.sehat24x7.repository.DoctorRepository;
import com.sehat24x7.repository.SpecializationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DoctorManagementService extends BaseService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private SpecializationRepository specializationRepository;

    /**
     * Get all doctors with pagination
     */
    public PagedResponse<Doctor> getAllDoctors(int pageNumber, int pageSize) {
        logInfo("Fetching doctors - page: " + pageNumber + ", size: " + pageSize);
        
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("id").descending());
        Page<Doctor> page = doctorRepository.findAll(pageable);
        
        return new PagedResponse<>(
            page.getContent(),
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            page.getTotalPages()
        );
    }

    /**
     * Get doctors by specialization
     */
    public PagedResponse<Doctor> getDoctorsBySpecialization(Long specializationId, int pageNumber, int pageSize) {
        logInfo("Fetching doctors by specialization: " + specializationId);
        
        Specialization specialization = specializationRepository.findById(specializationId)
            .orElseThrow(() -> new ResourceNotFoundException("Specialization", "id", specializationId));
        
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Doctor> page = doctorRepository.findBySpecialization(specialization, pageable);
        
        return new PagedResponse<>(
            page.getContent(),
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            page.getTotalPages()
        );
    }

    /**
     * Get doctor by ID
     */
    public Doctor getDoctorById(Long id) {
        logDebug("Fetching doctor: " + id);
        return doctorRepository.findById(id)
            .orElseThrow(() -> {
                logError("Doctor not found: " + id);
                return new ResourceNotFoundException("Doctor", "id", id);
            });
    }

    /**
     * Search doctors by name
     */
    public List<Doctor> searchDoctors(String name) {
        logInfo("Searching doctors by name: " + name);
        return doctorRepository.findByNameContainingIgnoreCase(name);
    }

    /**
     * Get online doctors
     */
    public PagedResponse<Doctor> getOnlineDoctors(int pageNumber, int pageSize) {
        logInfo("Fetching online doctors");
        
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Doctor> page = doctorRepository.findByOnlineStatusTrue(pageable);
        
        return new PagedResponse<>(
            page.getContent(),
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            page.getTotalPages()
        );
    }

    /**
     * Get top-rated doctors
     */
    public List<Doctor> getTopRatedDoctors(int limit) {
        logInfo("Fetching top-rated doctors - limit: " + limit);
        
        Pageable pageable = PageRequest.of(0, limit, Sort.by("rating").descending());
        return doctorRepository.findAll(pageable)
            .getContent();
    }

    /**
     * Get doctors available for consultation
     */
    public List<Doctor> getAvailableDoctors() {
        logInfo("Fetching available doctors for consultation");
        return doctorRepository.findByOnlineStatusTrue()
            .stream()
            .filter(doctor -> Boolean.TRUE.equals(doctor.getAvailable()))
            .collect(Collectors.toList());
    }
}

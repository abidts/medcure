package com.tabib24x7.service.impl;

import com.tabib24x7.model.Doctor;
import com.tabib24x7.model.DoctorEducation;
import com.tabib24x7.repository.DoctorEducationRepository;
import com.tabib24x7.repository.DoctorRepository;
import com.tabib24x7.service.DoctorEducationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DoctorEducationServiceImpl implements DoctorEducationService {

    @Autowired
    private DoctorEducationRepository educationRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public List<DoctorEducation> getEducationsByDoctorId(Long doctorId) {
        return educationRepository.findByDoctorId(doctorId);
    }

    @Override
    @Transactional
    public DoctorEducation createEducation(DoctorEducation education) {
        Doctor doctor = doctorRepository.findById(education.getDoctor().getId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        education.setDoctor(doctor);
        return educationRepository.save(education);
    }

    @Override
    @Transactional
    public DoctorEducation updateEducation(Long id, DoctorEducation education) {
        if (educationRepository.existsById(id)) {
            education.setId(id);
            return educationRepository.save(education);
        }
        throw new RuntimeException("Education not found with id: " + id);
    }

    @Override
    @Transactional
    public void deleteEducation(Long id) {
        educationRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteEducationsByDoctorId(Long doctorId) {
        educationRepository.deleteByDoctorId(doctorId);
    }
}

package com.sehat24x7.service.impl;

import com.sehat24x7.model.Specialization;
import com.sehat24x7.repository.SpecializationRepository;
import com.sehat24x7.service.SpecializationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SpecializationServiceImpl implements SpecializationService {

    @Autowired
    private SpecializationRepository specializationRepository;

    @Override
    public List<Specialization> getAllSpecializations() {
        return specializationRepository.findAll();
    }

    @Override
    public Optional<Specialization> getSpecializationById(Long id) {
        return specializationRepository.findById(id);
    }

    @Override
    public Optional<Specialization> getSpecializationByName(String name) {
        return specializationRepository.findByName(name);
    }

    @Override
    public Specialization createSpecialization(Specialization specialization) {
        return specializationRepository.save(specialization);
    }

    @Override
    public Specialization updateSpecialization(Long id, Specialization specialization) {
        if (specializationRepository.existsById(id)) {
            specialization.setId(id);
            return specializationRepository.save(specialization);
        }
        throw new RuntimeException("Specialization not found with id: " + id);
    }

    @Override
    public void deleteSpecialization(Long id) {
        specializationRepository.deleteById(id);
    }
}

package com.medcurekashmir.service;

import com.medcurekashmir.model.Specialization;

import java.util.List;
import java.util.Optional;

public interface SpecializationService {
    List<Specialization> getAllSpecializations();
    Optional<Specialization> getSpecializationById(Long id);
    Optional<Specialization> getSpecializationByName(String name);
    Specialization createSpecialization(Specialization specialization);
    Specialization updateSpecialization(Long id, Specialization specialization);
    void deleteSpecialization(Long id);
}

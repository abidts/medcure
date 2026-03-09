package com.tabib24x7.service;

import com.tabib24x7.model.Specialization;

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

package com.tabib24x7.service;

import com.tabib24x7.model.DoctorEducation;

import java.util.List;

public interface DoctorEducationService {
    List<DoctorEducation> getEducationsByDoctorId(Long doctorId);
    DoctorEducation createEducation(DoctorEducation education);
    DoctorEducation updateEducation(Long id, DoctorEducation education);
    void deleteEducation(Long id);
    void deleteEducationsByDoctorId(Long doctorId);
}

package com.tabib24x7.service;

import com.tabib24x7.model.DoctorService;

import java.util.List;

public interface DoctorServicesService {
    List<DoctorService> getServicesByDoctorId(Long doctorId);
    DoctorService createService(DoctorService service);
    DoctorService updateService(Long id, DoctorService service);
    void deleteService(Long id);
    void deleteServicesByDoctorId(Long doctorId);
}

package com.tabib24x7.service.impl;

import com.tabib24x7.model.Doctor;
import com.tabib24x7.model.DoctorService;
import com.tabib24x7.repository.DoctorRepository;
import com.tabib24x7.repository.DoctorServiceRepository;
import com.tabib24x7.service.DoctorServicesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DoctorServicesServiceImpl implements DoctorServicesService {

    @Autowired
    private DoctorServiceRepository serviceRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public List<DoctorService> getServicesByDoctorId(Long doctorId) {
        return serviceRepository.findByDoctorId(doctorId);
    }

    @Override
    @Transactional
    public DoctorService createService(DoctorService service) {
        Doctor doctor = doctorRepository.findById(service.getDoctor().getId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        service.setDoctor(doctor);
        return serviceRepository.save(service);
    }

    @Override
    @Transactional
    public DoctorService updateService(Long id, DoctorService service) {
        if (serviceRepository.existsById(id)) {
            service.setId(id);
            return serviceRepository.save(service);
        }
        throw new RuntimeException("Service not found with id: " + id);
    }

    @Override
    @Transactional
    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteServicesByDoctorId(Long doctorId) {
        serviceRepository.deleteByDoctorId(doctorId);
    }
}

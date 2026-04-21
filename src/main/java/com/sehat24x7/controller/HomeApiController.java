package com.sehat24x7.controller;

import com.sehat24x7.model.Doctor;
import com.sehat24x7.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/home")
@CrossOrigin(origins = "*")
public class HomeApiController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping("/doctors/by-district")
    public List<Doctor> getDoctorsByDistrict(@RequestParam String district) {
        return doctorService.getAvailableDoctors().stream()
                .filter(d -> district.equalsIgnoreCase(d.getDistrict()))
                .toList();
    }

    @GetMapping("/districts")
    public List<String> getAllDistricts() {
        return doctorService.getAvailableDoctors().stream()
                .map(Doctor::getDistrict)
                .filter(d -> d != null && !d.isEmpty())
                .distinct()
                .sorted()
                .toList();
    }
}

package com.medcurekashmir.controller;

import com.medcurekashmir.model.Doctor;
import com.medcurekashmir.service.LocationService;
import com.medcurekashmir.service.LocationService.DoctorWithDistance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/location")
@CrossOrigin(origins = "*")
public class LocationController {

    @Autowired
    private LocationService locationService;

    /**
     * Find doctors near user's location
     * @param lat User latitude
     * @param lon User longitude
     * @param radius Search radius in km (default 10)
     */
    @GetMapping("/doctors/nearby")
    public ResponseEntity<Map<String, Object>> getNearbyDoctors(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "10") double radius) {

        try {
            List<DoctorWithDistance> doctorsWithDistance = locationService.findDoctorsByLocation(lat, lon, radius);

            List<Map<String, Object>> result = doctorsWithDistance.stream().map(d -> {
                Map<String, Object> doctorMap = new HashMap<>();
                doctorMap.put("id", d.getDoctor().getId());
                doctorMap.put("name", d.getDoctor().getName());
                doctorMap.put("email", d.getDoctor().getEmail());
                doctorMap.put("phone", d.getDoctor().getPhone());
                doctorMap.put("qualification", d.getDoctor().getQualification());
                doctorMap.put("experience", d.getDoctor().getExperience());
                doctorMap.put("yearsOfExperience", d.getDoctor().getYearsOfExperience());
                doctorMap.put("specialization", d.getDoctor().getSpecialization());
                doctorMap.put("clinicAddress", d.getDoctor().getClinicAddress());
                doctorMap.put("consultationFee", d.getDoctor().getConsultationFee());
                doctorMap.put("available", d.getDoctor().getAvailable());
                doctorMap.put("image", d.getDoctor().getImage());
                doctorMap.put("city", d.getDoctor().getCity());
                doctorMap.put("area", d.getDoctor().getArea());
                doctorMap.put("latitude", d.getDoctor().getLatitude());
                doctorMap.put("longitude", d.getDoctor().getLongitude());
                doctorMap.put("distance", d.getDistanceRounded());
                doctorMap.put("distanceUnit", "km");
                return doctorMap;
            }).collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", result.size());
            response.put("searchRadius", radius);
            response.put("userLocation", Map.of("latitude", lat, "longitude", lon));
            response.put("doctors", result);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Get doctors by city
     */
    @GetMapping("/doctors/city/{city}")
    public ResponseEntity<Map<String, Object>> getDoctorsByCity(@PathVariable String city) {
        try {
            List<Doctor> doctors = locationService.findDoctorsByCity(city);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", doctors.size());
            response.put("city", city);
            response.put("doctors", doctors);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Get all available cities
     */
    @GetMapping("/cities")
    public ResponseEntity<Map<String, Object>> getAllCities() {
        try {
            List<String> cities = locationService.findDoctorsByCity("")
                    .stream()
                    .map(Doctor::getCity)
                    .filter(city -> city != null && !city.isEmpty())
                    .distinct()
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", cities.size());
            response.put("cities", cities);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Get all available districts
     */
    @GetMapping("/districts")
    public ResponseEntity<Map<String, Object>> getAllDistricts() {
        try {
            List<String> districts = locationService.getAllDistricts();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", districts.size());
            response.put("districts", districts);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Calculate distance between user and doctor
     */
    @GetMapping("/distance")
    public ResponseEntity<Map<String, Object>> calculateDistance(
            @RequestParam double fromLat,
            @RequestParam double fromLon,
            @RequestParam double toLat,
            @RequestParam double toLon) {

        try {
            double distance = locationService.calculateDistance(fromLat, fromLon, toLat, toLon);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("distance", Math.round(distance * 10.0) / 10.0);
            response.put("distanceUnit", "km");
            response.put("from", Map.of("latitude", fromLat, "longitude", fromLon));
            response.put("to", Map.of("latitude", toLat, "longitude", toLon));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}

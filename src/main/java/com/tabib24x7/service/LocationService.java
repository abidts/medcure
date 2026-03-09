package com.tabib24x7.service;

import com.tabib24x7.model.Doctor;
import com.tabib24x7.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocationService {

    @Autowired
    private DoctorRepository doctorRepository;

    // Earth's radius in kilometers
    private static final double EARTH_RADIUS_KM = 6371.0;

    /**
     * Calculate distance between two coordinates using Haversine formula
     */
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }

    /**
     * Find doctors within a specified radius from user's location
     */
    public List<DoctorWithDistance> findDoctorsByLocation(double userLatitude, double userLongitude, double radiusKm) {
        List<Doctor> allDoctors = doctorRepository.findAll();

        return allDoctors.stream()
                .filter(doctor -> doctor.getLatitude() != null && doctor.getLongitude() != null)
                .map(doctor -> {
                    double distance = calculateDistance(
                            userLatitude, userLongitude,
                            doctor.getLatitude(), doctor.getLongitude()
                    );
                    return new DoctorWithDistance(doctor, distance);
                })
                .filter(d -> d.getDistance() <= radiusKm)
                .sorted((d1, d2) -> Double.compare(d1.getDistance(), d2.getDistance()))
                .collect(Collectors.toList());
    }

    /**
     * Find nearest doctors (default 10km radius)
     */
    public List<DoctorWithDistance> findNearestDoctors(double userLatitude, double userLongitude) {
        return findDoctorsByLocation(userLatitude, userLongitude, 10.0);
    }

    /**
     * Get doctors by city
     */
    public List<Doctor> findDoctorsByCity(String city) {
        return doctorRepository.findAll().stream()
                .filter(doctor -> city.equalsIgnoreCase(doctor.getCity()))
                .collect(Collectors.toList());
    }

    /**
     * Get doctors by area
     */
    public List<Doctor> findDoctorsByArea(String area) {
        return doctorRepository.findAll().stream()
                .filter(doctor -> area != null && area.equalsIgnoreCase(doctor.getArea()))
                .collect(Collectors.toList());
    }

    /**
     * Get all available districts from doctor records
     */
    public List<String> getAllDistricts() {
        return doctorRepository.findAll().stream()
                .map(Doctor::getDistrict)
                .filter(district -> district != null && !district.isEmpty())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    /**
     * DTO class to hold doctor with distance information
     */
    public static class DoctorWithDistance {
        private Doctor doctor;
        private double distance;

        public DoctorWithDistance(Doctor doctor, double distance) {
            this.doctor = doctor;
            this.distance = distance;
        }

        public Doctor getDoctor() {
            return doctor;
        }

        public double getDistance() {
            return distance;
        }

        public double getDistanceRounded() {
            return Math.round(distance * 10.0) / 10.0;
        }
    }
}

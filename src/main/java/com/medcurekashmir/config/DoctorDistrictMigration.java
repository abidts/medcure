package com.medcurekashmir.config;

import com.medcurekashmir.model.Doctor;
import com.medcurekashmir.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Migration runner to update existing doctor records with district and state values.
 * This runs at application startup and updates any doctors with missing district/state.
 */
@Component
@Order(1)
public class DoctorDistrictMigration implements CommandLineRunner {

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public void run(String... args) {
        System.out.println("Running Doctor District/State Migration...");
        
        List<Doctor> doctors = doctorRepository.findAll();
        int updatedCount = 0;
        
        for (Doctor doctor : doctors) {
            if (doctor.getDistrict() == null || doctor.getState() == null) {
                String[] location = inferDistrictState(doctor);
                doctor.setDistrict(location[0]);
                doctor.setState(location[1]);
                doctorRepository.save(doctor);
                updatedCount++;
                System.out.println("Updated doctor: " + doctor.getName() + 
                        " -> District: " + location[0] + ", State: " + location[1]);
            }
        }
        
        System.out.println("Doctor District/State Migration completed. Updated " + updatedCount + " doctors.");
    }

    /**
     * Infers district and state from doctor's clinic address, city, and area fields.
     * @param doctor The doctor record to update
     * @return Array with [district, state]
     */
    private String[] inferDistrictState(Doctor doctor) {
        String address = (doctor.getClinicAddress() != null ? doctor.getClinicAddress().toLowerCase() : "");
        String city = (doctor.getCity() != null ? doctor.getCity().toLowerCase() : "");
        String area = (doctor.getArea() != null ? doctor.getArea().toLowerCase() : "");
        
        String combined = address + " " + city + " " + area;
        
        // Check for various Kashmir districts
        if (combined.contains("anantnag")) {
            return new String[]{"Anantnag", "Jammu and Kashmir"};
        }
        if (combined.contains("baramulla")) {
            return new String[]{"Baramulla", "Jammu and Kashmir"};
        }
        if (combined.contains("kupwara")) {
            return new String[]{"Kupwara", "Jammu and Kashmir"};
        }
        if (combined.contains("handwara")) {
            return new String[]{"Kupwara", "Jammu and Kashmir"};
        }
        if (combined.contains("sopore")) {
            return new String[]{"Baramulla", "Jammu and Kashmir"};
        }
        if (combined.contains("budgam")) {
            return new String[]{"Budgam", "Jammu and Kashmir"};
        }
        if (combined.contains("pulwama")) {
            return new String[]{"Pulwama", "Jammu and Kashmir"};
        }
        if (combined.contains("shopian")) {
            return new String[]{"Shopian", "Jammu and Kashmir"};
        }
        if (combined.contains("kulgam")) {
            return new String[]{"Kulgam", "Jammu and Kashmir"};
        }
        if (combined.contains("bandipora")) {
            return new String[]{"Bandipora", "Jammu and Kashmir"};
        }
        if (combined.contains("ganderbal")) {
            return new String[]{"Ganderbal", "Jammu and Kashmir"};
        }
        if (combined.contains("kargil")) {
            return new String[]{"Kargil", "Ladakh"};
        }
        if (combined.contains("leh")) {
            return new String[]{"Leh", "Ladakh"};
        }
        
        // Default to Srinagar
        return new String[]{"Srinagar", "Jammu and Kashmir"};
    }
}

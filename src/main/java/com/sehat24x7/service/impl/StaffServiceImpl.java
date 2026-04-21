package com.sehat24x7.service.impl;

import com.sehat24x7.model.Doctor;
import com.sehat24x7.model.Staff;
import com.sehat24x7.repository.DoctorRepository;
import com.sehat24x7.repository.StaffRepository;
import com.sehat24x7.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class StaffServiceImpl implements StaffService {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public List<Staff> getStaffByDoctorId(Long doctorId) {
        return staffRepository.findByDoctorId(doctorId);
    }

    @Override
    public Optional<Staff> getStaffById(Long id) {
        return staffRepository.findById(id);
    }

    @Override
    public Optional<Staff> getStaffByUsername(String username) {
        return staffRepository.findByUsername(username);
    }

    @Override
    @Transactional
    public Staff createStaff(Staff staff) {
        // Handle both string and Long ID
        Long doctorId = null;
        if (staff.getDoctor() != null) {
            Object idObj = staff.getDoctor().getId();
            if (idObj instanceof String) {
                doctorId = Long.parseLong((String) idObj);
            } else if (idObj instanceof Long) {
                doctorId = (Long) idObj;
            } else if (idObj instanceof Integer) {
                doctorId = ((Integer) idObj).longValue();
            }
        }
        
        if (doctorId == null) {
            throw new RuntimeException("Doctor ID is required");
        }
        
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        staff.setDoctor(doctor);
        String password = staff.getPassword();
        // Only add HASH_ prefix if not already present
        if (!password.startsWith("HASH_")) {
            staff.setPassword("HASH_" + password);
        }
        return staffRepository.save(staff);
    }

    @Override
    @Transactional
    public Staff updateStaff(Long id, Staff staff) {
        if (staffRepository.existsById(id)) {
            Staff existingStaff = staffRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Staff not found"));
            
            existingStaff.setName(staff.getName());
            existingStaff.setPhone(staff.getPhone());
            existingStaff.setEmail(staff.getEmail());
            existingStaff.setCanPrintReceipts(staff.getCanPrintReceipts());
            existingStaff.setCanPrintPrescriptions(staff.getCanPrintPrescriptions());
            existingStaff.setCanCreateLetterheads(staff.getCanCreateLetterheads());
            existingStaff.setIsActive(staff.getIsActive());
            
            if (staff.getPassword() != null && !staff.getPassword().isEmpty() && !staff.getPassword().startsWith("HASH_")) {
                existingStaff.setPassword("HASH_" + staff.getPassword());
            }
            
            return staffRepository.save(existingStaff);
        }
        throw new RuntimeException("Staff not found with id: " + id);
    }

    @Override
    @Transactional
    public void deleteStaff(Long id) {
        staffRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteStaffByDoctorId(Long doctorId) {
        staffRepository.deleteByDoctorId(doctorId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Staff> authenticate(String username, String password) {
        Optional<Staff> staffOpt = staffRepository.findByUsername(username);
        if (staffOpt.isPresent()) {
            Staff staff = staffOpt.get();
            if (!staff.getIsActive()) {
                return Optional.empty();
            }
            String storedPassword = staff.getPassword();
            String expectedPassword = "HASH_" + password;
            
            // Support both hashed and plain password formats for backward compatibility
            if (expectedPassword.equals(storedPassword) || password.equals(storedPassword)) {
                return Optional.of(staff);
            }
        }
        return Optional.empty();
    }

    @Override
    public boolean existsByUsername(String username) {
        return staffRepository.existsByUsername(username);
    }
}

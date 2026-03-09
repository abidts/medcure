package com.tabib24x7.service;

import com.tabib24x7.model.Staff;

import java.util.List;
import java.util.Optional;

public interface StaffService {
    List<Staff> getStaffByDoctorId(Long doctorId);
    Optional<Staff> getStaffById(Long id);
    Optional<Staff> getStaffByUsername(String username);
    Staff createStaff(Staff staff);
    Staff updateStaff(Long id, Staff staff);
    void deleteStaff(Long id);
    void deleteStaffByDoctorId(Long doctorId);
    Optional<Staff> authenticate(String username, String password);
    boolean existsByUsername(String username);
}

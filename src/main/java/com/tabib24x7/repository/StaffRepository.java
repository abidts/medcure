package com.tabib24x7.repository;

import com.tabib24x7.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    List<Staff> findByDoctorId(Long doctorId);
    Optional<Staff> findByUsername(String username);
    Optional<Staff> findByUsernameAndPassword(String username, String password);
    boolean existsByUsername(String username);
    void deleteByDoctorId(Long doctorId);
}

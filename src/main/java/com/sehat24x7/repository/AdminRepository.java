package com.sehat24x7.repository;

import com.sehat24x7.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    Optional<Admin> findByUserId(Long userId);

    List<Admin> findByIsSuperAdmin(Boolean isSuperAdmin);

    @Query("SELECT a FROM Admin a WHERE a.user.isActive = true")
    List<Admin> findActiveAdmins();

    @Query("SELECT a FROM Admin a WHERE a.isSuperAdmin = true AND a.user.isActive = true")
    List<Admin> findActiveSuperAdmins();
}

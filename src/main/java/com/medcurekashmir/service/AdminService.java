package com.medcurekashmir.service;

import com.medcurekashmir.model.Admin;
import java.util.List;
import java.util.Optional;

public interface AdminService {
    Admin createAdmin(Admin admin, boolean isSuperAdmin);
    Admin updateAdmin(Long id, Admin admin);
    Optional<Admin> getAdminById(Long id);
    Optional<Admin> getAdminByUserId(Long userId);
    List<Admin> getAllAdmins();
    List<Admin> getSuperAdmins();
    List<Admin> getActiveAdmins();
    void deleteAdmin(Long id);
    void deactivateAdmin(Long id);
    boolean isSuperAdmin(Long adminId);
}

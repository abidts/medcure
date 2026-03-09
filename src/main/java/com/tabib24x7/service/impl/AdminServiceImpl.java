package com.tabib24x7.service.impl;

import com.tabib24x7.model.Admin;
import com.tabib24x7.model.User;
import com.tabib24x7.repository.AdminRepository;
import com.tabib24x7.repository.UserRepository;
import com.tabib24x7.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Admin createAdmin(Admin admin, boolean isSuperAdmin) {
        if (admin.getUser() != null && admin.getUser().getId() != null) {
            User user = userRepository.findById(admin.getUser().getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getRole() != User.UserRole.ADMIN && user.getRole() != User.UserRole.SUPER_ADMIN) {
                throw new RuntimeException("User must have ADMIN or SUPER_ADMIN role");
            }
            admin.setUser(user);
        }
        admin.setIsSuperAdmin(isSuperAdmin);
        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedAt(LocalDateTime.now());
        return adminRepository.save(admin);
    }

    @Override
    public Admin updateAdmin(Long id, Admin admin) {
        if (adminRepository.existsById(id)) {
            admin.setId(id);
            admin.setUpdatedAt(LocalDateTime.now());
            return adminRepository.save(admin);
        }
        throw new RuntimeException("Admin not found with id: " + id);
    }

    @Override
    public Optional<Admin> getAdminById(Long id) {
        return adminRepository.findById(id);
    }

    @Override
    public Optional<Admin> getAdminByUserId(Long userId) {
        return adminRepository.findByUserId(userId);
    }

    @Override
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @Override
    public List<Admin> getSuperAdmins() {
        return adminRepository.findByIsSuperAdmin(true);
    }

    @Override
    public List<Admin> getActiveAdmins() {
        return adminRepository.findActiveAdmins();
    }

    @Override
    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }

    @Override
    public void deactivateAdmin(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        User user = admin.getUser();
        user.setIsActive(false);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Override
    public boolean isSuperAdmin(Long adminId) {
        return adminRepository.findById(adminId)
                .map(Admin::getIsSuperAdmin)
                .orElse(false);
    }
}

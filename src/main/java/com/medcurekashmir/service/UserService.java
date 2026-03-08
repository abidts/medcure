package com.medcurekashmir.service;

import com.medcurekashmir.model.User;
import java.util.Optional;

public interface UserService {
    User registerUser(User user, String password);
    User authenticateUser(String email, String password);
    Optional<User> getUserById(Long id);
    Optional<User> getUserByEmail(String email);
    User updateUser(Long id, User user);
    void deleteUser(Long id);
    void changePassword(Long userId, String oldPassword, String newPassword);
    void updateLastLogin(Long userId);
}

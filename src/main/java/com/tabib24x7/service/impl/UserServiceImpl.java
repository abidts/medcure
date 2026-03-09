package com.tabib24x7.service.impl;

import com.tabib24x7.model.User;
import com.tabib24x7.repository.UserRepository;
import com.tabib24x7.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User registerUser(User user, String password) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        user.setPassword(hashPassword(password));
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Override
    public User authenticateUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getIsActive() && verifyPassword(password, user.getPassword())) {
                user.setLastLogin(LocalDateTime.now());
                return userRepository.save(user);
            }
        }
        throw new RuntimeException("Invalid credentials");
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User updateUser(Long id, User user) {
        if (userRepository.existsById(id)) {
            user.setId(id);
            user.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(user);
        }
        throw new RuntimeException("User not found with id: " + id);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!verifyPassword(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(hashPassword(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Override
    public void updateLastLogin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
    }

    private String hashPassword(String password) {
        // In production, use BCrypt or similar
        return "HASH_" + password;
    }

    private boolean verifyPassword(String rawPassword, String hashedPassword) {
        // In production, use BCrypt or similar
        return hashedPassword.equals("HASH_" + rawPassword);
    }
}

package com.sehat24x7.controller;

import com.sehat24x7.model.AboutUs;
import com.sehat24x7.service.AboutUsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/about-us")
@CrossOrigin(origins = "*")
public class AboutUsController {

    @Autowired
    private AboutUsService aboutUsService;

    // Get active About Us
    @GetMapping
    public ResponseEntity<?> getActiveAboutUs() {
        return aboutUsService.getActiveAboutUs()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Save/Update About Us
    @PostMapping
    public ResponseEntity<?> saveAboutUs(@RequestBody AboutUs aboutUs) {
        try {
            AboutUs saved = aboutUsService.saveAboutUs(aboutUs);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "About Us updated successfully");
            response.put("data", saved);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}

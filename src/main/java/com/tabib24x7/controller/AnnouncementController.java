package com.tabib24x7.controller;

import com.tabib24x7.model.Announcement;
import com.tabib24x7.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "*")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    // Get all active announcements for public display
    @GetMapping("/active")
    public ResponseEntity<List<Announcement>> getActiveAnnouncements() {
        List<Announcement> announcements = announcementService.getActiveAnnouncements();
        return ResponseEntity.ok(announcements);
    }

    // Get all announcements (admin only)
    @GetMapping("/all")
    public ResponseEntity<List<Announcement>> getAllAnnouncements() {
        List<Announcement> announcements = announcementService.getAllAnnouncements();
        return ResponseEntity.ok(announcements);
    }

    // Get single announcement by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAnnouncementById(@PathVariable Long id) {
        return announcementService.getAnnouncementById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new announcement
    @PostMapping
    public ResponseEntity<?> createAnnouncement(@RequestBody Announcement announcement) {
        try {
            Announcement created = announcementService.createAnnouncement(announcement);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Announcement created successfully");
            response.put("announcement", created);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Update announcement
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAnnouncement(@PathVariable Long id, 
                                                 @RequestBody Announcement announcement) {
        try {
            Announcement updated = announcementService.updateAnnouncement(id, announcement);
            if (updated != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Announcement updated successfully");
                response.put("announcement", updated);
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Announcement not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Delete announcement
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable Long id) {
        try {
            announcementService.deleteAnnouncement(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Announcement deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Activate announcement
    @PostMapping("/{id}/activate")
    public ResponseEntity<?> activateAnnouncement(@PathVariable Long id) {
        try {
            announcementService.activateAnnouncement(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Announcement activated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Deactivate announcement
    @PostMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateAnnouncement(@PathVariable Long id) {
        try {
            announcementService.deactivateAnnouncement(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Announcement deactivated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get announcements by type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Announcement>> getAnnouncementsByType(@PathVariable String type) {
        List<Announcement> announcements = announcementService.getAnnouncementsByType(type);
        return ResponseEntity.ok(announcements);
    }

    // Bulk update - reorder announcements
    @PostMapping("/reorder")
    public ResponseEntity<?> reorderAnnouncements(@RequestBody List<Long> announcementIds) {
        try {
            for (int i = 0; i < announcementIds.size(); i++) {
                final int order = i;
                Long id = announcementIds.get(i);
                announcementService.getAnnouncementById(id).ifPresent(announcement -> {
                    announcement.setDisplayOrder(order);
                    announcementService.updateAnnouncement(id, announcement);
                });
            }
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Announcements reordered successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}

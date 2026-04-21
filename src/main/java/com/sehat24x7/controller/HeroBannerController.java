package com.sehat24x7.controller;

import com.sehat24x7.model.HeroBanner;
import com.sehat24x7.service.HeroBannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hero-banners")
@CrossOrigin(origins = "*")
public class HeroBannerController {

    @Autowired
    private HeroBannerService heroBannerService;

    @GetMapping("/active")
    public ResponseEntity<List<HeroBanner>> getActiveBanners() {
        return ResponseEntity.ok(heroBannerService.getActiveBanners());
    }

    @GetMapping("/all")
    public ResponseEntity<List<HeroBanner>> getAllBanners() {
        return ResponseEntity.ok(heroBannerService.getAllBanners());
    }

    @PostMapping
    public ResponseEntity<?> createBanner(@RequestBody HeroBanner banner) {
        try {
            HeroBanner created = heroBannerService.createBanner(banner);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("banner", created);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBanner(@PathVariable Long id, @RequestBody HeroBanner banner) {
        try {
            HeroBanner updated = heroBannerService.updateBanner(id, banner);
            if (updated == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(Map.of("success", true, "banner", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBanner(@PathVariable Long id) {
        try {
            heroBannerService.deleteBanner(id);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<?> activateBanner(@PathVariable Long id) {
        heroBannerService.activateBanner(id);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PostMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateBanner(@PathVariable Long id) {
        heroBannerService.deactivateBanner(id);
        return ResponseEntity.ok(Map.of("success", true));
    }
}

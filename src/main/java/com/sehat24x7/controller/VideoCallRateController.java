package com.sehat24x7.controller;

import com.sehat24x7.model.Doctor;
import com.sehat24x7.model.VideoCallRate;
import com.sehat24x7.repository.DoctorRepository;
import com.sehat24x7.service.VideoCallRateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/video-call-rate")
@CrossOrigin(origins = "*")
public class VideoCallRateController {

    @Autowired
    private VideoCallRateService videoCallRateService;

    @Autowired
    private DoctorRepository doctorRepository;

    /**
     * Get video call rate for a doctor
     */
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getDoctorRate(@PathVariable Long doctorId) {
        try {
            VideoCallRate rate = videoCallRateService.getOrCreateRate(
                    doctorRepository.findById(doctorId)
                            .orElseThrow(() -> new RuntimeException("Doctor not found"))
            );

            Map<String, Object> response = new HashMap<>();
            response.put("doctorId", doctorId);
            response.put("ratePerMinute", rate.getRatePerMinute());
            response.put("minimumDuration", rate.getMinimumDuration());
            response.put("minimumCharge", rate.getRatePerMinute() * rate.getMinimumDuration());
            response.put("updatedAt", rate.getUpdatedAt());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Update video call rate (for doctors)
     */
    @PutMapping("/doctor/{doctorId}")
    public ResponseEntity<?> updateRate(
            @PathVariable Long doctorId,
            @RequestBody Map<String, Object> rateData) {

        try {
            Doctor doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));

            Double ratePerMinute = Double.parseDouble(rateData.get("ratePerMinute").toString());
            Integer minimumDuration = rateData.containsKey("minimumDuration") ?
                    Integer.parseInt(rateData.get("minimumDuration").toString()) : null;

            if (ratePerMinute < 1) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Rate per minute must be at least Rs.1"
                ));
            }

            VideoCallRate updated = videoCallRateService.updateRate(doctor, ratePerMinute, minimumDuration);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Rate updated successfully");
            response.put("ratePerMinute", updated.getRatePerMinute());
            response.put("minimumDuration", updated.getMinimumDuration());
            response.put("minimumCharge", updated.getRatePerMinute() * updated.getMinimumDuration());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Calculate call cost
     */
    @GetMapping("/calculate")
    public ResponseEntity<?> calculateCost(
            @RequestParam Long doctorId,
            @RequestParam Integer durationMinutes) {

        try {
            VideoCallRate rate = videoCallRateService.getOrCreateRate(
                    doctorRepository.findById(doctorId)
                            .orElseThrow(() -> new RuntimeException("Doctor not found"))
            );

            Double cost = rate.getRatePerMinute() * durationMinutes;

            Map<String, Object> response = new HashMap<>();
            response.put("doctorId", doctorId);
            response.put("durationMinutes", durationMinutes);
            response.put("ratePerMinute", rate.getRatePerMinute());
            response.put("totalCost", cost);
            response.put("minimumCharge", rate.getRatePerMinute() * rate.getMinimumDuration());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

package com.sehat24x7.controller;

import com.sehat24x7.dto.ConsultationBookingRequest;
import com.sehat24x7.dto.ConsultationBookingResponse;
import com.sehat24x7.dto.ConsultationVerificationRequest;
import com.sehat24x7.service.ConsultationBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/consultations")
@CrossOrigin(origins = "*")
public class ConsultationBookingController {

    @Autowired
    private ConsultationBookingService consultationBookingService;

    /**
     * Create a new consultation booking
     * POST /api/consultations/book
     */
    @PostMapping("/book")
    public ResponseEntity<?> createConsultationBooking(@RequestBody ConsultationBookingRequest request) {
        try {
            ConsultationBookingResponse response = consultationBookingService.createConsultationBooking(request);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Consultation booking created. Verification code sent to mobile number.");
            result.put("data", response);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Verify consultation booking with OTP
     * POST /api/consultations/verify
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyConsultationBooking(@RequestBody ConsultationVerificationRequest request) {
        try {
            ConsultationBookingResponse response = consultationBookingService.verifyConsultationBooking(
                    request.getConsultationBookingId(),
                    request.getVerificationCode()
            );
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Mobile number verified successfully.");
            result.put("data", response);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Get consultation booking details
     * GET /api/consultations/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getConsultationBooking(@PathVariable Long id) {
        try {
            ConsultationBookingResponse response = consultationBookingService.getConsultationBooking(id);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", response);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Get consultation bookings by status
     * GET /api/consultations/status/{status}
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getBookingsByStatus(@PathVariable String status) {
        try {
            List<ConsultationBookingResponse> responses = consultationBookingService.getBookingsByStatus(status);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", responses);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Confirm consultation booking
     * POST /api/consultations/{id}/confirm
     */
    @PostMapping("/{id}/confirm")
    public ResponseEntity<?> confirmConsultationBooking(@PathVariable Long id) {
        try {
            ConsultationBookingResponse response = consultationBookingService.confirmConsultationBooking(id);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Consultation booking confirmed successfully.");
            result.put("data", response);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Cancel consultation booking
     * DELETE /api/consultations/{id}/cancel
     */
    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<?> cancelConsultationBooking(@PathVariable Long id) {
        try {
            consultationBookingService.cancelConsultationBooking(id);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Consultation booking cancelled successfully.");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Resend verification code
     * POST /api/consultations/{id}/resend-code
     */
    @PostMapping("/{id}/resend-code")
    public ResponseEntity<?> resendVerificationCode(@PathVariable Long id) {
        try {
            consultationBookingService.resendVerificationCode(id);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Verification code resent to mobile number.");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}

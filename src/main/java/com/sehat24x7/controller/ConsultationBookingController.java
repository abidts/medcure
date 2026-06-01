package com.sehat24x7.controller;

import com.sehat24x7.dto.ApiResponse;
import com.sehat24x7.dto.ConsultationBookingRequest;
import com.sehat24x7.dto.ConsultationBookingResponse;
import com.sehat24x7.dto.ConsultationVerificationRequest;
import com.sehat24x7.service.ConsultationBookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ConsultationBookingController extends BaseController {

    @Autowired
    private ConsultationBookingService consultationBookingService;

    /**
     * Create a new consultation booking
     * POST /api/consultations/book
     */
    @PostMapping("/book")
    public ResponseEntity<ApiResponse<ConsultationBookingResponse>> createConsultationBooking(
            @Valid @RequestBody ConsultationBookingRequest request) {
        ConsultationBookingResponse response = consultationBookingService.createConsultationBooking(request);
        return created(response);
    }

    /**
     * Verify consultation booking with OTP
     * POST /api/consultations/verify
     */
    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<ConsultationBookingResponse>> verifyConsultationBooking(
            @Valid @RequestBody ConsultationVerificationRequest request) {
        ConsultationBookingResponse response = consultationBookingService.verifyConsultationBooking(
                request.getConsultationBookingId(),
                request.getVerificationCode()
        );
        return ok("Mobile number verified successfully", response);
    }

    /**
     * Get consultation booking details
     * GET /api/consultations/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ConsultationBookingResponse>> getConsultationBooking(@PathVariable Long id) {
        ConsultationBookingResponse response = consultationBookingService.getConsultationBooking(id);
        return ok(response);
    }

    /**
     * Get consultation bookings by status
     * GET /api/consultations/status/{status}
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<ConsultationBookingResponse>>> getBookingsByStatus(@PathVariable String status) {
        List<ConsultationBookingResponse> responses = consultationBookingService.getBookingsByStatus(status);
        return ok(responses);
    }

    /**
     * Confirm consultation booking
     * POST /api/consultations/{id}/confirm
     */
    @PostMapping("/{id}/confirm")
    public ResponseEntity<ApiResponse<ConsultationBookingResponse>> confirmConsultationBooking(@PathVariable Long id) {
        ConsultationBookingResponse response = consultationBookingService.confirmConsultationBooking(id);
        return ok("Booking confirmed successfully", response);
    }

    /**
     * Cancel consultation booking
     * DELETE /api/consultations/{id}/cancel
     */
    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelConsultationBooking(@PathVariable Long id) {
        consultationBookingService.cancelConsultationBooking(id);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", null));
    }

    /**
     * Resend verification code
     * POST /api/consultations/{id}/resend-code
     */
    @PostMapping("/{id}/resend-code")
    public ResponseEntity<ApiResponse<Void>> resendVerificationCode(@PathVariable Long id) {
        consultationBookingService.resendVerificationCode(id);
        return ok("Verification code resent successfully", null);
    }
}

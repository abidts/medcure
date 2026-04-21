package com.sehat24x7.service;

import com.sehat24x7.dto.ConsultationBookingRequest;
import com.sehat24x7.dto.ConsultationBookingResponse;
import com.sehat24x7.model.ConsultationBooking;
import com.sehat24x7.model.Specialization;
import com.sehat24x7.repository.ConsultationBookingRepository;
import com.sehat24x7.repository.SpecializationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class ConsultationBookingService {

    @Autowired
    private ConsultationBookingRepository consultationBookingRepository;

    @Autowired
    private SpecializationRepository specializationRepository;

    /**
     * Create a new consultation booking
     */
    @Transactional
    public ConsultationBookingResponse createConsultationBooking(ConsultationBookingRequest request) {
        // Validate specialization exists
        Specialization specialization = specializationRepository.findById(request.getSpecializationId())
                .orElseThrow(() -> new RuntimeException("Specialization not found"));

        // Create consultation booking
        ConsultationBooking booking = new ConsultationBooking();
        booking.setSpecialization(specialization);
        booking.setPatientName(request.getPatientName());
        booking.setMobileNumber(request.getMobileNumber());
        booking.setEmail(request.getEmail());
        booking.setSymptoms(request.getSymptoms());
        booking.setAdditionalNotes(request.getAdditionalNotes());
        booking.setStatus(ConsultationBooking.BookingStatus.PENDING);
        booking.setVerificationCode(generateVerificationCode());
        booking.setConsultationFee(getConsultationFee(specialization));

        ConsultationBooking saved = consultationBookingRepository.save(booking);

        // In a real application, you would send SMS/Email here
        // sendVerificationCode(saved.getMobileNumber(), saved.getVerificationCode());

        return mapToResponse(saved);
    }

    /**
     * Verify consultation booking with OTP
     */
    @Transactional
    public ConsultationBookingResponse verifyConsultationBooking(Long bookingId, String verificationCode) {
        ConsultationBooking booking = consultationBookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Consultation booking not found"));

        if (!booking.getVerificationCode().equals(verificationCode)) {
            throw new RuntimeException("Invalid verification code");
        }

        booking.setVerificationCodeVerified(true);
        booking.setVerifiedAt(LocalDateTime.now());
        booking.setStatus(ConsultationBooking.BookingStatus.VERIFIED);

        ConsultationBooking updated = consultationBookingRepository.save(booking);
        return mapToResponse(updated);
    }

    /**
     * Get consultation booking details
     */
    public ConsultationBookingResponse getConsultationBooking(Long bookingId) {
        ConsultationBooking booking = consultationBookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Consultation booking not found"));
        return mapToResponse(booking);
    }

    /**
     * Get all consultation bookings by status
     */
    public List<ConsultationBookingResponse> getBookingsByStatus(String status) {
        try {
            ConsultationBooking.BookingStatus bookingStatus = ConsultationBooking.BookingStatus.valueOf(status.toUpperCase());
            return consultationBookingRepository.findByStatus(bookingStatus)
                    .stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
    }

    /**
     * Confirm consultation booking (after payment, if needed)
     */
    @Transactional
    public ConsultationBookingResponse confirmConsultationBooking(Long bookingId) {
        ConsultationBooking booking = consultationBookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Consultation booking not found"));

        if (!booking.getVerificationCodeVerified()) {
            throw new RuntimeException("Consultation booking is not verified");
        }

        booking.setStatus(ConsultationBooking.BookingStatus.CONFIRMED);
        booking.setBookedAt(LocalDateTime.now());

        ConsultationBooking updated = consultationBookingRepository.save(booking);
        return mapToResponse(updated);
    }

    /**
     * Cancel consultation booking
     */
    @Transactional
    public void cancelConsultationBooking(Long bookingId) {
        ConsultationBooking booking = consultationBookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Consultation booking not found"));

        booking.setStatus(ConsultationBooking.BookingStatus.CANCELLED);
        consultationBookingRepository.save(booking);
    }

    /**
     * Resend verification code
     */
    @Transactional
    public void resendVerificationCode(Long bookingId) {
        ConsultationBooking booking = consultationBookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Consultation booking not found"));

        String newCode = generateVerificationCode();
        booking.setVerificationCode(newCode);
        consultationBookingRepository.save(booking);

        // In a real application, you would send SMS/Email here
        // sendVerificationCode(booking.getMobileNumber(), newCode);
    }

    /**
     * Helper method to map entity to response
     */
    private ConsultationBookingResponse mapToResponse(ConsultationBooking booking) {
        ConsultationBookingResponse response = new ConsultationBookingResponse();
        response.setId(booking.getId());
        response.setPatientName(booking.getPatientName());
        response.setMobileNumber(booking.getMobileNumber());
        response.setEmail(booking.getEmail());
        response.setSpecialization(booking.getSpecialization().getName());
        response.setConsultationFee(booking.getConsultationFee());
        response.setStatus(booking.getStatus().toString());
        response.setVerificationCodeVerified(booking.getVerificationCodeVerified());
        response.setCreatedAt(booking.getCreatedAt());
        response.setBookedAt(booking.getBookedAt());
        response.setSymptoms(booking.getSymptoms());
        response.setAdditionalNotes(booking.getAdditionalNotes());
        if (booking.getAssignedDoctor() != null) {
            response.setAssignedDoctorName(booking.getAssignedDoctor().getName());
        }
        return response;
    }

    /**
     * Generate a 6-digit verification code
     */
    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    /**
     * Get consultation fee for a specialization
     * You can customize this logic based on your requirements
     */
    private Double getConsultationFee(Specialization specialization) {
        // Default fees for specializations
        switch (specialization.getName().toLowerCase()) {
            case "gynaecology":
                return 499.0;
            case "cardiology":
                return 599.0;
            case "dermatology":
                return 399.0;
            case "general":
                return 299.0;
            default:
                return 499.0;
        }
    }
}

package com.sehat24x7.service;

import com.sehat24x7.dto.ConsultationBookingRequest;
import com.sehat24x7.dto.ConsultationBookingResponse;
import com.sehat24x7.exception.ResourceNotFoundException;
import com.sehat24x7.exception.ValidationException;
import com.sehat24x7.model.ConsultationBooking;
import com.sehat24x7.model.Specialization;
import com.sehat24x7.repository.ConsultationBookingRepository;
import com.sehat24x7.repository.SpecializationRepository;
import com.sehat24x7.util.CommonUtil;
import com.sehat24x7.util.ValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ConsultationBookingService extends BaseService {

    @Autowired
    private ConsultationBookingRepository consultationBookingRepository;

    @Autowired
    private SpecializationRepository specializationRepository;

    /**
     * Create a new consultation booking with comprehensive validation
     */
    public ConsultationBookingResponse createConsultationBooking(ConsultationBookingRequest request) {
        logInfo("Creating consultation booking for: " + request.getMobileNumber());

        // Validate input
        validateBookingRequest(request);

        // Validate specialization exists
        Specialization specialization = specializationRepository.findById(request.getSpecializationId())
                .orElseThrow(() -> {
                    logError("Specialization not found: " + request.getSpecializationId());
                    return new ResourceNotFoundException("Specialization", "id", request.getSpecializationId());
                });

        // Create consultation booking
        ConsultationBooking booking = new ConsultationBooking();
        booking.setSpecialization(specialization);
        booking.setPatientName(request.getPatientName().trim());
        booking.setMobileNumber(request.getMobileNumber().trim());
        booking.setEmail(request.getEmail() != null ? request.getEmail().trim() : null);
        booking.setSymptoms(request.getSymptoms() != null ? request.getSymptoms().trim() : null);
        booking.setAdditionalNotes(request.getAdditionalNotes() != null ? request.getAdditionalNotes().trim() : null);
        booking.setStatus(ConsultationBooking.BookingStatus.PENDING);
        booking.setVerificationCode(CommonUtil.generateOtp(6));
        booking.setConsultationFee(getConsultationFee(specialization));
        booking.setCreatedAt(LocalDateTime.now());

        ConsultationBooking saved = consultationBookingRepository.save(booking);
        logInfo("Consultation booking created successfully with ID: " + saved.getId());

        // TODO: Send OTP via SMS/Email
        // sendVerificationCode(saved.getMobileNumber(), saved.getVerificationCode());

        return mapToResponse(saved);
    }

    /**
     * Verify consultation booking with OTP
     */
    public ConsultationBookingResponse verifyConsultationBooking(Long bookingId, String verificationCode) {
        logInfo("Verifying consultation booking: " + bookingId);

        if (ValidationUtil.isNullOrEmpty(verificationCode)) {
            throw new ValidationException("Verification code cannot be empty");
        }

        ConsultationBooking booking = consultationBookingRepository.findById(bookingId)
                .orElseThrow(() -> {
                    logError("Booking not found: " + bookingId);
                    return new ResourceNotFoundException("ConsultationBooking", "id", bookingId);
                });

        if (!booking.getVerificationCode().equals(verificationCode.trim())) {
            logWarn("Invalid verification code for booking: " + bookingId);
            throw new ValidationException("Invalid verification code");
        }

        booking.setVerificationCodeVerified(true);
        booking.setVerifiedAt(LocalDateTime.now());
        booking.setStatus(ConsultationBooking.BookingStatus.VERIFIED);

        ConsultationBooking updated = consultationBookingRepository.save(booking);
        logInfo("Consultation booking verified successfully: " + bookingId);
        return mapToResponse(updated);
    }

    /**
     * Get consultation booking details
     */
    public ConsultationBookingResponse getConsultationBooking(Long bookingId) {
        logDebug("Fetching consultation booking: " + bookingId);
        ConsultationBooking booking = consultationBookingRepository.findById(bookingId)
                .orElseThrow(() -> {
                    logError("Booking not found: " + bookingId);
                    return new ResourceNotFoundException("ConsultationBooking", "id", bookingId);
                });
        return mapToResponse(booking);
    }

    /**
     * Get all consultation bookings by status
     */
    public List<ConsultationBookingResponse> getBookingsByStatus(String status) {
        logInfo("Fetching bookings by status: " + status);
        try {
            ConsultationBooking.BookingStatus bookingStatus = ConsultationBooking.BookingStatus.valueOf(status.toUpperCase());
            return consultationBookingRepository.findByStatus(bookingStatus)
                    .stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            logError("Invalid status: " + status);
            throw new ValidationException("Invalid status: " + status);
        }
    }

    /**
     * Confirm consultation booking (after payment, if needed)
     */
    public ConsultationBookingResponse confirmConsultationBooking(Long bookingId) {
        logInfo("Confirming consultation booking: " + bookingId);
        ConsultationBooking booking = consultationBookingRepository.findById(bookingId)
                .orElseThrow(() -> {
                    logError("Booking not found: " + bookingId);
                    return new ResourceNotFoundException("ConsultationBooking", "id", bookingId);
                });

        if (!booking.getVerificationCodeVerified()) {
            throw new ValidationException("Consultation booking is not verified");
        }

        booking.setStatus(ConsultationBooking.BookingStatus.CONFIRMED);
        booking.setBookedAt(LocalDateTime.now());

        ConsultationBooking updated = consultationBookingRepository.save(booking);
        logInfo("Consultation booking confirmed: " + bookingId);
        return mapToResponse(updated);
    }

    /**
     * Cancel consultation booking
     */
    public void cancelConsultationBooking(Long bookingId) {
        logInfo("Cancelling consultation booking: " + bookingId);
        ConsultationBooking booking = consultationBookingRepository.findById(bookingId)
                .orElseThrow(() -> {
                    logError("Booking not found: " + bookingId);
                    return new ResourceNotFoundException("ConsultationBooking", "id", bookingId);
                });

        booking.setStatus(ConsultationBooking.BookingStatus.CANCELLED);
        consultationBookingRepository.save(booking);
        logInfo("Consultation booking cancelled: " + bookingId);
    }

    /**
     * Resend verification code
     */
    public void resendVerificationCode(Long bookingId) {
        logInfo("Resending verification code for booking: " + bookingId);
        ConsultationBooking booking = consultationBookingRepository.findById(bookingId)
                .orElseThrow(() -> {
                    logError("Booking not found: " + bookingId);
                    return new ResourceNotFoundException("ConsultationBooking", "id", bookingId);
                });

        String newCode = CommonUtil.generateOtp(6);
        booking.setVerificationCode(newCode);
        consultationBookingRepository.save(booking);
        logInfo("Verification code resent for booking: " + bookingId);

        // TODO: Send OTP via SMS/Email
        // sendVerificationCode(booking.getMobileNumber(), newCode);
    }

    /**
     * Validate booking request
     */
    private void validateBookingRequest(ConsultationBookingRequest request) {
        if (!ValidationUtil.isValidPhoneNumber(request.getMobileNumber())) {
            throw new ValidationException("Invalid phone number. Must be 10 digits.");
        }

        if (!ValidationUtil.isValidName(request.getPatientName())) {
            throw new ValidationException("Invalid patient name. Must be 2-100 characters with letters only.");
        }

        if (request.getEmail() != null && !request.getEmail().isEmpty() && 
            !ValidationUtil.isValidEmail(request.getEmail())) {
            throw new ValidationException("Invalid email address.");
        }

        if (request.getSpecializationId() == null || request.getSpecializationId() <= 0) {
            throw new ValidationException("Valid specialization ID is required.");
        }
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
     * Get consultation fee for a specialization
     */
    private Double getConsultationFee(Specialization specialization) {
        if (specialization == null) return 499.0;
        
        switch (specialization.getName().toLowerCase()) {
            case "gynaecology":
                return 499.0;
            case "cardiology":
                return 599.0;
            case "dermatology":
                return 399.0;
            case "general":
                return 299.0;
            case "psychiatry":
                return 449.0;
            case "pediatrics":
                return 349.0;
            default:
                return 499.0;
        }
    }
}

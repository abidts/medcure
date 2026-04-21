package com.sehat24x7.controller;

import com.sehat24x7.dto.SignalMessage;
import com.sehat24x7.model.Doctor;
import com.sehat24x7.model.DoctorStatus;
import com.sehat24x7.model.Patient;
import com.sehat24x7.model.VideoCallRequest;
import com.sehat24x7.model.VideoCallRate;
import com.sehat24x7.model.Wallet;
import com.sehat24x7.service.DoctorService;
import com.sehat24x7.service.DoctorStatusService;
import com.sehat24x7.service.PatientService;
import com.sehat24x7.service.VideoCallRequestService;
import com.sehat24x7.service.VideoCallRateService;
import com.sehat24x7.service.WalletService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controller for video call requests between patients and doctors
 * Handles both REST API and WebSocket signaling
 */
@RestController
@RequestMapping("/api/video-call")
@CrossOrigin(origins = "*")
public class VideoCallRequestController {

    private static final Logger logger = LoggerFactory.getLogger(VideoCallRequestController.class);

    @Autowired
    private VideoCallRequestService videoCallRequestService;

    @Autowired
    private DoctorStatusService doctorStatusService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @Autowired
    private VideoCallRateService videoCallRateService;

    @Autowired
    private WalletService walletService;

    /**
     * Get all online doctors
     */
    @GetMapping("/online-doctors")
    public List<Map<String, Object>> getOnlineDoctors() {
        return doctorStatusService.getOnlineDoctors().stream()
                .map(status -> {
                    Map<String, Object> doctorMap = new HashMap<>();
                    Doctor doctor = status.getDoctor();
                    doctorMap.put("id", doctor.getId());
                    doctorMap.put("name", doctor.getName());
                    doctorMap.put("specialization", doctor.getSpecialization().getName());
                    doctorMap.put("qualification", doctor.getQualification());
                    doctorMap.put("consultationFee", doctor.getConsultationFee());
                    doctorMap.put("status", status.getStatus().name());
                    doctorMap.put("message", status.getMessage());
                    return doctorMap;
                })
                .collect(Collectors.toList());
    }

    /**
     * Check if a specific doctor is online
     */
    @GetMapping("/doctor/{doctorId}/status")
    public Map<String, Object> getDoctorStatus(@PathVariable Long doctorId) {
        Map<String, Object> response = new HashMap<>();
        doctorStatusService.getStatusByDoctorId(doctorId)
                .ifPresentOrElse(status -> {
                    response.put("online", status.getStatus() == DoctorStatus.Status.ONLINE);
                    response.put("status", status.getStatus().name());
                    response.put("message", status.getMessage());
                }, () -> {
                    response.put("online", false);
                    response.put("status", "OFFLINE");
                });
        response.put("doctorId", doctorId);
        return response;
    }

    /**
     * Create a video call request (patient to doctor)
     */
    @PostMapping("/request")
    public Map<String, Object> createVideoCallRequest(
            @RequestParam Long patientId,
            @RequestParam Long doctorId,
            @RequestParam String reason) {

        Map<String, Object> response = new HashMap<>();

        try {
            Patient patient = patientService.getPatientById(patientId)
                    .orElseThrow(() -> new RuntimeException("Patient not found"));

            Doctor doctor = doctorService.getDoctorById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));

            // Check if doctor is online
            DoctorStatus doctorStatus = doctorStatusService.getOrCreateStatus(doctor);
            if (doctorStatus.getStatus() != DoctorStatus.Status.ONLINE) {
                response.put("success", false);
                response.put("message", "Doctor is currently offline. Please try later or book an appointment.");
                response.put("doctorOnline", false);
                return response;
            }

            // Get video call rate
            VideoCallRate rate = videoCallRateService.getOrCreateRate(doctor);
            Double minimumCharge = rate.getRatePerMinute() * rate.getMinimumDuration();

            // Check wallet balance
            Wallet wallet = walletService.getOrCreateWallet(patient);
            if (!walletService.hasSufficientBalance(wallet, minimumCharge)) {
                response.put("success", false);
                response.put("message", "Insufficient wallet balance. Please add at least Rs." + minimumCharge + " to your wallet.");
                response.put("requiredBalance", minimumCharge);
                response.put("currentBalance", wallet.getBalance());
                response.put("needsRecharge", true);
                return response;
            }

            // Deduct minimum charge from wallet
            walletService.deductMoney(wallet, minimumCharge, "Video call with Dr. " + doctor.getName() + " (Minimum charge)");

            // Create the video call request
            VideoCallRequest request = videoCallRequestService.createRequest(patient, doctor, reason);
            request.setCallCost(minimumCharge);
            request.setPaymentDeducted(true);
            videoCallRequestService.updateRequest(request);

            response.put("success", true);
            response.put("message", "Video call request sent");
            response.put("requestId", request.getId());
            response.put("callRoomId", request.getCallRoomId());
            response.put("amountDeducted", minimumCharge);
            response.put("walletBalance", wallet.getBalance());

        } catch (IllegalStateException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to send request: " + e.getMessage());
        }

        return response;
    }

    /**
     * Accept a video call request (doctor)
     */
    @PostMapping("/request/{requestId}/accept")
    public Map<String, Object> acceptVideoCallRequest(@PathVariable Long requestId) {
        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("=== ACCEPT REQUEST ===");
            System.out.println("Request ID: " + requestId);

            VideoCallRequest request = videoCallRequestService.acceptRequest(requestId);

            System.out.println("Status after accept: " + request.getStatus().name());
            System.out.println("Call Room ID: " + request.getCallRoomId());
            System.out.println("=====================");

            response.put("success", true);
            response.put("message", "Call accepted");
            response.put("callRoomId", request.getCallRoomId());
            response.put("callCost", request.getCallCost());

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", e.getMessage());
        }

        return response;
    }

    /**
     * Reject a video call request (doctor)
     */
    @PostMapping("/request/{requestId}/reject")
    public Map<String, Object> rejectVideoCallRequest(
            @PathVariable Long requestId,
            @RequestParam(required = false) String reason) {

        Map<String, Object> response = new HashMap<>();

        try {
            VideoCallRequest request = videoCallRequestService.rejectRequest(requestId, reason);

            response.put("success", true);
            response.put("message", "Call rejected");

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }

        return response;
    }

    /**
     * Get pending video call requests for a doctor
     */
    @GetMapping("/doctor/{doctorId}/requests")
    public List<Map<String, Object>> getDoctorRequests(@PathVariable Long doctorId) {
        return videoCallRequestService.getPendingRequestsForDoctor(doctorId).stream()
                .map(request -> {
                    Map<String, Object> requestMap = new HashMap<>();
                    requestMap.put("id", request.getId());
                    requestMap.put("patientId", request.getPatient().getId());
                    requestMap.put("patientName", request.getPatient().getName());
                    requestMap.put("reason", request.getReason());
                    requestMap.put("requestTime", request.getRequestTime());
                    requestMap.put("status", request.getStatus().name());
                    return requestMap;
                })
                .collect(Collectors.toList());
    }

    /**
     * Complete a video call
     */
    @PostMapping("/request/{requestId}/complete")
    public Map<String, Object> completeVideoCall(
            @PathVariable Long requestId,
            @RequestParam(required = false) String notes,
            @RequestParam(required = false) Integer durationMinutes) {

        Map<String, Object> response = new HashMap<>();

        try {
            VideoCallRequest request = videoCallRequestService.getRequestById(requestId)
                    .orElseThrow(() -> new RuntimeException("Request not found"));

            // Calculate final cost based on actual duration
            VideoCallRate rate = videoCallRateService.getOrCreateRate(request.getDoctor());
            Double actualCost = rate.getRatePerMinute() * (durationMinutes != null ? durationMinutes : rate.getMinimumDuration());
            Double alreadyPaid = request.getCallCost() != null ? request.getCallCost() : 0.0;

            // If actual cost is less than what was charged, refund the difference
            if (alreadyPaid > actualCost) {
                Double refundAmount = alreadyPaid - actualCost;
                Wallet wallet = walletService.getOrCreateWallet(request.getPatient());
                walletService.addMoney(wallet, refundAmount, "REFUND", "REFUND_" + requestId);
                response.put("refundedAmount", refundAmount);
            }

            // Update request with final details
            request.setCallDurationMinutes(durationMinutes);
            request.setCallCost(actualCost);
            request.setCallNotes(notes);
            VideoCallRequest completed = videoCallRequestService.completeRequest(request.getId(), notes);

            response.put("success", true);
            response.put("message", "Call completed");
            response.put("durationMinutes", durationMinutes);
            response.put("totalCost", actualCost);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }

        return response;
    }

    /**
     * WebSocket handler for video call signaling
     * Clients send to: /app/video-call/{requestId}
     */
    @MessageMapping("/video-call/{requestId}")
    public SignalMessage handleVideoCallMessage(
            @DestinationVariable Long requestId,
            @Payload SignalMessage message) {

        logger.info("Received video call message: {} for request {}", message.getType(), requestId);

        // Forward the message to the call room topic
        String destination = "/topic/video-call/" + requestId;
        messagingTemplate.convertAndSend(destination, message);

        return null;
    }
}

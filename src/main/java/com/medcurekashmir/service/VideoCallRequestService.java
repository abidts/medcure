package com.medcurekashmir.service;

import com.medcurekashmir.model.*;
import com.medcurekashmir.repository.VideoCallRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service for managing video call requests between patients and doctors
 */
@Service
@Transactional
public class VideoCallRequestService {

    @Autowired
    private VideoCallRequestRepository videoCallRequestRepository;

    @Autowired
    private DoctorStatusService doctorStatusService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Create a video call request from patient to doctor
     */
    public VideoCallRequest createRequest(Patient patient, Doctor doctor, String reason) {
        // Check if doctor is online
        if (!doctorStatusService.isOnline(doctor)) {
            throw new IllegalStateException("Doctor is not available for video calls");
        }

        VideoCallRequest request = new VideoCallRequest();
        request.setPatient(patient);
        request.setDoctor(doctor);
        request.setReason(reason);
        request.setStatus(VideoCallRequest.RequestStatus.PENDING);

        VideoCallRequest saved = videoCallRequestRepository.save(request);

        // Notify doctor via WebSocket
        notifyDoctorOfRequest(saved);

        return saved;
    }

    /**
     * Accept a video call request
     */
    public VideoCallRequest acceptRequest(Long requestId) {
        VideoCallRequest request = videoCallRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != VideoCallRequest.RequestStatus.PENDING) {
            throw new IllegalStateException("Request is not pending");
        }

        request.setStatus(VideoCallRequest.RequestStatus.ACCEPTED);
        request.setResponseTime(LocalDateTime.now());
        request.setCallStartTime(LocalDateTime.now());

        // Set doctor status to BUSY
        doctorStatusService.setBusy(request.getDoctor());

        VideoCallRequest saved = videoCallRequestRepository.save(request);

        // Notify patient via WebSocket
        notifyPatientOfResponse(saved);

        return saved;
    }

    /**
     * Reject a video call request
     */
    public VideoCallRequest rejectRequest(Long requestId, String reason) {
        VideoCallRequest request = videoCallRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != VideoCallRequest.RequestStatus.PENDING) {
            throw new IllegalStateException("Request is not pending");
        }

        request.setStatus(VideoCallRequest.RequestStatus.REJECTED);
        request.setResponseTime(LocalDateTime.now());
        request.setResponseMessage(reason);

        VideoCallRequest saved = videoCallRequestRepository.save(request);

        // Notify patient via WebSocket
        notifyPatientOfResponse(saved);

        return saved;
    }

    /**
     * Complete a video call
     */
    public VideoCallRequest completeRequest(Long requestId, String notes) {
        VideoCallRequest request = videoCallRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus(VideoCallRequest.RequestStatus.COMPLETED);
        request.setCallEndTime(LocalDateTime.now());
        request.setCallNotes(notes);

        // Set doctor status back to ONLINE
        doctorStatusService.setOnline(request.getDoctor());

        return videoCallRequestRepository.save(request);
    }

    /**
     * Mark request as missed (no response within timeout)
     */
    public void markAsMissed(Long requestId) {
        VideoCallRequest request = videoCallRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus(VideoCallRequest.RequestStatus.MISSED);
        request.setResponseTime(LocalDateTime.now());
        request.setResponseMessage("Doctor did not respond in time");

        videoCallRequestRepository.save(request);

        // Notify patient
        notifyPatientOfResponse(request);
    }

    /**
     * Get pending requests for a doctor
     */
    public List<VideoCallRequest> getPendingRequestsForDoctor(Long doctorId) {
        return videoCallRequestRepository.findPendingRequestsByDoctorId(doctorId);
    }

    /**
     * Get request by ID
     */
    public Optional<VideoCallRequest> getRequest(Long requestId) {
        return videoCallRequestRepository.findById(requestId);
    }

    /**
     * Get request by ID (alias for getRequest)
     */
    public Optional<VideoCallRequest> getRequestById(Long requestId) {
        return videoCallRequestRepository.findById(requestId);
    }

    /**
     * Update request (for wallet integration)
     */
    public VideoCallRequest updateRequest(VideoCallRequest request) {
        return videoCallRequestRepository.save(request);
    }

    /**
     * Notify doctor of new video call request via WebSocket
     */
    private void notifyDoctorOfRequest(VideoCallRequest request) {
        String destination = "/topic/doctor/" + request.getDoctor().getId() + "/video-requests";
        
        VideoCallNotification notification = new VideoCallNotification();
        notification.setType("NEW_REQUEST");
        notification.setRequestId(request.getId());
        notification.setPatientName(request.getPatient().getName());
        notification.setPatientId(request.getPatient().getId());
        notification.setReason(request.getReason());
        notification.setTime(request.getRequestTime());

        messagingTemplate.convertAndSend(destination, notification);
    }

    /**
     * Notify patient of doctor's response via WebSocket
     */
    private void notifyPatientOfResponse(VideoCallRequest request) {
        String destination = "/topic/patient/" + request.getPatient().getId() + "/video-requests";
        
        VideoCallNotification notification = new VideoCallNotification();
        notification.setType(request.getStatus().name());
        notification.setRequestId(request.getId());
        notification.setDoctorName(request.getDoctor().getName());
        notification.setDoctorId(request.getDoctor().getId());
        notification.setCallRoomId(request.getCallRoomId());
        notification.setTime(LocalDateTime.now());

        if (request.getStatus() == VideoCallRequest.RequestStatus.REJECTED) {
            notification.setMessage(request.getResponseMessage());
        }

        messagingTemplate.convertAndSend(destination, notification);
    }

    /**
     * DTO for video call notifications
     */
    public static class VideoCallNotification {
        private String type;
        private Long requestId;
        private Long patientId;
        private String patientName;
        private Long doctorId;
        private String doctorName;
        private String reason;
        private String message;
        private String callRoomId;
        private LocalDateTime time;

        // Getters and Setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public Long getRequestId() { return requestId; }
        public void setRequestId(Long requestId) { this.requestId = requestId; }
        public Long getPatientId() { return patientId; }
        public void setPatientId(Long patientId) { this.patientId = patientId; }
        public String getPatientName() { return patientName; }
        public void setPatientName(String patientName) { this.patientName = patientName; }
        public Long getDoctorId() { return doctorId; }
        public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
        public String getDoctorName() { return doctorName; }
        public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String getCallRoomId() { return callRoomId; }
        public void setCallRoomId(String callRoomId) { this.callRoomId = callRoomId; }
        public LocalDateTime getTime() { return time; }
        public void setTime(LocalDateTime time) { this.time = time; }
    }
}

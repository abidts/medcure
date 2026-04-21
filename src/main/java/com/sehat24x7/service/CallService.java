package com.sehat24x7.service;

import com.sehat24x7.dto.SignalMessage;
import com.sehat24x7.model.Appointment;
import com.sehat24x7.model.Doctor;
import com.sehat24x7.model.Patient;
import com.sehat24x7.repository.AppointmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * WebRTC Call Signaling Service
 *
 * Handles WebRTC signaling messages for peer-to-peer video calls.
 * Uses in-memory storage for room participants (no persistence needed).
 *
 * Security: Only the doctor and patient associated with an appointment
 * can join/signaling for that appointment's call room.
 *
 * Room Logic:
 * - First participant becomes the "initiator" (creates offer)
 * - Second participant receives offer and sends answer
 * - ICE candidates are exchanged bidirectionally
 * - When a user leaves, remaining participants are notified
 *
 * NOTE: This is a signaling server only. Actual video/audio streams
 * are peer-to-peer (no media passes through the server).
 */
@Service
public class CallService {

    private static final Logger logger = LoggerFactory.getLogger(CallService.class);

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * In-memory room tracking: appointmentId -> set of participant usernames
     * Using ConcurrentHashMap for thread-safety with multiple WebSocket connections
     */
    private final Map<Long, Set<String>> roomParticipants = new ConcurrentHashMap<>();

    /**
     * Track user roles in each room: appointmentId -> (username -> role)
     */
    private final Map<Long, Map<String, String>> roomUserRoles = new ConcurrentHashMap<>();

    /**
     * Validate that a user can access an appointment's call room
     * Only the appointment's doctor or patient can join
     *
     * @param appointmentId The appointment ID
     * @param username The username (email) of the user trying to join
     * @return Optional containing the user's role ("DOCTOR" or "PATIENT") if authorized
     */
    public Optional<String> validateAppointmentAccess(Long appointmentId, String username) {
        logger.info("Validating access for appointment {} and user {}", appointmentId, username);

        Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
        if (appointmentOpt.isEmpty()) {
            logger.warn("Appointment not found: {}", appointmentId);
            return Optional.empty();
        }

        Appointment appointment = appointmentOpt.get();

        // Check if user is the patient
        Patient patient = appointment.getPatient();
        if (patient != null && patient.getEmail().equals(username)) {
            logger.info("User {} authorized as PATIENT for appointment {}", username, appointmentId);
            return Optional.of("PATIENT");
        }

        // Check if user is the doctor
        Doctor doctor = appointment.getDoctor();
        if (doctor != null && doctor.getEmail().equals(username)) {
            logger.info("User {} authorized as DOCTOR for appointment {}", username, appointmentId);
            return Optional.of("DOCTOR");
        }

        logger.warn("User {} not authorized for appointment {}", username, appointmentId);
        return Optional.empty();
    }

    /**
     * Handle JOIN message - user wants to join a call room
     *
     * @param appointmentId The appointment ID (room ID)
     * @param username The user joining
     * @param userRole The user's role (DOCTOR or PATIENT)
     * @return SignalMessage with JOIN_ACK containing initiator status
     */
    public SignalMessage handleJoin(Long appointmentId, String username, String userRole) {
        logger.info("User {} joining call room for appointment {}", username, appointmentId);

        // Add user to room
        roomParticipants.computeIfAbsent(appointmentId, k -> ConcurrentHashMap.newKeySet())
                        .add(username);

        // Track user role
        roomUserRoles.computeIfAbsent(appointmentId, k -> new ConcurrentHashMap<>())
                     .put(username, userRole);

        // Check if this user is the first in the room (initiator)
        boolean isInitiator = roomParticipants.get(appointmentId).size() == 1;

        // Notify other participants that this user joined
        notifyPeerJoined(appointmentId, username, userRole);

        // Send acknowledgment to the joining user
        SignalMessage ack = new SignalMessage();
        ack.setType("JOIN_ACK");
        ack.setAppointmentId(appointmentId.toString());
        ack.setInitiator(isInitiator);
        ack.setRole(userRole);

        logger.info("User {} {} initiator for room {}", username, isInitiator ? "is" : "is not", appointmentId);

        return ack;
    }

    /**
     * Handle LEAVE message - user is leaving the call
     *
     * @param appointmentId The appointment ID
     * @param username The user leaving
     */
    public void handleLeave(Long appointmentId, String username) {
        logger.info("User {} leaving call room for appointment {}", username, appointmentId);

        // Remove user from room
        Set<String> participants = roomParticipants.get(appointmentId);
        if (participants != null) {
            participants.remove(username);

            // Remove role tracking
            Map<String, String> roles = roomUserRoles.get(appointmentId);
            if (roles != null) {
                roles.remove(username);
            }

            // Clean up empty rooms
            if (participants.isEmpty()) {
                roomParticipants.remove(appointmentId);
                roomUserRoles.remove(appointmentId);
                logger.info("Removed empty room {}", appointmentId);
            }
        }

        // Notify remaining participants
        notifyPeerLeft(appointmentId, username);
    }

    /**
     * Notify all other participants in a room that a peer joined
     *
     * @param appointmentId The appointment ID
     * @param joinedUsername The user who joined
     * @param role The user's role
     */
    private void notifyPeerJoined(Long appointmentId, String joinedUsername, String role) {
        SignalMessage notification = new SignalMessage();
        notification.setType("PEER_JOINED");
        notification.setAppointmentId(appointmentId.toString());
        notification.setFrom(joinedUsername);
        notification.setRole(role);

        // Broadcast to all participants in the room
        String destination = "/topic/call/" + appointmentId;
        messagingTemplate.convertAndSend(destination, notification);

        logger.info("Notified room {} that {} joined", appointmentId, joinedUsername);
    }

    /**
     * Notify all other participants in a room that a peer left
     *
     * @param appointmentId The appointment ID
     * @param leftUsername The user who left
     */
    private void notifyPeerLeft(Long appointmentId, String leftUsername) {
        SignalMessage notification = new SignalMessage();
        notification.setType("PEER_LEFT");
        notification.setAppointmentId(appointmentId.toString());
        notification.setFrom(leftUsername);

        // Broadcast to remaining participants
        String destination = "/topic/call/" + appointmentId;
        messagingTemplate.convertAndSend(destination, notification);

        logger.info("Notified room {} that {} left", appointmentId, leftUsername);
    }

    /**
     * Forward signaling messages (OFFER, ANSWER, ICE) to all other participants
     *
     * @param appointmentId The appointment ID
     * @param message The signaling message to forward
     * @param senderUsername The sender's username
     */
    public void forwardSignalingMessage(Long appointmentId, SignalMessage message, String senderUsername) {
        String destination = "/topic/call/" + appointmentId;
        messagingTemplate.convertAndSend(destination, message);

        logger.debug("Forwarded {} message from {} to room {}",
                    message.getType(), senderUsername, appointmentId);
    }

    /**
     * Get the number of participants in a room
     */
    public int getParticipantCount(Long appointmentId) {
        Set<String> participants = roomParticipants.get(appointmentId);
        return participants != null ? participants.size() : 0;
    }

    /**
     * Check if a user is in a room
     */
    public boolean isUserInRoom(Long appointmentId, String username) {
        Set<String> participants = roomParticipants.get(appointmentId);
        return participants != null && participants.contains(username);
    }
}

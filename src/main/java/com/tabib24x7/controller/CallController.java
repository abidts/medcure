package com.tabib24x7.controller;

import com.tabib24x7.dto.SignalMessage;
import com.tabib24x7.service.CallService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import java.util.Optional;

/**
 * WebRTC Call Signaling Controller
 *
 * Handles WebSocket messages for WebRTC peer-to-peer video call signaling.
 * This controller routes signaling messages between the doctor and patient
 * of an appointment.
 *
 * WebSocket Endpoints:
 * - Client sends to: /app/call/{appointmentId}
 * - Client subscribes to: /topic/call/{appointmentId}
 *
 * Message Flow:
 * 1. Client connects and subscribes to /topic/call/{appointmentId}
 * 2. Client sends JOIN message
 * 3. Server validates access and sends JOIN_ACK with initiator status
 * 4. Initiator creates OFFER and sends it
 * 5. Other peer receives OFFER, creates ANSWER, sends it back
 * 6. Both peers exchange ICE candidates
 * 7. WebRTC peer connection established (direct P2P)
 * 8. On leave, client sends LEAVE message
 *
 * Security:
 * - Only the appointment's doctor and patient can join/signaling
 * - Validation happens on JOIN and for each subsequent message
 *
 * NOTE: For production, implement proper WebSocket security with Spring Security.
 * Currently uses simple username validation from WebSocket session.
 */
@Controller
public class CallController {

    private static final Logger logger = LoggerFactory.getLogger(CallController.class);

    @Autowired
    private CallService callService;

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    /**
     * Handle all signaling messages for a call room
     *
     * This single endpoint handles all message types (JOIN, OFFER, ANSWER, ICE, LEAVE)
     * and routes them appropriately.
     *
     * @param appointmentId The appointment ID (room ID)
     * @param message The signaling message
     * @param headerAccessor WebSocket session headers
     * @return Message to broadcast to room subscribers, or null for ack-only responses
     */
    @MessageMapping("/call/{appointmentId}")
    public SignalMessage handleCallMessage(
            @DestinationVariable Long appointmentId,
            @Payload SignalMessage message,
            SimpMessageHeaderAccessor headerAccessor) {

        // Get username from WebSocket session
        // In production, this should come from Spring Security authentication
        String username = (String) headerAccessor.getSessionAttributes().get("username");

        if (username == null) {
            logger.warn("Received message without username for appointment {}", appointmentId);
            SignalMessage error = createError("Authentication required");
            error.setAppointmentId(appointmentId.toString());
            return error;
        }

        logger.info("Received {} message from {} for appointment {}",
                   message.getType(), username, appointmentId);

        try {
            switch (message.getType()) {
                case "JOIN":
                    return handleJoin(appointmentId, username);

                case "OFFER":
                case "ANSWER":
                case "ICE":
                    return handleSignaling(appointmentId, username, message);

                case "LEAVE":
                    handleLeave(appointmentId, username);
                    return null; // No response needed

                default:
                    logger.warn("Unknown message type: {}", message.getType());
                    SignalMessage error = createError("Unknown message type: " + message.getType());
                    error.setAppointmentId(appointmentId.toString());
                    return error;
            }
        } catch (SecurityException e) {
            logger.error("Security violation: {} - {}", username, e.getMessage());
            SignalMessage error = createError("Access denied: " + e.getMessage());
            error.setAppointmentId(appointmentId.toString());
            return error;
        } catch (Exception e) {
            logger.error("Error handling message: {}", e.getMessage(), e);
            SignalMessage error = createError("Server error: " + e.getMessage());
            error.setAppointmentId(appointmentId.toString());
            return error;
        }
    }

    /**
     * Handle JOIN message - validate access and add user to room
     */
    private SignalMessage handleJoin(Long appointmentId, String username) {
        // Validate user has access to this appointment
        Optional<String> roleOpt = callService.validateAppointmentAccess(appointmentId, username);

        if (roleOpt.isEmpty()) {
            throw new SecurityException("User " + username + " not authorized for appointment " + appointmentId);
        }

        String role = roleOpt.get();

        // Add user to room and get acknowledgment
        SignalMessage ack = callService.handleJoin(appointmentId, username, role);

        // Store username in session for future messages
        // This is a simplified approach - in production use proper authentication
        logger.info("User {} joined room {} as {}", username, appointmentId, role);

        return ack;
    }

    /**
     * Handle signaling messages (OFFER, ANSWER, ICE)
     * Forward to all other participants in the room
     */
    private SignalMessage handleSignaling(Long appointmentId, String username, SignalMessage message) {
        // Verify user is in the room
        if (!callService.isUserInRoom(appointmentId, username)) {
            // Auto-join if not already in room (simplifies client logic)
            Optional<String> roleOpt = callService.validateAppointmentAccess(appointmentId, username);
            if (roleOpt.isEmpty()) {
                throw new SecurityException("User " + username + " not authorized for appointment " + appointmentId);
            }
            callService.handleJoin(appointmentId, username, roleOpt.get());
        }

        // Set the sender
        message.setFrom(username);

        // Forward to all participants in the room
        callService.forwardSignalingMessage(appointmentId, message, username);

        // Return null - message already sent via messagingTemplate
        return null;
    }

    /**
     * Handle LEAVE message - remove user from room and notify others
     */
    private void handleLeave(Long appointmentId, String username) {
        callService.handleLeave(appointmentId, username);
        logger.info("User {} left room {}", username, appointmentId);
    }

    /**
     * Create an error message
     */
    private SignalMessage createError(String error) {
        SignalMessage msg = new SignalMessage();
        msg.setType("ERROR");
        msg.setError(error);
        return msg;
    }
}

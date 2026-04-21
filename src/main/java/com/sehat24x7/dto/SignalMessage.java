package com.sehat24x7.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * WebRTC Signaling Message DTO
 * Used for exchanging WebRTC signaling messages between peers via WebSocket
 *
 * Message types:
 * - JOIN: Request to join a call room
 * - JOIN_ACK: Server acknowledgment with initiator status
 * - OFFER: WebRTC offer (SDP)
 * - ANSWER: WebRTC answer (SDP)
 * - ICE: ICE candidate exchange
 * - LEAVE: User leaving the call
 * - ERROR: Error message
 * - PEER_JOINED: Notification that a peer joined
 * - PEER_LEFT: Notification that a peer left
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignalMessage {

    /**
     * Message type: JOIN, JOIN_ACK, OFFER, ANSWER, ICE, LEAVE, ERROR, PEER_JOINED, PEER_LEFT
     */
    private String type;

    /**
     * Appointment ID (room identifier)
     */
    private String appointmentId;

    /**
     * Sender's username or user ID
     */
    private String from;

    /**
     * SDP payload for OFFER/ANSWER messages
     */
    private String payload;

    /**
     * ICE candidate as JSON string
     */
    private String candidate;

    /**
     * SDP media ID for ICE candidates
     */
    private String sdpMid;

    /**
     * SDP media line index for ICE candidates
     */
    private Integer sdpMLineIndex;

    /**
     * Whether this user is the call initiator (first to join)
     */
    private Boolean initiator;

    /**
     * Error message for ERROR type
     */
    private String error;

    /**
     * User's role in the appointment (DOCTOR or PATIENT)
     */
    private String role;
}

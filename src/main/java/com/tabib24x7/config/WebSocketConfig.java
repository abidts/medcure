package com.tabib24x7.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket Configuration for WebRTC Signaling
 *
 * This configures Spring WebSocket with STOMP protocol and SockJS fallback.
 *
 * Endpoints:
 * - WebSocket endpoint: /ws (SockJS enabled for browser compatibility)
 * - App destination prefix: /app (for sending messages to server)
 * - Topic prefix: /topic (for broadcasting to subscribers)
 * - User prefix: /user (for targeted user messages)
 *
 * Usage:
 * - Clients connect to: /ws
 * - Clients send signaling to: /app/call/{appointmentId}
 * - Clients subscribe to: /topic/call/{appointmentId}
 *
 * NOTE: For production, HTTPS is required for WebRTC camera/microphone access.
 * Browsers only allow getUserMedia on secure contexts (HTTPS or localhost).
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple in-memory message broker for /topic and /user destinations
        // This broadcasts messages to all subscribers of a topic
        config.enableSimpleBroker("/topic", "/user");

        // Set prefix for messages bound for @MessageMapping methods
        config.setApplicationDestinationPrefixes("/app");

        // Set prefix for user-specific destinations
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register WebSocket endpoint with SockJS fallback
        // Clients connect to this endpoint
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // Allow all origins (restrict in production)
                .withSockJS(); // Enable SockJS fallback for older browsers

        // Also register raw WebSocket endpoint for clients that don't need SockJS
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .setAllowedOrigins("*");
    }
}

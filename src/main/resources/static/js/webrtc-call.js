/**
 * WebRTC Video Call Handler
 * 
 * Implements peer-to-peer video calling using WebRTC with Spring WebSocket (STOMP) signaling.
 * Uses free Google STUN servers for NAT traversal.
 * 
 * Features:
 * - Join/leave call rooms
 * - Exchange WebRTC signaling (offer/answer/ICE)
 * - Mute/unmute audio
 * - Camera on/off
 * - Screen sharing
 * - Connection quality monitoring
 * 
 * Usage:
 *   initializeCall({
 *     appointmentId: 123,
 *     username: 'user@example.com',
 *     returnUrl: '/appointments/123'
 *   });
 * 
 * NOTE: For production, HTTPS is required for camera/microphone access.
 * Browsers only allow getUserMedia on secure contexts (HTTPS or localhost).
 */

// Global variables
let localStream = null;
let remoteStream = null;
let peerConnection = null;
let stompClient = null;
let isInitiator = false;
let isAudioEnabled = true;
let isVideoEnabled = true;
let isScreenSharing = false;
let screenStream = null;
let isRequestCall = false;  // Track if this is a request-based call

// WebRTC configuration with free Google STUN servers
const rtcConfig = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ],
    iceCandidatePoolSize: 10
};

// Media constraints for camera/microphone
const mediaConstraints = {
    audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
    },
    video: {
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 },
        facingMode: 'user'
    }
};

// Fallback constraints if primary fails
const fallbackMediaConstraints = {
    audio: true,
    video: {
        width: { min: 320 },
        height: { min: 240 }
    }
};

// Screen share constraints
const screenConstraints = {
    video: {
        cursor: 'always'
    },
    audio: false
};

/**
 * Initialize the video call
 * @param {Object} config - Call configuration
 */
async function initializeCall(config) {
    const { appointmentId, requestId, username, returnUrl } = config;

    // Set flag for request-based calls
    isRequestCall = requestId != null;

    try {
        showStatus('Connecting to call server...');
        updateRemoteStatus('Connecting...', 'connecting');

        // Connect to WebSocket signaling server
        await connectToSignalingServer(appointmentId || requestId, username, isRequestCall);

        // Get local media (camera/microphone)
        await getLocalMedia();

        showStatus('Connected. Waiting for peer...');

    } catch (error) {
        console.error('Error initializing call:', error);
        showStatus('Error: ' + error.message);
        updateRemoteStatus('Connection failed', 'error');

        // Redirect back after delay
        setTimeout(() => {
            if (returnUrl) {
                window.location.href = returnUrl;
            }
        }, 3000);
    }
}

/**
 * Connect to WebSocket signaling server
 */
function connectToSignalingServer(roomId, username, isRequest = false) {
    return new Promise((resolve, reject) => {
        try {
            // Create SockJS connection
            const socket = new SockJS('/ws');
            stompClient = Stomp.over(socket);

            // Disable debug logging for cleaner console
            stompClient.debug = null;

            // Connect to STOMP broker
            stompClient.connect({}, () => {
                console.log('Connected to signaling server');

                // Subscribe to call room topic - use video-call topic for requests
                const topic = isRequest ? `/topic/video-call/${roomId}` : `/topic/call/${roomId}`;
                stompClient.subscribe(topic, (message) => {
                    onSignalingMessage(message, roomId, username, isRequest);
                });

                // Send JOIN message
                sendSignal({
                    type: 'JOIN',
                    appointmentId: roomId.toString()
                });

                resolve();
            }, (error) => {
                console.error('WebSocket connection failed:', error);
                reject(new Error('Failed to connect to call server'));
            });

        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Get local media (camera and microphone)
 */
async function getLocalMedia() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
        localStream = stream;

        // Display local video
        const localVideo = document.getElementById('localVideo');
        if (localVideo) {
            localVideo.srcObject = stream;
            // Ensure video plays
            localVideo.play().catch(err => console.warn('Auto-play prevented:', err));
        }

        console.log('Local media obtained successfully');
        return stream;

    } catch (error) {
        console.error('Error getting local media (primary constraints):', error);

        // Try fallback constraints
        try {
            console.log('Trying fallback media constraints...');
            const fallbackStream = await navigator.mediaDevices.getUserMedia(fallbackMediaConstraints);
            localStream = fallbackStream;

            const localVideo = document.getElementById('localVideo');
            if (localVideo) {
                localVideo.srcObject = fallbackStream;
                localVideo.play().catch(err => console.warn('Auto-play prevented:', err));
            }

            console.log('Local media obtained with fallback constraints');
            return fallbackStream;

        } catch (fallbackError) {
            console.error('Error getting local media (fallback):', fallbackError);

            if (error.name === 'NotAllowedError' || fallbackError.name === 'NotAllowedError') {
                throw new Error('Camera/microphone access denied. Please allow access in your browser settings and refresh.');
            } else if (error.name === 'NotFoundError' || fallbackError.name === 'NotFoundError') {
                throw new Error('No camera or microphone found on this device.');
            } else if (error.name === 'NotReadableError' || fallbackError.name === 'NotReadableError') {
                throw new Error('Camera/microphone is already in use by another application. Please close other apps using the camera.');
            } else if (error.name === 'OverconstrainedError') {
                throw new Error('Camera does not support the requested resolution. Try a different camera.');
            } else {
                throw new Error('Failed to access camera/microphone: ' + (fallbackError.message || error.message));
            }
        }
    }
}

/**
 * Handle incoming signaling message
 */
function onSignalingMessage(message, roomId, username, isRequest = false) {
    const signal = JSON.parse(message.body);
    console.log('Received signaling message:', signal.type);

    // Ignore messages from self
    if (signal.from === username) {
        return;
    }

    switch (signal.type) {
        case 'JOIN_ACK':
            handleJoinAck(signal);
            break;

        case 'PEER_JOINED':
            handlePeerJoined(signal);
            break;

        case 'PEER_LEFT':
            handlePeerLeft();
            break;

        case 'OFFER':
            handleOffer(signal);
            break;

        case 'ANSWER':
            handleAnswer(signal);
            break;

        case 'ICE':
            handleIceCandidate(signal);
            break;

        case 'ERROR':
            handleError(signal);
            break;
    }
}

/**
 * Handle JOIN_ACK - server response to JOIN
 */
function handleJoinAck(signal) {
    isInitiator = signal.initiator === true;
    console.log('Joined as', isInitiator ? 'initiator' : 'non-initiator');
    
    if (isInitiator) {
        showStatus('Waiting for peer to join...');
        updateRemoteStatus('Waiting for peer...', 'waiting');
    }
}

/**
 * Handle PEER_JOINED - another participant joined
 */
async function handlePeerJoined(signal) {
    console.log('Peer joined:', signal.from);
    showStatus('Peer joined. Connecting...');
    updateRemoteStatus('Peer joined', 'connected');
    
    // If we're the initiator, create and send offer
    if (isInitiator) {
        await createAndSendOffer();
    }
}

/**
 * Handle PEER_LEFT - another participant left
 */
function handlePeerLeft() {
    console.log('Peer left');
    showStatus('Peer has left the call');
    updateRemoteStatus('Peer left', 'disconnected');
    
    // Close peer connection
    closePeerConnection();
}

/**
 * Create and send WebRTC offer
 */
async function createAndSendOffer() {
    try {
        if (!peerConnection) {
            createPeerConnection();
        }
        
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        console.log('Created and set local offer');
        
        // Wait for ICE gathering to complete (optional but recommended)
        await waitForIceGathering();
        
        // Send offer to peer
        sendSignal({
            type: 'OFFER',
            payload: peerConnection.localDescription.sdp
        });
        
        console.log('Sent offer to peer');
        
    } catch (error) {
        console.error('Error creating offer:', error);
        showStatus('Error creating offer: ' + error.message);
    }
}

/**
 * Handle incoming OFFER
 */
async function handleOffer(signal) {
    try {
        console.log('Received offer');
        
        if (!peerConnection) {
            createPeerConnection();
        }
        
        // Set remote description (the offer)
        await peerConnection.setRemoteDescription(new RTCSessionDescription({
            type: 'offer',
            sdp: signal.payload
        }));
        
        console.log('Set remote description (offer)');
        
        // Create answer
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        
        console.log('Created and set local answer');
        
        // Wait for ICE gathering
        await waitForIceGathering();
        
        // Send answer to peer
        sendSignal({
            type: 'ANSWER',
            payload: peerConnection.localDescription.sdp
        });
        
        console.log('Sent answer to peer');
        
    } catch (error) {
        console.error('Error handling offer:', error);
        showStatus('Error: ' + error.message);
    }
}

/**
 * Handle incoming ANSWER
 */
async function handleAnswer(signal) {
    try {
        console.log('Received answer');
        
        await peerConnection.setRemoteDescription(new RTCSessionDescription({
            type: 'answer',
            sdp: signal.payload
        }));
        
        console.log('Set remote description (answer)');
        
    } catch (error) {
        console.error('Error handling answer:', error);
    }
}

/**
 * Handle ICE candidate from peer
 */
async function handleIceCandidate(signal) {
    try {
        if (signal.candidate && peerConnection) {
            const candidate = new RTCIceCandidate({
                candidate: signal.candidate,
                sdpMid: signal.sdpMid,
                sdpMLineIndex: signal.sdpMLineIndex
            });
            
            await peerConnection.addIceCandidate(candidate);
            console.log('Added ICE candidate');
        }
    } catch (error) {
        console.error('Error adding ICE candidate:', error);
    }
}

/**
 * Handle ERROR message
 */
function handleError(signal) {
    console.error('Server error:', signal.error);
    showStatus('Error: ' + signal.error);
}

/**
 * Create RTCPeerConnection
 */
function createPeerConnection() {
    peerConnection = new RTCPeerConnection(rtcConfig);

    // Add local tracks to connection
    if (localStream) {
        localStream.getTracks().forEach(track => {
            const sender = peerConnection.addTrack(track, localStream);
            console.log('Added local track:', track.kind, 'with sender:', sender ? 'yes' : 'no');
        });
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            console.log('Sending ICE candidate:', event.candidate.type);
            sendSignal({
                type: 'ICE',
                candidate: event.candidate.candidate,
                sdpMid: event.candidate.sdpMid,
                sdpMLineIndex: event.candidate.sdpMLineIndex
            });
        } else {
            console.log('ICE gathering complete');
        }
    };

    // Handle ICE connection state
    peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', peerConnection.iceConnectionState);
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState);

        switch (peerConnection.connectionState) {
            case 'connected':
                showStatus('Connected to peer');
                updateRemoteStatus('Connected', 'connected');
                break;
            case 'disconnected':
            case 'failed':
                showStatus('Connection lost');
                updateRemoteStatus('Disconnected', 'disconnected');
                break;
            case 'closed':
                showStatus('Call ended');
                break;
            case 'connecting':
                showStatus('Connecting...');
                updateRemoteStatus('Connecting...', 'connecting');
                break;
        }
    };

    // Handle incoming tracks (remote video/audio)
    peerConnection.ontrack = (event) => {
        console.log('Received remote track:', event.track.kind, 'Stream count:', event.streams ? event.streams.length : 0);

        if (event.streams && event.streams[0]) {
            remoteStream = event.streams[0];

            const remoteVideo = document.getElementById('remoteVideo');
            if (remoteVideo) {
                remoteVideo.srcObject = remoteStream;
                // Ensure remote video plays
                remoteVideo.play().catch(err => console.warn('Remote video auto-play prevented:', err));
                console.log('Remote stream attached to video element');
            } else {
                console.warn('Remote video element not found');
            }
        } else {
            console.warn('No streams in remote track event');
        }
    };

    console.log('Peer connection created successfully');
}

/**
 * Wait for ICE gathering to complete
 */
function waitForIceGathering() {
    return new Promise((resolve) => {
        if (!peerConnection) {
            resolve();
            return;
        }

        if (peerConnection.iceGatheringState === 'complete') {
            resolve();
            return;
        }

        const checkState = () => {
            if (peerConnection.iceGatheringState === 'complete') {
                peerConnection.removeEventListener('icegatheringstatechange', checkState);
                resolve();
            }
        };

        peerConnection.addEventListener('icegatheringstatechange', checkState);

        // Timeout after 3 seconds (increased from 1 second for slower connections)
        setTimeout(() => {
            console.log('ICE gathering timeout - proceeding anyway');
            resolve();
        }, 3000);
    });
}

/**
 * Send signaling message
 */
function sendSignal(message) {
    if (stompClient && stompClient.connected) {
        const roomId = message.appointmentId || window.CALL_CONFIG?.appointmentId || window.CALL_CONFIG?.requestId;
        const destination = isRequestCall ? `/app/video-call/${roomId}` : `/app/call/${roomId}`;
        stompClient.send(destination, {}, JSON.stringify(message));
    }
}

/**
 * Close peer connection
 */
function closePeerConnection() {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
}

/**
 * Hang up - end the call
 */
function hangup() {
    showStatus('Ending call...');

    // Send LEAVE message
    sendSignal({
        type: 'LEAVE',
        appointmentId: (window.CALL_CONFIG?.appointmentId || window.CALL_CONFIG?.requestId)?.toString()
    });

    // Close peer connection
    closePeerConnection();

    // Stop local stream
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }

    // Close screen share if active
    if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
        screenStream = null;
    }

    // Disconnect from signaling server
    if (stompClient) {
        stompClient.disconnect(() => {
            console.log('Disconnected from signaling server');
        });
        stompClient = null;
    }

    // Clear video elements
    const localVideo = document.getElementById('localVideo');
    const remoteVideo = document.getElementById('remoteVideo');
    if (localVideo) localVideo.srcObject = null;
    if (remoteVideo) remoteVideo.srcObject = null;
    
    showStatus('Call ended');
    
    // Redirect back
    setTimeout(() => {
        if (window.CALL_CONFIG?.returnUrl) {
            window.location.href = window.CALL_CONFIG.returnUrl;
        }
    }, 1500);
}

/**
 * Toggle audio mute/unmute
 */
function toggleMute() {
    if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
            isAudioEnabled = !isAudioEnabled;
            audioTrack.enabled = isAudioEnabled;
            
            const btn = document.getElementById('muteBtn');
            if (btn) {
                const icon = btn.querySelector('i');
                const label = btn.querySelector('.btn-label');
                
                if (isAudioEnabled) {
                    icon.className = 'fas fa-microphone';
                    label.textContent = 'Mute';
                    btn.classList.remove('active');
                } else {
                    icon.className = 'fas fa-microphone-slash';
                    label.textContent = 'Unmute';
                    btn.classList.add('active');
                }
            }
            
            showStatus(isAudioEnabled ? 'Unmuted' : 'Muted');
        }
    }
}

/**
 * Toggle camera on/off
 */
function toggleCamera() {
    if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
            isVideoEnabled = !isVideoEnabled;
            videoTrack.enabled = isVideoEnabled;
            
            const btn = document.getElementById('cameraBtn');
            if (btn) {
                const icon = btn.querySelector('i');
                const label = btn.querySelector('.btn-label');
                
                if (isVideoEnabled) {
                    icon.className = 'fas fa-video';
                    label.textContent = 'Camera';
                    btn.classList.remove('active');
                } else {
                    icon.className = 'fas fa-video-slash';
                    label.textContent = 'Camera';
                    btn.classList.add('active');
                }
            }
            
            showStatus(isVideoEnabled ? 'Camera on' : 'Camera off');
        }
    }
}

/**
 * Toggle screen sharing
 */
async function toggleScreenShare() {
    try {
        if (!isScreenSharing) {
            // Start screen sharing
            screenStream = await navigator.mediaDevices.getDisplayMedia(screenConstraints);
            
            const screenTrack = screenStream.getVideoTracks()[0];
            
            // Replace video track in peer connection
            if (peerConnection && localStream) {
                const sender = peerConnection.getSenders().find(s => 
                    s.track && s.track.kind === 'video'
                );
                
                if (sender) {
                    await sender.replaceTrack(screenTrack);
                }
            }
            
            // Replace local video preview
            const localVideo = document.getElementById('localVideo');
            if (localVideo) {
                localVideo.srcObject = screenStream;
            }
            
            isScreenSharing = true;
            
            const btn = document.getElementById('screenShareBtn');
            if (btn) {
                btn.classList.add('active');
            }
            
            showStatus('Screen sharing started');
            
            // Handle user stopping screen share via browser UI
            screenTrack.onended = () => {
                toggleScreenShare();
            };
            
        } else {
            // Stop screen sharing, return to camera
            if (localStream) {
                const videoTrack = localStream.getVideoTracks()[0];
                
                if (peerConnection) {
                    const sender = peerConnection.getSenders().find(s => 
                        s.track && s.track.kind === 'video'
                    );
                    
                    if (sender) {
                        await sender.replaceTrack(videoTrack);
                    }
                }
                
                const localVideo = document.getElementById('localVideo');
                if (localVideo) {
                    localVideo.srcObject = localStream;
                }
            }
            
            if (screenStream) {
                screenStream.getTracks().forEach(track => track.stop());
                screenStream = null;
            }
            
            isScreenSharing = false;
            
            const btn = document.getElementById('screenShareBtn');
            if (btn) {
                btn.classList.remove('active');
            }
            
            showStatus('Screen sharing stopped');
        }
    } catch (error) {
        console.error('Screen share error:', error);
        showStatus('Screen share failed: ' + error.message);
    }
}

/**
 * Show status message
 */
function showStatus(message) {
    const statusEl = document.getElementById('statusMessage');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.style.display = 'block';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            statusEl.style.display = 'none';
        }, 3000);
    }
}

/**
 * Update remote video status indicator
 */
function updateRemoteStatus(text, state) {
    const statusEl = document.getElementById('remoteStatus');
    if (statusEl) {
        const indicator = statusEl.querySelector('.status-indicator');
        const textEl = statusEl.querySelector('.status-text');
        
        if (textEl) textEl.textContent = text;
        
        // Update indicator color based on state
        indicator.className = 'status-indicator';
        if (state === 'connected') {
            indicator.classList.add('connected');
        } else if (state === 'connecting') {
            indicator.classList.add('connecting');
        } else if (state === 'error') {
            indicator.classList.add('error');
        } else if (state === 'disconnected') {
            indicator.classList.add('disconnected');
        }
    }
}

// Make functions globally available
window.initializeCall = initializeCall;
window.hangup = hangup;
window.toggleMute = toggleMute;
window.toggleCamera = toggleCamera;
window.toggleScreenShare = toggleScreenShare;
window.showStatus = showStatus;

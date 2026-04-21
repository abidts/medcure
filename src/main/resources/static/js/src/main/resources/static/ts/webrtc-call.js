"use strict";
/**
 * WebRTC Video Call Handler
 *
 * Implements peer-to-peer video calling using WebRTC with Spring WebSocket (STOMP) signaling.
 * Uses free Google STUN servers for NAT traversal.
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
let isRequestCall = false;
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
        displaySurface: 'monitor'
    },
    audio: false
};
/**
 * Initialize the video call
 */
async function initializeCall(config) {
    const { appointmentId, requestId, username, returnUrl } = config;
    isRequestCall = requestId != null;
    try {
        showStatus('Connecting to call server...');
        updateRemoteStatus('Connecting...', 'connecting');
        await connectToSignalingServer(appointmentId || requestId || 0, username || '', isRequestCall);
        await getLocalMedia();
        showStatus('Connected. Waiting for peer...');
    }
    catch (error) {
        console.error('Error initializing call:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        showStatus('Error: ' + errorMessage);
        updateRemoteStatus('Connection failed', 'error');
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
function connectToSignalingServer(roomId, username, isRequest) {
    return new Promise((resolve, reject) => {
        try {
            const socket = new SockJS('/ws');
            stompClient = Stomp.over(socket);
            stompClient.debug = null;
            stompClient.connect({}, () => {
                console.log('Connected to signaling server');
                const topic = isRequest ? `/topic/video-call/${roomId}` : `/topic/call/${roomId}`;
                stompClient?.subscribe(topic, (message) => {
                    onSignalingMessage(message, roomId, username, isRequest);
                });
                sendSignal({
                    type: 'JOIN',
                    appointmentId: roomId.toString()
                });
                resolve();
            }, (error) => {
                console.error('WebSocket connection failed:', error);
                reject(new Error('Failed to connect to call server'));
            });
        }
        catch (error) {
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
        const localVideo = document.getElementById('localVideo');
        if (localVideo) {
            localVideo.srcObject = stream;
            localVideo.play().catch(err => console.warn('Auto-play prevented:', err));
        }
        console.log('Local media obtained successfully');
        return stream;
    }
    catch (error) {
        console.error('Error getting local media (primary constraints):', error);
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
        }
        catch (fallbackError) {
            console.error('Error getting local media (fallback):', fallbackError);
            const primaryError = error instanceof Error ? error : new Error('Unknown error');
            const fallbackErr = fallbackError instanceof Error ? fallbackError : new Error('Unknown error');
            if (primaryError.name === 'NotAllowedError' || fallbackErr.name === 'NotAllowedError') {
                throw new Error('Camera/microphone access denied. Please allow access in your browser settings and refresh.');
            }
            else if (primaryError.name === 'NotFoundError' || fallbackErr.name === 'NotFoundError') {
                throw new Error('No camera or microphone found on this device.');
            }
            else if (primaryError.name === 'NotReadableError' || fallbackErr.name === 'NotReadableError') {
                throw new Error('Camera/microphone is already in use by another application. Please close other apps using the camera.');
            }
            else if (primaryError.name === 'OverconstrainedError') {
                throw new Error('Camera does not support the requested resolution. Try a different camera.');
            }
            else {
                throw new Error('Failed to access camera/microphone: ' + (fallbackErr.message || primaryError.message));
            }
        }
    }
}
/**
 * Handle incoming signaling message
 */
function onSignalingMessage(message, roomId, username, isRequest) {
    const signal = JSON.parse(message.body);
    console.log('Received signaling message:', signal.type);
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
function handleJoinAck(signal) {
    isInitiator = signal.initiator === true;
    console.log('Joined as', isInitiator ? 'initiator' : 'non-initiator');
    if (isInitiator) {
        showStatus('Waiting for peer to join...');
        updateRemoteStatus('Waiting for peer...', 'waiting');
    }
}
async function handlePeerJoined(signal) {
    console.log('Peer joined:', signal.from);
    showStatus('Peer joined. Connecting...');
    updateRemoteStatus('Peer joined', 'connected');
    if (isInitiator) {
        await createAndSendOffer();
    }
}
function handlePeerLeft() {
    console.log('Peer left');
    showStatus('Peer has left the call');
    updateRemoteStatus('Peer left', 'disconnected');
    closePeerConnection();
}
async function createAndSendOffer() {
    try {
        if (!peerConnection) {
            createPeerConnection();
        }
        if (!peerConnection)
            return;
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        console.log('Created and set local offer');
        await waitForIceGathering();
        sendSignal({
            type: 'OFFER',
            payload: peerConnection.localDescription?.sdp
        });
        console.log('Sent offer to peer');
    }
    catch (error) {
        console.error('Error creating offer:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        showStatus('Error creating offer: ' + errorMessage);
    }
}
async function handleOffer(signal) {
    try {
        console.log('Received offer');
        if (!peerConnection) {
            createPeerConnection();
        }
        if (!peerConnection)
            return;
        await peerConnection.setRemoteDescription(new RTCSessionDescription({
            type: 'offer',
            sdp: signal.payload
        }));
        console.log('Set remote description (offer)');
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        console.log('Created and set local answer');
        await waitForIceGathering();
        sendSignal({
            type: 'ANSWER',
            payload: peerConnection.localDescription?.sdp
        });
        console.log('Sent answer to peer');
    }
    catch (error) {
        console.error('Error handling offer:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        showStatus('Error: ' + errorMessage);
    }
}
async function handleAnswer(signal) {
    try {
        console.log('Received answer');
        if (!peerConnection)
            return;
        await peerConnection.setRemoteDescription(new RTCSessionDescription({
            type: 'answer',
            sdp: signal.payload
        }));
        console.log('Set remote description (answer)');
    }
    catch (error) {
        console.error('Error handling answer:', error);
    }
}
async function handleIceCandidate(signal) {
    try {
        if (signal.candidate && peerConnection) {
            const candidate = {
                candidate: signal.candidate,
                sdpMid: signal.sdpMid,
                sdpMLineIndex: signal.sdpMLineIndex
            };
            await peerConnection.addIceCandidate(candidate);
            console.log('Added ICE candidate');
        }
    }
    catch (error) {
        console.error('Error adding ICE candidate:', error);
    }
}
function handleError(signal) {
    console.error('Server error:', signal.error);
    showStatus('Error: ' + (signal.error || 'Unknown error'));
}
function createPeerConnection() {
    peerConnection = new RTCPeerConnection(rtcConfig);
    if (localStream) {
        localStream.getTracks().forEach(track => {
            const sender = peerConnection?.addTrack(track, localStream);
            console.log('Added local track:', track.kind, 'with sender:', sender ? 'yes' : 'no');
        });
    }
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            console.log('Sending ICE candidate:', event.candidate.type);
            sendSignal({
                type: 'ICE',
                candidate: event.candidate.candidate,
                sdpMid: event.candidate.sdpMid,
                sdpMLineIndex: event.candidate.sdpMLineIndex
            });
        }
        else {
            console.log('ICE gathering complete');
        }
    };
    peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', peerConnection?.iceConnectionState);
    };
    peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection?.connectionState);
        switch (peerConnection?.connectionState) {
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
    peerConnection.ontrack = (event) => {
        console.log('Received remote track:', event.track.kind, 'Stream count:', event.streams ? event.streams.length : 0);
        if (event.streams && event.streams[0]) {
            remoteStream = event.streams[0];
            const remoteVideo = document.getElementById('remoteVideo');
            if (remoteVideo) {
                remoteVideo.srcObject = remoteStream;
                remoteVideo.play().catch(err => console.warn('Remote video auto-play prevented:', err));
                console.log('Remote stream attached to video element');
            }
            else {
                console.warn('Remote video element not found');
            }
        }
        else {
            console.warn('No streams in remote track event');
        }
    };
    console.log('Peer connection created successfully');
}
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
            if (!peerConnection)
                return;
            if (peerConnection.iceGatheringState === 'complete') {
                peerConnection.removeEventListener('icegatheringstatechange', checkState);
                resolve();
            }
        };
        peerConnection.addEventListener('icegatheringstatechange', checkState);
        setTimeout(() => {
            console.log('ICE gathering timeout - proceeding anyway');
            resolve();
        }, 3000);
    });
}
function sendSignal(message) {
    if (stompClient && stompClient.connected) {
        const roomId = message.appointmentId || window.CALL_CONFIG?.appointmentId || window.CALL_CONFIG?.requestId;
        const destination = isRequestCall ? `/app/video-call/${roomId}` : `/app/call/${roomId}`;
        stompClient.send(destination, {}, JSON.stringify(message));
    }
}
function closePeerConnection() {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
}
function hangup() {
    showStatus('Ending call...');
    sendSignal({
        type: 'LEAVE',
        appointmentId: (window.CALL_CONFIG?.appointmentId || window.CALL_CONFIG?.requestId)?.toString()
    });
    closePeerConnection();
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
        screenStream = null;
    }
    if (stompClient) {
        stompClient.disconnect(() => {
            console.log('Disconnected from signaling server');
        });
        stompClient = null;
    }
    const localVideo = document.getElementById('localVideo');
    const remoteVideo = document.getElementById('remoteVideo');
    if (localVideo)
        localVideo.srcObject = null;
    if (remoteVideo)
        remoteVideo.srcObject = null;
    showStatus('Call ended');
    setTimeout(() => {
        if (window.CALL_CONFIG?.returnUrl) {
            window.location.href = window.CALL_CONFIG.returnUrl;
        }
    }, 1500);
}
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
                    if (icon)
                        icon.className = 'fas fa-microphone';
                    if (label)
                        label.textContent = 'Mute';
                    btn.classList.remove('active');
                }
                else {
                    if (icon)
                        icon.className = 'fas fa-microphone-slash';
                    if (label)
                        label.textContent = 'Unmute';
                    btn.classList.add('active');
                }
            }
            showStatus(isAudioEnabled ? 'Unmuted' : 'Muted');
        }
    }
}
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
                    if (icon)
                        icon.className = 'fas fa-video';
                    if (label)
                        label.textContent = 'Camera';
                    btn.classList.remove('active');
                }
                else {
                    if (icon)
                        icon.className = 'fas fa-video-slash';
                    if (label)
                        label.textContent = 'Camera';
                    btn.classList.add('active');
                }
            }
            showStatus(isVideoEnabled ? 'Camera on' : 'Camera off');
        }
    }
}
async function toggleScreenShare() {
    try {
        if (!isScreenSharing) {
            screenStream = await navigator.mediaDevices.getDisplayMedia(screenConstraints);
            const screenTrack = screenStream.getVideoTracks()[0];
            if (peerConnection && localStream) {
                const sender = peerConnection.getSenders().find(s => s.track && s.track.kind === 'video');
                if (sender) {
                    await sender.replaceTrack(screenTrack);
                }
            }
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
            screenTrack.onended = () => {
                toggleScreenShare();
            };
        }
        else {
            if (localStream) {
                const videoTrack = localStream.getVideoTracks()[0];
                if (peerConnection) {
                    const sender = peerConnection.getSenders().find(s => s.track && s.track.kind === 'video');
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
    }
    catch (error) {
        console.error('Screen share error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        showStatus('Screen share failed: ' + errorMessage);
    }
}
function showStatus(message) {
    const statusEl = document.getElementById('statusMessage');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.style.display = 'block';
        setTimeout(() => {
            statusEl.style.display = 'none';
        }, 3000);
    }
}
function updateRemoteStatus(text, state) {
    const statusEl = document.getElementById('remoteStatus');
    if (statusEl) {
        const indicator = statusEl.querySelector('.status-indicator');
        const textEl = statusEl.querySelector('.status-text');
        if (textEl)
            textEl.textContent = text;
        if (indicator) {
            indicator.className = 'status-indicator';
            if (state === 'connected') {
                indicator.classList.add('connected');
            }
            else if (state === 'connecting') {
                indicator.classList.add('connecting');
            }
            else if (state === 'error') {
                indicator.classList.add('error');
            }
            else if (state === 'disconnected') {
                indicator.classList.add('disconnected');
            }
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
//# sourceMappingURL=webrtc-call.js.map
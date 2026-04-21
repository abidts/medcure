import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Monitor, ChevronLeft, Signal, AlertCircle } from 'lucide-react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
const VideoCall = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const requestId = searchParams.get('requestId');
    const navigate = useNavigate();
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnection = useRef(null);
    const stompClient = useRef(null);
    const localStream = useRef(null);
    const [callStatus, setCallStatus] = useState('Connecting...');
    const [remoteStatus, setRemoteStatus] = useState('Waiting for peer...');
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [showWaiting, setShowWaiting] = useState(false);
    const [error, setError] = useState(null);
    const isInitiator = useRef(false);
    useEffect(() => {
        startCall();
        return () => cleanup();
    }, []);
    const rtcConfig = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ]
    };
    const startCall = async () => {
        try {
            // 1. Get Local Media
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: { width: 1280, height: 720 }
            });
            localStream.current = stream;
            if (localVideoRef.current)
                localVideoRef.current.srcObject = stream;
            // 2. Connect to Signaling
            const socket = new SockJS('/ws');
            const client = Stomp.over(socket);
            client.debug = () => { }; // Disable logs
            stompClient.current = client;
            const roomId = id || requestId || '0';
            const topic = requestId ? `/topic/video-call/${roomId}` : `/topic/call/${roomId}`;
            client.connect({}, () => {
                client.subscribe(topic, (message) => {
                    handleSignalingMessage(JSON.parse(message.body));
                });
                // Join the room
                client.send(requestId ? `/app/video-call/${roomId}` : `/app/call/${roomId}`, {}, JSON.stringify({
                    type: 'JOIN',
                    appointmentId: roomId
                }));
            }, (err) => {
                setError('Failed to connect to signaling server.');
            });
        }
        catch (err) {
            console.error(err);
            setError(err.name === 'NotAllowedError' ? 'Camera access denied.' : 'Video call failed to start.');
        }
    };
    const cleanup = () => {
        if (localStream.current) {
            localStream.current.getTracks().forEach(track => track.stop());
        }
        if (peerConnection.current) {
            peerConnection.current.close();
        }
        if (stompClient.current) {
            stompClient.current.disconnect(() => { });
        }
    };
    const handleSignalingMessage = async (signal) => {
        // Basic signaling logic (Offer/Answer/Ice)
        switch (signal.type) {
            case 'JOIN_ACK':
                isInitiator.current = signal.initiator;
                break;
            case 'PEER_JOINED':
                setRemoteStatus('Peer joined');
                if (isInitiator.current)
                    createOffer();
                break;
            case 'OFFER':
                handleOffer(signal.payload);
                break;
            case 'ANSWER':
                handleAnswer(signal.payload);
                break;
            case 'ICE':
                handleIceCandidate(signal);
                break;
            case 'LEAVE':
                setRemoteStatus('Peer left');
                cleanup();
                break;
        }
    };
    const setupPeerConnection = () => {
        const pc = new RTCPeerConnection(rtcConfig);
        peerConnection.current = pc;
        if (localStream.current) {
            localStream.current.getTracks().forEach(track => {
                pc.addTrack(track, localStream.current);
            });
        }
        pc.ontrack = (event) => {
            if (remoteVideoRef.current && event.streams[0]) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };
        pc.onicecandidate = (event) => {
            if (event.candidate && stompClient.current) {
                const roomId = id || requestId || '0';
                stompClient.current.send(requestId ? `/app/video-call/${roomId}` : `/app/call/${roomId}`, {}, JSON.stringify({
                    type: 'ICE',
                    candidate: event.candidate.candidate,
                    sdpMid: event.candidate.sdpMid,
                    sdpMLineIndex: event.candidate.sdpMLineIndex
                }));
            }
        };
        pc.onconnectionstatechange = () => {
            if (pc.connectionState === 'connected') {
                setCallStatus('Connected');
                setRemoteStatus('Live');
            }
        };
        return pc;
    };
    const createOffer = async () => {
        const pc = setupPeerConnection();
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        const roomId = id || requestId || '0';
        stompClient.current?.send(requestId ? `/app/video-call/${roomId}` : `/app/call/${roomId}`, {}, JSON.stringify({
            type: 'OFFER',
            payload: offer.sdp
        }));
    };
    const handleOffer = async (sdp) => {
        const pc = setupPeerConnection();
        await pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp }));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        const roomId = id || requestId || '0';
        stompClient.current?.send(requestId ? `/app/video-call/${roomId}` : `/app/call/${roomId}`, {}, JSON.stringify({
            type: 'ANSWER',
            payload: answer.sdp
        }));
    };
    const handleAnswer = async (sdp) => {
        if (peerConnection.current) {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp }));
        }
    };
    const handleIceCandidate = async (signal) => {
        if (peerConnection.current && signal.candidate) {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate({
                candidate: signal.candidate,
                sdpMid: signal.sdpMid,
                sdpMLineIndex: signal.sdpMLineIndex
            }));
        }
    };
    const toggleMute = () => {
        if (localStream.current) {
            const audioTrack = localStream.current.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsAudioMuted(!audioTrack.enabled);
        }
    };
    const toggleVideo = () => {
        if (localStream.current) {
            const videoTrack = localStream.current.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsVideoOff(!videoTrack.enabled);
        }
    };
    const hangup = () => {
        const roomId = id || requestId || '0';
        stompClient.current?.send(requestId ? `/app/video-call/${roomId}` : `/app/call/${roomId}`, {}, JSON.stringify({
            type: 'LEAVE',
            appointmentId: roomId
        }));
        cleanup();
        navigate(-1);
    };
    return (_jsxs("div", { className: "fixed inset-0 bg-slate-950 flex flex-col font-inter overflow-hidden", children: [_jsxs("header", { className: "p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: () => navigate(-1), className: "p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all", children: _jsx(ChevronLeft, { size: 20 }) }), _jsxs("div", { children: [_jsxs("h2", { className: "text-white font-bold text-lg flex items-center gap-2", children: [_jsx("span", { className: "w-2 h-2 bg-red-500 rounded-full animate-pulse" }), "Video Consultation"] }), _jsxs("p", { className: "text-white/50 text-xs", children: ["Room ID: ", id || requestId] })] })] }), _jsxs("div", { className: "bg-white/10 px-4 py-2 rounded-2xl border border-white/10 text-white/80 text-xs font-bold flex items-center gap-2", children: [_jsx(Signal, { size: 14, className: "text-green-500" }), " Secure Connection"] })] }), _jsxs("div", { className: "flex-1 relative p-6 flex items-center justify-center", children: [_jsxs("div", { className: "w-full h-full rounded-[40px] overflow-hidden bg-slate-900 border border-white/5 relative group", children: [_jsx("video", { ref: remoteVideoRef, autoPlay: true, playsInline: true, className: "w-full h-full object-cover" }), _jsx("div", { className: "absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold", children: "D" }), _jsxs("div", { children: [_jsx("p", { className: "text-white font-bold", children: "Consulting Doctor" }), _jsx("p", { className: "text-white/50 text-xs uppercase tracking-widest font-black", children: remoteStatus })] })] }) }), remoteStatus === 'Waiting for peer...' && (_jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center text-center p-12", children: [_jsxs("div", { className: "w-24 h-24 rounded-full bg-blue-600/20 flex items-center justify-center mb-8 relative", children: [_jsx("div", { className: "absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" }), _jsx(Video, { className: "text-blue-600", size: 32 })] }), _jsx("h3", { className: "text-2xl font-bold text-white mb-2 font-outfit", children: "Waiting for peer..." }), _jsx("p", { className: "text-slate-400 max-w-xs", children: "The connection is ready. Please wait for the other participant to join." })] }))] }), _jsxs(motion.div, { drag: true, dragConstraints: { left: -100, right: 100, top: -100, bottom: 100 }, className: "absolute bottom-12 right-12 w-48 h-64 md:w-64 md:h-80 bg-slate-800 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl z-20", children: [_jsx("video", { ref: localVideoRef, autoPlay: true, playsInline: true, muted: true, className: `w-full h-full object-cover ${isVideoOff ? 'hidden' : 'block'}`, style: { transform: 'scaleX(-1)' } }), isVideoOff && (_jsx("div", { className: "w-full h-full flex items-center justify-center bg-slate-800 text-slate-500", children: _jsx(VideoOff, { size: 40 }) })), _jsxs("div", { className: "absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-md", children: ["You ", isAudioMuted && '(Muted)'] })] })] }), _jsxs("footer", { className: "p-10 flex justify-center items-center gap-6 z-10 bg-gradient-to-t from-black/50 to-transparent", children: [_jsx("button", { onClick: toggleMute, className: `w-16 h-16 rounded-[24px] flex items-center justify-center transition-all ${isAudioMuted ? 'bg-red-500 text-white shadow-lg shadow-red-900/40' : 'bg-white/10 text-white hover:bg-white/20'}`, children: isAudioMuted ? _jsx(MicOff, { size: 24 }) : _jsx(Mic, { size: 24 }) }), _jsx("button", { onClick: toggleVideo, className: `w-16 h-16 rounded-[24px] flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500 text-white shadow-lg shadow-red-900/40' : 'bg-white/10 text-white hover:bg-white/20'}`, children: isVideoOff ? _jsx(VideoOff, { size: 24 }) : _jsx(Video, { size: 24 }) }), _jsx("button", { onClick: () => setIsScreenSharing(!isScreenSharing), className: `w-16 h-16 rounded-[24px] flex items-center justify-center transition-all ${isScreenSharing ? 'bg-blue-500 text-white shadow-lg shadow-blue-900/40' : 'bg-white/10 text-white hover:bg-white/20'}`, children: _jsx(Monitor, { size: 24 }) }), _jsx("button", { onClick: hangup, className: "w-20 h-16 bg-red-600 text-white rounded-[24px] flex items-center justify-center shadow-xl shadow-red-900/60 hover:bg-red-700 transition-all ml-10", children: _jsx(PhoneOff, { size: 28 }) })] }), error && (_jsxs("div", { className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-10 rounded-[40px] shadow-2xl z-[100] text-center max-w-sm", children: [_jsx("div", { className: "w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6", children: _jsx(AlertCircle, { size: 32 }) }), _jsx("h3", { className: "text-xl font-bold text-slate-900 mb-2", children: "Something went wrong" }), _jsx("p", { className: "text-slate-500 mb-8", children: error }), _jsx("button", { onClick: () => window.location.reload(), className: "w-full py-4 bg-slate-900 text-white rounded-2xl font-bold", children: "Try Again" })] }))] }));
};
export default VideoCall;
//# sourceMappingURL=VideoCall.js.map
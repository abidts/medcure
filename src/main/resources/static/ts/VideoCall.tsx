import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, Monitor, 
  ChevronLeft, Loader2, Signal, AlertCircle, Clock
} from 'lucide-react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const VideoCall: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('requestId');
  const navigate = useNavigate();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const stompClient = useRef<Stomp.Client | null>(null);
  const localStream = useRef<MediaStream | null>(null);

  const [callStatus, setCallStatus] = useState('Connecting...');
  const [remoteStatus, setRemoteStatus] = useState('Waiting for peer...');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showWaiting, setShowWaiting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      // 2. Connect to Signaling
      const socket = new SockJS('/ws');
      const client = Stomp.over(socket);
      client.debug = () => {}; // Disable logs
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

    } catch (err: any) {
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
      stompClient.current.disconnect(() => {});
    }
  };

  const handleSignalingMessage = async (signal: any) => {
    // Basic signaling logic (Offer/Answer/Ice)
    switch (signal.type) {
      case 'JOIN_ACK':
        isInitiator.current = signal.initiator;
        break;
      case 'PEER_JOINED':
        setRemoteStatus('Peer joined');
        if (isInitiator.current) createOffer();
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
        pc.addTrack(track, localStream.current!);
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

  const handleOffer = async (sdp: string) => {
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

  const handleAnswer = async (sdp: string) => {
    if (peerConnection.current) {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp }));
    }
  };

  const handleIceCandidate = async (signal: any) => {
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

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col font-inter overflow-hidden">
      {/* Header */}
      <header className="p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
         <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all">
               <ChevronLeft size={20} />
            </button>
            <div>
               <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  Video Consultation
               </h2>
               <p className="text-white/50 text-xs">Room ID: {id || requestId}</p>
            </div>
         </div>
         <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/10 text-white/80 text-xs font-bold flex items-center gap-2">
            <Signal size={14} className="text-green-500" /> Secure Connection
         </div>
      </header>

      {/* Main Viewport */}
      <div className="flex-1 relative p-6 flex items-center justify-center">
         {/* Remote Video - Big */}
         <div className="w-full h-full rounded-[40px] overflow-hidden bg-slate-900 border border-white/5 relative group">
            <video 
               ref={remoteVideoRef} 
               autoPlay 
               playsInline 
               className="w-full h-full object-cover"
            />
            
            {/* Overlay Info */}
            <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold">D</div>
                  <div>
                     <p className="text-white font-bold">Consulting Doctor</p>
                     <p className="text-white/50 text-xs uppercase tracking-widest font-black">{remoteStatus}</p>
                  </div>
               </div>
            </div>

            {remoteStatus === 'Waiting for peer...' && (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                  <div className="w-24 h-24 rounded-full bg-blue-600/20 flex items-center justify-center mb-8 relative">
                     <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                     <Video className="text-blue-600" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 font-outfit">Waiting for peer...</h3>
                  <p className="text-slate-400 max-w-xs">The connection is ready. Please wait for the other participant to join.</p>
               </div>
            )}
         </div>

         {/* Local Video - Floating */}
         <motion.div 
           drag
           dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
           className="absolute bottom-12 right-12 w-48 h-64 md:w-64 md:h-80 bg-slate-800 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl z-20"
         >
            <video 
               ref={localVideoRef} 
               autoPlay 
               playsInline 
               muted 
               className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : 'block'}`}
               style={{ transform: 'scaleX(-1)' }}
            />
            {isVideoOff && (
              <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                <VideoOff size={40} />
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
               You {isAudioMuted && '(Muted)'}
            </div>
         </motion.div>
      </div>

      {/* Control Bar */}
      <footer className="p-10 flex justify-center items-center gap-6 z-10 bg-gradient-to-t from-black/50 to-transparent">
         <button 
           onClick={toggleMute}
           className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all ${isAudioMuted ? 'bg-red-500 text-white shadow-lg shadow-red-900/40' : 'bg-white/10 text-white hover:bg-white/20'}`}
         >
            {isAudioMuted ? <MicOff size={24} /> : <Mic size={24} />}
         </button>

         <button 
           onClick={toggleVideo}
           className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500 text-white shadow-lg shadow-red-900/40' : 'bg-white/10 text-white hover:bg-white/20'}`}
         >
            {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
         </button>

         <button 
           onClick={() => setIsScreenSharing(!isScreenSharing)}
           className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all ${isScreenSharing ? 'bg-blue-500 text-white shadow-lg shadow-blue-900/40' : 'bg-white/10 text-white hover:bg-white/20'}`}
         >
            <Monitor size={24} />
         </button>

         <button 
            onClick={hangup}
            className="w-20 h-16 bg-red-600 text-white rounded-[24px] flex items-center justify-center shadow-xl shadow-red-900/60 hover:bg-red-700 transition-all ml-10"
         >
            <PhoneOff size={28} />
         </button>
      </footer>

      {error && (
         <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-10 rounded-[40px] shadow-2xl z-[100] text-center max-w-sm">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
               <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h3>
            <p className="text-slate-500 mb-8">{error}</p>
            <button onClick={() => window.location.reload()} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold">Try Again</button>
         </div>
      )}
    </div>
  );
};

export default VideoCall;

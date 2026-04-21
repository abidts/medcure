/**
 * Global Type Declarations for Sehat24x7
 */

// SockJS type declarations
declare class SockJS {
    constructor(url: string);
    onopen: (() => void) | null;
    onclose: (() => void) | null;
    onmessage: ((event: MessageEvent) => void) | null;
    send(data: string): void;
    close(): void;
    readyState: number;
    OPEN: number;
}

// StompJS type declarations
interface StompClient {
    connect(headers: Record<string, string>, callback: () => void, errorCallback?: (error: any) => void): void;
    disconnect(callback: () => void): void;
    subscribe(destination: string, callback: (message: StompMessage) => void, headers?: Record<string, string>): void;
    send(destination: string, headers: Record<string, string>, body: string): void;
    connected: boolean;
    debug: ((...args: any[]) => void) | null;
}

interface StompMessage {
    body: string;
    destination: string;
    headers: Record<string, string>;
}

declare const Stomp: {
    over(socket: SockJS): StompClient;
};

// Geolocation API extensions
interface GeolocationCoordinates {
    latitude: number;
    longitude: number;
}

interface GeolocationPosition {
    coords: GeolocationCoordinates;
}

interface GeolocationPositionError {
    code: number;
    message: string;
    PERMISSION_DENIED: number;
    POSITION_UNAVAILABLE: number;
    TIMEOUT: number;
}

interface Geolocation {
    getCurrentPosition(
        successCallback: (position: GeolocationPosition) => void,
        errorCallback?: (error: GeolocationPositionError) => void,
        options?: PositionOptions
    ): void;
}

interface Navigator {
    geolocation: Geolocation;
    permissions: Permissions;
}

// Permissions API
interface Permissions {
    query(descriptor: PermissionDescriptor): Promise<PermissionStatus>;
}

interface PermissionDescriptor {
    name: string;
}

interface PermissionStatus {
    state: 'granted' | 'denied' | 'prompt';
}

// WebRTC types
interface RTCIceServer {
    urls: string | string[];
    username?: string;
    credential?: string;
}

interface RTCConfiguration {
    iceServers?: RTCIceServer[];
    iceCandidatePoolSize?: number;
}

interface MediaStreamConstraints {
    audio?: boolean | MediaTrackConstraints;
    video?: boolean | MediaTrackConstraints;
}

interface MediaTrackConstraints {
    width?: number | ConstrainLong;
    height?: number | ConstrainLong;
    facingMode?: string;
    echoCancellation?: boolean;
    noiseSuppression?: boolean;
    autoGainControl?: boolean;
}

interface ConstrainLong {
    min?: number;
    max?: number;
    ideal?: number;
}

interface RTCSessionDescriptionInit {
    type: RTCSdpType;
    sdp: string;
}

interface RTCIceCandidateInit {
    candidate: string;
    sdpMid: string | null;
    sdpMLineIndex: number | null;
}

interface RTCTrackEvent extends Event {
    receiver: RTCRtpReceiver;
    track: MediaStreamTrack;
    streams: MediaStream[];
}

interface RTCPeerConnection {
    onicecandidate: ((event: RTCPeerConnectionIceEvent) => void) | null;
    oniceconnectionstatechange: (() => void) | null;
    onconnectionstatechange: (() => void) | null;
    ontrack: ((event: RTCTrackEvent) => void) | null;
    addTrack(track: MediaStreamTrack, stream: MediaStream): RTCRtpSender;
    getSenders(): RTCRtpSender[];
    createOffer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit>;
    createAnswer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit>;
    setLocalDescription(description: RTCSessionDescriptionInit): Promise<void>;
    setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void>;
    addIceCandidate(candidate: RTCIceCandidateInit): Promise<void>;
    close(): void;
    iceGatheringState: string;
    iceConnectionState: string;
    connectionState: string;
    localDescription: RTCSessionDescriptionInit | null;
    remoteDescription: RTCSessionDescriptionInit | null;
    addEventListener(type: string, listener: EventListener): void;
    removeEventListener(type: string, listener: EventListener): void;
}

declare const RTCPeerConnection: {
    new(configuration?: RTCConfiguration): RTCPeerConnection;
};

declare const RTCSessionDescription: {
    new(init: RTCSessionDescriptionInit): RTCSessionDescriptionInit;
};

declare const RTCIceCandidate: {
    new(init: RTCIceCandidateInit): RTCIceCandidateInit;
};

// Display Media API
interface DisplayMediaStreamOptions {
    video?: boolean | MediaTrackConstraints;
    audio?: boolean | MediaTrackConstraints;
}

interface MediaDevices {
    getUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;
    getDisplayMedia(constraints?: DisplayMediaStreamOptions): Promise<MediaStream>;
}

interface Navigator {
    mediaDevices: MediaDevices;
}

// Session Storage
interface SessionStorage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
}

interface Window {
    sessionStorage: SessionStorage;
    localStorage: Storage;
    navigator: Navigator;
    CALL_CONFIG?: CallConfig;
    filterManager?: HomeFilterManager;
    searchManager?: SearchManager;
    locationManager?: LocationManager;
    announcementManager?: AnnouncementManager;
    initializeCall?: (config: CallConfig) => void;
    hangup?: () => void;
    toggleMute?: () => void;
    toggleCamera?: () => void;
    toggleScreenShare?: () => void;
    showStatus?: (message: string) => void;
    selectLocation?: (location: string) => void;
    selectSpecialization?: (spec: string) => void;
    useMyLocation?: () => void;
    quickSearch?: (specialization: string) => void;
    performSearch?: () => void;
    performSearchWithText?: (text: string) => void;
    toggleLocationGroup?: (division: string) => void;
    selectDistrict?: (district: string) => void;
    clearFilter?: () => void;
    filterBySpecialization?: () => void;
    searchByLocation?: () => void;
    resetLocationFilter?: () => void;
    logout?: () => void;
    toggleMobileMenu?: () => void;
}

// Call configuration interface
interface CallConfig {
    appointmentId?: number;
    requestId?: number;
    username?: string;
    returnUrl?: string;
}

// Doctor interface
interface Doctor {
    id: string;
    name: string;
    qualification: string;
    specialization: {
        id: number;
        name: string;
        description?: string;
    } | null;
    experience: string;
    fee: string;
    image: string | null;
    district: string;
    yearsOfExperience?: number;
    consultationFee?: number;
    area?: string;
    city?: string;
    distance?: number;
    element?: HTMLElement;
}

// Specialization interface
interface Specialization {
    id: number;
    name: string;
    description?: string;
    doctors?: any[];
}

// Announcement interface
interface Announcement {
    id: number;
    text: string;
    type: 'info' | 'success' | 'warning' | 'danger';
    displayDuration?: number;
    active: boolean;
}

// Location info
interface UserLocation {
    latitude: number;
    longitude: number;
}

// Online status
interface OnlineStatus {
    id: string;
    status: 'ONLINE' | 'BUSY' | 'OFFLINE';
    message?: string;
}

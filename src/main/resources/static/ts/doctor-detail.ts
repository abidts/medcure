/**
 * Doctor Detail Page Script
 * Handles video call functionality, wallet balance, and doctor status
 */

interface DoctorVideoRate {
    id: number;
    doctorId: number;
    ratePerMinute: number;
    minimumCharge: number;
    active: boolean;
}

interface WalletBalance {
    id: number;
    patientId: number;
    balance: number;
}

interface VideoCallRequest {
    id: number;
    patientId: number;
    doctorId: number;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

const doctorId = (window as any).DOCTOR_ID || 0;
let ddPatientId: string | null = null;
let doctorOnline = false;
let ratePerMinute = 10;
let minimumCharge = 100;
let walletBalance = 0;

async function checkDoctorStatus(): Promise<void> {
    try {
        const response = await fetch(`/api/video-call/doctor/${doctorId}/status`);
        const data = await response.json();

        doctorOnline = data.status === 'ONLINE';

        const videoCallBtn = document.getElementById('videoCallBtn');
        if (videoCallBtn) {
            const btnText = videoCallBtn.querySelector('.btn-text');
            
            if (doctorOnline) {
                videoCallBtn.classList.remove('disabled');
                videoCallBtn.setAttribute('onclick', 'openVideoCallModal()');
                if (btnText) btnText.textContent = 'Video Call';
            } else {
                videoCallBtn.classList.add('disabled');
                videoCallBtn.removeAttribute('onclick');
                if (btnText) btnText.textContent = 'Doctor Offline';
            }
        }

        if (ddPatientId) {
            await loadWalletBalance();
        }
    } catch (error) {
        console.error('Error checking doctor status:', error);
    }
}

async function loadVideoCallRate(): Promise<void> {
    try {
        const response = await fetch(`/api/video-call-rate/doctor/${doctorId}`);
        const data: DoctorVideoRate = await response.json();

        if (data && data.active) {
            ratePerMinute = data.ratePerMinute;
            minimumCharge = data.minimumCharge;
        }
    } catch (error) {
        console.error('Error loading video call rate:', error);
    }
}

async function loadWalletBalance(): Promise<void> {
    try {
        const response = await fetch(`/api/wallet/${ddPatientId}`);
        const data: WalletBalance = await response.json();

        if (data) {
            walletBalance = data.balance;
            
            const balanceDisplay = document.getElementById('walletBalanceDisplay');
            if (balanceDisplay) {
                balanceDisplay.textContent = `₹${walletBalance.toFixed(2)}`;
            }

            const sendBtn = document.querySelector('.btn-send-request') as HTMLButtonElement;
            if (sendBtn && walletBalance < minimumCharge) {
                sendBtn.disabled = true;
            }
        }
    } catch (error) {
        console.error('Error loading wallet balance:', error);
    }
}

function openVideoCallModal(): void {
    if (!ddPatientId) {
        alert('Please login as a patient to make a video call');
        window.location.href = '/login';
        return;
    }

    if (!doctorOnline) {
        alert('Doctor is currently offline. Please try again later.');
        return;
    }

    const modal = document.getElementById('videoCallModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeVideoCallModal(): void {
    const modal = document.getElementById('videoCallModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

async function sendVideoCallRequest(): Promise<void> {
    const reasonInput = document.getElementById('videoCallReason') as HTMLTextAreaElement;
    const reason = reasonInput?.value.trim() || '';

    if (!reason) {
        alert('Please provide a reason for the video call');
        return;
    }

    if (walletBalance < minimumCharge) {
        alert(`Insufficient wallet balance. Please add at least ₹${minimumCharge} to your wallet.`);
        return;
    }

    try {
        const response = await fetch(
            `/api/video-call/request?patientId=${ddPatientId}&doctorId=${doctorId}&reason=${encodeURIComponent(reason)}`,
            { method: 'POST' }
        );
        const data: VideoCallRequest = await response.json();

        if (data && data.id) {
            alert('Video call request sent! Waiting for doctor to accept...');
            closeVideoCallModal();
            
            window.location.href = `/patient/video-call/waiting?requestId=${data.id}`;
        } else {
            alert('Insufficient wallet balance. Please add money to your wallet.');
        }
    } catch (error) {
        console.error('Error sending video call request:', error);
        alert('Failed to send video call request. Please try again.');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    ddPatientId = localStorage.getItem('patientId');
    
    loadVideoCallRate();
    checkDoctorStatus();

    // Refresh doctor status every 30 seconds
    setInterval(checkDoctorStatus, 30000);
});

// Make functions globally available
(window as any).openVideoCallModal = openVideoCallModal;
(window as any).closeVideoCallModal = closeVideoCallModal;
(window as any).sendVideoCallRequest = sendVideoCallRequest;
(window as any).DOCTOR_ID = doctorId;

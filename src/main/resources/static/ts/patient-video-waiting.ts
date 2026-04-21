/**
 * Patient Video Waiting Room Script
 * Handles polling for video call request status
 */

interface VideoCallRequestStatus {
    id: number;
    patientId: number;
    doctorId: number;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
    createdAt: string;
    acceptedAt?: string;
}

const requestId = (window as any).REQUEST_ID || null;
const patientId = (window as any).PATIENT_ID || null;
let checkStatusInterval: number | null = null;
let pollCount = 0;
const MAX_POLL_COUNT = 60; // Stop after 60 attempts (about 2 minutes)

async function checkRequestStatus(): Promise<void> {
    if (!requestId) {
        console.error('No request ID provided');
        return;
    }

    try {
        const response = await fetch(`/patient/video-call/request/${requestId}/status?t=${Date.now()}`);
        const data: VideoCallRequestStatus = await response.json();

        pollCount++;

        if (data.status === 'ACCEPTED') {
            // Doctor accepted, join the call
            if (checkStatusInterval) {
                clearInterval(checkStatusInterval);
            }
            window.location.href = `/patient/video-call?requestId=${requestId}&patientId=${patientId}`;
        } else if (data.status === 'REJECTED') {
            // Doctor rejected
            if (checkStatusInterval) {
                clearInterval(checkStatusInterval);
            }
            const statusDiv = document.getElementById('callStatus');
            if (statusDiv) {
                statusDiv.innerHTML = `
                    <div class="status-rejected">
                        <i class="fas fa-times-circle"></i>
                        <h3>Call Request Rejected</h3>
                        <p>The doctor has rejected your video call request.</p>
                        <a href="/doctors/${data.doctorId}" class="btn btn-primary">Back to Doctor Profile</a>
                    </div>
                `;
            }
        } else if (pollCount >= MAX_POLL_COUNT) {
            // Timeout
            if (checkStatusInterval) {
                clearInterval(checkStatusInterval);
            }
            const statusDiv = document.getElementById('callStatus');
            if (statusDiv) {
                statusDiv.innerHTML = `
                    <div class="status-timeout">
                        <i class="fas fa-clock"></i>
                        <h3>Request Timeout</h3>
                        <p>The doctor did not respond to your video call request.</p>
                        <a href="/doctors/${data.doctorId}" class="btn btn-primary">Try Again Later</a>
                    </div>
                `;
            }
        } else {
            // Still pending, update status message
            const statusText = document.getElementById('statusText');
            if (statusText) {
                statusText.textContent = `Waiting for doctor to accept... (${pollCount}s)`;
            }
        }
    } catch (error) {
        console.error('Error checking request status:', error);
        pollCount++;
        
        if (pollCount >= MAX_POLL_COUNT) {
            if (checkStatusInterval) {
                clearInterval(checkStatusInterval);
            }
            const statusDiv = document.getElementById('callStatus');
            if (statusDiv) {
                statusDiv.innerHTML = `
                    <div class="status-error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Connection Error</h3>
                        <p>Unable to check call status. Please try again.</p>
                        <button onclick="window.location.reload()" class="btn btn-primary">Retry</button>
                    </div>
                `;
            }
        }
    }
}

function cancelRequest(): void {
    if (!requestId) return;

    fetch(`/api/video-call/request/${requestId}/cancel`, { method: 'POST' })
        .then(() => {
            if (checkStatusInterval) {
                clearInterval(checkStatusInterval);
            }
            window.location.href = '/doctors';
        })
        .catch(error => {
            console.error('Error canceling request:', error);
        });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Start polling immediately
    checkRequestStatus();
    
    // Then poll every 3 seconds
    checkStatusInterval = window.setInterval(checkRequestStatus, 3000);
});

// Make functions globally available
(window as any).cancelRequest = cancelRequest;
(window as any).REQUEST_ID = requestId;
(window as any).PATIENT_ID = patientId;

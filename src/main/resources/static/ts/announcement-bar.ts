/**
 * Announcement Bar Manager
 * Handles loading and rotating announcements from the backend
 */

class AnnouncementManager {
    private announcements: Announcement[] = [];
    private currentIndex: number = 0;
    private rotationInterval: number | null = null;
    private defaultDuration: number = 5000; // 5 seconds
    private isPaused: boolean = false;

    /**
     * Initialize and load announcements
     */
    async init(): Promise<void> {
        try {
            await this.loadAnnouncements();
            if (this.announcements.length > 0) {
                this.showAnnouncement(0);
                this.startRotation();
            }
        } catch (error) {
            console.error('Error loading announcements:', error);
        }
    }

    /**
     * Load announcements from API
     */
    async loadAnnouncements(): Promise<void> {
        try {
            const response = await fetch('/api/announcements/active');
            if (response.ok) {
                this.announcements = await response.json() as Announcement[];
            }
        } catch (error) {
            console.error('Failed to fetch announcements:', error);
        }
    }

    /**
     * Get icon based on announcement type
     */
    private getTypeIcon(type: string): string {
        const icons: Record<string, string> = {
            'info': 'fa-info-circle',
            'success': 'fa-check-circle',
            'warning': 'fa-exclamation-triangle',
            'danger': 'fa-times-circle'
        };
        return icons[type] || icons['info'];
    }

    /**
     * Get icon color based on announcement type
     */
    private getTypeColor(type: string): string {
        const colors: Record<string, string> = {
            'info': '#1E90FF',
            'success': '#00b894',
            'warning': '#f39c12',
            'danger': '#e74c3c'
        };
        return colors[type] || '#1E90FF';
    }

    /**
     * Show announcement at given index
     */
    showAnnouncement(index: number): void {
        if (index >= this.announcements.length) {
            index = 0;
        }

        const announcement = this.announcements[index];
        const announcementBar = document.getElementById('announcementBar');

        if (!announcementBar) return;

        // Update classes for type-based styling (all use dark background now)
        announcementBar.className = 'announcement-bar';
        announcementBar.classList.add(`announcement-${announcement.type}`);

        // Get icon color for this type
        const iconColor = this.getTypeColor(announcement.type);
        const icon = this.getTypeIcon(announcement.type);

        // Update content with colored icon
        announcementBar.innerHTML = `
            <div class="announcement-content">
                <i class="fas ${icon}" style="color: ${iconColor};"></i>
                <span class="announcement-text">${this.escapeHtml(announcement.text)}</span>
                <button class="announcement-close" onclick="announcementManager.closeAnnouncement()" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        this.currentIndex = index;
    }

    /**
     * Escape HTML to prevent XSS
     */
    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Start automatic rotation
     */
    private startRotation(): void {
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
        }

        this.rotationInterval = window.setInterval(() => {
            if (!this.isPaused && this.announcements.length > 1) {
                const nextIndex = (this.currentIndex + 1) % this.announcements.length;
                this.showAnnouncement(nextIndex);
            }
        }, this.getCurrentDuration());
    }

    /**
     * Get current announcement duration
     */
    private getCurrentDuration(): number {
        if (this.announcements[this.currentIndex]) {
            return this.announcements[this.currentIndex].displayDuration || this.defaultDuration;
        }
        return this.defaultDuration;
    }

    /**
     * Pause rotation (on hover)
     */
    pauseRotation(): void {
        this.isPaused = true;
    }

    /**
     * Resume rotation
     */
    resumeRotation(): void {
        this.isPaused = false;
    }

    /**
     * Close/hide announcement bar
     */
    closeAnnouncement(): void {
        const announcementBar = document.getElementById('announcementBar');
        if (announcementBar) {
            announcementBar.classList.add('announcement-hidden');
        }
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
        }
        // Store in session that user closed it
        sessionStorage.setItem('announcementBarClosed', 'true');
    }

    /**
     * Check if user closed the bar in this session
     */
    isClosedByUser(): boolean {
        return sessionStorage.getItem('announcementBarClosed') === 'true';
    }
}

// Create global instance
const announcementManager = new AnnouncementManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const announcementBar = document.getElementById('announcementBar');
    if (announcementBar && !announcementManager.isClosedByUser()) {
        announcementManager.init();

        // Pause on hover
        announcementBar.addEventListener('mouseenter', () => announcementManager.pauseRotation());
        announcementBar.addEventListener('mouseleave', () => announcementManager.resumeRotation());
    }
});

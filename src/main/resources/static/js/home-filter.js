/**
 * Home Page Filter Manager
 * Handles location-based filtering for doctors with specialization dropdown
 */
class HomeFilterManager {
    constructor() {
        this.allDoctors = [];
        this.filteredDoctors = [];
        this.selectedDistrict = null;
        this.specializations = new Set();
        this.init();
    }

    async init() {
        await this.loadDoctors();
        await this.loadOnlineStatus();
        this.setupEventListeners();
    }

    async loadDoctors() {
        try {
            // Get initial doctors from the page
            const doctorCards = document.querySelectorAll('#doctorsGrid .doctor-card');
            this.allDoctors = Array.from(doctorCards).map(card => ({
                id: card.querySelector('.btn-primary').href.split('/').pop(),
                name: card.querySelector('h3')?.textContent || '',
                qualification: card.querySelector('.qualification')?.textContent || '',
                specialization: card.querySelector('.specialization')?.textContent || '',
                experience: card.querySelector('.experience')?.textContent || '',
                fee: card.querySelector('.fee')?.textContent || '',
                image: card.querySelector('img')?.src || '',
                district: card.dataset.district || '',
                element: card
            }));

            console.log('Loaded doctors:', this.allDoctors.length);
        } catch (error) {
            console.error('Error loading doctors:', error);
        }
    }

    async loadOnlineStatus() {
        try {
            const response = await fetch('/api/video-call/online-doctors');
            const onlineDoctors = await response.json();
            
            // Create a map of doctorId -> status
            const statusMap = {};
            onlineDoctors.forEach(doctor => {
                statusMap[doctor.id] = {
                    status: doctor.status,
                    message: doctor.message
                };
            });

            // Update all doctor cards with their status
            document.querySelectorAll('.online-status-badge').forEach(badge => {
                const doctorId = badge.dataset.doctorId;
                const doctorStatus = statusMap[doctorId];

                // Remove all status classes
                badge.classList.remove('status-online', 'status-busy', 'status-offline');

                if (doctorStatus) {
                    // Doctor is online or busy
                    badge.classList.add(`status-${doctorStatus.status.toLowerCase()}`);
                    badge.querySelector('.status-text').textContent = 
                        doctorStatus.status === 'ONLINE' ? 'Available' : 
                        doctorStatus.status === 'BUSY' ? 'Busy' : 'Offline';
                } else {
                    // Doctor is offline (no status record)
                    badge.classList.add('status-offline');
                    badge.querySelector('.status-text').textContent = 'Offline';
                }
            });
        } catch (error) {
            console.error('Error loading online status:', error);
        }
    }

    setupEventListeners() {
        // Location item clicks
        document.querySelectorAll('.location-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const district = item.dataset.district;
                this.selectDistrict(district);
            });
        });
    }

    async selectDistrict(district) {
        // Update active state
        document.querySelectorAll('.location-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.district === district) {
                item.classList.add('active');
            }
        });

        this.selectedDistrict = district;

        try {
            // Fetch doctors for selected district
            const response = await fetch(`/api/home/doctors/by-district?district=${encodeURIComponent(district)}`);
            const doctors = await response.json();

            this.filteredDoctors = doctors;
            this.updateDoctorsGrid(doctors);
            this.updateSpecializationDropdown(doctors);
            this.showLocationInfo(district, doctors.length);

        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    }

    updateDoctorsGrid(doctors) {
        const grid = document.getElementById('doctorsGrid');
        const noDoctors = document.getElementById('noDoctors');

        if (doctors.length === 0) {
            grid.style.display = 'none';
            noDoctors.style.display = 'block';
            return;
        }

        grid.style.display = 'grid';
        noDoctors.style.display = 'none';

        // Clear existing cards
        grid.innerHTML = '';

        // Create doctor cards
        doctors.forEach(doctor => {
            const card = document.createElement('div');
            card.className = 'doctor-card';
            card.dataset.doctorId = doctor.id;
            card.dataset.specialization = doctor.specialization?.name || '';
            card.dataset.district = doctor.district || '';

            card.innerHTML = `
                <div class="doctor-image">
                    <img src="${doctor.image || '/images/doctor-placeholder.png'}"
                         alt="${doctor.name}" onerror="this.src='/images/placeholder.png'">
                    <span class="online-status-badge status-offline" data-doctor-id="${doctor.id}">
                        <span class="status-dot"></span>
                        <span class="status-text">Offline</span>
                    </span>
                </div>
                <div class="doctor-info">
                    <h3>${doctor.name}</h3>
                    <p class="qualification">${doctor.qualification}</p>
                    <p class="specialization">${doctor.specialization?.name || ''}</p>
                    ${doctor.district ? `<p class="location-info"><i class="fas fa-map-marker-alt"></i> ${doctor.district}</p>` : ''}
                    <p class="experience">${doctor.yearsOfExperience} years experience</p>
                    <p class="fee">₹${doctor.consultationFee}</p>
                    <a href="/doctors/${doctor.id}" class="btn btn-primary">View Profile</a>
                </div>
            `;

            grid.appendChild(card);
        });

        // Refresh online status for newly loaded doctors
        this.loadOnlineStatus();
    }

    updateSpecializationDropdown(doctors) {
        const specFilter = document.getElementById('specializationFilter');
        const specSelect = document.getElementById('specializationSelect');

        // Get unique specializations
        const specializations = [...new Set(doctors.map(d => d.specialization?.name).filter(s => s))];

        if (specializations.length > 0) {
            specFilter.style.display = 'flex';
            specSelect.innerHTML = '<option value="">All Specializations</option>';

            specializations.forEach(spec => {
                const option = document.createElement('option');
                option.value = spec;
                option.textContent = spec;
                specSelect.appendChild(option);
            });
        } else {
            specFilter.style.display = 'none';
        }
    }

    showLocationInfo(district, count) {
        const locationInfo = document.getElementById('selectedLocationInfo');
        const locationName = document.getElementById('selectedLocationName');
        const doctorsCount = document.getElementById('doctorsCount');

        locationInfo.style.display = 'flex';
        locationName.textContent = district;
        doctorsCount.textContent = `${count} doctor${count !== 1 ? 's' : ''} found`;
    }

    filterBySpecialization() {
        const specSelect = document.getElementById('specializationSelect');
        const selectedSpec = specSelect.value;
        const grid = document.getElementById('doctorsGrid');

        const cards = grid.querySelectorAll('.doctor-card');
        cards.forEach(card => {
            const spec = card.dataset.specialization;
            if (!selectedSpec || spec === selectedSpec) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    clearFilter() {
        this.selectedDistrict = null;

        // Remove active state
        document.querySelectorAll('.location-item').forEach(item => {
            item.classList.remove('active');
        });

        // Reset to all doctors
        this.filteredDoctors = this.allDoctors;
        this.updateDoctorsGrid(this.allDoctors);

        // Hide location info and specialization filter
        document.getElementById('selectedLocationInfo').style.display = 'none';
        document.getElementById('specializationFilter').style.display = 'none';
    }
}

// Global functions for HTML onclick handlers
function toggleLocationGroup(division) {
    const group = document.getElementById(`${division}-group`);
    const header = group.previousElementSibling;

    if (group.classList.contains('collapsed')) {
        group.classList.remove('collapsed');
        header.classList.remove('collapsed');
    } else {
        group.classList.add('collapsed');
        header.classList.add('collapsed');
    }
}

function selectDistrict(district) {
    if (window.filterManager) {
        window.filterManager.selectDistrict(district);
    }
}

function clearFilter() {
    if (window.filterManager) {
        window.filterManager.clearFilter();
    }
}

function filterBySpecialization() {
    if (window.filterManager) {
        window.filterManager.filterBySpecialization();
    }
}

// Initialize filter manager when page loads
window.addEventListener('DOMContentLoaded', () => {
    window.filterManager = new HomeFilterManager();
});

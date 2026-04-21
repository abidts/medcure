"use strict";
/**
 * Location Manager - Handles browser geolocation and doctor filtering
 */
class LocationManager {
    userLocation = null;
    radius = 10; // Default search radius in km
    init() {
        // Check if geolocation is supported
        if (!navigator.geolocation) {
            this.showLocationDisabled();
            return;
        }
        // Check if user has previously granted permission
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then(result => {
                if (result.state === 'granted') {
                    this.getUserLocation();
                }
                else if (result.state === 'prompt') {
                    this.showLocationPrompt();
                }
                else {
                    this.showLocationDisabled();
                }
            });
        }
        else {
            // Fallback for browsers without permissions API
            this.showLocationPrompt();
        }
    }
    showLocationPrompt() {
        const modal = document.createElement('div');
        modal.id = 'locationModal';
        modal.className = 'location-modal';
        modal.innerHTML = `
            <div class="location-modal-content">
                <div class="location-modal-header">
                    <i class="fas fa-map-marker-alt"></i>
                    <h3>Enable Location Services</h3>
                </div>
                <div class="location-modal-body">
                    <p>Allow access to your location to find doctors near you</p>
                    <ul class="location-benefits">
                        <li><i class="fas fa-check"></i> Find nearest doctors</li>
                        <li><i class="fas fa-check"></i> See distance from your location</li>
                        <li><i class="fas fa-check"></i> Get doctors in your area</li>
                    </ul>
                    <div class="location-actions">
                        <button class="btn btn-primary" onclick="locationManager.enableLocation()">
                            <i class="fas fa-location-arrow"></i> Enable Location
                        </button>
                        <button class="btn btn-secondary" onclick="locationManager.skipLocation()">
                            <i class="fas fa-times"></i> Skip
                        </button>
                    </div>
                    <p class="location-note">
                        <i class="fas fa-lock"></i> Your location is only used to find nearby doctors
                    </p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        // Show modal after 1 second
        setTimeout(() => {
            modal.classList.add('show');
        }, 1000);
    }
    enableLocation() {
        const evt = window.event;
        const loadingBtn = evt?.target;
        loadingBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting location...';
        navigator.geolocation.getCurrentPosition((position) => {
            this.userLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            this.hideLocationModal();
            this.loadNearbyDoctors();
            this.showLocationSuccess();
        }, (error) => {
            loadingBtn.innerHTML = '<i class="fas fa-location-arrow"></i> Enable Location';
            this.handleLocationError(error);
        }, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
        });
    }
    skipLocation() {
        this.hideLocationModal();
        localStorage.setItem('locationSkipped', 'true');
    }
    hideLocationModal() {
        const modal = document.getElementById('locationModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    }
    getUserLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.userLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            this.loadNearbyDoctors();
        }, (error) => {
            this.handleLocationError(error);
        });
    }
    handleLocationError(error) {
        console.error('Location error:', error);
        let message = 'Unable to get your location. ';
        switch (error.code) {
            case error.PERMISSION_DENIED:
                message += 'Please enable location in your browser settings.';
                break;
            case error.POSITION_UNAVAILABLE:
                message += 'Location information is unavailable.';
                break;
            case error.TIMEOUT:
                message += 'Location request timed out.';
                break;
        }
        alert(message);
        this.showLocationDisabled();
    }
    showLocationDisabled() {
        const disabledDiv = document.getElementById('locationDisabled');
        if (disabledDiv) {
            disabledDiv.style.display = 'block';
        }
    }
    showLocationSuccess() {
        const successDiv = document.getElementById('locationSuccess');
        if (successDiv) {
            successDiv.style.display = 'block';
            setTimeout(() => {
                successDiv.style.display = 'none';
            }, 5000);
        }
    }
    async loadNearbyDoctors() {
        if (!this.userLocation)
            return;
        try {
            const response = await fetch(`/api/location/doctors/nearby?lat=${this.userLocation.latitude}&lon=${this.userLocation.longitude}&radius=${this.radius}`);
            const data = await response.json();
            if (data.success) {
                this.displayNearbyDoctors(data.doctors);
                this.updateLocationInfo(data.count);
            }
        }
        catch (error) {
            console.error('Error loading nearby doctors:', error);
        }
    }
    displayNearbyDoctors(doctors) {
        const container = document.getElementById('doctorsGrid');
        if (!container)
            return;
        if (doctors.length === 0) {
            container.innerHTML = `
                <div class="no-doctors">
                    <i class="fas fa-map-marked-alt"></i>
                    <h3>No doctors found nearby</h3>
                    <p>Try increasing the search radius or browse all doctors</p>
                </div>
            `;
            return;
        }
        container.innerHTML = doctors.map(doctor => `
            <div class="doctor-card location-doctor" data-distance="${doctor.distance || 0}">
                <div class="doctor-image">
                    <i class="fas fa-user-md"></i>
                </div>
                <div class="doctor-info">
                    <h3>${doctor.name}</h3>
                    <p class="qualification">${doctor.qualification}</p>
                    <p class="specialization">${doctor.specialization?.name || 'Specialist'}</p>
                    <p class="location-info">
                        <i class="fas fa-map-marker-alt"></i>
                        ${doctor.area || ''}, ${doctor.city || ''}
                    </p>
                    <p class="distance-info">
                        <i class="fas fa-route"></i>
                        ${doctor.distance} km away
                    </p>
                    <p class="fee">₹${doctor.consultationFee || doctor.fee}</p>
                    <a href="/doctors/${doctor.id}" class="btn btn-primary">View Profile</a>
                </div>
            </div>
        `).join('');
    }
    updateLocationInfo(count) {
        const infoDiv = document.getElementById('locationInfo');
        if (infoDiv) {
            infoDiv.innerHTML = `
                <i class="fas fa-check-circle"></i>
                Found ${count} doctor${count !== 1 ? 's' : ''} within ${this.radius} km
                <button class="btn btn-sm btn-outline-primary ms-2" onclick="locationManager.changeRadius()">
                    <i class="fas fa-sliders-h"></i> Change Radius
                </button>
            `;
        }
    }
    changeRadius() {
        const newRadius = prompt('Enter search radius in km (5-50):', this.radius.toString());
        if (newRadius && !isNaN(Number(newRadius))) {
            this.radius = Math.max(5, Math.min(50, parseFloat(newRadius)));
            this.loadNearbyDoctors();
        }
    }
    // Manual location input
    setLocationManually(lat, lon) {
        this.userLocation = { latitude: lat, longitude: lon };
        this.loadNearbyDoctors();
    }
    // Search by city and area
    async searchByLocation() {
        const city = document.getElementById('cityFilter')?.value;
        const area = document.getElementById('areaFilter')?.value;
        const radius = document.getElementById('radiusFilter')?.value || '10';
        if (this.userLocation && (city || area)) {
            // Search by location + filters
            await this.loadNearbyDoctors();
            this.filterDoctorsByArea(city, area);
        }
        else if (city || area) {
            // Search by city/area only (no GPS)
            await this.searchByCityArea(city, area);
        }
        else {
            // Show all doctors
            window.location.href = '/doctors';
        }
    }
    async searchByCityArea(city, area) {
        try {
            let url = '/api/doctors';
            if (city) {
                url = `/api/location/doctors/city/${encodeURIComponent(city)}`;
            }
            const response = await fetch(url);
            const data = await response.json();
            let doctors = data.doctors || [];
            // Filter by area if specified
            if (area) {
                doctors = doctors.filter((d) => d.area && d.area.toLowerCase().includes(area.toLowerCase()));
            }
            this.displaySearchedDoctors(doctors, city, area);
        }
        catch (error) {
            console.error('Error searching by location:', error);
        }
    }
    displaySearchedDoctors(doctors, city, area) {
        const container = document.getElementById('doctorsGrid');
        const countSpan = document.getElementById('searchResultCount');
        if (!container)
            return;
        if (doctors.length === 0) {
            container.innerHTML = `
                <div class="no-doctors">
                    <i class="fas fa-map-marked-alt"></i>
                    <h3>No doctors found</h3>
                    <p>Try adjusting your search filters</p>
                </div>
            `;
            if (countSpan)
                countSpan.textContent = '';
            return;
        }
        container.innerHTML = doctors.map(doctor => `
            <div class="doctor-card location-doctor">
                <div class="doctor-image">
                    <i class="fas fa-user-md"></i>
                </div>
                <div class="doctor-info">
                    <h3>${doctor.name}</h3>
                    <p class="qualification">${doctor.qualification}</p>
                    <p class="specialization">${doctor.specialization?.name || 'Specialist'}</p>
                    <p class="location-info">
                        <i class="fas fa-map-marker-alt"></i>
                        ${doctor.area || ''}${doctor.area && city ? ', ' : ''}${city || ''}
                    </p>
                    <p class="fee">₹${doctor.consultationFee || doctor.fee}</p>
                    <a href="/doctors/${doctor.id}" class="btn btn-primary">View Profile</a>
                </div>
            </div>
        `).join('');
        if (countSpan) {
            countSpan.textContent = `Found ${doctors.length} doctor${doctors.length !== 1 ? 's' : ''}`;
        }
    }
    filterDoctorsByArea(city, area) {
        const doctorCards = document.querySelectorAll('.doctor-card.location-doctor');
        let visibleCount = 0;
        doctorCards.forEach(card => {
            const locationInfo = card.querySelector('.location-info');
            if (!locationInfo)
                return;
            const text = locationInfo.textContent.toLowerCase();
            let show = true;
            if (city && !text.includes(city.toLowerCase())) {
                show = false;
            }
            if (area && !text.includes(area.toLowerCase())) {
                show = false;
            }
            card.style.display = show ? 'block' : 'none';
            if (show)
                visibleCount++;
        });
        const countSpan = document.getElementById('searchResultCount');
        if (countSpan) {
            countSpan.textContent = `Showing ${visibleCount} of ${doctorCards.length} doctors`;
        }
    }
}
// Global function for search
function searchByLocation() {
    if (locationManager) {
        locationManager.searchByLocation();
    }
}
function resetLocationFilter() {
    const cityFilter = document.getElementById('cityFilter');
    const areaFilter = document.getElementById('areaFilter');
    const radiusFilter = document.getElementById('radiusFilter');
    const searchResultCount = document.getElementById('searchResultCount');
    if (cityFilter)
        cityFilter.value = '';
    if (areaFilter)
        areaFilter.value = '';
    if (radiusFilter)
        radiusFilter.value = '10';
    if (searchResultCount)
        searchResultCount.textContent = '';
    window.location.href = '/doctors';
}
// Initialize location manager
const locationManager = new LocationManager();
//# sourceMappingURL=location-manager.js.map
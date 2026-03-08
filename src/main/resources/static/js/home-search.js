/**
 * Home Page Search Manager
 * Handles location and specialization search with dynamic dropdowns
 */
class SearchManager {
    constructor() {
        this.locations = [];
        this.districts = [];
        this.specializations = [];
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
    }

    async loadData() {
        try {
            // Load districts from database
            const districtsResponse = await fetch('/api/location/districts');
            const districtsData = await districtsResponse.json();

            if (districtsData.success) {
                this.districts = districtsData.districts || [];
            }

            // Load locations (cities and areas from doctors)
            const locationsResponse = await fetch('/api/location/cities');
            const locationsData = await locationsResponse.json();

            if (locationsData.success) {
                this.locations = locationsData.cities || [];
            }

            // Load all specializations
            const specResponse = await fetch('/api/specializations');
            const specData = await specResponse.json();
            this.specializations = specData || [];

        } catch (error) {
            console.error('Error loading search data:', error);
        }
    }

    setupEventListeners() {
        // Location search
        const locationInput = document.getElementById('locationSearch');
        const locationDropdown = document.getElementById('locationDropdown');

        if (locationInput && locationDropdown) {
            locationInput.addEventListener('input', (e) => {
                this.filterLocations(e.target.value);
            });

            locationInput.addEventListener('focus', () => {
                this.showAllLocations();
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!locationInput.contains(e.target) && !locationDropdown.contains(e.target)) {
                    locationDropdown.classList.remove('show');
                }
            });
        }

        // Specialization search
        const specInput = document.getElementById('specializationSearch');
        const specDropdown = document.getElementById('specializationDropdown');

        if (specInput && specDropdown) {
            specInput.addEventListener('input', (e) => {
                this.filterSpecializations(e.target.value);
            });

            specInput.addEventListener('focus', () => {
                this.showAllSpecializations();
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!specInput.contains(e.target) && !specDropdown.contains(e.target)) {
                    specDropdown.classList.remove('show');
                }
            });
        }
    }

    showAllLocations() {
        const dropdown = document.getElementById('locationDropdown');
        if (!dropdown) return;

        let html = `
            <div class="dropdown-item use-location" onclick="useMyLocation()">
                <i class="fas fa-crosshairs"></i>
                <span class="item-text">Use my current location</span>
            </div>
        `;

        if (this.districts.length > 0) {
            html += `
                <div class="dropdown-header">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Districts</span>
                </div>
            `;

            this.districts.forEach(district => {
                html += `
                    <div class="dropdown-item" onclick="selectLocation('${district}')">
                        <i class="fas fa-map-marked-alt"></i>
                        <div>
                            <div class="item-text">${district}</div>
                            <div class="item-sub">District</div>
                        </div>
                    </div>
                `;
            });
        }

        if (this.locations.length > 0) {
            html += `
                <div class="dropdown-header">
                    <i class="fas fa-city"></i>
                    <span>Cities</span>
                </div>
            `;

            this.locations.forEach(city => {
                html += `
                    <div class="dropdown-item" onclick="selectLocation('${city}')">
                        <i class="fas fa-city"></i>
                        <div>
                            <div class="item-text">${city}</div>
                            <div class="item-sub">City</div>
                        </div>
                    </div>
                `;
            });
        }

        if (this.districts.length === 0 && this.locations.length === 0) {
            html += `
                <div class="dropdown-item" onclick="selectLocation('')">
                    <i class="fas fa-globe"></i>
                    <span class="item-text">Search in entire region</span>
                </div>
            `;
        }

        dropdown.innerHTML = html;
        dropdown.classList.add('show');
    }

    filterLocations(query) {
        const dropdown = document.getElementById('locationDropdown');
        if (!dropdown) return;

        if (!query.trim()) {
            this.showAllLocations();
            return;
        }

        const filteredDistricts = this.districts.filter(loc =>
            loc.toLowerCase().includes(query.toLowerCase())
        );

        const filteredCities = this.locations.filter(loc =>
            loc.toLowerCase().includes(query.toLowerCase())
        );

        let html = `
            <div class="dropdown-item use-location" onclick="useMyLocation()">
                <i class="fas fa-crosshairs"></i>
                <span class="item-text">Use my current location</span>
            </div>
        `;

        if (filteredDistricts.length > 0) {
            html += `
                <div class="dropdown-header">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Districts</span>
                </div>
            `;

            filteredDistricts.forEach(district => {
                html += `
                    <div class="dropdown-item" onclick="selectLocation('${district}')">
                        <i class="fas fa-map-marked-alt"></i>
                        <div>
                            <div class="item-text">${district}</div>
                            <div class="item-sub">District</div>
                        </div>
                    </div>
                `;
            });
        }

        if (filteredCities.length > 0) {
            html += `
                <div class="dropdown-header">
                    <i class="fas fa-city"></i>
                    <span>Cities</span>
                </div>
            `;

            filteredCities.forEach(city => {
                html += `
                    <div class="dropdown-item" onclick="selectLocation('${city}')">
                        <i class="fas fa-search"></i>
                        <div>
                            <div class="item-text">${city}</div>
                            <div class="item-sub">City</div>
                        </div>
                    </div>
                `;
            });
        }

        if (filteredDistricts.length === 0 && filteredCities.length === 0) {
            html += `
                <div class="dropdown-item" style="cursor: default; color: #999;">
                    <i class="fas fa-info-circle"></i>
                    <span class="item-text">No locations found</span>
                </div>
            `;
        }

        dropdown.innerHTML = html;
        dropdown.classList.add('show');
    }

    showAllSpecializations() {
        const dropdown = document.getElementById('specializationDropdown');
        if (!dropdown) return;

        let html = '';

        if (this.specializations.length > 0) {
            this.specializations.forEach(spec => {
                html += `
                    <div class="dropdown-item" onclick="selectSpecialization('${spec.name}')">
                        <i class="fas fa-stethoscope"></i>
                        <div>
                            <div class="item-text">${spec.name}</div>
                            <div class="item-sub">${spec.description || 'Specialty'}</div>
                        </div>
                        <span class="item-type">Speciality</span>
                    </div>
                `;
            });
        } else {
            html = `
                <div class="dropdown-item" style="cursor: default; color: #999;">
                    <i class="fas fa-info-circle"></i>
                    <span class="item-text">No specializations available</span>
                </div>
            `;
        }

        dropdown.innerHTML = html;
        dropdown.classList.add('show');
    }

    filterSpecializations(query) {
        const dropdown = document.getElementById('specializationDropdown');
        if (!dropdown) return;

        if (!query.trim()) {
            this.showAllSpecializations();
            return;
        }

        const filtered = this.specializations.filter(spec => 
            spec.name.toLowerCase().includes(query.toLowerCase()) ||
            (spec.description && spec.description.toLowerCase().includes(query.toLowerCase()))
        );

        let html = '';

        if (filtered.length > 0) {
            filtered.forEach(spec => {
                html += `
                    <div class="dropdown-item" onclick="selectSpecialization('${spec.name}')">
                        <i class="fas fa-search"></i>
                        <div>
                            <div class="item-text">${spec.name}</div>
                            <div class="item-sub">${spec.description || 'Specialty'}</div>
                        </div>
                        <span class="item-type">Speciality</span>
                    </div>
                `;
            });
        } else {
            // Show as custom search
            html = `
                <div class="dropdown-item" onclick="performSearchWithText('${query}')">
                    <i class="fas fa-search"></i>
                    <div>
                        <div class="item-text">Search for "${query}"</div>
                        <div class="item-sub">Find doctors matching this term</div>
                    </div>
                </div>
            `;
        }

        dropdown.innerHTML = html;
        dropdown.classList.add('show');
    }
}

// Global functions
let searchManager = null;

function selectLocation(location) {
    document.getElementById('locationSearch').value = location;
    document.getElementById('locationDropdown').classList.remove('show');
}

function selectSpecialization(spec) {
    document.getElementById('specializationSearch').value = spec;
    document.getElementById('specializationDropdown').classList.remove('show');
}

function useMyLocation() {
    document.getElementById('locationDropdown').classList.remove('show');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                document.getElementById('locationSearch').value = 'My Current Location';
                document.getElementById('locationSearch').dataset.lat = position.coords.latitude;
                document.getElementById('locationSearch').dataset.lon = position.coords.longitude;
            },
            (error) => {
                alert('Unable to get your location. Please enter manually.');
            }
        );
    }
}

function quickSearch(specialization) {
    document.getElementById('specializationSearch').value = specialization;
    performSearch();
}

function performSearch() {
    const location = document.getElementById('locationSearch').value;
    const specialization = document.getElementById('specializationSearch').value;
    const lat = document.getElementById('locationSearch').dataset.lat;
    const lon = document.getElementById('locationSearch').dataset.lon;

    let url = '/doctors?';
    
    if (lat && lon) {
        // Search by GPS coordinates
        url += `lat=${lat}&lon=${lon}&`;
    } else if (location) {
        // Search by city
        url += `city=${encodeURIComponent(location)}&`;
    }

    if (specialization) {
        // Search by specialization name
        url += `specialization=${encodeURIComponent(specialization)}&`;
    }

    // Navigate to doctors page with filters
    window.location.href = url;
}

function performSearchWithText(text) {
    document.getElementById('specializationSearch').value = text;
    document.getElementById('specializationDropdown').classList.remove('show');
    performSearch();
}

// Initialize search manager when page loads
window.addEventListener('DOMContentLoaded', () => {
    searchManager = new SearchManager();
});

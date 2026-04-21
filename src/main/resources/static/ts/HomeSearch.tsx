import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Stethoscope, Crosshair, Info, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Specialization {
  id: number;
  name: string;
  description: string;
}

const HomeSearch: React.FC = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  
  const [locationQuery, setLocationQuery] = useState('');
  const [specQuery, setSpecQuery] = useState('');
  
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showSpecDropdown, setShowSpecDropdown] = useState(false);
  
  const locationRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
    
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
      if (specRef.current && !specRef.current.contains(event.target as Node)) {
        setShowSpecDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchData = async () => {
    try {
      const dResp = await fetch('/api/home/districts');
      const dData = await dResp.json();
      setDistricts(Array.isArray(dData) ? dData : []);

      const lResp = await fetch('/api/doctors');
      const lData = await lResp.json();
      const docs = Array.isArray(lData) ? lData : [];
      const cities = Array.from(new Set(docs.map((d: any) => d.city).filter((c: any) => !!c))) as string[];
      setLocations(cities);

      const sResp = await fetch('/api/specializations');
      const sData = await sResp.json();
      setSpecializations(Array.isArray(sData) ? sData : []);
    } catch (err) {
      console.error('Search data error:', err);
    }
  };

  const useMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => {
        setLocationQuery('Current Location');
        setShowLocationDropdown(false);
      });
    }
  };

  const handleSearch = () => {
    let url = `/doctors?`;
    if (locationQuery && locationQuery !== 'Current Location') {
      url += `city=${encodeURIComponent(locationQuery)}&`;
    }
    if (specQuery) {
      url += `specialization=${encodeURIComponent(specQuery)}&`;
    }
    navigate(url);
  };

  const filteredLocations = Array.from(new Set([...districts, ...locations])).filter((location) =>
    location.toLowerCase().includes(locationQuery.toLowerCase())
  );

  const filteredSpecs = specializations.filter(s => 
    s.name.toLowerCase().includes(specQuery.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(specQuery.toLowerCase()))
  );

  return (
    <div className="search-shell">
      <div className="search-field-group" ref={locationRef}>
        <div className="search-input-shell">
          <input 
            type="text" 
            placeholder="Search by district or city"
            className="search-input"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            onFocus={() => setShowLocationDropdown(true)}
          />
        </div>
        
        {showLocationDropdown && (
          <div className="search-dropdown">
             <button 
               type="button"
               onClick={useMyLocation}
               className="search-option search-option-primary"
             >
                <Crosshair size={16} className="search-option-icon" />
                <div className="search-option-copy">
                  <strong>Use my current location</strong>
                  <span>Detect your nearest city automatically</span>
                </div>
             </button>
             
             {filteredLocations.length > 0 ? filteredLocations.map((loc, i) => (
               <button 
                 key={i}
                 type="button"
                 onClick={() => { setLocationQuery(loc); setShowLocationDropdown(false); }}
                 className="search-option"
               >
                  <MapPin size={16} className="search-option-icon" />
                  <div className="search-option-copy">
                    <strong>{loc}</strong>
                    <span>Available doctor network in this area</span>
                  </div>
               </button>
             )) : (
               <div className="search-empty-state">
                  <Info size={18} />
                  <p>No matching areas found</p>
               </div>
             )}
          </div>
        )}
      </div>

      <div className="search-divider"></div>

      <div className="search-field-group search-field-wide" ref={specRef}>
        <div className="search-input-shell">
          <input 
            type="text" 
            placeholder="Search speciality or doctor name"
            className="search-input"
            value={specQuery}
            onChange={(e) => setSpecQuery(e.target.value)}
            onFocus={() => setShowSpecDropdown(true)}
          />
        </div>

        {showSpecDropdown && (
          <div className="search-dropdown">
             {filteredSpecs.length > 0 ? filteredSpecs.map((spec, i) => (
               <button 
                 key={i}
                 type="button"
                 onClick={() => { setSpecQuery(spec.name); setShowSpecDropdown(false); }}
                 className="search-option search-option-stack"
               >
                  <div className="search-option-badge">
                     <Stethoscope size={16} className="search-option-icon" />
                  </div>
                  <div className="search-option-copy">
                     <strong>{spec.name}</strong>
                     <span>{spec.description || 'Medical speciality'}</span>
                  </div>
               </button>
             )) : specQuery ? (
               <button 
                 type="button"
                 onClick={handleSearch}
                 className="search-option search-option-primary"
               >
                  <Search size={16} className="search-option-icon" />
                  <div className="search-option-copy">
                     <strong>Search for "{specQuery}"</strong>
                     <span>Look across the full doctor network</span>
                  </div>
               </button>
             ) : (
               <div className="search-empty-state">
                 <Info size={18} />
                 <p>Start typing to browse specialities</p>
               </div>
             )}
          </div>
        )}
      </div>

      <button 
        onClick={handleSearch}
        className="search-submit"
      >
        <span>Find Doctor</span>
      </button>
    </div>
  );
};

export default HomeSearch;

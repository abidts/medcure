import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Stethoscope, Crosshair, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const HomeSearch = () => {
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [locationQuery, setLocationQuery] = useState('');
    const [specQuery, setSpecQuery] = useState('');
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showSpecDropdown, setShowSpecDropdown] = useState(false);
    const locationRef = useRef(null);
    const specRef = useRef(null);
    useEffect(() => {
        fetchData();
        const handleClickOutside = (event) => {
            if (locationRef.current && !locationRef.current.contains(event.target)) {
                setShowLocationDropdown(false);
            }
            if (specRef.current && !specRef.current.contains(event.target)) {
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
            const cities = Array.from(new Set(docs.map((d) => d.city).filter((c) => !!c)));
            setLocations(cities);
            const sResp = await fetch('/api/specializations');
            const sData = await sResp.json();
            setSpecializations(Array.isArray(sData) ? sData : []);
        }
        catch (err) {
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
    const filteredLocations = Array.from(new Set([...districts, ...locations])).filter((location) => location.toLowerCase().includes(locationQuery.toLowerCase()));
    const filteredSpecs = specializations.filter(s => s.name.toLowerCase().includes(specQuery.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(specQuery.toLowerCase())));
    return (_jsxs("div", { className: "search-shell", children: [_jsxs("div", { className: "search-field-group", ref: locationRef, children: [_jsx("div", { className: "search-input-shell", children: _jsx("input", { type: "text", placeholder: "Search by district or city", className: "search-input", value: locationQuery, onChange: (e) => setLocationQuery(e.target.value), onFocus: () => setShowLocationDropdown(true) }) }), showLocationDropdown && (_jsxs("div", { className: "search-dropdown", children: [_jsxs("button", { type: "button", onClick: useMyLocation, className: "search-option search-option-primary", children: [_jsx(Crosshair, { size: 16, className: "search-option-icon" }), _jsxs("div", { className: "search-option-copy", children: [_jsx("strong", { children: "Use my current location" }), _jsx("span", { children: "Detect your nearest city automatically" })] })] }), filteredLocations.length > 0 ? filteredLocations.map((loc, i) => (_jsxs("button", { type: "button", onClick: () => { setLocationQuery(loc); setShowLocationDropdown(false); }, className: "search-option", children: [_jsx(MapPin, { size: 16, className: "search-option-icon" }), _jsxs("div", { className: "search-option-copy", children: [_jsx("strong", { children: loc }), _jsx("span", { children: "Available doctor network in this area" })] })] }, i))) : (_jsxs("div", { className: "search-empty-state", children: [_jsx(Info, { size: 18 }), _jsx("p", { children: "No matching areas found" })] }))] }))] }), _jsx("div", { className: "search-divider" }), _jsxs("div", { className: "search-field-group search-field-wide", ref: specRef, children: [_jsx("div", { className: "search-input-shell", children: _jsx("input", { type: "text", placeholder: "Search speciality or doctor name", className: "search-input", value: specQuery, onChange: (e) => setSpecQuery(e.target.value), onFocus: () => setShowSpecDropdown(true) }) }), showSpecDropdown && (_jsx("div", { className: "search-dropdown", children: filteredSpecs.length > 0 ? filteredSpecs.map((spec, i) => (_jsxs("button", { type: "button", onClick: () => { setSpecQuery(spec.name); setShowSpecDropdown(false); }, className: "search-option search-option-stack", children: [_jsx("div", { className: "search-option-badge", children: _jsx(Stethoscope, { size: 16, className: "search-option-icon" }) }), _jsxs("div", { className: "search-option-copy", children: [_jsx("strong", { children: spec.name }), _jsx("span", { children: spec.description || 'Medical speciality' })] })] }, i))) : specQuery ? (_jsxs("button", { type: "button", onClick: handleSearch, className: "search-option search-option-primary", children: [_jsx(Search, { size: 16, className: "search-option-icon" }), _jsxs("div", { className: "search-option-copy", children: [_jsxs("strong", { children: ["Search for \"", specQuery, "\""] }), _jsx("span", { children: "Look across the full doctor network" })] })] })) : (_jsxs("div", { className: "search-empty-state", children: [_jsx(Info, { size: 18 }), _jsx("p", { children: "Start typing to browse specialities" })] })) }))] }), _jsx("button", { onClick: handleSearch, className: "search-submit", children: _jsx("span", { children: "Find Doctor" }) })] }));
};
export default HomeSearch;
//# sourceMappingURL=HomeSearch.js.map
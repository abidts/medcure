import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Search, UserCircle, Briefcase, IndianRupee, Stethoscope } from 'lucide-react';
const Doctors = () => {
    const [searchParams] = useSearchParams();
    const [allDoctors, setAllDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSpecialization, setSelectedSpecialization] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [specializations, setSpecializations] = useState([]);
    const dropdownRef = useRef(null);
    useEffect(() => {
        fetchDoctors();
        fetchSpecializations();
    }, []);
    const fetchSpecializations = async () => {
        try {
            const resp = await fetch('/api/specializations');
            const data = await resp.json();
            const specs = Array.isArray(data) ? data : [];
            console.log('Fetched specializations:', specs.length, specs);
            setSpecializations(specs);
        }
        catch (err) {
            console.error('Error fetching specializations:', err);
        }
    };
    // Handle filtering
    useEffect(() => {
        let result = [...allDoctors];
        // Filter by selected specialization
        if (selectedSpecialization) {
            result = result.filter(d => d.specialization.name === selectedSpecialization);
        }
        // Filter by search term
        if (searchTerm) {
            result = result.filter(d => d.specialization.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        setFilteredDoctors(result);
    }, [allDoctors, selectedSpecialization, searchTerm]);
    // Handle URL parameters for specialization filtering
    useEffect(() => {
        const specializationParam = searchParams.get('specialization');
        if (specializationParam) {
            setSelectedSpecialization(specializationParam);
            setSearchTerm(specializationParam);
        }
    }, [searchParams]);
    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);
    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/doctors');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const docs = Array.isArray(data) ? data : (data.doctors || []);
            setAllDoctors(docs);
            setFilteredDoctors(docs);
        }
        catch (error) {
            console.error('Error fetching doctors:', error);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "doctors-page page-section bg-slate-50 min-h-screen font-inter", children: [_jsxs("section", { className: "bg-white border-b border-slate-200 py-24 overflow-hidden relative", children: [_jsx("div", { className: "absolute top-0 right-0 p-40 opacity-[0.03] rotate-12 pointer-events-none", children: _jsx(Search, { size: 500, className: "text-blue-600" }) }), _jsxs("div", { className: "container mx-auto px-10 text-center relative z-10", children: [_jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 1 }, className: "mb-6 inline-flex items-center gap-3 px-6 py-2.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100 shadow-sm", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-blue-600 animate-pulse" }), _jsx("span", { className: "text-xs font-black uppercase tracking-widest text-blue-600", children: "Verified Network" })] }), _jsxs(motion.h1, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "text-6xl font-black text-slate-950 mb-8 font-outfit leading-tight tracking-tight max-w-3xl mx-auto", children: ["Find Your ", _jsx("span", { className: "bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent italic", children: "Specialist" })] }), _jsx("p", { className: "text-slate-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed", children: "Browse our network of Kashmir's most qualified healthcare professionals and book your appointment instantly." })] })] }), _jsx("div", { className: "container mx-auto px-10 mb-10", children: _jsxs("div", { className: "bg-white rounded-[32px] border border-slate-100 shadow-xl p-8", children: [_jsxs("div", { className: "flex flex-col lg:flex-row gap-6 items-center", children: [_jsx("div", { className: "flex-1 relative", children: _jsx("input", { type: "text", placeholder: "Search by specialization", className: "w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-200 transition-all", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) }) }), _jsxs("div", { className: "relative lg:w-80", ref: dropdownRef, children: [_jsx("button", { onClick: () => setDropdownOpen(!dropdownOpen), className: "w-full px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-between gap-2", children: _jsx("span", { children: selectedSpecialization || 'Select Specialization' }) }), dropdownOpen && (_jsx("div", { className: "absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50", children: specializations.length > 0 ? (_jsxs(_Fragment, { children: [specializations.slice(0, 5).map((spec) => (_jsxs("button", { onClick: () => {
                                                            setSelectedSpecialization(spec.name);
                                                            setDropdownOpen(false);
                                                            setSearchTerm(spec.name);
                                                        }, className: "w-full px-6 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 border-b border-slate-100", children: [_jsx(Stethoscope, { size: 16, className: "text-blue-600" }), _jsx("span", { className: "text-sm font-medium text-slate-700", children: spec.name })] }, spec.id))), specializations.length > 5 && (_jsxs("div", { className: "border-t border-slate-200", children: [_jsxs("div", { className: "px-6 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider bg-slate-50", children: ["More Specializations (", specializations.length - 5, ")"] }), _jsx("div", { className: "h-32 overflow-y-auto border-b border-slate-100", children: specializations.slice(5).map((spec) => (_jsxs("button", { onClick: () => {
                                                                        setSelectedSpecialization(spec.name);
                                                                        setDropdownOpen(false);
                                                                        setSearchTerm(spec.name);
                                                                    }, className: "w-full px-6 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 border-b border-slate-100", children: [_jsx(Stethoscope, { size: 16, className: "text-blue-600" }), _jsx("span", { className: "text-sm font-medium text-slate-700", children: spec.name })] }, spec.id))) })] })), specializations.length <= 5 && (_jsxs("div", { className: "border-t border-slate-200", children: [_jsxs("div", { className: "px-6 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider bg-slate-50", children: ["All Specializations (Debug: ", specializations.length, " total)"] }), _jsx("div", { className: "h-32 overflow-y-auto border-b border-slate-100", children: specializations.map((spec, index) => (_jsxs("button", { onClick: () => {
                                                                        setSelectedSpecialization(spec.name);
                                                                        setDropdownOpen(false);
                                                                        setSearchTerm(spec.name);
                                                                    }, className: "w-full px-6 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 border-b border-slate-100", children: [_jsx(Stethoscope, { size: 16, className: "text-blue-600" }), _jsx("span", { className: "text-sm font-medium text-slate-700", children: spec.name })] }, spec.id))) })] }))] })) : (_jsx("div", { className: "px-6 py-3 text-slate-400 text-sm", children: "No specializations available" })) }))] })] }), selectedSpecialization && (_jsxs("div", { className: "flex items-center gap-3 mt-4", children: [_jsx("span", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest", children: "Active Filter:" }), _jsxs("span", { className: "bg-green-50 text-green-600 px-3 py-1.5 rounded-lg border border-green-200 text-[10px] font-bold flex items-center gap-2", children: [_jsx(Stethoscope, { size: 10 }), " ", selectedSpecialization] }), _jsx("button", { onClick: () => {
                                        setSelectedSpecialization(null);
                                        setSearchTerm('');
                                    }, className: "text-slate-400 hover:text-slate-600 text-sm", children: "Clear" })] }))] }) }), _jsx("section", { className: "pb-24", children: _jsx("div", { className: "container mx-auto px-6", children: loading ? (_jsxs("div", { className: "text-center py-20", children: [_jsx("div", { className: "w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" }), _jsx("p", { className: "text-slate-500 font-medium", children: "Finding specialists..." })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: filteredDoctors.length > 0 ? filteredDoctors.map((doctor, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.1 }, whileHover: { y: -8 }, className: "bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden group transition-all", children: [_jsxs("div", { className: "h-[200px] relative overflow-hidden bg-slate-100", children: [_jsx("img", { src: doctor.image || '/images/placeholder.svg', alt: doctor.name, className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" }), _jsxs("div", { className: "absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-green-500" }), " Online"] })] }), _jsxs("div", { className: "p-8", children: [_jsx("h3", { className: "text-xl font-bold text-slate-900 mb-1", children: doctor.name }), _jsx("p", { className: "text-blue-600 font-bold text-sm mb-4", children: doctor.specialization.name }), _jsxs("div", { className: "space-y-3 mb-8", children: [_jsxs("div", { className: "flex items-center gap-3 text-slate-500 text-sm", children: [_jsx(Briefcase, { size: 16, className: "text-slate-400" }), _jsxs("span", { children: [doctor.yearsOfExperience, " years experience"] })] }), _jsxs("div", { className: "flex items-center gap-3 text-slate-500 text-sm", children: [_jsx(MapPin, { size: 16, className: "text-slate-400" }), _jsx("span", { className: "truncate", children: doctor.clinicAddress })] }), _jsxs("div", { className: "flex items-center gap-3 text-slate-900 font-bold text-lg pt-2 border-t border-slate-50", children: [_jsx(IndianRupee, { size: 18, className: "text-blue-600" }), doctor.consultationFee, " ", _jsx("span", { className: "text-xs text-slate-400 font-medium uppercase tracking-widest ml-1", children: "Consultation" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx("a", { href: `/doctors/${doctor.id}`, className: "py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-center text-sm hover:bg-slate-100 transition-all", children: "Profile" }), _jsx("a", { href: `/appointments/book/${doctor.id}`, className: "py-3 bg-blue-600 text-white rounded-xl font-bold text-center text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100", children: "Book Now" })] })] })] }, doctor.id))) : (_jsxs("div", { className: "col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200", children: [_jsx(UserCircle, { className: "mx-auto text-slate-200 mb-4", size: 64 }), _jsx("h3", { className: "text-xl font-bold text-slate-400", children: "No doctors found" }), _jsx("p", { className: "text-slate-400 mb-2", children: selectedSpecialization
                                        ? `No ${selectedSpecialization} specialists found`
                                        : 'No doctors found' }), _jsx("p", { className: "text-slate-400 text-sm", children: "Try adjusting your filters or check back later." })] })) })) }) })] }));
};
export default Doctors;
//# sourceMappingURL=Doctors.js.map
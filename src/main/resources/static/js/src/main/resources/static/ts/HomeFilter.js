import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Filter, MapPin, RefreshCcw, Stethoscope } from 'lucide-react';
const HomeFilter = ({ onFilterChange, availableDistricts, availableSpecializations, filterError, selectedDistrict: propSelectedDistrict, selectedSpecialization: propSelectedSpec }) => {
    const [selectedDistrict, setSelectedDistrict] = useState(propSelectedDistrict || null);
    const [selectedSpec, setSelectedSpec] = useState(propSelectedSpec || null);
    const [isExpanded, setIsExpanded] = useState(false);
    // Update local state when props change
    useEffect(() => {
        setSelectedDistrict(propSelectedDistrict || null);
        setSelectedSpec(propSelectedSpec || null);
    }, [propSelectedDistrict, propSelectedSpec]);
    const handleDistrictSelect = (district) => {
        const newVal = selectedDistrict === district ? null : district;
        setSelectedDistrict(newVal);
        onFilterChange({ district: newVal, specialization: selectedSpec });
    };
    const handleSpecSelect = (spec) => {
        const newVal = selectedSpec === spec ? null : spec;
        setSelectedSpec(newVal);
        onFilterChange({ district: selectedDistrict, specialization: newVal });
    };
    const resetFilters = () => {
        setSelectedDistrict(null);
        setSelectedSpec(null);
        onFilterChange({ district: null, specialization: null });
    };
    return (_jsxs("div", { className: "bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden mb-12", children: [_jsxs("div", { className: "p-8 border-b border-slate-50 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center", children: _jsx(Filter, { size: 20 }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-slate-900 leading-none mb-1", children: "Advanced Filters" }), _jsx("p", { className: "text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none", children: "Narrow down your search" })] })] }), _jsxs("button", { onClick: resetFilters, className: "px-6 py-2.5 bg-slate-50 text-slate-500 rounded-xl font-bold text-xs hover:bg-slate-100 hover:text-slate-900 transition-all flex items-center gap-2", children: [_jsx(RefreshCcw, { size: 14 }), " Reset"] })] }), _jsxs("div", { className: "p-10 grid grid-cols-1 md:grid-cols-2 gap-12", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-6", children: [_jsx(MapPin, { size: 16, className: "text-blue-600" }), _jsx("span", { className: "font-bold text-slate-800 text-sm", children: "Select District" })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: availableDistricts.length > 0 ? (availableDistricts.map((district) => (_jsx("button", { onClick: () => handleDistrictSelect(district), className: `px-5 py-2.5 rounded-xl font-bold text-xs transition-all border ${selectedDistrict === district
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100'
                                        : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200'}`, children: district }, district)))) : (_jsx("div", { className: "text-slate-400 text-sm italic col-span-2", children: "No districts available. Please check back later." })) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-6", children: [_jsx(Stethoscope, { size: 16, className: "text-blue-600" }), _jsx("span", { className: "font-bold text-slate-800 text-sm", children: "Specialize In" })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: availableSpecializations.length > 0 ? (availableSpecializations.map((spec) => (_jsx("button", { onClick: () => handleSpecSelect(spec), className: `px-5 py-2.5 rounded-xl font-bold text-xs transition-all border ${selectedSpec === spec
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100'
                                        : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200'}`, children: spec }, spec)))) : (_jsx("div", { className: "text-slate-400 text-sm italic col-span-2", children: "No specializations available. Please check back later." })) })] })] }), filterError && (_jsx("div", { className: "bg-amber-50 px-10 py-4 border-t border-amber-100", children: _jsx("p", { className: "text-amber-600 text-sm", children: filterError }) })), (selectedDistrict || selectedSpec) && (_jsxs("div", { className: "bg-slate-50 px-10 py-4 border-t border-slate-100 flex items-center gap-4", children: [_jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest", children: "Active Filters:" }), selectedDistrict && (_jsxs("span", { className: "bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600 flex items-center gap-2 shadow-sm", children: [_jsx(MapPin, { size: 10 }), " ", selectedDistrict] })), selectedSpec && (_jsxs("span", { className: "bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600 flex items-center gap-2 shadow-sm", children: [_jsx(Stethoscope, { size: 10 }), " ", selectedSpec] }))] }))] }));
};
export default HomeFilter;
//# sourceMappingURL=HomeFilter.js.map
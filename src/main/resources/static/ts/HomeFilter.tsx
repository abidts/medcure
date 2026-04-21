import React, { useState, useEffect } from 'react';
import { Filter, MapPin, Navigation, RefreshCcw, Stethoscope, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HomeFilterProps {
  onFilterChange: (filters: { district: string | null; specialization: string | null }) => void;
  availableDistricts: string[];
  availableSpecializations: string[];
  filterError?: string | null;
  selectedDistrict?: string | null;
  selectedSpecialization?: string | null;
}

const HomeFilter: React.FC<HomeFilterProps> = ({ onFilterChange, availableDistricts, availableSpecializations, filterError, selectedDistrict: propSelectedDistrict, selectedSpecialization: propSelectedSpec }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(propSelectedDistrict || null);
  const [selectedSpec, setSelectedSpec] = useState<string | null>(propSelectedSpec || null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setSelectedDistrict(propSelectedDistrict || null);
    setSelectedSpec(propSelectedSpec || null);
  }, [propSelectedDistrict, propSelectedSpec]);

  const handleDistrictSelect = (district: string) => {
    const newVal = selectedDistrict === district ? null : district;
    setSelectedDistrict(newVal);
    onFilterChange({ district: newVal, specialization: selectedSpec });
  };

  const handleSpecSelect = (spec: string) => {
    const newVal = selectedSpec === spec ? null : spec;
    setSelectedSpec(newVal);
    onFilterChange({ district: selectedDistrict, specialization: newVal });
  };

  const resetFilters = () => {
    setSelectedDistrict(null);
    setSelectedSpec(null);
    onFilterChange({ district: null, specialization: null });
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden mb-12">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
               <Filter size={20} />
            </div>
            <div>
               <h3 className="font-bold text-slate-900 leading-none mb-1">Advanced Filters</h3>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">Narrow down your search</p>
            </div>
         </div>
         <button 
           onClick={resetFilters}
           className="px-6 py-2.5 bg-slate-50 text-slate-500 rounded-xl font-bold text-xs hover:bg-slate-100 hover:text-slate-900 transition-all flex items-center gap-2"
         >
            <RefreshCcw size={14} /> Reset
         </button>
      </div>

      <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
         {/* Districts Filter */}
         <div>
            <div className="flex items-center gap-2 mb-6">
               <MapPin size={16} className="text-blue-600" />
               <span className="font-bold text-slate-800 text-sm">Select District</span>
            </div>
            <div className="flex flex-wrap gap-2">
               {availableDistricts.length > 0 ? (
                 availableDistricts.map((district) => (
                    <button
                      key={district}
                      onClick={() => handleDistrictSelect(district)}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all border ${
                        selectedDistrict === district 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
                          : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200'
                      }`}
                    >
                      {district}
                    </button>
                  ))
                ) : (
                  <div className="text-slate-400 text-sm italic col-span-2">
                    No districts available. Please check back later.
                  </div>
                )}
            </div>
         </div>

         {/* Specializations Filter */}
         <div>
            <div className="flex items-center gap-2 mb-6">
               <Stethoscope size={16} className="text-blue-600" />
               <span className="font-bold text-slate-800 text-sm">Specialize In</span>
            </div>
            <div className="flex flex-wrap gap-2">
               {availableSpecializations.length > 0 ? (
                 availableSpecializations.map((spec) => (
                    <button
                      key={spec}
                      onClick={() => handleSpecSelect(spec)}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all border ${
                        selectedSpec === spec 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
                          : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200'
                      }`}
                    >
                      {spec}
                    </button>
                  ))
                ) : (
                  <div className="text-slate-400 text-sm italic col-span-2">
                    No specializations available. Please check back later.
                  </div>
                )}
            </div>
         </div>
      </div>

      {filterError && (
        <div className="bg-amber-50 px-10 py-4 border-t border-amber-100">
           <p className="text-amber-600 text-sm">{filterError}</p>
        </div>
      )}
      
      {(selectedDistrict || selectedSpec) && (
        <div className="bg-slate-50 px-10 py-4 border-t border-slate-100 flex items-center gap-4">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Filters:</p>
           {selectedDistrict && (
             <span className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600 flex items-center gap-2 shadow-sm">
                <MapPin size={10} /> {selectedDistrict}
             </span>
           )}
           {selectedSpec && (
             <span className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600 flex items-center gap-2 shadow-sm">
                <Stethoscope size={10} /> {selectedSpec}
             </span>
           )}
        </div>
      )}
    </div>
  );
};

export default HomeFilter;

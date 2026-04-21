import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Pill, Calendar, ChevronDown, ChevronUp, Apple, Activity, Clock, ChevronRight, BookOpen, UserCheck } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
const PatientPrescriptions = () => {
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('patientId');
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    useEffect(() => {
        fetchPrescriptions();
    }, [patientId]);
    const fetchPrescriptions = async () => {
        setLoading(true);
        // Simulation
        setTimeout(() => {
            setPrescriptions([
                {
                    id: 1,
                    doctor: { name: 'Dr. Mushtaq Ahmad', specialization: { name: 'Cardiology' } },
                    date: '2024-03-10',
                    diagnosis: 'High Blood Pressure',
                    symptoms: 'Mild dizziness, fatigue',
                    followUpRequired: true,
                    medicines: [
                        { name: 'Amlodipine', dosage: '5mg', frequency: '1-0-0', duration: 30, beforeFood: true, instructions: 'Take in the morning' },
                        { name: 'Atorvastatin', dosage: '10mg', frequency: '0-0-1', duration: 30, beforeFood: false, instructions: 'Take before bed' }
                    ],
                    generalAdvice: 'Reduce salt intake and exercise regularly.',
                    dietaryAdvice: 'Avoid fatty foods and excess caffeine.',
                    lifestyleChanges: 'Stop smoking and manage stress.',
                    followUpDate: '2024-04-10'
                },
                {
                    id: 2,
                    doctor: { name: 'Dr. Sarah Jan', specialization: { name: 'Dermatology' } },
                    date: '2024-01-15',
                    diagnosis: 'Contact Dermatitis',
                    medicines: [
                        { name: 'Desonide Cream', dosage: '0.05%', frequency: 'Twice daily', duration: 14, beforeFood: false, instructions: 'Apply thinly' }
                    ]
                }
            ]);
            setLoading(false);
        }, 1000);
    };
    return (_jsx("div", { className: "min-h-screen bg-slate-50 py-12 px-6 font-inter", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("header", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-slate-900 font-outfit", children: "My Prescriptions" }), _jsx("p", { className: "text-slate-500", children: "Track your medication plans and doctor's advice." })] }), _jsx("div", { className: "flex gap-4", children: _jsx("div", { className: "relative", children: _jsx("input", { type: "text", placeholder: "Search by doctor or drug...", className: "px-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 w-full md:w-64" }) }) })] }), loading ? (_jsx("div", { className: "space-y-6", children: [1, 2].map(i => _jsx("div", { className: "h-48 bg-white rounded-[40px] animate-pulse" }, i)) })) : prescriptions.length > 0 ? (_jsx("div", { className: "space-y-6", children: prescriptions.map((px) => (_jsxs(motion.div, { layout: true, className: "bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-xl", children: [_jsxs("div", { className: "p-8 cursor-pointer group", onClick: () => setExpandedId(expandedId === px.id ? null : px.id), children: [_jsxs("div", { className: "flex flex-wrap justify-between items-start gap-6", children: [_jsxs("div", { className: "flex gap-6 items-center", children: [_jsx("div", { className: "w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shrink-0", children: _jsx(UserCheck, { size: 28 }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors", children: px.doctor.name }), _jsx("p", { className: "text-sm font-bold text-slate-400 uppercase tracking-widest", children: px.doctor.specialization.name })] })] }), _jsxs("div", { className: "flex items-center gap-8", children: [_jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1", children: "Prescribed on" }), _jsx("p", { className: "font-bold text-slate-700", children: new Date(px.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) })] }), _jsx("div", { className: `p-3 rounded-2xl transition-all ${expandedId === px.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`, children: expandedId === px.id ? _jsx(ChevronUp, { size: 20 }) : _jsx(ChevronDown, { size: 20 }) })] })] }), px.diagnosis && (_jsxs("div", { className: "mt-8 flex gap-3 flex-wrap", children: [_jsxs("span", { className: "px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-2", children: [_jsx(Activity, { size: 12, className: "text-blue-500" }), " ", px.diagnosis] }), px.followUpRequired && (_jsxs("span", { className: "px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-xs font-bold flex items-center gap-2", children: [_jsx(Calendar, { size: 12 }), " Follow-up Required"] }))] }))] }), _jsx(AnimatePresence, { children: expandedId === px.id && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, className: "border-t border-slate-50", children: _jsxs("div", { className: "p-10 space-y-12", children: [_jsxs("div", { children: [_jsxs("h4", { className: "text-xs font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2", children: [_jsx(Pill, { size: 14 }), " Medication Plan"] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: px.medicines.map((m, idx) => (_jsxs("div", { className: "p-6 bg-slate-50/50 rounded-3xl border border-slate-100", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsx("p", { className: "font-bold text-slate-900", children: m.name }), _jsx("span", { className: "px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-[10px] font-black", children: m.dosage })] }), _jsxs("div", { className: "flex flex-wrap gap-4 text-xs font-medium text-slate-500", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Clock, { size: 12 }), " ", m.frequency] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Calendar, { size: 12 }), " ", m.duration, " Days"] }), _jsxs("div", { className: `flex items-center gap-1 ${m.beforeFood ? 'text-green-600' : 'text-orange-600'}`, children: [_jsx(BookOpen, { size: 12 }), " ", m.beforeFood ? 'Before Food' : 'After Food'] })] }), m.instructions && (_jsxs("p", { className: "mt-4 text-[11px] text-slate-400 font-medium italic", children: ["\"", m.instructions, "\""] }))] }, idx))) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [px.generalAdvice && (_jsxs("div", { className: "p-8 bg-blue-50/20 rounded-[32px] border border-blue-50", children: [_jsxs("h5", { className: "text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2", children: [_jsx(Activity, { size: 12 }), " General Advice"] }), _jsx("p", { className: "text-sm font-medium text-slate-700 leading-relaxed", children: px.generalAdvice })] })), px.dietaryAdvice && (_jsxs("div", { className: "p-8 bg-purple-50/20 rounded-[32px] border border-purple-50", children: [_jsxs("h5", { className: "text-[10px] font-black text-purple-500 uppercase tracking-widest mb-4 flex items-center gap-2", children: [_jsx(Apple, { size: 12 }), " Dietary Plan"] }), _jsx("p", { className: "text-sm font-medium text-slate-700 leading-relaxed", children: px.dietaryAdvice })] }))] }), px.followUpRequired && (_jsxs("div", { className: "p-8 bg-slate-900 rounded-[32px] flex flex-wrap justify-between items-center gap-6", children: [_jsxs("div", { className: "flex items-center gap-6", children: [_jsx("div", { className: "w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white", children: _jsx(Calendar, { size: 24 }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1", children: "Recommended Follow-up" }), _jsx("p", { className: "text-white font-bold", children: new Date(px.followUpDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) })] })] }), _jsxs(Link, { to: `/appointments/book/${px.id}?doctorId=1`, className: "px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all", children: ["Book Now ", _jsx(ChevronRight, { size: 18 })] })] }))] }) })) })] }, px.id))) })) : (_jsxs("div", { className: "py-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200", children: [_jsx("div", { className: "w-20 h-20 bg-slate-50 flex items-center justify-center rounded-3xl mx-auto mb-6 text-slate-300", children: _jsx(FileText, { size: 40 }) }), _jsx("h3", { className: "text-xl font-bold text-slate-900 mb-2", children: "No prescriptions found" }), _jsx("p", { className: "text-slate-400 max-w-xs mx-auto", children: "Once a doctor issues a prescription, it will appear here." })] }))] }) }));
};
export default PatientPrescriptions;
//# sourceMappingURL=PatientPrescriptions.js.map
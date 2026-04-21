import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, ChevronRight, Search, Filter, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
const AppointmentList = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchAppointments();
    }, []);
    const fetchAppointments = async () => {
        // Simulation
        setTimeout(() => {
            setAppointments([
                { id: 1, patient: { name: 'Aamir Bashir' }, doctor: { name: 'Dr. Mushtaq Ahmad' }, date: '2024-03-24', time: '10:30', type: 'VIDEO', status: 'CONFIRMED', reason: 'Fever & Fatigue' },
                { id: 2, patient: { name: 'Sarah Jan' }, doctor: { name: 'Dr. Sarah Jan' }, date: '2024-03-25', time: '11:00', type: 'CLINIC', status: 'PENDING', reason: 'Skin Rash' },
                { id: 3, patient: { name: 'Imtiyaz Bhat' }, doctor: { name: 'Dr. Mushtaq Ahmad' }, date: '2024-03-26', time: '12:15', type: 'VIDEO', status: 'COMPLETED', reason: 'Follow-up' },
            ]);
            setLoading(false);
        }, 800);
    };
    const getStatusStyle = (status) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'COMPLETED': return 'bg-green-50 text-green-600 border-green-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-[#F8FAFC] py-12 px-6 font-inter", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("header", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-black text-slate-900 font-outfit tracking-tight", children: "Executive Registry" }), _jsx("p", { className: "text-slate-500 font-medium", children: "Managing all patient doctor interactions across the network." })] }), _jsxs("div", { className: "flex gap-4", children: [_jsxs("div", { className: "relative group", children: [_jsx(Search, { size: 18, className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" }), _jsx("input", { type: "text", placeholder: "Search appointments...", className: "pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[20px] text-sm focus:outline-none focus:ring-4 focus:ring-blue-100/50 w-64 shadow-sm" })] }), _jsx("button", { className: "p-4 bg-white text-slate-400 rounded-[20px] border border-slate-100 hover:text-blue-600 transition-all shadow-sm", children: _jsx(Filter, { size: 20 }) })] })] }), loading ? (_jsx("div", { className: "space-y-4", children: [1, 2, 3, 4].map(i => _jsx("div", { className: "h-24 bg-white rounded-[32px] animate-pulse" }, i)) })) : (_jsx("div", { className: "grid grid-cols-1 gap-4", children: appointments.map((app, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.1 }, className: "bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all flex flex-wrap items-center gap-8 group", children: [_jsxs("div", { className: "w-16 h-16 bg-slate-50 text-slate-400 rounded-3xl flex flex-col items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500", children: [_jsx("p", { className: "text-[10px] font-black uppercase leading-none mb-1", children: "MAR" }), _jsx("p", { className: "text-xl font-black leading-none", children: app.date.split('-')[2] })] }), _jsxs("div", { className: "flex-1 min-w-[200px]", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: `w-2 h-2 rounded-full ${app.status === 'CONFIRMED' ? 'bg-blue-500' : app.status === 'PENDING' ? 'bg-amber-500' : 'bg-green-500'}` }), _jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest", children: app.status })] }), _jsxs("h3", { className: "text-lg font-bold text-slate-900 flex items-center gap-2", children: [app.patient.name, " ", _jsx(ChevronRight, { size: 14, className: "text-slate-300" }), " ", app.doctor.name] }), _jsxs("div", { className: "flex items-center gap-4 mt-2", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-xs font-bold text-slate-400", children: [_jsx(Clock, { size: 14, className: "text-blue-500" }), " ", app.time] }), _jsxs("div", { className: "flex items-center gap-1.5 text-xs font-bold text-slate-400", children: [_jsx(Video, { size: 14, className: app.type === 'VIDEO' ? 'text-purple-500' : 'text-slate-300' }), " ", app.type] })] })] }), _jsxs("div", { className: "hidden lg:block w-48", children: [_jsx("p", { className: "text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1", children: "Clinical Reason" }), _jsx("p", { className: "text-xs font-bold text-slate-600 truncate", children: app.reason })] }), _jsxs("div", { className: "flex items-center gap-4", children: [app.type === 'VIDEO' && app.status === 'CONFIRMED' && (_jsx(Link, { to: `/appointments/${app.id}/call`, className: "p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm", children: _jsx(Video, { size: 20 }) })), _jsx("button", { className: "p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm", children: _jsx(MoreVertical, { size: 20 }) })] })] }, app.id))) })), appointments.length === 0 && !loading && (_jsxs("div", { className: "py-32 text-center bg-white rounded-[48px] border border-dashed border-slate-200", children: [_jsx("div", { className: "w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200", children: _jsx(Calendar, { size: 48 }) }), _jsx("h3", { className: "text-2xl font-bold text-slate-900 mb-2", children: "Registry is empty" }), _jsx("p", { className: "text-slate-500", children: "No appointments have been scheduled yet." })] }))] }) }));
};
export default AppointmentList;
//# sourceMappingURL=AppointmentList.js.map
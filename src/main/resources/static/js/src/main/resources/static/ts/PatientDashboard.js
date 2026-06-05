import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar, FileText, Wallet, User, LogOut, CheckCircle2, Clock, Plus, CreditCard, ChevronRight, Video, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from './AuthContext';
import { apiFetch } from './api';
const PatientDashboard = () => {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [walletBalance, setWalletBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [onlineDoctors, setOnlineDoctors] = useState([]);
    const [queuePosition, setQueuePosition] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        setLoading(true);
        const patientId = localStorage.getItem('patientId');
        if (!patientId) {
            window.location.href = '/login';
            return;
        }
        try {
            // Fetch patient profile
            const [patientResp, apptResp] = await Promise.all([
                apiFetch(`/api/patients/${patientId}`),
                apiFetch(`/api/appointments/patient/${patientId}`)
            ]);
            if (patientResp.ok) {
                const patientData = await patientResp.json();
                setPatient(patientData);
            }
            if (apptResp.ok) {
                const apptData = await apptResp.json();
                setAppointments(Array.isArray(apptData) ? apptData : []);
            }
            // Wallet balance (may not exist yet, default to 0)
            try {
                const walletResp = await apiFetch(`/api/patients/${patientId}/wallet`);
                if (walletResp.ok) {
                    const wData = await walletResp.json();
                    setWalletBalance(wData.balance || 0);
                    setTransactions(wData.transactions || []);
                }
            }
            catch {
                // Wallet API not available, use defaults
                setWalletBalance(0);
                setTransactions([]);
            }
        }
        catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
        finally {
            setLoading(false);
        }
    };
    if (loading)
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-slate-50", children: _jsx("div", { className: "w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" }) }));
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 flex font-inter", children: [_jsxs("aside", { className: "w-[280px] bg-slate-900 text-white p-8 flex flex-col h-screen sticky top-0 overflow-y-auto hidden lg:flex", children: [_jsxs("div", { className: "mb-12", children: [_jsx("h1", { className: "text-xl font-black text-blue-400 mb-8", children: "Sehat24x7" }), _jsxs("div", { className: "p-6 bg-slate-800 rounded-3xl border border-slate-700", children: [_jsx("div", { className: "w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-3", children: patient.name[0] }), _jsx("p", { className: "text-xs text-slate-500 font-bold uppercase tracking-widest mb-1", children: "Patient" }), _jsx("h3", { className: "font-bold text-slate-200 truncate", children: patient.name })] })] }), _jsx("nav", { className: "space-y-2 flex-1", children: [
                            { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
                            { id: 'appointments', icon: Calendar, label: 'Appointments' },
                            { id: 'reports', icon: FileText, label: 'Medical Reports' },
                            { id: 'wallet', icon: Wallet, label: 'My Wallet' },
                            { id: 'profile', icon: User, label: 'My Profile' },
                        ].map(item => (_jsxs("button", { onClick: () => setActiveTab(item.id), className: `w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`, children: [_jsx(item.icon, { size: 20 }), " ", item.label] }, item.id))) }), _jsxs("button", { onClick: logout, className: "flex items-center gap-4 px-6 py-4 mt-8 text-red-400 font-bold text-sm hover:bg-red-400/10 rounded-2xl transition-all", children: [_jsx(LogOut, { size: 20 }), " Logout"] })] }), _jsxs("main", { className: "flex-1 p-6 lg:p-12 overflow-x-hidden", children: [_jsxs("header", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-slate-900 font-outfit", children: activeTab === 'dashboard' ? 'Health Overview' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1) }), _jsxs("p", { className: "text-slate-500", children: ["Welcome back, ", patient.name.split(' ')[0], "!"] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-green-500" }), " Online Status: Active"] }), _jsxs("a", { href: "/doctors", className: "px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all", children: [_jsx(Plus, { size: 18 }), " New Appointment"] })] })] }), _jsxs(AnimatePresence, { mode: "wait", children: [activeTab === 'dashboard' && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, className: "space-y-8", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
                                            { label: 'Upcoming', val: appointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED').length.toString(), icon: Clock, bg: '#eff6ff', color: '#2563eb' },
                                            { label: 'Completed', val: appointments.filter(a => a.status === 'COMPLETED').length.toString(), icon: CheckCircle2, bg: '#f0fdf4', color: '#16a34a' },
                                            { label: 'Reports', val: '—', icon: FileText, bg: '#f5f3ff', color: '#7c3aed' },
                                            { label: 'Wallet', val: `₹${walletBalance.toFixed(0)}`, icon: Wallet, bg: '#fff7ed', color: '#ea580c' }
                                        ].map((stat, i) => (_jsxs("div", { className: "bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", style: { background: stat.bg, color: stat.color }, children: _jsx(stat.icon, { size: 24 }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1", children: stat.label }), _jsx("h4", { className: "text-2xl font-black text-slate-800", children: stat.val || '0' })] })] }, i))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8", children: [_jsx("div", { className: "lg:col-span-8", children: _jsxs("div", { className: "bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm min-h-[400px]", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsx("h3", { className: "text-xl font-bold text-slate-900", children: "Recent Appointments" }), _jsxs("button", { onClick: () => setActiveTab('appointments'), className: "text-blue-600 font-bold text-sm hover:underline flex items-center gap-1", children: ["View All ", _jsx(ChevronRight, { size: 14 })] })] }), _jsx("div", { className: "space-y-6", children: appointments.map(apt => (_jsxs("div", { className: "p-6 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-blue-200 transition-all group", children: [_jsxs("div", { className: "flex items-center gap-6", children: [_jsx("div", { className: "w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-[10px] font-black text-blue-600 uppercase", children: "Apr" }), _jsx("p", { className: "text-lg font-black text-slate-800", children: apt.date.split('-')[2] })] }) }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-slate-900 mb-1", children: apt.doctor.name }), _jsxs("div", { className: "flex items-center gap-4 text-xs text-slate-500 font-medium", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { size: 12 }), " ", apt.time] }), _jsx("span", { className: `px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${apt.type === 'VIDEO' ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-600'}`, children: apt.type })] })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: `px-4 py-2 rounded-xl text-xs font-bold ${apt.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`, children: apt.status }), apt.type === 'VIDEO' && apt.status === 'CONFIRMED' && (_jsx("button", { className: "p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-100", children: _jsx(Video, { size: 18 }) }))] })] }, apt.id))) })] }) }), _jsxs("div", { className: "lg:col-span-4 space-y-8", children: [_jsxs("div", { className: "bg-slate-900 p-8 rounded-[40px] text-white overflow-hidden relative shadow-2xl", children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full" }), _jsxs("div", { className: "relative z-10", children: [_jsxs("p", { className: "text-xs text-slate-500 font-bold uppercase tracking-widest mb-6 flex items-center gap-2", children: [_jsx(Wallet, { size: 14, className: "text-blue-500" }), " Wallet Balance"] }), _jsxs("h2", { className: "text-5xl font-black mb-10", children: ["\u20B9", walletBalance.toFixed(2)] }), _jsxs("button", { onClick: () => setActiveTab('wallet'), className: "w-full py-4 bg-white text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-all", children: [_jsx(Plus, { size: 18 }), " Add Credits"] })] })] }), _jsxs("div", { className: "bg-blue-600 p-8 rounded-[40px] text-white shadow-xl shadow-blue-200 group", children: [_jsx("h4", { className: "font-bold text-lg mb-2", children: "Need Help?" }), _jsx("p", { className: "text-blue-100 text-xs mb-8", children: "Our support team is available 24/7 to assist you with your health needs." }), _jsxs("button", { className: "flex items-center gap-3 font-bold group-hover:translate-x-2 transition-transform", children: ["Contact Support ", _jsx(ArrowRight, { size: 18 })] })] })] })] })] }, "dashboard")), activeTab === 'wallet' && (_jsx(motion.div, { initial: { opacity: 0, scale: 0.98 }, animate: { opacity: 1, scale: 1 }, className: "space-y-8", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm", children: [_jsx("h3", { className: "text-xl font-bold mb-8", children: "Transaction History" }), _jsx("div", { className: "space-y-4", children: transactions.map(tx => (_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded-2xl transition-all", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'CREDIT' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`, children: tx.type === 'CREDIT' ? _jsx(Plus, { size: 20 }) : _jsx(Minus, { size: 20 }) }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-slate-900 text-sm", children: tx.description }), _jsx("p", { className: "text-[10px] text-slate-400 font-medium uppercase", children: tx.date })] })] }), _jsxs("p", { className: `font-black text-lg ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-slate-800'}`, children: [tx.type === 'CREDIT' ? '+' : '-', "\u20B9", tx.amount] })] }, tx.id))) })] }), _jsxs("div", { className: "bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm", children: [_jsx("h3", { className: "text-xl font-bold mb-8", children: "Add Money" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-6", children: [_jsx(CreditCard, { size: 32, className: "text-slate-400" }), _jsx("input", { type: "number", placeholder: "Enter amount (\u20B9)", className: "bg-transparent text-2xl font-black text-slate-800 w-full focus:outline-none placeholder:font-medium placeholder:text-slate-300" })] }), _jsx("div", { className: "grid grid-cols-4 gap-4", children: [100, 200, 500, 1000].map(amt => (_jsxs("button", { className: "py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all", children: ["\u20B9", amt] }, amt))) }), _jsx("button", { className: "w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all", children: "Proceed to Checkout" })] })] })] }) }, "wallet")), activeTab === 'profile' && (_jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, className: "bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm max-w-4xl mx-auto", children: [_jsxs("div", { className: "flex flex-col md:flex-row gap-12 items-center mb-12", children: [_jsx("div", { className: "w-32 h-32 bg-blue-600 rounded-[32px] flex items-center justify-center text-white font-bold text-4xl shadow-xl shadow-blue-100", children: patient.name[0] }), _jsxs("div", { className: "text-center md:text-left", children: [_jsx("h2", { className: "text-3xl font-bold text-slate-900 mb-2 font-outfit", children: patient.name }), _jsx("p", { className: "text-slate-500 font-medium", children: "Primary Account Holder" })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-12", children: [
                                            { label: 'Full Name', val: patient.name, icon: User },
                                            { label: 'Email', val: patient.email, icon: Mail },
                                            { label: 'Phone', val: patient.phone, icon: Phone },
                                            { label: 'Age/Gender', val: `${patient.age} Yrs / ${patient.gender}`, icon: Calendar },
                                            { label: 'Blood Group', val: patient.bloodGroup, icon: Droplets },
                                            { label: 'Address', val: patient.address, icon: MapPin },
                                        ].map((info, i) => (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: info.label }), _jsxs("div", { className: "flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl", children: [_jsx(info.icon, { size: 16, className: "text-blue-500" }), _jsx("span", { className: "font-bold text-slate-700", children: info.val })] })] }, i))) }), _jsx("button", { className: "w-full py-5 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200", children: "Edit Profile Details" })] }, "profile"))] })] }), _jsx("nav", { className: "fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 px-6 py-4 flex justify-around lg:hidden z-[100] shadow-2xl", children: [
                    { id: 'dashboard', icon: LayoutDashboard },
                    { id: 'appointments', icon: Calendar },
                    { id: 'wallet', icon: Wallet },
                    { id: 'profile', icon: User },
                ].map(item => (_jsx("button", { onClick: () => setActiveTab(item.id), className: `p-3 rounded-2xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400'}`, children: _jsx(item.icon, { size: 24 }) }, item.id))) })] }));
};
// Helper Icons not in main imports
const Minus = ({ size, className }) => _jsx("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", className: className, children: _jsx("path", { d: "M5 12h14" }) });
const ArrowRight = ({ size, className }) => _jsx("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", className: className, children: _jsx("path", { d: "M5 12h14M12 5l7 7-7 7" }) });
const Droplets = ({ size, className }) => _jsx("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", className: className, children: _jsx("path", { d: "m7 7 3-3 3 3m-3-3v12" }) });
export default PatientDashboard;
//# sourceMappingURL=PatientDashboard.js.map
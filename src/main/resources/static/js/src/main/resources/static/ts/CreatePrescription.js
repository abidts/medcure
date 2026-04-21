import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Trash2, Save, Pill, Activity, Clock, ChevronLeft, Info, CheckCircle, Apple, Heart, User, Calendar, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
const CreatePrescription = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const appointmentId = searchParams.get('appointmentId');
    const doctorId = searchParams.get('doctorId');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [appointment, setAppointment] = useState(null);
    const [formData, setFormData] = useState({
        diagnosis: '',
        symptoms: '',
        generalAdvice: '',
        dietaryAdvice: '',
        lifestyleChanges: '',
        followUpInstructions: '',
        followUpDays: ''
    });
    const [medicines, setMedicines] = useState([
        { id: 1, name: '', dosage: '', frequency: '', duration: '', beforeFood: true, instructions: '' }
    ]);
    useEffect(() => {
        if (appointmentId)
            fetchAppointment();
    }, [appointmentId]);
    const fetchAppointment = async () => {
        // Simulation
        setAppointment({
            id: appointmentId,
            patient: { name: 'Aamir Bashir', age: 28, gender: 'Male' },
            doctor: { name: 'Dr. Mushtaq Ahmad' },
            date: '2024-03-24',
            time: '10:30'
        });
    };
    const addMedicine = () => {
        setMedicines([...medicines, {
                id: Date.now(), name: '', dosage: '', frequency: '', duration: '', beforeFood: true, instructions: ''
            }]);
    };
    const removeMedicine = (id) => {
        if (medicines.length > 1) {
            setMedicines(medicines.filter(m => m.id !== id));
        }
    };
    const updateMedicine = (id, field, value) => {
        setMedicines(medicines.map(m => m.id === id ? { ...m, [field]: value } : m));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const payload = {
            ...formData,
            appointmentId: parseInt(appointmentId || '0'),
            doctorId: parseInt(doctorId || '0'),
            medicines: medicines.map(m => ({
                medicineName: m.name,
                dosage: m.dosage,
                frequency: m.frequency,
                durationDays: parseInt(m.duration),
                beforeFood: m.beforeFood,
                instructions: m.instructions
            }))
        };
        try {
            // Simulation
            setTimeout(() => {
                setLoading(false);
                setSuccess(true);
                setTimeout(() => navigate('/doctor/dashboard'), 3000);
            }, 1500);
        }
        catch (err) {
            setError('Failed to save prescription. Please try again.');
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-slate-50 py-12 px-6 font-inter", children: _jsxs("div", { className: "max-w-5xl mx-auto", children: [_jsxs("header", { className: "flex items-center justify-between mb-12", children: [_jsxs("div", { className: "flex items-center gap-6", children: [_jsx(Link, { to: "/doctor/dashboard", className: "p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-slate-400 hover:text-blue-600", children: _jsx(ChevronLeft, { size: 24 }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-slate-900 font-outfit", children: "Create Prescription" }), _jsx("p", { className: "text-slate-500", children: "Documenting consultation for patient session." })] })] }), success && (_jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, className: "p-4 bg-green-50 text-green-600 rounded-2xl flex items-center gap-3 font-bold border border-green-100 shadow-xl shadow-green-100/20", children: [_jsx(CheckCircle, { size: 20 }), " Saved Successfully"] }))] }), appointment && (_jsxs("div", { className: "bg-slate-900 text-white p-8 rounded-[40px] mb-12 flex flex-wrap gap-12 items-center shadow-2xl", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center", children: _jsx(User, { size: 24, className: "text-blue-400" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1", children: "Patient" }), _jsx("p", { className: "font-bold", children: appointment.patient.name })] })] }), _jsxs("div", { className: "flex items-center gap-4 border-l border-white/10 pl-12", children: [_jsx("div", { className: "w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center", children: _jsx(Calendar, { size: 24, className: "text-blue-400" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1", children: "Session Date" }), _jsx("p", { className: "font-bold", children: new Date(appointment.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) })] })] }), _jsxs("div", { className: "flex items-center gap-4 border-l border-white/10 pl-12", children: [_jsx("div", { className: "w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center", children: _jsx(Activity, { size: 24, className: "text-blue-400" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1", children: "Vitals" }), _jsx("p", { className: "font-bold", children: "Wait recorded at triage" })] })] })] })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-12 pb-24", children: [_jsxs("div", { className: "bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 p-10 opacity-5 pointer-events-none", children: _jsx(FileText, { size: 120 }) }), _jsxs("h3", { className: "text-xl font-bold text-slate-900 mb-8 font-outfit flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center", children: _jsx(Activity, { size: 18 }) }), " Clinical Findings"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "Diagnosis" }), _jsx("textarea", { value: formData.diagnosis, onChange: (e) => setFormData({ ...formData, diagnosis: e.target.value }), placeholder: "Principal diagnosis...", className: "w-full p-6 bg-slate-50 rounded-[32px] border border-slate-100 focus:outline-none focus:border-blue-300 h-32 resize-none" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "Chief Complaints / Symptoms" }), _jsx("textarea", { value: formData.symptoms, onChange: (e) => setFormData({ ...formData, symptoms: e.target.value }), placeholder: "Patient reported symptoms...", className: "w-full p-6 bg-slate-50 rounded-[32px] border border-slate-100 focus:outline-none focus:border-blue-300 h-32 resize-none" })] })] })] }), _jsxs("div", { className: "bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm", children: [_jsxs("div", { className: "flex justify-between items-center mb-10", children: [_jsxs("h3", { className: "text-xl font-bold text-slate-900 font-outfit flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 bg-green-50 text-green-600 rounded-xl flex items-center justify-center", children: _jsx(Pill, { size: 18 }) }), " Medication Plan"] }), _jsxs("button", { type: "button", onClick: addMedicine, className: "px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all", children: [_jsx(Plus, { size: 18 }), " Add Drug"] })] }), _jsx("div", { className: "space-y-4", children: medicines.map((med, index) => (_jsx(motion.div, { layout: true, initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 relative group", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-end", children: [_jsxs("div", { className: "lg:col-span-3 space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "Drug Name" }), _jsx("input", { value: med.name, onChange: (e) => updateMedicine(med.id, 'name', e.target.value), placeholder: "e.g. Paracetamol", className: "w-full p-4 bg-white rounded-2xl border border-slate-100" })] }), _jsxs("div", { className: "lg:col-span-2 space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "Dosage" }), _jsx("input", { value: med.dosage, onChange: (e) => updateMedicine(med.id, 'dosage', e.target.value), placeholder: "e.g. 500mg", className: "w-full p-4 bg-white rounded-2xl border border-slate-100" })] }), _jsxs("div", { className: "lg:col-span-2 space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "Frequency" }), _jsx("input", { value: med.frequency, onChange: (e) => updateMedicine(med.id, 'frequency', e.target.value), placeholder: "1-0-1", className: "w-full p-4 bg-white rounded-2xl border border-slate-100" })] }), _jsxs("div", { className: "lg:col-span-2 space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "Duration (Days)" }), _jsx("input", { type: "number", value: med.duration, onChange: (e) => updateMedicine(med.id, 'duration', e.target.value), className: "w-full p-4 bg-white rounded-2xl border border-slate-100" })] }), _jsxs("div", { className: "lg:col-span-2 space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "Relation House" }), _jsxs("select", { value: med.beforeFood, onChange: (e) => updateMedicine(med.id, 'beforeFood', e.target.value === 'true'), className: "w-full p-4 bg-white rounded-2xl border border-slate-100", children: [_jsx("option", { value: "true", children: "Before Food" }), _jsx("option", { value: "false", children: "After Food" })] })] }), _jsx("div", { className: "lg:col-span-1 flex justify-center", children: _jsx("button", { type: "button", onClick: () => removeMedicine(med.id), className: "p-4 text-slate-300 hover:text-red-500 rounded-2xl hover:bg-red-50 transition-all", children: _jsx(Trash2, { size: 20 }) }) })] }) }, med.id))) })] }), _jsxs("div", { className: "bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm", children: [_jsxs("h3", { className: "text-xl font-bold text-slate-900 mb-8 font-outfit flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center", children: _jsx(Apple, { size: 18 }) }), " Lifestyle & Dietary Advice"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2", children: [_jsx(Heart, { size: 10 }), " Lifestyle Changes"] }), _jsx("textarea", { value: formData.lifestyleChanges, onChange: (e) => setFormData({ ...formData, lifestyleChanges: e.target.value }), className: "w-full p-6 bg-slate-50 rounded-[32px] border border-slate-100 focus:outline-none focus:border-blue-300 h-32 resize-none" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2", children: [_jsx(Apple, { size: 10 }), " Dietary Restriction"] }), _jsx("textarea", { value: formData.dietaryAdvice, onChange: (e) => setFormData({ ...formData, dietaryAdvice: e.target.value }), className: "w-full p-6 bg-slate-50 rounded-[32px] border border-slate-100 focus:outline-none focus:border-blue-300 h-32 resize-none" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2", children: [_jsx(Info, { size: 10 }), " General Advice"] }), _jsx("textarea", { value: formData.generalAdvice, onChange: (e) => setFormData({ ...formData, generalAdvice: e.target.value }), className: "w-full p-6 bg-slate-50 rounded-[32px] border border-slate-100 focus:outline-none focus:border-blue-300 h-32 resize-none" })] })] }), _jsxs("div", { className: "p-8 bg-blue-50/30 rounded-[32px] border border-blue-50 flex items-center gap-12", children: [_jsxs("div", { className: "flex-1 space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "Follow-up Instructions" }), _jsx("input", { value: formData.followUpInstructions, onChange: (e) => setFormData({ ...formData, followUpInstructions: e.target.value }), placeholder: "e.g. Come back if fever persists...", className: "w-full p-4 bg-white rounded-2xl border border-slate-100" })] }), _jsxs("div", { className: "w-48 space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "Days Later" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "number", value: formData.followUpDays, onChange: (e) => setFormData({ ...formData, followUpDays: e.target.value }), className: "w-full p-4 bg-white rounded-2xl border border-slate-100 pr-12" }), _jsx(Clock, { className: "absolute right-4 top-1/2 -translate-y-1/2 text-slate-300", size: 18 })] })] })] })] }), _jsxs("div", { className: "flex justify-end gap-6 h-16", children: [_jsx("button", { type: "button", onClick: () => navigate(-1), className: "px-10 font-bold text-slate-500 hover:text-slate-900 transition-all", children: "Cancel" }), _jsxs("button", { type: "submit", disabled: loading, className: "px-16 bg-blue-600 text-white rounded-3xl font-bold shadow-2xl shadow-blue-100 flex items-center gap-3 hover:bg-blue-700 transition-all disabled:opacity-50", children: [loading ? _jsx(Loader2, { className: "animate-spin" }) : _jsx(Save, { size: 20 }), "Save & Finish Prescription"] })] })] })] }) }));
};
export default CreatePrescription;
//# sourceMappingURL=CreatePrescription.js.map
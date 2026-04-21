import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Calendar, UserCheck, MapPin, Droplets, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
const PatientRegister = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        age: '',
        gender: '',
        bloodGroup: '',
        address: ''
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Create a form-data like object for standard POST if needed, 
            // but since we are in React, we'll use JSON.
            const response = await fetch('/api/patients/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    age: parseInt(formData.age)
                })
            });
            const result = await response.json();
            if (result.success) {
                setSuccess(true);
                setTimeout(() => window.location.href = '/login', 2500);
            }
            else {
                setError(result.message || 'Registration failed.');
            }
        }
        catch (err) {
            setError('Connection error. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 flex items-center justify-center p-6 font-inter", children: [_jsx("div", { className: "absolute top-0 left-0 w-1/3 h-1/2 bg-blue-100 blur-[130px] rounded-full opacity-30" }), _jsx("div", { className: "absolute bottom-0 right-0 w-1/4 h-1/3 bg-purple-100 blur-[110px] rounded-full opacity-30" }), _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "w-full max-w-[900px] bg-white rounded-[48px] shadow-2xl overflow-hidden border border-white flex flex-col md:flex-row relative z-10", children: [_jsxs("div", { className: "md:w-1/3 bg-blue-600 p-12 text-white flex flex-col justify-between", children: [_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-3xl font-black text-white mb-6", children: "Sehat24x7" }), _jsx("h2", { className: "text-3xl font-bold font-outfit leading-tight mt-12", children: "Care that comes to you." }), _jsx("p", { className: "text-blue-100 text-sm leading-relaxed", children: "Create your free account today and experience healthcare redesigned for the modern age." })] }), _jsxs("div", { className: "space-y-4 pt-12", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center font-bold", children: "1" }), _jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-blue-100", children: "Quick Setup" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center font-bold", children: "2" }), _jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-blue-100", children: "Secure Privacy" })] })] })] }), _jsxs("div", { className: "flex-1 p-12 bg-white", children: [success ? (_jsxs("div", { className: "h-full flex flex-col items-center justify-center text-center", children: [_jsx("div", { className: "w-20 h-20 bg-green-100 text-green-600 rounded-[28px] flex items-center justify-center mb-6", children: _jsx(CheckCircle, { size: 40 }) }), _jsx("h3", { className: "text-2xl font-bold text-slate-900 mb-2", children: "Welcome Aboard!" }), _jsx("p", { className: "text-slate-500", children: "Your profile is ready. Redirecting to login..." })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-10", children: [_jsx("h1", { className: "text-3xl font-bold text-slate-900 font-outfit mb-2", children: "Patient Registration" }), _jsx("p", { className: "text-slate-400 text-sm", children: "Join Sehat24x7 for better healthcare management." })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-black text-slate-500 uppercase tracking-widest ml-1", children: "Full Name" }), _jsxs("div", { className: "flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 focus-within:bg-white focus-within:border-blue-300 transition-all", children: [_jsx(User, { size: 18, className: "text-slate-400" }), _jsx("input", { id: "name", type: "text", value: formData.name, onChange: handleChange, placeholder: "Full Name", className: "w-full p-4 bg-transparent focus:outline-none text-slate-800", required: true })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-black text-slate-500 uppercase tracking-widest ml-1", children: "Email" }), _jsxs("div", { className: "flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 focus-within:bg-white focus-within:border-blue-300 transition-all", children: [_jsx(Mail, { size: 18, className: "text-slate-400" }), _jsx("input", { id: "email", type: "email", value: formData.email, onChange: handleChange, placeholder: "your@email.com", className: "w-full p-4 bg-transparent focus:outline-none text-slate-800", required: true })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-black text-slate-500 uppercase tracking-widest ml-1", children: "Password" }), _jsxs("div", { className: "flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 focus-within:bg-white focus-within:border-blue-300 transition-all", children: [_jsx(Lock, { size: 18, className: "text-slate-400" }), _jsx("input", { id: "password", type: "password", value: formData.password, onChange: handleChange, placeholder: "Min 6 characters", className: "w-full p-4 bg-transparent focus:outline-none text-slate-800", required: true, minLength: 6 })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-black text-slate-500 uppercase tracking-widest ml-1", children: "Phone" }), _jsxs("div", { className: "flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 focus-within:bg-white focus-within:border-blue-300 transition-all", children: [_jsx(Phone, { size: 18, className: "text-slate-400" }), _jsx("input", { id: "phone", type: "tel", value: formData.phone, onChange: handleChange, placeholder: "+91 ...", className: "w-full p-4 bg-transparent focus:outline-none text-slate-800", required: true })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-black text-slate-500 uppercase tracking-widest ml-1", children: "Age" }), _jsxs("div", { className: "flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 focus-within:bg-white focus-within:border-blue-300 transition-all", children: [_jsx(Calendar, { size: 18, className: "text-slate-400" }), _jsx("input", { id: "age", type: "number", value: formData.age, onChange: handleChange, placeholder: "e.g. 25", className: "w-full p-4 bg-transparent focus:outline-none text-slate-800", required: true, min: 0, max: 120 })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-black text-slate-500 uppercase tracking-widest ml-1", children: "Gender" }), _jsxs("div", { className: "flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 focus-within:bg-white focus-within:border-blue-300 transition-all text-slate-400", children: [_jsx(UserCheck, { size: 18 }), _jsxs("select", { id: "gender", value: formData.gender, onChange: handleChange, className: "w-full p-4 bg-transparent focus:outline-none text-slate-800", required: true, children: [_jsx("option", { value: "", children: "Select" }), _jsx("option", { value: "Male", children: "Male" }), _jsx("option", { value: "Female", children: "Female" }), _jsx("option", { value: "Other", children: "Other" })] })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-black text-slate-500 uppercase tracking-widest ml-1", children: "Blood Group" }), _jsxs("div", { className: "flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 focus-within:bg-white focus-within:border-blue-300 transition-all text-slate-400", children: [_jsx(Droplets, { size: 18 }), _jsxs("select", { id: "bloodGroup", value: formData.bloodGroup, onChange: handleChange, className: "w-full p-4 bg-transparent focus:outline-none text-slate-800", required: true, children: [_jsx("option", { value: "", children: "Select Blood Group" }), ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => _jsx("option", { value: bg, children: bg }, bg))] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-black text-slate-500 uppercase tracking-widest ml-1", children: "Full Address" }), _jsxs("div", { className: "flex items-start bg-slate-50 border border-slate-100 rounded-2xl px-4 pt-4 focus-within:bg-white focus-within:border-blue-300 transition-all", children: [_jsx(MapPin, { size: 18, className: "text-slate-400 mt-1" }), _jsx("textarea", { id: "address", value: formData.address, onChange: handleChange, placeholder: "Your residential address...", className: "w-full p-4 bg-transparent focus:outline-none text-slate-800 h-[80px] resize-none", required: true })] })] }), error && (_jsxs("div", { className: "p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2 border border-red-100", children: [_jsx(AlertCircle, { size: 16 }), " ", error] })), _jsx("button", { type: "submit", disabled: loading, className: "w-full py-5 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all disabled:opacity-50", children: loading ? _jsx(Loader2, { size: 24, className: "animate-spin" }) : _jsxs(_Fragment, { children: ["Complete Registration ", _jsx(ArrowRight, { size: 20 })] }) })] })] })), _jsxs("div", { className: "mt-8 text-center text-sm text-slate-400", children: ["Already have an account? ", _jsx("a", { href: "/login", className: "text-blue-600 font-bold", children: "Sign In" })] })] })] })] }));
};
export default PatientRegister;
//# sourceMappingURL=PatientRegister.js.map
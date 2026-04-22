import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, UserPlus, LogIn, ChevronRight, UserCog, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from './AuthContext';
const Login = () => {
    const [role, setRole] = useState('doctor');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Different endpoints for different roles
            let endpoint = '/api/auth/login';
            if (role === 'patient') {
                endpoint = '/api/patients/login';
            }
            const resp = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role })
            });
            const data = await resp.json();
            if (data.success) {
                // Handle both patient and user responses
                const user = role === 'patient' ? data.patient : data.user;
                if (!user) {
                    setError('Invalid response from server. Please try again.');
                    return;
                }
                const userRole = role.toUpperCase();
                // Use AuthContext login function
                login({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: userRole
                });
                // Store doctorId for doctor users
                if (userRole === 'DOCTOR' && data.doctorId) {
                    localStorage.setItem('doctorId', data.doctorId);
                }
                // Redirect based on role
                if (userRole === 'PATIENT') {
                    window.location.href = `/patient/dashboard?patientId=${user.id}`;
                }
                else if (userRole === 'DOCTOR') {
                    window.location.href = '/doctor/dashboard';
                }
                else if (userRole === 'STAFF') {
                    window.location.href = '/staff/dashboard';
                }
                else if (userRole === 'ADMIN') {
                    window.location.href = '/admin-panel';
                }
                else {
                    window.location.href = '/';
                }
            }
            else {
                setError(data.message || 'Invalid credentials. Please try again.');
            }
        }
        catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Connection error. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center p-8 bg-slate-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, transition: { duration: 0.6 }, className: "w-full max-w-[480px] bg-white p-12 rounded-[40px] shadow-2xl border border-white", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h1", { className: "text-4xl font-black text-blue-600 mb-8", children: "Sehat24x7" }), _jsx("h2", { className: "text-3xl font-black text-slate-900 font-outfit mb-2", children: "Welcome Back" }), _jsx("p", { className: "text-slate-500 font-medium", children: "Empowering healthcare with technology" })] }), _jsxs("div", { children: [_jsx("div", { className: "flex bg-slate-100 p-1.5 rounded-2xl mb-10", children: [
                                { id: 'doctor', icon: _jsx(UserCircle, { size: 18 }), label: 'Doctor' },
                                { id: 'patient', icon: _jsx(UserPlus, { size: 18 }), label: 'Patient' },
                                { id: 'staff', icon: _jsx(UserPlus, { size: 18 }), label: 'Staff' },
                                { id: 'admin', icon: _jsx(UserCog, { size: 18 }), label: 'Admin' }
                            ].map((item) => (_jsxs("button", { onClick: () => {
                                    console.log('Clicked role:', item.id);
                                    console.log('Current role before:', role);
                                    setRole(item.id);
                                    console.log('Setting role to:', item.id);
                                }, className: `flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${role === item.id ? 'bg-red-700 text-yellow-300 border-4 border-purple-500 transform scale-110' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`, style: role === item.id ? {
                                    backgroundColor: '#ff0000',
                                    color: '#ffff00',
                                    border: '4px solid #800080',
                                    transform: 'scale(1.1)'
                                } : {}, children: [item.icon, " ", item.label] }, item.id))) }), _jsxs("form", { onSubmit: handleLogin, className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2", children: "Email Address" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-6 py-4 bg-slate-50 border border-slate-50 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-700 placeholder:text-slate-300", placeholder: "name@example.com", required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2", children: "Secure Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-6 py-4 bg-slate-50 border border-slate-50 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-700 placeholder:text-slate-300", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true })] }), error && (_jsxs("div", { className: "flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100", children: [_jsx(AlertCircle, { size: 18 }), " ", error] })), _jsxs("button", { type: "submit", disabled: loading, className: "w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 mt-2 flex items-center justify-center gap-3 disabled:opacity-50", children: [loading ? _jsx(Loader2, { size: 20, className: "animate-spin" }) : _jsx(LogIn, { size: 20 }), loading ? 'Signing In...' : 'Access Portal'] })] }), _jsxs("div", { className: "mt-12 pt-10 border-t border-slate-100 text-center", children: [_jsx("p", { className: "text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6", children: "Join the Network" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("a", { href: "/doctor-register", className: "flex items-center justify-center gap-2 py-4 bg-slate-50 text-slate-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100", children: ["Apply as Provider ", _jsx(ChevronRight, { size: 14 })] }), _jsxs("a", { href: "/patients/register", className: "flex items-center justify-center gap-2 py-4 bg-blue-50 text-blue-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all border border-blue-100", children: ["Register Patient ", _jsx(ChevronRight, { size: 14 })] })] })] })] })] }) }));
};
export default Login;
//# sourceMappingURL=Login.js.map
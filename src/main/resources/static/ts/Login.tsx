import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, UserPlus, LogIn, ChevronRight, UserCog, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from './AuthContext';

const Login: React.FC = () => {
  const [role, setRole] = useState<'doctor' | 'patient' | 'staff' | 'admin'>('doctor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
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
        } else if (userRole === 'DOCTOR') {
          window.location.href = '/doctor/dashboard';
        } else if (userRole === 'STAFF') {
          window.location.href = '/staff/dashboard';
        } else if (userRole === 'ADMIN') {
          window.location.href = '/admin-panel';
        } else {
          window.location.href = '/';
        }
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[480px] bg-white p-6 sm:p-8 lg:p-12 rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] shadow-2xl border border-white"
      >
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-600 mb-4 sm:mb-6 lg:mb-8">Sehat24x7</h1>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 font-outfit mb-2">Welcome Back</h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium">Empowering healthcare with technology</p>
        </div>

        <div>
          {/* Role Selector */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 lg:mb-10">
            {[
              { id: 'doctor', icon: <UserCircle size={18} />, label: 'Doctor' },
              { id: 'patient', icon: <UserPlus size={18} />, label: 'Patient' },
              { id: 'staff', icon: <UserPlus size={18} />, label: 'Staff' },
              { id: 'admin', icon: <UserCog size={18} />, label: 'Admin' }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => {
                  console.log('Clicked role:', item.id);
                  console.log('Current role before:', role);
                  setRole(item.id as any);
                  console.log('Setting role to:', item.id);
                }}
                className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3.5 px-1 sm:px-2 rounded-lg sm:rounded-xl font-bold text-[8px] sm:text-[10px] uppercase tracking-widest transition-all ${
                  role === item.id ? 'bg-blue-600 text-white shadow-lg transform scale-105' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                <span className="text-xs sm:text-sm">{item.icon}</span>
                <span className="hidden xs:block sm:block">{item.label}</span>
                <span className="block xs:hidden sm:hidden text-[8px]">{item.label.slice(0, 3)}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border border-slate-50 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-700 placeholder:text-slate-300 text-sm sm:text-base"
                placeholder="name@example.com" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Secure Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border border-slate-50 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-700 placeholder:text-slate-300 text-sm sm:text-base"
                placeholder="••••••••" 
                required 
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-red-50 text-red-600 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold border border-red-100">
                <AlertCircle size={16} className="sm:size-18" /> <span className="break-words">{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-3 sm:py-4 lg:py-5 bg-blue-600 text-white rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-[0.1em] sm:tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg sm:shadow-xl shadow-blue-100 mt-2 flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50">
              {loading ? <Loader2 size={16} className="sm:size-20 animate-spin" /> : <LogIn size={16} className="sm:size-20" />}
              <span className="text-xs sm:text-sm">{loading ? 'Signing In...' : 'Access Portal'}</span>
            </button>
          </form>

          <div className="mt-8 sm:mt-12 pt-6 sm:pt-10 border-t border-slate-100 text-center">
             <p className="text-[8px] sm:text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4 sm:mb-6">Join the Network</p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
               <a href="/doctor-register" className="flex items-center justify-center gap-2 py-3 sm:py-4 bg-slate-50 text-slate-600 rounded-lg sm:rounded-xl font-bold text-[8px] sm:text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100">
                 <span className="text-xs sm:text-sm"><ChevronRight size={12} className="sm:size-14" /></span>
                 <span>Apply as Provider</span>
               </a>
               <a href="/patients/register" className="flex items-center justify-center gap-2 py-3 sm:py-4 bg-blue-50 text-blue-600 rounded-lg sm:rounded-xl font-bold text-[8px] sm:text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all border border-blue-100">
                 <span className="text-xs sm:text-sm"><ChevronRight size={12} className="sm:size-14" /></span>
                 <span>Register Patient</span>
               </a>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

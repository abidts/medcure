import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Lock, Phone, Calendar, UserCheck, 
  MapPin, Droplets, ArrowRight, CheckCircle, AlertCircle, Loader2
} from 'lucide-react';

const PatientRegister: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      } else {
        setError(result.message || 'Registration failed.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-inter">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-blue-100 blur-[130px] rounded-full opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-1/4 h-1/3 bg-purple-100 blur-[110px] rounded-full opacity-30"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[900px] bg-white rounded-[48px] shadow-2xl overflow-hidden border border-white flex flex-col md:flex-row relative z-10"
      >
        {/* Left Side - Visuals */}
        <div className="md:w-1/3 bg-blue-600 p-12 text-white flex flex-col justify-between">
           <div className="space-y-6">
              <h1 className="text-3xl font-black text-white mb-6">Sehat24x7</h1>
              <h2 className="text-3xl font-bold font-outfit leading-tight mt-12">Care that comes to you.</h2>
              <p className="text-blue-100 text-sm leading-relaxed">
                 Create your free account today and experience healthcare redesigned for the modern age.
              </p>
           </div>
           
           <div className="space-y-4 pt-12">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center font-bold">1</div>
                 <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Quick Setup</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center font-bold">2</div>
                 <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Secure Privacy</span>
              </div>
           </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-12 bg-white">
          {success ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
               <div className="w-20 h-20 bg-green-100 text-green-600 rounded-[28px] flex items-center justify-center mb-6">
                  <CheckCircle size={40} />
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-2">Welcome Aboard!</h3>
               <p className="text-slate-500">Your profile is ready. Redirecting to login...</p>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 font-outfit mb-2">Patient Registration</h1>
                <p className="text-slate-400 text-sm">Join Sehat24x7 for better healthcare management.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 focus-within:bg-white focus-within:border-blue-300 transition-all">
                       <User size={18} className="text-slate-400" />
                       <input id="name" type="text" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full p-4 bg-transparent focus:outline-none text-slate-800" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
                    <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 focus-within:bg-white focus-within:border-blue-300 transition-all">
                       <Mail size={18} className="text-slate-400" />
                       <input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" className="w-full p-4 bg-transparent focus:outline-none text-slate-800" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                    <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 focus-within:bg-white focus-within:border-blue-300 transition-all">
                       <Lock size={18} className="text-slate-400" />
                       <input id="password" type="password" value={formData.password} onChange={handleChange} placeholder="Min 6 characters" className="w-full p-4 bg-transparent focus:outline-none text-slate-800" required minLength={6} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Phone</label>
                    <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 focus-within:bg-white focus-within:border-blue-300 transition-all">
                       <Phone size={18} className="text-slate-400" />
                       <input id="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+91 ..." className="w-full p-4 bg-transparent focus:outline-none text-slate-800" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Age</label>
                    <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 focus-within:bg-white focus-within:border-blue-300 transition-all">
                       <Calendar size={18} className="text-slate-400" />
                       <input id="age" type="number" value={formData.age} onChange={handleChange} placeholder="e.g. 25" className="w-full p-4 bg-transparent focus:outline-none text-slate-800" required min={0} max={120} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Gender</label>
                    <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 focus-within:bg-white focus-within:border-blue-300 transition-all text-slate-400">
                       <UserCheck size={18} />
                       <select id="gender" value={formData.gender} onChange={handleChange} className="w-full p-4 bg-transparent focus:outline-none text-slate-800" required>
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                       </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Blood Group</label>
                   <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 focus-within:bg-white focus-within:border-blue-300 transition-all text-slate-400">
                      <Droplets size={18} />
                      <select id="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full p-4 bg-transparent focus:outline-none text-slate-800" required>
                         <option value="">Select Blood Group</option>
                         {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                      </select>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Full Address</label>
                   <div className="flex items-start bg-slate-50 border border-slate-100 rounded-2xl px-4 pt-4 focus-within:bg-white focus-within:border-blue-300 transition-all">
                      <MapPin size={18} className="text-slate-400 mt-1" />
                      <textarea id="address" value={formData.address} onChange={handleChange} placeholder="Your residential address..." className="w-full p-4 bg-transparent focus:outline-none text-slate-800 h-[80px] resize-none" required />
                   </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2 border border-red-100">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}

                <button type="submit" disabled={loading} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all disabled:opacity-50">
                  {loading ? <Loader2 size={24} className="animate-spin" /> : <>Complete Registration <ArrowRight size={20} /></>}
                </button>
              </form>
            </>
          )}

          <div className="mt-8 text-center text-sm text-slate-400">
             Already have an account? <a href="/login" className="text-blue-600 font-bold">Sign In</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientRegister;

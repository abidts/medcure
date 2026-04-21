import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Stethoscope, Mail, Phone, Lock, GraduationCap, Briefcase, 
  MapPin, IndianRupee, ChevronRight, CheckCircle, AlertCircle, Loader2
} from 'lucide-react';

const DoctorRegister: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [specializations, setSpecializations] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    qualification: '',
    yearsOfExperience: '',
    experience: '',
    specializationId: '',
    consultationFee: '',
    clinicAddress: '',
    district: '',
    state: 'Jammu and Kashmir'
  });

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    try {
      const response = await fetch('/api/specializations');
      const data = await response.json();
      setSpecializations(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/doctor/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          yearsOfExperience: parseInt(formData.yearsOfExperience),
          specializationId: parseInt(formData.specializationId),
          consultationFee: parseFloat(formData.consultationFee)
        })
      });

      const result = await response.json();
      if (result.success) {
        setSuccess(true);
        setTimeout(() => window.location.href = '/login', 2500);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-inter">
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-blue-100 blur-[120px] rounded-full opacity-30"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[1000px] bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 grid grid-cols-1 lg:grid-cols-12 relative z-10"
      >
        {/* Left Sidebar - Branding/Status */}
        <div className="lg:col-span-4 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent"></div>
           
           <div className="relative z-10">
              <h1 className="text-3xl font-black text-blue-400 mb-12">Sehat24x7</h1>
              <h2 className="text-3xl font-bold font-outfit mb-4">Join our expert Network.</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-12">
                 Be part of Kashmir's largest digital healthcare ecosystem and reach thousands of patients instantly.
              </p>

              <div className="space-y-8">
                {[
                  { step: 1, label: 'Personal Details' },
                  { step: 2, label: 'Professional Profile' },
                  { step: 3, label: 'Clinic Information' }
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                      step >= item.step ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-700 text-slate-500'
                    }`}>
                      {item.step}
                    </div>
                    <span className={`font-bold text-xs uppercase tracking-widest ${step >= item.step ? 'text-white' : 'text-slate-600'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
           </div>

           <div className="relative z-10 pt-12 border-t border-slate-800">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-2">
                 <CheckCircle size={16} /> Verified Platform
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-loose">
                 Your data is protected by enterprise-grade encryption and privacy controls.
              </p>
           </div>
        </div>

        {/* Right - Form Content */}
        <div className="lg:col-span-8 p-12 bg-white">
          {success ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
               <div className="w-24 h-24 bg-green-100 text-green-600 rounded-[32px] flex items-center justify-center mb-8">
                  <CheckCircle size={48} />
               </div>
               <h3 className="text-3xl font-bold text-slate-900 mb-4 font-outfit">Registration Successful!</h3>
               <p className="text-slate-500 max-w-sm mx-auto">Welcome to the family. We're redirecting you to the login screen now...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                    <h3 className="text-2xl font-bold text-slate-900 font-outfit">Personal Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                       <input id="name" type="text" value={formData.name} onChange={handleChange} placeholder="Dr. John Doe" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all" required />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                       <input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="doctor@example.com" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all" required />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                       <input id="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+91 ..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all" required />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Choose Password</label>
                       <input id="password" type="password" value={formData.password} onChange={handleChange} placeholder="Min 6 characters" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all" required minLength={6} />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                    <h3 className="text-2xl font-bold text-slate-900 font-outfit">Professional Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Qualification</label>
                       <input id="qualification" type="text" value={formData.qualification} onChange={handleChange} placeholder="MBBS, MD ..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all" required />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Experience (Years)</label>
                       <input id="yearsOfExperience" type="number" value={formData.yearsOfExperience} onChange={handleChange} placeholder="e.g. 10" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all" required />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Specialization</label>
                       <select id="specializationId" value={formData.specializationId} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all" required>
                          <option value="">Select Category</option>
                          {specializations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Consultation Fee (₹)</label>
                       <input id="consultationFee" type="number" value={formData.consultationFee} onChange={handleChange} placeholder="e.g. 500" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700 ml-1">Professional Bio</label>
                     <textarea id="experience" value={formData.experience} onChange={handleChange} placeholder="Tell us about your medical journey..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all h-[100px]"></textarea>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                    <h3 className="text-2xl font-bold text-slate-900 font-outfit">Clinic Information</h3>
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700 ml-1">Clinic Address</label>
                     <textarea id="clinicAddress" value={formData.clinicAddress} onChange={handleChange} placeholder="Complete address of your clinic/hospital..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all h-[80px]" required></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">District</label>
                       <input id="district" type="text" value={formData.district} onChange={handleChange} placeholder="e.g. Srinagar" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all" required />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">State</label>
                       <input id="state" type="text" value={formData.state} readOnly className="w-full p-4 bg-slate-200 border-none rounded-2xl text-slate-500 font-semibold" />
                    </div>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-100">
                   <AlertCircle size={18} /> {error}
                </motion.div>
              )}

              <div className="flex justify-between items-center pt-8 border-t border-slate-50">
                 {step > 1 ? (
                   <button type="button" onClick={() => setStep(step - 1)} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Previous</button>
                 ) : (
                   <div />
                 )}

                 {step < 3 ? (
                   <button type="button" onClick={() => setStep(step + 1)} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-100">
                     Next Step <ChevronRight size={18} />
                   </button>
                 ) : (
                   <button type="submit" disabled={loading} className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-100 disabled:opacity-50">
                     {loading ? <Loader2 size={18} className="animate-spin" /> : 'Register Now'}
                   </button>
                 )}
              </div>
            </form>
          )}

          <div className="mt-12 text-center">
             <p className="text-slate-400 text-sm">Already a member? <a href="/login" className="text-blue-600 font-bold hover:underline">Sign In</a></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorRegister;

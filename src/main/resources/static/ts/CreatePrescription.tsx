import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Plus, Trash2, Save, X, 
  Pill, Activity, Clock, AlertCircle, ChevronLeft,
  Info, CheckCircle, Apple, Heart, User, Calendar, Loader2
} from 'lucide-react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

const CreatePrescription: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  const doctorId = searchParams.get('doctorId');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<any>(null);

  const [formData, setFormData] = useState({
    diagnosis: '',
    symptoms: '',
    generalAdvice: '',
    dietaryAdvice: '',
    lifestyleChanges: '',
    followUpInstructions: '',
    followUpDays: ''
  });

  const [medicines, setMedicines] = useState<any[]>([
    { id: 1, name: '', dosage: '', frequency: '', duration: '', beforeFood: true, instructions: '' }
  ]);

  useEffect(() => {
    if (appointmentId) fetchAppointment();
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

  const removeMedicine = (id: number) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter(m => m.id !== id));
    }
  };

  const updateMedicine = (id: number, field: string, value: any) => {
    setMedicines(medicines.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err) {
      setError('Failed to save prescription. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 font-inter">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-12">
           <div className="flex items-center gap-6">
              <Link to="/doctor/dashboard" className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-slate-400 hover:text-blue-600">
                 <ChevronLeft size={24} />
              </Link>
              <div>
                 <h1 className="text-3xl font-bold text-slate-900 font-outfit">Create Prescription</h1>
                 <p className="text-slate-500">Documenting consultation for patient session.</p>
              </div>
           </div>
           {success && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-green-50 text-green-600 rounded-2xl flex items-center gap-3 font-bold border border-green-100 shadow-xl shadow-green-100/20">
                 <CheckCircle size={20} /> Saved Successfully
              </motion.div>
           )}
        </header>

        {appointment && (
           <div className="bg-slate-900 text-white p-8 rounded-[40px] mb-12 flex flex-wrap gap-12 items-center shadow-2xl">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center"><User size={24} className="text-blue-400" /></div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Patient</p>
                    <p className="font-bold">{appointment.patient.name}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 border-l border-white/10 pl-12">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center"><Calendar size={24} className="text-blue-400" /></div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Session Date</p>
                    <p className="font-bold">{new Date(appointment.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 border-l border-white/10 pl-12">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center"><Activity size={24} className="text-blue-400" /></div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Vitals</p>
                    <p className="font-bold">Wait recorded at triage</p>
                 </div>
              </div>
           </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12 pb-24">
           {/* Section 1: Clinical Notes */}
           <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><FileText size={120} /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-8 font-outfit flex items-center gap-3">
                 <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Activity size={18} /></div> Clinical Findings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Diagnosis</label>
                    <textarea 
                      value={formData.diagnosis} 
                      onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                      placeholder="Principal diagnosis..." 
                      className="w-full p-6 bg-slate-50 rounded-[32px] border border-slate-100 focus:outline-none focus:border-blue-300 h-32 resize-none" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chief Complaints / Symptoms</label>
                    <textarea 
                      value={formData.symptoms} 
                      onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                      placeholder="Patient reported symptoms..." 
                      className="w-full p-6 bg-slate-50 rounded-[32px] border border-slate-100 focus:outline-none focus:border-blue-300 h-32 resize-none" 
                    />
                 </div>
              </div>
           </div>

           {/* Section 2: Medication */}
           <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xl font-bold text-slate-900 font-outfit flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-50 text-green-600 rounded-xl flex items-center justify-center"><Pill size={18} /></div> Medication Plan
                 </h3>
                 <button type="button" onClick={addMedicine} className="px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all">
                    <Plus size={18} /> Add Drug
                 </button>
              </div>

              <div className="space-y-4">
                 {medicines.map((med, index) => (
                    <motion.div 
                      key={med.id} 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 relative group"
                    >
                       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                          <div className="lg:col-span-3 space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Drug Name</label>
                             <input value={med.name} onChange={(e) => updateMedicine(med.id, 'name', e.target.value)} placeholder="e.g. Paracetamol" className="w-full p-4 bg-white rounded-2xl border border-slate-100" />
                          </div>
                          <div className="lg:col-span-2 space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dosage</label>
                             <input value={med.dosage} onChange={(e) => updateMedicine(med.id, 'dosage', e.target.value)} placeholder="e.g. 500mg" className="w-full p-4 bg-white rounded-2xl border border-slate-100" />
                          </div>
                          <div className="lg:col-span-2 space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Frequency</label>
                             <input value={med.frequency} onChange={(e) => updateMedicine(med.id, 'frequency', e.target.value)} placeholder="1-0-1" className="w-full p-4 bg-white rounded-2xl border border-slate-100" />
                          </div>
                          <div className="lg:col-span-2 space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration (Days)</label>
                             <input type="number" value={med.duration} onChange={(e) => updateMedicine(med.id, 'duration', e.target.value)} className="w-full p-4 bg-white rounded-2xl border border-slate-100" />
                          </div>
                          <div className="lg:col-span-2 space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Relation House</label>
                             <select value={med.beforeFood} onChange={(e) => updateMedicine(med.id, 'beforeFood', e.target.value === 'true')} className="w-full p-4 bg-white rounded-2xl border border-slate-100">
                                <option value="true">Before Food</option>
                                <option value="false">After Food</option>
                             </select>
                          </div>
                          <div className="lg:col-span-1 flex justify-center">
                             <button type="button" onClick={() => removeMedicine(med.id)} className="p-4 text-slate-300 hover:text-red-500 rounded-2xl hover:bg-red-50 transition-all">
                                <Trash2 size={20} />
                             </button>
                          </div>
                       </div>
                    </motion.div>
                 ))}
              </div>
           </div>

           {/* Section 3: Advice & Follow up */}
           <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-8 font-outfit flex items-center gap-3">
                 <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><Apple size={18} /></div> Lifestyle & Dietary Advice
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Heart size={10}/> Lifestyle Changes</label>
                    <textarea 
                      value={formData.lifestyleChanges} 
                      onChange={(e) => setFormData({...formData, lifestyleChanges: e.target.value})}
                      className="w-full p-6 bg-slate-50 rounded-[32px] border border-slate-100 focus:outline-none focus:border-blue-300 h-32 resize-none" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Apple size={10}/> Dietary Restriction</label>
                    <textarea 
                      value={formData.dietaryAdvice} 
                      onChange={(e) => setFormData({...formData, dietaryAdvice: e.target.value})}
                      className="w-full p-6 bg-slate-50 rounded-[32px] border border-slate-100 focus:outline-none focus:border-blue-300 h-32 resize-none" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Info size={10}/> General Advice</label>
                    <textarea 
                      value={formData.generalAdvice} 
                      onChange={(e) => setFormData({...formData, generalAdvice: e.target.value})}
                      className="w-full p-6 bg-slate-50 rounded-[32px] border border-slate-100 focus:outline-none focus:border-blue-300 h-32 resize-none" 
                    />
                 </div>
              </div>

              <div className="p-8 bg-blue-50/30 rounded-[32px] border border-blue-50 flex items-center gap-12">
                 <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Follow-up Instructions</label>
                    <input 
                      value={formData.followUpInstructions} 
                      onChange={(e) => setFormData({...formData, followUpInstructions: e.target.value})}
                      placeholder="e.g. Come back if fever persists..." 
                      className="w-full p-4 bg-white rounded-2xl border border-slate-100" 
                    />
                 </div>
                 <div className="w-48 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Days Later</label>
                    <div className="relative">
                       <input 
                         type="number" 
                         value={formData.followUpDays} 
                         onChange={(e) => setFormData({...formData, followUpDays: e.target.value})}
                         className="w-full p-4 bg-white rounded-2xl border border-slate-100 pr-12" 
                       />
                       <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex justify-end gap-6 h-16">
              <button type="button" onClick={() => navigate(-1)} className="px-10 font-bold text-slate-500 hover:text-slate-900 transition-all">Cancel</button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-16 bg-blue-600 text-white rounded-3xl font-bold shadow-2xl shadow-blue-100 flex items-center gap-3 hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                 {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />} 
                 Save & Finish Prescription
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePrescription;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, 
  CheckCircle, AlertCircle, ChevronLeft, Loader2, Info
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

const AppointmentForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [doctor, setDoctor] = useState<any>(null);
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: '',
    type: 'CLINIC',
    reason: '',
    patientId: localStorage.getItem('patientId') || ''
  });

  // Support both /appointments/book/:doctorId and legacy ?doctorId=123 links.
  const urlParams = new URLSearchParams(window.location.search);
  const { doctorId: routeDoctorId } = useParams<{ doctorId?: string }>();
  const doctorId = routeDoctorId || urlParams.get('doctorId');

  useEffect(() => {
    if (doctorId) {
      fetchDoctorInfo(doctorId);
    } else {
      setDoctor(null);
      setLoadingDoctor(false);
      setError('Doctor details could not be found from this booking link.');
    }
  }, [doctorId]);

  const fetchDoctorInfo = async (id: string) => {
    setLoadingDoctor(true);
    setError(null);
    try {
      const [docResp, availResp] = await Promise.all([
        fetch(`/api/doctors/${id}`),
        fetch(`/api/doctor/dashboard/availability/${id}`)
      ]);
      if (docResp.ok) {
        const docData = await docResp.json();
        setDoctor(docData.id ? docData : docData.doctor || null);
      } else {
        setDoctor(null);
        setError('Could not load doctor details for this booking page.');
      }
      if (availResp.ok) {
        const availData = await availResp.json();
        setAvailabilities(Array.isArray(availData) ? availData : []);
      }
    } catch (e) {
      console.error('Error fetching doctor info:', e);
      setDoctor(null);
      setError('Could not load doctor details. Please try again.');
    } finally {
      setLoadingDoctor(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setFormData({ ...formData, date });
    if (doctorId) fetchSlots(doctorId, date, formData.type);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setFormData({ ...formData, type });
    if (formData.date && doctorId) fetchSlots(doctorId, formData.date, type);
  };

  const fetchSlots = async (docId: string, date: string, type: string) => {
    setFetchingSlots(true);
    setError(null);
    setSelectedSlot(null);
    try {
      const resp = await fetch(`/api/doctor/dashboard/available-slots/${docId}?date=${date}&type=${type}`);
      if (resp.ok) {
        const data = await resp.json();
        const normalizedSlots = Array.isArray(data)
          ? data
          : Array.isArray(data?.availableSlots)
            ? data.availableSlots
            : [];

        setSlots(
          normalizedSlots.map((slot: any) => ({
            time: slot.time || slot.startTime,
            available: slot.available !== false
          })).filter((slot: any) => Boolean(slot.time))
        );
      } else {
        // Generate generic slots when no API data
        setSlots(['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30'].map(t => ({ time: t, available: true })));
      }
    } catch (e) {
      setSlots([]);
      setError('Could not load time slots. Please try again.');
    } finally {
      setFetchingSlots(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return setError('Please select a time slot.');
    const userRole = localStorage.getItem('userRole');
    const patientId = localStorage.getItem('patientId');
    if (userRole !== 'PATIENT' || !patientId) {
      setError('Please register/login with a patient account first to book an appointment.');
      setTimeout(() => {
        window.location.href = '/patients/register';
      }, 1200);
      return;
    }
    
    setLoading(true);
    try {
      const resp = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: parseInt(patientId),
          doctorId: parseInt(doctorId || '0'),
          date: formData.date,
          time: selectedSlot,
          type: formData.type,
          reason: formData.reason,
          status: 'PENDING'
        })
      });
      if (resp.ok) {
        setSuccess(true);
        const patientId = localStorage.getItem('patientId');
        setTimeout(() => window.location.href = `/patient/dashboard?patientId=${patientId}`, 3000);
      } else {
        const err = await resp.json();
        setError(err.message || 'Booking failed. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingDoctor) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-6 font-inter flex items-center justify-center">
        <div className="page-card p-10 rounded-[32px] text-center">
          <Loader2 size={30} className="animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600 font-semibold">Loading doctor details...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-6 font-inter">
        <div className="max-w-3xl mx-auto">
          <Link to="/doctors" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-8 transition-colors">
             <ChevronLeft size={20} /> Back to Search
          </Link>
          <div className="page-card p-12 rounded-[32px] text-center">
            <AlertCircle size={36} className="mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Doctor details not available</h2>
            <p className="text-slate-500 mb-6">{error || 'This booking link is missing the doctor information.'}</p>
            <Link to="/doctors" className="site-button site-button-primary">
              Browse Doctors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 font-inter">
      <div className="max-w-4xl mx-auto">
        <Link to="/doctors" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-8 transition-colors">
           <ChevronLeft size={20} /> Back to Search
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden"
        >
          {success ? (
            <div className="p-20 text-center">
               <motion.div 
                 initial={{ scale: 0.5, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="w-24 h-24 bg-green-100 text-green-600 rounded-[32px] flex items-center justify-center mx-auto mb-8"
               >
                  <CheckCircle size={48} />
               </motion.div>
               <h2 className="text-3xl font-bold text-slate-900 mb-4 font-outfit">Booking Confirmed!</h2>
               <p className="text-slate-500 mb-10">Your appointment with {doctor.name} has been successfully scheduled. You can track your status in your dashboard.</p>
               <Link to="/patient/dashboard" className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100">Go to Dashboard</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12">
               {/* Left Info Column */}
               <div className="lg:col-span-4 bg-slate-900 p-12 text-white">
                  <div className="mb-12">
                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">Consulting with</p>
                     <h2 className="text-2xl font-bold font-outfit mb-2">{doctor.name}</h2>
                     <p className="text-slate-400 text-sm">{doctor.specialization.name}</p>
                  </div>

                  <div className="space-y-8">
                     <div>
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                           <Clock size={14} className="text-blue-500" /> Standard Hours
                        </h4>
                        <div className="space-y-3">
                           {availabilities.map((av, i) => (
                             <div key={i} className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-300">{av.dayOfWeek}</span>
                                <span className="text-slate-500">{av.startTime} - {av.endTime}</span>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="pt-8 border-t border-slate-800">
                        <p className="text-xs text-slate-500 mb-1">Consultation Fee</p>
                        <p className="text-3xl font-black text-white">₹{doctor.consultationFee}</p>
                     </div>
                  </div>
               </div>

               {/* Right Form Column */}
               <div className="lg:col-span-8 p-12">
                  <h3 className="text-2xl font-bold text-slate-900 mb-8 font-outfit">Appointment Details</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Appointment Date</label>
                           <input 
                             type="date" 
                             className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all" 
                             min={new Date().toISOString().split('T')[0]}
                             value={formData.date}
                             onChange={handleDateChange}
                             required
                           />
                        </div>

                        <div className="space-y-2">
                           <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Consultation Mode</label>
                           <select 
                             className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all"
                             value={formData.type}
                             onChange={handleTypeChange}
                             required
                           >
                              <option value="CLINIC">In-Clinic Visit</option>
                              <option value="VIDEO">Video Consultation</option>
                              <option value="HOME_VISIT">Home Visit</option>
                           </select>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center justify-between">
                           Select Time Slot
                           {fetchingSlots && <Loader2 size={12} className="animate-spin text-blue-600" />}
                        </label>
                        
                        {!formData.date ? (
                          <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-center text-slate-400">
                             <Calendar size={24} className="mx-auto mb-2 opacity-30" />
                             <p className="text-sm font-medium">Please select a date to view available slots</p>
                          </div>
                        ) : slots.length > 0 ? (
                          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                             {slots.map((s, i) => (
                               <button
                                 key={i}
                                 type="button"
                                 disabled={!s.available}
                                 onClick={() => setSelectedSlot(s.time)}
                                 className={`py-3 rounded-xl font-bold text-xs transition-all ${
                                   selectedSlot === s.time 
                                   ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                                   : s.available 
                                      ? 'bg-white border border-slate-100 text-slate-600 hover:border-blue-300' 
                                      : 'bg-slate-50 text-slate-300 cursor-not-allowed border-none'
                                 }`}
                               >
                                  {s.time}
                               </button>
                             ))}
                          </div>
                        ) : (
                          <div className="p-8 bg-orange-50 text-orange-600 rounded-3xl text-center border border-orange-100">
                             <AlertCircle size={24} className="mx-auto mb-2 opacity-50" />
                             <p className="text-sm font-bold">No slots available for this date/mode.</p>
                          </div>
                        )}
                     </div>

                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Reason for consultation</label>
                        <textarea 
                           placeholder="Describe your health concerns..."
                           className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[32px] focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all h-[120px] resize-none"
                           value={formData.reason}
                           onChange={(e) => setFormData({...formData, reason: e.target.value})}
                        />
                     </div>

                     {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-100">
                           <AlertCircle size={18} /> {error}
                        </div>
                     )}

                     <button 
                        type="submit" 
                        disabled={loading || !selectedSlot}
                        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:shadow-none"
                     >
                        {loading ? <Loader2 size={24} className="animate-spin mx-auto" /> : 'Confirm Appointment Now'}
                     </button>

                     <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        <Info size={12} className="inline mr-1" /> Payment will be collected at the venue or prior to video call
                     </p>
                  </form>
               </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AppointmentForm;
